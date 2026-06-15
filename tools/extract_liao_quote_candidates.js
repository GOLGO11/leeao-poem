const fs = require("fs");
const path = require("path");

const targetRoot =
  process.argv[2] ||
  path.join("《大李敖全集6.0》分章节", "001.自传回忆类", "001.李敖自传与回忆");
const outPath =
  process.argv[3] ||
  path.join("analysis", "liao_autobiography_quote_candidates.json");

const quotePattern = /“([^”]{1,220})”/g;
const keywordPattern =
  /诗|词|曰|云|所谓|古人|孔子|孟子|鲁迅|胡适|歌德|莎士比亚|谚|俗话|俗语|古语|成语|名言|格言|名句|联|对联|题词|书曰|诗云|语曰|说过|有言|箴/;
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(targetRoot)
  .filter((file) => file.endsWith(".txt"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const rows = [];

for (const file of files) {
  const fullPath = path.join(targetRoot, file);
  const text = sourceDecoder
    .decode(fs.readFileSync(fullPath))
    .replace(/\r\n/g, "\n");
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    const context = line.trim();
    if (!context) return;

    let match;
    quotePattern.lastIndex = 0;
    while ((match = quotePattern.exec(line)) !== null) {
      rows.push({
        file,
        line: index + 1,
        kind: "quote",
        text: match[1],
        context,
      });
    }

    if (keywordPattern.test(line)) {
      rows.push({
        file,
        line: index + 1,
        kind: "keyword_line",
        text: "",
        context,
      });
    }
  });
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), "utf8");

const quoteRows = rows.filter((row) => row.kind === "quote");
console.log(
  JSON.stringify(
    {
      targetRoot,
      files: files.length,
      quoteCandidates: quoteRows.length,
      uniqueQuoteTexts: new Set(quoteRows.map((row) => row.text)).size,
      keywordLines: rows.length - quoteRows.length,
      outPath,
    },
    null,
    2,
  ),
);
