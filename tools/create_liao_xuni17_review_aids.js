const fs = require("fs");
const path = require("path");

const bookRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "004.小说剧本类",
  "004.虚拟的十七岁",
);
const candidatesPath = path.join("analysis", "liao_xuni17_quote_candidates.json");
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
  /诗|词|曰|云|所谓|古人|古书|古话|孔子|孟子|老子|庄子|荀子|韩非子|列子|易经|礼记|左传|史记|资治通鉴|世说新语|红楼梦|西游记|水浒|三国|白鲸|十七帖|王羲之|王安石|陆游|苏东坡|李白|杜甫|陶渊明|曹操|阿基米|叔本华|尼采|歌德|莎士比亚|勃朗宁|Browning|海涅|甘地|林语堂|布达佩斯|谚|俗话|俗语|成语|名言|格言|名句|联|对联|题词|书曰|诗云|语曰|说过|有言|箴|佛经|禅|赵州|维摩|俱舍论|圣经|上帝|耶稣|箴言|道在屎溺|支点|摩尔定律|机器人|Robot|R\\.U\\.R\\./;
const likelyQuotePattern =
  /道在屎溺|非常异议可怪之论|维摩虽病有神通|游戏神通|但求灵药换凡骨|Where my heart lies|If God Himself was sitting|云何化生|虽有智慧|不如乘势|虽有镃基|不如待时|白日见鬼|白日见鬼|钱塘苏小是乡亲|道在|道在屎溺|诗中有画|画中有诗|坐看云起时|昭陵六骏|白鲸|Moby Dick|阿基米|给我一个支点|支点|兰亭序|十七帖|科技观|沙漏|少壮不努力|老大徒伤悲|自古英雄出少年|青出于蓝|行到水穷处|坐看云起时|老骥伏枥|志在千里|烈士暮年|壮心不已|存在即合理|人法地|地法天|天法道|道法自然|吾十有五而志于学|三十而立|四十而不惑|免于资讯的自由|Truth|Beauty|freedom|liberty|Never|always/;
const highRiskPoliticalPattern =
  /中华民国|国庆|革命|起义|政府|总统|孙中山|蒋介石|国民党|共产党|中共|毛泽东|反攻|台独|匪|人权|民主|自由|政策|情报|专案|长青专案|政治|独夫|党|国家|军事|机器人|核弹|原子弹/;
const talkyPattern =
  /^(为什么|什么|真的吗|怎么|好吧|可是|当然|没有|谢谢|噢|啊|我知道|你说什么|好不好|哪一种|是谁|够了|好了|来|现在|不行|是|不是|对|不对|不要|可以|没错)[，？！。…]*$/;

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

writeTsv("liao_xuni17_keyword_lines.tsv", keywordRows, ["file", "line", "text", "context"]);
writeTsv("liao_xuni17_keyword_lines_short.tsv", keywordRows.slice(0, 360), [
  "file",
  "line",
  "text",
]);
writeTsv("liao_xuni17_plausible_quotes.tsv", plausibleRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);
writeTsv("liao_xuni17_known_quote_matches.tsv", knownRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);
writeTsv("liao_xuni17_high_risk_noise.tsv", noiseRows, [
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
