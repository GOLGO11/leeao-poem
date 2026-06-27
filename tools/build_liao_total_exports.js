const fs = require("fs");
const path = require("path");

const generatedDate = "2026-06-27";

const bookExports = [
  "李敖自传与回忆_诗词名言引用.csv",
  "李敖自传与回忆续集_诗词名言引用.csv",
  "我最难忘的事和人_诗词名言引用.csv",
  "李敖回忆录_诗文格言歌谣引用.csv",
  "李敖快意恩仇录_诗文格言歌谣引用.csv",
  "李敖议坛哀思录_诗文格言歌谣引用.csv",
  "李敖风流自传_诗文格言歌谣引用.csv",
  "传统下的独白_诗文格言歌谣引用.csv",
  "传统下的再白_诗文格言歌谣引用.csv",
  "独白下的传统_诗文格言歌谣引用.csv",
  "李敖文存_诗文格言歌谣引用.csv",
  "李敖文存二集_诗文格言歌谣引用.csv",
  "波波颂_诗文格言歌谣引用.csv",
  "李敖全集_诗文格言歌谣引用.csv",
  "教育与脸谱_诗文格言歌谣引用.csv",
  "文化论战丹火录_诗文格言歌谣引用.csv",
  "为中国思想趋向求答案_诗文格言歌谣引用.csv",
  "上下古今谈_诗文格言歌谣引用.csv",
  "世论新语_诗文格言歌谣引用.csv",
  "求是新语_诗文格言歌谣引用.csv",
  "我是天安门_诗文格言歌谣引用.csv",
  "你是景福门_诗文格言歌谣引用.csv",
  "为自由招魂_诗文格言歌谣引用.csv",
  "你笨蛋，你笨蛋_诗文格言歌谣引用.csv",
  "我梦碎，所以我梦醒_诗文格言歌谣引用.csv",
  "李敖新刊_诗文格言歌谣引用.csv",
  "千秋万岁乌鸦求是合集_诗文格言歌谣引用.csv",
  "李敖杂文集_诗文格言歌谣引用.csv",
  "千秋万岁编外集_诗文格言歌谣引用.csv",
  "北京法源寺_诗文格言歌谣引用.csv",
  "上山·上山·爱_诗文格言歌谣引用.csv",
  "红色11_诗文格言歌谣引用.csv",
  "虚拟的十七岁_诗文格言歌谣引用.csv",
  "阳痿美国_诗文格言歌谣引用.csv",
  "第73烈士_诗文格言歌谣引用.csv",
  "爱情的秘密_诗文格言歌谣引用.csv",
  "李敖的情诗_诗文格言歌谣引用.csv",
  "李语录_诗文格言歌谣引用.csv",
  "李敖语录_诗文格言歌谣引用.csv",
  "虽千万人，李敖往矣_诗文格言歌谣引用.csv",
  "挑战李敖——敖语录_诗文格言歌谣引用.csv",
  "大学札记_诗文格言歌谣引用.csv",
  "早年日记_诗文格言歌谣引用.csv",
  "大学后期日记甲集_诗文格言歌谣引用.csv",
  "大学后期日记乙集_诗文格言歌谣引用.csv",
  "一个预备军官的日记_诗文格言歌谣引用.csv",
  "李敖秘藏日记_诗文格言歌谣引用.csv",
  "李敖札记_诗文格言歌谣引用.csv",
  "李敖五五日记_诗文格言歌谣引用.csv",
  "李敖随写录前集_诗文格言歌谣引用.csv",
  "李敖随写录后集_诗文格言歌谣引用.csv",
  "李敖报刊集_诗文格言歌谣引用.csv",
  "李敖书序集_诗文格言歌谣引用.csv",
  "李敖书序集续集_诗文格言歌谣引用.csv",
  "李敖对话录_诗文格言歌谣引用.csv",
  "李敖访谈录1990-2018_诗文格言歌谣引用.csv",
  "李敖情书集_诗文格言歌谣引用.csv",
  "李敖书信集_诗文格言歌谣引用.csv",
  "李敖书翰集_诗文格言歌谣引用.csv",
  "李敖书简集_诗文格言歌谣引用.csv",
  "李敖书札集_诗文格言歌谣引用.csv",
  "李敖书笺集_诗文格言歌谣引用.csv",
  "李敖书牍集_诗文格言歌谣引用.csv",
  "李敖书函集_诗文格言歌谣引用.csv",
  "李敖书启集_诗文格言歌谣引用.csv",
  "坐牢家爸爸给女儿的八十封信_诗文格言歌谣引用.csv",
  "给马戈的五十封信_诗文格言歌谣引用.csv",
  "李敖写的信_诗文格言歌谣引用.csv",
  "历史与人像_诗文格言歌谣引用.csv",
  "读史指南_诗文格言歌谣引用.csv",
  "为历史拨云_诗文格言歌谣引用.csv",
  "要把金针度与人_诗文格言歌谣引用.csv",
  "中国性研究_诗文格言歌谣引用.csv",
  "中国命研究_诗文格言歌谣引用.csv",
  "中国近代史新论_诗文格言歌谣引用.csv",
  "中国现代史正论_诗文格言歌谣引用.csv",
  "中国现代史定论_诗文格言歌谣引用.csv",
  "中国迷信新研_诗文格言歌谣引用.csv",
  "中国艺术新研_诗文格言歌谣引用.csv",
  "李敖笑傲江湖_诗文格言歌谣引用.csv",
  "挑战李敖_诗文格言歌谣引用.csv",
  "李敖秘密书房_诗文格言歌谣引用.csv",
  "李敖颠倒众生_诗文格言歌谣引用.csv",
  "李敖Talk秀_诗文格言歌谣引用.csv",
  "李敖大哥大_诗文格言歌谣引用.csv",
  "李敖有话说_诗文格言歌谣引用.csv",
  "笑敖年代_诗文格言歌谣引用.csv",
  "李敖语妙天下_诗文格言歌谣引用.csv",
  "笑傲六十年·有话说李敖_诗文格言歌谣引用.csv",
  "李敖演讲集_诗文格言歌谣引用.csv",
  "李敖政论综艺集_诗文格言歌谣引用.csv",
  "快意还乡——李敖神州文化之旅_诗文格言歌谣引用.csv",
  "李敖放电集_诗文格言歌谣引用.csv",
  "李敖发电集_诗文格言歌谣引用.csv",
  "李敖送电集_诗文格言歌谣引用.csv",
  "李敖来电集_诗文格言歌谣引用.csv",
  "李敖通电集_诗文格言歌谣引用.csv",
  "胡适研究_诗文格言歌谣引用.csv",
  "胡适评传_诗文格言歌谣引用.csv",
  "胡适与我_诗文格言歌谣引用.csv",
  "孙逸仙和中国西化医学_诗文格言歌谣引用.csv",
  "孙中山研究_诗文格言歌谣引用.csv",
  "李登辉的真面目_诗文格言歌谣引用.csv",
  "李登辉的假面具_诗文格言歌谣引用.csv",
  "郑南榕研究_诗文格言歌谣引用.csv",
  "陈水扁的真面目_诗文格言歌谣引用.csv",
  "李远哲的真面目_诗文格言歌谣引用.csv",
  "你不知道的彭明敏_诗文格言歌谣引用.csv",
  "为文学开窗_诗文格言歌谣引用.csv",
  "丑陋的中国人研究_诗文格言歌谣引用.csv",
  "闽变研究与文星讼案_诗文格言歌谣引用.csv",
  "大江大海骗了你_诗文格言歌谣引用.csv",
  "蒋介石研究_诗文格言歌谣引用.csv",
  "蒋介石研究续集_诗文格言歌谣引用.csv",
  "蒋介石研究三集_诗文格言歌谣引用.csv",
  "蒋介石研究四集_诗文格言歌谣引用.csv",
  "蒋介石研究五集_诗文格言歌谣引用.csv",
  "蒋介石研究六集_诗文格言歌谣引用.csv",
  "蒋介石的真面目_诗文格言歌谣引用.csv",
  "蒋介石评传_诗文格言歌谣引用.csv",
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

const excludedRowsById = new Map([
  ["LAZHXJ-011", "现代民族国家论断，属于政治史论语录，不作为诗文格言保留"],
  ["LAZHXJ-018", "胡适谈政治的现代文人语，属于政治语录"],
  ["LAZHXJ-019", "胡适谈政治的现代文人语，属于政治语录"],
  ["LAZHXJ-020", "胡适自述不谈政治与革新中国，属于现代政治相关语录"],
  ["LAZHXJ-029", "政治犯刑求语境中的现代口语，不属于诗文格言"],
  ["LAZHXJ-072", "为现代政治人物祝寿的颂词，属于政治人物语录"],
  ["LAWN-034", "关于国家塑造国民的现代政治哲学语录"],
  ["LAWN-041", "以政治参与为核心的西方政治哲学语录"],
  ["LACTDB-026", "以政治为核心的西方政治哲学格言"],
  ["LAYTAS-047", "评价现代政治人物与民主政治的政治语录"],
  ["LAWC2-156", "近代革命志士赴死语，属于政治革命语录"],
  ["LAWLDH-041", "关于仇视国家的现代政治意识形态引文"],
]);

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
  return (
    !excludedRowsById.has(row.id) &&
    !excludedCategoryParts.some((part) => category.includes(part))
  );
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
txt.push(`已按新口径剔除明显政论/政治语录类：${removedRows.length} 条，其中人工校对剔除 ${removedRows.filter((row) => excludedRowsById.has(row.id)).length} 条`);
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

const explicitlyExcludedRows = removedRows
  .filter((row) => excludedRowsById.has(row.id))
  .map((row) => ({
    id: row.id,
    book: row.book,
    chapter: row.chapter,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
    quote_text: row.quote_text,
    category: row.category,
    reason: excludedRowsById.get(row.id),
  }));

const report = {
  generatedDate,
  books: stats,
  rows: allRows.length,
  removedRows: removedRows.length,
  uniqueIds: ids.size,
  removedByCategory: Object.fromEntries(
    [...removedByCategory.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
  ),
  explicitlyExcludedRows,
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

const auditColumns = [
  "id",
  "book",
  "chapter",
  "source_file",
  "line_start",
  "line_end",
  "quote_text",
  "category",
  "reason",
];
const auditLines = [
  auditColumns.join("\t"),
  ...explicitlyExcludedRows.map((row) =>
    auditColumns.map((column) => String(row[column] ?? "").replace(/\t/g, " ")).join("\t"),
  ),
];
fs.writeFileSync(
  path.join(process.cwd(), "analysis", "liao_total_political_scope_audit.tsv"),
  `${auditLines.join("\r\n")}\r\n`,
  "utf8",
);

console.log(JSON.stringify(report, null, 2));
