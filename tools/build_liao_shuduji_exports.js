const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const BOOK = "李敖书牍集";
const ID_PREFIX = "LASHD";
const SOURCE_DIR = path.join(__dirname, "..", "《大李敖全集6.0》分章节", "008.书信函件类", "007.李敖书牍集");
const EXPORT_DIR = path.join(__dirname, "..", "exports");
const ANALYSIS_DIR = path.join(__dirname, "..", "analysis");
const CSV_PATH = path.join(EXPORT_DIR, `${BOOK}_诗文格言歌谣引用.csv`);
const TXT_PATH = path.join(EXPORT_DIR, `${BOOK}_诗文格言歌谣引用.txt`);
const REPORT_PATH = path.join(ANALYSIS_DIR, "liao_shuduji_initial_report.txt");
const AUDIT_PATH = path.join(ANALYSIS_DIR, "liao_shuduji_initial_audit.tsv");
const CANDIDATE_PATH = path.join(ANALYSIS_DIR, "liao_shuduji_quote_candidates.json");
const REVIEW_PATH = path.join(ANALYSIS_DIR, "liao_shuduji_review_candidates.tsv");
const ATTRIBUTED_PATH = path.join(ANALYSIS_DIR, "liao_shuduji_attributed_lines.tsv");
const PROOFREAD_REPORT_PATH = path.join(ANALYSIS_DIR, "liao_shuduji_proofread_report.txt");
const PROOFREAD_AUDIT_PATH = path.join(ANALYSIS_DIR, "liao_shuduji_proofread_audit.tsv");

const decoder = new TextDecoder("gb18030");

const riskPattern = /(政治|国会|总统|总裁|政府|市长|政党|国民党|共产党|民主|选举|外交|主权|人权|二二八|西藏|雷震案|雷震|司法|司法院|法院|军政|将军|民族国家|革命|党国|中共|马克思主义|集权政权|出版法|报禁|查禁|党外|警总|警备|陈文成|美丽岛|极权|立委|后援会|报刊|言论自由|冤狱|特务|役男|兵役|通匪|匪首|通缉|警察|小蒋|新闻处)/;
const candidatePattern = /(“[^”]{2,}”|‘[^’]{2,}’|《[^》]{2,}》|曰|云|说|所谓|古语|古人|名言|格言|诗|联|典|成语|佛经|孟子|庄子|孔子|史记|论语|天行有常|天道|荀子|韩非|莎士比亚|爱因斯坦|王尔德|林肯|苏轼|东坡|杨朴|王世贞|谚|俗话|名句|[一-龥]{2,8}(?:如此|如是|足矣|而已|不尽|莫测|不怪|不见|不畏|无愧|休矣|妙哉|羞羞))/;
const attributedPattern = /(曰|云|说|所谓|古语|古人|佛经|诗|联|典|成语|孟子|庄子|孔子|史记|论语|荀子|韩非|莎士比亚|爱因斯坦|王尔德|林肯|苏轼|东坡|杨朴|王世贞|曾子|荀子)/;

