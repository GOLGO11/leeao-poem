const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const BOOK = "李敖书笺集";
const ID_PREFIX = "LASHJQ";
const SOURCE_DIR = path.join(__dirname, "..", "《大李敖全集6.0》分章节", "008.书信函件类", "006.李敖书笺集");
const EXPORT_DIR = path.join(__dirname, "..", "exports");
const ANALYSIS_DIR = path.join(__dirname, "..", "analysis");
const CSV_PATH = path.join(EXPORT_DIR, `${BOOK}_诗文格言歌谣引用.csv`);
const TXT_PATH = path.join(EXPORT_DIR, `${BOOK}_诗文格言歌谣引用.txt`);
const REPORT_PATH = path.join(ANALYSIS_DIR, "liao_shujianji_letterpaper_initial_report.txt");
const AUDIT_PATH = path.join(ANALYSIS_DIR, "liao_shujianji_letterpaper_initial_audit.tsv");
const PROOFREAD_REPORT_PATH = path.join(ANALYSIS_DIR, "liao_shujianji_letterpaper_proofread_report.txt");
const PROOFREAD_AUDIT_PATH = path.join(ANALYSIS_DIR, "liao_shujianji_letterpaper_proofread_audit.tsv");
const CANDIDATE_PATH = path.join(ANALYSIS_DIR, "liao_shujianji_letterpaper_quote_candidates.json");
const REVIEW_PATH = path.join(ANALYSIS_DIR, "liao_shujianji_letterpaper_review_candidates.tsv");
const ATTRIBUTED_PATH = path.join(ANALYSIS_DIR, "liao_shujianji_letterpaper_attributed_lines.tsv");

const decoder = new TextDecoder("gb18030");

const riskPattern = /(政治|国会|总统|总裁|政府|政党|国民党|共产党|民主|选举|外交|主权|人权|二二八|西藏|雷震案|雷震|司法|法院|军政|民族国家|革命|党国|中共|马克思主义|集权政权|出版法|报禁|查禁|党外|警总|警备|陈文成|美丽岛|极权|立委|后援会|报刊|言论自由|冤狱|特务|役男|兵役|通匪|匪首)/;
const candidatePattern = /(“[^”]{2,}”|‘[^’]{2,}’|《[^》]{2,}》|曰|云|说|所谓|古语|古人|名言|格言|诗|联|典|成语|佛经|维摩诘经|王梵志|鲁仲连|爱因斯坦|海涅|牛顿|李贽|陈独秀|福尔摩斯|莎士比亚|典故|语录|名句|[一-龥]{2,8}(?:如此|如是|足矣|而已|不尽|莫测|不怪|不见|不畏|无愧|休矣|妙哉))/;
const attributedPattern = /(曰|云|说|所谓|古语|古人|佛经|诗|联|典|成语|维摩诘经|王梵志|鲁仲连|爱因斯坦|海涅|牛顿|李贽|陈独秀|福尔摩斯|莎士比亚|孔子|周公)/;

