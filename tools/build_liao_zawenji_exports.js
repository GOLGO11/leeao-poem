const fs = require("fs");
const path = require("path");

const book = "李敖杂文集";
const idPrefix = "LAZWJ";
const generatedDate = "2026-06-18";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "003.惊世杂文类",
  "014.李敖杂文集",
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

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
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
  row("001.我的希望.txt", 5, 5, "人必自侮，而后人侮之", "孟子名句", "《孟子·离娄上》", "李敖写青年自励时引孟子语，保留古典格言本身，周边救国议论不入表。"),
  row("001.我的希望.txt", 7, 7, "执事者各司其事", "传统格言", "传统职责格言", "李敖用来说明各人在其位尽其责，作为格言式表达保留。"),
  row("001.我的希望.txt", 9, 9, "努力去做那些最近于你们目前的事", "西方格言", "克莱勒语（文中作此名）", "李敖明指克莱勒之语，强调先做切近之事。"),
  row("001.我的希望.txt", 9, 9, "在这世界里，就好像在大海中，最要紧的，是先救你自己", "西方文学格言", "易卜生语", "李敖明指易卜生之语，作为自助箴言保留。"),
  row("001.我的希望.txt", 9, 9, "自作孽，不可活", "尚书名句", "《尚书·太甲》语意", "李敖借古语说明自招其祸，保留典故化格言。"),
  row("003.李敖札记.txt", 5, 5, "你可以想要多快乐就多快乐", "林肯语", "林肯语（文中转述）", "李敖谈快乐技术时转述林肯语，保留为格言。"),
  row("003.李敖札记.txt", 5, 5, "“形式”可以决定“内容”、“程序”可以影响“实质”", "李敖格言", "李敖札记", "李敖将快乐与行为技术相连，概括为形式、程序影响内容、实质。"),
  row("003.李敖札记.txt", 7, 7, "泪痕犹在，已见笑脸", "李敖格言", "李敖札记标题", "标题式短句，概括儿童啼笑转化之快，非政治语录。"),
  row("003.李敖札记.txt", 13, 13, "国王之新衣", "外国文学典故", "安徒生童话《皇帝的新装》", "李敖用童话典故讽刺自欺，保留典故名。"),
  row("005.退孙中山的票.txt", 5, 5, "与人为善", "孟子成语", "《孟子·公孙丑上》", "只保留成语本身，司法与革命信件相关政论引文不入表。"),
  row("010.我所知道的韩福瑞.txt", 9, 9, "破涕为笑", "传统成语", "传统成语", "李敖改写的韩福瑞轶事中使用此成语；政治人物轶事不入表，仅保留成语本身。"),
  row("010.我所知道的韩福瑞.txt", 15, 15, "小巫见大巫", "传统成语", "传统成语", "李敖改写的韩福瑞轶事中使用此成语；政治人物轶事不入表，仅保留成语本身。"),
  lineRow("009.关于厦门大学聘书诗三首.txt", 7, 21, "李敖诗", "李敖《感谢崇实校长》", "李敖回应厦门大学聘书所作短诗之一，保留整首。"),
  lineRow("009.关于厦门大学聘书诗三首.txt", 25, 39, "李敖诗", "李敖《感谢支平院长》", "李敖回应厦门大学聘书所作短诗之一，保留整首。"),
  lineRow("009.关于厦门大学聘书诗三首.txt", 43, 57, "李敖诗", "李敖《致陈平景》", "李敖回应厦门大学聘书所作短诗之一，保留整首。"),
  lineRow("012.中国奥运歌.txt", 3, 37, "李敖歌词", "李敖《中国奥运歌》", "李敖二〇〇七年所作奥运歌，按歌谣文本保留，不作为政治语录。"),
  row("013.《李敖中文大句典》构想书.txt", 3, 3, "畅所欲译", "林语堂谐语", "林语堂词典相关评语；括注为 translate with gusto", "李敖评论《林语堂当代汉英词典》个别译法时保留此谐语。"),
  row("013.《李敖中文大句典》构想书.txt", 5, 5, "何陋之有", "古典名句", "《论语·子罕》语意，刘禹锡《陋室铭》亦用", "李敖谈自备书房时化用古典名句。"),
  row("013.《李敖中文大句典》构想书.txt", 5, 5, "前无古人后无来者", "传统成语", "陈子昂《登幽州台歌》语意衍化", "李敖描述中文句典构想规模时使用，保留成语。"),
  row("013.《李敖中文大句典》构想书.txt", 7, 7, "拨云见日", "传统成语", "传统成语", "李敖写两岸隔世后文化工程出现转机，保留成语本身。"),
  row("013.《李敖中文大句典》构想书.txt", 7, 7, "周邦新命", "诗经化用", "《诗经·大雅·文王》“周虽旧邦，其命维新”语意", "李敖以古典语汇形容文化新局，保留典故化短语。"),
  row("014.给吕佳真的工作日志.txt", 11, 11, "谨言慎行", "传统格言", "传统座右铭用语", "李敖称其为座右铭，保留为非政治格言。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 5, 5, "行云流水", "传统成语", "传统文章风格成语", "李敖形容答问文字随兴自然，保留成语。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 5, 5, "老生常谈", "传统成语", "传统成语", "李敖列举可答问题类型时使用，保留成语本身。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 5, 5, "以不教教之，是谓教也。", "古语", "文中称“古语”", "李敖说明不答也是一种答时引用，保留古语。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 5, 5, "不言之教", "老子名句", "《老子》语意", "李敖承接古语说明沉默之教，保留道家成语。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 19, 19, "崑山之圃，到处如是璆琳琅玕", "章太炎书信名句", "章太炎致沈延国信", "李敖说明章太炎学问丰赡时引用，保留典雅比喻。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 15, 15, "如鲁失宝玉大弓耳！", "典故化用", "章太炎书信化用鲁失宝玉大弓典故", "章太炎挖苦胡适时的典故化语，保留。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 23, 23, "吉光片羽", "传统成语", "神兽吉光片羽典故衍化", "李敖形容胡适谈吐遗存，保留成语。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 35, 35, "生不逢时", "传统成语", "传统成语", "李敖自述时代错位时使用，保留成语本身。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 35, 35, "相见恨晚", "传统成语", "传统成语", "李敖反转“相见恨早”前先用常语，保留。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 35, 35, "相见恨早", "李敖化用成语", "由“相见恨晚”反转化用", "李敖用以写时代错位，保留为化用成语。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 35, 35, "回向", "佛教用语", "《华严经》等佛教语汇", "文中明指《华严经》的回向心境，保留宗教典故词。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 37, 37, "举世誉之而不加劝，举世非之而不加沮", "庄子名句", "《庄子·逍遥游》语意", "李敖用以写不随毁誉而动，保留古典名句。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 37, 37, "虽千万人，吾往矣！", "孟子名句", "《孟子·公孙丑上》语意", "李敖用以写特立独行气概，保留古典名句，周边政党例证不入表。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 37, 37, "立德、立功、立言", "左传名句", "《左传·襄公二十四年》三不朽语", "李敖引用三不朽成说，保留古典名句。"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 41, 41, "只此两家，别无分号", "传统俗语", "传统店铺广告套语", "李敖说明文章刊发去处时借用俗语，保留非政治化表达。"),
  row("001.我的希望.txt", 5, 5, "眼高手低", "传统成语", "传统成语", "李敖批评空喊时使用此成语；政治议论不入表，仅补收成语本身。", "校对补入"),
  row("001.我的希望.txt", 5, 5, "志大才疏", "传统成语", "传统成语", "李敖批评空喊时使用此成语；政治议论不入表，仅补收成语本身。", "校对补入"),
  row("001.我的希望.txt", 11, 11, "奉为圭臬", "传统成语", "传统成语", "李敖谈立下目标时使用，校对补收为格言化成语。", "校对补入"),
  row("003.李敖札记.txt", 5, 5, "快乐是里应外合的。", "李敖格言", "李敖札记", "李敖谈快乐的内外生成，校对补入其非政治短句。", "校对补入"),
  row("015.《政治家》开“李敖答问”专栏缘起.txt", 41, 41, "出言无状", "传统成语", "传统成语", "李敖自评前文五点时使用，校对补收成语本身。", "校对补入"),
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

