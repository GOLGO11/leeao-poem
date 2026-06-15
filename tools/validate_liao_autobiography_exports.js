const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const targetRoot = path.join(
  root,
  "《大李敖全集6.0》分章节",
  "001.自传回忆类",
  "001.李敖自传与回忆",
);
const csvPath = path.join(root, "exports", "李敖自传与回忆_诗词名言引用.csv");

const sourceDecoder = new TextDecoder("gb18030");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        value += '"';
        i += 1;
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

const records = parseCsv(fs.readFileSync(csvPath, "utf8"));
const ids = new Set();
const errors = [];

function compact(text) {
  return text.replace(/\s+/g, "");
}

for (const record of records) {
  if (ids.has(record.id)) {
    errors.push({ id: record.id, error: "duplicate id" });
  }
  ids.add(record.id);

  const sourcePath = path.join(targetRoot, record.source_file);
  if (!fs.existsSync(sourcePath)) {
    errors.push({ id: record.id, error: "missing source file", source_file: record.source_file });
    continue;
  }

  const lines = sourceDecoder.decode(fs.readFileSync(sourcePath)).split(/\r?\n/);
  const start = Number(record.line_start);
  const end = Number(record.line_end);
  const sourceText = lines.slice(start - 1, end).join("\n");
  if (!sourceText.includes(record.quote_text) && !compact(sourceText).includes(compact(record.quote_text))) {
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
