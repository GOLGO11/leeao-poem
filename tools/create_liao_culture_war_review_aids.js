const fs = require("fs");
const path = require("path");

const sourceRoot =
  process.argv[2] ||
  path.join("《大李敖全集6.0》分章节", "003.惊世杂文类", "002.文化论战丹火录");
const candidatePath =
  process.argv[3] || path.join("analysis", "liao_culture_war_quote_candidates.json");

const outKeywordPath = path.join("analysis", "liao_culture_war_keyword_lines.tsv");
const outKeywordShortPath = path.join("analysis", "liao_culture_war_keyword_lines_short.tsv");
const outPlausiblePath = path.join("analysis", "liao_culture_war_plausible_quotes.tsv");
const outKnownMatchesPath = path.join("analysis", "liao_culture_war_known_quote_matches.tsv");
const outHighRiskPath = path.join("analysis", "liao_culture_war_high_risk_noise.tsv");

const sourceDecoder = new TextDecoder("gb18030");

const keywordPattern =
  /诗|词|歌|谣|俗话|俗语|谚语|古语|古话|古训|成语|名言|名句|格言|联语|对联|所谓|曰|云|说过|有言|孔子|孟子|庄子|老子|荀子|韩非子|墨子|论语|孟子|礼记|大学|中庸|诗经|尚书|易经|周易|春秋|左传|国语|史记|汉书|后汉书|资治通鉴|世说新语|西游记|水浒传|红楼梦|三国演义|金瓶梅|佛经|金刚经|圣经|韩愈|杜甫|李白|白居易|苏轼|苏东坡|王安石|欧阳修|陆游|陶潜|陶渊明|龚自珍|顾亭林|鲁迅|胡适|梁启超|莎士比亚|歌德|尼采|柏拉图|亚里士多德|罗素|奥威尔|伏尔泰|堂吉诃德/;
const quoteContextPattern =
  /诗|词|歌|谣|俗话|俗语|谚语|古语|古话|古训|成语|名言|名句|格言|联语|对联|所谓|曰|云|说过|引用|引|有言|孔子|孟子|庄子|老子|荀子|韩非子|墨子|论语|礼记|诗经|尚书|易经|周易|春秋|左传|史记|汉书|后汉书|资治通鉴|世说新语|西游记|水浒传|红楼梦|三国演义|金瓶梅|佛经|金刚经|圣经|韩愈|杜甫|李白|白居易|苏轼|王安石|陆游|陶潜|陶渊明|鲁迅|胡适|梁启超|莎士比亚|歌德|尼采|罗素|奥威尔|伏尔泰|堂吉诃德/;
const highRiskPattern =
  /论战|文化|中西|西化|本位|民族|思想|主义|政治|政党|政府|国民党|共产党|三民主义|社会主义|资本主义|自由主义|保守主义|民主|独裁|革命|反共|苏联|美国|国体|孔教|文体|社会史|科学与人生观|宣言|声明|社论|杂志|报纸|刊物|教授|学者|学校|教育|大学|总统|立法院|行政|法律|制度|政策/;

const compact = (value, size = 360) => {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return Array.from(text).length > size ? `${Array.from(text).slice(0, size).join("")}...` : text;
};

const normalize = (value) =>
  String(value ?? "")
    .replace(/^\uFEFF/, "")
    .replace(/\s+/g, "")
    .replace(/[“”‘’《》「」『』（）()【】\[\]〈〉]/g, "")
    .replace(/[，、。！？；：,.!?;:—…·]/g, "")
    .trim();

const esc = (value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " / ");

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
    .map((cells) => Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""])));
}

