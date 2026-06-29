const fs = require("fs");
const path = require("path");

const sourceDir = path.join("《大李敖全集6.0》分章节", "015.雷霆法律类", "004.李敖放刁集");
const outJson = path.join("analysis", "liao_fangdiao_quote_candidates.json");
const outTsv = path.join("analysis", "liao_fangdiao_review_candidates.tsv");
const sourceDecoder = new TextDecoder("gb18030");

const quotePattern = /[“‘《「『]([^”’》」』]{1,420})[”’》」』]/g;
const triggerPatterns = [
  [
    "classics",
    /古人|古语|古话|古训|孔子|孟子|老子|庄子|荀子|韩非|论语|左传|史记|汉书|后汉书|资治通鉴|诗经|礼记|易经|周易|楚辞|唐诗|宋词|三国|西游记|红楼梦|世说|项羽|文天祥|龚定庵|苏轼|杜甫|李白|白居易|韩愈|柳宗元|司马迁|陶渊明|关公|包公/,
  ],
  [
    "proverb",
    /俗话|俗语|谚语|成语|格言|名言|名句|典故|歇后语|老话|座右铭|口头禅|寓言|警句|俗谚|法谚|西谚/,
  ],
  [
    "poem",
    /诗|诗句|诗词|歌|赋|联|对联|挽联|楹联|题词|绝句|七律|五律|歌谣|民谣|打油/,
  ],
  [
    "foreign",
    /英文|英语|法文|德文|拉丁|希腊|圣经|新约|旧约|耶稣|莎士比亚|培根|尼采|叔本华|蒙田|罗素|马克·吐温|Lincoln|Churchill|Latin|Bible|Aesop|Montaigne|Shakespeare|Nietzsche/,
  ],
];

const politicalPattern =
  /国民党|共产党|中共|党外|民进党|政府|政权|总统|领导|国父|革命|反共|反攻|复国|政治|政党|民主|自由|人权|宪法|司法|法院|法官|检察|判决|诉讼|自诉|诽谤|官司|警察|行政院|新闻局|外交部|财政部|国防部|税捐|监察院|立法院|国会|军法|特务|情报|监狱|台湾|大陆|中国|台独|统一|一国两制|省籍|本省|外省|蒋介石|蒋经国|孙中山|陈水扁|李登辉|邓小平|江鹏坚|林洋港|吴伯雄|李光耀|张温鹰|王作荣|方素敏|马英九|秦孝仪|吴大猷|王世杰/;

function esc(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function compact(value, size = 280) {
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
        previous: compact(lines[index - 1] ?? "", 160),
        context: compact(text),
        next: compact(lines[index + 1] ?? "", 160),
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
