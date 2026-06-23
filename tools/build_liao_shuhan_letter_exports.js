const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const BOOK = "李敖书函集";
const ID_PREFIX = "LASHF";
const GENERATED_DATE = "2026-06-22";
const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(ROOT, "《大李敖全集6.0》分章节", "008.书信函件类", "008.李敖书函集");
const EXPORT_DIR = path.join(ROOT, "exports");
const ANALYSIS_DIR = path.join(ROOT, "analysis");

const CSV_PATH = path.join(EXPORT_DIR, `${BOOK}_诗文格言歌谣引用.csv`);
const TXT_PATH = path.join(EXPORT_DIR, `${BOOK}_诗文格言歌谣引用.txt`);
const REPORT_PATH = path.join(ANALYSIS_DIR, "liao_shuhan_letter_initial_report.txt");
const AUDIT_PATH = path.join(ANALYSIS_DIR, "liao_shuhan_letter_initial_audit.tsv");
const CANDIDATE_PATH = path.join(ANALYSIS_DIR, "liao_shuhan_letter_quote_candidates.json");
const REVIEW_PATH = path.join(ANALYSIS_DIR, "liao_shuhan_letter_review_candidates.tsv");
const ATTRIBUTED_PATH = path.join(ANALYSIS_DIR, "liao_shuhan_letter_attributed_lines.tsv");
const PROOFREAD_REPORT_PATH = path.join(ANALYSIS_DIR, "liao_shuhan_letter_proofread_report.txt");
const PROOFREAD_AUDIT_PATH = path.join(ANALYSIS_DIR, "liao_shuhan_letter_proofread_audit.tsv");

const decoder = new TextDecoder("gb18030");

const riskPattern =
  /(政治|国会|总统|总裁|政府|市长|政党|国民党|共产党|民主|选举|外交|主权|人权|二二八|西藏|雷震案|雷震|司法|法院|军政|将军|民族国家|革命|党国|中共|马克思主义|集权政权|出版法|报禁|查禁|党外|警总|警备|陈文成|美丽岛|极权|立委|后援会|报刊|言论自由|冤狱|特务|役男|兵役|通匪|匪首|党派|蒋经国|蒋介石|戒严|李登辉|郝柏村|吴敦义|黄信介|民进党|新闻局|检察官|警察)/;
const candidatePattern =
  /([“”‘’《》「」『』]|古人|古语|语云|所谓|成语|格言|诗|词|曰|说|孟子|孔子|论语|圣经|托尔斯泰|萧伯纳|苏东坡|尚福|诸葛亮|陶渊明|白居易|陆游|堂吉诃德|Don Quixote|[一-龥]{2,10}(?:也|矣|乎|哉|耳|之|者))/;
const attributedPattern =
  /(古人|古语|语云|所谓|孟子|孔子|论语|圣经|托尔斯泰|萧伯纳|苏东坡|尚福|诸葛亮|陶渊明|白居易|陆游|Rockwell|Don Quixote|堂吉诃德)/;

