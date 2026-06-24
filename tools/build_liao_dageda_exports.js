const fs = require("fs");
const path = require("path");

const book = "李敖大哥大";
const idPrefix = "LADGD";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "006.李敖大哥大");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_dageda_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_dageda_review_candidates.tsv");
const auditTsv = path.join("analysis", "liao_dageda_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_dageda_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_dageda_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_dageda_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => /^\d{3}\..+\.txt$/.test(name))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const fullPath = path.join(sourceDir, file);
  const text = sourceDecoder.decode(fs.readFileSync(fullPath));
  sourceCache.set(file, {
    text,
    lines: text.split(/\r?\n/),
  });
}

function sourceFile(prefix) {
  const found = files.find((file) => file.startsWith(prefix));
  if (!found) throw new Error(`Source file not found for prefix: ${prefix}`);
  return found;
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"']/g, "")
    .replace(/\s+/g, "");
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, note, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(filePrefix);
  const notes = [
    "首轮保守收入：本书节目政治评论密度极高，仅取可独立成立的诗文、古文名句、成语俗谚、小说文句和非政治格言；重复片头只收首见。",
    extraNotes,
  ].filter(Boolean).join(" ");
  return {
    id: "",
    book,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: attributedTo,
    summary: note,
    notes,
  };
}

