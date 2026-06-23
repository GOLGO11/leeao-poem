const fs = require("fs");
const path = require("path");

const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "005.诗集语录类",
  "005.虽千万人，李敖往矣",
);
const analysisDir = "analysis";
const outPath = path.join(analysisDir, "liao_suiqianwanren_review_candidates.tsv");
const keywordOutPath = path.join(analysisDir, "liao_suiqianwanren_keyword_lines.tsv");
const decoder = new TextDecoder("gb18030");

const candidatePatterns = [
  /[“「『](.*?)[”」』]/,
  /(?:说|曰|云|道|答|写|诗|词|谚|俗话|古人|名言|格言|绝命词|台词|歌|歌词|成语|佛经|论语|孟子|庄子|楚辞|史记|后汉书|汉书|红楼梦|唐诗|宋朝谚语|洋谚|西谚)/,
  /[A-Z][A-Za-z ,.';:!?-]{24,}/,
];

const politicalNoise = /总统|主席|国民党|共产党|民主|革命|政府|宪法|国防|外交|独裁|台独|汉奸|党|选举|马克思|毛泽东|蒋介石|邓小平|里根|艾森豪威尔|威尔逊|丘吉尔|肯尼迪|斯大林|林肯|阿尔布莱特|里切留|国旗|国号|一党专政|反攻大陆|台湾关系法|一中|美国总统|法国大革命/;
const likelyLiterary = /诗|词|唐诗|宋词|红楼梦|楚辞|论语|孟子|庄子|史记|汉书|后汉书|幽梦影|谚|俗话|成语|佛经|格言|名言|台词|歌|歌词|欧亨利|艾略特|奥登|布伯|布莱克|萧伯纳|莎士比亚|但丁|王维|朱熹|欧阳修|郑板桥|苏东坡|金圣叹|张潮|荀子|孔子|韩愈|陶渊明/;

function quoteSnippets(line) {
  const snippets = [];
  const quoteRegex = /[“「『](.*?)[”」』]/g;
  let match;
  while ((match = quoteRegex.exec(line))) {
    snippets.push(match[1]);
  }
  return snippets.join(" | ");
}

fs.mkdirSync(analysisDir, { recursive: true });

const files = fs
  .readdirSync(sourceDir)
  .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const candidates = [["file", "line", "score", "flags", "quotes", "text"]];
const keywordRows = [["file", "line", "flags", "text"]];

for (const file of files) {
  const text = decoder.decode(fs.readFileSync(path.join(sourceDir, file)));
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    if (!trimmed) return;

    const matchesCandidate = candidatePatterns.some((pattern) => pattern.test(trimmed));
    const flags = [
      politicalNoise.test(trimmed) ? "political-noise" : "",
      likelyLiterary.test(trimmed) ? "likely-literary" : "",
      /[“「『]/.test(trimmed) ? "quoted" : "",
      /[A-Z][A-Za-z ,.';:!?-]{24,}/.test(trimmed) ? "english" : "",
    ].filter(Boolean);

    if (matchesCandidate) {
      const score =
        (flags.includes("likely-literary") ? 3 : 0) +
        (flags.includes("quoted") ? 2 : 0) +
        (flags.includes("english") ? 1 : 0) -
        (flags.includes("political-noise") ? 3 : 0);
      candidates.push([file, lineNumber, score, flags.join(";"), quoteSnippets(trimmed), trimmed]);
    }

    if (flags.length) {
      keywordRows.push([file, lineNumber, flags.join(";"), trimmed]);
    }
  });
}

function writeTsv(filePath, rows) {
  fs.writeFileSync(
    filePath,
    rows.map((row) => row.map((cell) => String(cell).replace(/\t/g, " ").replace(/\r?\n/g, " ")).join("\t")).join("\n"),
    "utf8",
  );
}

writeTsv(outPath, candidates);
writeTsv(keywordOutPath, keywordRows);

console.log(
  JSON.stringify(
    {
      files: files.length,
      candidates: candidates.length - 1,
      keywordLines: keywordRows.length - 1,
      outPath,
      keywordOutPath,
    },
    null,
    2,
  ),
);
