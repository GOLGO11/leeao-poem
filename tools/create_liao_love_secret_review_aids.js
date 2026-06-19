const fs = require("fs");
const path = require("path");

const bookRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "005.诗集语录类",
  "001.爱情的秘密",
);
const candidatesPath = path.join("analysis", "liao_love_secret_quote_candidates.json");
const analysisDir = path.join(process.cwd(), "analysis");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(bookRoot)
  .filter((file) => file.endsWith(".txt"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const lineMap = new Map();
for (const file of files) {
  const text = sourceDecoder.decode(fs.readFileSync(path.join(bookRoot, file))).replace(/\r\n/g, "\n");
  lineMap.set(file, text.split("\n"));
}

const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8"));

const externalCuePattern =
  /译|原文|原诗|原词|原题|英文|英诗|中译|译文|他说|写道|写过|引用|引出|俗话|古人说|古话|所谓|典故|成语|名句|诗句|《[^》]+》|莎士比亚|Shakespeare|布莱克|Blake|邓恩|Donne|桑塔亚纳|Santayana|蒂斯代尔|Teasdale|马洛礼|Malory|亚瑟王|Arthur|Gordon|Danny Boy|丹尼|Yeats|叶慈|Frost|弗罗斯特|Leda|丽达|Swan|天鹅|Napoleon|拿破仑|杜甫|苏轼|李白|陶渊明|辛弃疾|岳飞|李煜|王羲之|孟子|论语|老子|庄子|楚辞|诗经|佛|禅/;
const selfAuthoredCuePattern =
  /狱中作|作此诗|感而有诗|我写|我作|自赞|李诗|情诗|打油|改成|我译|我的译诗|我把它意译|我曾把|198[0-9]年|197[0-9]年|李敖影音|李敖数字博物馆|李敖资源下载站|李敖档案馆/;
const politicalPattern =
  /国民党|共产党|中共|国共|政治|人权|革命|叛乱|监狱|军法|警备|政府|国家|总统|主席|部长|发禁|判|党|台湾|中国|民主|自由|独裁|暴政|政权|党国|反共|中立|打倒|建设|破坏/;
const quoteLikePattern =
  /诗|词|歌|联|原文|原诗|原词|译文|译诗|俗话|古人说|古话|成语|典故|名句|格言|名言|谚|曰|云|said|poem|song|proverb/;

function compact(value, size = 360) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return Array.from(text).length > size ? `${Array.from(text).slice(0, size).join("")}...` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
}

function writeTsv(fileName, rows, header) {
  const lines = [header.join("\t"), ...rows.map((row) => header.map((key) => tsvEscape(row[key])).join("\t"))];
  fs.writeFileSync(path.join(analysisDir, fileName), `${lines.join("\n")}\n`, "utf8");
}

function contextAround(file, line, radius = 2) {
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
    if (!externalCuePattern.test(line) && !quoteLikePattern.test(line)) return;
    keywordRows.push({
      file,
      line: index + 1,
      text: compact(line, 480),
      context: compact(contextAround(file, index + 1), 760),
      flags: [
        externalCuePattern.test(line) ? "external-cue" : "",
        selfAuthoredCuePattern.test(line) ? "self-authored-cue" : "",
        politicalPattern.test(line) ? "political-cue" : "",
      ]
        .filter(Boolean)
        .join(","),
    });
  });
}

const quoteRows = candidates.filter((row) => row.kind === "quote");
const externalRows = [];
const plausibleRows = [];
const selfNoiseRows = [];
const politicalRows = [];

for (const row of quoteRows) {
  const text = row.text.trim();
  const context = row.context.trim();
  const len = Array.from(text).length;
  let score = 0;
  const reasons = [];

  if (externalCuePattern.test(text) || externalCuePattern.test(context)) {
    score += 6;
    reasons.push("external-cue");
  }
  if (quoteLikePattern.test(text) || quoteLikePattern.test(context)) {
    score += 3;
    reasons.push("quote-like");
  }
  if (/^[A-Za-z][A-Za-z0-9\s,'?.;:!()\-’]+$/.test(text) && len >= 12) {
    score += 3;
    reasons.push("latin-text");
  }
  if (/^[\u4e00-\u9fff，、；：？！“”‘’（）《》\s]+$/.test(text) && len >= 4 && len <= 140) {
    score += 1;
    reasons.push("chinese-compact");
  }
  if (selfAuthoredCuePattern.test(context) || selfAuthoredCuePattern.test(text)) {
    score -= 3;
    reasons.push("self-authored-cue");
  }
  if (politicalPattern.test(context) || politicalPattern.test(text)) {
    reasons.push("political-cue");
  }
  if (/^(好吧|好哇|中|癣|屁|文|处理|滥情|寒冬|仇敌|发禁)$/.test(text)) {
    score -= 5;
    reasons.push("fragment");
  }

  const out = {
    score,
    file: row.file,
    line: row.line,
    text,
    reasons: reasons.join(","),
    context: compact(context, 680),
  };

  if (externalCuePattern.test(text) || externalCuePattern.test(context)) externalRows.push(out);
  if (score >= 4) plausibleRows.push(out);
  if (selfAuthoredCuePattern.test(context) || selfAuthoredCuePattern.test(text)) selfNoiseRows.push(out);
  if (politicalPattern.test(context) || politicalPattern.test(text)) politicalRows.push(out);
}

function sortRows(rows) {
  return rows.sort(
    (a, b) =>
      b.score - a.score ||
      a.file.localeCompare(b.file, "zh-Hans-CN") ||
      a.line - b.line ||
      a.text.localeCompare(b.text, "zh-Hans-CN"),
  );
}

sortRows(externalRows);
sortRows(plausibleRows);
sortRows(selfNoiseRows);
sortRows(politicalRows);

writeTsv("liao_love_secret_keyword_lines.tsv", keywordRows, ["file", "line", "text", "context", "flags"]);
writeTsv("liao_love_secret_keyword_lines_short.tsv", keywordRows.slice(0, 500), ["file", "line", "text", "flags"]);
writeTsv("liao_love_secret_external_cues.tsv", externalRows, ["score", "file", "line", "text", "reasons", "context"]);
writeTsv("liao_love_secret_plausible_quotes.tsv", plausibleRows, ["score", "file", "line", "text", "reasons", "context"]);
writeTsv("liao_love_secret_self_authored_noise.tsv", selfNoiseRows, ["score", "file", "line", "text", "reasons", "context"]);
writeTsv("liao_love_secret_high_risk_political.tsv", politicalRows, ["score", "file", "line", "text", "reasons", "context"]);

console.log(
  JSON.stringify(
    {
      keywordRows: keywordRows.length,
      externalRows: externalRows.length,
      plausibleRows: plausibleRows.length,
      selfNoiseRows: selfNoiseRows.length,
      politicalRows: politicalRows.length,
    },
    null,
    2,
  ),
);