const rawRows = [
  q(
    "001.",
    3,
    "快看李敖大哥大，打开天窗说亮话。\n狗男狗女我全骂，好人喜欢坏人怕。\n酸甜以后又苦辣，摆平以后又上下。\n只有真理没八卦，快看李敖大哥大。",
    "节目片头歌",
    "《李敖大哥大》片头歌",
    "每集片头反复出现的节目歌谣，首轮只收第一见。",
    9,
  ),
  q("001.", 11, "人过了60岁以后，谁比谁先走，谁比谁先死，就不知道了", "现代文人格言", "梁实秋语", "李敖谈开刀后复出时转述梁实秋对年寿无常的提醒。"),
  q("001.", 25, "赵四风流朱五狂，翩翩蝴蝶正当行。温柔乡是英雄冢，哪管东师入沈阳。", "近代诗句", "马君武诗句", "李敖讲九一八当晚张学良传闻时引用马君武讽刺诗。"),
  q("002.", 29, "此度见花枝，白头誓不归", "古典词句", "古人词句", "李敖谈张学良晚年不返乡时引用古词。"),
  q("003.", 19, "call a spade spade", "英文俗语", "英语俗语", "李敖说明名正言顺时引英文俗语。"),
  q("003.", 19, "觚不觚，觚哉？觚哉？", "论语名句", "《论语·雍也》", "李敖借孔子论觚说明名实相符。"),
  q("004.", 59, "飞来山上千寻塔，闻说鸡鸣见日升。不畏浮云遮望眼，自缘身在最高层。", "宋诗", "王安石《登飞来峰》", "李敖谈“最高层”时请观众背诵王安石诗。"),
  q("004.", 65, "绕岸车鸣水欲干，鱼儿相逐尚相欢。无人挈入沧江去，汝死哪知世界宽？", "宋诗", "王安石《鱼儿》", "李敖借王安石诗说明眼界宽窄。"),
  q("004.", 79, "一根鸡巴往里戳", "小说文句", "《红楼梦》俗语文句", "李敖说明粗俗字词也见于古典小说。"),
  q("006.", 55, "以德报怨，何以报德？", "论语名句", "《论语·宪问》", "李敖说明孔子不赞成无条件以德报怨。"),
  q("006.", 55, "以直报怨", "论语名句", "《论语·宪问》", "李敖承接孔子答问，强调以直报怨。"),
  q("010.", 11, "老马之智可用也", "成语典故", "管仲老马识途典故", "李敖以管子老马识途典故开启“老马之智”话题。"),
  q("013.", 13, "维摩虽病有神通", "宋诗句", "王安石诗句", "李敖谈维摩诘故事时引用王安石诗句。"),
  q("022.", 91, "五色令人目盲，五音令人耳聋", "老子名句", "《老子》", "李敖回答观众时引用老子说明声色诱惑使人难以专心。"),
  q("031.", 15, "衣带渐宽终不悔，为伊消得人憔悴。", "宋词名句", "柳永词句", "李敖展示胡适题字时引用柳永词句。"),
  q("032.", 67, "行万里路，读万卷书", "古典读书格言", "董其昌语", "李敖谈神游北京时引用董其昌读书行路格言。"),
  q("034.", 103, "一刀初刺虎犹纵，三刀四刀虎不动。", "清诗句", "袁枚《费宫人刺虎歌》", "李敖谈小说修辞技巧时引用袁枚诗句。"),
  q("035.", 43, "如果没有上帝，我们也会造一个。", "西方哲学格言", "尼采语意", "李敖批评迎佛骨和民间造神心理时引用尼采语意。"),
  q("037.", 27, "一缕芳魂上玉楼，万斛明珠何处求。阿弥陀佛西方去，我的肉来我的油。", "民间打油诗", "民间笑话诗", "李敖讲四个情夫吊唁故事时引用身份各异的打油诗。"),
  q("037.", 31, "好读书，不求甚解", "古文名句", "陶渊明《五柳先生传》", "李敖谈过度解读时引用陶渊明自述。"),
  q("038.", 15, "身首异处", "成语", "中国成语", "李敖谈关公头身分离故事时引用成语。"),
  q("038.", 15, "还吾头来！", "小说戏曲文句", "《三国演义》关公故事", "李敖讲关公显灵向普净和尚索头的小说情节。"),
  q("038.", 17, "斩颜良、诛文丑，过五关、斩六将", "小说成句", "《三国演义》关公故事", "李敖承接关公故事时引用小说成句。"),
  q("048.", 47, "你能守寡就守，不能守寡就嫁人，改嫁也好。", "民间故事格言", "清代贞节牌坊故事", "李敖重述守寡老太太临终告诫女眷的话。"),
  q("056.", 45, "Et tu, Brute？", "戏剧名句", "莎士比亚《裘力斯·凯撒》", "李敖讲凯撒遇刺时引用莎士比亚剧中拉丁名句。"),
  q("056.", 45, "还有你！布鲁塔斯。", "戏剧译句", "李敖译莎士比亚语意", "李敖批评梁实秋译法太文，提出更有现场情绪的译句。"),
  q("059.", 15, "光阴如箭，日月如梭", "传统套语", "中国传统俗语", "李敖谈文章老套时举出的传统套语。"),
  q("063.", 43, "纷纷易尽百年身，举世何人识道真。力去陈言夸末俗，可怜无补费精神。", "宋诗", "王安石《韩子》", "李敖谈“可怜无补费精神”时完整诵读王安石诗。"),
  q("064.", 19, "唧唧复唧唧，木兰当户织。不闻机杼声，唯闻女叹息。", "乐府诗句", "《木兰辞》", "李敖回忆小学时解释《木兰辞》开头四句。"),
  q("064.", 19, "我闻琵琶已叹息，又闻此语重唧唧。同是天涯沦落人，相逢何必曾相识。", "唐诗名句", "白居易《琵琶行》", "李敖以《琵琶行》证明“唧唧”为叹息声。"),
  q("064.", 26, "历览前贤国与家，成由勤俭败由奢。", "唐诗名句", "李商隐诗句", "李敖转述胡适以李商隐诗反驳单凭文体断代。"),
  q("064.", 26, "老子又不是我的老子，他在孔子前在孔子后，对我有什么好处啊？", "现代文人俏皮语", "胡适语", "李敖转述胡适谈老子年代争论的机智语。"),
  q("064.", 38, "道生一，一生二，二生三，三生万物。万物负阴而抱阳，冲气以为和。", "老子名句", "《老子》", "李敖解释“负”字古义时引用《老子》。"),
  q("066.", 33, "不看你的眼，不看你的眉。看了心里都是你，忘了我是谁。你的眼是谁的眼？你是谁？我不知道。", "歌词", "李敖《忘了我是谁》", "李敖说明《忘了我是谁》是自己在牢中看白墙写成的歌词。"),
  q("068.", 15, "浴乎沂，风乎舞雩，咏而归", "论语文句", "《论语·先进》", "李敖讲曾点志愿时引用《论语》文句。"),
  q("068.", 15, "吾与点也！", "论语名句", "《论语·先进》", "李敖说明孔子赞成曾点志愿时引用。"),
  q("072.", 35, "月堕浮云水卷空，天上云骄未肯同。歌舞可怜人暗换，身如泡沫亦如风。", "集句诗", "李敖集王安石句", "李敖说明自己用王安石诗句集成新诗。"),
  q("074.", 53, "平心而论，这个女孩子损失了什么呢？不过是生理上、肢体上一点点变态罢了！", "现代文人评论语", "胡适《论女子为强暴所污》", "李敖谈处女观念时转述胡适文章结语。"),
  q("079.", 21, "白马非马", "名家命题", "公孙龙子命题", "李敖讲公孙龙子逻辑时引用名家命题。"),
  q("079.", 21, "能胜人之口，不能服人之心", "古典评论语", "传统论公孙龙语", "李敖谈公孙龙辩论效果时引用传统评价。"),
  q("083.", 69, "此亦人子也，可善遇之！", "古典书信名句", "陶渊明书信语", "李敖谈待人设身处地时引用陶渊明告诫儿子的话。"),
  q("086.", 49, "虽有镃基，不如待时。", "孟子名句", "《孟子》", "李敖谈发明与时机时引用孟子语。"),
  q("089.", 37, "太阳底下没有新鲜的事", "谚语", "传统谚语", "李敖谈中西说法相通时引用谚语。"),
  q("089.", 37, "东海有圣人出焉，西海有圣人出焉。此心同，此理同。", "宋儒语录", "宋儒成说", "李敖说明东西方思想不谋而合时引用宋儒语。"),
  q("089.", 37, "彼窃钩者诛，窃国者为诸侯。", "庄子名句", "《庄子》", "李敖比较庄子与萧伯纳相近的讽刺结构。"),
  q("090.", 51, "读书众壑归沧海，落笔微云起泰山。", "对联", "溥心畬对联", "李敖谈溥心畬书法时引用其对联。"),
  q("091.", 39, "居天下之广居、立天下之正位、行天下之大道。得志与民由之；不得志独行其道。富贵不能淫、贫贱不能移、威武不能屈，此之谓大丈夫。", "孟子名句", "《孟子·滕文公下》", "李敖重引自己文章中评余登发为“大丈夫”的孟子标准。"),
  q("092.", 29, "已矣乎！吾未见好德如好色者也。", "论语名句", "《论语》", "李敖谈德色选择时引用孔子语。"),
  q("095.", 15, "上帝临女，无贰尔心。", "诗经名句", "《诗经》", "李敖解释“上帝临女”时引用《诗经》语。"),
  q("098.", 41, "三人行，必有我师。", "论语名句", "《论语·述而》", "李敖谈师友争辩时引用孔子语。"),
  q("098.", 41, "当仁不让于师。", "论语名句", "《论语·卫灵公》", "李敖说明真理面前不必让老师。"),
  q("098.", 41, "吾爱吾师，吾尤爱真理。", "西方哲学格言", "亚里士多德语意", "李敖以亚里士多德语意说明真理高于师承。"),
  q("101.", 13, "手把青秩秧插满田，低头便见水中天。身心清净方为道，退步原来是向前。", "禅诗", "传统插秧诗", "李敖评论传统插秧诗第三句抽象。", 13, "源文首次作“青秩秧”，按底本保留；同段后文改作处作“青秧”。"),
  q("101.", 13, "手把青秧插满田，低头便见水中天。其正若反方为道，退步原来是向前。", "改作诗句", "李敖改传统插秧诗", "李敖把插秧诗第三句改为“其正若反方为道”。"),
  q("102.", 11, "宰相有权能割地", "近代诗句", "丘逢甲诗句", "李敖谈陆以正书名时引用丘逢甲诗句。"),
  q("102.", 11, "孤臣无力可回天", "近代诗句", "丘逢甲诗句", "李敖谈陆以正书名时引用丘逢甲诗句。"),
  q("102.", 11, "微管仲，吾其披发左衽矣。", "论语名句", "《论语·宪问》", "李敖解释“微”字时引用孔子语。"),
  q("103.", 35, "时髦不能动", "李敖拟古格言", "李敖拟孟子语", "李敖在孟子三条之外加出知识分子不赶时髦的标准。"),
  q("115.", 27, "陆机雄才岂自保？李斯税驾苦不早。华亭鹤唳讵可闻？上蔡苍鹰何足道？君不见吴中张翰称达生，秋风忽忆江东行。且乐生前一杯酒，何须身后千载名？", "唐诗", "李白诗句", "李敖谈陆机《平复帖》时引用李白诗。"),
  q("117.", 15, "五经到今天为止还是只有一半懂得一半不懂的东西。", "现代学人格言", "胡适语", "李敖谈胡适《我们今日还不配读经》时引用其对经典整理的判断。"),
  q("125.", 25, "为政以德，譬如北辰。", "论语名句", "《论语·为政》", "李敖解释太岁与星象时引用孔子语。"),
  q("125.", 25, "太岁头上动土", "俗语", "中国俗语", "李敖解释太岁观念时引用俗语。"),
  q("125.", 43, "难进而易退", "古典格言", "古人语", "李敖谈做官进退标准时引用古语。"),
  q("125.", 43, "独与天地精神往来", "庄子名句", "《庄子》语意", "李敖谈独来独往的大声公精神时引用庄子语。"),
];

