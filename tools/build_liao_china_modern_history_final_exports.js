const fs = require("fs");
const path = require("path");

const book = "中国现代史定论";
const idPrefix = "LACMHD";
const generatedDate = "2026-06-23";
const outDir = "exports";
const analysisDir = "analysis";
const analysisPrefix = "liao_china_modern_history_final";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "009.历史文化类",
  "009.中国现代史定论",
);

const sourceDecoder = new TextDecoder("gb18030");
const lineCache = new Map();
let cachedSourceFiles;

function sourceFiles() {
  if (!cachedSourceFiles) {
    cachedSourceFiles = fs.readdirSync(path.join(process.cwd(), sourceDir))
      .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
      .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  }
  return cachedSourceFiles;
}

function fileByPrefix(prefix) {
  const matches = sourceFiles().filter((file) => file.startsWith(prefix));
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one source file for prefix ${prefix}, got ${matches.length}`);
  }
  return matches[0];
}

function readLines(file) {
  if (!lineCache.has(file)) {
    const sourcePath = path.join(process.cwd(), sourceDir, file);
    lineCache.set(file, sourceDecoder.decode(fs.readFileSync(sourcePath)).split(/\r?\n/));
  }
  return lineCache.get(file);
}

function chapterFromFile(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
}

function compact(text) {
  return String(text).replace(/[\s　]+/g, "");
}

function comparable(text) {
  return compact(text)
    .replace(/（wjm_tcy注：[^）]*）/g, "")
    .replace(/（敖按：[^）]*）/g, "")
    .replace(/（李敖按：[^）]*）/g, "");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
}

function q(prefix, lineStart, quoteText, category, sourceOrigin, summary, notes = "", lineEnd = lineStart) {
  const sourceFile = fileByPrefix(prefix);
  return {
    id: "",
    book,
    chapter: chapterFromFile(sourceFile),
    source_file: sourceFile,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrigin,
    summary,
    notes,
  };
}

const rawRows = [
  q("002.", 5, "一言而可以兴邦", "经典成句", "《论语》", "李敖引《论语》说明言论责任之重大。"),
  q("002.", 5, "一言而可以丧邦", "经典成句", "《论语》", "李敖引《论语》说明言论失当也可能造成长远危害。"),
  q("002.", 7, "吾侪少数摇笔弄舌之人，自抒己见，殊不足以冒舆论之名。", "立言文句", "梁启超《政治之基础与言论家之指针》", "梁启超说明个人意见不应冒充舆论。"),
  q("002.", 7, "真足称为舆论者，大都不正当不适应。", "立言文句", "梁启超《政治之基础与言论家之指针》", "梁启超警惕所谓舆论未必正当适应。"),
  q("002.", 7, "吾侪所抒区区之己见，其果为正为适与否，亦良不敢自信。", "立言文句", "梁启超《政治之基础与言论家之指针》", "梁启超以自省态度谈立言责任。"),
  q("002.", 67, "和而不流", "经典成句", "孔子相关成句", "李敖借孔夫子所谓和而不流形容若即若离之态。"),

  q("004.", 21, "为政不于常，道善则得之，不善则失之矣。", "古文名句", "《尚书》相关文句", "傅斯年引书言说明为政得失系于道善与否。"),
  q("004.", 23, "火炎昆岗，玉石俱焚", "古文成句", "《尚书》相关成句", "傅斯年借古语形容祸乱波及良善。"),
  q("004.", 27, "十年生聚佐中兴", "寿联文句", "孔祥熙寿联", "傅斯年引用寿联片语反衬时人寄望。"),
  q("004.", 27, "饥者易为食，渴者易为饮", "古文成句", "传统成句", "傅斯年用古语解释民众因厌旧而易寄望新人。"),
  q("004.", 31, "君子可欺以其方", "古典成语", "传统成语", "傅斯年以此自省曾按原则信任财政政策。"),
  q("004.", 33, "栽者培之，倾者覆之", "古文成句", "传统成句", "傅斯年以成句说明应扶持可存续的工业。"),
  q("004.", 35, "大凡物不得其平则鸣", "韩愈文句", "韩愈《送孟东野序》", "傅斯年化用韩愈文说明不平则鸣。"),
  q("004.", 35, "以直道使人，虽劳不怨", "古文名句", "传统古文成句", "傅斯年以古语说明清正用人则人虽劳而不怨。"),
  q("004.", 75, "大鱼吃小鱼，小鱼吃虾米，虾米吃滋泥", "俗话", "民间俗话", "傅斯年借俗话比喻资本层层吞噬。"),
  q("004.", 99, "化家为国", "古人语", "古人语", "傅斯年引用古人所谓化家为国。"),

  q("005.", 7, "豹死留皮", "传统成语", "传统成语", "李敖借成语说明吴铁城晚年写回忆录的用意。"),
  q("005.", 7, "一字不苟", "传统成语", "传统成语", "吴铁城后人跋中形容回忆录写作谨严。"),
  q("005.", 71, "春秋论断", "史学成语", "春秋笔法传统", "吴铁城佚文中称选举批评为春秋论断。"),

  q("006.", 13, "夫未战而庙算胜者，得算多也，未战而庙算不胜者，得算少也，多算胜，少算不胜", "兵法名句", "《孙子兵法》", "杜聿明引《孙子兵法》说明胜败取决于庙算多少。"),
  q("007.", 7, "孔曰成仁，孟曰取义，惟其义尽，所以仁至；读圣贤书，所学何事，而今而后，庶几无愧。", "文天祥名句", "文天祥《衣带赞》", "刘峙回忆中引用文天祥成仁取义之语。"),

  q("008.", 1, "将军白发征夫泪", "宋词名句", "范仲淹《渔家傲·秋思》", "李敖以宋词句作篇名。"),
  q("008.", 3, "雪泥鸿爪", "古典成语", "苏轼诗文成句", "李敖用成语形容杜聿明零星回忆。"),
  q("008.", 9, "独善其身", "经典成句", "《孟子》相关成句", "冯亦鲁记杜聿明不忍危难中独自离去。"),

  q("009.", 11, "妙笔生花", "传统成语", "传统成语", "李敖用成语评《联合报》记者说法之虚美。"),
  q("009.", 11, "洗面革心", "传统成语", "传统成语", "李敖用成语形容黄维晚年转变。"),

  q("010.", 21, "刻骨难忘", "传统成语", "传统成语", "王仲廉回忆借棺葬父，称至今刻骨难忘。"),
  q("010.", 23, "移孝作忠", "传统成语", "传统伦理成语", "王仲廉回忆不能守制，只能移孝作忠。"),
  q("010.", 31, "天怒人怨", "传统成语", "传统成语", "王仲廉记民众以天怒人怨解释演讲出丑。"),
  q("010.", 37, "横征暴敛", "传统成语", "传统成语", "王仲廉回忆占领区税政时使用成语。"),
  q("010.", 47, "说什么，功勋高，冷眼沧桑寻常事，百战归来心神劳；\n乐林泉，访旧友，邻有芳草，相期道义守德操；\n居陋巷，闲无事，寻章撷句，漫将诗词和群豪；\n八成饱，睡得好，锻炼身体起床早，责任尽了，心安理得无烦恼；\n地长久，天不老，九子五婿齐家道，孙辈满堂环膝绕，怎敢比古时，郭老令公福禄与寿考，知足返璞乐陶陶。", "近人歌句", "王仲廉《万里长征归来歌》", "王仲廉回忆录后自记歌句，写晚年退居心境。", "", 55),
];

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

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const errors = [];
for (const row of rows) {
  const lines = readLines(row.source_file);
  const sourceText = lines.slice(row.line_start - 1, row.line_end).join("\n");
  if (
    !sourceText.includes(row.quote_text) &&
    !comparable(sourceText).includes(comparable(row.quote_text))
  ) {
    errors.push({
      id: row.id,
      source_file: row.source_file,
      line_start: row.line_start,
      line_end: row.line_end,
      quote_text: row.quote_text,
    });
  }
}

if (errors.length > 0) {
  console.error(JSON.stringify(errors, null, 2));
  throw new Error(`Quote validation failed for ${errors.length} rows`);
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, "中国现代史定论_诗文格言歌谣引用.csv");
const csvLines = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
];
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\n")}\n`, "utf8");