const rawEntries = [
  ["002.银纸包个臭皮蛋.txt", 13, 13, "再金玉其外，也不过是银纸包个臭皮蛋耳！", "妙语", "李敖比喻", "以外表华美反衬内容败坏。"],
  ["002.银纸包个臭皮蛋.txt", 13, 13, "行尸走肉", "成语", "成语", "形容失去精神生命。"],
  ["002.银纸包个臭皮蛋.txt", 11, 11, "来路甚怪、人马甚杂", "格言", "李敖概括", "概括组织来源和人员复杂。"],
  ["003.直线前进对，周而复始错.txt", 11, 11, "一段漫长、漫长的道路", "格言", "李敖转述", "以漫长道路比喻人生过程。"],
  ["003.直线前进对，周而复始错.txt", 11, 11, "人生每一段路仿佛都有终点，但在终点尽处，却是另一条路的起点。", "格言", "李敖概括", "说明人生阶段的终点也会成为新起点。"],
  ["003.直线前进对，周而复始错.txt", 11, 11, "山重水复疑无路", "诗文", "陆游诗句", "引陆游诗写困顿处境。"],
  ["003.直线前进对，周而复始错.txt", 11, 11, "柳暗花明又一村", "诗文", "陆游诗句", "引陆游诗写绝处逢生。"],
  ["003.直线前进对，周而复始错.txt", 11, 11, "终点就是起点", "格言", "李敖概括", "概括循环中的起点与终点关系。"],
  ["003.直线前进对，周而复始错.txt", 15, 15, "何处是归程，长亭更短亭", "诗文", "古典诗词句", "以归程与长亭写人生路途。"],
  ["003.直线前进对，周而复始错.txt", 1, 1, "直线前进对，周而复始错", "格言", "李敖语", "主张人生方向应持续向前而非原地循环。"],
  ["003.直线前进对，周而复始错.txt", 15, 15, "或者因为我认为还有若干不同的生活须待尝试，不能久过这一种生活。", "格言", "梭罗语", "说明不断尝试不同生活的理由。"],
  ["003.直线前进对，周而复始错.txt", 15, 15, "人生最后，必须有一种自我（不靠他人的）归宿，则是智慧的决定。", "格言", "李敖概括", "强调人生应有不依赖他人的自我归宿。"],
  ["004.来回带物法.txt", 7, 7, "最不以浮沉穷通待我的人", "格言", "李敖评价", "称赞朋友不因境遇变化而改变情谊。"],
  ["004.来回带物法.txt", 7, 7, "罗斯福说丘吉尔的主意每天有一百个，但只有一个是好的，但那个好主意，就可以打胜仗。", "格言", "罗斯福评丘吉尔", "说明多主意中一个好主意也足以取胜。"],
  ["004.来回带物法.txt", 7, 7, "发人所未发", "成语", "成语", "指提出前人未说出的见解。"],
  ["004.来回带物法.txt", 7, 7, "举重若轻", "成语", "成语", "形容处理大事从容不迫。"],
  ["004.来回带物法.txt", 9, 9, "来回带物法", "妙语", "李敖自创方法", "把走动时顺手带物归位称为方法。"],
  ["004.来回带物法.txt", 11, 11, "电鳗法", "妙语", "李敖戏称", "把使人发麻而就范的推销方式戏称为电鳗法。"],
  ["004.来回带物法.txt", 11, 11, "使人发麻而就范法也", "妙语", "李敖解释", "解释电鳗法的戏谑含义。"],
  ["004.来回带物法.txt", 13, 13, "看来没法子把它搬上车了。", "妙语", "汤玛斯·曼故事", "搬书故事中的误会前半句。"],
  ["004.来回带物法.txt", 13, 13, "搬上车？", "妙语", "汤玛斯·曼故事", "搬书故事中的反问。"],
  ["004.来回带物法.txt", 13, 13, "我是要搬下车呀！", "妙语", "汤玛斯·曼故事", "搬书故事中的反转。"],
  ["004.来回带物法.txt", 13, 13, "请名家帮忙，下场往往如此！", "格言", "李敖概括", "以故事提醒请名家帮忙可能误事。"],
  ["006.“惭愧公荣文王”.txt", 9, 9, "烧冷灶", "俗语", "俗语", "比喻提前投资尚未发达的人或事。"],
  ["006.“惭愧公荣文王”.txt", 11, 11, "近墨者黑", "成语", "成语", "比喻接近坏环境会受影响。"],
  ["006.“惭愧公荣文王”.txt", 11, 11, "惭愧公荣文王", "妙语", "李敖拟题", "用戏谑封号作警戒。"],
  ["009.与朋友交，其写信乎？.txt", 27, 27, "与朋友交，而不信乎？", "典故", "《论语》曾子语", "引曾子三省中的朋友交往之信。"],
  ["009.与朋友交，其写信乎？.txt", 27, 27, "而不写信了吗？", "妙语", "李敖歪解", "把信义之信戏解为写信。"],
  ["009.与朋友交，其写信乎？.txt", 27, 27, "三省吾身", "典故", "《论语》曾子语", "指每日多次反省自身。"],
  ["009.与朋友交，其写信乎？.txt", 33, 33, "不到黄河不死心", "俗语", "俗语", "形容执著到底。"],
  ["009.与朋友交，其写信乎？.txt", 33, 33, "到了黄河又如何", "妙语", "李敖化用", "反问执著到底后的意义。"],
  ["009.与朋友交，其写信乎？.txt", 33, 33, "为长者折枝，可为也；挟泰山以超北海，不可为也。", "典故", "《孟子》语", "以可为与不可为作区分。"],
  ["009.与朋友交，其写信乎？.txt", 33, 33, "不识时务", "成语", "成语", "形容不能认清现实形势。"],
  ["010.天行有常.txt", 1, 1, "天行有常", "典故", "《荀子·天论》", "天道运行有常规。"],
  ["010.天行有常.txt", 9, 9, "在没有听众的大厅中演奏，音乐会更好！", "格言", "韩德尔故事", "以无人听众仍照常演奏表现自我完成。"],
  ["010.天行有常.txt", 9, 9, "剧本非常成功，可是观众太糟了！", "妙语", "王尔德语", "用反讽回应观众喝倒彩。"],
  ["010.天行有常.txt", 11, 11, "天行有常，不为尧存，不为桀亡。", "典故", "《荀子·天论》", "说明天道不因贤愚而改变。"],
  ["010.天行有常.txt", 13, 13, "天不为人之恶寒也辍冬，地不为人之恶辽远也辍广，君子不为小人之匈匈也辍行。", "典故", "《荀子·天论》", "说明君子不因小人喧扰而停止行动。"],
  ["010.天行有常.txt", 13, 13, "天有常道矣，地有常数矣，君子有常体矣。", "典故", "《荀子·天论》", "天、地、君子各有恒常准则。"],
  ["010.天行有常.txt", 13, 13, "君子道其常，而小人计其功。", "典故", "《荀子·天论》", "君子守常道，小人计较功利。"],
  ["010.天行有常.txt", 13, 13, "礼义之不愆，何恤人之言兮？", "诗文", "古诗句", "只要合乎礼义，不必忧虑他人议论。"],
  ["010.天行有常.txt", 15, 15, "自己在道德上行为上站得住、没有错，又何必顾虑别人的议论、别人的七嘴八舌呢？", "格言", "李敖释义", "解释不必顾虑旁人议论的意思。"],
  ["010.天行有常.txt", 15, 15, "君子不因为小人的吵闹就改变自己的行动。", "格言", "李敖释义", "说明君子守常道。"],
  ["010.天行有常.txt", 17, 17, "小人之匈匈", "典故", "《荀子·天论》语", "指小人的喧扰。"],
  ["010.天行有常.txt", 17, 17, "小人计其功", "典故", "《荀子·天论》语", "指小人急于功利。"],
  ["010.天行有常.txt", 17, 17, "永丰有常", "妙语", "李敖化用", "把天行有常化用于林永丰。"],
  ["012.“财神爷”的悄悄话.txt", 7, 7, "只知其一，不知其二", "成语", "成语", "只知道一方面，不知道另一方面。"],
  ["012.“财神爷”的悄悄话.txt", 7, 7, "神龙活现", "成语", "成语", "形容说得活灵活现。"],
  ["012.“财神爷”的悄悄话.txt", 7, 7, "“充阔”比“装穷”好混得多了！", "格言", "李敖语", "以反讽方式写社会对财富表象的反应。"],
  ["012.“财神爷”的悄悄话.txt", 9, 9, "空头老倌", "俗语", "俗语", "指名义上有钱而实际周转不足。"],
  ["012.“财神爷”的悄悄话.txt", 11, 11, "一则以喜、一则以无奈", "格言", "李敖化用", "用古典句式写又喜又无奈。"],
  ["012.“财神爷”的悄悄话.txt", 15, 15, "只有自己站得起来，其他才有依附与意义、其他才不会破灭。", "格言", "李敖语", "强调自立是其他关系和意义的基础。"],
  ["012.“财神爷”的悄悄话.txt", 15, 15, "我不做持盈保泰的人，但也绝不做失败的人。", "格言", "李敖语", "表达不保守但也不接受失败的态度。"],
  ["014.“不提李敖之名”记趣.txt", 1, 1, "不提李敖之名", "妙语", "李敖拟题", "概括一种避名而谈的趣事。"],
  ["014.“不提李敖之名”记趣.txt", 13, 13, "不提李敖之名", "妙语", "李敖概括", "把避提姓名概括为一种封锁方式。"],
  ["014.“不提李敖之名”记趣.txt", 13, 13, "不愿提法", "妙语", "李敖分类", "把不提名分为不愿提的一类。"],
  ["014.“不提李敖之名”记趣.txt", 13, 13, "不敢提法", "妙语", "李敖分类", "把不提名分为不敢提的一类。"],
  ["014.“不提李敖之名”记趣.txt", 15, 15, "乃在法律尊严前所不能不忍受之精神虐待。", "妙语", "徐复观语", "以夸张语气称不得不写李敖之名。"],
  ["014.“不提李敖之名”记趣.txt", 23, 23, "违君之教，不敢以此书问世，仍盼痛加纠绳", "诗文", "俞大纲题赠", "题赠中承认李敖校阅之功。"],
  ["014.“不提李敖之名”记趣.txt", 23, 23, "高级知识分子的伪善与胆怯", "格言", "李敖概括", "批评知识分子避讳的心理。"],
  ["014.“不提李敖之名”记趣.txt", 31, 31, "高级知识分子的伪善与胆怯", "格言", "李敖概括", "再次概括避名行为的伪善与胆怯。"],
  ["014.“不提李敖之名”记趣.txt", 33, 33, "骨牌理论", "格言", "李敖比喻", "用骨牌效应比喻避名风气延续。"],
  ["014.“不提李敖之名”记趣.txt", 41, 41, "治病", "妙语", "李先闻自述引号", "与收尸并列，写赴美时生死未卜。"],
  ["014.“不提李敖之名”记趣.txt", 41, 41, "收尸", "妙语", "李先闻自述引号", "与治病并列，写赴美时生死未卜。"],
  ["014.“不提李敖之名”记趣.txt", 47, 47, "天无绝人之路", "成语", "成语", "指困境中仍有转机。"],
  ["014.“不提李敖之名”记趣.txt", 47, 47, "先闻，做人子的，一生只有两件大事。这是最后一件了。", "格言", "孙立人语", "以奔丧为做人子的重大责任。"],
  ["014.“不提李敖之名”记趣.txt", 47, 47, "北方人重义气，感人太深。", "格言", "李先闻自述", "称赞朋友重义气。"],
  ["014.“不提李敖之名”记趣.txt", 47, 47, "北方人见义勇为，拔“刀”相助", "格言", "李先闻自述", "以拔刀相助写朋友救急。"],
  ["014.“不提李敖之名”记趣.txt", 49, 49, "世道人心、学人风范", "格言", "李敖概括", "概括由不敢提名所见的世道人心。"],
  ["019.律师·正义·缩.txt", 9, 9, "自反而不缩", "典故", "《孟子》语", "反省自己而不理亏。"],
  ["019.律师·正义·缩.txt", 11, 11, "当年林肯做律师时候，每在发现委任人错了的时候，即拒绝为不合正义的“我方”辩护", "格言", "林肯故事", "以林肯拒为不义一方辩护说明律师正义。"],
  ["019.律师·正义·缩.txt", 11, 11, "林肯终能成为伟人，良有以也。", "格言", "李敖概括", "说明林肯成为伟人自有原因。"],
  ["020.从肚皮到头皮.txt", 11, 11, "都是文章。", "妙语", "苏轼故事", "苏轼侍儿答腹中都是文章。"],
  ["020.从肚皮到头皮.txt", 11, 11, "满腹都是机智。", "妙语", "苏轼故事", "苏轼侍儿答腹中都是机智。"],
  ["020.从肚皮到头皮.txt", 11, 11, "朝士一肚皮不合时宜。", "妙语", "朝云语", "朝云评苏轼不合时宜。"],
  ["020.从肚皮到头皮.txt", 11, 11, "人间祸福异路，光凭肚皮，即可知矣！", "妙语", "李敖引申", "从肚皮故事引申祸福异路。"],
  ["020.从肚皮到头皮.txt", 13, 13, "更休落魄贪杯酒，亦莫猖狂爱咏诗。今日捉将官里去，这回断送老头皮。", "诗文", "杨朴妻送别诗", "杨朴被征召时妻子所作送别诗。"],
  ["020.从肚皮到头皮.txt", 13, 13, "随着四婆裙子后，杖头挑去赛蚕官。", "诗文", "杨朴诗句", "杨朴诗句，陆游跋称四婆为杨朴妻。"],
  ["020.从肚皮到头皮.txt", 13, 13, "断送老头皮", "妙语", "杨朴妻诗", "由杨朴妻诗中化出的趣语。"],
  ["020.从肚皮到头皮.txt", 19, 19, "烈士暮年，壮心不已", "诗文", "曹操《龟虽寿》句", "以暮年壮心称赞继续写作。"],
  ["023.“良友渐随千劫尽”.txt", 1, 1, "良友渐随千劫尽", "诗文", "鲁迅诗句", "以诗句写老朋友渐散。"],
  ["023.“良友渐随千劫尽”.txt", 7, 7, "读圣贤书，所学何事", "典故", "古典责问语", "追问读书人的学问用途。"],
  ["023.“良友渐随千劫尽”.txt", 19, 19, "相忘于江湖", "典故", "《庄子》语", "指彼此忘怀于江湖之间。"],
  ["029.树敌与择友.txt", 1, 1, "树敌与择友", "格言", "李敖拟题", "以树敌反衬择友。"],
  ["029.树敌与择友.txt", 11, 11, "如果“朋友”是这样伪善、胆怯、骑墙、闪躲，这种朋友，也真可有可无了", "格言", "李敖语", "以树敌检验朋友是否可靠。"],
  ["029.树敌与择友.txt", 13, 13, "别人整天做公共关系讨好人，我却整天破坏公共关系批评人", "格言", "李敖语", "以自嘲方式写批评者姿态。"],
  ["029.树敌与择友.txt", 13, 13, "我的敌人不是一个个出现，而是一窝窝出现", "妙语", "李敖语", "夸张地写树敌之多。"],
  ["029.树敌与择友.txt", 17, 17, "世人都疏远了我，而仍在我身边的人，就是我真正的朋友。", "格言", "王尔德语", "以逆境中的相伴定义真正朋友。"],
  ["029.树敌与择友.txt", 17, 17, "我疏远了他们、他们仍挺身为真理而公然站在我身边的人，就是我真正的朋友。", "格言", "李敖改写", "比王尔德更严格地定义真正朋友。"],
  ["031.关于“记忆”的讨论.txt", 7, 7, "浮云一别后，流水二十年。", "诗文", "韦应物诗句", "以浮云流水写二十年离别。"],
  ["031.关于“记忆”的讨论.txt", 7, 7, "天涯若比邻", "诗文", "王勃诗句", "远隔天涯而像近邻。"],
  ["031.关于“记忆”的讨论.txt", 7, 7, "比邻若天涯", "妙语", "李敖反用", "反用天涯若比邻，写近邻如远隔天涯。"],
  ["031.关于“记忆”的讨论.txt", 17, 17, "黄鱼两吃", "俗语", "俗语", "比喻一物两用、两头取利。"],
  ["031.关于“记忆”的讨论.txt", 39, 39, "人生百岁", "格言", "陈椿书名", "以百岁人生作养生写作目标。"],
  ["031.关于“记忆”的讨论.txt", 39, 39, "人生百廿岁", "格言", "陈椿书名", "以一百二十岁人生作身教目标。"],
  ["031.关于“记忆”的讨论.txt", 73, 73, "记忆犹新", "成语", "成语", "形容过往仍记得清楚。"],
  ["031.关于“记忆”的讨论.txt", 71, 71, "占了便宜又卖乖", "俗语", "俗语", "形容得了好处还装作无辜。"],
  ["034.给李政一的一封信.txt", 13, 13, "晴空乱流（clear-air turbulence）", "妙语", "李敖比喻", "以晴空乱流比喻突然搅局。"],
  ["034.给李政一的一封信.txt", 15, 15, "愚人船", "典故", "文学艺术典故", "以愚人船指荒谬处境。"],
  ["034.给李政一的一封信.txt", 15, 15, "我思化人本无着，偶然此地遗其骸。愚夫奇货据灵躅，兴废乃到空山来。", "诗文", "《两当轩集》诗句", "引诗句写遗址兴废。"],
  ["034.给李政一的一封信.txt", 17, 17, "患难见真情", "成语", "成语", "患难中才能看出真情。"]
];

