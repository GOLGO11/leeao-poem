const fs = require("fs");
const path = require("path");

const bookRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "004.小说剧本类",
  "005.阳痿美国",
);
const candidatesPath = path.join("analysis", "liao_yangwei_usa_quote_candidates.json");
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
  /诗|词|曰|云|所谓|古人|古书|古话|孔子|孟子|老子|庄子|荀子|韩非子|左传|史记|资治通鉴|世说新语|圣经|旧约|新约|耶稣|上帝|箴言|诗篇|福音|莎士比亚|Shakespeare|弥尔顿|Milton|拜伦|Byron|惠特曼|Whitman|爱默生|Emerson|马克吐温|Twain|托克维尔|Tocqueville|普鲁塔克|Plutarch|荷马|Homer|希腊|罗马|拉丁|谚|俗话|俗语|成语|名言|格言|名句|箴|联|对联|题词|有言|说过|曰|云|quote|says|Bible|Lord|God|Jesus|Liberty|justice|virtue|truth|freedom|never|always/;
const likelyQuotePattern =
  /圣经|诗篇|箴言|旧约|新约|上帝|耶稣|孔子|孟子|老子|庄子|左传|史记|莎士比亚|Shakespeare|弥尔顿|Milton|拜伦|Byron|惠特曼|Whitman|爱默生|Emerson|马克吐温|Twain|托克维尔|Tocqueville|普鲁塔克|Plutarch|荷马|Homer|古人说|古话说|俗话|成语|谚语|格言|名言|名句|诗云|书曰|曰|云|God|Lord|Jesus|Bible|To be|truth|virtue|justice/;
const highRiskPoliticalPattern =
  /美国|总统|华盛顿|杰斐逊|林肯|罗斯福|肯尼迪|尼克松|奥巴马|国会|政府|宪法|独立宣言|民主|自由|人权|战争|军|国务|外交|政党|共和党|民主党|政治|国家|领土|殖民|印第安|总统演说|宣言|法案|最高法院|白宫|Congress|President|Constitution|Declaration|democracy|liberty|freedom|war|army|government|state/;
const institutionalPattern =
  /条约|宣言|宪法|法案|演说|就职|国情咨文|总统令|判决|外交文件|国会|政府|白宫|国务院|Constitution|Declaration|Address|Congress|Court|Act|Treaty/;
const talkyPattern =
  /^(为什么|什么|真的吗|怎么|好吧|可是|当然|没有|谢谢|噢|啊|我知道|你说什么|好不好|哪一种|是谁|够了|好了|来|现在|不行|是|不是|对|不对|不要|可以|没错|审判长|被告)[，？！。…]*$/;

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
      text: compact(line, 380),
      context: compact(contextAround(file, index + 1), 580),
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
  if (triggerPattern.test(context)) {
    score += 3;
    reasons.push("trigger-context");
  }
  if (/[，；、：]/.test(text) && len >= 6) {
    score += 2;
    reasons.push("punctuated");
  }
  if (/^[\u4e00-\u9fff，、；：？！“”‘’（）《》〈〉\s]+$/.test(text) && len >= 4 && len <= 120) {
    score += 1;
    reasons.push("chinese-compact");
  }
  if (/^[A-Za-z][A-Za-z\s,'?.;:!()\\-]{10,}$/.test(text)) {
    score += 2;
    reasons.push("latin-sentence");
  }
  if (talkyPattern.test(text)) {
    score -= 5;
    reasons.push("dialogue-filler");
  }
  if (institutionalPattern.test(context) || institutionalPattern.test(text)) {
    score -= 2;
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
    context: compact(context, 480),
  };

  if (likelyQuotePattern.test(text) || likelyQuotePattern.test(context)) {
    knownRows.push(out);
  }
  if ((highRiskPoliticalPattern.test(context) || highRiskPoliticalPattern.test(text)) && score >= 2) {
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

writeTsv("liao_yangwei_usa_keyword_lines.tsv", keywordRows, [
  "file",
  "line",
  "text",
  "context",
]);
writeTsv("liao_yangwei_usa_keyword_lines_short.tsv", keywordRows.slice(0, 420), [
  "file",
  "line",
  "text",
]);
writeTsv("liao_yangwei_usa_plausible_quotes.tsv", plausibleRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);
writeTsv("liao_yangwei_usa_known_quote_matches.tsv", knownRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);
writeTsv("liao_yangwei_usa_high_risk_noise.tsv", highRiskRows, [
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