const txtLines = [];
txtLines.push(`《${book}》诗文格言歌谣引用`);
txtLines.push(`生成日期：${generatedDate}`);
txtLines.push(`条目数：${rows.length}`);
txtLines.push("");
for (const row of rows) {
  txtLines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txtLines.push(row.quote_text);
  txtLines.push(`出处/来源：${row.source_or_origin}`);
  txtLines.push(`说明：${row.summary}`);
  if (row.notes) txtLines.push(`备注：${row.notes}`);
  txtLines.push("");
}
const txtPath = path.join(outDir, "中国现代史定论_诗文格言歌谣引用.txt");
fs.writeFileSync(txtPath, `${txtLines.join("\n")}\n`, "utf8");

const candidatePath = path.join(analysisDir, `${analysisPrefix}_quote_candidates.json`);
fs.writeFileSync(candidatePath, JSON.stringify(rows, null, 2), "utf8");

const reviewLines = [
  "id\tfile\tline_start\tline_end\tchapter\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
  ...rows.map((row) =>
    [
      row.id,
      row.source_file,
      row.line_start,
      row.line_end,
      row.chapter,
      row.category,
      row.quote_text,
      row.source_or_origin,
      row.summary,
      row.notes,
    ].map(tsvEscape).join("\t"),
  ),
];
const reviewPath = path.join(analysisDir, `${analysisPrefix}_review_candidates.tsv`);
fs.writeFileSync(reviewPath, `\uFEFF${reviewLines.join("\n")}\n`, "utf8");