const proofreadRemoved = [
  { id: "LASHD-014", reason: "罗斯福评丘吉尔的现代政治人物/战争胜负语录，校对轮按政治人物语录删除。" },
  { id: "LASHD-030", reason: "俗语出自狱中来信与党外政治走向段落，校对轮删除。" },
  { id: "LASHD-031", reason: "李敖化用语直接服务党外处境与政治人物排挤语境，删除。" },
  { id: "LASHD-032", reason: "《孟子》语被置于党外政治争权段落中，校对轮删除。" },
  { id: "LASHD-033", reason: "成语直接用于党外政治处境判断，删除。" },
  { id: "LASHD-046", reason: "“永丰有常”为选举候选人姓名化用，落在助选倒戈语境中，校对轮删除。" },
  { id: "LASHD-054", reason: "题名即为封锁/避名现象，非独立诗文格言，删除。" },
  { id: "LASHD-055", reason: "短语用于概括封锁李敖的方式，校对轮删除。" },
  { id: "LASHD-056", reason: "分类短语服务避名/封锁现象说明，非独立格言，删除。" },
  { id: "LASHD-057", reason: "分类短语服务避名/封锁现象说明，非独立格言，删除。" },
  { id: "LASHD-058", reason: "徐复观语处在法律与避名争议中，按公共/司法语境删除。" },
  { id: "LASHD-059", reason: "题赠语被用于说明不敢提名和出版顾虑，校对轮删除。" },
  { id: "LASHD-060", reason: "概括句直接评价知识分子避讳李敖的胆怯，公共争议语境过强，删除。" },
  { id: "LASHD-061", reason: "与 LASHD-060 同文重复，仍落在避名和封锁语境中，删除。" },
  { id: "LASHD-062", reason: "“骨牌理论”直接比喻文星犯讳、被捕后避名延续，删除。" },
  { id: "LASHD-069", reason: "概括句总结孙立人被隐名的世道人心，政治人物避名语境过强，删除。" },
  { id: "LASHD-070", reason: "《孟子》语被用于律师诉讼对垒与诽谤官司，按司法语境删除。" },
  { id: "LASHD-071", reason: "林肯律师故事被用于具体诉讼攻防与律师伦理劝告，校对轮删除。" },
  { id: "LASHD-072", reason: "林肯伟人评价承接诉讼劝告，现代政治人物/司法语境过强，删除。" },
  { id: "LASHD-080", reason: "曹操诗句用于调查局冤案与司法灾难赞语，校对轮删除。" },
  { id: "LASHD-082", reason: "古典责问语直接劝诫官员面对狱政积弊，按官署/司法语境删除。" },
  { id: "LASHD-090", reason: "韦应物诗句所在句直接叙述警备总部、特务和政治性案子，删除。" },
  { id: "LASHD-091", reason: "王勃诗句紧接政治性案件与特务保人记忆，校对轮删除。" },
  { id: "LASHD-092", reason: "李敖反用语直接来自政治性案件后的人际疏离，删除。" },
  { id: "LASHD-098", reason: "“晴空乱流”直接比喻搅动蒋经国、国民党、党外与宪法语境，删除。" },
  { id: "LASHD-099", reason: "“愚人船”用于台湾政治处境比喻，校对轮删除。" },
  { id: "LASHD-100", reason: "《两当轩集》诗句被改用于小岛政治处境，删除。" },
  { id: "LASHD-101", reason: "普通成语紧接狱中字条与患难政治经历，独立引用价值弱，删除。" }
];

