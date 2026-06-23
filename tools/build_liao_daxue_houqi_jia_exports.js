const fs = require("fs");
const path = require("path");

const book = "大学后期日记甲集";
const idPrefix = "LADXHQJ";
const generatedDate = "2026-06-20";
const outDir = "exports";
const analysisDir = "analysis";
const sourceRoot = path.join(
  process.cwd(),
  "\u300a\u5927\u674e\u6556\u5168\u96c66.0\u300b\u5206\u7ae0\u8282",
  "006.\u6c89\u601d\u65e5\u8bb0\u7c7b",
  "003.\u5927\u5b66\u540e\u671f\u65e5\u8bb0\u7532\u96c6",
);

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
    "001.1958年6月.txt",
    195,
    195,
    "昔为座上客，今为阶下囚",
    "传统成句",
    "传统成句，原文转引",
    "以座上客、阶下囚的反差形容关系地位变化。",
  ),
  row(
    "001.1958年6月.txt",
    241,
    241,
    "不与盛气人争是非",
    "古代修养格言",
    "吕坤语，原文明注",
    "以吕坤语提醒不与盛气或反常状态下的人争是非。",
  ),
  row(
    "001.1958年6月.txt",
    275,
    275,
    "辛苦成巢君莫笑",
    "古典诗句",
    "诗句，原文未详",
    "李敖以此诗句联想到雅室与逸兴。",
  ),
  row(
    "001.1958年6月.txt",
    299,
    299,
    "上帝在创造中发现自己",
    "外国诗人格言",
    "泰戈尔语，原文明注",
    "以泰戈尔语说明创造生活的意义。",
  ),
  row(
    "001.1958年6月.txt",
    499,
    499,
    "高山仰止，景行行止",
    "诗经成句",
    "《诗经·小雅·车辖》句",
    "用《诗经》成句表示对孔夫子的尊敬。",
  ),
  row(
    "001.1958年6月.txt",
    501,
    501,
    "于“止”，知其所“止”，可以人而不如鸟乎？",
    "大学文句",
    "《大学》引孔子语，原文转引",
    "借《大学》中知止之语说明人应知道所止。",
  ),
  row(
    "001.1958年6月.txt",
    527,
    527,
    "礼有三本。天地者，生之本也；先祖者，类之本也；君师者，治之本也。",
    "礼记文句",
    "《大戴礼记》语，原文明注",
    "以三本之说阐释天地、先祖、君师在礼中的根本地位。",
  ),
  row(
    "001.1958年6月.txt",
    529,
    529,
    "有功德于民",
    "礼记成句",
    "《礼记》语，原文转引",
    "以有功德于民说明道教文中敬神对象的标准。",
  ),
  row(
    "001.1958年6月.txt",
    533,
    533,
    "清静、无为、自然、顺化",
    "道教成语",
    "道教文献语，原文转述",
    "概括道教所谓神道目的的修养语。",
  ),
  row(
    "001.1958年6月.txt",
    535,
    535,
    "四海一家",
    "古典成语",
    "传统成语，原文转引",
    "表达四海之内一家的观念。",
  ),
  row(
    "001.1958年6月.txt",
    535,
    535,
    "民胞物与",
    "宋儒成语",
    "张载《西铭》语意，原文转引",
    "表达视民为同胞、万物为同类的观念。",
  ),
  row(
    "001.1958年6月.txt",
    539,
    539,
    "创修庙宇，百福骈增，千祥云集。",
    "宗教劝善语",
    "《阴隲文》语，原文明注",
    "以修庙获福的善书句劝募。",
  ),
  row(
    "001.1958年6月.txt",
    539,
    539,
    "修整庙宇，加福增寿，添子益孙",
    "宗教劝善语",
    "《觉世经》语，原文明注",
    "以修整庙宇可增福寿子孙的善书句劝募。",
  ),
  row(
    "002.1958年7月.txt",
    45,
    45,
    "何处合成愁，离人心上秋，纵芭蕉不雨也飕飕！都道晚凉天气好，有月明，怕登楼。年事梦中休，花空烟水流，燕辞归客尚淹留，垂柳不萦裙带住，谩长是，系行舟。",
    "宋词",
    "吴文英《唐多令》",
    "吴君特《唐多令》全文。",
  ),
  row(
    "002.1958年7月.txt",
    73,
    73,
    "难逢干将成侠气，欲隐小阁治新经。",
    "朋友佳句",
    "马戈佳句，原文明注",
    "老马关于侠气与治新经的两句佳句。",
  ),
  row(
    "002.1958年7月.txt",
    207,
    207,
    "过多的阅读是一种心智的压迫，熄灭了天然的灵光，世界上所以有许多愚昧的学者，原因在此。",
    "外国读书格言",
    "William Penn 语，原文明注",
    "批评过量阅读会压迫心智、熄灭天然灵光。",
  ),
  row(
    "004.1958年9月.txt",
    53,
    57,
    ["人间有湖滨，", "湖滨亦人间。"].join("\n"),
    "朋友留言诗",
    "翁留言，原文列为留言",
    "翁看见李敖桌上诗句后所留的两句短诗。",
  ),
  row(
    "005.1958年10月.txt",
    125,
    125,
    "耻与鱼鳖计",
    "古典成句",
    "古典文句，原文未详",
    "用不屑同鱼鳖计较之意说明不辩白、不理会。",
  ),
  row(
    "005.1958年10月.txt",
    143,
    143,
    "一个女人对一个男人可能影响一生，可是一个男人之于一个女人，离开后，她不是为他立刻自杀，就是在一个月后把他忘得一干二净了。",
    "现代性别格言",
    "无名格言，原文称“这是谁说的？”",
    "关于男女感情影响差异的无名格言。",
  ),
  row(
    "005.1958年10月.txt",
    145,
    145,
    "女人就是这样一种动物，你无论给她什么，她都能穿在身上。",
    "朋友俏皮格言",
    "周弘语，原文明注",
    "周弘关于女性穿戴能力的俏皮格言。",
  ),
  row(
    "005.1958年10月.txt",
    225,
    225,
    "如果我们没有一点玩忽的天性，我们的生活便要更加不幸。大部分人所以不会自杀，也就是因为他们对人生能够采取一种玩忽的态度。",
    "外国思想格言",
    "Voltaire 语，原文明注",
    "伏尔泰关于玩忽态度与人生可忍受性的格言。",
  ),
  row(
    "005.1958年10月.txt",
    275,
    275,
    "吾不能为五斗米折腰，拳拳事乡里小儿",
    "陶渊明典故",
    "陶渊明不为五斗米折腰典故语",
    "以陶渊明典故写亮节高风与不屈己意。",
  ),
  row(
    "006.1958年11月.txt",
    25,
    25,
    "学如泥水行舟不进则推",
    "修学俗谚",
    "俗谚，原文未详",
    "用泥水行舟比喻学问不进则退。",
  ),
  row(
    "006.1958年11月.txt",
    29,
    31,
    ["母爱儿娇五十岁尚在怀抱，", "子承父业三寸地岂肯荒芜。"].join("\n"),
    "金圣叹讽联",
    "金圣叹联句，原文明注",
    "金圣叹讽刺乱伦的对联。",
  ),
  row(
    "006.1958年11月.txt",
    35,
    35,
    "好快刀",
    "金圣叹轶语",
    "金圣叹临刑轶语，原文转述",
    "金圣叹临刑轶语，被李敖称为游戏人间之极致。",
  ),
  row(
    "006.1958年11月.txt",
    37,
    41,
    ["密斯小姐多多有，", "补考重修样样无。"].join("\n"),
    "朋友春联",
    "彦增题春联，原文明注",
    "彦增为宿舍所题的诙谐春联。",
  ),
  row(
    "006.1958年11月.txt",
    311,
    311,
    "话不投机半句多",
    "传统俗语",
    "传统俗语，原文转用",
    "以俗语说明不可与言即不与言。",
  ),
  row(
    "006.1958年11月.txt",
    315,
    315,
    "新官上任三把火",
    "传统俗语",
    "传统俗语，原文转引",
    "以俗语说明履任伊始急于作为的常见做法。",
  ),
  row(
    "006.1958年11月.txt",
    527,
    527,
    "如果你在早年就有经济的安全，而你爱生活像你爱工作一样的热烈，那就要花很大的力气去抗拒种种诱惑。及写作一旦成为你最大的毛病和乐趣时……经济的安全却成为一种极大的帮助使你没有顾虑。",
    "外国写作格言",
    "海明威相关语，原文列于“关于海明威”",
    "关于经济安全、诱惑与写作自由的写作格言。",
  ),
  row(
    "006.1958年11月.txt",
    529,
    529,
    "不食午饭，一下午把它赶出来",
    "外国写作轶语",
    "海明威相关语，原文列于“关于海明威”",
    "关于灵感来时一下午赶出作品的写作轶语。",
  ),
  row(
    "006.1958年11月.txt",
    535,
    535,
    "我始终把写作视为一座冰山，每个冰山的八分之七的体积都隐藏在水底下。你可以从你的作品里剔除你所知道的部分，这样只会增加你作品的分量，你省去的部分就好像冰山在水底下的部分，如果作家在他的小说里省略了他所不了解的东西，那么他的小说就会发生漏洞。",
    "外国写作格言",
    "海明威冰山理论，原文列于“关于海明威”",
    "海明威关于冰山理论与省略法的长段写作格言。",
  ),
  row(
    "007.1958年12月.txt",
    13,
    13,
    "故人隔千里，一宵来梦中。",
    "古典诗句",
    "古典诗句，原文未详",
    "以梦见故人后的怅惘引出古典诗句。",
  ),
  row(
    "007.1958年12月.txt",
    45,
    45,
    "总之，从事呼拉圈运动，如果累到气喘如牛、肌肉酸痛的那种程度，那对任何人身体都是有害的。",
    "现代健康格言",
    "胡振华医师语，原文转引",
    "关于过度运动有害身体的现代健康警语。",
  ),
  row(
    "007.1958年12月.txt",
    293,
    293,
    "瑞典的女孩子对于性教育，似乎是若无其事，她们并没有因实行性教育变为淫乱，或者这是因为她们认为性是和接吻一样自然的事，不过，影响也就在这个地方。",
    "现代社会观察语",
    "观察家语，原文转引",
    "关于瑞典性教育与社会态度的观察。",
  ),
  row(
    "007.1958年12月.txt",
    339,
    339,
    "老去人间毁誉轻",
    "陆游诗句",
    "陆游诗句，原文称“放翁诗言”",
    "以陆游诗句对照 Robert Clive 晚年毁誉。",
  ),
];

