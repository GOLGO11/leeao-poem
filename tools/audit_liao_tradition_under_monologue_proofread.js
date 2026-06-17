const fs = require("fs");
const path = require("path");

const reviewPath =
  process.argv[2] || path.join("analysis", "liao_tradition_under_monologue_review_candidates.tsv");
const csvPath =
  process.argv[3] || path.join("exports", "独白下的传统_诗文格言歌谣引用.csv");
const outPath =
  process.argv[4] || path.join("analysis", "liao_tradition_under_monologue_proofread_audit.tsv");

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
  const rows = text.replace(/^\uFEFF/, "").trimEnd().split(/\r?\n/);
  const header = rows.shift().split("\t");
  return rows.map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""]));
  });
}

function compact(value) {
  return String(value)
    .replace(/\s+/g, "")
    .replace(/[“”"『』「」‘’']/g, "")
    .replace(/[，。！？；：、,.!?;:]/g, "");
}

function esc(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " / ");
}

const records = parseCsv(fs.readFileSync(csvPath, "utf8"));
const reviewRows = parseTsv(fs.readFileSync(reviewPath, "utf8"));
const quoteByFile = new Map();
const lineByFile = new Map();

for (const record of records) {
  if (!quoteByFile.has(record.source_file)) quoteByFile.set(record.source_file, []);
  quoteByFile.get(record.source_file).push(record);
  const lineKey = `${record.source_file}:${record.line_start}-${record.line_end}`;
  lineByFile.set(lineKey, (lineByFile.get(lineKey) || []).concat(record.id));
}

function isCovered(candidate) {
  const candidateText = compact(candidate.text);
  if (!candidateText || candidateText.length < 2) return true;
  const rows = quoteByFile.get(candidate.file) || [];
  return rows.some((record) => {
    const quote = compact(record.quote_text);
    return quote.includes(candidateText) || candidateText.includes(quote);
  });
}

const obviousNoise = [
  /^第[一二三四五六七八九十百]+$/,
  /^[0-9a-zA-Z]+$/,
  /李敖/,
  /独白下的传统/,
  /Mandikesvara/,
];

function isNoise(row) {
  if (row.file.includes("目录")) return true;
  const text = row.text.trim();
  if (text.length < 3) return true;
  return obviousNoise.some((pattern) => pattern.test(text));
}

const suspicious = reviewRows
  .map((row) => ({ ...row, score: Number(row.score) || 0, line: Number(row.line) || 0 }))
  .filter((row) => row.score >= 4)
  .filter((row) => !isNoise(row))
  .filter((row) => !isCovered(row))
  .sort(
    (a, b) =>
      b.score - a.score ||
      a.file.localeCompare(b.file, "zh-Hans-CN") ||
      a.line - b.line ||
      a.text.localeCompare(b.text, "zh-Hans-CN"),
  );

const lines = [["score", "file", "line", "text", "same_line_export_ids", "context"].join("\t")];
for (const row of suspicious) {
  const sameLineIds = records
    .filter(
      (record) =>
        record.source_file === row.file &&
        Number(record.line_start) <= row.line &&
        row.line <= Number(record.line_end),
    )
    .map((record) => record.id)
    .join(",");
  lines.push(
    [row.score, row.file, row.line, row.text, sameLineIds, String(row.context).slice(0, 320)]
      .map(esc)
      .join("\t"),
  );
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      reviewRows: reviewRows.length,
      records: records.length,
      suspicious: suspicious.length,
      outPath,
    },
    null,
    2,
  ),
);
