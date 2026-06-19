const fs = require("fs");
const path = require("path");

const reviewPath =
  process.argv[2] || path.join("analysis", "liao_complete_works_review_candidates.tsv");
const plausiblePath =
  process.argv[3] || path.join("analysis", "liao_complete_works_plausible_quotes.tsv");
const keywordPath =
  process.argv[4] || path.join("analysis", "liao_complete_works_keyword_lines_short.tsv");
const knownPath =
  process.argv[5] || path.join("analysis", "liao_complete_works_known_quote_matches.tsv");
const csvPath =
  process.argv[6] || path.join("exports", "李敖全集_诗文格言歌谣引用.csv");
const outPath =
  process.argv[7] || path.join("analysis", "liao_complete_works_proofread_audit.tsv");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;
  const cleanText = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < cleanText.length; index += 1) {
    const char = cleanText[index];
    const next = cleanText[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        value += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value.replace(/\r$/, ""));
    rows.push(row);
  }

  const header = rows.shift().map((name) => name.replace(/^\uFEFF/, ""));
  return rows
    .filter((cells) => cells.some((cell) => cell !== ""))
    .map((cells) => Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""])));
}

function parseTsv(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trimEnd().split(/\r?\n/);
  const header = lines.shift().split("\t");
  return lines
    .filter(Boolean)
    .map((line) => {
      const cells = line.split("\t");
      return Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""]));
    });
}

function normalize(value) {
  return String(value ?? "")
    .replace(/^\uFEFF/, "")
    .replace(/\s+/g, "")
    .replace(/[“”‘’"'「」『』《》〈〉（）()【】\[\]]/g, "")
    .replace(/[，、。！？；：,.!?;:—…·]/g, "")
    .trim();
}

function esc(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " / ");
}

const exportsRows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const exportsByFile = new Map();
for (const row of exportsRows) {
  if (!exportsByFile.has(row.source_file)) exportsByFile.set(row.source_file, []);
  exportsByFile.get(row.source_file).push({ ...row, normalized: normalize(row.quote_text) });
}

function coveredIds(file, line, text) {
  const rows = exportsByFile.get(file) || [];
  const lineNumber = Number(line) || 0;
  const candidate = normalize(text);
  if (candidate.length < 2) return [];
  return rows
    .filter((row) => {
      const start = Number(row.line_start) || 0;
      const end = Number(row.line_end) || start;
      if (lineNumber && (lineNumber < start || lineNumber > end)) return false;
      return row.normalized.includes(candidate) || candidate.includes(row.normalized);
    })
    .map((row) => row.id);
}

function sameLineIds(file, line) {
  const rows = exportsByFile.get(file) || [];
  const lineNumber = Number(line) || 0;
  return rows
    .filter((row) => {
      const start = Number(row.line_start) || 0;
      const end = Number(row.line_end) || start;
      return lineNumber && lineNumber >= start && lineNumber <= end;
    })
    .map((row) => row.id);
}

const selfAuthoredFilePattern = /021\.刁民歌|024\.李诗廿四首|目录/;
const likelyNoisePattern =
  /政府|国民党|民进党|政治|政权|戒严|法律|法令|宪法|法院|学校|学生|教育|台大|出版|宣言|三民主义|共产|社会主义|资本主义|民族主义|法西斯|总统|革命|军队|独裁/;
const strongLiteraryPattern =
  /诗|词|歌|谣|联|对联|名言|名句|格言|成语|俗语|俗话|谚|古语|古话|诗经|论语|孟子|庄子|老子|礼记|史记|汉书|后汉书|西游记|红楼梦|金瓶梅|杜甫|陆游|陶渊明|苏曼殊|梁启超|魏源|易卜生|丘吉尔|圣经/;

function addCandidate(rows, seen, item) {
  const text = String(item.text ?? "").trim();
  if (!text || normalize(text).length < 2) return;
  if (selfAuthoredFilePattern.test(item.file)) return;
  const cover = coveredIds(item.file, item.line, text);
  if (cover.length) return;
  const sameLine = sameLineIds(item.file, item.line);
  const key = `${item.source}\u0000${item.file}\u0000${item.line}\u0000${normalize(text)}`;
  if (seen.has(key)) return;
  seen.add(key);

  const context = String(item.context ?? "");
  const score = Number(item.score) || 0;
  const tag = strongLiteraryPattern.test(`${text} ${context}`)
    ? "literary-check"
    : likelyNoisePattern.test(`${text} ${context}`)
      ? "likely-exclude"
      : "manual-check";
  const priority =
    (item.source === "known" ? 20 : 0) +
    (tag === "literary-check" ? 8 : 0) +
    (sameLine.length ? 2 : 0) +
    score;

  rows.push({
    priority,
    source: item.source,
    score,
    tag,
    file: item.file,
    line: item.line,
    text,
    same_line_export_ids: sameLine.join("|"),
    context,
  });
}

const rows = [];
const seen = new Set();

for (const row of parseTsv(reviewPath)) {
  const score = Number(row.score) || 0;
  if (score < 4) continue;
  addCandidate(rows, seen, { ...row, score, source: "review" });
}

for (const row of parseTsv(plausiblePath)) {
  addCandidate(rows, seen, { ...row, score: 0, source: "plausible" });
}

for (const row of parseTsv(knownPath)) {
  addCandidate(rows, seen, {
    source: "known",
    score: 0,
    file: row.file,
    line: row.line,
    text: row.matched_quote,
    context: row.context,
  });
}

for (const row of parseTsv(keywordPath)) {
  if (selfAuthoredFilePattern.test(row.file)) continue;
  const sameLine = sameLineIds(row.file, row.line);
  if (sameLine.length) continue;
  const context = String(row.context ?? "");
  if (!strongLiteraryPattern.test(context)) continue;
  addCandidate(rows, seen, {
    source: "keyword_line",
    score: 0,
    file: row.file,
    line: row.line,
    text: context,
    context,
  });
}

rows.sort(
  (a, b) =>
    b.priority - a.priority ||
    String(a.file).localeCompare(String(b.file), "zh-Hans-CN") ||
    Number(a.line) - Number(b.line) ||
    String(a.text).localeCompare(String(b.text), "zh-Hans-CN"),
);

const outRows = [
  [
    "priority",
    "source",
    "score",
    "tag",
    "file",
    "line",
    "text",
    "same_line_export_ids",
    "context",
  ].join("\t"),
];
for (const row of rows) {
  outRows.push(
    [
      row.priority,
      row.source,
      row.score,
      row.tag,
      row.file,
      row.line,
      row.text,
      row.same_line_export_ids,
      Array.from(row.context).slice(0, 360).join(""),
    ]
      .map(esc)
      .join("\t"),
  );
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${outRows.join("\n")}\n`, "utf8");

const byTag = rows.reduce((acc, row) => {
  acc[row.tag] = (acc[row.tag] || 0) + 1;
  return acc;
}, {});

console.log(
  JSON.stringify(
    {
      exports: exportsRows.length,
      auditRows: rows.length,
      byTag,
      outPath,
    },
    null,
    2,
  ),
);
