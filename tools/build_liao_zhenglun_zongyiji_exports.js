const fs = require("fs");
const path = require("path");

const book = "李敖政论综艺集";
const idPrefix = "LAZLZY";
const generatedDate = "2026-06-25";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "012.李敖政论综艺集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_zhenglun_zongyiji_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_zhenglun_zongyiji_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_zhenglun_zongyiji_attributed_lines.tsv");
const auditTsv = path.join("analysis", "liao_zhenglun_zongyiji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_zhenglun_zongyiji_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_zhenglun_zongyiji_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_zhenglun_zongyiji_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => /^\d{3}\..+\.txt$/.test(name))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const text = sourceDecoder.decode(fs.readFileSync(path.join(sourceDir, file)));
  sourceCache.set(file, { text, lines: text.split(/\r?\n/) });
}

function sourceFile(prefix) {
  const found = files.find((file) => file.startsWith(prefix));
  if (!found) throw new Error(`Source file not found for prefix: ${prefix}`);
  return found;
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, summary, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(filePrefix);
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
    summary,
    notes: [
      "首轮保守收入：本书政论、综艺、访谈混杂，现代政见、选举口号、党派攻防、两岸判断、政治人物语录不收；只取句子本体可独立成立的诗文、古文、成语俗谚、歌词、文论和非政治格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q("001.", 59, "当仁不让于师", "儒家名句", "《论语·卫灵公》", "李敖说明孔子并非一味和平时引用。"),
  q("001.", 59, "乡愿德之贼也", "儒家名句", "《论语·阳货》", "李敖解释孔子批评乡愿时引用。"),
  q("001.", 67, "虽千万人吾往矣", "儒家名句", "《孟子》", "李敖谈个人气魄时引用孟子语。"),
  q("001.", 67, "举世而誉之而不加劝，举世而非之而不加沮", "道家名句", "《庄子·逍遥游》", "李敖谈不受外界毁誉左右时引用。"),
  q("002.", 19, "天下舍我其谁", "儒家名句", "《孟子》语意", "李敖谈强烈自信时引用孟子语意。"),
  q("002.", 43, "五色令人目盲，五音令人耳聋", "道家名句", "《老子》", "李敖谈现代声光刺激分散青年读书时引用。"),
  q("002.", 81, "人过了60岁以后，谁比谁先死就不知道了", "现代人物格言", "梁实秋语", "李敖转述梁实秋对老年生命无常的提醒。"),
  q("002.", 165, "江湖寥落尔安归", "近代诗句", "王国维诗句", "李敖谈乡土与归处时引用王国维诗。"),
  q("002.", 165, "此心安处即为乡", "宋词句", "苏轼词意", "李敖谈故乡感时引用苏轼词句。"),
  q("003.", 381, "过犹不及", "成语", "《论语》", "李敖谈自律与节制时引用。"),
  q("005.", 81, "只好在梦里相依偎", "歌词", "刘家昌《往事只能回味》", "李敖回忆狱中听歌时引用原歌词。"),
  q("005.", 81, "只好另外找一位", "谐改歌词", "李敖误听改句", "李敖把误听歌词转化为面对失恋的幽默格言。"),
  q("006.", 49, "我已经消灭他啦，他现在已经不是我的敌人，他变成我的朋友啦", "外国人物格言", "林肯故事", "李敖转述林肯以化敌为友消灭敌人的故事。"),
  q("006.", 161, "作医生的是希望要人活，卖棺材的是希望人死", "儒家譬喻", "孟子语意", "李敖借孟子式行业譬喻说明知识分子的职责。"),
  q("006.", 217, "两脚踏中西文化，一心贯宇宙东西", "现代对联", "林语堂对联", "李敖谈中西文化融合时引用。"),
  q("008.", 97, "忘了我是谁", "李敖歌词", "李敖自作歌词", "李敖列举自己广为流传的歌词。"),
  q("008.", 97, "你要害一个人，就劝他办杂志", "李敖格言", "李敖语录", "李敖列举自己的办刊经验格言。"),
  q("008.", 97, "不是花园在你家里，是你家在花园里", "李敖广告文句", "李敖广告词", "李敖列举自己写过的广告名句。"),
  q("009.", 55, "立德、立功、立言", "古典三不朽语", "《左传》语意/传统说法", "李敖引用传统三不朽说法谈立言与立德。", 55, "校对轮补入。"),
  q("009.", 95, "烈士肝肠名士胆，杀人手段救人心", "清人联语", "彭玉麟联语", "李敖谈霹雳手段与慈悲用心时引用。"),
  q("009.", 95, "金刚怒目", "佛教成语", "佛教语", "李敖说明外在怒目与内在慈悲的关系。"),
  q("009.", 95, "菩萨低眉", "佛教成语", "佛教语", "李敖说明慈悲与激烈手段的对照。"),
  q("009.", 173, "你们捧我，我很难过", "李敖幽默语", "李敖语录", "节目中转引李敖自我吹捧的幽默语。"),
  q("009.", 173, "因为你们还捧得不够", "李敖幽默语", "李敖语录", "李敖把受人称赞转为自我调侃的句子。"),
  q("009.", 175, "五十年来和五百年内，中国人写白话文的前三名是李敖、李敖、李敖", "李敖文论格言", "李敖自评", "李敖说明自己白话文表达技巧时自引。"),
  q("009.", 179, "红了樱桃，绿了芭蕉", "宋词句", "蒋捷《一剪梅·舟过吴江》", "李敖谈中文形容词可作动词时引用。"),
  q("009.", 179, "莫等闲，白了少年头，空悲切", "宋词句", "岳飞《满江红》", "李敖谈中文动词化表达时引用。"),
  q("009.", 179, "春风又绿江南岸", "宋诗句", "王安石《泊船瓜洲》", "李敖谈炼字和中文活用时引用。"),
  q("009.", 293, "请你不要挡住我的阳光", "西方哲人语", "狄奥根尼故事", "李敖讲亚历山大与狄奥根尼故事时引用。"),
  q("009.", 293, "如果我不是亚历山大，我希望我是狄阿基尼斯", "西方人物格言", "亚历山大故事", "李敖讲亚历山大钦佩哲人时引用。"),
  q("009.", 293, "如果有来生的话，如果我不是李敖，我希望我是李敖第二", "李敖幽默语", "李敖仿亚历山大句", "李敖仿造亚历山大句式作自我调侃。"),
  q("014.", 25, "你可以欺骗少数人于暂时、无法欺骗多数人于永久", "外国格言", "林肯语意", "李敖谈电视节目趣味与公众判断时引用。"),
  q("018.", 163, "易子而教之", "儒家成语", "古代教育观念", "李敖谈父母不易亲自教育子女时引用。"),
  q("018.", 195, "清者阅之以为圣，浊者阅之以为淫", "李敖题辞", "李敖小说题辞", "节目文字转述李敖小说扉页的自辩题辞。"),
  q("019.", 69, "儒以文乱法，侠以武犯禁", "史传名句", "《韩非子》", "李敖谈中国游侠精神时引用。"),
  q("019.", 141, "飘洋过海乃怀陆根，我虽不往一往情深", "李敖诗句", "李敖《陆根记》", "主持人转引李敖诗句谈大陆情感。"),
  q("024.", 59, "什么是这个地狱？你跟别人住在一起就是地狱", "西方文学格言", "萨特语意", "李敖谈坐牢群居痛苦时转述萨特。"),
  q("024.", 237, "鸳鸯绣取凭君看，不把金针度与人", "诗句", "元好问诗意", "李敖谈把读书方法公开教给别人时引用。"),
  q("024.", 325, "一个人老的时候，回想当年他年轻的时候，没有一场轰轰烈烈的恋爱，他会觉得老年很冷。", "外国小说格言", "《金石盟》语意", "李敖谈青春恋爱与老年回忆时引用。"),
  q("025.", 529, "智者千虑，必有一失", "成语", "《晏子春秋》《史记》", "李敖谈自己也可能失手时引用。"),
  q("046.", 109, "十年以后当思我，举国欲狂欲语谁", "近代诗句", "梁启超诗句", "李敖谈时代狂热时引用梁启超诗。"),
  q("046.", 109, "汝死哪知世界宽", "宋诗句", "王安石诗句", "李敖谈视野狭窄时引用王安石。"),
  q("046.", 121, "你可以像你所希望的那样快乐那样快乐", "外国格言", "林肯语意", "李敖谈控制负面情绪时引用。"),
  q("049.", 89, "缺席的总是错的", "外国谚语", "外国谚语", "李敖谈缺席者容易被归责时引用。"),
  q("054.", 37, "行万里路，读万卷书", "明人名句", "董其昌语", "李敖讨论读书与旅行经验时引用。"),
  q("054.", 37, "行零里路，读两万卷书", "李敖改句", "李敖仿改董其昌语", "李敖以改句表达重读书胜过亲身经验。"),
  q("054.", 73, "吾少也贱，故多能鄙事", "儒家名句", "《论语·子罕》", "李敖谈自己会做粗活时引用。"),
  q("054.", 121, "一个男人要结婚是因为他疲倦了", "外国文学格言", "拜伦语意", "李敖谈结婚原因时引用拜伦。"),
  q("054.", 157, "我心里面有个老虎在闻一朵玫瑰花", "外国诗句", "威廉·布莱克诗意", "李敖谈男人的雄壮与细腻时引用。"),
  q("054.", 243, "舜何人也，予何人也；有为者亦若是！", "儒家名句", "《孟子》", "李敖谈有为人生观时引用。"),
  q("056.", 159, "人书俱老", "书论成语", "孙过庭《书谱》", "李敖解释自己题字中的书法典故。"),
  q("056.", 317, "所有幸福的家庭都是一样的，不幸的家庭各有各的不幸", "外国小说名句", "托尔斯泰《安娜·卡列尼娜》", "李敖谈家庭关系复杂时引用。"),
  q("056.", 317, "他不重，他是我兄弟", "外国歌词", "He Ain't Heavy, He's My Brother", "李敖谈家庭负担时引用西方歌曲。"),
  q("057.", 29, "人同此心，心同此理", "成语俗语", "中国俗语", "李敖谈双方看法可相通时引用。"),
  q("061.", 39, "客人和鱼一样，三天就发臭了", "外国谚语", "外国谚语", "李敖谈做客不宜太久时引用。"),
  q("062.", 113, "做圣人我做不到，可是圣人做我也不过如此", "心学名句", "王阳明语意", "李敖谈个人作为时引用王阳明式句子。"),
  q("065.", 103, "瘦高白秀幼，潘驴邓小闲", "小说俗语", "《金瓶梅》相关俗语", "李敖谈俗语语序和声音效果时引用。"),
  q("065.", 103, "潘驴邓小闲，瘦高白秀幼", "小说俗语", "《金瓶梅》相关俗语", "李敖比较两种俗语语序的声音效果。"),
  q("089.", 133, "莫须，有", "古文训诂", "岳飞冤案典故", "李敖解释“莫须有”的原意时作断句。"),
  q("101.", 359, "目不暇给，拜观不及", "李敖题句", "李敖观展题句", "李敖参观浙江省博物馆后写下此句描绘心境。", 359, "校对轮补入。"),
  q("102.", 205, "不畏浮云遮望眼，自缘身在最高层", "宋诗句", "王安石《登飞来峰》", "李敖回忆胡适题字时引用王安石诗句。", 205, "校对轮补入。"),
  q("116.", 13, "松柏后凋于岁寒，鸡鸣不已于风雨", "古文训诂例句", "古书例句", "李敖用古文句说明“后”与“不”的古义互通。"),
  q("116.", 15, "五十以学易", "古文训诂", "《论语》", "李敖谈《论语》古句误读时引用。"),
  q("116.", 327, "淫奔之诗也", "经学评语", "朱熹评《诗经》", "李敖谈《诗经》情诗解释时引用朱熹。"),
  q("116.", 395, "狂童之狂也且！", "《诗经》诗句", "《诗经·郑风·褰裳》", "李敖谈《诗经》情诗和训诂时引用。"),
  q("117.", 91, "一匹马！一匹马！我以江山换一匹马！", "西方戏剧名句", "莎士比亚《理查三世》", "李敖谈逃亡处境时引用莎士比亚。"),
  q("124.", 51, "君才自与鬼神斗", "宋诗句", "欧阳修诗句", "李敖谈才气时引用欧阳修诗。"),
  q("124.", 571, "无灾无难到公卿", "宋诗句", "苏东坡语", "李敖谈求稳心态时引用苏东坡。"),
  q("128.", 129, "前无古人，后无来者", "成语", "陈子昂诗意", "李敖形容自己的文字能力时引用。"),
  q("130.", 673, "闻鼓鼙而思将帅", "古典文句", "《礼记·乐记》", "李敖借古句调侃听声而思其人。"),
  q("130.", 903, "醇酒妇人而死", "史传文句", "《史记·魏公子列传》语意", "李敖谈信陵君晚年时引用史传句意。"),
  q("130.", 981, "我不怕死，可是我讨厌死", "外国小说名句", "海明威《战地春梦》", "李敖谈死亡观时引用海明威。"),
  q("122.", 237, "A traveller came by，一个旅行的人经过了", "外国诗句", "威廉·布莱克诗意", "李敖谈爱情不靠千言万语时引用布莱克诗。"),
  q("137.", 27, "开卷有益", "成语", "宋真宗语", "李敖谈读书时引用宋真宗语，说明即使反面教材也有益。", 27, "校对轮补入。"),
  q("141.", 267, "独与天地精神往来", "道家名句", "《庄子》", "李敖谈独处生活时引用庄子。"),
  q("146.", 273, "坐卧仰胆，饮食亦尝胆", "史传文句", "越王勾践故事", "李敖考证“卧薪尝胆”时引用史料。"),
  q("146.", 273, "卧薪尝胆", "成语典故", "勾践故事", "李敖考证成语来源时引用。"),
  q("148.", 461, "加我数年，五十以学易，可以无大过矣", "儒家名句", "《论语》", "李敖谈《论语》旧读法时引用。"),
  q("148.", 461, "五，十以学，易可以无大过矣", "古文断句", "《论语》新断句", "李敖说明《论语》句读可重断时引用。"),
  q("148.", 551, "伤人乎？不问马", "儒家名句", "《论语》旧读法", "李敖谈《论语》旧注误读时引用。"),
  q("148.", 551, "伤人乎？后问马", "古文断句", "《论语》新释", "李敖说明“后”可作“不”解时给出的新释。"),
  q("153.", 183, "祭如在，祭神如神在", "儒家名句", "《论语》", "李敖谈祭礼与唯心意味时引用。"),
  q("153.", 183, "吾不与祭，如不祭", "儒家名句", "《论语》", "李敖谈孔子祭礼观念时引用。"),
  q("155.", 73, "如果你怕热，就不要进厨房", "外国谚语", "美国谚语", "李敖说明此句常被误归给杜鲁门。"),
  q("155.", 73, "老兵永远不死，他只是凋谢", "外国军歌句", "美国军歌/MacArthur转引", "李敖说明此句并非麦克阿瑟原创。"),
  q("155.", 217, "孰谓鄹人之子知礼乎？入太庙，每事问。", "儒家名句", "《论语》", "李敖讲会问问题时引用《论语》。"),
  q("155.", 217, "是礼也！", "儒家名句", "《论语》", "李敖谈《论语》句末语气时引用。"),
  q("155.", 437, "三年之丧，天下之通丧也", "儒家礼制文句", "《孟子》", "李敖谈三年之丧时引用孟子。"),
  q("160.", 49, "知之为知之，不知为不知，是知也", "儒家名句", "《论语》", "李敖谈知道与不知道的态度时引用。"),
  q("160.", 101, "I do not mind lying, but I hate inaccuracy.", "外国格言", "英国巴特勒语", "李敖批评粗糙谎话时引用。"),
  q("162.", 609, "太阳下山明照依旧爬上来；花儿谢了明早还是一样的开；我的青春一去不回头；我的青春小鸟一样不回来", "歌词", "《青春舞曲》相关歌词", "李敖回忆唱歌给女儿听时引用。"),
  q("162.", 1001, "握手也是一种温暖，我要的是温暖", "外国文学故事", "屠格涅夫故事", "李敖讲乞丐故事时引用温暖之语。"),
  q("180.", 99, "世界上有三样东西是不可信的，第一个是谎话，第二个是可恶的谎话，第三个就是统计学", "外国人物格言", "迪斯雷利语意", "李敖谈民调与统计时引用。"),
  q("180.", 99, "全世界的争执90%都是名词之争", "外国格言", "Abbott父亲语", "李敖谈概念争执时引用。"),
  q("180.", 99, "不但是90%是名词之争，剩下的10%也是名词之争", "外国格言", "Abbott转述", "李敖谈概念争执时引用。"),
  q("180.", 127, "狭巷短兵相接处，杀人如草不闻声", "明人诗句", "明朝人诗", "李敖谈短兵相接的危险时引用。"),
  q("183.", 97, "吾爱孟夫子，风流天下闻", "唐诗句", "李白《赠孟浩然》", "李敖谈词义流变时引用。"),
  q("183.", 173, "不爱那么多，只爱一点点。别人的爱情像海深，我的爱情浅。不爱那么多，只爱一点点，别人的爱情像天长，我的爱情短。不爱那么多，只爱一点点。别人眉来又眼去，我只偷看你一眼。", "李敖歌词", "李敖《只爱一点点》", "李敖回忆狱中写歌时引用自作歌词。"),
  q("183.", 173, "侬今葬花人笑痴，他年葬侬知是谁；试看春残花渐落，便是红颜老死时；一朝春尽红颜老，花落人亡两不知！", "古典诗歌", "《红楼梦·葬花吟》", "李敖谈多愁善感时引用《葬花吟》。"),
  q("183.", 249, "空谷里面的山，一朵漂亮的花，没有人看到它，它开始凋谢", "外国诗意", "华兹华斯诗意", "李敖谈无人看见的美与关怀时转述。"),
];

const proofreadAdded = [
  { quote_text: "立德、立功、立言", reason: "候选表复核后补入；李敖本人引用传统三不朽说法。" },
  { quote_text: "目不暇给，拜观不及", reason: "候选表复核后补入；李敖观展题句，可独立成句。" },
  { quote_text: "不畏浮云遮望眼，自缘身在最高层", reason: "归因线索复核后补入；李敖本人回忆胡适题字时引用王安石诗句。" },
  { quote_text: "开卷有益", reason: "归因线索复核后补入；李敖本人引用宋真宗语谈读书。" },
];

const proofreadRemoved = [
  {
    old_id: "LAZLZY-078",
    file_prefix: "151.",
    line_start: 625,
    line_end: 625,
    quote_text: "丐词",
    category: "逻辑术语",
    source_or_origin: "逻辑学",
    reason: "只是逻辑术语，且处在选举攻防和套问口供语境中，校对轮按非诗文格言删除。",
  },
  {
    old_id: "LAZLZY-087",
    file_prefix: "160.",
    line_start: 81,
    line_end: 81,
    quote_text: "踊跃参加",
    category: "词源例句",
    source_or_origin: "古礼词义",
    reason: "只是现代固定词的词源例句，整段又落在现代政治礼仪争论中，校对轮删除。",
  },
  {
    old_id: "LAZLZY-089",
    file_prefix: "161.",
    line_start: 123,
    line_end: 123,
    quote_text: "我从来没有听过这么难听的钢琴，弹得太烂了",
    category: "音乐家轶事",
    source_or_origin: "鲁宾斯坦故事",
    reason: "是轶事中的即时评价句，独立格言性不足，且被转作现代政治方向比喻，校对轮删除。",
  },
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

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"'【】]/g, "")
    .replace(/\s+/g, "");
}

function normalizeForSourceCheck(text) {
  return normalizeText(text).replace(/（wjm_tcy注：[^）]*）/g, "");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeCsv(filePath, rows) {
  fs.writeFileSync(
    filePath,
    `${[columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n")}\n`,
    "utf8",
  );
}

function writeTxt(filePath, rows) {
  const lines = [`《${book}》诗文格言歌谣引用`, `生成日期：${generatedDate}`, `条目数：${rows.length}`, ""];
  for (const row of rows) {
    lines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
    lines.push(row.quote_text);
    lines.push(`出处/来源：${row.source_or_origin}`);
    lines.push(`说明：${row.summary}`);
    lines.push(`备注：${row.notes}`);
    lines.push("");
  }
  fs.writeFileSync(filePath, `${lines.join("\n").trimEnd()}\n`, "utf8");
}

function writeTsv(filePath, rows, headers) {
  const esc = (value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
  fs.writeFileSync(
    filePath,
    `${[headers.join("\t"), ...rows.map((row) => headers.map((header) => esc(row[header])).join("\t"))].join("\n")}\n`,
    "utf8",
  );
}

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const seenTexts = new Map();
const duplicateQuoteTexts = [];
for (const row of rows) {
  if (seenTexts.has(row.quote_text)) duplicateQuoteTexts.push([seenTexts.get(row.quote_text), row.id, row.quote_text]);
  seenTexts.set(row.quote_text, row.id);
}

const modernPoliticalTerms = [
  "总统",
  "国民党",
  "共产党",
  "中共",
  "台独",
  "一国两制",
  "两岸",
  "选举",
  "政党",
  "宪法",
  "政府",
  "国家",
  "国歌",
  "立法院",
  "民进党",
  "国民大会",
  "军购",
  "国防",
  "联合国",
];

const auditRows = rows.map((row) => {
  const source = sourceCache.get(row.source_file);
  const sourceText = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
  const found =
    sourceText.includes(row.quote_text) ||
    normalizeForSourceCheck(sourceText).includes(normalizeForSourceCheck(row.quote_text));
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
    found_in_source: found ? "yes" : "no",
    political_hits: politicalHits.join("|"),
    notes: row.notes,
  };
});

const missingSourceRows = auditRows.filter((row) => row.found_in_source !== "yes");
const politicalFlaggedRows = auditRows.filter((row) => row.political_hits);

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(auditTsv), { recursive: true });
writeCsv(outCsv, rows);
writeTxt(outTxt, rows);
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

const addedRows = proofreadAdded.map((item) => {
  const row = rows.find((candidate) => candidate.quote_text === item.quote_text);
  if (!row) throw new Error(`Proofread added row missing: ${item.quote_text}`);
  return { ...row, kind: "added", decision: "校对补入", proofread_reason: item.reason };
});

const removedRows = proofreadRemoved.map((item) => {
  const file = sourceFile(item.file_prefix);
  return {
    kind: "removed",
    id: item.old_id,
    book,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: item.line_start,
    line_end: item.line_end,
    quote_text: item.quote_text,
    category: item.category,
    source_or_origin: item.source_or_origin,
    summary: "",
    notes: "",
    decision: "校对删除",
    proofread_reason: item.reason,
  };
});

writeTsv(proofreadAuditTsv, [...addedRows, ...removedRows], [
  "kind",
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
  "decision",
  "proofread_reason",
]);

const categoryCounts = new Map();
const byFileCounts = new Map();
for (const row of rows) {
  categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1);
  byFileCounts.set(row.source_file, (byFileCounts.get(row.source_file) || 0) + 1);
}

