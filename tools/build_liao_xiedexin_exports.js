const fs = require("fs");
const path = require("path");

const book = "李敖写的信";
const idPrefix = "LAXDX";
const generatedDate = "2026-06-23";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "008.书信函件类",
  "012.李敖写的信",
);

const sourceDecoder = new TextDecoder("gb18030");
const lineCache = new Map();

function readLines(file) {
  if (!lineCache.has(file)) {
    const sourcePath = path.join(process.cwd(), sourceDir, file);
    lineCache.set(file, sourceDecoder.decode(fs.readFileSync(sourcePath)).split(/\r?\n/));
  }
  return lineCache.get(file);
}

function sourceFiles() {
  return fs.readdirSync(path.join(process.cwd(), sourceDir))
    .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function chapterFromFile(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
}

function quoteFromLines(file, lineStart, lineEnd) {
  return readLines(file)
    .slice(lineStart - 1, lineEnd)
    .map((line) => line.replace(/^[\s　]+/, "").replace(/\s+$/, ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

function compact(text) {
  return String(text).replace(/[\s　]+/g, "");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
}

function row(file, lineStart, lineEnd, quoteText, category, sourceOrigin, summary, notes = "") {
  return {
    id: "",
    book,
    chapter: chapterFromFile(file),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrigin,
    summary,
    notes,
  };
}

function lineRow(file, lineStart, lineEnd, category, sourceOrigin, summary, notes = "") {
  return row(
    file,
    lineStart,
    lineEnd,
    quoteFromLines(file, lineStart, lineEnd),
    category,
    sourceOrigin,
    summary,
    notes,
  );
}

const data = [
  lineRow(
    "002.好事近.txt",
    3,
    17,
    "李敖词",
    "李敖《好事近》",
    "贺胡适六十八岁生日的小词。",
  ),
  row(
    "002.好事近.txt",
    27,
    27,
    "凡能做打油诗的，才可以做好诗。",
    "现代文人诗论",
    "胡适回信",
    "胡适评李敖生日词时谈打油诗与好诗。",
  ),
  lineRow(
    "003.师生之间——致姚从吾的信.txt",
    9,
    11,
    "古文句",
    "柳宗元《与太学诸生书》",
    "借曲木、曲士说明老师不拒学生。",
  ),
  row(
    "003.师生之间——致姚从吾的信.txt",
    17,
    17,
    "A teacher affects eternity; he can never tell where his influence stops.",
    "英文师道格言",
    "Henry Adams",
    "以教师影响无尽表达谢师之意。",
  ),
  row(
    "005.碧潭归隐答CS.txt",
    15,
    15,
    "the capacity to endure a more or less monotonous life才能真正得到happiness.",
    "李敖人生格言",
    "李敖致友人信",
    "把忍受单调生活的能力视为快乐条件。",
  ),
  lineRow(
    "005.碧潭归隐答CS.txt",
    23,
    25,
    "陶渊明诗句",
    "陶渊明诗",
    "借陶诗说明不悔自己的生活选择。",
  ),
  row(
    "005.碧潭归隐答CS.txt",
    27,
    27,
    "人生百年耳，心之所善，情之所甘，无为或无不为，皆何伤乎？",
    "李敖人生格言",
    "李敖致友人信",
    "以百年人生说明顺从心之所善所甘。",
  ),
  lineRow(
    "006.给胡适的一封信.txt",
    63,
    77,
    "李敖改写词",
    "李敖改写胡适寿词",
    "以小词劝胡适编年出版全集。",
  ),
  lineRow(
    "006.给胡适的一封信.txt",
    85,
    87,
    "胡适诗句",
    "胡适题字",
    "胡适在刘海粟画上题写的寒梅灯儿句。",
  ),
  row(
    "009.回YS.txt",
    11,
    11,
    "现在一班少年人跟着我们向故纸堆去乱钻，这是最可悲叹的现状，我们希望他们及早回头，多学一点自然科学的知识与技术：那条路是活路；这条故纸路是死路。",
    "胡适治学语",
    "胡适《治学的方法与材料》",
    "胡适劝青年从故纸堆转向自然科学知识技术。",
  ),
  row(
    "016.回宗勋.txt",
    23,
    23,
    "文章忌刻薄",
    "现代文人语",
    "《胡适研究》引语",
    "读者来信中引用的文章戒刻薄语。",
  ),
  lineRow(
    "018.斥佞佛参禅.txt",
    13,
    19,
    "佛教诗偈",
    "憨山大师《费闲歌》",
    "李敖抄录《费闲歌》劝友人下山。",
  ),
  row(
    "019.回林枕客论我们来治治医生.txt",
    13,
    13,
    "Physician，heal thyself.（医生，你治治自己吧！）",
    "圣经俗语",
    "《新约·路加福音》",
    "耶稣所引医生治己的俗话。",
  ),
  lineRow(
    "023.给孙陵信论《大风雪》解禁.txt",
    15,
    17,
    "现代诗句",
    "于右任诗句",
    "李敖记得孙陵所引于右任诗中的两句。",
  ),
  row(
    "027.收“毒品”谢东方望.txt",
    9,
    9,
    "绅士不抽烟",
    "现代文人语",
    "歌德语意",
    "信中转述歌德反对烟草的说法。",
  ),
  row(
    "029.论好人做事致牛若望副主教.txt",
    13,
    13,
    "伸头一刀，缩头也挨一刀",
    "俗语",
    "俗语",
    "以俗语说明做事退缩未必能避祸。",
  ),
  row(
    "022.给傅乐成的两封信.txt",
    27,
    27,
    "人们在感到蜡烛的光明的时候，应该感谢那在黑暗里手持蜡烛的人。",
    "李敖感恩格言",
    "李敖致傅乐成信",
    "用蜡烛比喻推动教育改善者。",
  ),
  row(
    "038.复监察院黄宝实委员.txt",
    9,
    9,
    "嫉恶如仇",
    "成语",
    "成语",
    "用于称赞黄宝实嫉恶。",
  ),
  row(
    "038.复监察院黄宝实委员.txt",
    11,
    11,
    "干父之蛊",
    "古典成语",
    "《易经》语",
    "李敖请黄宝实看《中国文学史》序中所用典语。",
  ),
  row(
    "039.搜罗侦探小说等寄陈绍鹏.txt",
    27,
    27,
    "写作之计划，不可不“全套”也！",
    "李敖写作格言",
    "李敖致陈绍鹏信",
    "以全套计划说明写作生涯安排。",
  ),
  lineRow(
    "046.答小朋友宏智.txt",
    11,
    19,
    "宋诗",
    "陆游《海棠》",
    "李敖抄陆游四句小诗答谢慰问。",
  ),
  lineRow(
    "058.谢赠酒寄周弃子.txt",
    7,
    7,
    "独酌无相亲",
    "唐诗句",
    "李白《月下独酌》",
    "说明不愿独饮。",
  ),
  lineRow(
    "058.谢赠酒寄周弃子.txt",
    13,
    27,
    "现代诗",
    "周弃子《寄卓如》",
    "李敖重抄周弃子旧作并以卓如自况。",
  ),
  row(
    "058.谢赠酒寄周弃子.txt",
    29,
    29,
    "国人欲知公归处，暮雨潇潇白下门",
    "旧诗句",
    "原书未注出处",
    "由周弃子诗中白下一典联想到的旧诗。",
    "出处待校对轮细化。",
  ),
];

data.forEach((record, index) => {
  record.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

const columns = [
  "id",
  "book",
  "chapter",
  "source_file",
  "line_start",
  "line_end",
  "quote_text",
  "category",
  "source_or_origin",
  "summary",
  "notes",
];

const riskPattern =
  /(政治|政府|总统|选举|自由主义|国民党|共产党|民主|国家|国运|法院|警察|竞选|总干事|统治|特务|坐牢|军官|教官|政客|公共|学生组织|钱思亮|台湾大学|革命|暴动|政变|自由民主|全体主义|国家主义|反共|戒严|查禁|禁书|新闻局|警总|立法院|内政部)/;

const candidatePattern =
  /[“”‘’《》「」『』]|诗曰|诗云|诗言|古人说|古语|俗话|谚语|常言|所谓|曰：|云：|写道：|说：|佛|圣经|诗|词|格言|成语|典故|胡适|柳子厚|陶渊明|憨山|陆游|周弃子|李白|Henry Adams|Physician|Our country|Dr\. Jekyll|DDT|[A-Za-z]{4,}/i;

function validateRows(rows) {
  const sourceSet = new Set(sourceFiles());
  const ids = new Set();
  const errors = [];
  for (const record of rows) {
    if (ids.has(record.id)) errors.push(`duplicate id ${record.id}`);
    ids.add(record.id);

    if (!sourceSet.has(record.source_file)) {
      errors.push(`${record.id}: missing file ${record.source_file}`);
      continue;
    }

    const sourceText = readLines(record.source_file)
      .slice(record.line_start - 1, record.line_end)
      .join("\n");
    if (
      !sourceText.includes(record.quote_text) &&
      !compact(sourceText).includes(compact(record.quote_text))
    ) {
      errors.push(`${record.id}: quote not found in ${record.source_file}:${record.line_start}-${record.line_end}`);
    }
  }

  if (errors.length) {
    throw new Error(errors.join("\n"));
  }
}

function writeCsv(rows, csvPath) {
  const lines = [
    columns.join(","),
    ...rows.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
  ];
  fs.writeFileSync(csvPath, `\uFEFF${lines.join("\r\n")}\r\n`, "utf8");
}

function writeTxt(rows, txtPath) {
  const lines = [];
  lines.push(`《${book}》诗文格言歌谣引用`);
  lines.push(`生成日期：${generatedDate}`);
  lines.push(`条目数：${rows.length}`);
  lines.push("");
  for (const record of rows) {
    lines.push(`${record.id}｜${record.chapter}｜${record.source_file}:${record.line_start}-${record.line_end}`);
    lines.push(`类别：${record.category}`);
    lines.push(`来源：${record.source_or_origin}`);
    lines.push("原文：");
    lines.push(record.quote_text);
    lines.push(`说明：${record.summary}`);
    if (record.notes) lines.push(`备注：${record.notes}`);
    lines.push("");
  }
  fs.writeFileSync(txtPath, `\uFEFF${lines.join("\r\n")}`, "utf8");
}

function collectCandidates(rows) {
  const selectedKeys = new Set(rows.map((record) => `${record.source_file}:${record.line_start}:${record.line_end}`));
  const candidates = [];
  let totalLines = 0;
  let riskLines = 0;
  for (const file of sourceFiles()) {
    const lines = readLines(file);
    totalLines += lines.length;
    lines.forEach((line, index) => {
      const text = line.trim();
      if (!text) return;
      if (/李敖影音|李敖数字博物馆|资源下载站|leeaoweb|leeao\.net|wjm_tcy|jeff Ao/.test(text)) return;
      const risk = riskPattern.test(text);
      if (risk) riskLines += 1;
      if (!candidatePattern.test(text) && !risk) return;
      const lineNumber = index + 1;
      candidates.push({
        source_file: file,
        line: lineNumber,
        text,
        risk,
        selected: [...selectedKeys].some((key) => {
          const [selectedFile, start, end] = key.split(":");
          return selectedFile === file && lineNumber >= Number(start) && lineNumber <= Number(end);
        }),
        context: lines
          .slice(Math.max(0, index - 1), Math.min(lines.length, index + 2))
          .map((item) => item.trim())
          .filter(Boolean)
          .join(" / "),
      });
    });
  }
  return { totalLines, riskLines, candidates };
}

function writeAnalysis(rows, candidatesInfo) {
  const candidateJsonPath = path.join(analysisDir, "liao_xiedexin_quote_candidates.json");
  fs.writeFileSync(candidateJsonPath, JSON.stringify(candidatesInfo.candidates, null, 2), "utf8");

  const reviewTsvPath = path.join(analysisDir, "liao_xiedexin_review_candidates.tsv");
  const reviewRows = candidatesInfo.candidates.filter((candidate) => !candidate.selected);
  const reviewLines = [
    "source_file\tline\trisk\ttext\tcontext",
    ...reviewRows.map((candidate) =>
      [
        candidate.source_file,
        candidate.line,
        candidate.risk ? "true" : "false",
        tsvEscape(candidate.text),
        tsvEscape(candidate.context),
      ].join("\t"),
    ),
  ];
  fs.writeFileSync(reviewTsvPath, `\uFEFF${reviewLines.join("\r\n")}\r\n`, "utf8");

  const attributedTsvPath = path.join(analysisDir, "liao_xiedexin_attributed_lines.tsv");
  const attributedLines = [
    "source_file\tline\tselected\ttext",
    ...candidatesInfo.candidates.map((candidate) =>
      [
        candidate.source_file,
        candidate.line,
        candidate.selected ? "selected" : "pending",
        tsvEscape(candidate.text),
      ].join("\t"),
    ),
  ];
  fs.writeFileSync(attributedTsvPath, `\uFEFF${attributedLines.join("\r\n")}\r\n`, "utf8");

  const auditPath = path.join(analysisDir, "liao_xiedexin_initial_audit.tsv");
  const auditLines = [
    "decision\tid\tsource_file\tline_range\tcategory\trisk_in_quote\tquote_text\treason",
    ...rows.map((record) =>
      [
        "keep",
        record.id,
        record.source_file,
        `${record.line_start}-${record.line_end}`,
        record.category,
        riskPattern.test(record.quote_text) ? "yes" : "no",
        tsvEscape(record.quote_text),
        tsvEscape(record.summary),
      ].join("\t"),
    ),
  ];
  fs.writeFileSync(auditPath, `\uFEFF${auditLines.join("\r\n")}\r\n`, "utf8");

  const categoryCounts = new Map();
  for (const record of rows) {
    categoryCounts.set(record.category, (categoryCounts.get(record.category) ?? 0) + 1);
  }
  const riskyRows = rows.filter((record) => riskPattern.test(record.quote_text));
  const explicitlyExcluded = [
    "023/025.《大风雪》解禁：禁书、公共审查与市政迷信语境密集，仅保留独立诗句。",
    "024.给尚勤信中的几段：禁书、演说、民主自由等公共政治语境密集，未收。",
    "035.邮局查扣信件：邮政查扣公共争议语境，未收。",
    "037.莫德惠劝进袁世凯做皇帝及其他：出版法、宪法、违宪诉讼语境，未收。",
    "040.论留学生立场：海外学人、侨务、国民党报刊等公共语境，未收。",
    "047.知识人怎样影响群众：群众、国民党合作、自由民主等语境，未收。",
    "048.反以暴易暴：革命、暴动、政变、统治者等政治暴力语境，未收两首古诗。",
    "049/050.给M：全体主义、国家主义、实际政治语境密集，校对轮删除其中古典诗句。",
    "057.致沈剑虹：立法院、新闻局、公开信语境，未收。",
    "059.致左舜生：反共、言论自由、文化运动、政治人才等谈话基准，未收。",
  ];

  const report = [];
  report.push(`《${book}》首轮抽取报告`);
  report.push(`生成日期：${generatedDate}`);
  report.push(`源目录：${path.join(process.cwd(), sourceDir)}`);
  report.push(`源文件数：${sourceFiles().length}`);
  report.push(`源总行数：${candidatesInfo.totalLines}`);
  report.push(`候选行数：${candidatesInfo.candidates.length}`);
  report.push(`风险词行数：${candidatesInfo.riskLines}`);
  report.push("");
  report.push(`首轮收录条目：${rows.length}`);
  report.push(`CSV：${path.join(process.cwd(), outDir, `${book}_诗文格言歌谣引用.csv`)}`);
  report.push(`TXT：${path.join(process.cwd(), outDir, `${book}_诗文格言歌谣引用.txt`)}`);
  report.push(`审计：${path.join(process.cwd(), auditPath)}`);
  report.push("");
  report.push("类别分布：");
  for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    report.push(`- ${category}: ${count}`);
  }
  report.push("");
  report.push(`核心政治风险命中：${riskyRows.length}`);
  for (const record of riskyRows) {
    report.push(`- ${record.id}\t${record.source_file}:${record.line_start}\t${record.quote_text}`);
  }
  report.push("");
  report.push("本轮特别排除：");
  for (const item of explicitlyExcluded) report.push(`- ${item}`);
  report.push("");
  report.push("首轮取舍说明：");
  report.push("- 收录古典诗文、佛教诗偈、圣经俗语、英文教育名言、现代文人诗论，以及可独立成立的李敖自作词句。");
  report.push("- 对明显政治公共语境的引文从严处理；即使是诗句，若核心功能服务革命、国家主义、言论自由或公共权力争论，本轮先不收。");
  report.push("- 校对轮已删除石达开伪诗、给M信中古典诗句，以及弱私信玩笑短语。");

  const reportPath = path.join(analysisDir, "liao_xiedexin_initial_report.txt");
  fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(analysisDir, { recursive: true });
  for (const file of sourceFiles()) readLines(file);

  validateRows(data);

  const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
  const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
  writeCsv(data, csvPath);
  writeTxt(data, txtPath);
  writeAnalysis(data, collectCandidates(data));

  console.log(JSON.stringify({
    book,
    records: data.length,
    csvPath,
    txtPath,
    reportPath: path.join(analysisDir, "liao_xiedexin_initial_report.txt"),
    auditPath: path.join(analysisDir, "liao_xiedexin_initial_audit.tsv"),
    candidatePath: path.join(analysisDir, "liao_xiedexin_quote_candidates.json"),
    reviewPath: path.join(analysisDir, "liao_xiedexin_review_candidates.tsv"),
    attributedPath: path.join(analysisDir, "liao_xiedexin_attributed_lines.tsv"),
  }, null, 2));
}

main();
