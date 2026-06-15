const fs = require("fs");
const path = require("path");

const [targetRootArg, csvPathArg] = process.argv.slice(2);

if (!targetRootArg || !csvPathArg) {
  console.error("Usage: node tools/validate_liao_book_exports.js <targetRoot> <csvPath>");
  process.exit(2);
}

const targetRoot = path.resolve(process.cwd(), targetRootArg);
const csvPath = path.resolve(process.cwd(), csvPathArg);
const sourceDecoder = new TextDecoder("gb18030");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

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

function compact(text) {
  return String(text).replace(/\s+/g, "");
}

const requiredColumns = [
  "id",
  "book",
  "chapter",
  "source_file",
  "line_start",
  "line_end",
  "quote_text",
  "category",
  "source_or_origin",
  "summary",
  "notes",
];

const records = parseCsv(fs.readFileSync(csvPath, "utf8"));
const ids = new Set();
const errors = [];

for (const record of records) {
  for (const column of requiredColumns) {
    if (!(column in record)) errors.push({ id: record.id, error: "missing column", column });
  }

  if (ids.has(record.id)) errors.push({ id: record.id, error: "duplicate id" });
  ids.add(record.id);

  for (const column of requiredColumns.filter((name) => name !== "notes")) {
    if (!String(record[column] ?? "").trim()) {
      errors.push({ id: record.id, error: "empty required field", column });
    }
  }

  const sourcePath = path.join(targetRoot, record.source_file);
  if (!fs.existsSync(sourcePath)) {
    errors.push({ id: record.id, error: "missing source file", source_file: record.source_file });
    continue;
  }

  const start = Number(record.line_start);
  const end = Number(record.line_end);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) {
    errors.push({
      id: record.id,
      error: "invalid line range",
      line_start: record.line_start,
      line_end: record.line_end,
    });
    continue;
  }

  const lines = sourceDecoder.decode(fs.readFileSync(sourcePath)).split(/\r?\n/);
  const sourceText = lines.slice(start - 1, end).join("\n");
  if (
    !sourceText.includes(record.quote_text) &&
    !compact(sourceText).includes(compact(record.quote_text))
  ) {
    errors.push({
      id: record.id,
      error: "quote not found at source line range",
      source_file: record.source_file,
      line_start: record.line_start,
      line_end: record.line_end,
      quote_text: record.quote_text,
    });
  }
}

console.log(JSON.stringify({ records: records.length, uniqueIds: ids.size, errors }, null, 2));
process.exitCode = errors.length > 0 ? 1 : 0;
