const fs = require("fs");
const path = require("path");

const sourceDecoder = new TextDecoder("gb18030");
const targetRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "001.自传回忆类",
  "004.李敖回忆录",
);
const csvPath = path.join(process.cwd(), "exports", "李敖回忆录_诗文格言歌谣引用.csv");
const candidatesPath = path.join(process.cwd(), "analysis", "liao_memoir_review_candidates.tsv");

const keywordPattern =
  /(诗|词|歌|唱|歌词|曲|联|对联|挽联|俗语|俗话|谚|格言|古训|古语|成语|名句|名言|箴|曰|云|老子|孔子|孟子|庄子|论语|尚书|诗经|史记|苏东坡|苏轼|杜甫|李白|王安石|龚自珍|鲁迅|圣经|约伯|佛|经|王勃|韩愈|庾信|司马迁|易经|易曰|书经|红楼梦|金圣叹|辛弃疾|稼轩|洛克|富兰克林|笛卡儿)/;

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
    .map((cells) =>
      Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""])),
    );
}

function parseTsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split("\t");
  return lines.map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""]));
  });
}

function compact(text) {
  return String(text).replace(/\s+/g, "");
}

function isCoveredByLine(records, file, line) {
  return records.some(
    (record) =>
      record.source_file === file &&
      Number(record.line_start) <= line &&
      Number(record.line_end) >= line,
  );
}

function isCoveredByQuote(records, file, text) {
  const compactText = compact(text);
  return records.some(
    (record) =>
      record.source_file === file &&
      (compactText.includes(compact(record.quote_text)) ||
        compact(record.quote_text).includes(compactText)),
  );
}

function sourceFiles() {
  return fs
    .readdirSync(targetRoot)
    .filter((name) => name.endsWith(".txt"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

const records = parseCsv(fs.readFileSync(csvPath, "utf8"));
const candidates = parseTsv(fs.readFileSync(candidatesPath, "utf8"));

const duplicateQuoteTexts = new Map();
for (const record of records) {
  const key = compact(record.quote_text);
  duplicateQuoteTexts.set(key, [...(duplicateQuoteTexts.get(key) || []), record.id]);
}

const categories = new Map();
const byFile = new Map();
for (const record of records) {
  categories.set(record.category, (categories.get(record.category) || 0) + 1);
  byFile.set(record.source_file, (byFile.get(record.source_file) || 0) + 1);
}

const highUncovered = candidates
  .filter((candidate) => Number(candidate.score) >= 7)
  .filter((candidate) => !isCoveredByLine(records, candidate.file, Number(candidate.line)))
  .filter((candidate) => !isCoveredByQuote(records, candidate.file, candidate.text))
  .map((candidate) => ({
    score: Number(candidate.score),
    file: candidate.file,
    line: Number(candidate.line),
    text: candidate.text,
  }))
  .sort((a, b) => a.file.localeCompare(b.file, "zh-Hans-CN") || a.line - b.line || b.score - a.score);

const keywordUncovered = [];
for (const file of sourceFiles()) {
  const lines = sourceDecoder.decode(fs.readFileSync(path.join(targetRoot, file))).split(/\r?\n/);
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (!keywordPattern.test(line)) return;
    if (isCoveredByLine(records, file, lineNumber)) return;
    keywordUncovered.push({
      file,
      line: lineNumber,
      text: line.trim(),
    });
  });
}

const outDir = path.join(process.cwd(), "analysis");
fs.mkdirSync(outDir, { recursive: true });

const uncoveredTsv = [
  ["kind", "score", "file", "line", "text"].join("\t"),
  ...highUncovered.map((item) =>
    ["high_candidate", item.score, item.file, item.line, item.text.replace(/\s+/g, " ")].join("\t"),
  ),
  ...keywordUncovered.map((item) =>
    ["keyword_line", "", item.file, item.line, item.text.replace(/\s+/g, " ")].join("\t"),
  ),
];
fs.writeFileSync(
  path.join(outDir, "liao_memoir_proofread_uncovered.tsv"),
  `\uFEFF${uncoveredTsv.join("\r\n")}\r\n`,
  "utf8",
);

const report = [];
report.push("《李敖回忆录》校对轮自动审计");
report.push(`当前条目：${records.length}`);
report.push(`高分未覆盖候选（score>=7）：${highUncovered.length}`);
report.push(`关键词未覆盖行：${keywordUncovered.length}`);
report.push("");
report.push("按章节文件统计：");
for (const [file, count] of [...byFile.entries()].sort((a, b) => a[0].localeCompare(b[0], "zh-Hans-CN"))) {
  report.push(`- ${file}: ${count}`);
}
report.push("");
report.push("类别统计：");
for (const [category, count] of [...categories.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))) {
  report.push(`- ${category}: ${count}`);
}
report.push("");
report.push("重复 quote_text：");
const duplicateItems = [...duplicateQuoteTexts.entries()].filter(([, ids]) => ids.length > 1);
if (duplicateItems.length === 0) {
  report.push("- 无");
} else {
  for (const [, ids] of duplicateItems) report.push(`- ${ids.join(", ")}`);
}
report.push("");
report.push("高分未覆盖候选样例：");
for (const item of highUncovered.slice(0, 80)) {
  report.push(`- score ${item.score} ${item.file}:${item.line} ${item.text.slice(0, 180)}`);
}
report.push("");
report.push("关键词未覆盖行样例：");
for (const item of keywordUncovered.slice(0, 120)) {
  report.push(`- ${item.file}:${item.line} ${item.text.slice(0, 180)}`);
}
report.push("");
report.push("明细见：analysis/liao_memoir_proofread_uncovered.tsv");

fs.writeFileSync(
  path.join(outDir, "liao_memoir_proofread_audit.txt"),
  `\uFEFF${report.join("\r\n")}\r\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      records: records.length,
      highUncovered: highUncovered.length,
      keywordUncovered: keywordUncovered.length,
      duplicateQuoteTextGroups: duplicateItems.length,
      reportPath: path.join(outDir, "liao_memoir_proofread_audit.txt"),
      uncoveredPath: path.join(outDir, "liao_memoir_proofread_uncovered.tsv"),
    },
    null,
    2,
  ),
);
