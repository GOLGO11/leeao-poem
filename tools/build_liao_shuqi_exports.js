const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const BOOK = "李敖书启集";
const ID_PREFIX = "LASHQ";
const GENERATED_DATE = "2026-06-23";
const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(ROOT, "《大李敖全集6.0》分章节", "008.书信函件类", "009.李敖书启集");
const EXPORT_DIR = path.join(ROOT, "exports");
const ANALYSIS_DIR = path.join(ROOT, "analysis");

const CSV_PATH = path.join(EXPORT_DIR, `${BOOK}_诗文格言歌谣引用.csv`);
const TXT_PATH = path.join(EXPORT_DIR, `${BOOK}_诗文格言歌谣引用.txt`);
const REPORT_PATH = path.join(ANALYSIS_DIR, "liao_shuqi_initial_report.txt");
const AUDIT_PATH = path.join(ANALYSIS_DIR, "liao_shuqi_initial_audit.tsv");
const CANDIDATE_PATH = path.join(ANALYSIS_DIR, "liao_shuqi_quote_candidates.json");
const REVIEW_PATH = path.join(ANALYSIS_DIR, "liao_shuqi_review_candidates.tsv");
const ATTRIBUTED_PATH = path.join(ANALYSIS_DIR, "liao_shuqi_attributed_lines.tsv");

const decoder = new TextDecoder("gb18030");

const riskPattern =
  /(政治|国会|总统|总裁|政府|市长|政党|国民党|共产党|民主|选举|外交|主权|人权|二二八|西藏|雷震案|雷震|司法|法院|军政|将军|民族国家|革命|党国|中共|马克思主义|集权政权|出版法|报禁|查禁|党外|警总|警备|陈文成|美丽岛|极权|立委|后援会|报刊|言论自由|冤狱|特务|役男|兵役|通匪|匪首|党派|蒋经国|蒋介石|戒严|李登辉|郝柏村|吴敦义|黄信介|民进党|新闻局|检察官|警察|法官|司法院|调查局|法务部)/;
const candidatePattern =
  /([“”‘’《》「」『』]|古人|古语|语云|所谓|成语|格言|诗|词|曰|说|孟子|孔子|论语|圣经|胡适|莎士比亚|伏尔泰|罗素|苏东坡|陶渊明|白居易|陆游|[一-龥]{2,10}(?:也|矣|乎|哉|耳|之|者))/;
const attributedPattern =
  /(古人|古语|语云|所谓|孟子|孔子|论语|圣经|胡适|莎士比亚|伏尔泰|罗素|苏东坡|陶渊明|白居易|陆游|金刚经|孔子家语|程颐|二程全书)/;

