const fs = require("fs");
const path = require("path");

const [csvPathArg, txtPathArg, titleArg, scopeArg] = process.argv.slice(2);

if (!csvPathArg || !txtPathArg || !titleArg) {
  console.error(
    "Usage: node tools/render_liao_book_txt_from_csv.js <csvPath> <txtPath> <title> [scopeNote]",
  );
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

const rows = parseCsv(fs.readFileSync(path.resolve(csvPathArg), "utf8"));
const lines = [];

lines.push(titleArg);
lines.push("生成日期：2026-06-20");
lines.push(`总计：${rows.length} 条`);
lines.push("");
if (scopeArg) {
  lines.push(`口径说明：${scopeArg}`);
  lines.push("");
}

let currentChapter = "";
for (const row of rows) {
  if (row.chapter !== currentChapter) {
    currentChapter = row.chapter;
    lines.push(`## ${currentChapter}`);
  }

  lines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  lines.push(`引用：${row.quote_text}`);
  lines.push(`出处线索：${row.source_or_origin}`);
  lines.push(`摘要：${row.summary}`);
  if (row.notes) lines.push(`备注：${row.notes}`);
  lines.push("");
}

fs.writeFileSync(path.resolve(txtPathArg), `\uFEFF${lines.join("\r\n")}\r\n`, "utf8");
console.log(JSON.stringify({ records: rows.length, txtPath: path.resolve(txtPathArg) }, null, 2));
