const fs = require("fs");
const path = require("path");

const analysisDir = path.join(process.cwd(), "analysis");
const csvPath = path.join(process.cwd(), "exports", "上下古今谈_诗文格言歌谣引用.csv");

const paths = {
  review: path.join(analysisDir, "liao_shangxia_gujin_review_candidates.tsv"),
  plausible: path.join(analysisDir, "liao_shangxia_gujin_plausible_quotes.tsv"),
  keyword: path.join(analysisDir, "liao_shangxia_gujin_keyword_lines_short.tsv"),
  known: path.join(analysisDir, "liao_shangxia_gujin_known_quote_matches.tsv"),
  highRisk: path.join(analysisDir, "liao_shangxia_gujin_high_risk_noise.tsv"),
};

const strongLiteraryPattern =
  /(诗|词|歌|谣|曲|戏|唱|白|赋|联|对|格言|俗谚|俗语|谚|古话|古语|成语|名句|名言|典故|引文|庄子|老子|孟子|孔子|论语|诗经|礼记|尚书|史记|宋史|三国演义|水浒|兰亭|范仲淹|王羲之|陆游|白居易|苏轼|龚|林则徐|韩非|伏尔泰|泰戈尔|歌德|勃朗宁|王宝钏|关公|赤兔|三击掌|武家坡|大登殿|挑袍)/;
const likelyPoliticalNoisePattern =
  /(政治|政府|国民党|共产党|民进党|总统|宪法|法律|法令|法院|警察|教育厅|省议会|行政|质询|社论|戒严|取缔|流氓|公报|人权|言论自由|民主政治|革命|中共|反共|官员|机关|制度|校长|报纸|专栏|读者来信|主张|外交|主席)/;
const selfOrLocalQuipPattern =
  /(李敖.*(写|说|自拟|自嘲|代拟)|最使我着迷|美人计|未来牌友|文化太保|大奶奶|西餐叉子吃人肉|关公曹操三角恋爱)$/;

function parseDelimited(text, delimiter) {
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
    } else if (char === delimiter) {
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
    .map((cells) =>
      Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""])),
    );
}

function parseCsv(filePath) {
  return parseDelimited(fs.readFileSync(filePath, "utf8"), ",");
}

function parseTsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trimEnd().split(/\r?\n/);
  if (!lines.length || !lines[0]) return [];
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
    .replace(/[“”‘’"'《》（）()【】\[\]「」『』]/g, "")
    .replace(/[，、。！？；：,.!?;:—…·\-]/g, "")
    .trim();
}

function tsvCell(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " / ").trim();
}

const records = parseCsv(csvPath);
const recordsByFile = new Map();
for (const record of records) {
  if (!recordsByFile.has(record.source_file)) recordsByFile.set(record.source_file, []);
  recordsByFile.get(record.source_file).push({ ...record, normalized: normalize(record.quote_text) });
}

function sameLineRecords(file, line) {
  const lineNumber = Number(line);
  return (recordsByFile.get(file) || []).filter((record) => {
    const start = Number(record.line_start);
    const end = Number(record.line_end);
    return lineNumber >= start && lineNumber <= end;
  });
}

function isCovered(file, line, text) {
  const candidate = normalize(text);
  if (candidate.length < 2) return [];
  return sameLineRecords(file, line)
    .filter(
      (record) =>
        record.normalized === candidate ||
        record.normalized.includes(candidate) ||
        candidate.includes(record.normalized),
    )
    .map((record) => record.id);
}