const rawEntries = [
  ["007.再致施性忠老哥.txt", 11, 11, "知耻近乎勇", "古人格言", "古语", "以知耻与勇于认错相连。"],
  ["008.三致施性忠老哥.txt", 7, 7, "我对书有耐心，对人无耐心", "读书格言", "李敖自述", "以反差写自己耐书而不耐人的性情。"],
  ["008.三致施性忠老哥.txt", 7, 7, "书房里的战士", "妙语", "李敖自况", "以书房为战场，概括写作者的战斗位置。"],
  ["008.三致施性忠老哥.txt", 7, 7, "许多书的成功，乃在作者与群众之间有互相吻合的庸俗想法", "西方格言", "尚福", "用尚福语说明通俗成功与平庸共鸣的关系。"],
  ["008.三致施性忠老哥.txt", 7, 7, "独行其道", "成语", "成语", "形容坚持己路，不随俗媚世。"],
  ["008.三致施性忠老哥.txt", 7, 7, "不合时宜", "成语", "成语", "形容思想作风与流俗不合。"],
  ["008.三致施性忠老哥.txt", 7, 7, "苏东坡一肚皮不合时宜", "典故妙语", "苏东坡典故", "借苏东坡典故写不合流俗。"],
  ["008.三致施性忠老哥.txt", 7, 7, "不但所生非地（非台湾人），且亦非时（非古人）也", "妙语", "李敖化用", "以所生非地、非时自嘲不合环境。"],
  ["009.关于“直笔”的讨论.txt", 7, 7, "当时意气论交人", "诗文引用", "古典诗句", "以旧诗句追忆昔年交情与意气。"],
  ["009.关于“直笔”的讨论.txt", 7, 7, "含糊其辞", "成语", "成语", "形容说法不明不直。"],
  ["009.关于“直笔”的讨论.txt", 7, 7, "随心所欲", "成语", "成语", "指不受拘束地照己意行事。"],
  ["009.关于“直笔”的讨论.txt", 21, 21, "因小失大", "成语", "成语", "以小处顾忌损害大处价值。"],
  ["009.关于“直笔”的讨论.txt", 21, 21, "举世无两", "成语", "成语", "形容独一无二、无人能及。"],
  ["009.关于“直笔”的讨论.txt", 21, 21, "爱真理甚于爱老师", "格言", "李敖改写", "强调尊重真理高于私人师承。"],
  ["009.关于“直笔”的讨论.txt", 27, 27, "百尺竿头更进一步", "成语典故", "佛家语", "勉励在既有成就上继续推进。"],
  ["011.从小事看认真.txt", 3, 3, "执事敬", "古人格言", "古语", "以敬事作为做人的基本美德。"],
  ["011.从小事看认真.txt", 3, 3, "做事不论大小，都不马虎、都不含糊、都勇于负责", "处世格言", "李敖阐释", "说明认真负责的做事态度。"],
  ["011.从小事看认真.txt", 3, 3, "小题大做", "成语", "成语", "把小事认真处理到足以示范的程度。"],
  ["011.从小事看认真.txt", 29, 29, "做人要讲究诚信原则，做邻居亦如此", "处世格言", "李敖", "把诚信原则推广到邻里事务。"],
  ["011.从小事看认真.txt", 31, 31, "长痛不如短痛", "俗语", "俗语", "说明及时处理积弊胜过长期拖延。"],
  ["011.从小事看认真.txt", 31, 31, "要喝牛奶，去买牛奶就好了，何必养母牛？", "俗语妙喻", "李敖引用俗喻", "用牛奶与母牛比喻直接解决问题。"],
  ["011.从小事看认真.txt", 31, 31, "出尔反尔", "成语", "成语", "形容反复无常、前后不一。"],
  ["011.从小事看认真.txt", 41, 41, "叠床架屋", "成语", "成语", "比喻重复设置、徒增冗赘。"],
  ["011.从小事看认真.txt", 41, 41, "滑天下大稽", "成语", "成语", "形容荒唐可笑到极点。"],
  ["011.从小事看认真.txt", 51, 51, "于心何忍，百思不解", "成语化用", "成语组合", "把不忍与不解合成质问语气。"],
  ["011.从小事看认真.txt", 53, 53, "快刀斩乱麻", "成语", "成语", "比喻以果断办法处理复杂难题。"],
  ["011.从小事看认真.txt", 53, 53, "有主意胜于没主意", "处事格言", "李敖", "强调现实困境中有方案比空谈更重要。"],
  ["011.从小事看认真.txt", 53, 53, "巧妇为无米之炊", "成语", "成语", "比喻缺少条件而难以完成事情。"],
  ["011.从小事看认真.txt", 55, 55, "没办法中的办法", "俗语", "李敖概括", "指困境中仍能实行的折中办法。"],
  ["011.从小事看认真.txt", 55, 55, "强人所难", "成语", "成语", "指勉强别人做难以做到的事。"],
  ["011.从小事看认真.txt", 55, 55, "壮士断臂", "成语", "成语", "比喻以痛苦取舍换取整体改善。"],
  ["011.从小事看认真.txt", 55, 55, "亡羊补牢", "成语", "成语", "比喻出事后及时补救。"],
  ["011.从小事看认真.txt", 55, 55, "我个人可以任劳，但是绝不任怨", "处世格言", "李敖", "区分愿意承担劳苦与不愿背负怨责。"],
  ["011.从小事看认真.txt", 55, 55, "是坐看大厦云起，还是卧任大厦灰灭？", "妙语", "李敖", "用对偶问句逼出行动选择。"],
  ["011.从小事看认真.txt", 77, 77, "大丈夫该为自己无端惹起这一问题自责", "处世格言", "李敖", "主张有担当者应先自责。"],
  ["011.从小事看认真.txt", 83, 83, "敷衍了事", "成语", "成语", "形容不负责地应付过去。"],
  ["011.从小事看认真.txt", 83, 83, "开源节流", "成语", "成语", "指增加收入并节省开支。"],
  ["011.从小事看认真.txt", 97, 97, "坐享其成", "成语", "成语", "指不出力而享受成果。"],
  ["012.复李声庭.txt", 5, 5, "今之古人", "妙语", "李敖戏称", "戏称对方把自己当作当代古人。"],
  ["012.复李声庭.txt", 7, 7, "今之古书", "书名妙语", "李声庭书名", "以书名形成当代与古书的反差。"],
  ["012.复李声庭.txt", 7, 7, "日久湮没", "成语", "成语", "形容作品久而不彰、渐被埋没。"],
  ["012.复李声庭.txt", 7, 7, "书籍的品质堕落至此，真是太可悲了。", "读书格言", "李敖", "感叹书籍品质下滑。"],
  ["012.复李声庭.txt", 9, 9, "百尺竿头", "成语典故", "佛家语", "指在已有基础上更进一步。"],
  ["012.复李声庭.txt", 9, 9, "先知先觉", "成语", "成语", "形容觉悟较早的人。"],
  ["013.复李杰四弟.txt", 5, 5, "四十年隔世", "妙语", "李敖", "写久别重逢如隔一世。"],
  ["013.复李杰四弟.txt", 7, 7, "但愿人长久", "诗词引用", "苏轼词句", "以苏轼词句寄托亲人长久的愿望。"],
  ["013.复李杰四弟.txt", 9, 9, "由绚烂归于平淡", "成语化用", "审美旧语", "形容人生历经波澜后趋于平淡。"],
  ["013.复李杰四弟.txt", 9, 9, "勇士心路历程", "人物评语", "李敖", "概括一生艰险与精神历程。"],
  ["013.复李杰四弟.txt", 9, 9, "毫无忌讳，细腻而坦白", "写作格言", "李敖", "提出自传写作应有的坦率与细密。"],
  ["014.复六叔.txt", 5, 5, "四十年隔世", "妙语", "李敖", "再次以隔世写久别后的重连。"],
  ["014.复六叔.txt", 7, 7, "所有血泪据实写出，都是感人的史诗", "写作格言", "李敖", "强调真实苦难的叙写本身具有史诗性。"],
  ["014.复六叔.txt", 9, 9, "所有家庭幸福皆同但不幸各异", "西方格言", "托尔斯泰", "转述托尔斯泰关于家庭幸福与不幸的名句。"],
  ["014.复六叔.txt", 9, 9, "欲说还休", "成语", "成语", "形容想说又有所顾忌。"],
  ["014.复六叔.txt", 9, 9, "风云际合，偶成交汇，然后各自东西", "人生格言", "李敖", "写乱世人事偶然交会又各自分散。"],
  ["014.复六叔.txt", 11, 11, "成为新时代的《战争与和平》", "文学评语", "李敖", "以世界文学名著比喻自传题材的气魄。"],
  ["014.复六叔.txt", 13, 13, "苦难是最动人的记录，它们是血泪换来的", "写作格言", "李敖", "强调苦难记录的动人力量与代价。"],
  ["014.复六叔.txt", 13, 13, "垂之久远，以张正义、以为存真", "文史格言", "李敖", "主张保存苦难记录以伸张正义、保存真实。"],
  ["014.复六叔.txt", 13, 13, "活得窝囊，死得雄奇", "人生格言", "李敖", "以强烈对比写生命结局的精神姿态。"],
  ["017.《乌鸦评论》及其他.txt", 97, 97, "一脚踢", "俗语", "俗语", "形容一人包办全部事务。"],
  ["017.《乌鸦评论》及其他.txt", 97, 97, "山水有清音", "诗文引用", "左思诗意", "以清音意象写精神追求。"],
  ["017.《乌鸦评论》及其他.txt", 97, 97, "浊世有清音", "诗文化用", "李敖化用", "把清音意象移入浊世语境。"],
  ["017.《乌鸦评论》及其他.txt", 97, 97, "成败利钝、非个人之明所能逆睹", "古人格言", "诸葛亮语", "以诸葛亮语说明成败不能完全预见。"],
  ["017.《乌鸦评论》及其他.txt", 97, 97, "鞠躬尽瘁，死而后已", "古人格言", "诸葛亮语", "表示尽力到底的精神。"],
  ["018.给邻居的一封信.txt", 9, 9, "既在其位，应谋其政", "古人格言", "古语", "在其位就应尽其责。"],
  ["018.给邻居的一封信.txt", 9, 9, "尽责以除积弊", "处事格言", "李敖", "概括承担责任、清除积弊的做法。"],
  ["018.给邻居的一封信.txt", 11, 11, "以免认起真来，与邻居伤和气", "处世妙语", "李敖", "说明认真做事也可能损及人情。"],
  ["018.给邻居的一封信.txt", 43, 43, "人间公道，义无此理", "成语化用", "李敖", "用反诘语气表达不合公道。"],
  ["018.给邻居的一封信.txt", 55, 55, "独行其是", "成语", "成语", "指按照自己的判断独自行动。"],
  ["018.给邻居的一封信.txt", 61, 61, "皆大欢喜", "成语", "成语", "形容事情以各方满意收场。"],
  ["018.给邻居的一封信.txt", 61, 61, "做事，不论大小，一律认真以赴", "处事格言", "李敖", "概括大小事都认真处理的态度。"],
  ["026.花老犹见燕归迟.txt", 5, 5, "风片片，雨丝丝，一日相望十二时，奚事春来人不至，花前又见燕归迟", "词句引用", "董彦堂小词", "保存董彦堂为李敖所写小词。"],
  ["026.花老犹见燕归迟.txt", 7, 7, "人间奇遇，我恰为证人耳", "妙语", "李敖", "以见证人自况两代书法佳话。"],
  ["026.花老犹见燕归迟.txt", 9, 9, "闻道是子不如父，则父子两人必有一人出了毛病。", "西方妙语", "小罗克韦尔", "以幽默方式谈父子成就关系。"],
  ["026.花老犹见燕归迟.txt", 9, 9, "我一生狂热工作，就是要证明我父亲没有毛病。", "西方妙语", "小罗克韦尔", "以工作证明父亲价值的反讽式名言。"],
  ["026.花老犹见燕归迟.txt", 13, 13, "两代墨迹同一词", "诗句", "李敖诗", "李敖赠诗第一句。"],
  ["026.花老犹见燕归迟.txt", 15, 15, "雨丝风片亦堪拾", "诗句", "李敖诗", "李敖赠诗第二句。"],
  ["026.花老犹见燕归迟.txt", 17, 17, "四十年来花已老", "诗句", "李敖诗", "李敖赠诗第三句。"],
  ["026.花老犹见燕归迟.txt", 19, 19, "花老犹见燕归迟", "诗句", "李敖诗", "李敖赠诗末句，也是篇名。"],
  ["031.中央研究院史语所岂可掩护李济、许倬云！.txt", 35, 35, "斯文在兹", "典故成语", "古语", "用斯文在兹指学术机关应有文教气象。"],
  ["031.中央研究院史语所岂可掩护李济、许倬云！.txt", 67, 67, "黄鱼两吃", "俗语", "俗语", "比喻同一东西两头取利。"],
  ["034.“碧云应继魏忠贤”.txt", 17, 17, "旧学得新知增益，为之一快", "读书格言", "李敖", "写旧有学问因新材料而增益的快乐。"],
  ["038.答胡虚一老兄书.txt", 7, 7, "韩信用兵，多多益善", "典故成语", "韩信典故", "借韩信用兵比喻来稿不限字数。"],
  ["038.答胡虚一老兄书.txt", 7, 7, "不可同日而语", "成语", "成语", "形容前后情况差别很大。"],
  ["038.答胡虚一老兄书.txt", 7, 7, "三十年河东，三十年河西，风水轮流转，世俗人情跟着变", "俗语", "俗语", "写时移势变与人情变化。"],
  ["038.答胡虚一老兄书.txt", 11, 11, "有友如此者，亦云鲜矣", "古文句式", "李敖化用", "以古文句式感叹如此朋友少见。"],
  ["038.答胡虚一老兄书.txt", 11, 11, "只要你们待我有李敖一半好，我就弃暗投明啦！", "妙语", "李敖戏言", "用玩笑表达朋友照顾之苦心。"],
  ["038.答胡虚一老兄书.txt", 13, 13, "宁繁毋略，以存史料", "写作格言", "李敖", "主张个人经历记录宁详勿略。"],
  ["038.答胡虚一老兄书.txt", 13, 13, "拒之老兄心痛，受之小弟头痛", "妙语", "李敖", "以对偶写稿件取舍两难。"],
  ["038.答胡虚一老兄书.txt", 15, 15, "闲云野鹤", "成语", "成语", "形容悠闲自在、不受拘束。"],
  ["038.答胡虚一老兄书.txt", 15, 15, "贤者之累", "成语化用", "古语化用", "指贤者也有被俗事牵累之处。"],
  ["038.答胡虚一老兄书.txt", 17, 17, "待人不薄，待朋友尤厚", "处世格言", "李敖", "概括自己待人待友的标准。"],
  ["038.答胡虚一老兄书.txt", 17, 17, "做人亦大难、做胡老师之友亦大难", "妙语", "李敖", "用并列句写交友处世之难。"],
  ["038.答胡虚一老兄书.txt", 19, 19, "交友下场如此，亦足为忧患人生，增一见识", "人生格言", "李敖", "把交友挫折视作人生见识。"],
  ["038.答胡虚一老兄书.txt", 31, 31, "闻过则喜", "成语典故", "古人教言", "听到批评便高兴，表示乐于受教。"],
  ["038.答胡虚一老兄书.txt", 33, 33, "少小离家老大回", "诗句引用", "贺知章诗句", "以唐诗写久别还乡。"],
  ["038.答胡虚一老兄书.txt", 33, 33, "打肿脸充胖子", "俗语", "俗语", "形容勉强摆阔或虚撑门面。"],
  ["038.答胡虚一老兄书.txt", 37, 37, "礼轻仁义重", "俗语", "俗语", "礼物虽薄，情义很重。"],
  ["038.答胡虚一老兄书.txt", 37, 37, "千里送鹅毛", "俗语典故", "俗语", "以薄礼寄托厚意。"],
  ["044.讨论《北京法源寺》.txt", 25, 25, "以笑哈哈的敦厚，作凶巴巴的战斗", "妙语", "郭启元语", "以笑与凶、敦厚与战斗形成反差。"],
  ["044.讨论《北京法源寺》.txt", 39, 39, "奇情与思想，是文学家必要的条件", "文学格言", "李敖", "概括文学家所需的奇情与思想。"],
  ["044.讨论《北京法源寺》.txt", 39, 39, "作品很菜，都是卖菜的", "文艺妙语", "李敖", "以菜与卖菜的双关讽刺作品平庸。"],
  ["044.讨论《北京法源寺》.txt", 41, 41, "读其所读令堂吉诃德君子人也，但信其所读令堂吉诃德疯人也", "西方格言", "萧伯纳", "转述萧伯纳论堂吉诃德阅读与相信的名句。"],
  ["044.讨论《北京法源寺》.txt", 41, 41, "Reading made Don Quixote a gentleman, but believing what he read made him mad.", "西方格言", "萧伯纳", "保留英文原句。"],
  ["044.讨论《北京法源寺》.txt", 41, 41, "这个世界，再也没有堂吉诃德那样真诚的读者了！", "文学妙语", "李敖", "借堂吉诃德写真诚读者的稀少。"],
  ["045.比较“鸡巴学”答美国佬.txt", 25, 25, "见解以从俗展现不俗", "评语格言", "李敖", "称赞从俗语研究中见出不俗见解。"],
  ["045.比较“鸡巴学”答美国佬.txt", 27, 27, "把清教徒的污染，有以光复", "语言妙语", "李敖", "说明把被道德化污染的俗词恢复其原貌。"],
  ["045.比较“鸡巴学”答美国佬.txt", 29, 29, "被汉字骗了", "语言妙语", "梅维恒、李敖互答", "概括字形和译音造成的误会。"],
  ["046.你转载我，我转载你.txt", 23, 23, "悉凭尊意，当然，反之亦然", "书信妙语", "李敖", "用对称句写转载互许。"],
  ["046.你转载我，我转载你.txt", 25, 25, "啼笑皆非", "成语", "成语", "形容处境令人又好气又好笑。"],
  ["046.你转载我，我转载你.txt", 33, 33, "美女经不得折腾，由此可见！", "妙语", "李敖", "以玩笑口气谈风采变化。"],
  ["046.你转载我，我转载你.txt", 33, 33, "残菊犹有傲霜枝", "诗文化用", "苏轼诗意", "借残菊傲霜写人经折腾后仍有风致。"],
];

