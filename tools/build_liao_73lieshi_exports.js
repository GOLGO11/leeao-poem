const fs = require("fs");
const path = require("path");

const book = "第73烈士";
const idPrefix = "LA73LS";
const generatedDate = "2026-06-19";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "004.小说剧本类",
  "006.第73烈士",
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
  row(
    "002.第一部——1949（黄花岗38年后）.txt",
    205,
    205,
    "周之兴也，鸑鷟鸣于岐山",
    "古书引文",
    "《国语》",
    "由张鸣岐名字引出《国语》古句。",
  ),
  row(
    "002.第一部——1949（黄花岗38年后）.txt",
    259,
    259,
    "秦起长城，竟海为关，荼毒生灵，万里朱殷",
    "古文引句",
    "李华《吊古战场文》",
    "讨论古代边战时引用《吊古战场文》中的秦长城句。",
  ),
  row(
    "002.第一部——1949（黄花岗38年后）.txt",
    259,
    259,
    "汉击匈奴，虽得阴山，枕骸遍野，功不补患",
    "古文引句",
    "李华《吊古战场文》",
    "同段继续引用《吊古战场文》中的汉击匈奴句。",
  ),
  row(
    "002.第一部——1949（黄花岗38年后）.txt",
    289,
    289,
    "君之视臣如手足，则臣视君如腹心；君之视臣如犬马，则臣视君如国人（路人）；君之视臣如土芥，则臣视君如寇仇。",
    "孟子名句",
    "《孟子》",
    "借孟子君臣相待之说说明古典尺度。",
    "古典引文，非现代政治语录。",
  ),
  row(
    "002.第一部——1949（黄花岗38年后）.txt",
    297,
    297,
    "闻诛一夫纣矣，未闻弑君也。",
    "孟子名句",
    "《孟子》",
    "讨论暴君放伐时引用孟子句。",
    "古典引文，非现代政治语录。",
  ),
  row(
    "002.第一部——1949（黄花岗38年后）.txt",
    297,
    297,
    "如欲平治天下，当今之世，舍我其谁哉",
    "孟子名句",
    "《孟子》",
    "继续引用孟子自任天下的名句。",
  ),
  row(
    "002.第一部——1949（黄花岗38年后）.txt",
    441,
    441,
    "桀犬吠尧，各为其主",
    "成语典故",
    "传统成语",
    "人物自况时引用忠于其主的成语。",
  ),
  row(
    "002.第一部——1949（黄花岗38年后）.txt",
    441,
    441,
    "时光容易把人抛",
    "词句",
    "蒋捷《一剪梅·舟过吴江》语意",
    "感叹岁月流逝时引用古典词句。",
  ),
  row(
    "002.第一部——1949（黄花岗38年后）.txt",
    441,
    441,
    "人生七十古来稀",
    "唐诗名句",
    "杜甫《曲江》",
    "以杜甫句感叹年老来日无多。",
  ),

  row(
    "003.第二部——1961（黄花岗50年后）.txt",
    9,
    9,
    "慎终追远",
    "儒家成语",
    "《论语》相关语",
    "说明牌位与祖先崇拜时引用儒家传统语。",
    "校对补入；只取成语本身，不取政治建筑论述。",
  ),
  row(
    "003.第二部——1961（黄花岗50年后）.txt",
    249,
    249,
    "时有落花随我行",
    "诗句",
    "书中称林文/林时塽诗句",
    "以七字诗句引出林文与林觉民、意映之间的故事索隐。",
  ),
  row(
    "003.第二部——1961（黄花岗50年后）.txt",
    461,
    463,
    "知其不可而为之",
    "孔子名句",
    "《论语》相关语意",
    "讨论明知不可仍然行动的古典精神。",
  ),
  row(
    "003.第二部——1961（黄花岗50年后）.txt",
    481,
    481,
    "诗无达诂",
    "诗论成语",
    "中国传统诗学说法",
    "解释诗词没有固定唯一解释时引用。",
  ),
  lineRow(
    "003.第二部——1961（黄花岗50年后）.txt",
    623,
    625,
    "唐诗句",
    "韩愈诗句",
    "以韩愈两句说明人生寄托与木佛崇拜。",
  ),
  lineRow(
    "003.第二部——1961（黄花岗50年后）.txt",
    629,
    631,
    "古诗句",
    "王羲之诗句",
    "以王羲之两句说明个人寄托的自适。",
  ),
  row(
    "003.第二部——1961（黄花岗50年后）.txt",
    645,
    645,
    "为而不有",
    "老子名句",
    "《老子》",
    "概括行动之后不据为己有的古典教训。",
  ),
  row(
    "003.第二部——1961（黄花岗50年后）.txt",
    605,
    605,
    "告朔饩羊",
    "成语典故",
    "《论语》相关典故",
    "解释纪念仪式流于形式时引用古礼典故。",
    "校对补入；只取古典成语，不取纪念政治语境。",
  ),
  row(
    "003.第二部——1961（黄花岗50年后）.txt",
    793,
    793,
    "放下屠刀、立地成佛",
    "佛教俗谚",
    "佛教俗语",
    "谈刽子手信佛时引用成佛俗谚。",
  ),
  lineRow(
    "003.第二部——1961（黄花岗50年后）.txt",
    811,
    813,
    "联语",
    "郑孝胥书联",
    "观赏字画时列出郑孝胥对联。",
    "只收联语文本；后文政治评价不入。",
  ),
  lineRow(
    "003.第二部——1961（黄花岗50年后）.txt",
    837,
    839,
    "诗句联语",
    "林文诗句，莫纪彭书联",
    "展开黄花岗索隐时展示林文诗句形成的联语。",
    "烈士纪念语境，保留其诗句/联语形态。",
  ),
  lineRow(
    "003.第二部——1961（黄花岗50年后）.txt",
    921,
    923,
    "联语",
    "郭有道碑语、李文甫遗墨八字，朱执信集成语",
    "莫纪彭所藏十六言楹联。",
    "虽在黄花岗纪念语境中，文本为古典道德联语。",
  ),

  lineRow(
    "004.第三部——1963（黄花岗52年后）.txt",
    41,
    55,
    "译诗",
    "李敖译 W. B. Yeats《He Wishes for the Cloths of Heaven》",
    "林光烈在军中朗诵叶慈诗的中文译文。",
  ),

  row(
    "005.第四部——1982（黄花岗71年后）.txt",
    79,
    79,
    "暮投石壕村，有吏夜捉人",
    "唐诗名句",
    "杜甫《石壕吏》",
    "谈古代拉夫时引用杜甫诗句。",
  ),
  row(
    "005.第四部——1982（黄花岗71年后）.txt",
    147,
    147,
    "求仁得仁",
    "儒家成语",
    "《论语》相关成语",
    "形容李师科按自身价值承担后果。",
  ),
  row(
    "005.第四部——1982（黄花岗71年后）.txt",
    147,
    147,
    "盗亦有道",
    "成语典故",
    "《庄子·胠箧》相关成语",
    "评价李师科抢劫案中的道德分寸时引用。",
  ),
  row(
    "005.第四部——1982（黄花岗71年后）.txt",
    149,
    149,
    "哀矜勿喜",
    "古典成语",
    "《论语》相关语意",
    "批评告密论调时引用古典刑狱态度。",
  ),
  row(
    "005.第四部——1982（黄花岗71年后）.txt",
    177,
    177,
    "民不畏死，奈何以死惧之？",
    "老子名句",
    "《老子》",
    "讨论不怕死者无法以死刑威吓时引用老子。",
  ),
  row(
    "005.第四部——1982（黄花岗71年后）.txt",
    181,
    181,
    "做完了比他做过的更好的事，即将走向比他知道的更好的地方",
    "文学译意",
    "Charles Dickens《A Tale of Two Cities》Sidney Carton 临刑语",
    "以《双城记》卡尔登临刑语意类比李师科。",
  ),

  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    13,
    13,
    "虽忠不烈，视死如归",
    "古人语",
    "古人语，后文系于《李陵答苏武书》",
    "用古语说明忠与烈未必合一。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    21,
    21,
    "佩虎符、坐皋比",
    "典故成语",
    "传统典故",
    "写将军墓声势时引用古典化成语。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    21,
    21,
    "其犹龙乎？",
    "孔子评老子典故",
    "《史记·老子韩非列传》相关典故",
    "以孔子惊讶老子的典故形容人物气象。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    21,
    21,
    "之死靡它",
    "诗经成语",
    "《诗经》相关成语",
    "形容始终不改其志。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    21,
    21,
    "肝脑涂地",
    "成语",
    "传统成语",
    "形容为志向不惜牺牲。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    21,
    21,
    "强项不屈",
    "成语典故",
    "董宣强项典故",
    "形容刚直不屈。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    119,
    119,
    "老吾老以及人之老，幼吾幼以及人之幼",
    "孟子名句",
    "《孟子》",
    "谈移情与伦理时引用孟子名句。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    159,
    159,
    "闻诛一夫纣矣，未闻弑君也",
    "孟子名句",
    "《孟子》",
    "后文再次引用孟子句解释独夫之说。",
    "古典引文，非现代政治语录。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    165,
    171,
    "但见西风万木摧，\n尚余垂柳欲何为？\n西风莫讶长条弱，\n也向西风舞一回。",
    "旧诗",
    "旧诗句，书中未标明作者",
    "以西风垂柳诗句说明弱者仍可行动。",
    "校对修正：去除源行对白收尾引号。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    179,
    179,
    "不学而能、不虑而知",
    "孟子语",
    "《孟子》“良能、良知”相关语意",
    "以孟子良知良能语意称赞朴素觉悟。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    179,
    179,
    "若合符节",
    "成语",
    "传统成语",
    "形容与孟子义理暗合。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    179,
    179,
    "我虽一字不识，也要堂堂正正做一个人",
    "宋儒语",
    "宋朝儒者倡言",
    "用宋儒倡言称赞不识字者也能堂堂正正做人。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    185,
    185,
    "此云觉者知觉",
    "佛经注语",
    "佛教经典/注疏语",
    "解释佛教“觉者”的含义。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    185,
    185,
    "觉行完满，故名为佛",
    "佛经注语",
    "佛教经典/注疏语",
    "解释自觉觉他实践圆满即名为佛。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    213,
    215,
    "毁家纾难",
    "成语",
    "传统成语",
    "谈七十二烈士时引用牺牲家产以解国难的成语。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    219,
    219,
    "坐怀不乱",
    "成语典故",
    "柳下惠典故",
    "说明春秋展禽私谥惠字时引出柳下惠典故。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    233,
    233,
    "但愿无事常相见",
    "传统俗语",
    "传统交游俗语",
    "谈老朋友相见时引用旧说。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    233,
    233,
    "一回相见一回老",
    "传统俗语",
    "传统交游俗语",
    "继续引用感叹相见见老的俗语。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    233,
    233,
    "相看两不厌",
    "唐诗名句",
    "李白《独坐敬亭山》",
    "借李白句反讽老友相见。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    279,
    279,
    "一大事因缘",
    "佛教语",
    "佛教经典语",
    "约定九年后相见时引用佛家语。",
  ),
  row(
    "006.第五部——2002（黄花岗91年后）.txt",
    323,
    323,
    "孤臣孽子",
    "成语",
    "传统成语",
    "解释该成语由贬义发生词义转化。",
    "校对补入；只取成语本身。",
  ),

  row(
    "007.第六部——2011（黄花岗百年后）.txt",
    123,
    123,
    "只要骗子行骗得法，连君子人也一样把你骗倒",
    "孟子语意",
    "《孟子》“君子可欺以其方”语意",
    "以孟子语意说明君子也会被合乎情理的骗局欺骗。",
  ),
  row(
    "007.第六部——2011（黄花岗百年后）.txt",
    373,
    373,
    "七十三、八十四，阎王不找也要去。",
    "民间俗谚",
    "传统年龄俗谚",
    "以民间俗谚打趣八十四岁关口。",
  ),
  row(
    "007.第六部——2011（黄花岗百年后）.txt",
    375,
    375,
    "天公疼憨人",
    "闽南俗谚",
    "民间俗谚",
    "以俗谚回应八十四岁关口。",
  ),
  row(
    "007.第六部——2011（黄花岗百年后）.txt",
    247,
    247,
    "唯有我一人逃脱，来报信给你。",
    "圣经引文",
    "《旧约·约伯记》",
    "以约伯记报信者之语比喻幸存者。",
  ),
  row(
    "007.第六部——2011（黄花岗百年后）.txt",
    247,
    247,
    "戏已收场，怎么又冒出人来呢？——因为有一个人倖免于难。",
    "文学引文",
    "Herman Melville《Moby-Dick》收场白",
    "以《白鲸记》结尾语比喻幸存者突然出现。",
  ),
  row(
    "007.第六部——2011（黄花岗百年后）.txt",
    385,
    385,
    "场上歌舞，局外指点，知三百年之基业，隳于何人？败于何事？消于何年？歇于何地？",
    "戏曲引文",
    "孔尚任《桃花扇》",
    "介绍《桃花扇》结构与亡国主题时引用。",
  ),
  row(
    "007.第六部——2011（黄花岗百年后）.txt",
    385,
    385,
    "私君、私臣、私恩、私仇，南朝无一不私，焉得不亡？",
    "戏曲引文",
    "孔尚任《桃花扇》",
    "继续引用《桃花扇》对南朝之私的概括。",
  ),
  lineRow(
    "007.第六部——2011（黄花岗百年后）.txt",
    393,
    409,
    "戏曲曲词",
    "孔尚任《桃花扇·哀江南》",
    "二人合背《桃花扇》末出《哀江南》曲词。",
  ),
  row(
    "007.第六部——2011（黄花岗百年后）.txt",
    447,
    447,
    "虽忠不烈，视死如归",
    "古人语",
    "《李陵答苏武书》所引古人语",
    "后文明确把该古语系于《李陵答苏武书》。",
  ),
  row(
    "007.第六部——2011（黄花岗百年后）.txt",
    587,
    587,
    "最是仓皇辞庙日，教坊犹奏别离歌，挥泪对宫娥",
    "词句",
    "南唐后主李煜《破阵子》",
    "解释辞庙典故时引用李煜词句。",
    "校对补入；只取古典词句，不取现代政治上下文。",
  ),
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

