const fs = require("fs");
const path = require("path");

const sourceRoot =
  process.argv[2] ||
  path.join("《大李敖全集6.0》分章节", "001.自传回忆类", "006.李敖议坛哀思录");
const candidatePath =
  process.argv[3] || path.join("analysis", "liao_forum_mourning_quote_candidates.json");

const outKeywordPath = path.join("analysis", "liao_forum_mourning_keyword_lines.tsv");
const outTriggerPath = path.join("analysis", "liao_forum_mourning_trigger_candidates.tsv");
const outPlausiblePath = path.join("analysis", "liao_forum_mourning_plausible_quotes.tsv");

const sourceDecoder = new TextDecoder("gb18030");
const compact = (value, size = 360) => {
  const text = String(value).replace(/\s+/g, " ").trim();
  return Array.from(text).length > size ? `${Array.from(text).slice(0, size).join("")}...` : text;
};
const esc = (value) => String(value).replace(/\t/g, " ").replace(/\r?\n/g, " ");

const keywordPattern =
  /古诗|诗人|有诗|题诗|打油诗|诗说|词|俗话|古话|俗语|谚|成语|名言|格言|名句|孔子|孟子|论语|陆游|佛洛斯特|王闿运|洋鬼语云|上帝|圣经|小星星|周公|周易|易经|庄子|老子|林肯|麦克阿瑟|莎士比亚|歌|歌词|儿歌|对联|联语|曰|云|说过|有言/;

const quoteContextPattern =
  /古诗|诗人|有诗|题诗|诗说|俗话|古话|俗语|谚|成语|名言|格言|名句|孔子|孟子|论语|陆游|佛洛斯特|王闿运|洋鬼语云|上帝|圣经|小星星|周公|周易|易经|庄子|老子|林肯|麦克阿瑟|莎士比亚|歌|歌词|儿歌|对联|联语|曰|云|说过|有言/;

const files = fs
  .readdirSync(sourceRoot)
  .filter((file) => file.endsWith(".txt"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const keywordRows = [["file", "line", "context"]];
for (const file of files) {
  const text = sourceDecoder
    .decode(fs.readFileSync(path.join(sourceRoot, file)))
    .replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const context = line.trim();
    if (context && keywordPattern.test(context)) {
      keywordRows.push([file, index + 1, compact(context, 480)]);
    }
  });
}

const candidates = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const triggerRows = [["file", "line", "text", "context"]];
const plausibleRows = [["file", "line", "text", "context"]];
const seen = new Set();

for (const row of candidates) {
  if (row.kind !== "quote") continue;
  const text = row.text.trim();
  const context = row.context.trim();
  const length = Array.from(text).length;
  if (length < 3 || length > 180) continue;
  if (!quoteContextPattern.test(context)) continue;

  const key = `${row.file}\u0000${row.line}\u0000${text}`;
  if (seen.has(key)) continue;
  seen.add(key);

  triggerRows.push([row.file, row.line, text, compact(context, 420)]);
  if (
    length >= 4 &&
    length <= 90 &&
    !/^\d+$|^\d+年|^\d+月|^\d+日|国防部|立法院|民进党|国民党|美国|台湾$/.test(text)
  ) {
    plausibleRows.push([row.file, row.line, text, compact(context, 420)]);
  }
}

fs.mkdirSync("analysis", { recursive: true });
fs.writeFileSync(outKeywordPath, keywordRows.map((row) => row.map(esc).join("\t")).join("\n"), "utf8");
fs.writeFileSync(outTriggerPath, triggerRows.map((row) => row.map(esc).join("\t")).join("\n"), "utf8");
fs.writeFileSync(
  outPlausiblePath,
  plausibleRows.map((row) => row.map(esc).join("\t")).join("\n"),
  "utf8",
);

console.log(
  JSON.stringify(
    {
      sourceRoot,
      files: files.length,
      keywordLines: keywordRows.length - 1,
      triggerCandidates: triggerRows.length - 1,
      plausibleQuotes: plausibleRows.length - 1,
      outKeywordPath,
      outTriggerPath,
      outPlausiblePath,
    },
    null,
    2,
  ),
);
