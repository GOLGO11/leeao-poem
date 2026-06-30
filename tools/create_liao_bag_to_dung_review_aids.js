const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = path.resolve(__dirname, "..");
const BOOK = "从万宝囊到臭屎堆";
const OUT_JSON = path.join(ROOT, "analysis", "liao_bag_to_dung_quote_candidates.json");
const OUT_TSV = path.join(ROOT, "analysis", "liao_bag_to_dung_review_candidates.tsv");
const decoder = new TextDecoder("gb18030");

const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");

const sectionDir = fs
  .readdirSync(path.join(ROOT, corpusDir))
  .find((name) => name.startsWith("016."));
if (!sectionDir) throw new Error("Section directory 016 not found");

const sourceBookDir = fs
  .readdirSync(path.join(ROOT, corpusDir, sectionDir))
  .find((name) => name.startsWith("008."));
if (!sourceBookDir) throw new Error("Source book directory 008 not found");

const sourceDir = path.join(ROOT, corpusDir, sectionDir, sourceBookDir);

const quotePattern = /[“‘《「『]([^”’》」』]{1,420})[”’》」』]/g;
const triggerPatterns = [
  [
    "classics",
    /古人|古语|古话|古训|曰|所谓|孔子|孟子|老子|庄子|荀子|韩非|墨子|论语|孟子|左传|史记|汉书|后汉书|资治通鉴|诗经|尚书|礼记|易经|周易|楚辞|三国|世说|红楼梦|水浒|西游|文天祥|龚定庵|苏轼|杜甫|李白|白居易|王安石|赵翼|司马迁|司马相如/,
  ],
  [
    "proverb",
    /俗话|俗语|谚语|成语|格言|名言|名句|典故|歇后语|老话|座右铭|口头禅|寓言|箴言/,
  ],
  ["poem", /诗|词|歌|赋|联|对联|挽联|楹联|题辞|绝句|七律|五律|歌谣|打油|诗句|诗云/],
  [
    "religion",
    /圣经|新约|旧约|耶稣|上帝|佛|佛经|和尚|菩萨|如来|基督|福音|罗马书|路加|以赛亚|约翰/,
  ],
  [
    "foreign",
    /英文|英语|法文|德文|拉丁|希腊|莎士比亚|培根|尼采|叔本华|蒙田|罗素|马克·吐温|Lincoln|Churchill|Latin|Bible|Aesop|Montaigne|Shakespeare|Nietzsche|Browning|Disraeli|Johnson/,
  ],
];

const politicalPattern =
  /国民党|共产党|中共|民进党|党外|革命|反共|反攻|复国|总统|政府|政权|国家|民族|民主|自由|人权|宪法|司法|法院|法官|政治|政党|立法院|行政院|国会|选举|戒严|特务|情报|台湾|大陆|中国|中华民国|台独|统一|本省|外省|蒋介石|蒋经国|孙中山|李登辉|陈水扁|胡秋原|林坤荣|亚运|联合国|俄国|日本|卖国|极权|白色恐怖/;

function compact(value, size = 260) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  const chars = Array.from(text);
  return chars.length > size ? `${chars.slice(0, size).join("")}...` : text;
}

function esc(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const rows = [];
for (const file of files) {
  const lines = decoder
    .decode(fs.readFileSync(path.join(sourceDir, file)))
    .replace(/\r\n/g, "\n")
    .split("\n");

  lines.forEach((line, index) => {
    const text = line.trim();
    if (!text) return;

    const markers = triggerPatterns.filter(([, pattern]) => pattern.test(text)).map(([name]) => name);
    const quoteTexts = [];
    quotePattern.lastIndex = 0;
    let match;
    while ((match = quotePattern.exec(text)) !== null) quoteTexts.push(match[1]);

    if (markers.length === 0 && quoteTexts.length === 0) return;

    const contextWindow = [lines[index - 1] ?? "", text, lines[index + 1] ?? ""].join(" ");
    for (const quoteText of quoteTexts.length ? quoteTexts : [""]) {
      rows.push({
        file,
        line: index + 1,
        quoteText,
        markers: markers.join(","),
        political: politicalPattern.test(contextWindow) ? "political-context" : "",
        previous: compact(lines[index - 1] ?? "", 140),
        context: compact(text),
        next: compact(lines[index + 1] ?? "", 140),
      });
    }
  });
}

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

const header = ["file", "line", "quoteText", "markers", "political", "previous", "context", "next"];
fs.writeFileSync(
  OUT_TSV,
  `${header.join("\t")}\n${rows.map((row) => header.map((key) => esc(row[key])).join("\t")).join("\n")}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      book: BOOK,
      sourceDir,
      files: files.length,
      rows: rows.length,
      outJson: OUT_JSON,
      outTsv: OUT_TSV,
    },
    null,
    2,
  ),
);