function addAudit(rows, seen, item) {
  const text = String(item.text ?? item.matched_quote ?? item.quote_text ?? "").trim();
  const file = item.file || item.source_file || "";
  const line = item.line || item.line_start || "";
  if (!file || !line || normalize(text).length < 2) return;

  const coveredIds = isCovered(file, line, text);
  if (coveredIds.length) return;

  const context = item.context || item.summary || "";
  const haystack = `${text} ${context}`;
  const sameLineIds = sameLineRecords(file, line).map((record) => record.id);
  const key = `${item.kind}\u0000${file}\u0000${line}\u0000${normalize(text)}`;
  if (seen.has(key)) return;
  seen.add(key);

  const score = Number(item.score || 0);
  const literary = strongLiteraryPattern.test(haystack);
  const political = likelyPoliticalNoisePattern.test(haystack);
  const selfQuip = selfOrLocalQuipPattern.test(haystack);
  let tag = "manual-check";
  if (literary && !selfQuip) tag = "literary-check";
  if (political && !literary) tag = "likely-exclude";
  if (selfQuip && !literary) tag = "local-quip";

  const priority =
    (item.kind === "known_quote_not_exported" ? 25 : 0) +
    (tag === "literary-check" ? 10 : 0) +
    (sameLineIds.length ? 3 : 0) +
    score;

  rows.push({
    priority,
    kind: item.kind,
    score,
    tag,
    file,
    line,
    text,
    same_line_export_ids: sameLineIds.join("|"),
    context,
  });
}

const rows = [];
const seen = new Set();

for (const row of parseTsv(paths.known)) {
  addAudit(rows, seen, {
    kind: "known_quote_not_exported",
    file: row.file,
    line: row.line,
    text: row.matched_quote,
    context: row.context,
  });
}

for (const row of parseTsv(paths.review)) {
  const score = Number(row.score) || 0;
  if (score < 5) continue;
  addAudit(rows, seen, { ...row, kind: "review_candidate_not_exported", score });
}

for (const row of parseTsv(paths.plausible)) {
  addAudit(rows, seen, { ...row, kind: "plausible_candidate_not_exported", score: 0 });
}

for (const row of parseTsv(paths.keyword)) {
  if (sameLineRecords(row.file, row.line).length) continue;
  if (!strongLiteraryPattern.test(row.context || "")) continue;
  addAudit(rows, seen, {
    kind: "keyword_signal_line_uncovered",
    file: row.file,
    line: row.line,
    text: row.context,
    context: row.context,
    score: 0,
  });
}

for (const record of records) {
  const haystack = `${record.quote_text} ${record.category} ${record.source_or_origin} ${record.summary}`;
  const literary = strongLiteraryPattern.test(haystack);
  const political = likelyPoliticalNoisePattern.test(haystack);
  const selfQuip = selfOrLocalQuipPattern.test(haystack);
  const scopeEdgeCategory = /(外国文学语|外国诗人轶语|格言|词句化用|水浒式成语|古话套语|近代文化格言)/.test(
    record.category,
  );
  if (!political && !selfQuip && !scopeEdgeCategory) continue;

  rows.push({
    priority: (political && !literary ? 15 : 0) + (selfQuip ? 12 : 0) + (scopeEdgeCategory ? 2 : 0),
    kind: "export_scope_edge",
    score: "",
    tag: political && !literary ? "possible-remove" : selfQuip ? "local-quip-check" : "scope-edge",
    file: record.source_file,
    line: record.line_start,
    text: record.quote_text,
    same_line_export_ids: record.id,
    context: `${record.category} / ${record.source_or_origin} / ${record.summary}`,
  });
}

rows.sort(
  (a, b) =>
    b.priority - a.priority ||
    String(a.file).localeCompare(String(b.file), "zh-Hans-CN") ||
    Number(a.line) - Number(b.line) ||
    String(a.text).localeCompare(String(b.text), "zh-Hans-CN"),
);

const byTag = new Map();
const byKind = new Map();
for (const row of rows) {
  byTag.set(row.tag, (byTag.get(row.tag) || 0) + 1);
  byKind.set(row.kind, (byKind.get(row.kind) || 0) + 1);
}

const outPath = path.join(analysisDir, "liao_shangxia_gujin_proofread_audit.tsv");
const outRows = [
  ["priority", "kind", "score", "tag", "file", "line", "text", "same_line_export_ids", "context"].join("\t"),
  ...rows.map((row) =>
    [
      row.priority,
      row.kind,
      row.score,
      row.tag,
      row.file,
      row.line,
      row.text,
      row.same_line_export_ids,
      row.context,
    ]
      .map(tsvCell)
      .join("\t"),
  ),
];
fs.writeFileSync(outPath, `\uFEFF${outRows.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      records: records.length,
      auditRows: rows.length,
      byKind: Object.fromEntries(byKind),
      byTag: Object.fromEntries(byTag),
      outPath,
    },
    null,
    2,
  ),
);
