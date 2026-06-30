const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_CSV = path.join(ROOT, "exports", "总_诗文格言歌谣引用.csv");
const OUT_DIR = path.join(ROOT, "site", "data");
const OUT_JS = path.join(OUT_DIR, "quotes-data.js");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows.filter((item) => item.some((value) => value !== ""));
}

function countBy(rows, index) {
  return rows.reduce((map, row) => {
    const key = row[index] || "未分类";
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});
}

if (!fs.existsSync(SOURCE_CSV)) {
  throw new Error(`Missing source CSV: ${SOURCE_CSV}`);
}

const parsed = parseCsv(fs.readFileSync(SOURCE_CSV, "utf8"));
const columns = parsed.shift().map((column, index) => (index === 0 ? column.replace(/^\uFEFF/, "") : column));
const columnIndex = Object.fromEntries(columns.map((column, index) => [column, index]));
const rows = parsed.map((row) => columns.map((_, index) => row[index] || ""));

const payload = {
  generatedAt: new Date().toISOString(),
  source: "exports/总_诗文格言歌谣引用.csv",
  total: rows.length,
  columns,
  stats: {
    books: countBy(rows, columnIndex.book),
    categories: countBy(rows, columnIndex.category),
  },
  rows,
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  OUT_JS,
  `window.LIAO_QUOTES_DATA = ${JSON.stringify(payload)};\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      source: SOURCE_CSV,
      out: OUT_JS,
      rows: rows.length,
      books: Object.keys(payload.stats.books).length,
      categories: Object.keys(payload.stats.categories).length,
    },
    null,
    2,
  ),
);