const proofreadRemoved = [
  { id: "LASHF-047", reason: "虽为通用成语化表达，但原句直接概括六叔早年投身革命后的生平走向，校对轮按政治人物经历语境删除。" },
  { id: "LASHF-048", reason: "人物评语直接服务于革命经历与现代中国人物抽样叙述，政治生平语境过强，删除。" },
  { id: "LASHF-052", reason: "托尔斯泰名句置于长春围城、将军、冤狱、蒋死等高度政治历史段落中，校对轮删除。" },
  { id: "LASHF-053", reason: "成语嵌在同一长春围城与冤狱段落中，独立引用价值弱，删除。" },
  { id: "LASHF-054", reason: "句子直接概括军政人物乱世交会经历，政治历史语境过强，删除。" },
  { id: "LASHF-055", reason: "《战争与和平》比喻紧接国家弱强、自传政治历史气魄说明，校对轮删除。" },
  { id: "LASHF-079", reason: "用语来自质问中央研究院史语所的公家机关问责段落，公共机构争议语境过强，删除。" },
  { id: "LASHF-080", reason: "俗语用于国民党同路人、出版机关、公帑图利等公共政治/机关争议，删除。" },
  { id: "LASHF-099", reason: "来信前文紧接台湾独立想象，原句又带政治战斗口号色彩，删除。" },
  { id: "LASHF-108", reason: "所在行直接出现叛乱犯、国民党伪政府、参选等政治语境，删除。" },
  { id: "LASHF-109", reason: "成语所在行延续国民党官僚与台湾人政治语境，独立诗文格言价值不足，删除。" },
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
    const id = `${ID_PREFIX}-${String(index + 1).padStart(3, "0")}`;
    const duplicateKey = `${file}\t${lineStart}\t${quote}`;
    if (seenQuotes.has(duplicateKey)) {
      throw new Error(`Duplicate raw entry: ${duplicateKey}`);
    }
    seenQuotes.add(duplicateKey);
    return {
      id,
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
  lines.push("- 跳过新闻局、检察官、法院、党派人物、选举人物、出版查禁等公共政治或司法语境中的语录。");
  lines.push("- 048 章虽有古典生死乡土诗句，但标题与全文高度贴合政治丧葬争议，首轮暂不纳入。");
  lines.push("- 保留私人书信、邻里事务、读书写作、文学评论、诗词成语等可独立成立的诗文格言歌谣文本。");
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
  const removedRows = getProofreadRemovedRows(rows);
  const removedIds = new Set(removedRows.map((row) => row.id));
  const outputRows = rows.filter((row) => !removedIds.has(row.id));
  const candidates = collectCandidates();
  writeCsv(outputRows);
  writeTxt(outputRows);
  writeAudit(rows);
  writeProofreadFiles(removedRows, outputRows);
  writeReport(outputRows, candidates);
  console.log(`Wrote ${outputRows.length} rows for ${BOOK}`);
  console.log(`Proofread removed ${removedRows.length} rows`);
  console.log(CSV_PATH);
  console.log(TXT_PATH);
  console.log(REPORT_PATH);
  console.log(PROOFREAD_REPORT_PATH);
}

main();