const duplicateGroups = [...rows.reduce((map, row) => {
  const key = compact(row.quote_text);
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(row);
  return map;
}, new Map()).values()].filter((group) => group.length > 1);

const politicalTerms = /(国民党|共产党|中共|台湾|大陆|党外|投匪|蒋经国|蒋介石|蒋委员长|三民主义|反共|政治犯|总统|领袖|革命|国民政府|中华民国|社会主义|帝国主义|美帝|苏联|抗俄|闽变|党国|救国|卖国|叛国|叛党|行宪|训政|豪门资本|共匪|剿共|徐蚌|淮海|解放军)/;
const quotePoliticalHits = rows.filter((row) => politicalTerms.test(row.quote_text));
const proofreadBeforeRows = 35;
const proofreadRemovedCount = 4;
const proofreadAddedCount = 0;

const auditLines = [
  "type\tdetail\tcount",
  ["selected_rows", "校对后保留的经典成句、立言文句、古文名句、成语俗话、宋词句、近人歌句", rows.length],
  ["skipped", "001章闽变举证表、政治控诉、党国/联共/卖国类材料从严跳过", 1],
  ["skipped", "002章胡秋原意识形态表态、苏联美国共产党相关政治语录从严跳过", 1],
  ["skipped", "003-009章现代战史谈话、政治判断、军政人物自白大多跳过，仅保留典故格言", 7],
  ["proofread_removed", "校对轮删除：傅斯年政治讽语、刘峙战败自述格言、王仲廉税政描述组句与自述短句", proofreadRemovedCount],
  ["proofread_added", "校对轮补入条目", proofreadAddedCount],
  ["political_quote_hits", "quote_text现代政治关键词命中", quotePoliticalHits.length],
  ["duplicate_groups", "完全相同quote_text重复组", duplicateGroups.length],
].map((row) => Array.isArray(row) ? row.map(tsvEscape).join("\t") : row);
const auditPath = path.join(analysisDir, `${analysisPrefix}_initial_audit.tsv`);
fs.writeFileSync(auditPath, `\uFEFF${auditLines.join("\n")}\n`, "utf8");

const categoryCounts = new Map();
for (const row of rows) categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);

const reportLines = [
  `《${book}》抽取报告（校对后）`,
  `生成日期：${generatedDate}`,
  `源目录：${sourceDir}`,
  `输出CSV：${csvPath}`,
  `输出TXT：${txtPath}`,
  `条目数：${rows.length}`,
  `ID范围：${rows[0]?.id} - ${rows.at(-1)?.id}`,
  "",
  "范围说明：本书以现代史辨伪、党史战史材料为主，政治语录密度高。校对后只保留可独立作为经典成句、立言文句、古文名句、成语俗话、宋词句与近人歌句的材料；闽变、联共、反共、战役政治判断、政党人物谈话、公文广告、意识形态表态与现代军政人物自我表白均从严跳过。",
  "",
  "校对处理：",
  `- 校对前条目数：${proofreadBeforeRows}。`,
  `- 删除条目数：${proofreadRemovedCount}。`,
  `- 补入条目数：${proofreadAddedCount}。`,
  "- 删除“化国为家”：傅斯年反转古语的政治讽喻，不作独立诗文格言保留。",
  "- 删除“真正的生命，是建筑在生命的价值上。”：刘峙战败回忆中的自我辩白句，现代军政语境偏强。",
  "- 删除“苛捐杂税，名目繁多，不胜枚举”：属于占领区税政描述组句，不是独立格言。",
  "- 删除“心安理得，俯仰无愧于天地。”：王仲廉回忆录自述短句，前后为本党任职与退役履历。",
  "",
  "自动复核：",
  `- quote_text现代政治关键词命中：${quotePoliticalHits.length} 条。`,
  `- 完全相同quote_text重复组：${duplicateGroups.length} 组。`,
];

