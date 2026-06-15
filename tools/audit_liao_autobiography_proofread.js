const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const candidatesPath = path.join(root, "analysis", "liao_autobiography_quote_candidates.json");
const csvPath = path.join(root, "exports", "李敖自传与回忆_诗词名言引用.csv");
const outPath = path.join(root, "analysis", "liao_autobiography_proofread_uncovered.tsv");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        value += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value.replace(/\r$/, ""));
    rows.push(row);
  }

  const header = rows.shift().map((name) => name.replace(/^\uFEFF/, ""));
  return rows
    .filter((cells) => cells.some(Boolean))
    .map((cells) => Object.fromEntries(header.map((name, index) => [name, cells[index] ?? ""])));
}

function compact(text) {
  return String(text).replace(/\s+/g, "");
}

function normalize(text) {
  return compact(text)
    .replace(/[“”"「」『』《》〈〉（）()【】\[\]·—….,，、;；:：!！?？。]/g, "")
    .replace(/蛻/g, "蜕")
    .replace(/象/g, "像");
}

const records = parseCsv(fs.readFileSync(csvPath, "utf8"));
const exportedByFile = new Map();
for (const record of records) {
  const rows = exportedByFile.get(record.source_file) || [];
  rows.push({
    ...record,
    start: Number(record.line_start),
    end: Number(record.line_end),
    quoteNorm: normalize(record.quote_text),
  });
  exportedByFile.set(record.source_file, rows);
}

function isCovered(candidate) {
  const rows = exportedByFile.get(candidate.file) || [];
  const candNorm = normalize(candidate.text);
  for (const row of rows) {
    const near = candidate.line >= row.start - 1 && candidate.line <= row.end + 1;
    if (!near) continue;
    if (row.quoteNorm.includes(candNorm) || candNorm.includes(row.quoteNorm)) return true;
  }
  return false;
}

const triggerPattern =
  /诗|词|歌|谣|谚|俗话|俗语|古语|成语|名言|格言|名句|联|对联|题词|曰|云|所谓|诗云|书曰|语曰|说过|箴|句|孔子|孟子|鲁迅|胡适|泰戈尔|马克吐温|莎士比亚|圣经|佛|道|禅|古人|原话|改译|改写|典故/;
const likelyQuotePattern =
  /[，、；：？！]|不亦|何如|何处|焉|兮|吾|汝|尔|君|公|师|之|其|者|也|乎|哉|矣|仁|义|忠|孝|善|恶|贤|圣|佛|道|天|地|山|水|风|云|花|月|春|秋|身|心|生|死|苦|乐|祸|福|贫|富|贵|贱|古|今|天下|江湖|文章|读书|君子|小人|大丈夫|自由|革命|人权/;
const mundanePattern =
  /^(李敖|文星|北大|台大|国民党|共产党|中共|自由中国|中央日报|联合报|中国时报|读者文摘|中央研究院|调查局|警备总部|法务部|最高法院|高等法院|党外|民进党|立法院|监察院|北平|北京|台湾|上海|哈尔滨|台中|台北|美国|日本|苏俄|俄国|德国|法国|英文|日文|中文|国文|论文|助教|教授|学生|老师|同学|妈妈|爸爸|奶奶|爷爷|大爷|大娘|太太|先生|小姐|人民公敌|匪谍|Jeff Ao)$/;

function scoreCandidate(row) {
  const text = row.text.trim();
  const context = row.context.trim();
  const len = Array.from(text).length;
  let score = 0;
  const reasons = [];

  if (triggerPattern.test(context)) {
    score += 4;
    reasons.push("trigger");
  }
  if (triggerPattern.test(text)) {
    score += 2;
    reasons.push("text-trigger");
  }
  if (likelyQuotePattern.test(text)) {
    score += 2;
    reasons.push("quote-shape");
  }
  if (/[，、；：？！]/.test(text)) {
    score += 2;
    reasons.push("punct");
  }
  if (/^[\u4e00-\u9fff，、；：？！·—…]+$/.test(text) && len >= 4) {
    score += 1;
    reasons.push("chinese");
  }
  if (len >= 8 && len <= 80) {
    score += 1;
    reasons.push("len");
  }
  if (len <= 3 || len > 180) {
    score -= 2;
    reasons.push("bad-len");
  }
  if (mundanePattern.test(text)) {
    score -= 6;
    reasons.push("mundane");
  }
  if (/^\d+$|^\d+年|^\d+月|^\d+日|^\d+岁/.test(text)) {
    score -= 5;
    reasons.push("number");
  }
  if (/^(第[一二三四五六七八九十]+|第\d+|[上下中]卷|目录|自序)$/.test(text)) {
    score -= 5;
    reasons.push("heading");
  }

  return { score, reasons: reasons.join(",") };
}

const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8"));
const byKey = new Map();
for (const candidate of candidates) {
  if (candidate.kind !== "quote") continue;
  if (candidate.file.includes("目录") || candidate.file.includes("自序")) continue;
  if (isCovered(candidate)) continue;
  const scored = scoreCandidate(candidate);
  if (scored.score < 5) continue;
  const key = `${candidate.file}\u0000${candidate.line}\u0000${candidate.text}`;
  byKey.set(key, { ...candidate, ...scored });
}

const rows = [...byKey.values()].sort(
  (a, b) =>
    b.score - a.score ||
    a.file.localeCompare(b.file, "zh-Hans-CN") ||
    a.line - b.line,
);

const compactContext = (value, size = 220) => {
  const chars = Array.from(String(value).replace(/\s+/g, " ").trim());
  return chars.length > size ? `${chars.slice(0, size).join("")}...` : chars.join("");
};
const esc = (value) => String(value).replace(/\t/g, " ").replace(/\r?\n/g, " ");
const lines = [["score", "file", "line", "text", "reasons", "context"].join("\t")];
for (const row of rows) {
  lines.push(
    [row.score, row.file, row.line, row.text, row.reasons, compactContext(row.context)]
      .map(esc)
      .join("\t"),
  );
}

fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({ uncovered: rows.length, outPath }, null, 2));
