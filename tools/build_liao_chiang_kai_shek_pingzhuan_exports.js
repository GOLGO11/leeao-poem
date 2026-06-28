const fs = require("fs");
const path = require("path");

const book = "蒋介石评传";
const idPrefix = "LAJJSPZ";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "023.蒋介石评传");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chiang_kai_shek_pingzhuan_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chiang_kai_shek_pingzhuan_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_chiang_kai_shek_pingzhuan_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_chiang_kai_shek_pingzhuan_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chiang_kai_shek_pingzhuan_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_chiang_kai_shek_pingzhuan_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_chiang_kai_shek_pingzhuan_initial_report.txt");
const proofreadReviewTsv = path.join("analysis", "liao_chiang_kai_shek_pingzhuan_proofread_review.tsv");
const proofreadAuditTsv = path.join("analysis", "liao_chiang_kai_shek_pingzhuan_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_chiang_kai_shek_pingzhuan_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const text = sourceDecoder.decode(fs.readFileSync(path.join(sourceDir, file)));
  sourceCache.set(file, { text, lines: text.split(/\r?\n/) });
}

function sourceFile(selector) {
  const found = files.find((file) => file.startsWith(selector));
  if (!found) throw new Error(`Source file not found for selector: ${selector}`);
  return found;
}

function chapterName(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"'\u300c\u300d\u300e\u300f]/g, "")
    .replace(/\s+/g, "");
}

