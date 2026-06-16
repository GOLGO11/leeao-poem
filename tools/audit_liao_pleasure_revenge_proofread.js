const fs = require("fs");
const path = require("path");

const sourceRoot =
  process.argv[2] ||
  path.join("《大李敖全集6.0》分章节", "001.自传回忆类", "005.李敖快意恩仇录");
const csvPath =
  process.argv[3] || path.join("exports", "李敖快意恩仇录_诗文格言歌谣引用.csv");
const outPath =
  process.argv[4] || path.join("analysis", "liao_pleasure_revenge_proofread_audit.tsv");

const sourceDecoder = new TextDecoder("gb18030");
const compact = (value, size = 260) => {
  const text = String(value).replace(/\s+/g, " ").trim();
  return Array.from(text).length > size
    ? `${Array.from(text).slice(0, size).join("")}...`
    : text;
};
const esc = (value) => String(value).replace(/\t/g, " ").replace(/\r?\n/g, " / ");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;
  const cleanText = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < cleanText.length; index += 1) {
    const char = cleanText[index];
    const next = cleanText[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        value += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value.replace(/\r$/, ""));
    rows.push(row);
  }

  const header = rows.shift().map((name) => name.replace(/^\uFEFF/, ""));
  return rows
    .filter((cells) => cells.some((cell) => cell !== ""))
    .map((cells) =>
      Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""])),
    );
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const recordsByFile = new Map();
for (const record of rows) {
  if (!recordsByFile.has(record.source_file)) recordsByFile.set(record.source_file, []);
  recordsByFile.get(record.source_file).push(record);
}

const keywordPattern =
  /诗说|有诗|题诗|妙诗|歪诗|反宗教诗|名句|名言|格言|俗话|俗语|谚语|古话|成语|对联|联语|所云|所谓|曰|云|说过|说：“|诗云|语云|《诗经》|《论语》|《孟子》|《庄子》|《列子》|《老子》|《墨子》|《中庸》|《大学》|《史记》|《战国策》|《水浒传》|《金刚经》|《成唯识论》|《维摩诘所说经》|《宗镜录》|顾贞观|龚定盦|王安石|陆游|杜甫|鲁迅|苏东坡|苏轼|严复|胡适|勃朗宁|富兰克林|萧伯纳|亚里士多德|拉斯金|耶稣|歌|歌词|童谣|打油诗|厕所文学/;

const skipFilePattern = /目录/;
const auditRows = [["file", "line", "covered_ids", "context"]];

for (const file of fs
  .readdirSync(sourceRoot)
  .filter((name) => name.endsWith(".txt"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))) {
  if (skipFilePattern.test(file)) continue;
  const lines = sourceDecoder.decode(fs.readFileSync(path.join(sourceRoot, file))).split(/\r?\n/);
  const records = recordsByFile.get(file) || [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const context = line.trim();
    if (!context || !keywordPattern.test(context)) return;
    const covered = records
      .filter(
        (record) =>
          Number(record.line_start) <= lineNumber && lineNumber <= Number(record.line_end),
      )
      .map((record) => record.id)
      .join("|");
    auditRows.push([file, lineNumber, covered, compact(context)]);
  });
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, auditRows.map((row) => row.map(esc).join("\t")).join("\n"), "utf8");

const uncovered = auditRows.slice(1).filter((row) => !row[2]).length;
console.log(
  JSON.stringify(
    {
      rows: auditRows.length - 1,
      uncovered,
      covered: auditRows.length - 1 - uncovered,
      outPath,
    },
    null,
    2,
  ),
);
