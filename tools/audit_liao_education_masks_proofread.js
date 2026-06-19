const fs = require("fs");
const path = require("path");

const sourceDecoder = new TextDecoder("gb18030");
const book = "教育与脸谱";
const targetRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "003.惊世杂文类",
  "001.教育与脸谱",
);
const analysisDir = path.join(process.cwd(), "analysis");
const csvPath = path.join(process.cwd(), "exports", `${book}_诗文格言歌谣引用.csv`);

const paths = {
  review: path.join(analysisDir, "liao_education_masks_review_candidates.tsv"),
  plausible: path.join(analysisDir, "liao_education_masks_plausible_quotes.tsv"),
  keyword: path.join(analysisDir, "liao_education_masks_keyword_lines_short.tsv"),
  known: path.join(analysisDir, "liao_education_masks_known_quote_matches.tsv"),
  highRisk: path.join(analysisDir, "liao_education_masks_high_risk_noise.tsv"),
};

const strongLiteraryPattern =
  /(诗|词|歌|曲|联|对联|挽联|俗语|俗话|谚|格言|古训|古语|成语|名句|名言|典故|曰|云|孔子|孟子|老子|庄子|列子|论语|尚书|诗经|礼记|史记|易经|韩愈|杜甫|李白|苏东坡|苏轼|龚自珍|张载|伏尔泰|泰戈尔|罗素|斯威夫特|Swift|胡佛|培根|佛|禅|红楼梦|刘姥姥|屈原|贾谊|阮籍|鸿门宴|商山|玉山|程门|逢蒙|共工|驩兜|中庸|大学)/;
const likelyPoliticalNoisePattern =
  /(政治|政党|国民党|共产党|政府|宪法|法律|考试法|行政|教育部|中研院|中央研究院|台大|文学院|教授|院长|研究所|机关|制度|官员|总统|革命|反共|国联|苏联|外交|国民会议|专制|院士|人事|编制|兼差)/;
const selfPoemPattern = /(李敖.*(口占|写诗|作诗|自题|自作)|忘了我是谁)/;
const sourceSignalPattern =
  /(引|引用|俗云|俗话|古话|古人|古语|古训|所谓|有云|曰|云|说|诗|词|格言|名言|名句|成语|典故|对联|联语|歌谣|唱|《[^》]+》)/;

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

function parseTsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split("\t");
  return lines.map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""]));
  });
}

function tsvCell(value) {
  return String(value ?? "").replace(/\r?\n/g, " ").replace(/\t/g, " ").trim();
}

function normalize(text) {
  return String(text ?? "")
    .replace(/\s+/g, "")
    .replace(/[，。、“”‘’：；？！,.!?;:《》〈〉（）()【】\[\]「」『』—…\-·]/g, "")
    .toLowerCase();
}

function compact(text) {
  return String(text ?? "").replace(/\s+/g, "");
}

function quoteFragments(text) {
  return String(text ?? "")
    .split(/[，。、“”‘’：；？！,.!?;:《》〈〉（）()【】\[\]「」『』—…\-\n\r]+/)
    .map((item) => normalize(item))
    .filter((item) => item.length >= 4);
}

function readSourceFile(file) {
  return sourceDecoder.decode(fs.readFileSync(path.join(targetRoot, file))).split(/\r?\n/);
}

