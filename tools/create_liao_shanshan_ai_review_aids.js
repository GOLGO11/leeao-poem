const fs = require("fs");
const path = require("path");

const bookRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "004.小说剧本类",
  "002.上山·上山·爱",
);
const candidatesPath = path.join("analysis", "liao_shanshan_ai_quote_candidates.json");
const analysisDir = path.join(process.cwd(), "analysis");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(bookRoot)
  .filter((file) => file.endsWith(".txt"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const lineMap = new Map();
for (const file of files) {
  const text = sourceDecoder
    .decode(fs.readFileSync(path.join(bookRoot, file)))
    .replace(/\r\n/g, "\n");
  lineMap.set(file, text.split("\n"));
}

const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8"));

const triggerPattern =
  /诗|词|曰|云|所谓|古人|孔子|孟子|庄子|老子|鲁迅|胡适|莎士比亚|谚|俗话|俗语|古语|成语|名言|格言|名句|联|对联|题词|书曰|诗云|语曰|说过|有言|箴|歌|歌词|唱|经|佛|圣经|易经|拜伦|徐志摩|苏东坡|苏轼|李白|杜甫|白居易|辛弃疾|王安石|元遗山|梭罗|巴斯噶|孟子说|孔夫子说|外国诗人|英文谚语|西方谚语|东方谚语/;
const likelyQuotePattern =
  /虽千万人|得志与民由之|百尺竿头|乘兴而来|深夜黠鼠|死生有命|富贵在天|不立乎岩墙|舜何人|予何人|有为者|牵一发|一着错|遇合有缘|因缘际会|小不忍|大节不逾|杀身成仁|舍身取义|人无远虑|必有近忧|傻人有傻福|有情人|终成眷属|女子无才|谈笑间|强虏灰飞烟灭|形而上者谓之道|形而下者谓之器|焉知原上|天下有情人|衣带渐宽|为伊消得|不知周之梦|胡蝶之梦|飞来峰上|不畏浮云|天若有情|然后就去远行|只爱一点点|嘲风雪|弄花草|救济人病|裨补时阙|老妪能解|往往哼之达旦|人心死尽|我辈不可死|浮云游子意|落日故人情|情人何憔悴|Why so Pale|He that is not handsome|A Woman's advice|learned woman/;
const highRiskPoliticalPattern =
  /国民党|共产党|中共|政府|伪政府|总统|独裁|极权|叛乱|查禁|统战|战斗文艺|革命|人权|自由|民主|党|政权|惩治叛乱条例|白色恐怖|蓝色统治|政治|竞选|选举|立法院|监察院|法院|警察|情治|国安局|蒋介石|毛泽东/;
const artTitlePattern =
  /^(露妮|结领带的女郎|罗洛蒂|基斯林|史丁像|当代家庭|拓扑学|板桥杂记|失乐园|儿童的诗园|鹅湖之会|菊石|蓝色魔鬼岛|大英百科全书|乱世佳人|少年维特之烦恼)$/;
const talkyPattern =
  /^(为什么|什么|真的吗|怎么|好吧|可是|当然|没有|谢谢|噢|啊|天啊|我知道|你说什么|好不好|哪一种|是谁|够了|好了|来|现在)[，？！。…]*$/;

function compact(value, size = 220) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return Array.from(text).length > size
    ? `${Array.from(text).slice(0, size).join("")}...`
    : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
}

function writeTsv(fileName, rows, header) {
  const lines = [
    header.join("\t"),
    ...rows.map((row) => header.map((key) => tsvEscape(row[key])).join("\t")),
  ];
  fs.writeFileSync(path.join(analysisDir, fileName), `${lines.join("\n")}\n`, "utf8");
}

function contextAround(file, line, radius = 1) {
  const lines = lineMap.get(file) || [];
  const start = Math.max(1, line - radius);
  const end = Math.min(lines.length, line + radius);
  return lines
    .slice(start - 1, end)
    .map((text, offset) => `${start + offset}: ${text.trim()}`)
    .join(" / ");
}

const keywordRows = [];
for (const [file, lines] of lineMap) {
  lines.forEach((line, index) => {
    if (!triggerPattern.test(line) && !likelyQuotePattern.test(line)) return;
    keywordRows.push({
      file,
      line: index + 1,
      text: compact(line, 360),
      context: compact(contextAround(file, index + 1), 520),
    });
  });
}

const quoteRows = candidates.filter((row) => row.kind === "quote");
const plausibleRows = [];
const knownRows = [];
const noiseRows = [];

for (const row of quoteRows) {
  const text = row.text.trim();
  const context = row.context.trim();
  const len = Array.from(text).length;
  let score = 0;
  const reasons = [];

  if (likelyQuotePattern.test(text) || likelyQuotePattern.test(context)) {
    score += 6;
    reasons.push("known-pattern");
  }
  if (triggerPattern.test(context)) {
    score += 3;
    reasons.push("trigger-context");
  }
  if (/[，；、：]/.test(text) && len >= 6) {
    score += 2;
    reasons.push("punctuated");
  }
  if (/^[\u4e00-\u9fff，、；：？！“”‘’（）《》·…—\s]+$/.test(text) && len >= 4 && len <= 90) {
    score += 1;
    reasons.push("chinese-compact");
  }
  if (/^[A-Za-z][A-Za-z\s,'?.;:，．-]{12,}$/.test(text)) {
    score += 2;
    reasons.push("latin-sentence");
  }
  if (artTitlePattern.test(text) || talkyPattern.test(text)) {
    score -= 5;
    reasons.push("mundane-title-or-dialogue");
  }
  if (highRiskPoliticalPattern.test(context)) {
    reasons.push("political-context");
  }

  const out = {
    score,
    file: row.file,
    line: row.line,
    text,
    reasons: reasons.join(","),
    context: compact(context, 420),
  };

  if (likelyQuotePattern.test(text) || likelyQuotePattern.test(context)) {
    knownRows.push(out);
  }
  if (highRiskPoliticalPattern.test(context) && score >= 3) {
    noiseRows.push(out);
  }
  if (score >= 4) {
    plausibleRows.push(out);
  }
}

plausibleRows.sort(
  (a, b) =>
    b.score - a.score ||
    a.file.localeCompare(b.file, "zh-Hans-CN") ||
    a.line - b.line ||
    a.text.localeCompare(b.text, "zh-Hans-CN"),
);
knownRows.sort(
  (a, b) =>
    a.file.localeCompare(b.file, "zh-Hans-CN") ||
    a.line - b.line ||
    a.text.localeCompare(b.text, "zh-Hans-CN"),
);
noiseRows.sort(
  (a, b) =>
    a.file.localeCompare(b.file, "zh-Hans-CN") ||
    a.line - b.line ||
    a.text.localeCompare(b.text, "zh-Hans-CN"),
);

writeTsv("liao_shanshan_ai_keyword_lines.tsv", keywordRows, [
  "file",
  "line",
  "text",
  "context",
]);
writeTsv("liao_shanshan_ai_keyword_lines_short.tsv", keywordRows.slice(0, 260), [
  "file",
  "line",
  "text",
]);
writeTsv("liao_shanshan_ai_plausible_quotes.tsv", plausibleRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);
writeTsv("liao_shanshan_ai_known_quote_matches.tsv", knownRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);
writeTsv("liao_shanshan_ai_high_risk_noise.tsv", noiseRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);

console.log(
  JSON.stringify(
    {
      keywordRows: keywordRows.length,
      plausibleRows: plausibleRows.length,
      knownRows: knownRows.length,
      highRiskNoiseRows: noiseRows.length,
    },
    null,
    2,
  ),
);