const rawEntries = [
  ["001.《北京法源寺》勘误.txt", 27, 27, "自己有错误人必知之", "古人格言", "孔子语意", "以有错必为人知来自警。"],
  ["001.《北京法源寺》勘误.txt", 29, 29, "身在庐山之中", "成语典故", "苏轼诗意", "比喻当局者反而难以看清全貌。"],
  ["001.《北京法源寺》勘误.txt", 55, 55, "既要古人说现代话（读者是现代人），又要尽量还古人之原", "写作格言", "李敖", "概括历史小说语言的两难。"],
  ["001.《北京法源寺》勘误.txt", 55, 55, "必要的矛盾", "写作妙语", "李敖", "把文学创作中的不协调称为必要矛盾。"],
  ["001.《北京法源寺》勘误.txt", 55, 55, "事实逼真，小说完蛋", "文学格言", "李敖", "说明小说不能被事实逼真完全束缚。"],
  ["001.《北京法源寺》勘误.txt", 55, 55, "改不胜改", "成语化用", "成语", "形容校改处多到难以尽改。"],
  ["004.《北京法源寺》再勘误.txt", 11, 11, "一切有为法，如梦幻泡影", "佛经引用", "《金刚经》", "校正佛经原句。"],
  ["004.《北京法源寺》再勘误.txt", 15, 15, "史诗式小说", "文学评语", "读者评语", "以史诗式概括小说气象。"],
  ["004.《北京法源寺》再勘误.txt", 51, 51, "随处结读者，诚意方殷，诸书现全身", "妙语", "李敖仿《金刚经》", "以仿经句答谢读者校勘。"],
  ["004.《北京法源寺》再勘误.txt", 51, 51, "著作之幸", "写作评语", "李敖", "称好读者护持乃著作之幸。"],
  ["003.怨结金兰.txt", 15, 15, "本来无事只畏扰", "妙语", "李敖", "化出本来无事的语意，写无谓纷扰。"],
  ["003.怨结金兰.txt", 49, 49, "费力不讨好", "俗语", "俗语", "形容辛苦却不受认可。"],
  ["003.怨结金兰.txt", 49, 49, "萧规曹随、无为而治", "典故成语", "历史典故", "以旧规相承和无为而治说明处理方式。"],
  ["003.怨结金兰.txt", 51, 51, "精打细算", "成语", "成语", "指仔细筹算钱物。"],
  ["003.怨结金兰.txt", 51, 51, "哭笑不得", "成语", "成语", "形容尴尬荒唐，笑也不是哭也不是。"],
  ["003.怨结金兰.txt", 55, 55, "天下宁有是理？", "古文句式", "李敖", "用反问强调事情不合情理。"],
  ["003.怨结金兰.txt", 57, 57, "同仇敌忾", "成语", "成语", "形容共同愤慨、协力对外。"],
  ["003.怨结金兰.txt", 59, 59, "疑心生暗鬼", "俗语", "俗语", "指疑心过重会无端生出猜忌。"],
  ["003.怨结金兰.txt", 59, 59, "不与人为善", "成语", "成语", "指不肯善意待人。"],
  ["003.怨结金兰.txt", 59, 59, "任劳任怨", "成语", "成语", "形容做事能吃苦也能承受怨责。"],
  ["003.怨结金兰.txt", 59, 59, "今古奇观", "成语", "成语", "形容罕见奇事。"],
  ["003.怨结金兰.txt", 61, 61, "求之不得", "成语", "成语", "指正合所求。"],
  ["003.怨结金兰.txt", 61, 61, "人间的一点起码的是非与正义", "处事格言", "李敖", "强调维护基本是非。"],
  ["005.再致金兰邻居.txt", 7, 7, "占了便宜还卖乖", "俗语", "俗语", "形容得了好处还装作无辜。"],
  ["005.再致金兰邻居.txt", 7, 7, "哑口无言", "成语", "成语", "形容无话可说。"],
  ["005.再致金兰邻居.txt", 7, 7, "自知理亏", "成语", "成语", "指自己知道理上站不住。"],
  ["005.再致金兰邻居.txt", 9, 9, "含沙射影", "成语", "成语", "比喻暗中影射攻击。"],
  ["005.再致金兰邻居.txt", 11, 11, "满口仁义道德", "俗语", "俗语", "讽刺空谈道德。"],
  ["005.再致金兰邻居.txt", 13, 13, "销声匿迹", "成语", "成语", "形容不再公开出现。"],
  ["005.再致金兰邻居.txt", 13, 13, "光明正大", "成语", "成语", "形容言行坦白正当。"],
  ["005.再致金兰邻居.txt", 23, 23, "打小算盘，量入而出，应系美德", "处事格言", "来信语", "把节俭筹算称作美德。"],
  ["005.再致金兰邻居.txt", 25, 25, "鱼目混珠", "成语", "成语", "比喻以假乱真、混淆视听。"],
  ["007.三致金兰邻居.txt", 5, 5, "悉听尊便", "成语", "成语", "表示任凭对方自便。"],
  ["007.三致金兰邻居.txt", 13, 13, "莫名其妙", "成语", "成语", "形容事情奇怪，无法理解。"],
  ["007.三致金兰邻居.txt", 19, 19, "理屈词穷", "成语", "成语", "形容理亏而无话可辩。"],
  ["007.三致金兰邻居.txt", 19, 19, "胡扯八扯", "俗语", "俗语", "形容乱说一通。"],
  ["007.三致金兰邻居.txt", 19, 19, "自己却先落入自己之网了", "妙语", "李敖", "以自设标准反困自身作比。"],
  ["007.三致金兰邻居.txt", 25, 25, "胡搅蛮缠", "成语", "成语", "形容无理纠缠。"],
  ["007.三致金兰邻居.txt", 35, 35, "用证据说话", "处事格言", "李敖", "强调以证据判断是非。"],
  ["007.三致金兰邻居.txt", 51, 51, "无知妄作", "成语", "成语", "形容无知而乱作为。"],
  ["007.三致金兰邻居.txt", 51, 51, "信口胡说", "俗语", "俗语", "形容随口乱说。"],
  ["007.三致金兰邻居.txt", 51, 51, "空口“测量”，只是说不负责任的大话而已", "处事格言", "李敖", "批评无凭空谈。"],
  ["007.三致金兰邻居.txt", 57, 57, "越俎代庖", "成语", "成语", "比喻越权代人处理事务。"],
  ["007.三致金兰邻居.txt", 57, 57, "少打主意吧", "俗语", "李敖", "劝人不要妄想算计。"],
  ["007.三致金兰邻居.txt", 63, 63, "冤大头", "俗语", "俗语", "指白白吃亏的人。"],
  ["007.三致金兰邻居.txt", 75, 75, "大惊小怪", "成语", "成语", "形容对平常事过分惊讶。"],
  ["007.三致金兰邻居.txt", 75, 75, "邻居难为", "妙语", "李敖", "概括做邻居之难。"],
  ["007.三致金兰邻居.txt", 77, 77, "正门不正门，不是名词之争，是事实展现", "处事格言", "李敖", "强调名实应由事实呈现。"],
  ["007.三致金兰邻居.txt", 77, 77, "正门正道", "妙语", "李敖", "以正门转出正道之意。"],
  ["009.卖掉汽车，改骑脚踏车了.txt", 5, 5, "当家方知柴米贵", "俗语", "俗语", "主持事务后才知开支艰难。"],
  ["009.卖掉汽车，改骑脚踏车了.txt", 9, 9, "天行有常", "古人格言", "《荀子》语", "指事情有其常理。"],
  ["009.卖掉汽车，改骑脚踏车了.txt", 9, 9, "事实总是事实，何能抹杀", "处事格言", "李敖", "强调事实不可抹去。"],
  ["009.卖掉汽车，改骑脚踏车了.txt", 9, 9, "天要下雨，娘要嫁人", "俗语", "俗语", "表示事情自有去向，难以阻拦。"],
  ["021.致萧启庆王国璎.txt", 5, 5, "一个忙字了得", "妙语", "李敖", "用一个忙字概括不回信的借口。"],
  ["021.致萧启庆王国璎.txt", 5, 5, "吞云雾、喝黄汤", "俗语", "俗语", "戏称抽烟喝酒。"],
  ["021.致萧启庆王国璎.txt", 9, 9, "郢书燕说", "典故成语", "典故", "比喻牵强附会、误解原意。"],
  ["021.致萧启庆王国璎.txt", 11, 11, "一蟹不如一蟹", "俗语", "俗语", "比喻一代不如一代。"],
  ["022.有子三书.txt", 5, 5, "前者一何迟，后者一何速", "妙语", "李敖", "以迟速对照结婚与生子。"],
  ["022.有子三书.txt", 11, 11, "人来哭", "育儿妙语", "李敖", "概括婴儿见人即哭的招数。"],
  ["022.有子三书.txt", 11, 11, "噪音战奇效非凡，连战奏捷", "妙语", "李敖", "戏称婴儿哭闹的效果。"],
  ["022.有子三书.txt", 17, 17, "一眠大一寸", "俗语", "台语俗语", "形容婴儿成长迅速。"],
  ["022.有子三书.txt", 17, 17, "日迈月征", "成语", "成语", "形容时日推进。"],
  ["022.有子三书.txt", 17, 17, "同步口追", "育儿妙语", "李敖", "形容婴儿嘴追手指的反射动作。"],
  ["022.有子三书.txt", 17, 17, "猫生幻化，所过者神", "妙语", "李敖", "借小猫成长比喻婴儿变化。"],
  ["022.有子三书.txt", 17, 17, "人生如猫，心同此理也", "人生妙语", "李敖", "由育儿观察转出人生感慨。"],
  ["022.有子三书.txt", 25, 25, "戡戡是个小河马", "儿歌", "李敖儿歌", "儿歌首句。"],
  ["022.有子三书.txt", 27, 27, "胖胖屁股一个“顶俩”", "儿歌", "李敖儿歌", "儿歌句。"],
  ["022.有子三书.txt", 29, 29, "吃起牛奶就装傻", "儿歌", "李敖儿歌", "儿歌句。"],
  ["022.有子三书.txt", 31, 31, "光着脑袋不理发", "儿歌", "李敖儿歌", "儿歌句。"],
  ["022.有子三书.txt", 33, 33, "不用上班不打卡", "儿歌", "李敖儿歌", "儿歌句。"],
  ["022.有子三书.txt", 35, 35, "一身肥肉把你压垮垮", "儿歌", "李敖儿歌", "儿歌末句。"],
  ["023.致陈又亮.txt", 7, 7, "重要原文不宜改，改了就不是作者原意了", "校勘格言", "李敖", "强调校改不能损害作者原意。"],
  ["023.致陈又亮.txt", 7, 7, "“执”的主词一定是手，无须写出", "文字评语", "李敖", "说明文字可省则省的语法判断。"],
  ["023.致陈又亮.txt", 11, 11, "认真与费心", "评语", "李敖", "称赞校对者的认真费心。"],
  ["025.致汤麟武.txt", 5, 5, "情见乎词", "成语", "成语", "指情意在文字中显现。"],
  ["025.致汤麟武.txt", 5, 5, "自己的书一定要在自己活的时候印出来", "写作格言", "李敖", "提醒作者不要把出书全托给后人。"],
  ["025.致汤麟武.txt", 7, 7, "一口气读完", "俗语", "俗语", "形容读书连续畅快。"],
  ["025.致汤麟武.txt", 15, 15, "沧海余生日", "诗句", "李敖和诗", "和诗句。"],
  ["025.致汤麟武.txt", 17, 17, "大隐如闭关", "诗句", "李敖和诗", "和诗句。"],
  ["025.致汤麟武.txt", 19, 19, "神游得旅顺", "诗句", "李敖和诗", "和诗句。"],
  ["025.致汤麟武.txt", 23, 23, "去国一何远", "诗句引用", "汤麟武原作", "原作佳句。"],
  ["025.致汤麟武.txt", 25, 25, "离人终不还", "诗句引用", "汤麟武原作", "原作佳句。"],
  ["025.致汤麟武.txt", 27, 27, "古今多少事", "诗句", "李敖和诗", "和诗句。"],
  ["025.致汤麟武.txt", 29, 29, "青史埋青山", "诗句", "李敖和诗", "和诗末句。"],
  ["025.致汤麟武.txt", 31, 31, "和人之诗却在第五、六句中抄先生原作，未免太“黄山谷”", "诗文妙语", "李敖", "自嘲和诗中直接袭用原句。"],
  ["025.致汤麟武.txt", 31, 31, "不得不抄也", "妙语", "李敖", "称佳句好到不得不抄。"],
  ["025.致汤麟武.txt", 33, 33, "我生平勤于为文，却懒得写信", "书信妙语", "李敖", "自述勤写文章而懒写信。"],
  ["025.致汤麟武.txt", 33, 33, "书翰颇稀", "书信妙语", "李敖", "概括自己少写书信。"],
  ["032.兔子腿买不买.txt", 7, 7, "一边气一边笑", "妙语", "李敖", "形容读信后的矛盾反应。"],
  ["032.兔子腿买不买.txt", 19, 19, "大笔一挥", "成语", "成语", "形容爽快挥笔处理。"],
  ["032.兔子腿买不买.txt", 33, 33, "一天他突然偷走好多步——原来会走，却佯装不会也", "育儿妙语", "李敖", "写幼儿学走路的突然变化。"],
  ["032.兔子腿买不买.txt", 35, 35, "其蛮横有如此者", "古文句式", "李敖", "以古文句式写幼儿任性。"],
  ["033.对何炳棣先生“认真的讨论”的讨论.txt", 5, 5, "倾盖而语终日，甚相亲", "古文引用", "《孔子家语》", "以古书语写初见畅谈。"],
  ["033.对何炳棣先生“认真的讨论”的讨论.txt", 5, 5, "一见如故", "成语", "成语", "形容初见便像故交。"],
  ["033.对何炳棣先生“认真的讨论”的讨论.txt", 11, 11, "索然寡味", "成语", "成语", "形容缺少趣味。"],
  ["033.对何炳棣先生“认真的讨论”的讨论.txt", 11, 11, "史料存真、求真，真是谈何容易", "史学格言", "李敖", "感叹史料求真不易。"],
  ["033.对何炳棣先生“认真的讨论”的讨论.txt", 17, 17, "渊博之累", "妙语", "李敖", "指知识太多反而可能受误导。"],
  ["033.对何炳棣先生“认真的讨论”的讨论.txt", 41, 41, "体大思精", "成语", "成语", "形容著作规模宏大而思考精密。"],
  ["033.对何炳棣先生“认真的讨论”的讨论.txt", 41, 41, "灰头土脸", "成语", "成语", "形容相形见绌、狼狈失色。"],
  ["033.对何炳棣先生“认真的讨论”的讨论.txt", 43, 43, "饿死事极小，失节事极大", "古人格言", "程颐语", "校正程颐原语。"],
  ["033.对何炳棣先生“认真的讨论”的讨论.txt", 45, 45, "化成涓滴，混入尊作长江大河", "文艺妙语", "李敖", "谦称自己的补充如涓滴入长河。"],
  ["034.从“冷淡”到“偷笑”.txt", 5, 5, "笑是一种友善、一种适度的“知道了”、一种“垂怜”", "处世格言", "李敖", "分析笑的社交含义。"],
  ["034.从“冷淡”到“偷笑”.txt", 5, 5, "量笑而为", "妙语", "李敖", "把笑也分寸化。"],
  ["034.从“冷淡”到“偷笑”.txt", 5, 5, "夫子莞尔而笑", "古文引用", "《论语》", "引用孔子莞尔而笑。"],
  ["034.从“冷淡”到“偷笑”.txt", 5, 5, "渔父莞尔而笑", "古文引用", "《楚辞》", "引用渔父莞尔而笑。"],
  ["034.从“冷淡”到“偷笑”.txt", 7, 7, "人是那么浑，交朋友太累了", "处世格言", "李敖", "写交友的疲惫感。"],
  ["034.从“冷淡”到“偷笑”.txt", 9, 9, "不近人情", "成语", "成语", "形容不合人情。"],
  ["034.从“冷淡”到“偷笑”.txt", 9, 9, "自知之明", "成语", "成语", "指能认识自身。"],
  ["034.从“冷淡”到“偷笑”.txt", 9, 9, "拒人于咫尺之外", "成语化用", "李敖", "化用拒人千里之外，写带笑的疏离。"],
  ["034.从“冷淡”到“偷笑”.txt", 11, 11, "不言之教", "古人格言", "道家语", "指不靠言说的教化。"],
  ["034.从“冷淡”到“偷笑”.txt", 11, 11, "以不教教之", "妙语", "李敖", "以不教作为另一种教法。"],
  ["034.从“冷淡”到“偷笑”.txt", 11, 11, "冷淡其实是一种法门", "处世格言", "李敖", "把冷淡解释为一种教法。"],
  ["034.从“冷淡”到“偷笑”.txt", 11, 11, "“偷笑”保证必真真的", "妙语", "李敖", "称偷笑比礼貌笑更真。"],
  ["035.嘱苦苓老弟.txt", 9, 9, "优患余生，余生以后，却倦于回首优患", "人生格言", "李敖", "写经历苦难后反而不愿回顾苦难。"],
  ["035.嘱苦苓老弟.txt", 11, 11, "写完整的“大书”", "写作格言", "李敖", "劝人把精力转向完整大书。"],
  ["035.嘱苦苓老弟.txt", 11, 11, "争千秋不争一时", "写作格言", "李敖", "主张写作应争长远价值。"],
  ["035.嘱苦苓老弟.txt", 11, 11, "是所至嘱", "书信套语", "古文套语", "表示郑重嘱咐。"],
  ["037.致AB座邻居.txt", 9, 9, "任劳、任怨、花钱、挨告", "处世妙语", "李敖", "概括义务做事的代价。"],
  ["037.致AB座邻居.txt", 29, 29, "金玉其外，败絮其中", "成语", "成语", "比喻外表好而内部坏。"],
  ["037.致AB座邻居.txt", 31, 31, "见仁见智", "成语", "成语", "指各人见解不同。"],
  ["042.致石守谦的一封信.txt", 9, 9, "稀世之珍", "成语", "成语", "形容极稀有珍贵的东西。"],
  ["042.致石守谦的一封信.txt", 11, 11, "以学术以外的顾忌自遮其眼", "学术格言", "李敖", "批评非学术顾忌遮蔽学术眼光。"],
  ["042.致石守谦的一封信.txt", 11, 11, "儒林内史", "妙语", "李敖化用", "化用《儒林外史》以讽学界内情。"],
  ["042.致石守谦的一封信.txt", 15, 15, "这一件足够您看了", "鉴藏妙语", "李敖", "以一件珍品足够一观写藏品分量。"],
  ["042.致石守谦的一封信.txt", 15, 15, "真的在北京吃不到", "妙语", "刘九庵语", "以饮食回应地方经验。"],
  ["044.给周荃.txt", 9, 9, "争一时", "妙语", "李敖", "指争取眼前场面。"],
  ["044.给周荃.txt", 9, 9, "争千秋", "妙语", "李敖", "指争取长远价值。"],
  ["044.给周荃.txt", 9, 9, "走向世界、未来与永恒", "人生格言", "李敖", "表达摆脱眼前事务、转向长远目标。"],
  ["044.给周荃.txt", 9, 9, "游戏人间", "成语", "成语", "指以游戏态度处世。"],
  ["044.给周荃.txt", 9, 9, "不务正业", "成语", "成语", "指不做正当本业。"],
  ["044.给周荃.txt", 11, 11, "以报知己", "古文套语", "古文套语", "表示报答知己之意。"],
];

