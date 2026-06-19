const fs = require("fs");
const path = require("path");

const bookRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "004.小说剧本类",
  "003.红色11",
);
const candidatesPath = path.join("analysis", "liao_hongse11_quote_candidates.json");
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
  /诗|词|曰|云|所谓|古人|孔子|孟子|老子|庄子|管仲|司马迁|淮南子|史记|圣经|新约|哥林多|梭罗|甘地|斯宾塞|戴布兹|范仲淹|文天祥|陆游|谚|俗话|俗语|古语|成语|名言|格言|名句|联|对联|题词|书曰|诗云|语曰|说过|有言|箴|唐诗|佛|禅|寓言|塞翁|管仲|因祸|祸福|先天下|后天下|仁者|不忧/;
const likelyQuotePattern =
  /此何遽不为福乎|此何遽不能为祸乎|塞翁失马|焉知非福|福之为祸|祸之为福|化不可极|深不可测|善因祸而为福|转败而为功|祸兮福之所倚|福兮祸之所伏|祸福无不自己求之者|祸之来也|福之来也|利与害为邻|他们抓了我|没有人能完全自由|仁者不忧|先天下之忧而忧|后天下之乐而乐|悠悠我心忧|生年不满百|常怀千岁忧|旧时|堂前燕|旧时王谢堂前燕|报应|因果律|善有善报|恶有恶报|种瓜得瓜|种豆得豆|神爱世人|赎罪|拯救|心亦不竞|何惮于病|虽千万人|非礼勿视|非礼勿听|非礼勿言|非礼勿动|色即是空|空即是色|风月无古今|情怀自浅深|大风起兮云飞扬|威加海内兮归故乡|朱门酒肉臭|路有冻死骨|移船相近邀相见|添酒回灯重开宴|封侯非我意|但愿海波平|满招损|谦受益|知其不可而为之|民为贵|社稷次之|君为轻|革命尚未成功|同志仍须努力/;
const highRiskPoliticalPattern =
  /国民党|共产党|中共|总统|政府|党国|调查局|军法|反政府|政治|政权|革命|红卫兵|台独|匪谍|特务|情报局|监狱|自由|民主|人权|政策|组织|坦白|审问|口供|判决|死刑|白色恐怖|独裁|领袖|选举/;
const talkyPattern =
  /^(为什么|什么|真的吗|怎么|好吧|可是|当然|没有|谢谢|噢|啊|我知道|你说什么|好不好|哪一种|是谁|够了|好了|来|现在|不行|是|不是|对|不对)[，？！。…]*$/;

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
  if (/^[\u4e00-\u9fff，、；：？！“”‘’（）《》〈〉\s]+$/.test(text) && len >= 4 && len <= 110) {
    score += 1;
    reasons.push("chinese-compact");
  }
  if (/^[A-Za-z][A-Za-z\s,'?.;:!-]{12,}$/.test(text)) {
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

writeTsv("liao_hongse11_keyword_lines.tsv", keywordRows, [
  "file",
  "line",
  "text",
  "context",
]);
writeTsv("liao_hongse11_keyword_lines_short.tsv", keywordRows.slice(0, 260), [
  "file",
  "line",
  "text",
]);
writeTsv("liao_hongse11_plausible_quotes.tsv", plausibleRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);
writeTsv("liao_hongse11_known_quote_matches.tsv", knownRows, [
  "score",
  "file",
  "line",
  "text",
  "reasons",
  "context",
]);
writeTsv("liao_hongse11_high_risk_noise.tsv", noiseRows, [
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
