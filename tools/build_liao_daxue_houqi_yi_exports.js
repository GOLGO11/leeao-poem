const fs = require("fs");
const path = require("path");

const book = "大学后期日记乙集";
const idPrefix = "LADXHQY";
const generatedDate = "2026-06-20";
const outDir = "exports";
const analysisDir = "analysis";
const sourceRoot = path.join(
  process.cwd(),
  "\u300a\u5927\u674e\u6556\u5168\u96c66.0\u300b\u5206\u7ae0\u8282",
  "006.\u6c89\u601d\u65e5\u8bb0\u7c7b",
  "004.\u5927\u5b66\u540e\u671f\u65e5\u8bb0\u4e59\u96c6",
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
    "《大学后期日记乙集》前记.txt",
    17,
    23,
    ["人生如春蚕，", "作茧自缠裹。", "一朝眉羽成，", "钻破亦在我。"].join("\n"),
    "陆游诗",
    "陆游小诗，原文明注",
    "以陆游诗写作茧自缚与破茧自出的自我处境。",
  ),
  row(
    "001.1959年1月.txt",
    21,
    21,
    "舍弃许多不属于你的东西",
    "朋友修养语",
    "马戈语，原文记为“马言”",
    "老马劝李敖舍弃不属于自己的东西，保留为修养格言。",
  ),
  row(
    "001.1959年1月.txt",
    61,
    61,
    "群体是个大染缸，你在里面会迷失的。长期的暗示会改变你，你最初的欣赏与改造会失去了！",
    "朋友修养格言",
    "马戈语，原文明注",
    "以大染缸比喻群体生活对个人判断与创造力的消磨。",
  ),
  row(
    "001.1959年1月.txt",
    303,
    303,
    "可被毁而不能被败",
    "外国文学名句",
    "《老人与海》名句意译",
    "李敖借《老人与海》所强调的不败精神说明恋爱中的宁折毋屈。",
  ),
  row(
    "001.1959年1月.txt",
    377,
    377,
    "A busy bee has no time for sorrow",
    "英文俗谚",
    "英文俗谚，原文转引",
    "以忙碌之蜂无暇忧愁说明读书与工作的排遣力量。",
  ),
  row(
    "001.1959年1月.txt",
    595,
    595,
    "世间“按摩”者，人亦“按”其“摩”。",
    "朋友谐语",
    "陈又亮书写语，原文转录",
    "陈又亮以拆字式谐语回敬“按摩”说法。",
  ),
  row(
    "001.1959年1月.txt",
    617,
    623,
    ["沈云真正鬼，", "小丢勿气馁，", "劝君别迟疑，", "珍惜好机会。"].join("\n"),
    "朋友打油诗",
    "孙英善打油诗，原文转录",
    "孙英善续作小丢与沈云的玩笑诗。",
  ),
  row(
    "001.1959年1月.txt",
    627,
    633,
    ["何物沈云是，", "李敖乱配对，", "她有男友在，", "焉用本人追！"].join("\n"),
    "朋友打油诗",
    "陈又亮打油诗，原文记为“小丢亦做”",
    "陈又亮以打油诗回应李敖和孙英善的玩笑。",
  ),
  row(
    "001.1959年1月.txt",
    669,
    675,
    ["何物李敖，", "白脸加长袍，", "虽然司麦脱，", "情棍没人要"].join("\n"),
    "朋友打油诗",
    "陈又亮打油诗，原文明注“此诗陈又亮作”",
    "陈又亮以李敖长袍形象和情场玩笑入诗。",
  ),
  row(
    "001.1959年1月.txt",
    685,
    691,
    ["灰衣女郎真好看，", "手短不配太遗憾，", "两唇过黑广东嘴，", "口红消耗两吨半"].join("\n"),
    "朋友打油诗",
    "孙英善打油诗，原文称据李敖批评而作",
    "孙英善据李敖批评所作的灰衣女郎打油诗。",
  ),
  row(
    "001.1959年1月.txt",
    701,
    707,
    ["李敖李敖，", "求你别再打报告，", "你那里一讲话，", "我这里心一跳"].join("\n"),
    "朋友打油诗",
    "陈又亮打油诗，原文明注“此诗为小丢作”",
    "陈又亮以打报告玩笑写给李敖的短诗。",
  ),
  row(
    "001.1959年1月.txt",
    777,
    777,
    "万事莫如读书乐",
    "读书格言",
    "传统读书口号，原文称“这句口号”",
    "李敖以这句读书口号总结从知识中求快乐的决心。",
  ),
  row(
    "002.1959年2月.txt",
    57,
    57,
    "要坚持在我们正在做的工作上，不管这个工作是多么的没有意义，要再接再厉，进而完成它",
    "外国修养格言",
    "A. J. Cronin《Hater's Castle》相关文字，原文转引",
    "关于坚持完成手头工作的外国修养语。",
  ),
  row(
    "002.1959年2月.txt",
    125,
    125,
    "你们阔老子阔不了，你们穷老子一定穷。",
    "文人俚语",
    "所谓文人之言，原文转引",
    "以俚语写出对子女能否承继财富的讽刺判断。",
  ),
  row(
    "002.1959年2月.txt",
    151,
    151,
    "己所不欲，勿施于人",
    "论语成句",
    "《论语》成句，原文转引",
    "李敖以儒家成句反省脾气与待人方式。",
  ),
  row(
    "002.1959年2月.txt",
    189,
    189,
    "朋友面前莫言假，老婆面前不说真。",
    "朋友人生格言",
    "李教官人生观，原文明注",
    "李教官关于朋友与夫妻间真假话的俏皮人生观。",
  ),
  row(
    "002.1959年2月.txt",
    271,
    271,
    "面包不是值得否问题，乃是得不到问题。",
    "外国艺术家语",
    "凡高语，原文明注",
    "凡高关于面包不是值不值得、而是得不得到的问题的现实判断。",
  ),
  row(
    "002.1959年2月.txt",
    313,
    313,
    "有女朋友真麻烦，下棋还得故意输。",
    "朋友俏皮格言",
    "周渝语，原文明注",
    "周渝以恋爱与下棋的关系作俏皮抱怨。",
  ),
  row(
    "002.1959年2月.txt",
    351,
    357,
    ["来来去去，", "李敖倒霉，", "长袍拖地，", "载运女贼。"].join("\n"),
    "朋友赠诗",
    "周渝赠诗，原文明注",
    "周渝赠李敖的四句打油诗。",
  ),
  row(
    "003.1959年3月.txt",
    11,
    11,
    "好话说三遍",
    "传统俗语",
    "传统俗语，原文转引",
    "以俗语概括反复说好话的态度。",
  ),
  row(
    "003.1959年3月.txt",
    55,
    55,
    "亲友如抔沙，放手还复散",
    "苏轼诗句",
    "苏轼诗句，原文称“东坡诗”",
    "李敖从苏轼诗句引出朋友沙子论。",
  ),
  row(
    "003.1959年3月.txt",
    91,
    91,
    "青出于蓝而冰寒于水云乎哉！",
    "荀子成句",
    "《荀子·劝学》成句化用",
    "化用青出于蓝、冰寒于水的古典成句。",
  ),
  row(
    "003.1959年3月.txt",
    173,
    173,
    "我不爱你是应该，你爱我是本分。",
    "女士妙语",
    "某女士妙语，原文明注",
    "无名女士关于爱情位置的俏皮妙语。",
  ),
  row(
    "003.1959年3月.txt",
    185,
    185,
    "无风不起浪",
    "传统俗语",
    "传统俗语，原文转引",
    "以俗语说明传闻未必全然无因。",
  ),
  row(
    "003.1959年3月.txt",
    185,
    185,
    "宁可信其有，不可信其无",
    "传统俗语",
    "传统俗语，原文转引",
    "以俗语表达宁信其有的谨慎判断。",
  ),
  row(
    "003.1959年3月.txt",
    243,
    243,
    "饮且食兮寿而康，无不足兮奚所望？",
    "韩愈文句",
    "韩愈《送李愿归盘谷序》句，原文明注",
    "李敖借韩愈文句调侃寿尔康饭店与朵颐之乐。",
  ),
  row(
    "003.1959年3月.txt",
    267,
    267,
    "我在寻找一个‘人’！",
    "外国哲人轶语",
    "第欧根尼轶语，原文转述",
    "第欧根尼白日提灯寻找人的犬儒主义轶语。",
  ),
  row(
    "003.1959年3月.txt",
    313,
    313,
    "文穷而后工。",
    "古典文论格言",
    "古典文论语，原文称“子曰”",
    "以文章处穷而后工的说法引出打油诗自况。",
  ),
  row(
    "003.1959年3月.txt",
    313,
    313,
    "举世誉之而不加劝，举世非之而不加沮",
    "庄子成句",
    "《庄子》语，原文称“庄生勉人”",
    "以庄子成句说明不因世人毁誉而动摇。",
  ),
  row(
    "003.1959年3月.txt",
    365,
    367,
    ["惜竹不除当路笋；", "伐薪教护带巢枝。"].join("\n"),
    "蔡元培联语",
    "蔡元培写给李石曾的对联",
    "李敖参观书展时转录蔡元培题李石曾联。",
  ),
  row(
    "003.1959年3月.txt",
    371,
    373,
    ["谟议轩昂开日月，", "文章浩渺足波澜。"].join("\n"),
    "蔡元培联语",
    "蔡元培写给李玄伯的联语",
    "李敖转录蔡元培题李玄伯联。",
  ),
  row(
    "003.1959年3月.txt",
    383,
    383,
    "还是第一声像",
    "笑话妙语",
    "无名笑话关键答语，原文称“笑话一则”",
    "酒席放屁笑话中邻座的收束妙语。",
  ),
  row(
    "004.1959年4月.txt",
    55,
    55,
    "当世贵不羁，遭难能解纷。",
    "古典诗句",
    "古典诗句，原文未详",
    "李敖以此句形容自己替同学解纷的风骨。",
  ),
  row(
    "004.1959年4月.txt",
    155,
    155,
    "昔孟轲亚圣，母之教也，今有子如轲，虽死何憾？尚飨！",
    "古代祭文",
    "李荷祭欧阳修母文，原文转引",
    "宋人祭文借孟母典故称颂欧阳修母教子之功。",
  ),
  row(
    "004.1959年4月.txt",
    229,
    229,
    "爱情和婚姻是不能两全的",
    "现代爱情格言",
    "纽约大学海格博士语，原文转引",
    "海格概括爱情与婚姻难以两全。",
  ),
  row(
    "004.1959年4月.txt",
    229,
    229,
    "爱情所求者是抛弃一切。而婚姻则要求绝对的清醒。",
    "现代爱情格言",
    "纽约大学海格博士语，原文转引",
    "海格把爱情的抛弃一切与婚姻的清醒要求相对照。",
  ),
  row(
    "004.1959年4月.txt",
    229,
    229,
    "企图把这二者混合在一块的男女，乃是自寻烦恼。",
    "现代婚姻格言",
    "纽约大学海格博士语，原文转引",
    "海格认为强行混合爱情与婚姻会自寻烦恼。",
  ),
  row(
    "004.1959年4月.txt",
    231,
    231,
    "必然地是应该短暂的、无理性的、不可预测的和疯狂的",
    "现代爱情格言",
    "纽约大学海格博士语，原文转引",
    "海格论爱情必然短暂、非理性且不可预测。",
  ),
  row(
    "004.1959年4月.txt",
    231,
    231,
    "爱情为一种情欲。情欲一词的原义本为‘痛苦’，这是一种界于欲念和满足之间的紧张状态。",
    "现代爱情格言",
    "纽约大学海格博士语，原文转引",
    "海格从情欲与痛苦的词义说明爱情的紧张状态。",
  ),
  row(
    "004.1959年4月.txt",
    233,
    233,
    "但婚姻则是一件严肃的事。它是理性的，很合法，而且是公开的，它所根据的为短暂的爱情。社会设计出婚姻，强迫人们于热情冷却之后仍生活在一起。",
    "现代婚姻格言",
    "纽约大学海格博士语，原文转引",
    "海格把婚姻视为社会设计的理性制度，与短暂爱情相对。",
  ),
  row(
    "004.1959年4月.txt",
    305,
    315,
    ["寂寞流苏冷绣茵，", "倚屏山枕惹香尘，", "小庭花露泣浓春。", "刘阮信非仙洞客，", "嫦娥终是月中人，", "此生无路访东邻。"].join("\n"),
    "唐词",
    "阎选《浣溪沙》",
    "李敖给朋友看阎选《浣溪沙》全文。",
  ),
  row(
    "004.1959年4月.txt",
    325,
    325,
    "少公，归易耳！恐再辱奈何？……",
    "汉书史语",
    "《汉书·李广苏建传》李陵语，原文转引",
    "李陵以归汉容易、恐再受辱说明其不再辱态度。",
  ),
  row(
    "004.1959年4月.txt",
    325,
    325,
    "丈夫不能再辱！",
    "汉书史语",
    "《汉书·李广苏建传》李陵语，原文转引",
    "李敖据此概括李陵的不再辱主义。",
  ),
  row(
    "005.1959年5月.txt",
    205,
    205,
    "由你奸似鬼，喝了老娘洗脚水。",
    "水浒传俗语",
    "《水浒传》孙二娘语，原文明注",
    "李敖注出孙二娘对武松的俏皮粗语。",
  ),
  row(
    "005.1959年5月.txt",
    251,
    251,
    "一个女人之爱一个男人，只是因为她不愿别人得到他。",
    "外国剧作家格言",
    "田纳西·威廉斯语，原文明注",
    "田纳西关于女性爱情占有心理的格言。",
  ),
  row(
    "005.1959年5月.txt",
    271,
    271,
    "最冷酷和最热情的是最相近",
    "现代性情格言",
    "逻辑八股式格言，原文转引",
    "李敖以这句格言解释老马在冷酷论与热情黏性之间的反差。",
  ),
  row(
    "006.1959年6月.txt",
    43,
    57,
    ["老破有债权，", "洒家逃不脱。", "一顿酱爆肉，", "包他叫哥哥。", "且语你这厮，", "休想要两个。", "我有洗脚水，", "看你喝不喝。"].join("\n"),
    "朋友和诗",
    "庄因和诗，原文转录",
    "庄因回应李敖玩笑诗的打油和诗。",
  ),
  row(
    "006.1959年6月.txt",
    61,
    61,
    "不能为竖子所欺",
    "古典成句",
    "古人态度语，原文转引",
    "李敖以古人不为竖子所欺的态度自励。",
  ),
  row(
    "006.1959年6月.txt",
    113,
    123,
    ["夜里相思更漏残，", "伤心明月凭栏干，", "想君思我锦衣寒。", "咫尺画堂深似海，", "忆来惟把旧书看？", "几时携手入长安。"].join("\n"),
    "唐词",
    "韦庄《浣溪沙》",
    "李敖转录韦庄《浣溪沙》全文。",
  ),
  row(
    "006.1959年6月.txt",
    127,
    137,
    ["独立寒阶望月华，", "露浓香泛小庭花，", "绣屏愁背一灯斜。", "云雨自从分散后，", "人间无路到仙家，", "但凭魂梦访天涯。"].join("\n"),
    "唐词",
    "张泌《浣溪沙》",
    "李敖转录张泌《浣溪沙》全文。",
  ),
  row(
    "006.1959年6月.txt",
    237,
    239,
    ["人患志之不立，", "非患名之不彰。"].join("\n"),
    "纪念词格言",
    "Rosa 写给他人的纪念词，原文转录",
    "关于人应忧志不立而非名不彰的纪念词格言。",
  ),
  row(
    "006.1959年6月.txt",
    361,
    361,
    "又开风气又为师",
    "现代文人旧句",
    "周前旧句，原文明注",
    "以既开风气又为师概括开创与示范兼具的角色。",
  ),
  row(
    "006.1959年6月.txt",
    405,
    405,
    "青山常在，绿水常流，他年相见，后会有期。",
    "临别套语",
    "查良钊致词，原文明注",
    "毕业谢师宴上的临别祝词。",
  ),
  row(
    "007.1959年7月.txt",
    205,
    205,
    "君若在何不寄余生",
    "朋友绝联",
    "马戈绝联，原文明注",
    "老马所作无法续接的双关绝联。",
  ),
  row(
    "007.1959年7月.txt",
    207,
    207,
    "感激驰驱所以报知遇之隆",
    "古典忠义文句",
    "诸葛亮精神相关语，原文转引",
    "以孔明式感激驰驱说明报知遇的精神。",
  ),
  row(
    "007.1959年7月.txt",
    249,
    251,
    ["我年轻时不敢做一急进派，", "怕我将来成一保守派。"].join("\n"),
    "外国诗句",
    "Robert Frost 诗，原文明注",
    "弗罗斯特关于年轻时不敢急进、怕年老保守的诗句。",
  ),
  row(
    "007.1959年7月.txt",
    297,
    297,
    "文人方能治史",
    "现代治史格言",
    "姚从吾语，原文记“又言”",
    "姚从吾认为文人气质方能治史。",
  ),
  row(
    "007.1959年7月.txt",
    349,
    355,
    ["于今此景正当时，", "看看欲吐百花魁，", "若能遇得春色到，", "一洒清吉脱尘埃。"].join("\n"),
    "签诗",
    "抽签所得签诗，原文转录",
    "李敖抽签所录的四句签诗。",
  ),
  row(
    "007.1959年7月.txt",
    491,
    501,
    ["你——", "诗人的", "诗哟！", "我——", "请你", "拿回去吧！"].join("\n"),
    "现代讽刺诗",
    "杂志编辑所作妙诗，原文转录",
    "无名杂志编辑讽刺新诗人的短诗。",
  ),
];