function sourceFiles() {
  return fs
    .readdirSync(targetRoot)
    .filter((name) => name.endsWith(".txt"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function getSourceExcerpt(record, sourceByFile) {
  const lines = sourceByFile.get(record.source_file) || [];
  const start = Number(record.line_start);
  const end = Number(record.line_end);
  return lines.slice(start - 1, end).join("");
}

function isQuoteCovered(records, file, text) {
  const candidate = normalize(text);
  if (candidate.length < 2) return false;
  return records.some((record) => {
    if (record.source_file !== file) return false;
    const quote = normalize(record.quote_text);
    if (candidate === quote) return true;
    if (candidate.length >= 4 && quote.includes(candidate)) return true;
    if (quote.length >= 4 && candidate.includes(quote)) return true;
    return false;
  });
}

function isLineCovered(records, file, line) {
  return records.some(
    (record) =>
      record.source_file === file &&
      Number(record.line_start) <= line &&
      Number(record.line_end) >= line,
  );
}

function candidateReason(item) {
  const haystack = `${item.text || item.matched_quote || ""} ${item.context || ""}`;
  const reasons = [];
  if (strongLiteraryPattern.test(haystack)) reasons.push("strong-literary-signal");
  if (likelyPoliticalNoisePattern.test(haystack)) reasons.push("political-institutional-context");
  if (selfPoemPattern.test(haystack)) reasons.push("possible-li-ao-self-poem");
  return reasons.join(";") || "candidate";
}

const records = parseCsv(fs.readFileSync(csvPath, "utf8"));
const reviewCandidates = parseTsv(fs.readFileSync(paths.review, "utf8"));
const plausibleCandidates = parseTsv(fs.readFileSync(paths.plausible, "utf8"));
const keywordLines = parseTsv(fs.readFileSync(paths.keyword, "utf8"));
const knownMatches = parseTsv(fs.readFileSync(paths.known, "utf8"));
const highRiskNoise = parseTsv(fs.readFileSync(paths.highRisk, "utf8"));

const sourceByFile = new Map(sourceFiles().map((file) => [file, readSourceFile(file)]));

const auditRows = [];
function pushAudit(kind, item, reason, hint) {
  auditRows.push({
    kind,
    score: item.score || "",
    file: item.file || item.source_file || "",
    line: item.line || item.line_start || "",
    id: item.id || "",
    text: item.text || item.matched_quote || item.quote_text || "",
    reason,
    hint,
    context: item.context || item.summary || "",
  });
}

for (const candidate of reviewCandidates) {
  const score = Number(candidate.score);
  if (score < 5) continue;
  if (isQuoteCovered(records, candidate.file, candidate.text)) continue;
  const reason = candidateReason(candidate);
  if (score >= 7 || reason.includes("strong-literary-signal")) {
    pushAudit(
      "possible_missing_candidate",
      candidate,
      reason,
      isLineCovered(records, candidate.file, Number(candidate.line))
        ? "same line has records; review for multi-quote omission"
        : "review as possible addition",
    );
  }
}

for (const candidate of plausibleCandidates) {
  const reason = candidateReason(candidate);
  if (!reason.includes("strong-literary-signal")) continue;
  if (isQuoteCovered(records, candidate.file, candidate.text)) continue;
  pushAudit(
    "possible_missing_plausible",
    candidate,
    reason,
    isLineCovered(records, candidate.file, Number(candidate.line))
      ? "same line has records; review for multi-quote omission"
      : "review as possible addition",
  );
}

for (const match of knownMatches) {
  if (isQuoteCovered(records, match.file, match.matched_quote)) continue;
  pushAudit(
    "known_quote_not_exported",
    match,
    `previous:${match.previous_id}/${match.previous_book}`,
    "review as possible addition unless outside this book's scope",
  );
}

for (const row of keywordLines) {
  if (!sourceSignalPattern.test(row.context)) continue;
  if (isLineCovered(records, row.file, Number(row.line))) continue;
  if (likelyPoliticalNoisePattern.test(row.context) && !strongLiteraryPattern.test(row.context)) continue;
  pushAudit("uncovered_signal_line", row, "source-signal-line", "scan source line for missed quotation");
}

for (const record of records) {
  const haystack = `${record.quote_text} ${record.category} ${record.source_or_origin} ${record.summary}`;
  const reasons = [];
  if (selfPoemPattern.test(haystack)) reasons.push("possible-li-ao-self-poem");
  if (likelyPoliticalNoisePattern.test(haystack) && !strongLiteraryPattern.test(haystack)) {
    reasons.push("political-institutional-without-literary-signal");
  }
  if (/现代格言|逻辑例句|现代文学引文|外国文论语|成语化用|古文化用/.test(record.category)) {
    reasons.push("scope-edge-category");
  }
  if (reasons.length > 0) {
    pushAudit("possible_removal_or_scope_edge", record, reasons.join(";"), "manual scope check");
  }
}

for (const record of records) {
  const sourceExcerpt = getSourceExcerpt(record, sourceByFile);
  const quote = normalize(record.quote_text);
  const source = normalize(sourceExcerpt);
  if (quote.length < 4) continue;
  const fragments = quoteFragments(record.quote_text);
  const fragmentHits = fragments.filter((fragment) => source.includes(fragment)).length;
  if (!source.includes(quote) && fragmentHits === 0) {
    pushAudit(
      "source_text_mismatch",
      record,
      "quote text not found in stated source range",
      "check line_start/line_end or quote transcription",
    );
  }
}

const duplicateMap = new Map();
for (const record of records) {
  const key = normalize(record.quote_text);
  if (!key) continue;
  duplicateMap.set(key, [...(duplicateMap.get(key) || []), record]);
}
for (const group of duplicateMap.values()) {
  if (group.length < 2) continue;
  pushAudit(
    "duplicate_quote_text",
    {
      id: group.map((record) => record.id).join(","),
      file: group.map((record) => record.source_file).join(";"),
      line_start: group.map((record) => record.line_start).join(";"),
      quote_text: group[0].quote_text,
      summary: group.map((record) => `${record.id}:${record.source_file}:${record.line_start}`).join(" | "),
    },
    "same normalized quote_text appears multiple times",
    "keep if distinct cited occurrences; merge only if accidental duplicate",
  );
}

const highRiskExported = highRiskNoise.filter((item) => isQuoteCovered(records, item.file, item.text));

const categories = new Map();
const byFile = new Map();
for (const record of records) {
  categories.set(record.category, (categories.get(record.category) || 0) + 1);
  byFile.set(record.source_file, (byFile.get(record.source_file) || 0) + 1);
}

const auditTsv = [
  ["kind", "score", "file", "line", "id", "text", "reason", "hint", "context"].join("\t"),
  ...auditRows.map((row) =>
    [
      row.kind,
      row.score,
      row.file,
      row.line,
      row.id,
      row.text,
      row.reason,
      row.hint,
      row.context,
    ]
      .map(tsvCell)
      .join("\t"),
  ),
];
const auditPath = path.join(analysisDir, "liao_education_masks_proofread_audit.tsv");
fs.writeFileSync(auditPath, `\uFEFF${auditTsv.join("\r\n")}\r\n`, "utf8");

const byKind = new Map();
for (const row of auditRows) byKind.set(row.kind, (byKind.get(row.kind) || 0) + 1);

const report = [];
report.push("《教育与脸谱》校对轮自动审计");
report.push(`当前条目：${records.length}`);
report.push(`审计疑点：${auditRows.length}`);
for (const [kind, count] of [...byKind.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  report.push(`- ${kind}: ${count}`);
}
report.push(`高危噪声中已入表：${highRiskExported.length}`);
report.push("");
report.push("按章节文件统计：");
for (const [file, count] of [...byFile.entries()].sort((a, b) => a[0].localeCompare(b[0], "zh-Hans-CN"))) {
  report.push(`- ${file}: ${count}`);
}
report.push("");
report.push("类别统计：");
for (const [category, count] of [...categories.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))) {
  report.push(`- ${category}: ${count}`);
}
report.push("");
report.push("漏收/范围边界样例：");
for (const item of auditRows.slice(0, 120)) {
  report.push(
    `- [${item.kind}] ${item.id ? `${item.id} ` : ""}${item.file}:${item.line} ${tsvCell(item.text).slice(0, 160)} (${item.reason})`,
  );
}
report.push("");
report.push(`明细见：${path.relative(process.cwd(), auditPath)}`);

const reportPath = path.join(analysisDir, "liao_education_masks_proofread_report.txt");
fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      records: records.length,
      auditRows: auditRows.length,
      byKind: Object.fromEntries(byKind),
      highRiskExported: highRiskExported.length,
      auditPath,
      reportPath,
    },
    null,
    2,
  ),
);
