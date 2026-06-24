const fs = require("fs");
const path = require("path");

const book = "李敖笑傲江湖";
const idPrefix = "LAXAJH";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "001.李敖笑傲江湖");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_xiaoao_jianghu_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_xiaoao_jianghu_review_candidates.tsv");
const auditTsv = path.join("analysis", "liao_xiaoao_jianghu_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_xiaoao_jianghu_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_xiaoao_jianghu_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_xiaoao_jianghu_proofread_report.txt");
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

function q(filePrefix, lineStart, quoteText, category, attributedTo, note, lineEnd = lineStart) {
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
    summary: note,
    notes: "首轮保守收入：节目文字稿噪声较密，仅取可独立成立的诗文、格言、成语俗语和古典文句。",
  };
}

const rawRows = [
  q("004.", 13, "始作俑者，其无后乎", "古典名句", "《孟子·梁惠王上》", "孔子反对以俑殉葬的典故成句。"),

  q("006.", 5, "滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢，古今多少事，都付笑谈中。", "词", "杨慎《临江仙》/《三国演义》开篇词", "李敖谈《三国演义》开篇词及其历史兴亡感。"),
  q("006.", 7, "少不看水浒，老不看三国", "俗语", "中国俗语", "关于阅读《水浒传》《三国演义》年龄感受的俗语。"),
  q("007.", 15, "立效以报曹公乃去", "史传文句", "《三国志·关羽传》", "关羽答张辽时表示先报曹操恩情再离去。"),
  q("007.", 17, "彼各为其主，勿追也", "史传文句", "《三国志·关羽传》", "曹操不追关羽的史传名句。"),
  q("007.", 21, "折戟沉沙，铁未消，自将磨洗认前朝。东风不与周郎便，铜雀春深锁二乔", "诗", "杜牧《赤壁》", "李敖借杜牧诗讨论赤壁叙事与史实。"),

  q("008.", 15, "乾，元，亨，利，贞", "经文", "《周易·乾卦》", "乾卦卦辞。"),
  q("008.", 15, "初九，潜龙，勿用", "经文", "《周易·乾卦》", "乾卦爻辞。"),
  q("008.", 15, "九二，见龙在田，利见大人", "经文", "《周易·乾卦》", "乾卦爻辞。"),
  q("008.", 15, "九三，君子终日乾乾，夕惕，若厉，无咎", "经文", "《周易·乾卦》", "乾卦爻辞。"),
  q("008.", 15, "九四，或跃在渊，无咎", "经文", "《周易·乾卦》", "乾卦爻辞。"),
  q("008.", 15, "九五，飞龙在天，利见大人", "经文", "《周易·乾卦》", "乾卦爻辞。"),
  q("008.", 15, "上九，亢龙有悔", "经文", "《周易·乾卦》", "乾卦爻辞。"),
  q("008.", 15, "用九，见群龙无首，吉", "经文", "《周易·乾卦》", "乾卦用九。"),
  q("008.", 21, "终日乾乾，终夕惕惕也", "训诂文句", "俞樾《古书疑义举例》", "俞樾解释《周易》“夕惕”的训诂句。"),
  q("008.", 27, "咸，亨，利，贞，取女吉", "经文", "《周易·咸卦》", "咸卦卦辞。"),
  q("008.", 27, "初六，咸其拇", "经文", "《周易·咸卦》", "咸卦爻辞。"),
  q("008.", 27, "咸其腓，凶，居吉", "经文", "《周易·咸卦》", "咸卦爻辞。"),
  q("008.", 27, "九三，咸其股，执其随，往咎", "经文", "《周易·咸卦》", "咸卦爻辞。"),
  q("008.", 27, "九四，贞吉，悔亡，憧憧往来，朋，从尔思", "经文", "《周易·咸卦》", "咸卦爻辞。"),
  q("008.", 27, "九五，咸其脢，无悔", "经文", "《周易·咸卦》", "咸卦爻辞。"),
  q("008.", 27, "上六，咸其辅，颊，舌", "经文", "《周易·咸卦》", "咸卦爻辞。"),

  q("009.", 9, "六四，乘马班如，求婚媾，往吉，无不利", "经文", "《周易·屯卦》", "屯卦爻辞，李敖用来批评望文生义。"),
  q("009.", 15, "白马翰如，匪寇婚媾", "经文", "《周易·屯卦》", "屯卦爻辞中的抢婚语境。"),
  q("009.", 15, "乘马班如，泣血涟如", "经文", "《周易·屯卦》", "屯卦爻辞中的抢婚语境。"),
  q("009.", 23, "以直报怨，以德报德", "古典名句", "《论语·宪问》", "孔子关于报怨报德的名句。"),
  q("012.", 11, "饿死事小，失节事大", "理学成句", "宋代理学节烈观念", "李敖引用旧礼教中的节烈成句。"),
  q("020.", 15, "即使是荷马有时候也打盹", "西方谚语", "英文谚语", "说明圣贤、诗圣也会犯错的谚语。"),
  q("020.", 15, "智者千虑，必有一失", "成语", "中国成语", "与荷马打盹相通的中文成语。"),

  q("060.", 7, "度尽劫波兄弟在，相逢一笑泯恩仇", "诗句", "龚自珍诗句/鲁迅借用", "李敖讨论鲁迅诗中借用龚自珍诗句。"),
  q("060.", 23, "运交华盖欲何求", "诗句", "鲁迅《自嘲》", "鲁迅《自嘲》首句。"),
  q("060.", 23, "未敢翻身已碰头", "诗句", "鲁迅《自嘲》", "鲁迅《自嘲》诗句。"),
  q("060.", 23, "旧帽遮颜过闹市", "诗句", "鲁迅《自嘲》", "鲁迅《自嘲》诗句。"),
  q("060.", 23, "横眉冷对千夫指，俯首甘为儒子牛", "诗句", "鲁迅《自嘲》", "鲁迅《自嘲》颈联，源文作“儒子牛”。"),
  q("060.", 23, "躲进小楼成一统，管他冬夏与春秋", "诗句", "鲁迅《自嘲》", "鲁迅《自嘲》尾联。"),
  q("062.", 11, "字字看来皆是血", "诗句", "曹雪芹题《红楼梦》", "《红楼梦》题诗中的血泪写作句。"),
  q("062.", 11, "十年辛苦不寻常", "诗句", "曹雪芹题《红楼梦》", "《红楼梦》题诗中的血泪写作句。"),

  q("069.", 15, "堦不尽相思血泪抛红豆，开不完春柳春花满画楼，睡不稳纱窗风雨黄昏后，忘不了新愁与旧愁。", "曲文", "《红楼梦》红豆曲", "李敖引用《红楼梦》红豆曲，首字按源文作“堦”。"),
  q("069.", 15, "女儿悲，青春已大守空闺", "曲文", "《红楼梦》酒令", "贾宝玉酒令中的“女儿悲”。"),
  q("069.", 15, "女儿愁，悔教夫婿觅封侯", "曲文", "《红楼梦》酒令", "贾宝玉酒令中的“女儿愁”。"),
  q("069.", 15, "女儿喜，对镜晨妆颜色美", "曲文", "《红楼梦》酒令", "贾宝玉酒令中的“女儿喜”。"),
  q("069.", 15, "女儿乐，秋千架上春衫薄", "曲文", "《红楼梦》酒令", "贾宝玉酒令中的“女儿乐”。"),
  q("070.", 7, "对酒当歌，人生几何，譬如朝露，去日苦多", "诗句", "曹操《短歌行》", "曹操《短歌行》中的人生感慨。"),
  q("070.", 7, "山不厌高，海不厌深，周公吐哺，天下归心", "诗句", "曹操《短歌行》", "曹操《短歌行》中的周公吐哺典故。"),
  q("070.", 7, "一沐三捉发，一饭三吐哺，起以待士，犹恐失天下之贤人。子之鲁，慎无以国骄人。", "史传文句", "《史记·鲁周公世家》", "周公戒伯禽不要以国骄人的典故。"),
  q("071.", 23, "犯而不校", "古典成语", "《论语·泰伯》", "曾子相关的宽厚成语。"),
  q("071.", 33, "知识就是力量", "西方格言", "培根名言", "李敖引用西方格言说明真知识的重要。"),
  q("073.", 25, "吾爱孟夫子，风流天下闻，红颜弃轩冕，白首卧松云", "诗句", "李白《赠孟浩然》", "李敖借李白诗说明“风流”古今词义变化。"),
  q("077.", 23, "三害未除，何乐之有", "史传文句", "《晋书·周处传》", "周处除三害故事中的父老语。"),
  q("077.", 23, "始知人患己之甚", "史传文句", "《晋书·周处传》", "周处知道乡人以自己为患的史传文句。"),
  q("080.", 11, "人生太短暂，不能显得卑微", "西方格言", "狄斯累利名言", "李敖转引狄斯累利关于尊严的格言。"),

  q("081.", 11, "汉贼不两立，王业不偏安，故计臣以讨贼也", "古文名句", "《后出师表》", "《后出师表》中影响后世的古文句。"),
  q("081.", 11, "臣鞠躬尽瘁，死而后已", "古文名句", "《后出师表》", "诸葛亮《后出师表》名句。"),
  q("081.", 29, "一年老一年，一日衰一日", "诗句", "陆游诗句", "李敖引用陆游诗形容衰弱渐成。"),
  q("081.", 29, "譬如东周亡，岂复须大疾", "诗句", "陆游诗句", "李敖引用陆游诗形容衰弱渐成。"),
  q("081.", 33, "乐不思蜀", "成语典故", "三国典故", "刘禅不思蜀的成语典故。"),
  q("082.", 7, "知之为知之，不知为不知，是知也。", "古典名句", "《论语·为政》", "孔子关于知与不知的名句。"),
  q("082.", 19, "结庐在人境，而无车马喧，问君何能尔，心远地自偏，采菊东篱下，悠然见南山，山气日夕佳，飞鸟相与还，此中有真意，欲辩已忘言", "诗", "陶渊明《饮酒》", "李敖借陶渊明诗谈外国汉学家的误读笑话。"),
  q("082.", 45, "父精母血，不可弃也", "小说文句", "《三国演义》", "夏侯惇拔矢啖睛故事中的文句。"),
  q("082.", 47, "身体发肤，受之父母，不敢毁伤，孝之始也", "经文", "《孝经·开宗明义章》", "《孝经》关于身体发肤的名句。"),
  q("082.", 49, "启予足！启予手！诗云：‘战战兢兢，如临深渊，如履薄冰。’而今而后，吾知免夫！小子！", "古典名句", "《论语·泰伯》", "曾子临终以《诗经》说明保全身体的名句。"),
  q("083.", 25, "己所不欲，勿施于人", "古典名句", "《论语》", "李敖以孔子名句说明文字表达的不可替代。"),
  q("083.", 45, "开卷有益", "成语", "宋太宗语", "宋太宗关于读书有益的成语。"),
  q("085.", 9, "情人眼里出西施", "俗语", "中国俗语", "恋爱中的审美俗语。"),
  q("085.", 9, "王八看绿豆，对眼儿", "俗语", "中国俗语", "形容彼此看对眼的俚俗说法。"),
  q("093.", 13, "不信青春唤不回，不容青史尽成灰", "诗句", "于右任诗句", "李敖引用于右任诗句谈青春与青史。"),
  q("096.", 7, "夫斶前为慕势", "古文名句", "《战国策·齐策》", "颜斶对齐宣王的礼贤下士之语。"),
  q("099.", 27, "声妓晚景从良，一世之烟花无碍", "俗语格言", "中国俗语", "以晚景看人品的俗语格言。"),
  q("099.", 27, "贞妇白头失守，半生之清苦俱非", "俗语格言", "中国俗语", "以晚景看人品的俗语格言。"),
  q("099.", 27, "看人只看后半截", "俗语格言", "中国俗语", "强调后半生评价的俗语。"),
  q("103.", 7, "我与阳春有约", "西方格言", "桑塔耶那语", "李敖给桑塔耶那名句的另一种译法。"),
  q("103.", 21, "运用之妙存乎一心", "古典成语", "岳飞兵法语", "岳飞关于运用方法的成语。"),
  q("103.", 29, "种豆南山下，草盛豆苗稀。晨兴理荒秽，带月荷锄归。道狭草木长，夕露沾我衣。衣沾不足惜，但使愿无违。", "诗", "陶渊明《归园田居》", "李敖引用陶渊明田园诗。"),
  q("106.", 19, "轻裘缓带，身不被甲", "史传文句", "羊祜典故", "形容羊祜从容指挥的史传文句。"),
  q("106.", 19, "羊祜岂酖人者", "史传文句", "羊祜、陆抗故事", "陆抗信任羊祜不会下毒的典故句。"),
  q("107.", 23, "奇货可居", "成语典故", "吕不韦典故", "吕不韦投资异人的成语典故。"),
  q("113.", 5, "狡兔三窟", "成语", "《战国策·齐策》", "冯谖相关的成语典故。"),
  q("113.", 15, "未知生，焉知死", "古典名句", "《论语·先进》", "孔子关于生死问题的名句。"),
  q("113.", 15, "敬鬼神而远之", "古典名句", "《论语·雍也》", "孔子关于鬼神态度的名句。"),
  q("117.", 9, "好读书，不求甚解", "古文名句", "陶渊明《五柳先生传》", "李敖解释“不求甚解”不是粗读。"),
  q("117.", 15, "及时的一针可以省下九针", "西方谚语", "A stitch in time saves nine", "梁实秋字典中对英文谚语的译法。"),
  q("117.", 15, "小洞不补，大洞吃苦", "俗语", "中国俗语", "李敖认为更贴近英文谚语的中文俗语。"),
  q("117.", 21, "犯错是人之常情", "西方谚语", "To err is human", "李敖引用英文谚语的中文说法。"),
  q("117.", 27, "不入虎穴焉得虎子", "成语典故", "班超故事", "说明谚语成语有来源不可据为己有。"),
  q("123.", 7, "君子不党", "古典名句", "《论语·述而》", "巫马期故事中的古典文句。"),
  q("123.", 9, "苟有过，人必知之", "古典名句", "《论语·述而》", "孔子说自己有错必被人知道的名句。"),
  q("125.", 27, "人溺己溺，人饥己饥", "成语", "夏禹、后稷典故", "表示对民间疾苦感同身受的成语。"),
  q("125.", 33, "众生不成佛，我不成佛，我不入地狱，谁入地狱", "佛教俗语", "地藏菩萨愿语", "李敖概括地藏菩萨精神的俗语化说法。"),
  q("126.", 11, "五步一楼，十步一阁", "赋句", "杜牧《阿房宫赋》", "杜牧描写阿房宫建筑的赋句。"),
  q("126.", 11, "廊腰缦回，檐牙高啄", "赋句", "杜牧《阿房宫赋》", "杜牧描写阿房宫建筑的赋句。"),
  q("126.", 11, "各抱地势，钩心斗角", "赋句", "杜牧《阿房宫赋》", "杜牧描写阿房宫建筑的赋句。"),
  q("131.", 39, "哲学的目的，就是最后叫人如何面对死亡", "西方格言", "西方哲学家语", "李敖引用西方哲学格言谈死亡。"),
  q("138.", 9, "山水有灵，亦当惊知己于千古矣！", "古文名句", "郦道元《水经注》", "郦道元为山水作知己的名句。"),
  q("141.", 35, "蒹葭苍苍，白露为霜，所谓伊人，在水一方", "诗句", "《诗经·秦风·蒹葭》", "李敖说明自己的标题取自《诗经》。"),
  q("141.", 73, "说大人，则藐之", "古典名句", "《孟子·尽心下》", "孟子谈游说大人时的态度。"),
  q("142.", 9, "但平生所为，未尝有不可对人言者耳", "史传文句", "司马光自言", "司马光自述平生所为皆可告人。"),
  q("143.", 21, "没有人是孤岛", "西方诗文格言", "约翰·多恩《沉思录》第十七篇", "李敖介绍约翰·多恩名句及海明威书名来源。"),
  q("144.", 21, "行万里路，读万卷书", "格言", "董其昌语", "李敖引用传统读书游历格言再加以改写。"),
  q("145.", 11, "天下本自无事，只是庸人扰之，始为繁耳", "古文名句", "唐人语", "庸人自扰相关的古语原型。"),
  q("145.", 11, "天下本无事，庸人扰之耳", "成语俗语", "宋人诗句/俗语", "庸人自扰相关的常见说法。"),
  q("145.", 11, "本来无事只畏扰，扰者才吏非庸人", "诗句", "后人诗句", "对“庸人扰之”说法的再转化。"),
];

