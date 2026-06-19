const fs = require("fs");
const path = require("path");

const bookRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "004.小说剧本类",
  "006.第73烈士",
);
const candidatesPath = path.join("analysis", "liao_73lieshi_quote_candidates.json");
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

const literaryCuePattern =
  /诗|词|歌|赋|文|联|挽联|对联|楹联|古文|古书|古话|古语|典故|成语|俗话|谚语|格言|名言|名句|引文|原文|曰|云|所说|所谓|《论语》|孔子|孟子|老子|庄子|韩非|史记|资治通鉴|左传|尚书|易经|诗经|礼记|楚辞|陶渊明|李白|杜甫|白居易|苏轼|陆游|辛弃疾|文天祥|莎士比亚|Shakespeare|圣经|Bible|Jesus|God|佛|禅/;
const likelyQuotePattern =
  /诗|词|歌|赋|挽联|对联|楹联|古文|古话|古语|成语|俗话|谚语|格言|名言|名句|典故|孔子|孟子|老子|庄子|史记|左传|尚书|易经|诗经|圣经|莎士比亚|Shakespeare|Bible|God|Jesus|truth|virtue|justice|love|death|life/;
const highRiskPoliticalPattern =
  /革命|革命党|烈士|党|国民党|共产党|中共|党义|主义|三民主义|总理|孙中山|蒋介石|国父|政府|总统|国会|立法院|行政院|监狱|警备|宪法|法律|法庭|法院|判决|宣言|誓词|起义|暴动|黄花岗|辛亥|自由中国|台湾|中国|国家|民族|民权|民生|民主|自由|人权|独裁|军|战争|政治|选举|政权|革命军|同盟会|总统府|Congress|President|Constitution|Declaration|democracy|liberty|freedom|revolution|government|state|nation/;
const institutionalPattern =
  /宣言|誓词|遗嘱|党纲|党义|主义|演说|训词|告文|公告|判决|宪法|法律|条文|条约|法案|政府|国会|会议|大会|审判|法庭|法院|监狱|军法|军令|Declaration|Address|Act|Court|Congress|Constitution|party|government/;
const dialogueFillerPattern =
  /^(是|不是|没有|当然|好|好了|不行|可以|为什么|怎么样|我知道|我不知道|你说|他说|谢谢|报告|大人|师爷|委员|先生|小姐|太太|爸爸|妈妈|啊|哦|唉|嗯)[，。？！…]*$/;

function compact(value, size = 240) {
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
    if (!literaryCuePattern.test(line) && !likelyQuotePattern.test(line)) return;
    keywordRows.push({
      file,
      line: index + 1,
      text: compact(line, 420),
      context: compact(contextAround(file, index + 1), 640),
    });
  });
}

const quoteRows = candidates.filter((row) => row.kind === "quote");
const plausibleRows = [];
const knownRows = [];
const highRiskRows = [];

for (const row of quoteRows) {
  const text = row.text.trim();
  const context = row.context.trim();
  const len = Array.from(text).length;
  let score = 0;
  const reasons = [];

  if (likelyQuotePattern.test(text) || likelyQuotePattern.test(context)) {
    score += 7;
    reasons.push("known-pattern");
  }
  if (literaryCuePattern.test(context)) {
    score += 3;
    reasons.push("literary-context");
  }
  if (/[，、；：]/.test(text) && len >= 6) {
    score += 2;
    reasons.push("punctuated");
  }
  if (/^[\u4e00-\u9fff，、；：？！“”‘’（）《》\s]+$/.test(text) && len >= 4 && len <= 120) {
    score += 1;
    reasons.push("chinese-compact");
  }
  if (/^[A-Za-z][A-Za-z\s,'?.;:!()\-]{10,}$/.test(text)) {
    score += 2;
    reasons.push("latin-sentence");
  }
  if (dialogueFillerPattern.test(text)) {
    score -= 5;
    reasons.push("dialogue-filler");
  }
  if (institutionalPattern.test(context) || institutionalPattern.test(text)) {
    score -= 3;
    reasons.push("institutional");
  }
  if (highRiskPoliticalPattern.test(context) || highRiskPoliticalPattern.test(text)) {
    reasons.push("political-context");
  }

  const out = {
    score,
    file: row.file,
    line: row.line,
    text,
    reasons: reasons.join(","),
    context: compact(context, 520),
  };

  if (likelyQuotePattern.test(text) || likelyQuotePattern.test(context)) {
    knownRows.push(out);
  }
  if ((highRiskPoliticalPattern.test(context) || highRiskPoliticalPattern.test(text)) && score >= 1) {
    highRiskRows.push(out);
  }
  if (score >= 4) {
    plausibleRows.push(out);
  }
}

const sortRows = (rows) =>
  rows.sort(
    (a, b) =>
      b.score - a.score ||
      a.file.localeCompare(b.file, "zh-Hans-CN") ||
      a.line - b.line ||
      a.text.localeCompare(b.text, "zh-Hans-CN"),
  );

sortRows(plausibleRows);
sortRows(knownRows);
sortRows(highRiskRows);

writeTsv("liao_73lieshi_keyword_lines.tsv", keywordRows, [
  "file",
  "line",
  "text",
  "context",
]);
writeTsv("liao_73lieshi_keyword_lines_short.tsv", keywordRows.slice(0, 420), [
  "file",
  "line",
  "text",
]);
writeTsv("liao_73lieshi_plausible_quotes.tsv", plausibleRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);
writeTsv("liao_73lieshi_known_quote_matches.tsv", knownRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);
writeTsv("liao_73lieshi_high_risk_noise.tsv", highRiskRows, [
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
      highRiskNoiseRows: highRiskRows.length,
    },
    null,
    2,
  ),
);
