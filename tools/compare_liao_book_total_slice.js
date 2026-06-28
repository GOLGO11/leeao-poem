const fs = require("fs");
const path = require("path");

const [bookName, singleCsvArg, totalCsvArg = path.join("exports", "总_诗文格言歌谣引用.csv")] =
  process.argv.slice(2);

if (!bookName || !singleCsvArg) {
  console.error("Usage: node tools/compare_liao_book_total_slice.js <bookName> <singleCsv> [totalCsv]");
  process.exit(2);
}

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

const singleCsvPath = path.resolve(process.cwd(), singleCsvArg);
const totalCsvPath = path.resolve(process.cwd(), totalCsvArg);
const singleRows = parseCsv(fs.readFileSync(singleCsvPath, "utf8"));
const totalSlice = parseCsv(fs.readFileSync(totalCsvPath, "utf8")).filter(
  (row) => row.book === bookName,
);

const identicalJson = JSON.stringify(singleRows) === JSON.stringify(totalSlice);
const report = {
  book: bookName,
  singleRows: singleRows.length,
  totalSliceRows: totalSlice.length,
  identicalJson,
  firstId: singleRows[0]?.id ?? "",
  lastId: singleRows[singleRows.length - 1]?.id ?? "",
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = identicalJson ? 0 : 1;