const reportLines = [
  `${book} 首轮导出报告`,
  `生成日期：${generatedDate}`,
  `源目录：${sourceDir}`,
  `源文件数：${files.length}`,
  `入库条数：${rows.length}`,
  `缺失原文校验：${missingSourceRows.length}`,
  `重复 quote_text：${duplicateQuoteTexts.length}`,
  `政治语录标记：${politicalFlaggedRows.length}`,
  "",
  "校对轮调整：",
  `- 补入：${addedRows.length}`,
  `- 删除：${removedRows.length}`,
  ...addedRows.map((row) => `- 补入 ${row.id}｜${row.source_file}:${row.line_start}-${row.line_end}｜${row.quote_text}`),
  ...removedRows.map((row) => `- 删除 ${row.id}｜${row.source_file}:${row.line_start}-${row.line_end}｜${row.quote_text}｜${row.proofread_reason}`),
  "",
  "首轮取舍：",
  "- 收：李敖本人发言中引用或自引的古典诗文、经史文句、成语俗谚、歌词、文论、外文文学格言和非政治人生格言。",
  "- 不收：现代政见、选举口号、党派攻防、两岸判断、国歌/宪政口号、政治人物语录、主持人自行引用且非李敖引用的串场句。",
  "- 同句多次出现时，优先保留李敖解释最完整的一处；个别源文误字按源文保留，校对轮再统一判断。",
  "",
  "分类统计：",
  ...[...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `- ${category}：${count}`),
  "",
  "按文件分布：",
  ...[...byFileCounts.entries()].map(([file, count]) => `- ${file}: ${count}`),
  "",
  "辅助文件：",
  `- 候选JSON：${candidatesJson}`,
  `- 复筛TSV：${reviewTsv}`,
  `- 归因线索TSV：${attributedTsv}`,
  `- 审计TSV：${auditTsv}`,
  `- 校对报告：${proofreadReportTxt}`,
  `- 校对审计TSV：${proofreadAuditTsv}`,
  "",
  "需要复核的行：",
  missingSourceRows.length
    ? missingSourceRows.map((row) => `- ${row.id} ${row.source_file}:${row.line_start}-${row.line_end}`).join("\n")
    : "- 无",
];

