const fs = require("fs");
const path = require("path");

const sourceDir = path.join("《大李敖全集6.0》分章节", "015.雷霆法律类", "002.李敖刀笔集");
const selectedJson = path.join("analysis", "liao_daobi_selected_rows.json");
const lexiconHitsTsv = path.join("analysis", "liao_daobi_first_pass_lexicon_hits.tsv");
const outWeakTsv = path.join("analysis", "liao_daobi_proofread_weak_rows.tsv");
const outUnselectedLexiconTsv = path.join("analysis", "liao_daobi_proofread_unselected_lexicon_hits.tsv");
const outKeywordLinesTsv = path.join("analysis", "liao_daobi_proofread_keyword_lines.tsv");
const decoder = new TextDecoder("gb18030");

function parseTsv(text) {
  const [headerLine, ...lines] = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  const header = headerLine.split("\t");
  return lines
    .filter(Boolean)
    .map((line) => Object.fromEntries(line.split("\t").map((cell, index) => [header[index], cell])));
}

function esc(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function excerpt(value, size = 420) {
  return Array.from(String(value ?? "").replace(/\s+/g, " ").trim()).slice(0, size).join("");
}

const selectedRows = JSON.parse(fs.readFileSync(selectedJson, "utf8"));
const selectedTexts = new Set(selectedRows.map((row) => row.quote_text));

const weakCategories = new Set([
  "中文熟语",
  "李敖式文句",
  "李敖式题句",
  "中文格言式评语",
  "中文格言式文句",
  "中文格言式题句",
  "法律熟语",
]);
const weakRows = selectedRows.filter((row) => weakCategories.has(row.category));

const lexiconHits = parseTsv(fs.readFileSync(lexiconHitsTsv, "utf8"));
const unselectedLexiconHits = lexiconHits.filter((row) => !selectedTexts.has(row.quote));

const keywordPattern = /(西谚|法谚|谚语|格言|俗话|古人|子贡曰|曰：|曰“|云：|所谓|常识啊|名言|成语|熟语|俗语|曰)/;
const files = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
const keywordRows = [];
for (const file of files) {
  const lines = decoder.decode(fs.readFileSync(path.join(sourceDir, file))).split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (keywordPattern.test(line)) {
      keywordRows.push({ file, line: index + 1, context: excerpt(line) });
    }
  }
}

fs.mkdirSync(path.dirname(outWeakTsv), { recursive: true });
fs.writeFileSync(
  outWeakTsv,
  [
    ["id", "category", "quote_text", "source_file", "line_start", "summary"].join("\t"),
    ...weakRows.map((row) =>
      ["id", "category", "quote_text", "source_file", "line_start", "summary"]
        .map((column) => esc(row[column]))
        .join("\t"),
    ),
  ].join("\r\n") + "\r\n",
  "utf8",
);

fs.writeFileSync(
  outUnselectedLexiconTsv,
  [
    ["file", "line", "quote", "context"].join("\t"),
    ...unselectedLexiconHits.map((row) => ["file", "line", "quote", "context"].map((column) => esc(row[column])).join("\t")),
  ].join("\r\n") + "\r\n",
  "utf8",
);

fs.writeFileSync(
  outKeywordLinesTsv,
  [
    ["file", "line", "context"].join("\t"),
    ...keywordRows.map((row) => ["file", "line", "context"].map((column) => esc(row[column])).join("\t")),
  ].join("\r\n") + "\r\n",
  "utf8",
);

console.log(
  JSON.stringify(
    {
      weakRows: weakRows.length,
      unselectedLexiconHits: unselectedLexiconHits.length,
      keywordLines: keywordRows.length,
      outWeakTsv,
      outUnselectedLexiconTsv,
      outKeywordLinesTsv,
    },
    null,
    2,
  ),
);