const proofreadBeforeRows = 59;
const proofreadRemovedRows = [
  ["LADGD-017", "儒以文乱法，侠以武犯禁。", "古典法理/法家政治格言，项目既有总表同类按古典法理名句排除；本轮删除。"],
];
const proofreadAddedRows = [
  ["一刀初刺虎犹纵，三刀四刀虎不动。", "袁枚《费宫人刺虎歌》", "首轮漏收的明确清诗句。"],
  ["如果没有上帝，我们也会造一个。", "尼采语意", "首轮漏收的西方哲学格言，非政治。"],
  ["Et tu, Brute？", "莎士比亚《裘力斯·凯撒》", "首轮漏收的戏剧名句。"],
  ["还有你！布鲁塔斯。", "李敖译莎士比亚语意", "首轮漏收的李敖译句，作为戏剧语意保留。"],
  ["读书众壑归沧海，落笔微云起泰山。", "溥心畬对联", "首轮漏收的书法语境对联。"],
  ["五经到今天为止还是只有一半懂得一半不懂的东西。", "胡适语", "首轮漏收的现代学人格言。"],
];
const proofreadChangedRows = [];

const modernPoliticalTerms = [
  "总统",
  "国民党",
  "共产党",
  "民进党",
  "新党",
  "亲民党",
  "李登辉",
  "陈水扁",
  "宋楚瑜",
  "连战",
  "蒋介石",
  "蒋经国",
  "毛泽东",
  "孙中山",
  "蔡英文",
  "陈文茜",
  "台独",
  "台湾独立",
  "中华民国",
  "中华人民共和国",
  "政府",
  "立法院",
  "监察院",
  "法院",
  "宪法",
  "选举",
  "竞选",
  "总统府",
  "政治犯",
  "军人干政",
  "中央日报",
  "两国论",
  "两岸",
  "国安局",
  "行政院",
];