fs.writeFileSync(reportTxt, `${reportLines.join("\n")}\n`, "utf8");

const proofreadReportLines = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  `校对前条目：${rows.length - addedRows.length + removedRows.length}`,
  `校对补入：${addedRows.length}`,
  `校对删除：${removedRows.length}`,
  `校对后条目：${rows.length}`,
  `缺失原文校验：${missingSourceRows.length}`,
  `重复 quote_text：${duplicateQuoteTexts.length}`,
  `政治语录标记：${politicalFlaggedRows.length}`,
  "",
  "校对补入",
  ...addedRows.map(
    (row) => `- ${row.id}｜${row.source_file}:${row.line_start}-${row.line_end}｜${row.quote_text}｜${row.proofread_reason}`,
  ),
  "",
  "校对删除",
  ...removedRows.map(
    (row) => `- ${row.id}｜${row.source_file}:${row.line_start}-${row.line_end}｜${row.quote_text}｜${row.proofread_reason}`,
  ),
  "",
  "校对说明",
  "- 继续排除现代政见、选举口号、党派攻防、两岸判断、国歌/宪政口号、政治人物语录和主持人自行引用的串场句。",
  "- 删除不具独立诗文格言性的术语、词源例句、即时评价句；补入李敖本人引用或自写且可独立成立的古典短句、题句。",
  "",
  `明细：${proofreadAuditTsv}`,
];

fs.writeFileSync(proofreadReportTxt, `${proofreadReportLines.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      sourceDir,
      files: files.length,
      rows: rows.length,
      outCsv,
      outTxt,
      candidatesJson,
      reviewTsv,
      attributedTsv,
      auditTsv,
      reportTxt,
      proofreadAuditTsv,
      proofreadReportTxt,
      proofreadAdded: addedRows.length,
      proofreadRemoved: removedRows.length,
      missingSourceRows: missingSourceRows.length,
      duplicateQuoteTexts: duplicateQuoteTexts.length,
      politicalFlaggedRows: politicalFlaggedRows.length,
    },
    null,
    2,
  ),
);

if (missingSourceRows.length > 0 || duplicateQuoteTexts.length > 0 || politicalFlaggedRows.length > 0) {
  process.exitCode = 1;
}