const rawEntries = [
  {
    file: "012.胡茵梦的“天性”问题.txt",
    line: 11,
    quote: "说谎不是我的天性。",
    category: "格言",
    origin: "胡茵梦语",
    summary: "关于人对自身天性的辩解。",
    notes: "保留为私人书信语境中的短句，未取其法律争议。"
  },
  {
    file: "012.胡茵梦的“天性”问题.txt",
    line: 21,
    quote: "于人无益，于己有损",
    category: "格言",
    origin: "李敖概括",
    summary: "指出一种做法既无益于人也有损自身。",
    notes: ""
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 13,
    quote: "这次不算，好汉重来",
    category: "格言",
    origin: "俗语化表达",
    summary: "以重新来过回应一时失利。",
    notes: ""
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 15,
    quote: "恩怨分明",
    category: "成语",
    origin: "成语",
    summary: "形容对恩与怨分辨清楚。",
    notes: ""
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 23,
    quote: "岁云暮矣",
    category: "典故",
    origin: "古典语汇",
    summary: "岁末时节的文言表达。",
    notes: ""
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 23,
    quote: "何足道哉",
    category: "成语",
    origin: "文言成语",
    summary: "表示不值得一提。",
    notes: ""
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 23,
    quote: "比比皆是",
    category: "成语",
    origin: "成语",
    summary: "形容同类事物到处都是。",
    notes: ""
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 25,
    quote: "雪中送炭",
    category: "成语",
    origin: "成语",
    summary: "比喻在急需时给予帮助。",
    notes: ""
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 25,
    quote: "雪中送肉",
    category: "格言",
    origin: "李敖改写",
    summary: "用较夸张的说法强调实际援助。",
    notes: "与“雪中送炭”并列。"
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 25,
    quote: "一个人说要送炭给你时，不可轻信，要真正送了才算。",
    category: "格言",
    origin: "李敖概括",
    summary: "强调承诺要以实际行为为准。",
    notes: ""
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 25,
    quote: "大义灭亲",
    category: "成语",
    origin: "成语",
    summary: "为公义而不徇私亲。",
    notes: ""
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 27,
    quote: "士别三日，就要刮目相待",
    category: "典故",
    origin: "吕蒙典故",
    summary: "久别后应重新评价人的变化。",
    notes: ""
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 27,
    quote: "士别三十年，有目也休刮也",
    category: "格言",
    origin: "李敖改写",
    summary: "反讽多年后仍无进步。",
    notes: "由“士别三日”化出。"
  },
  {
    file: "013.雪中送炭与雪中送肉.txt",
    line: 27,
    quote: "一个人怎么可以这样没有进步？",
    category: "格言",
    origin: "李敖概括",
    summary: "批评长期没有成长。",
    notes: ""
  },
  {
    file: "016.二十年后的一次通信.txt",
    line: 7,
    quote: "纸短意长",
    category: "成语",
    origin: "成语",
    summary: "文字虽短而情意很长。",
    notes: ""
  },
  {
    file: "016.二十年后的一次通信.txt",
    line: 23,
    quote: "云林",
    category: "典故",
    origin: "倪云林书画典故",
    summary: "以倪云林书画风格作典故。",
    notes: ""
  },
  {
    file: "017.谁露了奶头？.txt",
    line: 23,
    quote: "雅俗共赏",
    category: "成语",
    origin: "成语",
    summary: "形容作品高雅与通俗趣味都能接受。",
    notes: ""
  },
  {
    file: "017.谁露了奶头？.txt",
    line: 23,
    quote: "皆大欢喜",
    category: "成语",
    origin: "成语",
    summary: "大家都满意高兴。",
    notes: ""
  },
  {
    file: "017.谁露了奶头？.txt",
    line: 23,
    quote: "临奶欢喜，不知有汉",
    category: "格言",
    origin: "李敖化用",
    summary: "以戏谑方式化用“不知有汉”。",
    notes: ""
  },
  {
    file: "025.揪出伪君子.txt",
    line: 11,
    quote: "一个人要想高，想办法去高就是，老想踩住别人来垫高自己，那是要不得的行为。",
    category: "格言",
    origin: "李敖概括",
    summary: "反对以贬低他人来抬高自己。",
    notes: ""
  },
  {
    file: "028.我决定管一次小事.txt",
    line: 7,
    quote: "自不待言",
    category: "成语",
    origin: "成语",
    summary: "表示无需多说。",
    notes: ""
  },
  {
    file: "028.我决定管一次小事.txt",
    line: 11,
    quote: "蒙混以欺旅客",
    category: "格言",
    origin: "李敖概括",
    summary: "批评以蒙混方式欺骗旅客。",
    notes: ""
  },
  {
    file: "028.我决定管一次小事.txt",
    line: 13,
    quote: "形同猪仔",
    category: "格言",
    origin: "李敖比喻",
    summary: "比喻被极不体面地对待。",
    notes: ""
  },
  {
    file: "028.我决定管一次小事.txt",
    line: 17,
    quote: "不近人情",
    category: "成语",
    origin: "成语",
    summary: "形容处理方式不合情理。",
    notes: ""
  },
  {
    file: "028.我决定管一次小事.txt",
    line: 17,
    quote: "鬼鬼祟祟",
    category: "成语",
    origin: "成语",
    summary: "形容行动不光明正大。",
    notes: ""
  },
  {
    file: "028.我决定管一次小事.txt",
    line: 17,
    quote: "应该特为表出",
    category: "格言",
    origin: "李敖引申",
    summary: "主张应把要点特别标明。",
    notes: ""
  },
  {
    file: "028.我决定管一次小事.txt",
    line: 19,
    quote: "大时代中的小事",
    category: "格言",
    origin: "李敖概括",
    summary: "强调大背景中仍有值得处理的小事。",
    notes: ""
  },
  {
    file: "028.我决定管一次小事.txt",
    line: 19,
    quote: "忍气吞声",
    category: "成语",
    origin: "成语",
    summary: "形容受气而不敢出声。",
    notes: ""
  },
  {
    file: "028.我决定管一次小事.txt",
    line: 19,
    quote: "打太极拳",
    category: "俗语",
    origin: "俗语",
    summary: "比喻推来推去、不正面处理。",
    notes: ""
  },
  {
    file: "028.我决定管一次小事.txt",
    line: 19,
    quote: "我决定管一次小事",
    category: "格言",
    origin: "李敖语",
    summary: "表达从具体小事入手的态度。",
    notes: ""
  },
  {
    file: "029.苍蝇也没那么好拍的！.txt",
    line: 17,
    quote: "视而不见",
    category: "成语",
    origin: "成语",
    summary: "看见却当作没看见。",
    notes: ""
  },
  {
    file: "029.苍蝇也没那么好拍的！.txt",
    line: 19,
    quote: "落井下石",
    category: "成语",
    origin: "成语",
    summary: "乘人危难时加以打击。",
    notes: ""
  },
  {
    file: "029.苍蝇也没那么好拍的！.txt",
    line: 19,
    quote: "家徒一壁三面皆空",
    category: "格言",
    origin: "李敖化用",
    summary: "以夸张方式写极度贫乏。",
    notes: ""
  },
  {
    file: "029.苍蝇也没那么好拍的！.txt",
    line: 19,
    quote: "补苴罅漏",
    category: "成语",
    origin: "成语",
    summary: "比喻弥补缺漏。",
    notes: ""
  },
  {
    file: "029.苍蝇也没那么好拍的！.txt",
    line: 27,
    quote: "举一反三",
    category: "成语",
    origin: "成语",
    summary: "由一件事类推其他事情。",
    notes: ""
  },
  {
    file: "029.苍蝇也没那么好拍的！.txt",
    line: 43,
    quote: "高不可攀",
    category: "成语",
    origin: "成语",
    summary: "比喻难以达到或接近。",
    notes: ""
  },
  {
    file: "029.苍蝇也没那么好拍的！.txt",
    line: 43,
    quote: "无能为力",
    category: "成语",
    origin: "成语",
    summary: "表示没有能力去做。",
    notes: ""
  },
  {
    file: "029.苍蝇也没那么好拍的！.txt",
    line: 57,
    quote: "只拍苍蝇，不打老虎",
    category: "俗语",
    origin: "李敖转述",
    summary: "批评只处理小问题而不触及大问题。",
    notes: ""
  },
  {
    file: "031.“千秋评论”连出五十期了！.txt",
    line: 5,
    quote: "勤奋如此、有恒如此、锲而不舍如此、守此不去如此、江郎不才尽如此，真是古今中外第一人！",
    category: "格言",
    origin: "李敖自述",
    summary: "以排比写长期坚持办刊写作。",
    notes: ""
  },
  {
    file: "031.“千秋评论”连出五十期了！.txt",
    lineStart: 9,
    lineEnd: 11,
    quote: "一月又一月，千秋五十期。水平连年好，调门总不低。\n看花双手按，行文一脚踢。无尽灯长亮，五更做晨鸡。",
    category: "诗文",
    origin: "李敖诗",
    summary: "以短诗记录《千秋评论》连出五十期。",
    notes: ""
  },
  {
    file: "031.“千秋评论”连出五十期了！.txt",
    line: 13,
    quote: "有法门名无尽灯，汝等当学。",
    category: "典故",
    origin: "《维摩诘经》",
    summary: "引佛经“无尽灯”法门。",
    notes: ""
  },
  {
    file: "031.“千秋评论”连出五十期了！.txt",
    line: 13,
    quote: "一灯燃百千灯，冥者皆明，明终不尽。",
    category: "典故",
    origin: "《维摩诘经》",
    summary: "以一灯传百千灯说明光明不尽。",
    notes: ""
  },
  {
    file: "031.“千秋评论”连出五十期了！.txt",
    line: 13,
    quote: "夫一菩萨开导百千众生，令发阿耨多罗三藐三菩提心，于其道意，亦不灭尽，随所说法，而自增益一切善法，是名无尽灯也。",
    category: "典故",
    origin: "《维摩诘经》",
    summary: "解释“无尽灯”之义。",
    notes: ""
  },
  {
    file: "031.“千秋评论”连出五十期了！.txt",
    line: 13,
    quote: "安西老守是禅僧，到处应然无尽灯。",
    category: "诗文",
    origin: "苏轼诗句",
    summary: "引诗句承接无尽灯典故。",
    notes: ""
  },
  {
    file: "031.“千秋评论”连出五十期了！.txt",
    line: 19,
    quote: "众人皆醉而我独醒",
    category: "典故",
    origin: "屈原典故",
    summary: "以众醉独醒写独立判断。",
    notes: ""
  },
  {
    file: "031.“千秋评论”连出五十期了！.txt",
    line: 19,
    quote: "上穷碧落下黄泉",
    category: "诗文",
    origin: "白居易《长恨歌》",
    summary: "引唐诗名句形容追寻无处不到。",
    notes: ""
  },
  {
    file: "031.“千秋评论”连出五十期了！.txt",
    line: 21,
    quote: "千山我独行",
    category: "格言",
    origin: "李敖化用",
    summary: "表达独行不从众的姿态。",
    notes: ""
  },
  {
    file: "033.谁逼辜振甫还了债？.txt",
    line: 17,
    quote: "致力回馈社会，尽可能的贡献社会",
    category: "格言",
    origin: "李敖转述",
    summary: "写回馈与贡献社会的说法。",
    notes: ""
  },
  {
    file: "033.谁逼辜振甫还了债？.txt",
    line: 17,
    quote: "可以休矣",
    category: "典故",
    origin: "文言语汇",
    summary: "表示到此可以停止。",
    notes: ""
  },
  {
    file: "033.谁逼辜振甫还了债？.txt",
    line: 19,
    quote: "以历史的眼光",
    category: "格言",
    origin: "李敖概括",
    summary: "主张从历史尺度看问题。",
    notes: ""
  },
  {
    file: "033.谁逼辜振甫还了债？.txt",
    line: 33,
    quote: "所贵于天下之士者，为人排患、释难、解纷乱，而无所取也。",
    category: "典故",
    origin: "《战国策》鲁仲连语",
    summary: "称贵重之士在于替人排难解纷而不取报酬。",
    notes: ""
  },
  {
    file: "033.谁逼辜振甫还了债？.txt",
    line: 33,
    quote: "排患、解难、解纷乱",
    category: "典故",
    origin: "《战国策》鲁仲连语",
    summary: "概括排难解纷之义。",
    notes: ""
  },
  {
    file: "033.谁逼辜振甫还了债？.txt",
    line: 33,
    quote: "受之无愧",
    category: "成语",
    origin: "成语",
    summary: "接受而不觉得惭愧。",
    notes: ""
  },
  {
    file: "033.谁逼辜振甫还了债？.txt",
    line: 35,
    quote: "脸色苍白，呆若木鸡",
    category: "成语",
    origin: "成语",
    summary: "形容惊愕或窘迫的神情。",
    notes: ""
  },
  {
    file: "034.关于三毛与雷三毛.txt",
    line: 67,
    quote: "人间天堂的旁边还有着人间地狱",
    category: "格言",
    origin: "李敖转述",
    summary: "以天堂与地狱并置写现实反差。",
    notes: "未收同篇背景性诗文。"
  },
  {
    file: "035.“好而知其恶，恶而知其美”.txt",
    line: 1,
    quote: "好而知其恶，恶而知其美",
    category: "典故",
    origin: "古典语句",
    summary: "喜欢一个人仍知道其缺点，厌恶一个人仍知道其长处。",
    notes: ""
  },
  {
    file: "035.“好而知其恶，恶而知其美”.txt",
    line: 7,
    quote: "善莫大焉",
    category: "典故",
    origin: "古典语句",
    summary: "没有比这更大的善。",
    notes: ""
  },
  {
    file: "035.“好而知其恶，恶而知其美”.txt",
    line: 9,
    quote: "好而知其恶，恶而知其美者，天下鲜矣",
    category: "典故",
    origin: "古典语句",
    summary: "称能兼见爱憎两面的态度很少见。",
    notes: ""
  },
  {
    file: "035.“好而知其恶，恶而知其美”.txt",
    line: 9,
    quote: "隐恶扬善",
    category: "成语",
    origin: "成语",
    summary: "隐藏缺点而表扬好处。",
    notes: ""
  },
  {
    file: "035.“好而知其恶，恶而知其美”.txt",
    line: 9,
    quote: "有容德乃大",
    category: "格言",
    origin: "李敖概括",
    summary: "以宽容成就德量。",
    notes: ""
  },
  {
    file: "035.“好而知其恶，恶而知其美”.txt",
    line: 9,
    quote: "有意骨乃贱",
    category: "格言",
    origin: "李敖对句",
    summary: "以刻意经营反衬格调低下。",
    notes: ""
  },
  {
    file: "035.“好而知其恶，恶而知其美”.txt",
    line: 13,
    quote: "诚其意",
    category: "典故",
    origin: "儒家语汇",
    summary: "指使意念诚实。",
    notes: ""
  },
  {
    file: "036.如此“便民”.txt",
    line: 15,
    quote: "团团转",
    category: "俗语",
    origin: "俗语",
    summary: "形容忙乱或被反复折腾。",
    notes: ""
  },
  {
    file: "036.如此“便民”.txt",
    line: 71,
    quote: "非一日之寒",
    category: "成语",
    origin: "成语",
    summary: "比喻问题形成不是短时间造成。",
    notes: ""
  },
  {
    file: "036.如此“便民”.txt",
    line: 71,
    quote: "事出有因",
    category: "成语",
    origin: "成语",
    summary: "事情发生有其原因。",
    notes: ""
  },
  {
    file: "037.被嚼槟榔的吻了一下.txt",
    line: 7,
    quote: "我也是做木材生意的，不过是小规模的（in a small way）——我是卖牙签的。",
    category: "妙语",
    origin: "福尔摩斯笑话",
    summary: "以卖牙签反转“木材生意”的说法。",
    notes: ""
  },
  {
    file: "037.被嚼槟榔的吻了一下.txt",
    line: 7,
    quote: "吾今日围猎，欲射一马，误中一獐。",
    category: "典故",
    origin: "古人语",
    summary: "写本欲射马却误中獐的故事。",
    notes: ""
  },
  {
    file: "037.被嚼槟榔的吻了一下.txt",
    line: 7,
    quote: "既要射马，也要射獐",
    category: "格言",
    origin: "李敖引申",
    summary: "由射马误中獐的典故引申出兼取两者。",
    notes: ""
  },
  {
    file: "037.被嚼槟榔的吻了一下.txt",
    line: 7,
    quote: "随缘弄墨",
    category: "格言",
    origin: "李敖语",
    summary: "写随缘而作的文字姿态。",
    notes: ""
  },
  {
    file: "037.被嚼槟榔的吻了一下.txt",
    line: 9,
    quote: "梵志翻着袜，人皆道是错。乍可刺你眼，不可隐我脚。",
    category: "诗文",
    origin: "王梵志诗",
    summary: "引王梵志诗写宁可碍人眼也不委屈自己。",
    notes: ""
  },
  {
    file: "037.被嚼槟榔的吻了一下.txt",
    line: 9,
    quote: "外界毁誉，实不足介怀。",
    category: "格言",
    origin: "李敖概括",
    summary: "表达不必在意外界毁誉。",
    notes: ""
  },
  {
    file: "037.被嚼槟榔的吻了一下.txt",
    line: 9,
    quote: "被臭虫咬了一下",
    category: "妙语",
    origin: "李敖比喻",
    summary: "用小事比喻外界攻击。",
    notes: ""
  },
  {
    file: "037.被嚼槟榔的吻了一下.txt",
    line: 9,
    quote: "被嚼槟榔的吻了一下",
    category: "妙语",
    origin: "李敖比喻",
    summary: "用戏谑比喻外界攻击。",
    notes: ""
  },
  {
    file: "039.成功在第三次.txt",
    line: 13,
    quote: "仇敌都不见，除却一寒冬",
    category: "诗文",
    origin: "莎士比亚诗句译文",
    summary: "写唯一敌人只是寒冬。",
    notes: ""
  },
  {
    file: "039.成功在第三次.txt",
    line: 13,
    quote: "Here shall be see / No enemy / But winter and rough weather.",
    category: "诗文",
    origin: "莎士比亚",
    summary: "莎士比亚诗句原文。",
    notes: "按底本保留 see。"
  },
  {
    file: "039.成功在第三次.txt",
    line: 15,
    quote: "如金光之加于落日",
    category: "诗文",
    origin: "福尔摩斯信语译文",
    summary: "以落日加金光比喻晚年荣誉。",
    notes: ""
  },
  {
    file: "039.成功在第三次.txt",
    line: 15,
    quote: "I shall treasure it as adding gold to the sunset.",
    category: "诗文",
    origin: "福尔摩斯信语",
    summary: "以加金于落日表达珍惜。",
    notes: ""
  },
  {
    file: "039.成功在第三次.txt",
    line: 21,
    quote: "朝夕读书，手不敢释卷、笔不敢停挥，自五十六岁以至今年七十四岁，日日如是而已。关门闭户，著书甚多，不暇接人，亦不暇去教人",
    category: "格言",
    origin: "李贽语",
    summary: "写日日读书写作、闭户著书的状态。",
    notes: ""
  },
  {
    file: "039.成功在第三次.txt",
    line: 23,
    quote: "世俗之礼不行、世俗之人不交、世俗之论不畏，然后其势孤，势孤然后能中立（独立）",
    category: "格言",
    origin: "刘继庄语",
    summary: "以孤立成就独立的论述。",
    notes: ""
  },
  {
    file: "039.成功在第三次.txt",
    line: 25,
    quote: "我只注重我自己独立的思想，不迁就任何人的意见。",
    category: "格言",
    origin: "陈独秀语",
    summary: "强调独立思想不迁就他人意见。",
    notes: "仅收个人独立思想短句。"
  },
  {
    file: "040.爱因斯坦的两段话.txt",
    line: 13,
    quote: "My passionate interest in social justice and social responsibility has always stood in curious contract to a marked lack of desire for direct association with men and women.",
    category: "格言",
    origin: "爱因斯坦语",
    summary: "写社会责任兴趣与个人交往欲望之间的反差。",
    notes: "按底本保留 contract。"
  },
  {
    file: "040.爱因斯坦的两段话.txt",
    line: 13,
    quote: "I am a horse for single harness，not cut out for tandem or team work.",
    category: "格言",
    origin: "爱因斯坦语",
    summary: "以单挽马比喻自己的独行性格。",
    notes: ""
  },
  {
    file: "040.爱因斯坦的两段话.txt",
    line: 13,
    quote: "I have never belonged wholeheartedly to country or state，to my circle of friends，or even to my own family.",
    category: "格言",
    origin: "爱因斯坦语",
    summary: "写自己从未完全归属于任何群体。",
    notes: ""
  },
  {
    file: "040.爱因斯坦的两段话.txt",
    line: 13,
    quote: "These ties have always been accompanied by a vague aloofness，and the wish to withdraw into myself increases with the years.",
    category: "格言",
    origin: "爱因斯坦语",
    summary: "写疏离感与退回自我的愿望。",
    notes: ""
  },
  {
    file: "040.爱因斯坦的两段话.txt",
    line: 15,
    quote: "Such isolation is sometimes bitter, but I do not regret being cut off from the understanding and sympathy of other men.",
    category: "格言",
    origin: "爱因斯坦语",
    summary: "写孤立虽苦但并不后悔。",
    notes: ""
  },
  {
    file: "040.爱因斯坦的两段话.txt",
    line: 15,
    quote: "I lose something by it, to be sure，but I am compensated for it in being rendered independent of the customs, opinions, and prejudices of others, and am not tempted to rest my peace of mind upon such shifting foundation.",
    category: "格言",
    origin: "爱因斯坦语",
    summary: "写以独立于习俗、意见和偏见作为补偿。",
    notes: ""
  },
  {
    file: "041.彼以熊来，吾以熊往.txt",
    line: 5,
    quote: "She can not get along with herself",
    category: "妙语",
    origin: "英语妙语",
    summary: "说一个人连自己都相处不好。",
    notes: ""
  },
  {
    file: "041.彼以熊来，吾以熊往.txt",
    line: 5,
    quote: "她跟自己都不能相处",
    category: "妙语",
    origin: "英语妙语译文",
    summary: "英语妙语的中文翻译。",
    notes: ""
  },
  {
    file: "041.彼以熊来，吾以熊往.txt",
    line: 9,
    quote: "自囚的艺术",
    category: "格言",
    origin: "李敖概括",
    summary: "把闭门不出写成一种自囚艺术。",
    notes: ""
  },
  {
    file: "041.彼以熊来，吾以熊往.txt",
    line: 19,
    quote: "爱钱如命",
    category: "成语",
    origin: "成语",
    summary: "形容极其爱钱。",
    notes: ""
  },
  {
    file: "041.彼以熊来，吾以熊往.txt",
    line: 19,
    quote: "爱钱过命",
    category: "格言",
    origin: "李敖改写",
    summary: "由“爱钱如命”加重而来。",
    notes: ""
  },
  {
    file: "041.彼以熊来，吾以熊往.txt",
    line: 19,
    quote: "天花乱坠",
    category: "成语",
    origin: "成语",
    summary: "形容说得极其动听而浮夸。",
    notes: ""
  },
  {
    file: "041.彼以熊来，吾以熊往.txt",
    line: 19,
    quote: "美中不足",
    category: "成语",
    origin: "成语",
    summary: "好处之中仍有缺憾。",
    notes: ""
  },
  {
    file: "041.彼以熊来，吾以熊往.txt",
    line: 25,
    quote: "father-in-law",
    category: "妙语",
    origin: "英语词语",
    summary: "英语姻亲称谓。",
    notes: "与 father-out-law 形成文字游戏。"
  },
  {
    file: "041.彼以熊来，吾以熊往.txt",
    line: 25,
    quote: "father-out-law",
    category: "妙语",
    origin: "英语文字游戏",
    summary: "由 father-in-law 变化出的俏皮说法。",
    notes: ""
  },
  {
    file: "041.彼以熊来，吾以熊往.txt",
    line: 27,
    quote: "李敖是最可靠的朋友，也是最难缠的敌人。",
    category: "格言",
    origin: "李敖转述",
    summary: "以对照句写朋友与敌人的双重形象。",
    notes: ""
  },
  {
    file: "042.神龙见尾不见首.txt",
    line: 5,
    quote: "高深莫测",
    category: "成语",
    origin: "成语",
    summary: "形容深奥难以揣测。",
    notes: ""
  },
  {
    file: "042.神龙见尾不见首.txt",
    line: 5,
    quote: "见怪不怪",
    category: "成语",
    origin: "成语",
    summary: "遇到怪事也不惊讶。",
    notes: ""
  },
  {
    file: "042.神龙见尾不见首.txt",
    line: 5,
    quote: "闭关都好吗？万一不想自闭，就赶紧出来吧，我们不会笑你的。",
    category: "妙语",
    origin: "友人语",
    summary: "以幽默口吻劝闭关者出来。",
    notes: ""
  },
  {
    file: "042.神龙见尾不见首.txt",
    lineStart: 9,
    lineEnd: 15,
    quote: "因为我的闪电从来不怎么厉害，\n你以为我的雷声也不大，\n可是这回你想错了，\n我打起雷来要你怕怕。",
    category: "诗文",
    origin: "海涅诗意化用",
    summary: "借闪电雷声写将要发作的力量。",
    notes: ""
  },
  {
    file: "042.神龙见尾不见首.txt",
    line: 17,
    quote: "大丈夫说不出来，就不出来",
    category: "妙语",
    origin: "李敖化用",
    summary: "化用“大丈夫说不出来”作自嘲。",
    notes: ""
  },
  {
    file: "042.神龙见尾不见首.txt",
    line: 17,
    quote: "朋友的“失败”才是我的成功，妙哉妙哉！",
    category: "妙语",
    origin: "李敖语",
    summary: "以反讽口吻写朋友劝告的效果。",
    notes: ""
  },
  {
    file: "042.神龙见尾不见首.txt",
    line: 21,
    quote: "灵感顿来",
    category: "成语",
    origin: "成语化表达",
    summary: "灵感忽然来到。",
    notes: ""
  },
  {
    file: "042.神龙见尾不见首.txt",
    line: 25,
    quote: "神龙见尾不见首",
    category: "格言",
    origin: "李敖反用成语",
    summary: "反用“神龙见首不见尾”。",
    notes: ""
  },
  {
    file: "042.神龙见尾不见首.txt",
    line: 25,
    quote: "真正的神龙，都是把头藏起来的，藏头露尾，于人足矣！",
    category: "格言",
    origin: "李敖语",
    summary: "用神龙藏头露尾写隐退姿态。",
    notes: ""
  },
  {
    file: "042.神龙见尾不见首.txt",
    line: 25,
    quote: "真的神龙，再藏头也不是鸵鸟啊！",
    category: "妙语",
    origin: "李敖语",
    summary: "以神龙与鸵鸟对照作戏谑。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 1,
    quote: "李氏理想，张氏实行",
    category: "格言",
    origin: "李敖概括",
    summary: "以短语概括理想与实行的配合。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 9,
    quote: "一沐三握发、一饭三吐哺",
    category: "典故",
    origin: "周公典故",
    summary: "写周公礼贤下士、求贤若渴。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 9,
    quote: "孔子久不梦周公",
    category: "典故",
    origin: "孔子典故",
    summary: "以孔子不梦周公为典。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 9,
    quote: "一饭三离席",
    category: "格言",
    origin: "李敖化用",
    summary: "化用周公典故写用饭时屡次离席。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 11,
    quote: "故国神游",
    category: "诗文",
    origin: "苏轼词句",
    summary: "引苏轼词语写追忆旧地。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 11,
    quote: "京华烟云",
    category: "诗文",
    origin: "文学语汇",
    summary: "以京华烟云写旧都往事。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 11,
    quote: "人间悲欢离合的大场面",
    category: "格言",
    origin: "李敖概括",
    summary: "概括人间悲欢离合的宏大场景。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 31,
    quote: "知识分子丟掉笔杆、离开讲坛就不能谋生吗？",
    category: "格言",
    origin: "张俊宏语",
    summary: "追问知识分子能否离开写作讲坛谋生。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 31,
    quote: "知识分子同样可以卖面维生，不必仰人鼻息，在恶劣的情势下仍能保住道德情操。",
    category: "格言",
    origin: "张俊宏语",
    summary: "强调知识分子也可自食其力并保持道德情操。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 31,
    quote: "能写文章就写，不能的话何以不能卖面？",
    category: "格言",
    origin: "张俊宏语",
    summary: "以卖面维生说明不应依赖单一身份。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 39,
    quote: "处常",
    category: "典故",
    origin: "古典语汇",
    summary: "指处于平常状态。",
    notes: "与“处变”成对。"
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 39,
    quote: "处变",
    category: "典故",
    origin: "古典语汇",
    summary: "指处于变局。",
    notes: "与“处常”成对。"
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 43,
    quote: "少怀大志",
    category: "格言",
    origin: "文言语汇",
    summary: "少年时怀有大志。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 43,
    quote: "创业维艰",
    category: "成语",
    origin: "成语",
    summary: "开创事业十分艰难。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 43,
    quote: "胼手胝足",
    category: "成语",
    origin: "成语",
    summary: "形容长期辛劳。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 43,
    quote: "沿门托钵僧",
    category: "典故",
    origin: "佛教语汇",
    summary: "以托钵僧比喻到处奔走求助。",
    notes: ""
  },
  {
    file: "043.李氏理想，张氏实行.txt",
    line: 43,
    quote: "大家全凭一股冲劲，想为这个沉闷的时代开辟一个可以提供新鲜空气的窗户。",
    category: "格言",
    origin: "张俊宏语",
    summary: "写凭冲劲为沉闷时代打开新鲜空气的窗口。",
    notes: ""
  }
];