const rows = data.map((record, index) => ({
  ...record,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

fs.mkdirSync(path.join(process.cwd(), outDir), { recursive: true });
fs.mkdirSync(path.join(process.cwd(), analysisDir), { recursive: true });

const csvLines = [
  columns.join(","),
  ...rows.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
];

const csvPath = path.join(process.cwd(), outDir, "第73烈士_诗文格言歌谣引用.csv");
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push("《第73烈士》诗文格言歌谣引用");
txt.push(`生成日期：${generatedDate}`);
txt.push(`总计：${rows.length} 条`);
txt.push("筛选说明：本书政治与革命史语境极密，本轮从严剔除现代政治口号、政党/政府文件、革命绝笔、领导人与军政人物政治语录；保留古典诗文、佛教/圣经/文学戏曲引文、传统成语俗谚及非政治性联语。");
txt.push("");

let currentChapter = "";
for (const record of rows) {
  if (record.chapter !== currentChapter) {
    currentChapter = record.chapter;
    txt.push(`## ${currentChapter}`);
  }
  txt.push(`${record.id}｜${record.category}｜${record.source_file}:${record.line_start}-${record.line_end}`);
  txt.push(`引用：${record.quote_text}`);
  txt.push(`出处线索：${record.source_or_origin}`);
  txt.push(`摘要：${record.summary}`);
  if (record.notes) txt.push(`备注：${record.notes}`);
  txt.push("");
}

const txtPath = path.join(process.cwd(), outDir, "第73烈士_诗文格言歌谣引用.txt");
fs.writeFileSync(txtPath, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

const report = [];
report.push("《第73烈士》第一轮筛选报告");
report.push(`生成日期：${generatedDate}`);
report.push("候选辅助表：analysis/liao_73lieshi_quote_candidates.json、analysis/liao_73lieshi_review_candidates.tsv、analysis/liao_73lieshi_*_aids.tsv");
report.push(`保留条目：${rows.length}`);
report.push("");
report.push("保留范围：孟子、老子、论语相关古典句，杜甫、韩愈、王羲之、李华等诗文句，佛教与圣经引文，叶慈译诗、狄更斯、《白鲸记》、《桃花扇》曲词，传统成语俗谚及少量非政治性联语。");
report.push("剔除范围：章太炎直接痛斥国民党/南京的政治联、黄兴《蝶恋花·吊黄花岗》、黄兴绝笔/家书中的革命口号、现代政党/政府/军政人物语录、国歌句、政策与党史材料、政治攻击性口号。");
report.push("");
report.push("边界说明：含政治讨论背景的古典引文按诗文格言保留；现代政治表达即使有格言形态仍不收。");

const reportPath = path.join(process.cwd(), analysisDir, "liao_73lieshi_initial_report.txt");
fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

const proofreadAuditRows = [
  [
    "add",
    "003.第二部——1961（黄花岗50年后）.txt",
    9,
    "慎终追远",
    "补收儒家传统语；不收同段政治建筑论述。",
  ],
  [
    "add",
    "003.第二部——1961（黄花岗50年后）.txt",
    605,
    "告朔饩羊",
    "补收有明确解释的古礼成语；不收纪念仪式政治语境。",
  ],
  [
    "add",
    "006.第五部——2002（黄花岗91年后）.txt",
    323,
    "孤臣孽子",
    "补收有词义解释的传统成语；不收人物政治评价。",
  ],
  [
    "fix",
    "006.第五部——2002（黄花岗91年后）.txt",
    "165-171",
    "但见西风万木摧……也向西风舞一回。",
    "清理第一轮误带入的对白收尾引号。",
  ],
  [
    "add",
    "007.第六部——2011（黄花岗百年后）.txt",
    587,
    "最是仓皇辞庙日，教坊犹奏别离歌，挥泪对宫娥",
    "补收李煜词句；不收现代政治上下文。",
  ],
  [
    "keep",
    "multiple",
    "",
    "孟子、老子、《桃花扇》等古典/文学引文",
    "虽常在政治讨论段落出现，但文本本身不是现代政治语录，校对后保留。",
  ],
  [
    "exclude",
    "multiple",
    "",
    "章太炎政治联、黄兴吊黄花岗词、革命绝笔/口号、国歌句、党政军语句",
    "现代政治或革命语录，继续排除。",
  ],
  [
    "second-pass",
    "multiple",
    "",
    "复扫关键词候选与高风险政治词",
    "二校未发现新增可收条目或需删除条目，数据保持59条。",
  ],
];

const auditColumns = ["decision", "source_file", "line", "quote_text", "reason"];
const auditPath = path.join(process.cwd(), analysisDir, "liao_73lieshi_proofread_audit.tsv");
fs.writeFileSync(
  auditPath,
  `${[
    auditColumns.join("\t"),
    ...proofreadAuditRows.map((record) =>
      auditColumns
        .map((_, index) => String(record[index] ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " / "))
        .join("\t"),
    ),
  ].join("\r\n")}\r\n`,
  "utf8",
);

const proofreadReport = [];
proofreadReport.push("《第73烈士》校对轮报告");
proofreadReport.push(`生成日期：${generatedDate}`);
proofreadReport.push(`校对后条目：${rows.length} 条`);
proofreadReport.push("");
proofreadReport.push("本轮补入：慎终追远、告朔饩羊、孤臣孽子、李煜《破阵子》词句。");
proofreadReport.push("本轮修正：旧诗“但见西风万木摧……”去掉第一轮误带入的对白收尾引号。");
proofreadReport.push("继续排除：章太炎政治联、黄兴吊黄花岗词、革命绝笔/口号、国歌句、党政军语句。");
proofreadReport.push("保留边界：孟子、老子、《桃花扇》等古典/文学引文，即便出现在政治讨论段落，因文本本身不是现代政治语录，仍保留。");
proofreadReport.push("二校复核：复扫关键词候选与高风险政治词，未发现新增可收条目或需删除条目，数据保持59条。");

const proofreadReportPath = path.join(process.cwd(), analysisDir, "liao_73lieshi_proofread_report.txt");
fs.writeFileSync(proofreadReportPath, `\uFEFF${proofreadReport.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify({ csvPath, txtPath, reportPath, auditPath, proofreadReportPath, rows: rows.length }, null, 2),
);