const rows = data.map((item, index) => ({
  ...item,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csv = [
  columns.join(","),
  ...rows.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
].join("\n");

const outCsv = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_zawenji_proofread_report.txt");
const auditPath = path.join(analysisDir, "liao_zawenji_proofread_audit.tsv");

fs.writeFileSync(outCsv, `${csv}\n`, "utf8");

const txt = rows
  .map((record) =>
    [
      `${record.id} ${record.quote_text}`,
      `  位置：${record.source_file}:${record.line_start}-${record.line_end}`,
      `  类型：${record.category}`,
      `  出处：${record.source_or_origin}`,
      `  说明：${record.summary}`,
      record.notes ? `  备注：${record.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n\n");

fs.writeFileSync(outTxt, `${txt}\n`, "utf8");

const excludedNotes = [
  "002 狱中书信两封：监狱书刊规则、私人书信与编者按，未见可独立保留的诗文格言。",
  "004 台大校长不要脸：校训和报刊引文处于政论攻击语境，首轮排除。",
  "005 退孙中山的票：革命信件、陪审制度、司法谈话等政治/法政语录排除，仅留“与人为善”。",
  "006 义助慰安妇：战事证言与现代历史责任论述排除。",
  "007 为什么要声讨法轮功？：宗教政治论战与政治口号排除。",
  "008 阿扁的四条出路：政党派系讽刺排除。",
  "010 我所知道的韩福瑞：政治人物轶事整体排除，仅保留成语级条目。",
  "011 关于韩福瑞和他的思想：现代政治人物思想、政策和反极端主义语录排除。",
  "015 《政治家》专栏缘起：只收古语、典故、成语；政治自我定位和政党例证不入表。",
];

const initialTotal = 37;
const proofreadAddedRows = rows.filter((record) => record.notes.includes("校对补入"));
const revisedRows = rows.filter((record) => record.notes.includes("校对修订"));
const deletedRows = 0;

const report = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  `首轮导出：${initialTotal} 条`,
  `校对补入：${proofreadAddedRows.length} 条；删除：${deletedRows} 条；文本修订：${revisedRows.length} 条`,
  `校对后导出：${rows.length} 条`,
  "",
  "本轮边界：保留诗、歌词、古语、成语、典故和非政治格言；排除政治口号、政治人物语录、政策/司法/战事证言类文字。",
  "边界观察：《中国奥运歌》按歌谣文本保留，不归为政治人物、政党或政策语录；校对轮未删除。",
  "补漏说明：补入《我的希望》中的“眼高手低”“志大才疏”“奉为圭臬”，《李敖札记》中的“快乐是里应外合的。”，以及《政治家》专栏缘起中的“出言无状”。",
  "",
  "排除说明：",
  ...excludedNotes.map((note) => `- ${note}`),
  "",
  `CSV：${outCsv}`,
  `TXT：${outTxt}`,
].join("\n");

fs.writeFileSync(reportPath, `${report}\n`, "utf8");

const auditHeader = ["id", "decision", "source_file", "line_start", "line_end", "quote_text", "category", "reason"];
const auditRows = rows.map((record) =>
  [
    record.id,
    "keep",
    record.source_file,
    record.line_start,
    record.line_end,
    record.quote_text.replace(/\n/g, "\\n"),
    record.category,
    record.summary,
  ].join("\t"),
);
fs.writeFileSync(auditPath, `${auditHeader.join("\t")}\n${auditRows.join("\n")}\n`, "utf8");

console.log(JSON.stringify({ book, rows: rows.length, outCsv, outTxt, reportPath, auditPath }, null, 2));