const proofreadRemoved = [
  { id: "LASHJQ-011", reason: "“大义灭亲”在胡茵梦/入狱/抗议语境中反复出现，本条落点过近公共争议，校对轮删除。" },
  { id: "LASHJQ-021", reason: "普通成语嵌在铁路规则申诉段落中，非独立诗文格言，校对轮删除。" },
  { id: "LASHJQ-022", reason: "针对列车座位问题的申诉措辞，非独立格言，校对轮删除。" },
  { id: "LASHJQ-023", reason: "针对列车拥挤的比喻性申诉措辞，非独立格言，校对轮删除。" },
  { id: "LASHJQ-024", reason: "普通成语嵌在列车服务申诉段落中，校对轮删除。" },
  { id: "LASHJQ-025", reason: "普通成语嵌在列车服务申诉段落中，校对轮删除。" },
  { id: "LASHJQ-026", reason: "针对列车服务人员的具体表扬语，非独立诗文格言，校对轮删除。" },
  { id: "LASHJQ-031", reason: "普通成语嵌在市政违建和机关包庇段落中，校对轮删除。" },
  { id: "LASHJQ-032", reason: "普通成语嵌在市政拆违争议段落中，校对轮删除。" },
  { id: "LASHJQ-033", reason: "临时改写用于具体拆违现场描写，非独立格言，校对轮删除。" },
  { id: "LASHJQ-034", reason: "普通成语嵌在市政拆违争议段落中，校对轮删除。" },
  { id: "LASHJQ-035", reason: "普通成语嵌在机关拆违问责段落中，校对轮删除。" },
  { id: "LASHJQ-036", reason: "普通成语来自违建拆除报道转述，校对轮删除。" },
  { id: "LASHJQ-037", reason: "普通成语来自违建拆除报道转述，校对轮删除。" },
  { id: "LASHJQ-038", reason: "俗语直接用于市政机关拆违批评，校对轮删除。" },
  { id: "LASHJQ-045", reason: "典故被直接用于拆解孙蒋与国民党历史，校对轮按政治攻防语境删除。" },
  { id: "LASHJQ-046", reason: "诗句被直接用于拆解孙蒋与国民党历史，校对轮按政治攻防语境删除。" },
  { id: "LASHJQ-047", reason: "短句紧接国民党/知识人批评语境，校对轮删除。" },
  { id: "LASHJQ-048", reason: "具体家族债务评价中的普通社会责任语，非独立诗文格言，校对轮删除。" },
  { id: "LASHJQ-049", reason: "文言短语服务于具体家族债务批评，独立引用价值弱，校对轮删除。" },
  { id: "LASHJQ-050", reason: "普通评价短语，非独立引用，校对轮删除。" },
  { id: "LASHJQ-052", reason: "为 LASHJQ-051《战国策》引文的拆分重复，校对轮删除。" },
  { id: "LASHJQ-057", reason: "普通典故嵌在雷震表白和旧政治人物争辩中，校对轮删除。" },
  { id: "LASHJQ-059", reason: "成语嵌在雷震/国民党/老蒋争辩段落中，校对轮删除。" },
  { id: "LASHJQ-060", reason: "对句直接用于雷震/老蒋政治人物评价，校对轮删除。" },
  { id: "LASHJQ-061", reason: "对句直接用于雷震/老蒋政治人物评价，校对轮删除。" },
  { id: "LASHJQ-062", reason: "儒家短语嵌在雷震旧案争辩中，校对轮删除。" },
  { id: "LASHJQ-063", reason: "俗语嵌在地政机关和国民党衙门申诉段落中，校对轮删除。" },
  { id: "LASHJQ-064", reason: "成语嵌在银行机关整顿申诉中，校对轮删除。" },
  { id: "LASHJQ-065", reason: "成语嵌在银行机关整顿申诉中，校对轮删除。" },
  { id: "LASHJQ-066", reason: "笑话被用作党外/国民党政治比喻，校对轮删除。" },
  { id: "LASHJQ-067", reason: "典故被用作党外政治攻防比喻，校对轮删除。" },
  { id: "LASHJQ-068", reason: "引申语直接服务于党外政治攻防比喻，校对轮删除。" },
  { id: "LASHJQ-069", reason: "短语紧接党外政治攻防语境，校对轮删除。" },
  { id: "LASHJQ-071", reason: "格言紧接国民党/党外毁誉段落，校对轮删除。" },
  { id: "LASHJQ-072", reason: "比喻直接指向国民党毁谤，校对轮删除。" },
  { id: "LASHJQ-073", reason: "比喻直接指向党外称誉，校对轮删除。" },
  { id: "LASHJQ-080", reason: "陈独秀语虽截短为独立思想，但原句后续即含党派和命令指使语境，校对轮删除。" },
  { id: "LASHJQ-094", reason: "英语文字游戏嵌在党外认同台湾段落中，校对轮删除。" },
  { id: "LASHJQ-095", reason: "英语文字游戏嵌在党外认同台湾段落中，校对轮删除。" },
  { id: "LASHJQ-111", reason: "诗文短语所在句直接归因国民党，校对轮删除。" },
  { id: "LASHJQ-112", reason: "文学短语所在句直接归因国民党，校对轮删除。" },
  { id: "LASHJQ-113", reason: "概括句所在句直接归因国民党，校对轮删除。" },
  { id: "LASHJQ-114", reason: "知识分子谋生语出自《台湾政论》停刊和党外人士借款段落，校对轮删除。" },
  { id: "LASHJQ-115", reason: "知识分子谋生语出自《台湾政论》停刊和党外人士借款段落，校对轮删除。" },
  { id: "LASHJQ-116", reason: "知识分子谋生语出自《台湾政论》停刊和党外人士借款段落，校对轮删除。" },
  { id: "LASHJQ-117", reason: "短语嵌在《台湾政论》停刊后处变谋生回忆中，校对轮删除。" },
  { id: "LASHJQ-118", reason: "短语嵌在《台湾政论》停刊后处变谋生回忆中，校对轮删除。" }
];

