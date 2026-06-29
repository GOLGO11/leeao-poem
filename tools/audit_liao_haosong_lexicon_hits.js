const fs = require("fs");
const path = require("path");

const sourceDir = path.join("《大李敖全集6.0》分章节", "015.雷霆法律类", "005.李敖好讼集");
const totalCsv = path.join("exports", "总_诗文格言歌谣引用.csv");
const outTsv = path.join("analysis", "liao_haosong_first_pass_lexicon_hits.tsv");
const decoder = new TextDecoder("gb18030");

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

function esc(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function excerpt(value, size = 260) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return Array.from(text).slice(0, size).join("");
}

const badTerms = [
  "一国两制",
  "两岸",
  "台独",
  "台湾独立",
  "国民党",
  "民进党",
  "共产党",
  "中华民国",
  "中华人民共和国",
  "总统",
  "选举",
  "候选人",
  "参选",
  "政党",
  "政府",
  "行政院",
  "外交部",
  "国防部",
  "新闻局",
  "财政部",
  "法院",
  "法官",
  "警察",
  "宪法",
  "民法",
  "刑法",
  "法令",
  "法律",
  "诉讼",
  "判决",
  "裁定",
  "控告",
  "抗告",
  "上诉",
  "赔偿",
  "国家",
  "台湾",
  "中国",
  "自由",
  "人权",
  "民主",
  "主权",
  "统一",
  "独立",
  "政治",
  "革命",
  "党",
  "军",
  "机关",
  "公务员",
  "司法",
  "检察",
  "律师",
  "林洋港",
  "张温鹰",
  "王作荣",
  "马英九",
  "李光耀",
  "秦孝仪",
  "吴大猷",
  "王世杰",
  "胡秋原",
  "石永贵",
  "梁肃戎",
  "中央日报",
  "三军总医院",
  "新闻局",
];

const totalRows = parseCsv(fs.readFileSync(totalCsv, "utf8"));
const lexicon = [
  ...new Set(
    totalRows
      .map((row) => row.quote_text)
      .filter(Boolean)
      .filter((text) => {
        const length = Array.from(text).length;
        return length >= 2 && length <= 18;
      })
      .filter((text) => !badTerms.some((term) => text.includes(term))),
  ),
].sort((a, b) => Array.from(b).length - Array.from(a).length || a.localeCompare(b, "zh-Hans-CN"));

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const hits = [];
for (const file of files) {
  const lines = decoder.decode(fs.readFileSync(path.join(sourceDir, file))).split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const quote of lexicon) {
      if (line.includes(quote)) {
        hits.push({
          file,
          line: index + 1,
          quote,
          context: excerpt(line),
        });
      }
    }
  }
}

const seen = new Set();
const uniqueHits = hits.filter((hit) => {
  const key = `${hit.file}|${hit.line}|${hit.quote}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

fs.mkdirSync(path.dirname(outTsv), { recursive: true });
const header = ["file", "line", "quote", "context"];
fs.writeFileSync(
  outTsv,
  `${header.join("\t")}\r\n${uniqueHits.map((hit) => header.map((key) => esc(hit[key])).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      lexiconSize: lexicon.length,
      hits: uniqueHits.length,
      outTsv,
      sample: uniqueHits.slice(0, 80),
    },
    null,
    2,
  ),
);