const proofreadBeforeRows = 119;
const proofreadRemovedRows = [
  ["LAXAJH-001", "室内更无人", "杜甫诗句被节目解释文字切碎，且源文转写与通行文本有差异，单独保留检索价值弱。"],
  ["LAXAJH-002", "唯有乳下孙", "杜甫诗句残片，离开上下文后太短，不宜单独成条。"],
  ["LAXAJH-003", "有孙母未去", "杜甫诗句残片，未能形成完整诗句。"],
  ["LAXAJH-074", "我和春天有约", "与同源下一条“我与阳春有约”重复，保留较书面的一种译法。"],
  ["LAXAJH-081", "故正义为所夺", "训诂说明的后半截，缺少前文“助词之用既多”后不宜独立成条。"],
  ["LAXAJH-087", "及时行事，事半功倍", "属于李敖对英文谚语的解释性转述，且已由原译“及时的一针可以省下九针”和俗语“小洞不补，大洞吃苦”覆盖。"],
  ["LAXAJH-091", "陈司败问昭公知礼乎，孔子曰：‘知礼’", "《论语》叙事铺垫，格言性弱；保留后面的核心句。"],
  ["LAXAJH-093", "君子亦党乎？", "反问残片，依赖前后语境。"],
  ["LAXAJH-094", "孰不知礼？", "反问残片，依赖前后语境。"],
  ["LAXAJH-095", "丘也幸", "过短残片，不能独立表达完整意思。"],
  ["LAXAJH-098", "若不先度罪苦", "佛经条件句残片，已由“众生不成佛……”概括条覆盖。"],
  ["LAXAJH-099", "我终未愿成佛", "佛经愿文残片，缺少前置条件，已由“众生不成佛……”概括条覆盖。"],
  ["LAXAJH-104", "有二小儿登吾肩", "鸠摩罗什轶事中的情节残片，不属于可独立引用的诗文格言。"],
  ["LAXAJH-105", "天下莫二", "人物称赞残片，缺少主语，检索价值弱。"],
  ["LAXAJH-106", "何可使法种少嗣", "轶事残片且语境偏生殖叙事，不作诗文格言保留。"],
  ["LAXAJH-111", "自少至老", "《宋史》人物叙述残片，缺少独立引用价值。"],
  ["LAXAJH-112", "语未尝妄", "人物叙述残片，已由司马光自述核心句覆盖。"],
  ["LAXAJH-113", "吾无过人者", "司马光自述的前半截，格言性不如后一条完整。"],
];
const proofreadChangedRows = [];