data.forEach((record, index) => {
  record.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_daxue_houqi_jia_initial_report.txt");
const proofreadReportPath = path.join(analysisDir, "liao_daxue_houqi_jia_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_daxue_houqi_jia_proofread_audit.tsv");

const csv = [
  columns.join(","),
  ...data.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
].join("\r\n");
fs.writeFileSync(csvPath, `\uFEFF${csv}\r\n`, "utf8");

const txtLines = [];
txtLines.push(`《${book}》诗文格言歌谣引用`);
txtLines.push(`生成日期：${generatedDate}`);
txtLines.push(`总计：${data.length} 条`);
txtLines.push("");
txtLines.push("口径说明：收录明确外部诗词、古典成句、俗谚、宗教劝善语、外国思想/写作格言、朋友题诗题联和少量可独立成句的俏皮格言；排除李敖自作诗词、自我修养句、朋友普通对白、现代政治语录和制度/查禁/社论语境材料。");
txtLines.push("");

let currentChapter = "";
for (const record of data) {
  if (record.chapter !== currentChapter) {
    currentChapter = record.chapter;
    txtLines.push(`## ${currentChapter}`);
  }
  txtLines.push(`${record.id}｜${record.category}｜${record.source_or_origin}`);
  txtLines.push(record.quote_text);
  txtLines.push(`出处：${record.source_file}:${record.line_start}-${record.line_end}`);
  txtLines.push(`说明：${record.summary}`);
  if (record.notes) txtLines.push(`备注：${record.notes}`);
  txtLines.push("");
}
fs.writeFileSync(txtPath, `${txtLines.join("\r\n")}\r\n`, "utf8");

const categoryCounts = new Map();
for (const record of data) {
  categoryCounts.set(record.category, (categoryCounts.get(record.category) || 0) + 1);
}

const proofreadAdds = [
  {
    file: "001.1958年6月.txt",
    lineRange: "195",
    quote: "昔为座上客，今为阶下囚",
    reason: "传统成句，独立性强，非政治语录。",
  },
  {
    file: "001.1958年6月.txt",
    lineRange: "529",
    quote: "有功德于民",
    reason: "《礼记》成句，首轮同段已收《大戴礼记》文句和道教成语，校对轮补入此独立经典短语。",
  },
  {
    file: "004.1958年9月.txt",
    lineRange: "53-57",
    quote: "人间有湖滨，\\n湖滨亦人间。",
    reason: "翁见李敖桌上诗句后留言，两句完整，按朋友留言诗补入。",
  },
  {
    file: "005.1958年10月.txt",
    lineRange: "143",
    quote:
      "一个女人对一个男人可能影响一生，可是一个男人之于一个女人，离开后，她不是为他立刻自杀，就是在一个月后把他忘得一干二净了。",
    reason: "原文以“这是谁说的？”标出为无名格言，非李敖自作。",
  },
  {
    file: "005.1958年10月.txt",
    lineRange: "145",
    quote: "女人就是这样一种动物，你无论给她什么，她都能穿在身上。",
    reason: "周弘语，句式完整，可独立作俏皮格言。",
  },
  {
    file: "006.1958年11月.txt",
    lineRange: "35",
    quote: "好快刀",
    reason: "金圣叹临刑轶语，原文明确转述，非政治语录。",
  },
  {
    file: "006.1958年11月.txt",
    lineRange: "37-41",
    quote: "密斯小姐多多有，\\n补考重修样样无。",
    reason: "彦增题春联，两句完整，延续朋友题诗题联的收录口径。",
  },
  {
    file: "006.1958年11月.txt",
    lineRange: "311",
    quote: "话不投机半句多",
    reason: "传统俗语，原文直接转用。",
  },
  {
    file: "006.1958年11月.txt",
    lineRange: "315",
    quote: "新官上任三把火",
    reason: "传统俗语，原文作为成句转引，非具体政治语录。",
  },
  {
    file: "007.1958年12月.txt",
    lineRange: "45",
    quote: "总之，从事呼拉圈运动，如果累到气喘如牛、肌肉酸痛的那种程度，那对任何人身体都是有害的。",
    reason: "胡振华医师语，属于非政治的现代健康警语。",
  },
];

const proofreadExcludes = [
  {
    file: "001.1958年6月.txt",
    lineRange: "257",
    quote: "上帝要毁灭谁",
    reason: "原文只以残片举例说明“几句名言”，未给出完整格言，暂不补入。",
  },
  {
    file: "002.1958年7月.txt",
    lineRange: "205",
    quote: "维护和促进民主，不可缺少政治自由和思想自由。",
    reason: "Stanley Baldwin 民主政治句，首轮已按政治语录排除，校对轮继续排除。",
  },
  {
    file: "001.1958年6月.txt",
    lineRange: "447-489;537;609-631",
    quote: "张天师、孔圣问题、反共宣传和世袭制度相关引文",
    reason: "现代制度、预算、反共、世袭和报刊事件语境，按政治/事件语录排除。",
  },
  {
    file: "006.1958年11月.txt;007.1958年12月.txt",
    lineRange: "181-221;261;347;215",
    quote: "《乌来观瀑诗》《观瀑打油诗》《毛毛诗》等",
    reason: "李敖自作诗文，不作为外部引用收录。",
  },
  {
    file: "007.1958年12月.txt",
    lineRange: "15;337;379",
    quote: "演员自述、Robert Clive 父亲笑语、周弘私人评语等",
    reason: "普通轶事或私人评价，未形成诗文格言口径。",
  },
  {
    file: "007.1958年12月.txt",
    lineRange: "339",
    quote: "逮哈斯丁斯（Warren Hastings）继克莱武而始为印度总督，采激进之征服政策。",
    reason: "殖民征服政策史论，校对轮只保留同段独立的陆游诗句。",
  },
  {
    file: "006.1958年11月.txt",
    lineRange: "45;57;79;385;641",
    quote: "朋友、同学、胡适对李敖的日常评价或对白",
    reason: "私人场景依附过强，非可独立诗文格言。",
  },
  {
    file: "007.1958年12月.txt",
    lineRange: "327",
    quote: "大学为自由研究学术之地，研究之方法亦各自由。",
    reason: "李敖为交卡片自写的学术自由句，且带教育制度争论语境，不补入。",
  },
];

const reportLines = [];
reportLines.push(`《${book}》首轮提取报告`);
reportLines.push(`生成日期：${generatedDate}`);
reportLines.push("");
reportLines.push(`源目录：${sourceRoot}`);
reportLines.push("原始候选：analysis/liao_daxue_houqi_jia_quote_candidates.json");
reportLines.push("复筛候选：analysis/liao_daxue_houqi_jia_review_candidates.tsv");
reportLines.push("归因线索：analysis/liao_daxue_houqi_jia_attributed_lines.tsv");
reportLines.push(`输出 CSV：${csvPath}`);
reportLines.push(`输出 TXT：${txtPath}`);
reportLines.push(`当前收录条数：${data.length}`);
reportLines.push("");
reportLines.push("分类统计：");
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], "zh-Hans-CN"),
)) {
  reportLines.push(`- ${category}: ${count}`);
}
reportLines.push("");
reportLines.push("候选概况：");
reportLines.push("- 全书 7 个按月日记文件，另有前记和目录；自动引号候选 459 个，复筛候选 163 条，归因线索 166 条。");
reportLines.push("- 本册大量引号内容是李敖自我修养句、朋友日常对白、恋爱/校园玩笑和政治/制度批评；首轮优先保留有明确出处或稳定成句形态的外部材料。");
reportLines.push("");
reportLines.push("本轮排除：");
reportLines.push("- 李敖自作诗词，如《乌来观瀑诗》《观瀑打油诗》《好事近》《毛毛诗》等。");
reportLines.push("- 李敖自我警句和日记修养句，如“永远是轻松的”“成固欣然，败亦可喜”“出山要比在山清”等。");
reportLines.push("- 胡适、朋友、同学的普通日常对白和私人评价。");
reportLines.push("- Stanley Baldwin 民主政治句、张天师/孔圣问题中的现代制度论述、反共宣传语和报刊事件性引文。");
reportLines.push("");
reportLines.push("校对提示：");
reportLines.push("- 宗教劝善语只保留较独立的善书成句；“国安、家庆、人寿、年丰”等带国家祝愿色彩的宣传句已先行排除。");
reportLines.push("- “辛苦成巢君莫笑”“故人隔千里，一宵来梦中”等出处未详古典诗句可继续追源。");
reportLines.push("");
reportLines.push("明细：");
for (const record of data) {
  reportLines.push(
    [
      record.id,
      record.source_file,
      `${record.line_start}-${record.line_end}`,
      record.category,
      record.source_or_origin,
      record.quote_text,
      record.notes,
    ]
      .map(tsvEscape)
      .join("\t"),
  );
}
fs.writeFileSync(reportPath, `${reportLines.join("\r\n")}\r\n`, "utf8");

