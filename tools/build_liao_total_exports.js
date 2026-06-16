const fs = require("fs");
const path = require("path");

const generatedDate = "2026-06-16";

const bookExports = [
  "李敖自传与回忆_诗词名言引用.csv",
  "李敖自传与回忆续集_诗词名言引用.csv",
  "我最难忘的事和人_诗词名言引用.csv",
  "李敖回忆录_诗文格言歌谣引用.csv",
  "李敖快意恩仇录_诗文格言歌谣引用.csv",
  "李敖议坛哀思录_诗文格言歌谣引用.csv",
  "李敖风流自传_诗文格言歌谣引用.csv",
];

const columns = [
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

const excludedCategoryParts = [
  "政论",
  "政治语录",
  "政治名言",
  "政治格言",
  "政治口号",
  "政治套语",
  "西方政治",
  "外国政治",
  "政治学",
  "人权语录",
  "教育语录",
  "教育名言",
  "教育主张",
  "出版原则语",
  "学生刊物宣言",
  "现代国际语录",
  "军中语录",
  "古典法理名句",
  "现代史料判断",
  "现代史论警句",
  "现代史学论断",
  "现代人物语录",
  "现代人物赠语",
  "现代批评语",
  "现代评论语",
  "现代讽刺语录",
  "反讽口号",
  "历史口号",
];

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

const csvEscape = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function keepForPoemMaximSongScope(row) {
  const category = row.category || "";
  return !excludedCategoryParts.some((part) => category.includes(part));
}

const outDir = path.join(process.cwd(), "exports");
const allRows = [];
const removedRows = [];
const stats = [];

for (const fileName of bookExports) {
  const csvPath = path.join(outDir, fileName);
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Missing book export: ${csvPath}`);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  for (const row of rows) {
    for (const column of columns) {
      if (!(column in row)) {
        throw new Error(`Missing column ${column} in ${fileName}`);
      }
    }

    if (keepForPoemMaximSongScope(row)) {
      allRows.push(row);
    } else {
      removedRows.push(row);
    }
  }

  stats.push({
    fileName,
    book: rows[0]?.book ?? "",
    originalRows: rows.length,
    keptRows: rows.filter(keepForPoemMaximSongScope).length,
    removedRows: rows.filter((row) => !keepForPoemMaximSongScope(row)).length,
  });
}

const ids = new Set();
for (const row of allRows) {
  if (ids.has(row.id)) {
    throw new Error(`Duplicate id in total export: ${row.id}`);
  }
  ids.add(row.id);
}

const csvLines = [
  columns.join(","),
  ...allRows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
];

const primaryCsvPath = path.join(outDir, "总_诗文格言歌谣引用.csv");
const legacyCsvPath = path.join(outDir, "总_诗词名言引用.csv");
const csvText = `\uFEFF${csvLines.join("\r\n")}\r\n`;
fs.writeFileSync(primaryCsvPath, csvText, "utf8");
fs.writeFileSync(legacyCsvPath, csvText, "utf8");

const txt = [];
txt.push("《大李敖全集6.0》已处理书目诗文格言歌谣引用总表");
txt.push(`生成日期：${generatedDate}`);
txt.push(`总计：${allRows.length} 条`);
txt.push(`已按新口径剔除明显政论/政治语录类：${removedRows.length} 条`);
txt.push("");
txt.push("已合并书目：");
for (const stat of stats) {
  txt.push(`- 《${stat.book}》：保留 ${stat.keptRows} 条，原表 ${stat.originalRows} 条，剔除 ${stat.removedRows} 条`);
}
txt.push("");
txt.push("口径说明：普通政论语录、公文审讯语句、政治/教育/人权主张类、李敖自作诗不进入总表；主收诗文、古文名句、格言、俗谚、歌谣、歌词、联语及宗教/哲学经典句。");
txt.push("");

let currentBook = "";
let currentChapter = "";
for (const row of allRows) {
  if (row.book !== currentBook) {
    currentBook = row.book;
    currentChapter = "";
    txt.push(`# 《${currentBook}》`);
  }
  if (row.chapter !== currentChapter) {
    currentChapter = row.chapter;
    txt.push(`## ${currentChapter}`);
  }
  txt.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txt.push(`引用：${row.quote_text}`);
  txt.push(`出处线索：${row.source_or_origin}`);
  txt.push(`摘要：${row.summary}`);
  if (row.notes) txt.push(`备注：${row.notes}`);
  txt.push("");
}

const primaryTxtPath = path.join(outDir, "总_诗文格言歌谣引用.txt");
const legacyTxtPath = path.join(outDir, "总_诗词名言引用.txt");
const txtText = `\uFEFF${txt.join("\r\n")}\r\n`;
fs.writeFileSync(primaryTxtPath, txtText, "utf8");
fs.writeFileSync(legacyTxtPath, txtText, "utf8");

const removedByCategory = new Map();
for (const row of removedRows) {
  removedByCategory.set(row.category, (removedByCategory.get(row.category) || 0) + 1);
}

const report = {
  generatedDate,
  books: stats,
  rows: allRows.length,
  removedRows: removedRows.length,
  uniqueIds: ids.size,
  removedByCategory: Object.fromEntries(
    [...removedByCategory.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
  ),
  csvPath: primaryCsvPath,
  txtPath: primaryTxtPath,
  legacyCsvPath,
  legacyTxtPath,
};

fs.mkdirSync(path.join(process.cwd(), "analysis"), { recursive: true });
fs.writeFileSync(
  path.join(process.cwd(), "analysis", "liao_total_scope_filter_report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(report, null, 2));
