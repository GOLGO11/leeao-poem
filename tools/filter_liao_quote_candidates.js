const fs = require("fs");
const path = require("path");

const inputPath =
  process.argv[2] ||
  path.join("analysis", "liao_autobiography_quote_candidates.json");
const outPath =
  process.argv[3] ||
  path.join("analysis", "liao_autobiography_review_candidates.tsv");

const rows = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const triggerPattern =
  /诗|词|曰|云|所谓|古人|孔子|孟子|鲁迅|胡适|歌德|莎士比亚|谚|俗话|俗语|古语|成语|名言|格言|名句|联|对联|题词|书曰|诗云|语曰|说过|有言|箴|句|原话|名士|俗话说|格言说/;
const poeticPattern =
  /[，、；：？！]|不亦|之|其|者|也|乎|哉|矣|兮|吾|汝|尔|君|公|师|天|地|人|生|死|心|身|道|德|仁|义|礼|智|信|忠|孝|勇|廉|耻|善|恶|贤|圣|佛|龙|虎|风|云|山|水|月|花|春|秋|东|西|南|北|古|今|明|暗|穷|达|富|贵|贫|贱|苦|乐|忧|愁|恨|爱|老|少|男|女|子|父|母|妻|兄|弟|友|客|主|家|国|天下|江湖|文章|读书|英雄|大丈夫|君子|小人|自由|独立|真理|革命|人权/;
const mundanePattern =
  /^(李敖|文星|北大|台大|国民党|共产党|中共|自由中国|中央日报|联合报|中国时报|读者文摘|中央研究院|调查局|警备总部|法务部|最高法院|高等法院|党外|民进党|立法院|监察院|北平|北京|台湾|上海|哈尔滨|台中|台北|美国|日本|苏俄|俄国|德国|法国|英文|日文|中文|国文|论文|助教|教授|学生|老师|同学|妈妈|爸爸|奶奶|爷爷|大爷|大娘|太太|先生|小姐)$/;

const byKey = new Map();
for (const row of rows) {
  if (row.kind !== "quote") continue;
  const text = row.text.trim();
  const context = row.context.trim();
  const len = Array.from(text).length;
  let score = 0;

  if (len >= 4 && len <= 42) score += 1;
  if (triggerPattern.test(context)) score += 3;
  if (poeticPattern.test(text)) score += 1;
  if (/[，、；]/.test(text)) score += 2;
  if (/^[\u4e00-\u9fff，、；：？！·—…]+$/.test(text)) score += 1;
  if (/^[^，、；：？！]{1,8}$/.test(text)) score -= 2;
  if (mundanePattern.test(text)) score -= 4;
  if (/^\d+$|^\d+年|^\d+月|^\d+日|^\d+岁/.test(text)) score -= 4;

  if (score < 3) continue;

  const key = `${text}\u0000${row.file}\u0000${row.line}`;
  byKey.set(key, { ...row, score });
}

const selected = [...byKey.values()].sort(
  (a, b) =>
    a.file.localeCompare(b.file, "zh-Hans-CN") ||
    a.line - b.line ||
    b.score - a.score,
);

const esc = (value) => String(value).replace(/\t/g, " ").replace(/\r?\n/g, " ");
const compact = (value, size = 180) => {
  const text = String(value).replace(/\s+/g, " ").trim();
  return Array.from(text).length > size
    ? `${Array.from(text).slice(0, size).join("")}...`
    : text;
};
const header = ["score", "file", "line", "text", "context"];
const lines = [header.join("\t")];
for (const row of selected) {
  lines.push(
    [row.score, row.file, row.line, row.text, compact(row.context)]
      .map(esc)
      .join("\t"),
  );
}
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({ inputPath, selected: selected.length, outPath }, null, 2));