const proofreadReportLines = [];
proofreadReportLines.push(`《${book}》校对轮报告`);
proofreadReportLines.push(`生成日期：${generatedDate}`);
proofreadReportLines.push("");
proofreadReportLines.push("校对结果：");
proofreadReportLines.push("- 首轮 25 条，校对补入 10 条，删除 0 条，修改 0 条，当前 35 条。");
proofreadReportLines.push("- 补入：传统成句、礼记成句、朋友留言诗/春联、周弘俏皮格言、金圣叹轶语、传统俗语和现代健康警语。");
proofreadReportLines.push("- 政治扫描前置排除：Stanley Baldwin 民主政治句、张天师/孔圣问题制度与反共段、殖民征服政策史论等继续不收。");
proofreadReportLines.push("");
proofreadReportLines.push("新增项：");
for (const item of proofreadAdds) {
  proofreadReportLines.push(`- ${item.file}:${item.lineRange}｜${item.quote.replace(/\\n/g, " / ")}｜${item.reason}`);
}
proofreadReportLines.push("");
proofreadReportLines.push("继续排除：");
for (const item of proofreadExcludes) {
  proofreadReportLines.push(`- ${item.file}:${item.lineRange}｜${item.quote}｜${item.reason}`);
}
proofreadReportLines.push("");
proofreadReportLines.push("校对说明：");
proofreadReportLines.push("- 保留首轮的外部诗词、古典文句、宗教劝善语、外国思想/写作格言。");
proofreadReportLines.push("- 补入不依赖政治语境、可独立成句的俗语、轶语和朋友题联；不补李敖自作诗文、自我修养句、日常对白、私人评价、残缺名言。");
proofreadReportLines.push(`- 校对审计：${proofreadAuditPath}`);
proofreadReportLines.push(`- 输出 CSV：${csvPath}`);
proofreadReportLines.push(`- 输出 TXT：${txtPath}`);
fs.writeFileSync(proofreadReportPath, `${proofreadReportLines.join("\r\n")}\r\n`, "utf8");

const proofreadAuditRows = [
  ["action", "file", "line_range", "quote_or_candidate", "reason"],
  ...proofreadAdds.map((item) => ["add", item.file, item.lineRange, item.quote, item.reason]),
  ...proofreadExcludes.map((item) => ["exclude", item.file, item.lineRange, item.quote, item.reason]),
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
      csvPath,
      txtPath,
      reportPath,
      proofreadReportPath,
      proofreadAuditPath,
    },
    null,
    2,
  ),
);
