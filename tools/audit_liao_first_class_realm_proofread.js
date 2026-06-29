const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const root = path.resolve(__dirname, "..");
const book = "第一流人的境界";
const sourceDir = path.join(
  root,
  "《大李敖全集6.0》分章节",
  "016.李敖祸台五十年庆祝十书",
  "002.第一流人的境界"
);
const decoder = new TextDecoder("gb18030");

const selectedPath = path.join(root, "analysis", "liao_first_class_realm_selected_rows.json");
const outTsv = path.join(root, "analysis", "liao_first_class_realm_proofread_audit.tsv");
const outReport = path.join(root, "analysis", "liao_first_class_realm_proofread_report.txt");

function readSource(fileName) {
  return decoder.decode(fs.readFileSync(path.join(sourceDir, fileName))).split(/\r?\n/);
}

const sourceCache = new Map();
function getLines(fileName) {
  if (!sourceCache.has(fileName)) sourceCache.set(fileName, readSource(fileName));
  return sourceCache.get(fileName);
}

function snippet(row, pad = 0) {
  const lines = getLines(row.source_file);
  const start = Math.max(1, Number(row.line_start) - pad);
  const end = Math.min(lines.length, Number(row.line_end) + pad);
  return lines.slice(start - 1, end).join(" ").replace(/\s+/g, " ").trim();
}

function csvSafe(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

const quotePoliticalPattern =
  /(国民党|民进党|共产党|民主|自由|革命|政府|总统|选举|政权|宪法|立委|党外|统一|独立|台独|台湾|中国|中华民国|中华人民共和国|警备总部|白色恐怖|戒严|政治|政党|议会|立法院|行政院|司法院|总统府|法务部|监察院|外交部|军法|军队|两岸|大陆|敌人|斗争|阶级|民族主义|国家主义|爱国主义|主义)/u;
const contextPoliticalPattern =
  /(国民党|民进党|共产党|民主|自由|革命|政府|总统|选举|政权|宪法|立委|党外|统一|独立|台独|台湾|中国|中华民国|中华人民共和国|警备总部|白色恐怖|戒严|政治|政党|议会|立法院|行政院|司法院|总统府|法务部|监察院|外交部|军法|军队|两岸|大陆|敌人|斗争|阶级|民族主义|国家主义|爱国主义|主义|警察国家|五四运动|学生运动|学潮|科尔|国会|议员|最高法院|罗斯福|大法官|史东|派垂克|亨利|甘地|不合作|独立革命|祖国|弱者|强者|国家|人民|左派)/u;

const rows = JSON.parse(fs.readFileSync(selectedPath, "utf8"));
const flagged = [];
for (const row of rows) {
  const reasons = [];
  const text = row.quote_text;
  const context = snippet(row);
  if (quotePoliticalPattern.test(text)) reasons.push("quote-political-term");
  if (contextPoliticalPattern.test(context)) reasons.push("political-context");
  if (/^(成语|俗语)$/.test(row.category) && text.length <= 4) reasons.push("short-common-phrase");
  if (/^(题辞)$/.test(row.source_or_origin) && row.category === "成语") reasons.push("low-source-specificity");
  if (reasons.length) {
    flagged.push({
      id: row.id,
      source_file: row.source_file,
      line: `${row.line_start}-${row.line_end}`,
      quote_text: row.quote_text,
      category: row.category,
      source_or_origin: row.source_or_origin,
      reasons: reasons.join(";"),
      context,
    });
  }
}

const lines = ["id\tsource_file\tline\tquote_text\tcategory\tsource_or_origin\treasons\tcontext"];
for (const item of flagged) {
  lines.push(
    [
      item.id,
      item.source_file,
      item.line,
      item.quote_text,
      item.category,
      item.source_or_origin,
      item.reasons,
      item.context,
    ]
      .map(csvSafe)
      .join("\t")
  );
}
fs.writeFileSync(outTsv, `${lines.join("\n")}\n`, "utf8");

const counts = flagged.reduce((acc, item) => {
  for (const reason of item.reasons.split(";")) acc[reason] = (acc[reason] || 0) + 1;
  return acc;
}, {});
fs.writeFileSync(
  outReport,
  [
    `book: ${book}`,
    `rows: ${rows.length}`,
    `flaggedRows: ${flagged.length}`,
    `reasonCounts: ${JSON.stringify(counts)}`,
    `outTsv: ${path.relative(root, outTsv)}`,
  ].join("\n") + "\n",
  "utf8"
);

console.log(
  JSON.stringify(
    {
      book,
      rows: rows.length,
      flaggedRows: flagged.length,
      reasonCounts: counts,
      outTsv: path.relative(root, outTsv),
      outReport: path.relative(root, outReport),
    },
    null,
    2
  )
);
