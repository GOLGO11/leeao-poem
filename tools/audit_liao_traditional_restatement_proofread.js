const fs = require("fs");
const path = require("path");

const candidatePath =
  process.argv[2] || path.join("analysis", "liao_traditional_restatement_quote_candidates.json");
const csvPath =
  process.argv[3] || path.join("exports", "传统下的再白_诗文格言歌谣引用.csv");
const outPath =
  process.argv[4] || path.join("analysis", "liao_traditional_restatement_uncovered_quotes.tsv");

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

const compact = (value) => String(value).replace(/\s+/g, "");
const esc = (value) => String(value).replace(/\t/g, " ").replace(/\r?\n/g, " / ");

const candidates = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const records = parseCsv(fs.readFileSync(csvPath, "utf8"));

function coveredByCurrentExport(candidate) {
  return records.some(
    (record) =>
      record.source_file === candidate.file &&
      Number(record.line_start) <= candidate.line &&
      candidate.line <= Number(record.line_end),
  ) ||
    records.some(
      (record) =>
        record.source_file === candidate.file &&
        (compact(candidate.text).includes(compact(record.quote_text)) ||
          compact(record.quote_text).includes(compact(candidate.text))),
    );
}

const uncovered = candidates
  .filter((row) => row.kind === "quote")
  .filter((row) => !coveredByCurrentExport(row))
  .sort(
    (a, b) =>
      a.file.localeCompare(b.file, "zh-Hans-CN") ||
      a.line - b.line ||
      a.text.localeCompare(b.text, "zh-Hans-CN"),
  );

const lines = [["file", "line", "text", "context"].join("\t")];
for (const row of uncovered) {
  lines.push(
    [
      row.file,
      row.line,
      row.text,
      String(row.context).replace(/\s+/g, " ").slice(0, 260),
    ]
      .map(esc)
      .join("\t"),
  );
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      totalQuoteCandidates: candidates.filter((row) => row.kind === "quote").length,
      records: records.length,
      uncovered: uncovered.length,
      outPath,
    },
    null,
    2,
  ),
);
