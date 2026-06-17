const fs = require("fs");
const path = require("path");

const sourceRoot =
  process.argv[2] ||
  path.join("《大李敖全集6.0》分章节", "002.精品散文类", "001.传统下的独白");
const candidatePath =
  process.argv[3] || path.join("analysis", "liao_traditional_monologue_quote_candidates.json");

const outKeywordPath = path.join("analysis", "liao_traditional_monologue_keyword_lines.tsv");
const outKeywordShortPath = path.join(
  "analysis",
  "liao_traditional_monologue_keyword_lines_short.tsv",
);
const outPlausiblePath = path.join("analysis", "liao_traditional_monologue_plausible_quotes.tsv");
const outKnownMatchesPath = path.join(
  "analysis",
  "liao_traditional_monologue_known_quote_matches.tsv",
);

const sourceDecoder = new TextDecoder("gb18030");

const keywordPattern =
  /诗说|杜甫|李白|白居易|苏轼|苏东坡|王安石|龚定盦|顾亭林|鲁迅|胡适|古话|俗话|俗语|古语|谚|成语|名言|名句|格言|对联|联语|所谓|曰|云|孔子|孟子|论语|庄子|老子|韩非子|史记|左传|易经|诗经|礼记|金刚经|佛经|圣经|莎士比亚|歌德|亚里士多德|尼采|培根|康德|唱|歌词|儿歌|歌谣|俗以|世称|有言|箴/;
const quoteContextPattern =
  /诗|词|曰|云|所谓|古人|孔子|孟子|庄子|老子|鲁迅|胡适|歌德|莎士比亚|谚|俗话|俗语|古语|成语|名言|格言|名句|联|对联|题词|诗云|语曰|说过|有言|箴|歌|王安石|杜甫|李白|苏轼|苏东坡|龚定盦|顾亭林|金刚经|佛经|圣经|易经|诗经|礼记|史记|左传/;

const compact = (value, size = 360) => {
  const text = String(value).replace(/\s+/g, " ").trim();
  return Array.from(text).length > size ? `${Array.from(text).slice(0, size).join("")}...` : text;
};

const normalize = (value) =>
  String(value)
    .replace(/^\uFEFF/, "")
    .replace(/\s+/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/，/g, ",")
    .replace(/。/g, ".")
    .replace(/；/g, ";")
    .replace(/：/g, ":")
    .replace(/！/g, "!")
    .replace(/？/g, "?")
    .trim();

const esc = (value) => String(value).replace(/\t/g, " ").replace(/\r?\n/g, " ");

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
  const text = sourceDecoder
    .decode(fs.readFileSync(path.join(sourceRoot, file)))
    .replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const context = line.trim();
    if (!context) return;
    sourceLines.push({ file, line: index + 1, context, normalized: normalize(context) });
    if (keywordPattern.test(context)) {
      keywordRows.push([file, index + 1, compact(context, 520)]);
      keywordShortRows.push([file, index + 1, compact(context, 180)]);
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
  if (length < 4 || length > 120) continue;
  if (!quoteContextPattern.test(context)) continue;
  if (/^\d+$|^\d+年|^\d+月|^\d+日|^\d+岁/.test(text)) continue;
  const key = `${row.file}\u0000${row.line}\u0000${text}`;
  if (plausibleSeen.has(key)) continue;
  plausibleSeen.add(key);
  plausibleRows.push([row.file, row.line, text, compact(context, 420)]);
}

const knownRows = [["file", "line", "matched_quote", "previous_id", "previous_book", "previous_source", "context"]];
const totalCsvPath = path.join("exports", "总_诗文格言歌谣引用.csv");
if (fs.existsSync(totalCsvPath)) {
  const knownQuotes = parseCsv(fs.readFileSync(totalCsvPath, "utf8"))
    .map((row) => ({
      ...row,
      normalized: normalize(row.quote_text),
      charLength: Array.from(row.quote_text || "").length,
    }))
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
fs.writeFileSync(outKeywordPath, keywordRows.map((row) => row.map(esc).join("\t")).join("\n"), "utf8");
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
fs.writeFileSync(
  outKnownMatchesPath,
  knownRows.map((row) => row.map(esc).join("\t")).join("\n"),
  "utf8",
);

console.log(
  JSON.stringify(
    {
      sourceRoot,
      files: files.length,
      keywordLines: keywordRows.length - 1,
      plausibleQuotes: plausibleRows.length - 1,
      knownMatches: knownRows.length - 1,
      outKeywordPath,
      outKeywordShortPath,
      outPlausiblePath,
      outKnownMatchesPath,
    },
    null,
    2,
  ),
);