function ensureDirs() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

function readSourceFile(file) {
  const fullPath = path.join(SOURCE_DIR, file);
  return decoder.decode(fs.readFileSync(fullPath));
}

function getSourceFiles() {
  return fs.readdirSync(SOURCE_DIR)
    .filter((file) => file.endsWith(".txt"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function normalizeText(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function compactForMatch(text) {
  return String(text).replace(/[\s　]+/g, "");
}

function getLines(file) {
  return normalizeText(readSourceFile(file)).split("\n");
}

function getContext(file, start, end) {
  const lines = getLines(file);
  return lines.slice(start - 1, end).join("\n");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\r?\n/g, "\\n");
}

function buildRows() {
  return rawEntries.map((entry, index) => {
    const lineStart = entry.lineStart ?? entry.line;
    const lineEnd = entry.lineEnd ?? entry.lineStart ?? entry.line;
    const quote = entry.quote;
    const context = getContext(entry.file, lineStart, lineEnd);
    if (!context.includes(quote) && !compactForMatch(context).includes(compactForMatch(quote))) {
      throw new Error(`Quote not found: ${entry.file}:${lineStart}-${lineEnd} ${quote}`);
    }
    return {
      id: `${ID_PREFIX}-${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      chapter: path.basename(entry.file, ".txt").replace(/^\d+\./, ""),
      source_file: entry.file,
      line_start: lineStart,
      line_end: lineEnd,
      quote_text: quote,
      category: entry.category,
      source_or_origin: entry.origin,
      summary: entry.summary,
      notes: entry.notes ?? ""
    };
  });
}

function getProofreadRemovedRows(rows) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  return proofreadRemoved.map((item) => {
    const row = byId.get(item.id);
    if (!row) {
      throw new Error(`Missing proofread removal id: ${item.id}`);
    }
    return { ...row, reason: item.reason };
  });
}

function writeCsv(rows) {
  const headers = [
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
    "notes"
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
  fs.writeFileSync(CSV_PATH, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(rows) {
  const lines = [];
  lines.push(`《${BOOK}》诗文格言歌谣引用`);
  lines.push(`首轮条目数：${rows.length}`);
  lines.push("");
  for (const row of rows) {
    lines.push(`${row.id} ${row.quote_text}`);
    lines.push(`出处：${row.book} / ${row.chapter} / ${row.source_file}:${row.line_start}${row.line_end !== row.line_start ? `-${row.line_end}` : ""}`);
    lines.push(`类别：${row.category}`);
    lines.push(`来源：${row.source_or_origin}`);
    lines.push(`说明：${row.summary}`);
    if (row.notes) {
      lines.push(`备注：${row.notes}`);
    }
    lines.push("");
  }
  fs.writeFileSync(TXT_PATH, `${lines.join("\n")}\n`, "utf8");
}

function collectCandidates() {
  const files = getSourceFiles();
  const byFile = [];
  const reviewRows = [];
  const attributedRows = [];
  let totalLines = 0;
  let totalCandidates = 0;
  let totalRisk = 0;
  let totalAttributed = 0;

  for (const file of files) {
    const lines = getLines(file);
    let candidates = 0;
    let risk = 0;
    let attributed = 0;
    lines.forEach((line, index) => {
      const lineNo = index + 1;
      const isCandidate = candidatePattern.test(line);
      const isRisk = riskPattern.test(line);
      const isAttributed = attributedPattern.test(line);
      if (isCandidate) {
        candidates += 1;
        reviewRows.push([file, lineNo, isRisk ? "risk" : "", line]);
      }
      if (isRisk) {
        risk += 1;
      }
      if (isAttributed) {
        attributed += 1;
        attributedRows.push([file, lineNo, isRisk ? "risk" : "", line]);
      }
    });
    totalLines += lines.length;
    totalCandidates += candidates;
    totalRisk += risk;
    totalAttributed += attributed;
    byFile.push({ file, lines: lines.length, candidates, risk, attributed });
  }

  const payload = {
    book: BOOK,
    sourceDir: SOURCE_DIR,
    files: files.length,
    totalLines,
    totalCandidates,
    totalRisk,
    totalAttributed,
    byFile
  };
  fs.writeFileSync(CANDIDATE_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(REVIEW_PATH, `source_file\tline\tflag\ttext\n${reviewRows.map((row) => row.map(tsvEscape).join("\t")).join("\n")}\n`, "utf8");
  fs.writeFileSync(ATTRIBUTED_PATH, `source_file\tline\tflag\ttext\n${attributedRows.map((row) => row.map(tsvEscape).join("\t")).join("\n")}\n`, "utf8");
  return payload;
}

function writeAudit(rows) {
  const header = ["id", "source_file", "line_start", "line_end", "category", "risk", "quote_text"];
  const lines = [header.join("\t")];
  for (const row of rows) {
    lines.push([
      row.id,
      row.source_file,
      row.line_start,
      row.line_end,
      row.category,
      riskPattern.test(row.quote_text) ? "risk" : "",
      row.quote_text
    ].map(tsvEscape).join("\t"));
  }
  fs.writeFileSync(AUDIT_PATH, `${lines.join("\n")}\n`, "utf8");
}

function writeProofreadFiles(removedRows, outputRows) {
  const report = [
    `《${BOOK}》校对报告`,
    "",
    `首轮条目数：${rawEntries.length}`,
    `校对删除：${removedRows.length}`,
    `校对后条目数：${outputRows.length}`,
    "",
    "删除条目：",
    ...removedRows.map(
      (row) => `- ${row.id}\t${row.source_file}:${row.line_start}\t${row.quote_text}\t${row.reason}`
    )
  ].join("\n");
  fs.writeFileSync(PROOFREAD_REPORT_PATH, `${report}\n`, "utf8");

  const headers = ["id", "source_file", "line_start", "line_end", "quote_text", "category", "reason"];
  const audit = [
    headers.join("\t"),
    ...removedRows.map((row) => headers.map((header) => tsvEscape(row[header])).join("\t"))
  ].join("\n");
  fs.writeFileSync(PROOFREAD_AUDIT_PATH, `${audit}\n`, "utf8");
}

function writeReport(rows, candidates, outputRows, removedRows) {
  const categoryCounts = rows.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + 1;
    return acc;
  }, {});
  const riskRows = rows.filter((row) => riskPattern.test(row.quote_text));
  const lines = [];
  lines.push(`《${BOOK}》首轮抽取报告`);
  lines.push("");
  lines.push(`源目录：${SOURCE_DIR}`);
  lines.push(`源文件数：${candidates.files}`);
  lines.push(`源总行数：${candidates.totalLines}`);
  lines.push(`候选行数：${candidates.totalCandidates}`);
  lines.push(`风险词行数：${candidates.totalRisk}`);
  lines.push(`带归属提示行数：${candidates.totalAttributed}`);
  lines.push("");
  lines.push(`首轮收录条目：${rows.length}`);
  lines.push(`校对删除：${removedRows.length}`);
  lines.push(`校对后导出：${outputRows.length}`);
  lines.push(`CSV：${CSV_PATH}`);
  lines.push(`TXT：${TXT_PATH}`);
  lines.push(`校对报告：${PROOFREAD_REPORT_PATH}`);
  lines.push(`校对审计：${PROOFREAD_AUDIT_PATH}`);
  lines.push("");
  lines.push("类别分布：");
  for (const [category, count] of Object.entries(categoryCounts)) {
    lines.push(`- ${category}: ${count}`);
  }
  lines.push("");
  lines.push(`核心政治风险命中：${riskRows.length}`);
  for (const row of riskRows) {
    lines.push(`- ${row.id}\t${row.source_file}:${row.line_start}\t${row.quote_text}`);
  }
  lines.push("");
  lines.push("说明：");
  lines.push("- 本书政治、司法、报刊语境密集，首轮仅收可独立作为诗文、格言、成语、典故或妙语的文本。");
  lines.push("- 已跳过大量直接涉及党派、选举、司法、出版限制、政治案件、政治人物攻防的语录。");
  fs.writeFileSync(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
}

function main() {
  ensureDirs();
  const rows = buildRows();
  const candidates = collectCandidates();
  const removedRows = getProofreadRemovedRows(rows);
  const removedIds = new Set(removedRows.map((row) => row.id));
  const outputRows = rows.filter((row) => !removedIds.has(row.id));
  writeCsv(outputRows);
  writeTxt(outputRows);
  writeAudit(rows);
  writeProofreadFiles(removedRows, outputRows);
  writeReport(rows, candidates, outputRows, removedRows);
  console.log(`First-round rows ${rows.length} for ${BOOK}`);
  console.log(`Proofread removed ${removedRows.length} rows`);
  console.log(`Wrote ${outputRows.length} rows for ${BOOK}`);
  console.log(CSV_PATH);
  console.log(TXT_PATH);
  console.log(REPORT_PATH);
  console.log(PROOFREAD_REPORT_PATH);
}

main();
