const fs = require("fs");
const path = require("path");

const sourceDir = path.join("《大李敖全集6.0》分章节", "013.国民党史政", "002.国民党研究续集");
const outPath = path.join("analysis", "liao_kuomintang_study_xuji_focused_review.tsv");
const sourceDecoder = new TextDecoder("gb18030");

const quotePattern = /“([^”]{1,220})”/g;
const triggerPatterns = [
  ["classics", /古人|古语|古训|曰|云|所谓|孔子|孟子|老子|庄子|韩非|论语|左传|史记|汉书|五代史|说苑|圣经|佛|禅/],
  ["proverb", /俗话|俗语|谚|成语|常言|格言|名言|名句|笑话|典故|夫子自道/],
  ["poem", /诗|词|歌|联|对联|题词|挽联|楹联/],
  ["foreign", /英文|英语|拉丁|希腊|莎士比亚|培根|叔本华|尼采|Montaigne|English|Latin/],
];
const politicalPattern =
  /国民党|共产党|中共|民进党|党外|革命|反共|反攻|复国|总统|政府|军|兵|宪法|司法|特务|情报|国家|民族|民主|自由|人权|党|领袖|国父|蒋|孙中山|袁世凯|蔡锷|梁启超|台湾|大陆|统一|独立|匪|叛乱|暗杀|黑社会/;

function esc(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function compact(value, size = 220) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  const chars = Array.from(text);
  return chars.length > size ? `${chars.slice(0, size).join("")}...` : text;
}

const rows = [];
const files = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

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

    const political = politicalPattern.test(text) ? "political-context" : "";
    for (const quoteText of quoteTexts.length ? quoteTexts : [""]) {
      rows.push({
        file,
        line: index + 1,
        quoteText,
        markers: markers.join(","),
        political,
        previous: compact(lines[index - 1] ?? "", 120),
        context: compact(text),
        next: compact(lines[index + 1] ?? "", 120),
      });
    }
  });
}

const header = ["file", "line", "quoteText", "markers", "political", "previous", "context", "next"];
fs.writeFileSync(
  outPath,
  `${header.join("\t")}\n${rows.map((row) => header.map((key) => esc(row[key])).join("\t")).join("\n")}\n`,
  "utf8",
);

console.log(JSON.stringify({ sourceDir, files: files.length, rows: rows.length, outPath }, null, 2));