function q(selector, lineStart, quoteText, category, attributedTo, summary, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(selector);
  return {
    id: "",
    book,
    chapter: chapterName(file),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: attributedTo,
    summary,
    notes: [
      "保守收入：《蒋介石评传》以蒋介石政治传记、党国史、北伐、内战、抗战、外交、台湾统治与蒋氏父子评价为主体；现代党派、政权、领袖、军政、战争、革命、国家民族、外交、统独、宪政、人权、意识形态、暗杀和反蒋/拥蒋语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、礼制文句、成语、俗语、题联、游记散句和非政治格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    5,
    "同做冯妇",
    "成语",
    "《孟子》冯妇典故",
    "汪荣祖用成语形容两人本不想再写传记却又联手写作。",
    5,
    "只收成语本体；不收蒋介石传记写作缘起和人物评价语境。",
  ),
  q(
    "002.",
    15,
    "干父之蛊",
    "易经成句",
    "《易经·蛊卦》",
    "李敖用《易经》成句指儿子面对父辈遗留问题。",
    15,
    "只收古典成句本体；不收蒋家身份、受难和政治统治语境。",
  ),
  q(
    "002.",
    15,
    "为亲者讳",
    "古典成句",
    "传统避讳成句",
    "李敖用传统成句说明亲属为亲人隐讳的处境。",
    15,
    "只收成句本体；不收蒋家后代身份与现代政治受害语境。",
  ),
  q(
    "003.",
    19,
    "原之所以自容于明公，公之所以待原者，以能守训典而不易也！若听明公之命，则是凡庸也！明公焉以为哉？",
    "古人言行",
    "邴原拒曹操冥婚事",
    "作者引邴原拒绝曹操为曹冲冥婚的答语，说明守训典而不易。",
    19,
    "只收古人答语本体；不收蒋家宗法和冥婚批评语境。",
  ),
  q(
    "003.",
    19,
    "禁迁葬者与嫁殇者。",
    "礼制古文",
    "《周礼·地官·媒氏》",
    "作者引《周礼》禁止迁葬与嫁殇的礼制文句。",
    19,
    "只收礼制古文本体；不收现代传记中的宗法批评语境。",
  ),
  q(
    "003.",
    19,
    "生时非夫妇，死而迁葬之，使相从",
    "经注文句",
    "《周礼》注疏",
    "作者转引注解解释迁葬为生前非夫妇、死后迁葬相从。",
    19,
    "只收经注文句本体；不收冥婚和蒋家宗法语境。",
  ),
  q(
    "003.",
    25,
    "能执干戈以卫社稷，虽欲无殇，不亦可乎？",
    "孔子语",
    "孔子礼制语",
    "作者引孔子语说明早殇者若能执干戈卫社稷，可不以殇论。",
    25,
    "只收古代礼制语本体；不收现代军政和蒋家继嗣语境。",
  ),
  q(
    "003.",
    27,
    "礼之所以立法，曰重大宗也；小宗无子，以为可以绝者也，故不为之立后，大宗无子，不可以绝，故立后以继之。",
    "礼制古文",
    "薛蕙《为人后解》",
    "作者引薛蕙解释宗法立后制度中大宗不可绝的原则。",
    27,
    "只收礼制古文本体；不收蒋家过继与现代家族批评语境。",
  ),
  q(
    "003.",
    27,
    "长支长子不得出继他支",
    "礼俗成句",
    "《中华民国民事习惯大全》",
    "作者转引民事习惯中长支长子不得出继他支的礼俗规则。",
    27,
    "只收礼俗规则本体；不收蒋家宗法和民事习惯论述语境。",
  ),
  q(
    "003.",
    27,
    "大宗不可绝",
    "宗法成句",
    "传统宗法成句",
    "作者用成句概括大宗无子时必须立后继嗣的原则。",
    27,
    "只收宗法成句本体；不收蒋家继嗣批评语境。",
  ),
  q(
    "003.",
    27,
    "一门两不绝",
    "礼俗成句",
    "传统兼祧说法",
    "作者引一门两不绝说明一个儿子兼承两房的办法。",
    27,
    "只收礼俗成句本体；不收蒋家家族安排语境。",
  ),
  q(
    "003.",
    37,
    "吾夫既死，与之同棺共穴可也。",
    "古人言行",
    "孟志刚夫人衣氏语",
    "作者引古代妇人言行说明同棺共穴的观念。",
    37,
    "只收古人言行本体；不收蒋家墓葬和迷信批评语境。",
  ),
  q(
    "003.",
    43,
    "永怀鞠育，昊天罔极",
    "哀悼古文句",
    "蒋介石《慈庵记》",
    "作者引《慈庵记》中追念母亲养育之恩的古文句。",
    43,
    "只收亲情哀悼文句；不收蒋家政治和墓庐建置语境。",
  ),
  q(
    "003.",
    43,
    "曾几何时，星沈露冷，从此白云孤庵，但有凄望心恻而已。",
    "哀悼散文句",
    "蒋介石《慈庵记》",
    "作者引《慈庵记》中写岁月迁逝、孤庵凄望的哀悼句。",
    43,
    "只收哀悼散文句；不收蒋家政治和墓庐语境。",
  ),
  q(
    "003.",
    43,
    "蜿蜒陂陀，曲折如羊肠",
    "游记散文句",
    "蒋介石《慈庵记》",
    "作者引《慈庵记》中描写山路蜿蜒曲折的散文句。",
    43,
    "只收景物散文句；不收墓庐和蒋家叙事语境。",
  ),
  q(
    "003.",
    125,
    "当仁不让",
    "古典成语",
    "《论语·卫灵公》",
    "作者转引古人成语，说明遇到该承担的事不退让。",
    125,
    "只收成语本体；不收同盟会、革命组织和军事学生语境。",
  ),
  q(
    "003.",
    125,
    "富贵不能淫，贫贱不能移，威武不能屈，此之谓大丈夫",
    "孟子名句",
    "《孟子·滕文公下》",
    "作者引孟子大丈夫名句，说明不淫、不移、不屈的品格。",
    125,
    "只收孟子句本体；不收丈夫团、推翻满清和革命语境。",
  ),
  q(
    "003.",
    131,
    "风萧萧兮易水寒",
    "古歌句",
    "《易水歌》",
    "作者借《易水歌》句形容叙事被渲染成荆轲入秦式悲壮。",
    131,
    "只收古歌句本体；不收辛亥、回国参战和军事叙事语境。",
  ),
  q(
    "004.",
    11,
    "一丘之貉",
    "成语",
    "中文成语",
    "作者用成语概括彼此同类、没有本质区别。",
    11,
    "只收成语本体；不收护法、军阀和孙中山政治语境。",
  ),
  q(
    "004.",
    73,
    "月出震方，波平如镜，攒峰倒映，人在画中。",
    "游记散文句",
    "蒋介石游天童日记",
    "作者引游记文字描写月出、波平、群峰倒映如人在画中。",
    73,
    "只收景物散文句；不收蒋介石行踪和政治传记语境。",
  ),
  q(
    "004.",
    147,
    "养天地正气，法古今完人。",
    "题联",
    "蒋介石鼓山题联",
    "作者引蒋介石在鼓山因石壁字而足成的联语。",
    147,
    "只收题联本体；不收孙蒋关系和军政行踪语境。",
  ),
  q(
    "004.",
    147,
    "吾能于亭后小筑三椽，隐居自适，斯愿足矣！",
    "山居散文句",
    "蒋介石游鼓山语",
    "作者引蒋介石游鼓山时想在亭后小筑隐居的文句。",
    147,
    "只收山居散文句；不收军政职务和孙蒋关系语境。",
  ),
  q(
    "004.",
    147,
    "其介如石",
    "古典成句",
    "《易经·豫卦》成句",
    "作者引蒋介石题写勒石的古典成句。",
    147,
    "只收古典成句本体；不收蒋介石姓名寓意和政治传记语境。",
  ),
  q(
    "004.",
    175,
    "兄可敝屣尊荣，不能敝屣道义！",
    "格言式书信句",
    "廖仲恺致蒋介石语",
    "作者引书信中劝人可以轻视尊荣、不可轻视道义的格言式句子。",
    175,
    "只收道义格言本体；不收军校、孙蒋关系和政治催促语境。",
  ),
  q(
    "006.",
    105,
    "黄袍加身",
    "历史典故成语",
    "宋太祖赵匡胤典故",
    "作者用黄袍加身典故说明骤登高位的历史联想。",
    105,
    "只收历史典故成语本体；不收国府主席和党国权力语境。",
  ),
  q(
    "006.",
    105,
    "目空一切",
    "成语",
    "中文成语",
    "作者引成语写骄矜自大的姿态。",
    105,
    "只收成语本体；不收蒋介石权力和政治评价语境。",
  ),
  q(
    "006.",
    105,
    "杯酒释兵权",
    "历史典故",
    "宋太祖杯酒释兵权典故",
    "作者以宋太祖杯酒释兵权说明谨慎处置权力的历史典故。",
    105,
    "只收历史典故本体；不收现代军事权力和中央集权语境。",
  ),
  q(
    "006.",
    105,
    "重文偃武",
    "历史成语",
    "宋代治国典故",
    "作者用重文偃武概括宋太祖重视文治、收敛武力的做法。",
    105,
    "只收历史成语本体；不收现代军政权力语境。",
  ),
  q(
    "007.",
    287,
    "血更浓于水",
    "俗语",
    "中文俗语",
    "作者用俗语说明姻亲血缘关系在紧要关头的影响。",
    287,
    "只收俗语本体；不收孔宋财权和蒋家政治语境。",
  ),
  q(
    "007.",
    287,
    "用武之地",
    "成语",
    "中文成语",
    "作者用成语说明才能或知识可以发挥作用的地方。",
    287,
    "只收成语本体；不收财政、军需和孔宋政治经济语境。",
  ),
  q(
    "007.",
    287,
    "治标而不能治本",
    "成语化俗语",
    "中文成语化俗语",
    "作者用成语化俗语说明只能处理表面问题而不能解决根本。",
    287,
    "只收俗语本体；不收财政制度和蒋宋关系语境。",
  ),
  q(
    "007.",
    287,
    "秀才遇见兵",
    "俗语",
    "中文俗语",
    "作者用俗语写有理财知识者遇到粗暴权力时的无奈。",
    287,
    "只收俗语本体；不收财政、军需和蒋宋关系语境。",
  ),
  q(
    "007.",
    311,
    "一鼓作气，再而衰，三而竭",
    "左传名句",
    "《左传·庄公十年》",
    "作者引《左传》名句说明气势由盛而衰。",
    311,
    "只收古典名句本体；不收新生活运动和现代政治动员语境。",
  ),
  q(
    "007.",
    311,
    "何不食肉糜",
    "历史典故成句",
    "晋惠帝典故",
    "作者用晋惠帝典故比喻不知民间疾苦。",
    311,
    "只收历史典故本体；不收现代社会运动和政治批评语境。",
  ),
  q(
    "007.",
    311,
    "异曲同工",
    "成语",
    "中文成语",
    "作者用成语说明不同说法有相似效果。",
    311,
    "只收成语本体；不收宋美龄言论和政治批评语境。",
  ),
  q(
    "007.",
    347,
    "棋差一着，输个满盘",
    "俗语",
    "中文俗语",
    "作者用俗语说明一处失误导致全局失败。",
    347,
    "只收俗语本体；不收围剿、红军和军事评价语境。",
  ),
  q(
    "008.",
    351,
    "不知彼，不知己",
    "兵法成句",
    "兵法成句",
    "作者引成句说明既不了解对方也不了解自己。",
    351,
    "只收已成通用格言的短句；不收戚继光大战语录、抗战和军事训话语境。",
  ),
  q(
    "011.",
    25,
    "金玉其外，败絮其中",
    "成语",
    "刘基《卖柑者言》成句",
    "作者用成语形容外表华美而内里败坏。",
    25,
    "只收成语本体；不收国共内战、军队腐败和政权评价语境。",
  ),
  q(
    "011.",
    25,
    "楼台七宝倏成灰",
    "近人诗句",
    "陈寅恪诗句",
    "作者引陈寅恪诗句写繁华楼台转瞬成灰。",
    25,
    "只收诗句本体；不收国共内战和政权失败语境。",
  ),
  q(
    "011.",
    75,
    "可以死，可以无死，死，伤勇。",
    "孟子名句",
    "《孟子·离娄下》",
    "作者引孟子句说明可死可不死而求死，反伤勇德。",
    75,
    "只收孟子句本体；不收战败、投降和现代军政评价语境。",
  ),
  q(
    "015.",
    25,
    "自我失之",
    "近人诗句",
    "陈寅恪己丑夏日诗",
    "作者引陈寅恪诗中自我失之的判断。",
    25,
    "只收诗句本体；不收蒋介石历史评价语境。",
  ),
  q(
    "015.",
    27,
    "英雄不怕出身低",
    "俗语",
    "中文俗语",
    "作者用俗语说明成大事者不必因出身低微而自卑。",
    27,
    "只收俗语本体；不收蒋介石出身和历史评价语境。",
  ),
  q(
    "015.",
    27,
    "盗亦有道",
    "庄子成句",
    "《庄子·胠箧》",
    "作者用庄子成句说明即便盗者也有其规矩与气度。",
    27,
    "只收古典成句本体；不收帮会、政治人物和历史评价语境。",
  ),
  q(
    "015.",
    27,
    "以小见大，一叶知秋",
    "成语连用",
    "中文成语",
    "作者用成语连用说明从小处可观察到大趋势。",
    27,
    "只收成语本体；不收蒋介石性格和治国评价语境。",
  ),
];

const proofreadRemovedRows = [];

const proofreadAdditions = [
  q(
    "004.",
    75,
    "雪满山原，一白无际",
    "梦境散文句",
    "蒋介石梦境记述",
    "作者引蒋介石梦中雪满山原、一白无际的景象。",
    75,
    "校对补入，只收梦境景物句本体；不收孙蒋关系、回粤、丧事和军政行踪语境。",
  ),
  q(
    "004.",
    93,
    "取道北溪，探四明石窗，蹑鼠尾山巅，向西北驰下",
    "游记散文句",
    "蒋介石游山记述",
    "作者引蒋介石记述取道北溪、探石窗、登山驰下的游踪。",
    93,
    "校对补入，只收游记散文句；不收孙蒋关系、奔走去留和军政传记语境。",
  ),
  q(
    "009.",
    405,
    "要劫劫皇杠，要玩玩娘娘",
    "谚语",
    "中国谚语",
    "作者引谚语形容贪图异味和冒险染指的夸张气派。",
    405,
    "校对补入，只收谚语本体；不收威尔基、宋美龄和外交绯闻语境。",
  ),
  q(
    "009.",
    449,
    "看花愁近最高楼",
    "近人诗句",
    "陈寅恪诗句",
    "作者引陈寅恪诗句写登高看花而近愁的感慨。",
    449,
    "校对补入，只收诗句本体；不收抗战、蒋介石评价和政治处理语境。",
  ),
  q(
    "009.",
    467,
    "虽不杀伯仁，伯仁因我而死",
    "古典典故成句",
    "周顗伯仁典故",
    "作者用伯仁典故说明虽非亲手致死却难辞间接责任。",
    467,
    "校对补入，只收典故成句本体；不收中美合作所、政治犯和军统语境。",
  ),
  q(
    "011.",
    105,
    "瞒天过海",
    "成语",
    "中文成语",
    "作者用成语批评措词掩盖事实。",
    105,
    "校对补入，只收成语本体；不收康泽、国共、俘囚和政治挽联语境。",
  ),
  q(
    "011.",
    265,
    "百无一用之书生",
    "俗语化成句",
    "中文俗语化成句",
    "作者引陈布雷自称百无一用之书生的自责语。",
    265,
    "校对补入，只收成句本体；不收陈布雷、国民党、自杀和政治失败语境。",
  ),
  q(
    "011.",
    271,
    "忧心如焚",
    "成语",
    "中文成语",
    "作者引陈布雷书信中忧虑如火焚的成语。",
    271,
    "校对补入，只收成语本体；不收陈布雷、国民党、自杀和政治失败语境。",
  ),
  q(
    "011.",
    271,
    "一生辛苦，乃落得如此一文不值之下场",
    "自责散文句",
    "陈布雷书信语",
    "作者引陈布雷书信中自叹一生辛苦却落得一文不值的句子。",
    271,
    "校对补入，只收自责散文句；不收陈布雷、国民党、自杀和政治失败语境。",
  ),
  q(
    "011.",
    355,
    "扶不起的阿斗",
    "俗语典故",
    "刘禅阿斗典故",
    "作者用扶不起的阿斗比喻无论如何扶助都难以成事的人。",
    355,
    "校对补入，只收俗语典故本体；不收美国白皮书、国共内战和政权评价语境。",
  ),
  q(
    "011.",
    355,
    "可怜汉主求仙意，博得胡僧话劫灰",
    "近人诗句",
    "陈寅恪诗句",
    "作者引陈寅恪诗句写汉主求仙而终得劫灰之叹。",
    355,
    "校对补入，只收诗句本体；不收美国白皮书、国共内战和政权评价语境。",
  ),
  q(
    "012.",
    23,
    "“远水”救不了“近火”",
    "俗语",
    "中文俗语",
    "作者用俗语说明远方力量不能解眼前危局。",
    23,
    "校对补入，只收俗语本体；不收徐蚌、内战、和谈与政治残局语境。",
  ),
  q(
    "012.",
    23,
    "吃回头草",
    "俗语",
    "中文俗语",
    "作者用俗语说明重新回头做已经放弃或否定的事。",
    23,
    "校对补入，只收俗语本体；不收国共和谈和政治残局语境。",
  ),
  q(
    "012.",
    23,
    "背黑锅",
    "俗语",
    "中文俗语",
    "作者用俗语说明替人承担责任或恶名。",
    23,
    "校对补入，只收俗语本体；不收徐蚌、内战、和谈和蒋李政治语境。",
  ),
  q(
    "012.",
    23,
    "替死鬼",
    "俗语",
    "中文俗语",
    "作者用俗语说明替别人承担灾祸或责任的人。",
    23,
    "校对补入，只收俗语本体；不收徐蚌、内战、和谈和蒋李政治语境。",
  ),
  q(
    "012.",
    185,
    "蛛丝马迹",
    "成语",
    "中文成语",
    "作者用成语说明从细微迹象中可寻线索。",
    185,
    "校对补入，只收成语本体；不收黄金转运和蒋李政治语境。",
  ),
  q(
    "012.",
    255,
    "改弦更张",
    "成语",
    "中文成语",
    "作者引书信中改弦更张，指改变方针办法。",
    255,
    "校对补入，只收成语本体；不收李宗仁书信、党政、台琼和反攻语境。",
  ),
  q(
    "012.",
    255,
    "故步自封",
    "成语",
    "中文成语",
    "作者引书信中故步自封，指守旧不求改变。",
    255,
    "校对补入，只收成语本体；不收李宗仁书信、党政、台琼和反攻语境。",
  ),
  q(
    "013.",
    45,
    "无可奈何花落去",
    "宋词化句",
    "晏殊《浣溪沙》化用",
    "作者化用晏殊词句，写大势已去、无可挽回。",
    45,
    "校对补入，只收词句化用本体；不收美国、台湾和中国政权承认语境。",
  ),
  q(
    "014.",
    181,
    "打破砂锅问到底",
    "俗语",
    "中文俗语",
    "作者用俗语说明追问到底、不放过真相。",
    181,
    "校对补入，只收俗语本体；不收江南案、蒋孝武和特务政治语境。",
  ),
  q(
    "014.",
    181,
    "弃车保帅",
    "成语",
    "象棋成语",
    "作者用成语说明牺牲较小一方以保全关键人物。",
    181,
    "校对补入，只收成语本体；不收江南案、情报局和蒋家政治语境。",
  ),
  q(
    "014.",
    181,
    "投鼠忌器",
    "成语",
    "中文成语",
    "作者用成语说明有所顾忌而不敢行动。",
    181,
    "校对补入，只收成语本体；不收江南案、竹联帮和蒋家政治语境。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "共匪",
  "国民党",
  "民进党",
  "台独",
  "中华民国",
  "党国",
  "政府",
  "政权",
  "总统",
  "总裁",
  "领袖",
  "国父",
  "主席",
  "委员长",
  "行政院",
  "立法院",
  "国防部",
  "外交部",
  "军法",
  "军队",
  "特务",
  "反共",
  "革命",
  "三民主义",
  "主义",
  "战争",
  "抗战",
  "北伐",
  "内战",
  "反攻",
  "台湾",
  "大陆",
  "西藏",
  "外蒙",
  "美国",
  "日本",
  "苏联",
  "俄国",
  "暗杀",
  "战犯",
  "言论自由",
  "人权",
  "民主政治",
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function rowToCsv(row) {
  return [
    row.id,
    row.book,
    row.chapter,
    row.source_file,
    row.line_start,
    row.line_end,
    row.quote_text,
    row.category,
    row.source_or_origin,
    row.summary,
    row.notes,
  ]
    .map(csvEscape)
    .join(",");
}

function quotePresent(row) {
  const source = sourceCache.get(row.source_file);
  const slice = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
  return normalizeText(slice).includes(normalizeText(row.quote_text));
}

function hasPoliticalHit(row) {
  return modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
}

const fileIndex = new Map(files.map((file, index) => [file, index]));
const proofreadRemovedQuoteKeys = new Set(proofreadRemovedRows.map((row) => normalizeText(row.quote_text)));
const initialRows = rawRows.filter((row) => !proofreadRemovedQuoteKeys.has(normalizeText(row.quote_text)));
const selectedRows = [...initialRows, ...proofreadAdditions]
  .sort((a, b) => {
    const fileDiff = fileIndex.get(a.source_file) - fileIndex.get(b.source_file);
    if (fileDiff) return fileDiff;
    if (a.line_start !== b.line_start) return a.line_start - b.line_start;
    return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
  })
  .map((row, index) => ({
    ...row,
    id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
  }));

function selectedVersion(row) {
  const rowKey = [row.source_file, row.line_start, normalizeText(row.quote_text)].join("\u0001");
  return (
    selectedRows.find((selected) => {
      const selectedKey = [selected.source_file, selected.line_start, normalizeText(selected.quote_text)].join("\u0001");
      return selectedKey === rowKey;
    }) || row
  );
}

const auditRows = selectedRows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

const proofreadAuditRows = [
  ...proofreadRemovedRows.map((row) => ({
    action: "remove",
    reason: "校对删除",
    row,
    present: quotePresent(row),
    politicalHits: hasPoliticalHit(row),
  })),
  ...proofreadAdditions.map((row) => {
    const selected = selectedVersion(row);
    return {
      action: "add",
      reason: "校对补入",
      row: selected,
      present: quotePresent(selected),
      politicalHits: hasPoliticalHit(selected),
    };
  }),
];

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of selectedRows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = selectedRows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

if (missing.length) {
  throw new Error(`Missing quote text in source: ${missing.map((item) => item.row.id).join(", ")}`);
}
if (duplicates.length) {
  throw new Error(`Duplicate quote text in ${book}: ${duplicates.map((row) => row.id).join(", ")}`);
}
if (politicalHits.length) {
  throw new Error(
    `Political terms in selected quote text: ${politicalHits
      .map((item) => `${item.row.id}(${item.politicalHits.join("|")})`)
      .join(", ")}`,
  );
}

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(selectedJson), { recursive: true });

const header = [
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
].join(",");

fs.writeFileSync(outCsv, `${header}\n${selectedRows.map(rowToCsv).join("\n")}\n`, "utf8");

const txt = selectedRows
  .map((row) =>
    [
      `${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`,
      `引用：${row.quote_text}`,
      `出处线索：${row.source_or_origin}`,
      `说明：${row.summary}`,
      row.notes ? `备注：${row.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n\n");

fs.writeFileSync(outTxt, `${book} 诗文格言歌谣引用\n生成日期：${generatedDate}\n条目数：${selectedRows.length}\n\n${txt}\n`, "utf8");
fs.writeFileSync(selectedJson, `${JSON.stringify(selectedRows, null, 2)}\n`, "utf8");

fs.writeFileSync(
  reviewTsv,
  [
    "id\tsource_file\tline_start\tline_end\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
    ...selectedRows.map((row) =>
      [
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.source_or_origin,
        row.summary,
        row.notes,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);
fs.copyFileSync(reviewTsv, proofreadReviewTsv);

fs.writeFileSync(
  auditTsv,
  [
    "id\tsource_file\tline_start\tline_end\tpresent\tpolitical_hits\tquote_text",
    ...auditRows.map((item) =>
      [
        item.row.id,
        item.row.source_file,
        item.row.line_start,
        item.row.line_end,
        item.present ? "yes" : "no",
        item.politicalHits.join("|"),
        item.row.quote_text,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

fs.writeFileSync(
  proofreadAuditTsv,
  [
    "action\treason\tid\tsource_file\tline_start\tline_end\tpresent\tpolitical_hits\tquote_text",
    ...proofreadAuditRows.map((item) =>
      [
        item.action,
        item.reason,
        item.row.id,
        item.row.source_file,
        item.row.line_start,
        item.row.line_end,
        item.present ? "yes" : "no",
        item.politicalHits.join("|"),
        item.row.quote_text,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

const candidatesData = fs.existsSync(candidatesJson) ? JSON.parse(fs.readFileSync(candidatesJson, "utf8")) : null;
const quoteCandidates = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "quote").length
  : candidatesData?.quoteCandidates?.length ?? "missing";
const keywordLines = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "keyword_line").length
  : candidatesData?.keywordLines ?? "missing";
const uniqueQuoteTexts = Array.isArray(candidatesData)
  ? new Set(candidatesData.filter((row) => row.kind === "quote").map((row) => normalizeText(row.text ?? row.quote_text))).size
  : candidatesData?.uniqueQuoteTexts ?? "missing";
const reviewCandidateLines = fs.existsSync(reviewCandidatesTsv)
  ? fs.readFileSync(reviewCandidatesTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";
const attributedLines = fs.existsSync(attributedTsv)
  ? fs.readFileSync(attributedTsv, "utf8").replace(/^\uFEFF/, "").trim().split(/\r?\n/).length - 1
  : "missing";

const reportLines = [
  `${book} proofread extraction report`,
  `generatedDate: ${generatedDate}`,
  `sourceDir: ${sourceDir}`,
  `sourceFilesForExport: ${files.length}`,
  `quoteCandidates: ${quoteCandidates}`,
  `uniqueQuoteTexts: ${uniqueQuoteTexts}`,
  `keywordLines: ${keywordLines}`,
  `reviewCandidates: ${reviewCandidateLines}`,
  `attributedLines: ${attributedLines}`,
  `initialSelectedRowsBeforeProofread: ${rawRows.length}`,
  `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
  `proofreadAddedRows: ${proofreadAdditions.length}`,
  `selectedRows: ${selectedRows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is a political biography dominated by Chiang Kai-shek, KMT/CCP party-state history, Northern Expedition, civil war, Anti-Japanese War, diplomacy, Taiwan rule, and Chiang family evaluations; exclude direct modern political, party, regime, leader, military, war, revolution, national identity, diplomacy, constitutional, human-rights, assassination and ideological quotations, while keeping independently reusable classical poetry/prose, ritual prose, idioms, proverbs, couplets, scenic prose and non-political maxims.",
  "",
  "selectedHighlights:",
  "- 001/002: 收“同做冯妇”“干父之蛊”“为亲者讳”；蒋家身份、受难和政治统治语境不收。",
  "- 003: 收《周礼》、邴原、孔夫子、薛蕙、孟子、《易水歌》及亲情/墓记中的非政治古文散句；辛亥、同盟会、革命组织和军政叙事不收。",
  "- 004: 收“一丘之貉”、天童游记句、鼓山题联和“其介如石”等；校对补入“雪满山原，一白无际”和取道北溪游记句；护法、军阀、孙蒋关系和军政催促语境不收。",
  "- 006/007: 收“黄袍加身”“杯酒释兵权”“重文偃武”“血更浓于水”“一鼓作气，再而衰，三而竭”等通用成语典故；北伐、奉安政治、财政军需和现代社会运动语境不收。",
  "- 009: 校对补入中国谚语、陈寅恪诗句和伯仁典故；威尔基外交绯闻、中美合作所、政治犯和特务语境不收。",
  "- 011/012: 校对补入“瞒天过海”“百无一用之书生”“忧心如焚”“扶不起的阿斗”、“远水”救不了“近火”、“吃回头草”“背黑锅”“替死鬼”“蛛丝马迹”“改弦更张”“故步自封”等；现代书信中的政党、内战、外交、反攻和政权语境不收。",
  "- 013/014/015: 收“不知彼，不知己”、陈寅恪诗句、孟子句及若干俗语成句；校对补入“无可奈何花落去”“打破砂锅问到底”“弃车保帅”“投鼠忌器”；抗战训话、国共内战、反攻和蒋氏父子政治评价不收。",
  "",
  "excludedHighlights:",
  "- 002/003/004: 李敖牢狱反蒋语、孙蒋关系、陈炯明/中山舰/党争材料，以及“老王八蛋死了”等现代政治攻击不收。",
  "- 005/006/007: 北伐、清党、中原大战、新生活运动、蓝衣社、党国宣传、章太炎奉安挽联、毛泽东《渔家傲》等政治/军事材料不收。",
  "- 008/009/010/011/012/013: 抗战战略、外交谈判、道统治统、国共内战、美国/苏联/台湾/反攻大陆和黄金转运等现代政治与军政语录不收；“无可奈何的供状”等毛泽东政治评语不收。",
  "- 011/012: “误国之罪，百身莫赎”“内斗内行、外斗外行”等虽可成句，但政治自责或政治评断色彩过重，不收。",
  "- 014/015: 蒋氏父子统治、民主宪政、人权、江南案、蒋家王朝和现代历史评价语录不收；只留可独立检索的俗语、诗句和成语。",
];

fs.writeFileSync(reportTxt, reportLines.join("\n") + "\n", "utf8");
fs.writeFileSync(proofreadReportTxt, reportLines.join("\n") + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      book,
      initialRows: rawRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
      rows: selectedRows.length,
      missing: missing.length,
      duplicates: duplicates.length,
      politicalHitRows: politicalHits.length,
      quoteCandidates,
      uniqueQuoteTexts,
      keywordLines,
      reviewCandidates: reviewCandidateLines,
      attributedLines,
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
      proofreadReviewTsv,
      proofreadAuditTsv,
      proofreadReportTxt,
    },
    null,
    2,
  ),
);
