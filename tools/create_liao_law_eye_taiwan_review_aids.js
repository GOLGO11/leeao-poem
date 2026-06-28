const fs = require("fs");
const path = require("path");

const corpusDir = fs.readdirSync(process.cwd()).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");

const sectionDir = fs.readdirSync(corpusDir).find((name) => name.startsWith("014."));
if (!sectionDir) throw new Error("Section directory 014 not found");

const bookDir = fs
  .readdirSync(path.join(corpusDir, sectionDir))
  .find((name) => name.startsWith("003."));
if (!bookDir) throw new Error("Book directory 003 not found");

const sourceDir = path.join(corpusDir, sectionDir, bookDir);
const decoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const quotePattern = /[“「『]([^”」』]{1,320})[”」』]/g;
const triggerPatterns = [
  { name: "classics", pattern: /孔子|孟子|庄子|老子|论语|孟子|史记|礼记|诗经|左传|春秋|资治通鉴|战国策|韩非|荀子|楚辞|汉书|唐诗|宋词|古人|古语|成语|典故|古典|曰|云|所谓|谚|俗话|歇后语/ },
  { name: "poem", pattern: /诗|词|句|联|歌|赋|七绝|五绝|唐诗|宋词|苏轼|杜甫|李白|白居易|王维|陆游|辛弃疾/ },
  { name: "foreign", pattern: /英文|法文|拉丁|希腊|美国|英国|法国|德国|俄国|教皇|圣经|新约|旧约|耶稣|拿破仑|甘地|罗素|莎士比亚|J\.|W\.|[A-Za-z]{4,}/ },
  { name: "proverb", pattern: /谚语|俗语|俗话|格言|名言|座右铭|歇后语|说法|口头禅/ },
];

const politicalPattern =
  /国民党|共产党|中共|民进党|党外|党|三民主义|政治|政党|政府|政权|总统|领袖|国父|革命|反共|反攻|复国|统一|独立|民主|自由|人权|宪法|司法|法院|法官|自诉|诽谤|戒严|军法|选举|立委|立法院|监察院|行政院|考试院|司法院|台湾|大陆|蒋|孙中山|李登辉|陈水扁|郑南榕|康宁祥|蓬莱岛|美丽岛/;

const rows = [];

for (const file of files) {
  const text = decoder.decode(fs.readFileSync(path.join(sourceDir, file)));
  const lines = text.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const markers = triggerPatterns
      .filter(({ pattern }) => pattern.test(line))
      .map(({ name }) => name);
    const political = politicalPattern.test(line) ? "political-context" : "";

    const quotes = [];
    let match;
    while ((match = quotePattern.exec(line)) !== null) {
      quotes.push(match[1]);
    }
    quotePattern.lastIndex = 0;

    if (quotes.length === 0 && markers.length === 0) continue;

    if (quotes.length === 0) {
      rows.push({
        file,
        line: index + 1,
        quoteText: "",
        markers: markers.join(","),
        political,
        previous: lines[index - 1] || "",
        context: line,
        next: lines[index + 1] || "",
      });
      continue;
    }

    for (const quoteText of quotes) {
      rows.push({
        file,
        line: index + 1,
        quoteText,
        markers: markers.join(","),
        political,
        previous: lines[index - 1] || "",
        context: line,
        next: lines[index + 1] || "",
      });
    }
  }
}

fs.mkdirSync(path.join(process.cwd(), "analysis"), { recursive: true });
const outJson = path.join("analysis", "liao_law_eye_taiwan_quote_candidates.json");
const outTsv = path.join("analysis", "liao_law_eye_taiwan_review_candidates.tsv");
fs.writeFileSync(outJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

const header = ["file", "line", "markers", "political", "quoteText", "previous", "context", "next"];
const lines = [
  header.join("\t"),
  ...rows.map((row) =>
    header
      .map((key) => String(row[key] ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " "))
      .join("\t"),
  ),
];
fs.writeFileSync(outTsv, `${lines.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      sourceDir,
      files: files.length,
      rows: rows.length,
      outJson,
      outTsv,
    },
    null,
    2,
  ),
);