function ensureDirs() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

function readSourceFile(file) {
  return decoder.decode(fs.readFileSync(path.join(SOURCE_DIR, file)));
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
  return getLines(file).slice(start - 1, end).join("\n");
}

function getSourceFiles() {
  return fs.readdirSync(SOURCE_DIR)
    .filter((file) => file.endsWith(".txt"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
}

function buildRows() {
  return rawEntries.map(([file, lineStart, lineEnd, quote, category, origin, summary, notes = ""], index) => {
    const context = getContext(file, lineStart, lineEnd);
    if (!context.includes(quote) && !compactForMatch(context).includes(compactForMatch(quote))) {
      throw new Error(`Quote not found: ${file}:${lineStart}-${lineEnd} ${quote}`);
    }
    return {
      id: `${ID_PREFIX}-${String(index + 1).padStart(3, "0")}`,
      book: BOOK,
      chapter: path.basename(file, ".txt").replace(/^\d+\./, ""),
      source_file: file,
      line_start: lineStart,
      line_end: lineEnd,
      quote_text: quote,
      category,
      source_or_origin: origin,
      summary,
      notes
    };
  });
}

function writeCsv(rows) {
  const headers = ["id", "book", "chapter", "source_file", "line_start", "line_end", "quote_text", "category", "source_or_origin", "summary", "notes"];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
  fs.writeFileSync(CSV_PATH, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(rows) {
  const lines = [`《${BOOK}》诗文格言歌谣引用`, `校对后条目数：${rows.length}`, ""];
  for (const row of rows) {
    lines.push(`${row.id} ${row.quote_text}`);
    lines.push(`出处：${row.book} / ${row.chapter} / ${row.source_file}:${row.line_start}${row.line_end !== row.line_start ? `-${row.line_end}` : ""}`);
    lines.push(`类别：${row.category}`);
    lines.push(`来源：${row.source_or_origin}`);
    lines.push(`说明：${row.summary}`);
    if (row.notes) lines.push(`备注：${row.notes}`);
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
      if (isRisk) risk += 1;
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
  const payload = { book: BOOK, sourceDir: SOURCE_DIR, files: files.length, totalLines, totalCandidates, totalRisk, totalAttributed, byFile };
  fs.writeFileSync(CANDIDATE_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(REVIEW_PATH, `source_file\tline\tflag\ttext\n${reviewRows.map((row) => row.map(tsvEscape).join("\t")).join("\n")}\n`, "utf8");
  fs.writeFileSync(ATTRIBUTED_PATH, `source_file\tline\tflag\ttext\n${attributedRows.map((row) => row.map(tsvEscape).join("\t")).join("\n")}\n`, "utf8");
  return payload;
}

function writeAudit(rows) {
  const header = ["id", "source_file", "line_start", "line_end", "category", "risk", "quote_text"];
  const lines = [header.join("\t")];
  for (const row of rows) {
    lines.push([row.id, row.source_file, row.line_start, row.line_end, row.category, riskPattern.test(row.quote_text) ? "risk" : "", row.quote_text].map(tsvEscape).join("\t"));
  }
  fs.writeFileSync(AUDIT_PATH, `${lines.join("\n")}\n`, "utf8");
}

function getProofreadRemovedRows(rows) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const seen = new Set();
  return proofreadRemoved.map((item) => {
    if (seen.has(item.id)) throw new Error(`Duplicate proofread removal id: ${item.id}`);
    seen.add(item.id);
    const row = byId.get(item.id);
    if (!row) throw new Error(`Missing proofread removal id: ${item.id}`);
    return { ...row, proofread_reason: item.reason };
  });
}

function writeProofreadFiles(removedRows, outputRows) {
  const report = [
    `《${BOOK}》校对报告`,
    "",
    `首轮条目数：${removedRows.length + outputRows.length}`,
    `校对删除：${removedRows.length}`,
    `校对后条目数：${outputRows.length}`,
    "",
    "删除条目：",
    ...removedRows.map((row) => `- ${row.id}\t${row.source_file}:${row.line_start}\t${row.quote_text}\t${row.proofread_reason}`)
  ].join("\n");
  fs.writeFileSync(PROOFREAD_REPORT_PATH, `${report}\n`, "utf8");

  const headers = ["id", "book", "chapter", "source_file", "line_start", "line_end", "quote_text", "category", "source_or_origin", "summary", "proofread_reason"];
  const audit = [
    headers.join("\t"),
    ...removedRows.map((row) => headers.map((header) => tsvEscape(row[header])).join("\t"))
  ].join("\n");
  fs.writeFileSync(PROOFREAD_AUDIT_PATH, `${audit}\n`, "utf8");
}

function writeReport(rows, candidates, outputRows, removedRows) {
  const categoryCounts = outputRows.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + 1;
    return acc;
  }, {});
  const riskRows = outputRows.filter((row) => riskPattern.test(row.quote_text));
  const lines = [];
  lines.push(`《${BOOK}》首轮抽取与校对报告`);
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
  lines.push("校对后类别分布：");
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
  lines.push("- 本书政治、司法、新闻处、查禁与党外语境密集，首轮仅收可独立作为诗文、格言、成语、典故或妙语的文本。");
  lines.push("- 已跳过大量直接涉及党派、选举、司法、出版限制、政治案件、政治人物攻防的语录。");
  fs.writeFileSync(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
}

function main() {
  ensureDirs();
  const rows = buildRows();
  const removedRows = getProofreadRemovedRows(rows);
  const removedIds = new Set(removedRows.map((row) => row.id));
  const outputRows = rows.filter((row) => !removedIds.has(row.id));
  const candidates = collectCandidates();
  writeCsv(outputRows);
  writeTxt(outputRows);
  writeAudit(rows);
  writeProofreadFiles(removedRows, outputRows);
  writeReport(rows, candidates, outputRows, removedRows);
  console.log(`Wrote ${outputRows.length} rows for ${BOOK}`);
  console.log(`Proofread removed ${removedRows.length} rows`);
  console.log(CSV_PATH);
  console.log(TXT_PATH);
  console.log(REPORT_PATH);
  console.log(PROOFREAD_REPORT_PATH);
}

main();
