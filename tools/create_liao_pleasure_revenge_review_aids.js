const fs = require("fs");
const path = require("path");

const sourceRoot =
  process.argv[2] ||
  path.join("《大李敖全集6.0》分章节", "001.自传回忆类", "005.李敖快意恩仇录");
const candidatePath =
  process.argv[3] || path.join("analysis", "liao_pleasure_revenge_quote_candidates.json");

const outKeywordPath = path.join("analysis", "liao_pleasure_revenge_keyword_lines.tsv");
const outKeywordShortPath = path.join(
  "analysis",
  "liao_pleasure_revenge_keyword_lines_short.tsv",
);
const outPlausiblePath = path.join("analysis", "liao_pleasure_revenge_plausible_quotes.tsv");

const sourceDecoder = new TextDecoder("gb18030");
const compact = (value, size = 360) => {
  const text = String(value).replace(/\s+/g, " ").trim();
  return Array.from(text).length > size
    ? `${Array.from(text).slice(0, size).join("")}...`
    : text;
};
const esc = (value) => String(value).replace(/\t/g, " ").replace(/\r?\n/g, " ");

const keywordPattern =
  /诗说|杜甫诗|有诗|题诗|妙诗|歪诗|反宗教诗|顾贞观|金缕曲|古话|俗话|俗语|古语|谚|格言|名言|名句|对联|联语|所谓|曰|云|孔子|孟子|论语|金刚经|圣经|莎士比亚|歌德|亚里士多德|王安石|鲁迅|苏轼|龚定盦|顾亭林|王婆|史记|战国策|唱|歌词|儿歌|歌谣/;
const quoteContextPattern =
  /诗|词|曰|云|所谓|古人|孔子|孟子|鲁迅|胡适|歌德|莎士比亚|谚|俗话|俗语|古语|成语|名言|格言|名句|联|对联|题词|诗云|语曰|说过|有言|箴|歌|王安石|杜甫|顾亭林|苏轼|龚定盦/;

const files = fs
  .readdirSync(sourceRoot)
  .filter((file) => file.endsWith(".txt"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const keywordRows = [["file", "line", "context"]];
const keywordShortRows = [["file", "line", "context"]];
for (const file of files) {
  const text = sourceDecoder
    .decode(fs.readFileSync(path.join(sourceRoot, file)))
    .replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const context = line.trim();
    if (context && keywordPattern.test(context)) {
      keywordRows.push([file, index + 1, compact(context, 420)]);
      keywordShortRows.push([file, index + 1, compact(context, 160)]);
    }
  });
}

const candidates = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const plausibleRows = [["file", "line", "text", "context"]];
for (const row of candidates) {
  if (row.kind !== "quote") continue;
  const length = Array.from(row.text.trim()).length;
  if (length < 4 || length > 80) continue;
  if (!quoteContextPattern.test(row.context)) continue;
  plausibleRows.push([row.file, row.line, row.text, compact(row.context, 360)]);
}

fs.mkdirSync("analysis", { recursive: true });
fs.writeFileSync(
  outKeywordPath,
  keywordRows.map((row) => row.map(esc).join("\t")).join("\n"),
  "utf8",
);
fs.writeFileSync(
  outKeywordShortPath,
  keywordShortRows.map((row) => row.map(esc).join("\t")).join("\n"),
  "utf8",
);
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
      plausibleQuotes: plausibleRows.length - 1,
      outKeywordPath,
      outKeywordShortPath,
      outPlausiblePath,
    },
    null,
    2,
  ),
);
