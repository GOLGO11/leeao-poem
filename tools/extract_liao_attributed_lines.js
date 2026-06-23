const fs = require("fs");
const path = require("path");

const [targetRootArg, outPathArg] = process.argv.slice(2);

if (!targetRootArg || !outPathArg) {
  console.error("Usage: node tools/extract_liao_attributed_lines.js <targetRoot> <outPath>");
  process.exit(2);
}

const targetRoot = path.resolve(process.cwd(), targetRootArg);
const outPath = path.resolve(process.cwd(), outPathArg);
const sourceDecoder = new TextDecoder("gb18030");

const patterns = [
  "说：",
  "说“",
  "曰：",
  "云：",
  "道：",
  "古人说",
  "古时",
  "俗话",
  "谚语",
  "常言",
  "诗说",
  "词说",
  "所谓",
  "《",
  "》",
];

const skipPrefixes = ["李敖影音", "李敖数字", "油管", "抖音", "西瓜", "小红书", "哔哩哔哩"];
const rows = [];

for (const file of fs.readdirSync(targetRoot).filter((name) => name.endsWith(".txt") && !name.includes("目录"))) {
  const lines = sourceDecoder.decode(fs.readFileSync(path.join(targetRoot, file))).split(/\r?\n/);
  lines.forEach((line, index) => {
    const text = line.trim();
    if (!text || skipPrefixes.some((prefix) => text.startsWith(prefix))) return;
    if (patterns.some((pattern) => text.includes(pattern))) {
      rows.push({ file, line: index + 1, text });
    }
  });
}

const tsv = [
  "file\tline\ttext",
  ...rows.map((row) => [row.file, row.line, row.text].join("\t")),
];

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `\uFEFF${tsv.join("\n")}\n`, "utf8");

console.log(JSON.stringify({ targetRoot: targetRootArg, rows: rows.length, outPath: outPathArg }, null, 2));