function findQuoteLocation(row) {
  const source = sourceCache.get(row.source_file);
  const sourceLines = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
  const normalizedSource = normalizeText(sourceLines);
  const normalizedQuote = normalizeText(row.quote_text);
  return {
    found: normalizedSource.includes(normalizedQuote),
    sourceSnippet: sourceLines,
    normalizedQuote,
  };
}

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const auditRows = rows.map((row) => {
  const location = findQuoteLocation(row);
  const politicalHits = modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
  return {
    id: row.id,
    book: row.book,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
    quote_text: row.quote_text,
    category: row.category,
    source_or_origin: row.source_or_origin,
    found_in_source: location.found ? "yes" : "no",
    political_hits: politicalHits.join("|"),
    notes: row.notes,
  };
});

const missing = auditRows.filter((row) => row.found_in_source !== "yes");
const politicalFlagged = auditRows.filter((row) => row.political_hits);

if (missing.length > 0) {
  const detail = missing.map((row) => `${row.id} ${row.source_file}:${row.line_start} ${row.quote_text}`).join("\n");
  throw new Error(`Some quote_text values were not found in source lines:\n${detail}`);
}

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

const csvEscape = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function writeCsv(filePath, dataRows, dataColumns = columns) {
  const csv = [
    dataColumns.join(","),
    ...dataRows.map((row) => dataColumns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
  fs.writeFileSync(filePath, `${csv}\n`, "utf8");
}

function writeTsv(filePath, dataRows, dataColumns) {
  const tsv = [
    dataColumns.join("\t"),
    ...dataRows.map((row) => dataColumns.map((column) => String(row[column] ?? "").replace(/\r?\n/g, "\\n")).join("\t")),
  ].join("\n");
  fs.writeFileSync(filePath, `${tsv}\n`, "utf8");
}

function writeTxt(filePath, dataRows) {
  const lines = [
    `《${book}》诗文格言歌谣引用`,
    `生成日期：${generatedDate}`,
    `条目数：${dataRows.length}`,
    "",
  ];

  for (const row of dataRows) {
    lines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
    lines.push(row.quote_text);
    lines.push(`出处/来源：${row.source_or_origin}`);
    lines.push(`说明：${row.summary}`);
    if (row.notes) lines.push(`备注：${row.notes}`);
    lines.push("");
  }

  fs.writeFileSync(filePath, `${lines.join("\n").trimEnd()}\n`, "utf8");
}

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(candidatesJson), { recursive: true });

writeCsv(outCsv, rows);
writeTxt(outTxt, rows);
fs.writeFileSync(candidatesJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
writeTsv(reviewTsv, rows, columns);
writeTsv(auditTsv, auditRows, [
  "id",
  "book",
  "source_file",
  "line_start",
  "line_end",
  "quote_text",
  "category",
  "source_or_origin",
  "found_in_source",
  "political_hits",
  "notes",
]);

const categoryCounts = new Map();
const byFileCounts = new Map();
for (const row of rows) {
  categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1);
  byFileCounts.set(row.source_file, (byFileCounts.get(row.source_file) || 0) + 1);
}

const report = [
  `《${book}》诗文格言歌谣引用首轮/校对后报告`,
  `生成日期：${generatedDate}`,
  "",
  `源目录：${sourceDir}`,
  `源文件数：${files.length}`,
  `归因候选命中：1880`,
  `缩表候选命中：1935`,
  `首轮原始收入：${proofreadBeforeRows}`,
  `校对删除：${proofreadRemovedRows.length}`,
  `校对补入：${proofreadAddedRows.length}`,
  `校对后写出：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `源文命中异常：${missing.length}`,
  `quote_text现代政治词命中：${politicalFlagged.length}`,
  "",
  "分类统计：",
  ...[...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `- ${category}：${count}`),
  "",
  "筛选原则：",
  "- 只收可独立成立的诗文、古文名句、成语俗谚、小说/戏曲文句、李敖自作诗歌和少量非政治格言。",
  "- 排除现代政党人物语录、选战口号、新闻标题、政论判断、来宾/观众闲谈、节目串场、单纯书名歌名和直接现代政治口号。",
  "- 本书每篇开头片头歌高度重复，首轮只收第一见，避免 127 次重复污染总表。",
  "- 古典诗文若出现在现代政治评论语境中，首轮按诗文本体保留，校对轮再审其边界。",
  "- 校对轮删除古典法理/政治格言边界项；补入首轮漏掉的明确诗句、对联、戏剧名句和非政治学人格言。",
  "",
  "按文件分布：",
  ...Array.from(byFileCounts.entries()).map(([file, count]) => `- ${file}: ${count}`),
  "",
  `CSV：${outCsv}`,
  `TXT：${outTxt}`,
  `候选JSON：${candidatesJson}`,
  `审计TSV：${auditTsv}`,
].join("\n");

fs.writeFileSync(reportTxt, `${report}\n`, "utf8");

const proofreadAuditRows = [
  { action: "before", id: "", quote_text: "", reason: `校对前条目数：${proofreadBeforeRows}` },
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => ({
    action: "removed",
    id,
    quote_text: quoteText,
    reason,
  })),
  ...proofreadAddedRows.map(([quoteText, source, reason]) => ({
    action: "added",
    id: "",
    quote_text: quoteText,
    reason: `${source}：${reason}`,
  })),
  ...proofreadChangedRows.map(([id, quoteText, reason]) => ({
    action: "changed",
    id,
    quote_text: quoteText,
    reason,
  })),
  { action: "after", id: "", quote_text: "", reason: `校对后条目数：${rows.length}` },
];

writeTsv(proofreadAuditTsv, proofreadAuditRows, ["action", "id", "quote_text", "reason"]);

const proofreadReport = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  "",
  `校对前条目数：${proofreadBeforeRows}`,
  `删除：${proofreadRemovedRows.length}`,
  `补入：${proofreadAddedRows.length}`,
  `修改：${proofreadChangedRows.length}`,
  `校对后条目数：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `源文命中异常：${missing.length}`,
  `quote_text现代政治词命中：${politicalFlagged.length}`,
  "",
  "删除项：",
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => `- ${id}｜${quoteText}｜${reason}`),
  "",
  "补入项：",
  ...proofreadAddedRows.map(([quoteText, source, reason]) => `- ${quoteText}｜${source}｜${reason}`),
  "",
  `校对审计TSV：${proofreadAuditTsv}`,
].join("\n");

fs.writeFileSync(proofreadReportTxt, `${proofreadReport}\n`, "utf8");

console.log(JSON.stringify({
  book,
  rows: rows.length,
  outCsv,
  outTxt,
  reportTxt,
  auditTsv,
  proofreadReportTxt,
  proofreadAuditTsv,
  politicalFlagged: politicalFlagged.length,
}, null, 2));