function ensureDirs() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

function readSourceFile(file) {
  return decoder.decode(fs.readFileSync(path.join(SOURCE_DIR, file)));
}

function normalizeText(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd();
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
  const seenQuotes = new Set();
  return rawEntries.map(([file, lineStart, lineEnd, quote, category, origin, summary, notes = ""], index) => {
    const context = getContext(file, lineStart, lineEnd);
    if (!context.includes(quote) && !compactForMatch(context).includes(compactForMatch(quote))) {
      throw new Error(`Quote not found: ${file}:${lineStart}-${lineEnd} ${quote}`);
    }
    const duplicateKey = `${file}\t${lineStart}\t${quote}`;
    if (seenQuotes.has(duplicateKey)) throw new Error(`Duplicate raw entry: ${duplicateKey}`);
    seenQuotes.add(duplicateKey);
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
  const lines = [`《${BOOK}》诗文格言歌谣引用`, `首轮条目数：${rows.length}`, ""];
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
  const headers = ["id", "source_file", "line_start", "line_end", "category", "risk_in_quote", "quote_text"];
  const lines = [headers.join("\t")];
  for (const row of rows) {
    lines.push([
      row.id,
      row.source_file,
      row.line_start,
      row.line_end,
      row.category,
      riskPattern.test(row.quote_text) ? "risk" : "",
      row.quote_text,
    ].map(tsvEscape).join("\t"));
  }
  fs.writeFileSync(AUDIT_PATH, `${lines.join("\n")}\n`, "utf8");
}

function writeReport(rows, candidates) {
  const categoryCounts = rows.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + 1;
    return acc;
  }, {});
  const riskRows = rows.filter((row) => riskPattern.test(row.quote_text));
  const lines = [];
  lines.push(`《${BOOK}》首轮抽取报告`);
  lines.push("");
  lines.push(`生成日期：${GENERATED_DATE}`);
  lines.push(`源目录：${SOURCE_DIR}`);
  lines.push(`源文件数：${candidates.files}`);
  lines.push(`源总行数：${candidates.totalLines}`);
  lines.push(`候选行数：${candidates.totalCandidates}`);
  lines.push(`风险词行数：${candidates.totalRisk}`);
  lines.push(`带归属提示行数：${candidates.totalAttributed}`);
  lines.push("");
  lines.push(`首轮收录条目：${rows.length}`);
  lines.push(`CSV：${CSV_PATH}`);
  lines.push(`TXT：${TXT_PATH}`);
  lines.push(`审计：${AUDIT_PATH}`);
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
  lines.push("首轮取舍说明：");
  lines.push("- 跳过市长、法务、调查、司法院、党派、报刊、公开政治人物攻防和律师函等政治/司法语境。");
  lines.push("- 邻里争议章节只保留可脱离具体纠纷的成语、俗语、处事格言。");
  lines.push("- 保留文学校勘、写作、儿歌、学术讨论、鉴藏和处世自述中可独立成立的诗文格言。");
  fs.writeFileSync(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
}

function main() {
  ensureDirs();
  const rows = buildRows();
  const ids = new Set();
  for (const row of rows) {
    if (ids.has(row.id)) throw new Error(`Duplicate id: ${row.id}`);
    ids.add(row.id);
  }
  const candidates = collectCandidates();
  writeCsv(rows);
  writeTxt(rows);
  writeAudit(rows);
  writeReport(rows, candidates);
  console.log(`Wrote ${rows.length} rows for ${BOOK}`);
  console.log(CSV_PATH);
  console.log(TXT_PATH);
  console.log(REPORT_PATH);
}

main();