const modernPoliticalTerms = [
  "总统",
  "国民党",
  "共产党",
  "民进党",
  "李登辉",
  "蒋介石",
  "蒋经国",
  "毛泽东",
  "孙中山",
  "台湾独立",
  "中华人民共和国",
  "政府",
  "立法院",
  "监察院",
  "法院",
  "宪法",
  "政治犯",
  "特务",
  "选举",
  "中常会",
  "中央日报",
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
for (const row of rows) {
  categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1);
}

const byFileCounts = new Map();
for (const row of rows) {
  byFileCounts.set(row.source_file, (byFileCounts.get(row.source_file) || 0) + 1);
}

const report = [
  `《${book}》诗文格言歌谣引用首轮/校对后报告`,
  `生成日期：${generatedDate}`,
  "",
  `源目录：${sourceDir}`,
  `源文件数：${files.length}`,
  `首轮原始收入：${proofreadBeforeRows}`,
  `校对删除：${proofreadRemovedRows.length}`,
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
  "- 只收可独立成立的诗、词、赋、经文、古文名句、成语俗语、西方格言、佛教文句。",
  "- 排除现代政治人物语录、党派口号、政论判断、文件宣言、诉讼与新闻转述。",
  "- 古典史传、经书中的文句如确为传统诗文格言范围，按古典来源保留，供校对轮再审边界。",
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
  `校对前条目数：${proofreadBeforeRows}`,
  `删除条目数：${proofreadRemovedRows.length}`,
  "补入条目数：0",
  `修改条目数：${proofreadChangedRows.length}`,
  `校对后条目数：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `现代政治词命中：${politicalFlagged.length}`,
  "",
  "校对处理：",
  "- 未发现需要删除的现代政治语录；本轮删除对象主要是过短残片、叙事铺垫、重复译法、解释性转述和轶事碎片。",
  "- 《论语》《周易》《后出师表》《三国志》《史记》等古典文献的传统文句继续保留；古代史传与古代军政文句不按现代政治语录处理。",
  "- 《李敖笑傲江湖》为节目文字稿，现代新闻与党派语境密集；校对后仍只保留能脱离节目语境独立检索的诗文格言。",
  "",
  "删除明细：",
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => `- ${id}｜${quoteText}：${reason}`),
  "",
  "按文件分布：",
  ...Array.from(byFileCounts.entries()).map(([file, count]) => `- ${file}: ${count}`),
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
  proofreadRemovedRows: proofreadRemovedRows.length,
  politicalFlagged: politicalFlagged.length,
}, null, 2));
