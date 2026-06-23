const fs = require("fs");
const path = require("path");

const book = "李敖札记";
const idPrefix = "LAZJ";
const generatedDate = "2026-06-21";
const outDir = "exports";
const analysisDir = "analysis";
const sourceRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "006.沉思日记类",
  "007.李敖札记",
);
const sourceDecoder = new TextDecoder("gb18030");

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

function chapterFromFile(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\r?\n/g, "\\n").replace(/\t/g, " ");
}

function sourceLines(file) {
  const fullPath = path.join(sourceRoot, file);
  return sourceDecoder.decode(fs.readFileSync(fullPath)).replace(/\r\n/g, "\n").split("\n");
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

const data = [
  row(
    "005.施不全的尊容.txt",
    5,
    5,
    "处事唯求得中，岂可偏执？",
    "清代史传格言",
    "《清史稿》转录清圣祖语",
    "以居中不偏作为处事尺度。",
  ),
  row(
    "009.有朋党无政党.txt",
    3,
    3,
    "小人无朋，其暂为朋者，伪也。",
    "欧阳修古文",
    "欧阳修《朋党论》句",
    "以小人结朋多出伪合说明利害结合的短暂。",
  ),
  row(
    "009.有朋党无政党.txt",
    3,
    3,
    "小人与小人，以同利为朋，此自然之理也。",
    "欧阳修古文",
    "欧阳修《朋党论》句",
    "以同利相合说明小人结朋的根由。",
  ),
  row(
    "017.“拜码头”.txt",
    7,
    7,
    "夫‘斶前’为慕势，‘王前’为趋士。与使斶为慕势，不如使王为趋士。",
    "战国策引文",
    "《战国策》齐宣王见颜斶章",
    "颜斶以趋士胜过慕势，凸显士人自重。",
  ),
  row(
    "017.“拜码头”.txt",
    7,
    7,
    "士贵耳！王者不贵。",
    "战国策引文",
    "《战国策》齐宣王见颜斶章",
    "以士贵于王者的对答突出士的尊严。",
  ),
  row(
    "022.怎样杀老浑蛋？.txt",
    5,
    5,
    "缅人恶俗极多，有种族号曰浸，居于僻野之山社。凡遇其父母年岁老者，筑台一座甚高，恭请老人登其上，而社中幼壮男女相率而歌舞于台下，老人从台上和之；至老人乐极生狂，忘其在台上歌舞，跌下身死，则以火焚葬之。谓老人得天神之召，为莫大之荣幸云。",
    "古籍笔记引文",
    "苏曼殊《燕子龛随笔》引文",
    "记述异域弃老习俗，作为人类学掌故。",
  ),
  row(
    "034.没有大忏悔，只有大遮盖.txt",
    3,
    3,
    "遥爱云水秀，初疑路不同，安知清流转，偶与前山通。",
    "王维诗句",
    "王维诗句，原文转引",
    "以清流与前山相通写路径转合。",
  ),
  row(
    "035.三百六十的数字观.txt",
    3,
    3,
    "杭州三百六十行，各有市语。",
    "古籍掌故",
    "田汝成《游览志余》句",
    "说明三百六十行各有行业用语。",
  ),
  row(
    "039.古语今用更真实.txt",
    3,
    3,
    "不战而屈人之兵",
    "孙子兵法成句",
    "《孙子·谋攻》成句",
    "以不经交战即制服对方概括上策。",
    "校对补入：原文明称“古话”，只收古典成句本体，不收现代战争语境。",
  ),
  row(
    "039.古语今用更真实.txt",
    3,
    3,
    "决胜于千里之外",
    "史传成句",
    "史传成句，化自《史记·高祖本纪》“运筹帷幄之中，决胜千里之外”",
    "以远距离筹划而定胜负概括谋略成效。",
    "校对补入：原文明称“古话”，只收古典成句本体，不收现代战争语境。",
  ),
  row(
    "040.国民党谄洋鬼而祭之.txt",
    11,
    11,
    "非其所祭而祭之",
    "礼记成句",
    "《礼记·曲礼》句",
    "以不当祭而祭说明祭祀对象失当。",
  ),
  row(
    "040.国民党谄洋鬼而祭之.txt",
    11,
    11,
    "非其鬼而祭之，谄也",
    "论语成句",
    "《论语·为政》句",
    "以不当祭而祭归为谄媚。",
  ),
  row(
    "041.中人的歧路.txt",
    5,
    5,
    "夫出中人之上者，虽穷而不失为君子；出中人之下者，虽泰而不失为小人。唯中人不然：穷则为小人，泰则为君子。计天下之士，出中人之上下者，千百而无十一；穷而为小人，泰而为君子者，则天下皆是也！",
    "王安石古文",
    "王安石《上仁宗皇帝言事书》引文",
    "王安石以穷泰之间的品格变化辨析中人。",
  ),
  row(
    "045.中国的游记.txt",
    3,
    3,
    "有体国经野之心，然后可以登山临水。",
    "顾炎武格言",
    "顾炎武语，原文转引",
    "强调游山水也须有经世观照。",
  ),
  row(
    "046.沙门岛与魔鬼岛.txt",
    5,
    5,
    "沙门岛旧属有定额，过额则取一人投之海中。神宗时，马默守登州，建言今后溢额，乞选年深自至配所不作过人，移登州。上深然之。即谓可着为定制。",
    "古籍笔记引文",
    "王定国《甲申杂录》引文",
    "记述沙门岛配所旧制及后来的移配办法。",
  ),
  row(
    "063.打官司的成与败.txt",
    3,
    3,
    "成固欣然，败亦可喜",
    "古典化格言",
    "化用古典语汇，原文转引",
    "以胜败皆可转化为价值说明处事心态。",
  ),
  row(
    "069.“视弃天下，犹弃敝屣也！”.txt",
    3,
    3,
    "视弃天下，犹弃敝屣也！",
    "孟子成句",
    "《孟子·尽心上》成句",
    "以弃天下如弃旧鞋写轻弃富贵权位。",
  ),
  row(
    "078.党外助选下场.txt",
    9,
    9,
    "狡兔死，走狗烹",
    "史传成语",
    "《史记》淮阴侯典故成语",
    "以功成见弃概括助力者的结局。",
  ),
  row(
    "080.五十年前的批语.txt",
    5,
    5,
    "核阅所呈，一则曰畏难，再则曰要钱，远之不如岳武穆，近之不如拿破仑，所请不准。",
    "文牍批语",
    "《逸经》所载旧批牍",
    "旧式批牍以岳武穆与拿破仑典故批驳畏难要钱。",
  ),
  row(
    "080.五十年前的批语.txt",
    5,
    5,
    "文官不爱钱",
    "岳飞名言",
    "岳武穆语，文中转述",
    "以文官不贪钱作为清廉要求。",
  ),
  row(
    "080.五十年前的批语.txt",
    5,
    5,
    "吾之字典中无难字",
    "拿破仑名言",
    "拿破仑语，文中转述",
    "以字典中无难字说明不畏困难。",
  ),
  row(
    "094.“泪阑干”与“倚阑干”.txt",
    3,
    3,
    "岂知重得兮入长安，叹息欲绝兮泪阑干",
    "古典诗句",
    "蔡琰《胡笳十八拍》句",
    "以泪阑干解释泪流纵横之义。",
  ),
  row(
    "094.“泪阑干”与“倚阑干”.txt",
    3,
    3,
    "解释春风无限恨，沉香亭北倚阑干",
    "李白诗句",
    "李白《清平调》句",
    "以倚阑干说明倚栏寄怀之义。",
  ),
  row(
    "099.只要前三名还算客气的呢！.txt",
    3,
    3,
    "天下才一石，曹子建独占八斗，我独得一斗，天下共分一斗。",
    "古典轶语",
    "《释常谈》所记谢灵运语",
    "以才一石分配形容曹植与谢灵运自负文才。",
  ),
  row(
    "101.“知彼知己，量敌为计”.txt",
    3,
    3,
    "知彼知己，量敌为计",
    "兵法格言",
    "《梦溪笔谈·权智》句",
    "以知己知彼并衡量敌势概括用兵判断。",
  ),
  row(
    "101.“知彼知己，量敌为计”.txt",
    5,
    5,
    "观古人者，当求其意，不徒视其迹。",
    "史论格言",
    "《梦溪笔谈·权智》句",
    "提醒读古人行事应求其用意而非徒袭表面。",
  ),
  row(
    "102.抢夷齐与抢荷马.txt",
    3,
    3,
    "后世好奇之士，争欲私之",
    "古文成句",
    "杨恩《首阳山辨》句",
    "形容后世争相附会名胜归属。",
  ),
  row(
    "102.抢夷齐与抢荷马.txt",
    3,
    3,
    "Seven cities warr'd for Homer, being dead，／Who， living， had no roof to shroud his head．",
    "外国诗句",
    "Thomas Heywood 咏荷马句",
    "以七城争荷马反衬其生前无屋可居。",
  ),
  row(
    "102.抢夷齐与抢荷马.txt",
    3,
    3,
    "Seven wealthy towns contend for Homer dead, /Through which the living Homer begg'd his bread.",
    "外国诗句",
    "Thomas Seward 咏荷马句",
    "以富城争死后荷马反衬其生前乞食。",
  ),
  row(
    "104.法律延宕也别有好处.txt",
    3,
    3,
    "Sow the wind and reap the whirlwind．",
    "英语谚语",
    "英语谚语，原文转引",
    "以播风收暴说明恶果会加倍反噬。",
  ),
  row(
    "106.望风.txt",
    3,
    3,
    "北乡自刭，以送公子",
    "史记引文",
    "《史记·魏公子列传》侯赢语",
    "侯赢以北向自刎送信陵君，表现报知己之义。",
  ),
  row(
    "107.一榻内外.txt",
    3,
    3,
    "吾睡不着，一榻之外，皆他人家也。",
    "宋人笔记引文",
    "《邵氏闻见录》记宋太祖语",
    "以一榻之外皆他人家写未能安寝之感。",
  ),
];

const excludedHighlights = [
  "题目、目录条目、书名和篇名引号不收。",
  "国民党、党外、戒严、革命、外交、选举、法院、查禁、调查局等现代公共事件语录不收。",
  "丘吉尔、迪斯累里、袁世凯、殷海光、孙立人等现代公共人物语录不收。",
  "李敖自作、自嘲、即兴改写和私人对话不收，如“与子偕小”“校失求诸小”“我就是神”。",
  "新闻摘录、书目信息、报刊标题、诉讼对白和普通日常笑话不收。",
  "古典诗文若能脱离现代时事语境独立成立，按古文、诗句、俗谚或笔记掌故保留。",
];

const auditExcludes = [
  ["exclude", "modern_political_context", "001.“只有一师吗？”.txt", "3", "只有一师吗？", "现代政治压迫语境中的自述回应。"],
  ["exclude", "modern_public_person_joke", "011.伟人是很容易被脱手的.txt", "5", "丘吉尔计程车笑话", "现代政治人物轶语，暂不收。"],
  ["exclude", "private_humor", "012.“聚敛之臣”的德政.txt", "3", "今天是妇女节，你今天不要洗碗了，留着明天一起洗吧。", "普通笑话，非诗文格言主线。"],
  ["exclude", "self_adaptation", "023.“与子偕小”与“与子偕亡”.txt", "3", "与子偕小 / 与子偕亡", "李敖即兴改写，且依附政治处境。"],
  ["exclude", "modern_political_line", "032.谁追国民党？.txt", "3", "我军一撤千里，匪军追赶不及。", "现代军政口号式讽刺语，排除。"],
  ["exclude", "classic_in_modern_political_article", "037.批蒋通电出土.txt", "5-7", "1929年批蒋通电与秘录评语", "整段为现代政治文献。"],
  ["exclude", "modern_public_person_quote", "051.在天使一边.txt", "3", "The question is this: Is man an ape or an angel? ...", "迪斯累里演说名言，按现代公共人物语录排除。"],
  ["exclude", "modern_political_praise", "056.黄石城的马屁经.txt", "5", "一言以为天下法，一行以为天下则。", "此处用于现代政治人物颂词，暂不收。"],
  ["exclude", "political_slogan", "057.匡复起点搬家了，重建基地动摇了.txt", "3", "匡复中华的起点，重建民国的基地。", "现代政治纪念碑题字，排除。"],
  ["exclude", "modern_legal_political_quote", "067.戒严四十年？.txt", "3", "戒严令不是实行多久的问题，而是该不该实行的问题……", "现代戒严与立法院答复语境，排除。"],
  ["exclude", "classic_fragment_in_public_event", "068.收音机何辜？电视机何辜？.txt", "3", "自天子以至庶人 / 不迁怒", "古典碎片嵌在现代公共人物轶事中，暂不收。"],
  ["exclude", "modern_revolutionary_history_quote", "070.黄炎培记蒋介石暗杀事.txt", "5-7", "辛亥革命与黄炎培感慨", "近现代革命与暗杀史料语境，排除。"],
  ["exclude", "diplomatic_political_quote", "076.国民党的外交.txt", "3", "外交是用最好的方法，做出并说出最脏的事。", "外交定义本身属政治语录，排除。"],
  ["exclude", "classic_in_modern_party_context", "097.民进党绝非佳兆也.txt", "3", "不预义谋，又无功于天下", "古史句被直接用于现代党派评论，暂不收。"],
  ["exclude", "self_praise", "099.只要前三名还算客气的呢！.txt", "3", "五十年来和五百年内，中国人写白话文的前三名是李敖……", "李敖自我题辞，不作外部引用。"],
  ["exclude", "modern_public_person_quote", "109.旅美六人电话.txt", "3", "我不要死，我要睁着眼睛看他们如何收场。", "现代公共人物与时局语境，排除。"],
  ["exclude", "legal_dialogue", "119.小偷的逻辑.txt", "3", "原告方面太不体谅人了……", "诉讼对白和讽刺材料，不作诗文格言收录。"],
];

const sourceFileOrder = new Map(
  fs
    .readdirSync(sourceRoot)
    .filter((file) => file.endsWith(".txt"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
    .map((file, index) => [file, index]),
);

for (const item of data) {
  const lines = sourceLines(item.source_file);
  if (item.line_start < 1 || item.line_end > lines.length || item.line_start > item.line_end) {
    throw new Error(
      `Invalid line range ${item.source_file}:${item.line_start}-${item.line_end}, file has ${lines.length} lines`,
    );
  }
  const sourceText = lines.slice(item.line_start - 1, item.line_end).join("\n");
  if (!sourceText.includes(item.quote_text)) {
    throw new Error(`Quote not found in source range: ${item.source_file}:${item.line_start}-${item.line_end}`);
  }
}

data.sort((a, b) => {
  const fileDelta = (sourceFileOrder.get(a.source_file) ?? 9999) - (sourceFileOrder.get(b.source_file) ?? 9999);
  if (fileDelta) return fileDelta;
  const startDelta = Number(a.line_start) - Number(b.line_start);
  if (startDelta) return startDelta;
  return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
});

data.forEach((item, index) => {
  item.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_zhaji_initial_report.txt");
const auditPath = path.join(analysisDir, "liao_zhaji_initial_audit.tsv");
const proofreadReportPath = path.join(analysisDir, "liao_zhaji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_zhaji_proofread_audit.tsv");
const initialRecordCount = 30;

const csv = [
  columns.join(","),
  ...data.map((item) => columns.map((column) => csvEscape(item[column])).join(",")),
].join("\n");
fs.writeFileSync(csvPath, `\uFEFF${csv}\n`, "utf8");

const txtLines = [
  `《${book}》诗文格言歌谣引用`,
  `生成日期：${generatedDate}`,
  `记录数：${data.length}`,
  "",
];
for (const item of data) {
  txtLines.push(`【${item.id}】${item.category}｜${item.source_or_origin}`);
  txtLines.push(`出处：${item.chapter}｜${item.source_file}:${item.line_start}-${item.line_end}`);
  txtLines.push(`引文：${item.quote_text}`);
  txtLines.push(`说明：${item.summary}`);
  if (item.notes) txtLines.push(`备注：${item.notes}`);
  txtLines.push("");
}
fs.writeFileSync(txtPath, `${txtLines.join("\r\n")}\r\n`, "utf8");

const categoryCounts = new Map();
for (const item of data) {
  categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1);
}
const proofreadAddedRows = data.filter((item) => item.notes.includes("校对补入"));
const proofreadDeletedRows = [];
const proofreadContinueExcludes = [
  [
    "continue-exclude",
    "not_independent_maxim",
    "005.施不全的尊容.txt",
    "7",
    "当官聪强果决，摧抑豪猾，禁戢胥吏。所至有惠政，民号曰“青天”。",
    "史传政绩评价句，偏人物履历描写，不作为独立诗文格言补入。",
  ],
  [
    "continue-exclude",
    "self_theory",
    "025.有仇不报的人，就是有恩不报的人.txt",
    "3",
    "有仇不报的人，就是有恩不报的人",
    "李敖自述理论，且在诉讼私怨语境中，不作外部引用补入。",
  ],
  [
    "continue-exclude",
    "classic_fragment_in_public_event",
    "068.收音机何辜？电视机何辜？.txt",
    "3",
    "自天子以至庶人 / 不迁怒",
    "古典碎片嵌在现代公共人物轶事中，独立性不足，继续排除。",
  ],
  [
    "continue-exclude",
    "self_adaptation",
    "091.工专长寿·台大短命.txt",
    "3",
    "校失求诸小",
    "李敖即兴仿拟自造句，不作外部诗文格言。",
  ],
  [
    "continue-exclude",
    "private_idiom_humor",
    "093.戒烟妙盒.txt",
    "3",
    "一了百了 / 根本解决 / 人心叵测",
    "日常笑话中的普通成语堆叠，不构成明确引用条目。",
  ],
  [
    "continue-exclude",
    "classic_in_modern_party_context",
    "097.民进党绝非佳兆也.txt",
    "3",
    "不预义谋，又无功于天下",
    "古史句直接用于现代党派评论，继续按政治语境排除。",
  ],
  [
    "continue-exclude",
    "self_antithesis",
    "130.从以文会友到以舞入党.txt",
    "5",
    "古人以文会友，今人则以舞入党",
    "李敖自拟今昔对比，且依附现代政党新闻语境，不补入。",
  ],
];

const reportLines = [];
reportLines.push(`《${book}》首轮提取报告（校对后当前版本）`);
reportLines.push(`生成日期：${generatedDate}`);
reportLines.push("");
reportLines.push(`源目录：${sourceRoot}`);
reportLines.push("原始候选：analysis/liao_zhaji_quote_candidates.json");
reportLines.push("复筛候选：analysis/liao_zhaji_review_candidates.tsv");
reportLines.push("归因线索：analysis/liao_zhaji_attributed_lines.tsv");
reportLines.push(`输出 CSV：${csvPath}`);
reportLines.push(`输出 TXT：${txtPath}`);
reportLines.push(`首轮收录条数：${initialRecordCount}`);
reportLines.push(`校对补入条数：${proofreadAddedRows.length}`);
reportLines.push(`校对删除条数：${proofreadDeletedRows.length}`);
reportLines.push(`当前收录条数：${data.length}`);
reportLines.push("");
reportLines.push("候选概况：");
reportLines.push("- sourceFiles=137");
reportLines.push("- quoteCandidates=387");
reportLines.push("- uniqueQuoteTexts=299");
reportLines.push("- keywordLines=66");
reportLines.push("- attributedLines=119");
reportLines.push("- reviewCandidates=164");
reportLines.push("");
reportLines.push("分类统计：");
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], "zh-Hans-CN"),
)) {
  reportLines.push(`- ${category}: ${count}`);
}
reportLines.push("");
reportLines.push("本轮排除：");
for (const item of excludedHighlights) {
  reportLines.push(`- ${item}`);
}
reportLines.push("");
reportLines.push("明细：");
reportLines.push(
  [
    "id",
    "source_file",
    "line_start",
    "line_end",
    "category",
    "source_or_origin",
    "quote_text",
    "summary",
    "notes",
  ].join("\t"),
);
for (const item of data) {
  reportLines.push(
    [
      item.id,
      item.source_file,
      item.line_start,
      item.line_end,
      item.category,
      item.source_or_origin,
      item.quote_text,
      item.summary,
      item.notes,
    ]
      .map(tsvEscape)
      .join("\t"),
  );
}
fs.writeFileSync(reportPath, `\uFEFF${reportLines.join("\r\n")}\r\n`, "utf8");

const auditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ...data.map((item) => [
    item.notes.includes("校对补入") ? "add" : "keep",
    item.id,
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.summary,
  ]),
  ...auditExcludes,
];
fs.writeFileSync(
  auditPath,
  `\uFEFF${auditRows.map((row) => row.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

const proofreadReportLines = [];
proofreadReportLines.push(`《${book}》校对轮报告`);
proofreadReportLines.push(`生成日期：${generatedDate}`);
proofreadReportLines.push("");
proofreadReportLines.push("校对结果：");
proofreadReportLines.push(
  `- 首轮 ${initialRecordCount} 条，校对补入 ${proofreadAddedRows.length} 条，删除 ${proofreadDeletedRows.length} 条，当前 ${data.length} 条。`,
);
proofreadReportLines.push("- 补入：039:3 “不战而屈人之兵”“决胜于千里之外”。");
proofreadReportLines.push("- 删除：无。");
proofreadReportLines.push("");
proofreadReportLines.push("补入明细：");
for (const item of proofreadAddedRows) {
  proofreadReportLines.push(
    `- ${item.id}｜${item.source_file}:${item.line_start}-${item.line_end}｜${item.quote_text}｜${item.category}｜${item.notes}`,
  );
}
proofreadReportLines.push("");
proofreadReportLines.push("继续排除：");
for (const item of proofreadContinueExcludes) {
  proofreadReportLines.push(`- ${item[2]}:${item[3]}｜${item[4]}｜${item[5]}`);
}
proofreadReportLines.push("");
proofreadReportLines.push(
  "校对说明：保留两条古典兵法/史传成句，是按“古话”本体处理；不收周边现代战争、党派、法律、新闻、私人对白和李敖自拟语句。",
);
proofreadReportLines.push(`校对审计：${proofreadAuditPath}`);
fs.writeFileSync(proofreadReportPath, `\uFEFF${proofreadReportLines.join("\r\n")}\r\n`, "utf8");

const proofreadAuditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ...proofreadAddedRows.map((item) => [
    "add",
    item.id,
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.notes,
  ]),
  ...proofreadContinueExcludes,
];
fs.writeFileSync(
  proofreadAuditPath,
  `\uFEFF${proofreadAuditRows.map((row) => row.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      book,
      records: data.length,
      proofreadAdded: proofreadAddedRows.length,
      csvPath,
      txtPath,
      reportPath,
      auditPath,
      proofreadReportPath,
      proofreadAuditPath,
    },
    null,
    2,
  ),
);
