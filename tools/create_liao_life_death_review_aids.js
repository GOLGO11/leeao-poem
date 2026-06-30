const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = path.resolve(__dirname, "..");
const BOOK = "李敖生死书";
const OUT_TSV = path.join(ROOT, "analysis", "liao_life_death_review_candidates.tsv");

const corpusDir = fs.readdirSync(ROOT).find((name) => name.includes("6.0"));
if (!corpusDir) throw new Error("Corpus directory not found");

const sectionDir = fs
  .readdirSync(path.join(ROOT, corpusDir))
  .find((name) => name.startsWith("016."));
if (!sectionDir) throw new Error("Section directory 016 not found");

const sourceBookDir = fs
  .readdirSync(path.join(ROOT, corpusDir, sectionDir))
  .find((name) => name.startsWith("010."));
if (!sourceBookDir) throw new Error("Source book directory 010 not found");

const SOURCE_DIR = path.join(ROOT, corpusDir, sectionDir, sourceBookDir);
const decoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(SOURCE_DIR)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const candidatePattern =
  /[“”‘’《》]|古人|诗|格言|曰|说：|道：|云|所谓|有言|引|题|联|铭|原诗|遗书|绝命|箴|谚|名句|为将之道|粉身碎骨|不降其志|不辱其身|未知生|焉知死|高山|流水|因果|自杀|死/;
const politicalContextPattern =
  /国民党|共产党|中共|民进党|中华民国|三民主义|总统|政府|政权|政党|党国|宪法|司法|立法院|行政院|选举|台湾|大陆|台独|统一|孙中山|蒋介石|蒋经国|李登辉|郑南榕|徐向前|李先念|西路军|革命|戒严|党外|毛泽东/;

function relativeSource(file) {
  return path.relative(ROOT, path.join(SOURCE_DIR, file)).split(path.sep).join("/");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[\t\r\n]/.test(text) ? text.replace(/\r?\n/g, "\\n") : text;
}

const selectedRows = JSON.parse(
  fs.readFileSync(path.join(ROOT, "analysis", "liao_life_death_selected_rows.json"), "utf8"),
);
const selectedLocs = new Set(
  selectedRows.map((row) => `${row.source_file}:${row.line_start}:${row.quote_text.replace(/\s+/g, "")}`),
);

const rows = [];
for (const file of files) {
  const sourceFile = relativeSource(file);
  const lines = decoder
    .decode(fs.readFileSync(path.join(SOURCE_DIR, file)))
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const text = lines[index].trim();
    if (!text || !candidatePattern.test(text)) continue;

    const context = lines
      .slice(Math.max(0, index - 1), Math.min(lines.length, index + 2))
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" / ");
    const selected = selectedRows.some(
      (row) => row.source_file === sourceFile && row.line_start <= lineNumber && row.line_end >= lineNumber,
    );

    rows.push({
      book: BOOK,
      source_file: sourceFile,
      line: lineNumber,
      selected: selected ? "yes" : "no",
      political_context: politicalContextPattern.test(context) ? "yes" : "no",
      text,
      context,
    });
  }
}

fs.mkdirSync(path.dirname(OUT_TSV), { recursive: true });
const columns = ["book", "source_file", "line", "selected", "political_context", "text", "context"];
const tsv = [
  columns.join("\t"),
  ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join("\t")),
].join("\r\n");
fs.writeFileSync(OUT_TSV, `${tsv}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book: BOOK,
      sourceDir: SOURCE_DIR,
      rows: rows.length,
      selectedRows: rows.filter((row) => row.selected === "yes").length,
      politicalContextRows: rows.filter((row) => row.political_context === "yes").length,
      outTsv: OUT_TSV,
    },
    null,
    2,
  ),
);