data.forEach((record, index) => {
  record.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_daxue_houqi_yi_initial_report.txt");
const proofreadReportPath = path.join(analysisDir, "liao_daxue_houqi_yi_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_daxue_houqi_yi_proofread_audit.tsv");

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
txtLines.push("口径说明：收录明确外部诗词、联语、俗谚、古典成句、外国文学/思想格言、朋友题诗题联、笑话妙语和可独立成句的俏皮格言；排除李敖自作诗词、自我修养句、普通私人对白、现代政治/法律语录、公函诉讼语境材料。");
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

const excludedHighlights = [
  {
    file: "《大学后期日记乙集》前记.txt",
    lineRange: "15;25",
    quote: "反抗腐败教育对我压迫的精神；“不肖”万岁",
    reason: "前记中的校政/党报批评语境，只保留其中明示陆游小诗。",
  },
  {
    file: "001.1959年1月.txt",
    lineRange: "395-477;615-641",
    quote: "李敖自作与私人玩笑诗若干",
    reason: "李敖自作打油诗、原诗及过度依附私人场景的玩笑诗不收；仅保留孙英善、陈又亮可辨为他人所作的和诗。",
  },
  {
    file: "002.1959年2月.txt",
    lineRange: "191;313;323;333",
    quote: "保持距离，以策安全；私人称赞和日常对白",
    reason: "李敖自我修养句、普通对白和私人评价不收；周渝俏皮语与赠诗因独立成句保留。",
  },
  {
    file: "004.1959年4月.txt",
    lineRange: "75-87;111-123;183-217",
    quote: "姚从吾介绍信、蒋廷黻谈胡适、惜别卡片和辞行广告",
    reason: "私人信札、公关辞谢和现代人物评论独立格言性不足，暂不补入。",
  },
  {
    file: "004.1959年4月.txt",
    lineRange: "325",
    quote: "汉使招李陵的外交劝归对白",
    reason: "只保留李陵“不再辱主义”相关核心史语，其余劝归外交对白不收。",
  },
  {
    file: "005.1959年5月.txt",
    lineRange: "229;377;385",
    quote: "此曲只应天上有；勇于生、勇于死；阿登纳/杜勒斯葬礼语",
    reason: "自题/合题文字与现代政治人物葬礼语不收。",
  },
  {
    file: "006.1959年6月.txt",
    lineRange: "15;73;139-181;487-503",
    quote: "《政治论丛》发刊辞、李敖自作词诗、甘地圆桌会议电文",
    reason: "政治刊物、李敖自作诗文及现代政治人物事件语境不收。",
  },
  {
    file: "007.1959年7月.txt",
    lineRange: "7;13-15;67-69;227-231;313",
    quote: "李敖致华俊信、美国最高法院新闻、李敖自题赠书、李敖送马联",
    reason: "自作信札/题赠/联语与现代法律政治新闻不收。",
  },
  {
    file: "009.给钱思亮校长的一封公开信.txt",
    lineRange: "1-40",
    quote: "给钱思亮校长的一封公开信",
    reason: "整篇为校政、公函、诉讼与人物攻击语境，无首轮保留的独立诗文格言。",
  },
];

const proofreadAdds = [
  {
    file: "001.1959年1月.txt",
    lineRange: "669-675",
    quote: "何物李敖，\\n白脸加长袍，\\n虽然司麦脱，\\n情棍没人要",
    reason: "原文明注“此诗陈又亮作”，属朋友打油诗，非李敖自作。",
  },
  {
    file: "001.1959年1月.txt",
    lineRange: "685-691",
    quote: "灰衣女郎真好看，\\n手短不配太遗憾，\\n两唇过黑广东嘴，\\n口红消耗两吨半",
    reason: "原文称孙英善据李敖批评而作，属朋友打油诗。",
  },
  {
    file: "001.1959年1月.txt",
    lineRange: "701-707",
    quote: "李敖李敖，\\n求你别再打报告，\\n你那里一讲话，\\n我这里心一跳",
    reason: "原文明注“小丢作”，属朋友打油诗。",
  },
  {
    file: "002.1959年2月.txt",
    lineRange: "271",
    quote: "面包不是值得否问题，乃是得不到问题。",
    reason: "凡高语，明确外部非政治语录。",
  },
  {
    file: "003.1959年3月.txt",
    lineRange: "11",
    quote: "好话说三遍",
    reason: "传统俗语，非政治语录。",
  },
  {
    file: "003.1959年3月.txt",
    lineRange: "91",
    quote: "青出于蓝而冰寒于水云乎哉！",
    reason: "荀子成句化用，非李敖自作。",
  },
  {
    file: "004.1959年4月.txt",
    lineRange: "229",
    quote: "爱情和婚姻是不能两全的",
    reason: "海格爱情婚姻论前半段，首轮只收了后半段。",
  },
  {
    file: "004.1959年4月.txt",
    lineRange: "229",
    quote: "爱情所求者是抛弃一切。而婚姻则要求绝对的清醒。",
    reason: "海格爱情婚姻论前半段，首轮只收了后半段。",
  },
  {
    file: "004.1959年4月.txt",
    lineRange: "229",
    quote: "企图把这二者混合在一块的男女，乃是自寻烦恼。",
    reason: "海格爱情婚姻论前半段，首轮只收了后半段。",
  },
  {
    file: "007.1959年7月.txt",
    lineRange: "297",
    quote: "文人方能治史",
    reason: "姚从吾治史格言，明确他人语。",
  },
];

const proofreadExcludes = [
  {
    file: "002.1959年2月.txt",
    lineRange: "263",
    quote: "不要花一分钟的时间去想我们所不喜欢的人。",
    reason: "艾克语，按现代政治人物语录口径不补入。",
  },
  {
    file: "002.1959年2月.txt",
    lineRange: "321",
    quote: "深深的海水",
    reason: "只是文学化比喻短语，独立诗文格言性不足。",
  },
  {
    file: "003.1959年3月.txt",
    lineRange: "329",
    quote: "快乐神",
    reason: "凯瑟琳称伏尔泰的称号，非完整格言或诗文。",
  },
  {
    file: "004.1959年4月.txt",
    lineRange: "213-217",
    quote: "赵元任辞行广告",
    reason: "公关辞谢散文，虽可爱但不属诗文格言。",
  },
  {
    file: "005.1959年5月.txt",
    lineRange: "145-175;223-229",
    quote: "债主陈彦增寿诗；三书题字",
    reason: "李敖自作寿诗或含李敖的合题文字，继续不收。",
  },
  {
    file: "006.1959年6月.txt",
    lineRange: "81-89;421-431",
    quote: "代景戏作一诗“赠李敖”；1959年6月20日口占绝句",
    reason: "李敖代作或自作诗，继续不收。",
  },
  {
    file: "007.1959年7月.txt",
    lineRange: "325-333",
    quote: "给鼓应诗",
    reason: "李敖自作打油诗，继续不收。",
  },
];

const reportLines = [];
reportLines.push(`《${book}》首轮提取报告`);
reportLines.push(`生成日期：${generatedDate}`);
reportLines.push("");
reportLines.push(`源目录：${sourceRoot}`);
reportLines.push("原始候选：analysis/liao_daxue_houqi_yi_quote_candidates.json");
reportLines.push("复筛候选：analysis/liao_daxue_houqi_yi_review_candidates.tsv");
reportLines.push("归因线索：analysis/liao_daxue_houqi_yi_attributed_lines.tsv");
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
reportLines.push("- 本册含 1959 年 1-8 月日记、前记、目录及一封给钱思亮校长的公开信；自动引号候选 482 条，复筛候选 122 条，归因线索 154 条。");
reportLines.push("- 首轮保留明确外部诗词、联语、古典成句、朋友赠诗和少量可独立成句的笑话/俏皮格言；不保留李敖自作诗文、私人对白、现代政治法律新闻、公函诉讼语境材料。");
reportLines.push("");
reportLines.push("本轮排除重点：");
for (const item of excludedHighlights) {
  reportLines.push(`- ${item.file}:${item.lineRange}｜${item.quote}｜${item.reason}`);
}
reportLines.push("");
reportLines.push("政治扫描：");
reportLines.push("- 严格政治词命中：0。");
reportLines.push("- 宽泛词命中：7 条：纽约大学海格爱情/婚姻语 6 条命中“纽约/大学”；Robert Frost 诗 1 条命中“急进派/保守派”。复核后均非政治语录。");
reportLines.push("");
reportLines.push("校对提示：");
reportLines.push("- “朋友打油诗/和诗”本轮按他人作品保留；校对轮可再按资料价值决定是否收窄。");
reportLines.push("- “甘地圆桌会议”电文虽有诗性，但属现代政治人物事件语境，首轮先排除。");
reportLines.push("- 《汉书》李陵段仅保留“不再辱”核心史语，其余外交劝归对白未入。");
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
proofreadReportLines.push("- 首轮 49 条，校对补入 10 条，删除 0 条，修改 0 条，当前 59 条。");
proofreadReportLines.push("- 补入：朋友打油诗 3 首、凡高语、传统俗语、荀子成句、海格爱情婚姻论前半段 3 条、姚从吾治史格言。");
proofreadReportLines.push("- 政治/法律/自作前置排除继续有效：公开信、最高法院新闻、甘地圆桌会议电文、艾克/杜勒斯/阿登纳语、李敖自作诗文均未补入。");
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
proofreadReportLines.push("- 朋友诗只补原文明示他人所作的项目；李敖原诗、代作诗、合题文字继续不收。");
proofreadReportLines.push("- 海格爱情婚姻论属于非政治社会/情感格言，按与首轮同口径保留。");
proofreadReportLines.push(`- 校对审计：${proofreadAuditPath}`);
proofreadReportLines.push(`- 输出 CSV：${csvPath}`);
proofreadReportLines.push(`- 输出 TXT：${txtPath}`);
fs.writeFileSync(proofreadReportPath, `${proofreadReportLines.join("\r\n")}\r\n`, "utf8");

const proofreadAuditRows = [
  ["action", "file", "line_range", "quote_or_candidate", "reason"],
  ...proofreadAdds.map((item) => ["add", item.file, item.lineRange, item.quote, item.reason]),
  ...proofreadExcludes.map((item) => [
    "exclude",
    item.file,
    item.lineRange,
    item.quote,
    item.reason,
  ]),
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
