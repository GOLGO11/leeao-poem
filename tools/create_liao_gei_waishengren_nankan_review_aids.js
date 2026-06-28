const fs = require("fs");
const path = require("path");

const sourceDir = path.join("《大李敖全集6.0》分章节", "013.国民党史政", "006.给外省人难看");
const outJson = path.join("analysis", "liao_make_waishengren_look_bad_quote_candidates.json");
const outTsv = path.join("analysis", "liao_make_waishengren_look_bad_review_candidates.tsv");
const sourceDecoder = new TextDecoder("gb18030");

const quotePattern = /[“「『]([^”」』]{1,280})[”」』]/g;
const triggerPatterns = [
  ["classics", /古人|古语|古训|古话|曰|云|所谓|孔子|孟子|老子|庄子|韩非|荀子|论语|孟子|左传|史记|汉书|后汉书|资治通鉴|诗经|礼记|易经|周易|说苑|圣经|佛|禅|苏轼|杜甫|李白|白居易|龚自珍|红楼梦|水浒|三国|世说|通典|容斋|仪礼|大戴礼/],
  ["proverb", /俗话|俗语|谚|成语|常言|格言|名言|名句|典故|歇后语|老话|土话|夫子自道/],
  ["poem", /诗|词|歌|联|对联|题词|挽联|楹联|歌谣|打油/],
  ["foreign", /英文|英语|拉丁|希腊|莎士比亚|培根|叔本华|尼采|Montaigne|English|Latin|Churchill|Lincoln|Byron|Johnson|Tolstoy|Butler|Ibsen|Aesop|伊索/],
];
const politicalPattern =
  /国民党|共产党|中共|民进党|党外|革命|反共|反攻|复国|总统|政府|军|兵|宪法|司法|特务|情报|国家|民族|民主|自由|人权|党|领袖|国父|蒋|孙中山|台湾|大陆|统一|独立|匪|叛乱|司法院|行政院|立法院|监察院|考试院|选举|戒严|政治|政党|党报/;

function esc(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function compact(value, size = 240) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  const chars = Array.from(text);
  return chars.length > size ? `${chars.slice(0, size).join("")}...` : text;
}

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const rows = [];
for (const file of files) {
  const lines = sourceDecoder
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
    const political = politicalPattern.test(contextWindow) ? "political-context" : "";
    for (const quoteText of quoteTexts.length ? quoteTexts : [""]) {
      rows.push({
        file,
        line: index + 1,
        quoteText,
        markers: markers.join(","),
        political,
        previous: compact(lines[index - 1] ?? "", 140),
        context: compact(text),
        next: compact(lines[index + 1] ?? "", 140),
      });
    }
  });
}

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

const header = ["file", "line", "quoteText", "markers", "political", "previous", "context", "next"];
fs.writeFileSync(
  outTsv,
  `${header.join("\t")}\n${rows.map((row) => header.map((key) => esc(row[key])).join("\t")).join("\n")}\n`,
  "utf8",
);

console.log(JSON.stringify({ sourceDir, files: files.length, rows: rows.length, outJson, outTsv }, null, 2));