const files = fs
  .readdirSync(sourceRoot)
  .filter((file) => file.endsWith(".txt"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceLines = [];
const keywordRows = [["file", "line", "context"]];
const keywordShortRows = [["file", "line", "context"]];

for (const file of files) {
  const text = sourceDecoder.decode(fs.readFileSync(path.join(sourceRoot, file))).replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const context = line.trim();
    if (!context) return;
    const item = { file, line: index + 1, context, normalized: normalize(context) };
    sourceLines.push(item);
    if (keywordPattern.test(context)) {
      keywordRows.push([file, index + 1, compact(context, 520)]);
      keywordShortRows.push([file, index + 1, compact(context, 180)]);
    }
  });
}

const candidates = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const plausibleRows = [["file", "line", "text", "context"]];
const highRiskRows = [["file", "line", "text", "reason", "context"]];
const plausibleSeen = new Set();
const highRiskSeen = new Set();

for (const row of candidates) {
  if (row.kind !== "quote") continue;
  if (row.file.includes("目录")) continue;
  const text = row.text.trim();
  const context = row.context.trim();
  const length = Array.from(text).length;
  if (length < 2 || length > 220) continue;
  if (/^\d+$|^\d+年|^\d+月|^\d+日|^\d+岁/.test(text)) continue;

  if (quoteContextPattern.test(context)) {
    const key = `${row.file}\u0000${row.line}\u0000${text}`;
    if (!plausibleSeen.has(key)) {
      plausibleSeen.add(key);
      plausibleRows.push([row.file, row.line, text, compact(context, 420)]);
    }
  }

  if (highRiskPattern.test(`${text} ${context}`)) {
    const key = `${row.file}\u0000${row.line}\u0000${text}`;
    if (!highRiskSeen.has(key)) {
      highRiskSeen.add(key);
      highRiskRows.push([
        row.file,
        row.line,
        text,
        "modern-cultural-political-debate-context",
        compact(context, 420),
      ]);
    }
  }
}

const knownRows = [["file", "line", "matched_quote", "previous_id", "previous_book", "previous_source", "context"]];
const totalCsvPath = path.join("exports", "总_诗文格言歌谣引用.csv");
if (fs.existsSync(totalCsvPath)) {
  const knownQuotes = parseCsv(fs.readFileSync(totalCsvPath, "utf8"))
    .map((row) => ({ ...row, normalized: normalize(row.quote_text) }))
    .filter((row) => row.normalized.length >= 4 && row.normalized.length <= 160);

  const seen = new Set();
  for (const line of sourceLines) {
    if (line.file.includes("目录")) continue;
    for (const known of knownQuotes) {
      if (!line.normalized.includes(known.normalized)) continue;
      const key = `${line.file}\u0000${line.line}\u0000${known.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      knownRows.push([
        line.file,
        line.line,
        known.quote_text,
        known.id,
        known.book,
        `${known.source_file}:${known.line_start}-${known.line_end}`,
        compact(line.context, 520),
      ]);
    }
  }
}

fs.mkdirSync("analysis", { recursive: true });
fs.writeFileSync(outKeywordPath, `${keywordRows.map((row) => row.map(esc).join("\t")).join("\n")}\n`, "utf8");
fs.writeFileSync(outKeywordShortPath, `${keywordShortRows.map((row) => row.map(esc).join("\t")).join("\n")}\n`, "utf8");
fs.writeFileSync(outPlausiblePath, `${plausibleRows.map((row) => row.map(esc).join("\t")).join("\n")}\n`, "utf8");
fs.writeFileSync(outKnownMatchesPath, `${knownRows.map((row) => row.map(esc).join("\t")).join("\n")}\n`, "utf8");
fs.writeFileSync(outHighRiskPath, `${highRiskRows.map((row) => row.map(esc).join("\t")).join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      sourceRoot,
      files: files.length,
      keywordLines: keywordRows.length - 1,
      plausibleQuotes: plausibleRows.length - 1,
      knownMatches: knownRows.length - 1,
      highRiskNoise: highRiskRows.length - 1,
      outKeywordPath,
      outKeywordShortPath,
      outPlausiblePath,
      outKnownMatchesPath,
      outHighRiskPath,
    },
    null,
    2,
  ),
);