if (quotePoliticalHits.length > 0) {
  reportLines.push("");
  reportLines.push("政治关键词命中明细：");
  for (const row of quotePoliticalHits) {
    reportLines.push(`- ${row.id}｜${row.quote_text.replace(/\n/g, " / ")}｜${row.notes || row.summary}`);
  }
}

if (duplicateGroups.length > 0) {
  reportLines.push("");
  reportLines.push("重复项明细：");
  for (const group of duplicateGroups) {
    const [first] = group;
    reportLines.push(`- ${first.quote_text.replace(/\n/g, " / ")}：${group.map((row) => `${row.id}@${row.source_file}:${row.line_start}`).join("；")}`);
  }
}

reportLines.push("");
reportLines.push("按类别统计：");
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => a[0].localeCompare(b[0], "zh-Hans-CN"))) {
  reportLines.push(`- ${category}：${count}`);
}

const reportPath = path.join(analysisDir, `${analysisPrefix}_initial_report.txt`);
fs.writeFileSync(reportPath, `${reportLines.join("\n")}\n`, "utf8");

const proofreadAuditLines = [
  "type\tdetail\tcount",
  ["before_rows", "校对前条目数", proofreadBeforeRows],
  ["removed", "傅斯年反转古语的政治讽喻", 1],
  ["removed", "刘峙战败回忆中的现代军政自述格言", 1],
  ["removed", "王仲廉占领区税政描述组句", 1],
  ["removed", "王仲廉回忆录中的自我表白短句", 1],
  ["added", "校对轮补入条目", proofreadAddedCount],
  ["after_rows", "校对后条目数", rows.length],
  ["political_quote_hits", "quote_text现代政治关键词命中", quotePoliticalHits.length],
  ["duplicate_groups", "完全相同quote_text重复组", duplicateGroups.length],
].map((row) => Array.isArray(row) ? row.map(tsvEscape).join("\t") : row);
const proofreadAuditPath = path.join(analysisDir, `${analysisPrefix}_proofread_audit.tsv`);
fs.writeFileSync(proofreadAuditPath, `\uFEFF${proofreadAuditLines.join("\n")}\n`, "utf8");

const proofreadReportLines = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  `校对前条目数：${proofreadBeforeRows}`,
  `删除条目数：${proofreadRemovedCount}`,
  `补入条目数：${proofreadAddedCount}`,
  `校对后条目数：${rows.length}`,
  `ID范围：${rows[0]?.id} - ${rows.at(-1)?.id}`,
  "",
  "本轮处理：",
  "- 删除“化国为家”：傅斯年反转“化家为国”的政治讽喻，保留古人语“化家为国”。",
  "- 删除“真正的生命，是建筑在生命的价值上。”：刘峙战败回忆中的自我辩白句，现代军政语境偏强。",
  "- 删除“苛捐杂税，名目繁多，不胜枚举”：占领区税政描述组句，不是独立诗文格言。",
  "- 删除“心安理得，俯仰无愧于天地。”：王仲廉本党任职与退役履历后的自述短句；同页《万里长征归来歌》作为歌句仍保留。",
  "",
  "复核结果：",
  `- quote_text现代政治关键词命中：${quotePoliticalHits.length} 条。`,
  `- 完全相同 quote_text 重复组：${duplicateGroups.length} 组。`,
];
const proofreadReportPath = path.join(analysisDir, `${analysisPrefix}_proofread_report.txt`);
fs.writeFileSync(proofreadReportPath, `${proofreadReportLines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  book,
  rows: rows.length,
  idStart: rows[0]?.id,
  idEnd: rows.at(-1)?.id,
  csvPath,
  txtPath,
  reportPath,
  auditPath,
  proofreadReportPath,
  proofreadAuditPath,
  reviewPath,
  candidatePath,
  politicalQuoteHits: quotePoliticalHits.length,
  duplicateGroups: duplicateGroups.length,
}, null, 2));
