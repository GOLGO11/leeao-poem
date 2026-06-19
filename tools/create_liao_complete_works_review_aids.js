const fs = require("fs");
const path = require("path");

const sourceRoot =
  process.argv[2] ||
  path.join("《大李敖全集6.0》分章节", "002.精品散文类", "007.李敖全集");
const candidatePath =
  process.argv[3] || path.join("analysis", "liao_complete_works_quote_candidates.json");

const outKeywordPath = path.join("analysis", "liao_complete_works_keyword_lines.tsv");
const outKeywordShortPath = path.join("analysis", "liao_complete_works_keyword_lines_short.tsv");
const outPlausiblePath = path.join("analysis", "liao_complete_works_plausible_quotes.tsv");
const outKnownMatchesPath = path.join("analysis", "liao_complete_works_known_quote_matches.tsv");
const outNoisePath = path.join("analysis", "liao_complete_works_high_risk_noise.tsv");

const sourceDecoder = new TextDecoder("gb18030");

const keywordPattern =
  /诗|词|歌|谣|谚|俗话|俗语|古语|成语|名言|格言|名句|联语|对联|题词|所谓|曰|云|说过|有言|孔子|孟子|庄子|老子|荀子|韩非子|墨子|论语|孟子|庄子|礼记|大学|中庸|诗经|尚书|易经|周易|春秋|左传|国语|史记|汉书|后汉书|资治通鉴|世说新语|水浒|红楼梦|三国演义|金瓶梅|佛经|金刚经|圣经|耶稣|陶潜|陶渊明|屈原|杜甫|李白|白居易|苏轼|苏东坡|王安石|陆游|龚定庵|鲁迅|胡适|莎士比亚|歌德|尼采|奥威尔|邱吉尔|丘吉尔|萧伯纳|罗素|林肯|杰佛逊|爱迪生|马克思|伏尔泰|贝克特|堂吉诃德/;
const quoteContextPattern =
  /诗|词|歌|谣|谚|俗话|俗语|古语|成语|名言|格言|名句|联语|对联|题词|所谓|曰|云|说过|有言|孔子|孟子|庄子|老子|荀子|论语|孟子|庄子|诗经|尚书|易经|周易|春秋|左传|史记|汉书|后汉书|资治通鉴|世说新语|水浒|红楼梦|三国演义|金瓶梅|佛经|圣经|耶稣|陶潜|陶渊明|屈原|杜甫|李白|白居易|苏轼|王安石|陆游|龚定庵|鲁迅|胡适|莎士比亚|歌德|尼采|奥威尔|邱吉尔|丘吉尔|萧伯纳|罗素|林肯|杰佛逊|爱迪生|马克思|伏尔泰|贝克特|堂吉诃德/;
const highRiskNoisePattern =
  /国民党|共产党|中共|党外|民进党|立法院|监察院|法院|法官|判决|宪法|法律|法规|条文|总统|政府|教育部|大学|教授|学生|课程|报纸|新闻|杂志|广告|声明|启事|出版|目录|索引|自序|后记|附记|自作|李诗|刁民歌|十诫|私生子|医师法|出版企划/;

const compact = (value, size = 360) => {
  const text = String(value).replace(/\s+/g, " ").trim();
  return Array.from(text).length > size ? `${Array.from(text).slice(0, size).join("")}...` : text;
};

const normalize = (value) =>
  String(value)
    .replace(/^\uFEFF/, "")
    .replace(/\s+/g, "")
    .replace(/[“”"‘’'《》〈〉「」『』]/g, "")
    .replace(/[，、。！？；：,.!?;:]/g, "")
    .trim();

const esc = (value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");

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
const noiseRows = [["file", "line", "kind", "text", "context"]];

for (const file of files) {
  const text = sourceDecoder.decode(fs.readFileSync(path.join(sourceRoot, file))).replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const context = line.trim();
    if (!context) return;
    const lineRow = { file, line: index + 1, context, normalized: normalize(context) };
    sourceLines.push(lineRow);
    if (keywordPattern.test(context)) {
      keywordRows.push([file, index + 1, compact(context, 520)]);
      keywordShortRows.push([file, index + 1, compact(context, 180)]);
    }
    if (highRiskNoisePattern.test(context)) {
      noiseRows.push([file, index + 1, "keyword_line", "", compact(context, 260)]);
    }
  });
}

const candidates = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const plausibleRows = [["file", "line", "text", "context"]];
const plausibleSeen = new Set();
for (const row of candidates) {
  if (row.kind !== "quote") continue;
  const text = row.text.trim();
  const context = row.context.trim();
  const length = Array.from(text).length;
  if (length < 2 || length > 220) continue;
  const key = `${row.file}\u0000${row.line}\u0000${text}`;
  if (plausibleSeen.has(key)) continue;
  plausibleSeen.add(key);
  if (quoteContextPattern.test(context)) {
    plausibleRows.push([row.file, row.line, text, compact(context, 420)]);
  }
  if (highRiskNoisePattern.test(context) || highRiskNoisePattern.test(text)) {
    noiseRows.push([row.file, row.line, "quote", text, compact(context, 260)]);
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
fs.writeFileSync(outNoisePath, `${noiseRows.map((row) => row.map(esc).join("\t")).join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      sourceRoot,
      files: files.length,
      keywordLines: keywordRows.length - 1,
      plausibleQuotes: plausibleRows.length - 1,
      knownMatches: knownRows.length - 1,
      highRiskNoise: noiseRows.length - 1,
      outKeywordPath,
      outKeywordShortPath,
      outPlausiblePath,
      outKnownMatchesPath,
      outNoisePath,
    },
    null,
    2,
  ),
);
