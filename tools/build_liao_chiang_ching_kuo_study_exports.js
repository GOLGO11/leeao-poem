const fs = require("fs");
const path = require("path");

const book = "蒋经国研究";
const idPrefix = "LAJJGYJ";
const generatedDate = "2026-06-28";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "024.蒋经国研究");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chiang_ching_kuo_study_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chiang_ching_kuo_study_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_chiang_ching_kuo_study_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chiang_ching_kuo_study_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_chiang_ching_kuo_study_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_chiang_ching_kuo_study_initial_report.txt");
const proofreadReviewTsv = path.join("analysis", "liao_chiang_ching_kuo_study_proofread_review.tsv");
const proofreadAuditTsv = path.join("analysis", "liao_chiang_ching_kuo_study_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_chiang_ching_kuo_study_proofread_report.txt");
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
  if (selector === "缘起") return "《蒋经国研究》缘起.txt";
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
      "保守收入：《蒋经国研究》以蒋经国、蒋家、国民党、台湾统治、戒严、特务、接班、苏联经历、政治争议和反蒋攻防为主体；现代党派、政权、领袖、总统、军政、战争、革命、国家民族、外交、统独、宪政、人权、意识形态、暗杀、接班与反蒋/拥蒋语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、礼制文句、成语、俗语、题联、文学引文和非政治格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "缘起",
    23,
    "以子之矛，攻子之盾",
    "成语",
    "《韩非子》矛盾典故",
    "李敖用成语说明以对方立场反击对方论点。",
    23,
    "只收成语本体；不收李敖诉讼、自立晚报、党外和蒋经国死了的政治法律攻防语境。",
  ),
  q(
    "004.",
    5,
    "天衣无缝",
    "成语",
    "中文成语",
    "作者用成语形容设计周密、没有破绽。",
    5,
    "只收成语本体；不收宋教仁案、总统暗杀和政治攻击语境。",
  ),
  q(
    "004.",
    5,
    "无懈可击",
    "成语",
    "中文成语",
    "作者用成语形容没有可以攻击或挑剔的漏洞。",
    5,
    "只收成语本体；不收宋教仁案和政治暗杀叙述。",
  ),
  q(
    "004.",
    5,
    "东窗事发",
    "成语",
    "中文成语",
    "作者用成语说明隐秘坏事终于败露。",
    5,
    "只收成语本体；不收政治暗杀和总统批判语境。",
  ),
  q(
    "004.",
    19,
    "水落石出",
    "成语",
    "中文成语",
    "作者引成语表示真相终会显露。",
    19,
    "只收成语本体；不收袁世凯答话、宋案侦查和政治辩解语境。",
  ),
  q(
    "004.",
    23,
    "三下五除二",
    "俗语成语",
    "中文俗语",
    "作者用俗语说明行动利落、很快完成。",
    23,
    "只收俗语本体；不收公共租界侦查和宋案语境。",
  ),
  q(
    "004.",
    77,
    "身死名裂",
    "成语",
    "中文成语",
    "作者用成语概括身亡而名声败坏。",
    77,
    "只收成语本体；不收袁世凯、政府辩解和政治暗杀结局语境。",
  ),
  q(
    "004.",
    77,
    "后之视今，亦犹今之视昔",
    "古文名句",
    "王羲之《兰亭集序》化用",
    "作者化用古文名句，说明后人看今人与今人看古人相似。",
    77,
    "只收古文名句本体；不收宋案和现代政治讽刺语境。",
  ),
  q(
    "004.",
    77,
    "前曾见古人，后复见来者",
    "唐诗化句",
    "陈子昂《登幽州台歌》化用",
    "作者化用唐诗句，写历史前后相续、后来者复见。",
    77,
    "只收诗句化用本体；不收宋案和现代政治讽刺语境。",
  ),
  q(
    "005.",
    31,
    "阳翟有妇人，妊身三十月，乃生子",
    "古书记载",
    "《嵩高山记》",
    "作者引古书记载妇人怀胎三十月而生子的异闻。",
    31,
    "只收古书异闻本体；不收蒋经国出生月份考辨和政治人物身世争论语境。",
  ),
  q(
    "006.",
    23,
    "原之所以自容于明公，公之所以待原者，以能守训典而不易也！若听明公之命，则是凡庸也！明公焉以为哉？",
    "古人言行",
    "邴原拒曹操冥婚事",
    "作者引邴原拒绝曹操为曹冲冥婚的答语，说明守训典而不易。",
    23,
    "只收古人答语本体；不收蒋经国过继、蒋家宗法和政治人物家族语境。",
  ),
  q(
    "006.",
    23,
    "禁迁葬者与嫁殇者。",
    "礼制古文",
    "《周礼·地官·媒氏》",
    "作者引《周礼》禁止迁葬与嫁殇的礼制文句。",
    23,
    "只收礼制古文本体；不收蒋家冥婚、过继和家族批评语境。",
  ),
  q(
    "006.",
    23,
    "生时非夫妇，死而迁葬之，使相从",
    "经注文句",
    "《周礼》注疏",
    "作者转引注解解释迁葬为生前非夫妇、死后迁葬相从。",
    23,
    "只收经注文句本体；不收蒋家宗法安排和现代家族语境。",
  ),
  q(
    "006.",
    27,
    "新妇年少，终必他适，可令吾子鳏处地下耶？",
    "古史文句",
    "《元史·列女传》杨氏事",
    "作者引《元史》故事中舅姑欲为亡子合葬亡女的问句。",
    27,
    "只收古史文句本体；不收蒋家冥婚和宗法批评语境。",
  ),
  q(
    "006.",
    33,
    "能执干戈以卫社稷， 虽欲无殇，不亦可乎？",
    "孔子礼制语",
    "孔子礼制语",
    "作者引孔子语说明早殇者若能执干戈卫社稷，可不以殇论。",
    33,
    "只收古代礼制语本体；不收蒋经国过继与蒋家宗法语境。",
  ),
  q(
    "006.",
    37,
    "礼之所以立后，曰重大宗也；小宗无子，以为可以绝者也。故不为之立后。大宗无子，不可以绝，故立后以继之。小宗不可拟大宗，故曰重大宗也。曷为后大宗不后小宗？重本也。大宗者，祖之正体也，本也；小宗者，祖之旁体也，支也。本存而支亡，亡而犹存也，尊者存焉耳。本亡而支存，存而犹亡也，存者微矣。是故小宗无后，祖不绝；大宗无后，祖绝矣！",
    "礼制古文",
    "薛蕙《为人后解》",
    "作者引薛蕙解释宗法立后制度中大宗不可绝的原则。",
    37,
    "只收礼制古文本体；不收蒋家继嗣和现代家族批评语境。",
  ),
  q(
    "006.",
    39,
    "长支长子不得出继他支",
    "礼俗成句",
    "《中华民国民事习惯大全》",
    "作者转引民事习惯中长支长子不得出继他支的礼俗规则。",
    39,
    "只收礼俗规则本体；不收蒋经国过继和蒋家继承语境。",
  ),
  q(
    "006.",
    47,
    "不忍重违母命，以伤骨肉之至情，不获已，仍以长子经国嗣之",
    "家族文言句",
    "蒋介石宗法文字",
    "作者引蒋介石叙述不忍违母命而以长子经国嗣弟的文句。",
    47,
    "只收家族情理文句；不收蒋经国身份、蒋纬国身世和蒋家政治语境。",
  ),
  q(
    "006.",
    49,
    "世世子孙，读斯文者，知吾母与吾今日哀其子若弟之苦心，庶奉吾弟祭祀，永永弗替",
    "家族文言句",
    "蒋介石宗法文字",
    "作者引蒋介石以世世子孙读斯文、奉祭祀不替的文言句。",
    49,
    "只收家族祭祀文句；不收蒋家政治人物身份和继承安排语境。",
  ),
  q(
    "006.",
    57,
    "上中下三等社会，凡子弟未婚夭亡，类多择一门户相当，年龄相若之亡女，为之定婚，迎接木主过门，礼节如生人嫁娶，名曰‘冥配’。盖以不如是，则灵魂将无所依归，不能入祠祭祀，且不能立后，一经冥配，即取得被继承人之资格，得为之立后也。",
    "民俗文献句",
    "《中国民事习惯大全》",
    "作者引民事习惯文献说明浙江平湖冥配与立后的民俗。",
    57,
    "只收民俗文献句；不收蒋家过继和现代人物批评语境。",
  ),
  q(
    "007.",
    17,
    "糟糠之妻不可弃",
    "古典成句",
    "《后汉书》宋弘语化用",
    "作者转述吴国桢劝人不可抛弃糟糠之妻的成句。",
    17,
    "只收成句本体；不收任显群、顾正秋、婚恋与政治迫害语境。",
  ),
  q(
    "007.",
    31,
    "世间祸故不可忽，箦中死尸能报雠。",
    "宋诗句",
    "王安石诗句",
    "作者引王安石诗句说明世间祸故不可忽视。",
    31,
    "只收诗句本体；不收任显群家事、投奔大陆和政治报复语境。",
  ),
  q(
    "008.",
    9,
    "诗以人传",
    "诗评成句",
    "中文诗评成句",
    "作者用诗以人传说明作品因人物而流传。",
    9,
    "只收诗评成句本体；不收毛泽东《沁园春》、政治人物评价和词作比较语境。",
  ),
  q(
    "008.",
    9,
    "百花发时我不发，我一发时百花煞。要与秋风战一场，满身披上黄金甲！",
    "古诗句",
    "朱元璋《咏菊诗》",
    "作者引朱元璋咏菊诗，写百花与秋风相抗的帝王诗气。",
    9,
    "只收古诗句本体；不收毛泽东词、华国锋和现代政治传承语境。",
  ),
  q(
    "008.",
    41,
    "亲贤臣、远小人",
    "古典成句",
    "诸葛亮《出师表》",
    "作者化用《出师表》亲贤臣远小人的成句。",
    41,
    "只收古典成句本体；不收华国锋、毛后接班和现代政治期待语境。",
  ),
  q(
    "008.",
    97,
    "不识庐山真面目，只缘身在此山中",
    "宋诗名句",
    "苏轼《题西林壁》",
    "作者引苏轼诗句说明身在局中而难见真相。",
    97,
    "只收诗句本体；不收邓小平、变法和革命辨析语境。",
  ),
  q(
    "008.",
    149,
    "穷则变、变则通！",
    "易经成句",
    "《周易·系辞》化用",
    "作者引语云穷则变、变则通，说明困极则思变。",
    149,
    "只收古典成句本体；不收小平变法、毛泽东和现代政治评价语境。",
  ),
  q(
    "008.",
    157,
    "文王周公、制礼作乐",
    "礼记成句",
    "《礼记》相关说法",
    "作者引《礼记》作者关于文王周公制礼作乐的说法。",
    157,
    "只收古典礼制成句；不收制度生成和现代政治制度讨论语境。",
  ),
  q(
    "008.",
    173,
    "为民父母",
    "古典政治成句",
    "传统官箴成句",
    "作者引传统为民父母之说，与官吏公仆观念相对照。",
    173,
    "只收古典成句本体；不收中西制度、政治家和现代政论语境。",
  ),
  q(
    "008.",
    173,
    "作之君、作之师",
    "古典成句",
    "《尚书》成句",
    "作者引作之君、作之师说明传统君师观念。",
    173,
    "只收古典成句本体；不收中西制度与现代政治家论述语境。",
  ),
  q(
    "008.",
    191,
    "扶不起的阿斗",
    "俗语典故",
    "刘禅阿斗典故",
    "作者用扶不起的阿斗比喻无论扶助仍难成事的人。",
    191,
    "只收俗语典故本体；不收蒋经国、邓小平和国共派系语境。",
  ),
  q(
    "008.",
    195,
    "然诺重千金",
    "古典成句",
    "古典信义成句",
    "作者用然诺重千金形容重视承诺。",
    195,
    "只收成句本体；不收蒋介石、毛泽东和现代政治人物比较语境。",
  ),
  q(
    "008.",
    195,
    "礼贤下士",
    "成语",
    "中文成语",
    "作者用成语形容尊重贤才、谦待士人。",
    195,
    "只收成语本体；不收蒋介石性格、民主政治和现代政治评价语境。",
  ),
  q(
    "011.",
    9,
    "中学为体，西学为用",
    "近代文化成句",
    "张之洞洋务成句",
    "江南引用中学为体、西学为用概括近代留学与学习西方的主张。",
    9,
    "只收文化成句本体；不收蒋经国苏联经历、留学路线和现代政治史语境。",
  ),
  q(
    "014.",
    5,
    "无官不贪，无吏不污",
    "俗语化成句",
    "中文俗语化成句",
    "作者用成句形容官吏普遍贪污败坏。",
    5,
    "只收成句本体；不收台湾、国府、赣南和蒋青天政治包装语境。",
  ),
  q(
    "017.",
    49,
    "丞相于虎窟中逃难之时，全无惧怯；今到城中，人已得食，马已得料，正须整顿军马复仇，何反痛哭？",
    "小说文句",
    "《三国演义》赤壁后曹操哭郭嘉故事",
    "作者引《三国演义》中众谋士问曹操何以痛哭的文句。",
    49,
    "只收小说文句本体；不收戴笠、蒋介石祭墓和现代军政比附语境。",
  ),
  q(
    "017.",
    49,
    "吾哭郭奉孝耳！若奉孝在，决不使吾有此大失也！",
    "小说文句",
    "《三国演义》赤壁后曹操哭郭嘉故事",
    "作者引曹操哭郭奉孝、叹若奉孝在不致大失的小说文句。",
    49,
    "只收小说文句本体；不收戴笠不死等现代军政语录语境。",
  ),
  q(
    "017.",
    49,
    "哀哉，奉孝！痛哉，奉孝！惜哉，奉孝！",
    "小说文句",
    "《三国演义》赤壁后曹操哭郭嘉故事",
    "作者引曹操哀痛郭奉孝的排比哭辞。",
    49,
    "只收小说文句本体；不收戴笠、蒋介石和现代政治比附语境。",
  ),
  q(
    "018.",
    107,
    "盖棺定论",
    "成语",
    "中文成语",
    "江南用成语表示人死以后功过方可定论。",
    107,
    "只收成语本体；不收陈诚、吴国桢和现代政治人物评价语境。",
  ),
  q(
    "018.",
    153,
    "府令如山",
    "成语化文句",
    "中文成语化文句",
    "吴国桢以府令如山形容命令严明。",
    153,
    "只收成句本体；不收台湾省政府和政治治理语境。",
  ),
  q(
    "018.",
    153,
    "拖泥带水",
    "成语",
    "中文成语",
    "吴国桢以成语形容办事拖沓不爽快。",
    153,
    "只收成语本体；不收省府治理和政治人物自述语境。",
  ),
  q(
    "018.",
    175,
    "兵败如山倒",
    "俗语成语",
    "中文俗语",
    "江南以俗语成语形容战败后局势急转直下。",
    175,
    "只收俗语本体；不收国军战败和台湾去留判断语境。",
  ),
  q(
    "018.",
    315,
    "水宽山远烟霞回，天澹云闲今古同。",
    "对联",
    "曾国藩手书对联",
    "江南记张群赠吴国桢曾国藩手书对联。",
    315,
    "只收对联本体；不收张群、吴国桢交往和政治人物往来语境。",
  ),
  q(
    "018.",
    367,
    "哀鸿遍野",
    "成语",
    "中文成语",
    "吴国桢用成语形容灾民遍地、民生困苦。",
    367,
    "只收成语本体；不收湖北赈灾、财政部长和政治经历语境。",
  ),
  q(
    "018.",
    367,
    "情急生智",
    "成语",
    "中文成语",
    "吴国桢用成语说明情势急迫时生出办法。",
    367,
    "只收成语本体；不收宋子文、财政部和政治经历语境。",
  ),
  q(
    "018.",
    419,
    "我最大的成功，就是，凡是我手下的人，都比我能干。",
    "西方人物格言",
    "卡内基语",
    "作者引卡内基说自己最大的成功是手下的人都比自己能干。",
    419,
    "只收管理格言本体；不收吴国桢用人和当时政治人物语境。",
  ),
  q(
    "018.",
    419,
    "知人善用",
    "成语",
    "中文成语",
    "作者用成语概括善于识人并任用人才。",
    419,
    "只收成语本体；不收吴国桢用人和政治人物讨论语境。",
  ),
  q(
    "018.",
    445,
    "上下交征利而国危矣",
    "孟子名句",
    "《孟子·梁惠王上》",
    "吴国桢引用孟子名句，作为逐利交争会使国家危殆的警语。",
    445,
    "只收孟子句本体；不收美国、中国和现代政治经济评论语境。",
  ),
  q(
    "019.",
    29,
    "平步登天的终南捷径",
    "俗语成句",
    "中文俗语化成句",
    "江南用俗语化成句形容一步登高的捷径。",
    29,
    "只收成句本体；不收章亚若、蒋经国感情和私人生活语境。",
  ),
  q(
    "019.",
    177,
    "大胆假设，小心求证",
    "治学格言",
    "胡适治学格言",
    "注释引胡适治学格言，说明大胆提出假设而谨慎求证。",
    177,
    "只收治学格言本体；不收蒋经国日记、私生活和资料考证语境。",
  ),
  q(
    "020.",
    47,
    "祖师爷赏饭吃",
    "梨园俗语",
    "梨园行俗语",
    "作者用梨园俗语形容顾正秋天生适合唱戏。",
    47,
    "只收俗语本体；不收顾正秋、蒋经国和任显群三角关系语境。",
  ),
  q(
    "020.",
    47,
    "响遏行云",
    "成语",
    "《列子·汤问》成语",
    "作者用成语形容歌声高亢嘹亮。",
    47,
    "只收成语本体；不收顾正秋梨园经历和私人关系语境。",
  ),
  q(
    "020.",
    47,
    "绕梁三日",
    "成语",
    "《列子·汤问》成语",
    "作者用成语形容歌声余音不绝。",
    47,
    "只收成语本体；不收顾正秋梨园经历和私人关系语境。",
  ),
  q(
    "020.",
    81,
    "虽然在放逐的岁月中，甚至微小的方式上，都足以使任何一个人的精神为之破裂，我可以骄傲的说，虽然考验常常是来得那样强烈，但即是夜间的睡枕，也不是我心碎的见证人。",
    "外国人物散文句",
    "温莎公爵夫人文章",
    "作者引温莎公爵夫人关于放逐与考验中仍不让睡枕见证心碎的文字。",
    81,
    "只收外国人物散文句；不收顾正秋、感情风波和蒋经国私人生活语境。",
  ),
  q(
    "022.",
    11,
    "当仁不让",
    "论语成语",
    "《论语·卫灵公》",
    "作者用成语表示遇到应当承担的事不推让。",
    11,
    "只收成语本体；不收总统继任、蒋家接班和台湾政治体制语境。",
  ),
];

const proofreadRemovedRows = [];

const proofreadAdditions = [
  q(
    "006.",
    19,
    "为配王氏女合葬之，且为之立嗣",
    "家族礼制文句",
    "蒋介石宗法文字",
    "作者引蒋介石文字，说明为亡弟配王氏女合葬并立嗣。",
    19,
    "校对补入，只收家族礼制文句本体；不收蒋经国过继、冥婚批评和蒋家政治身份语境。",
  ),
  q(
    "006.",
    37,
    "大宗无子，不可以绝",
    "宗法成句",
    "薛蕙《为人后解》",
    "作者引薛蕙文字说明大宗无子不可使其断绝。",
    37,
    "校对补入，只收宗法成句本体；不收蒋家继嗣和现代人物家族语境。",
  ),
  q(
    "006.",
    37,
    "小宗无后，祖不绝；大宗无后，祖绝矣！",
    "宗法文句",
    "薛蕙《为人后解》",
    "作者引薛蕙文字对比小宗无后与大宗无后的宗法意义。",
    37,
    "校对补入，只收宗法文句本体；不收蒋家继嗣和现代人物家族语境。",
  ),
  q(
    "015.",
    25,
    "一筹莫展",
    "成语",
    "中文成语",
    "作者用成语说明到赣州后毫无办法。",
    25,
    "校对补入，只收成语本体；不收赣南专员、土霸和蒋经国行政语境。",
  ),
  q(
    "015.",
    25,
    "顺水推舟",
    "成语",
    "中文成语",
    "作者用成语说明顺着形势作出安排。",
    25,
    "校对补入，只收成语本体；不收赣南专员任命和行政政治语境。",
  ),
  q(
    "018.",
    21,
    "情词恳切，应予照准。",
    "官样文书成句",
    "阎锡山批语",
    "作者引公文批语中情词恳切、应予照准的套语。",
    21,
    "校对补入，只收官样文书成句；不收陈诚辞职、台湾省主席和行政院政治语境。",
  ),
  q(
    "018.",
    431,
    "一语中的",
    "成语",
    "中文成语",
    "作者用成语说明一句话说中要害。",
    431,
    "校对补入，只收成语本体；不收张群、吴国桢和蒋先生食客现代人物语境。",
  ),
  q(
    "019.",
    185,
    "冷落异常，触景伤怀",
    "日记散文句",
    "蒋经国《风雨中的宁静》日记",
    "作者引蒋经国日记中回家探望、冷落触景而伤怀的句子。",
    185,
    "校对补入，只收私人日记中的情景散文句；不收蒋家私生活和政治人物身份语境。",
  ),
  q(
    "020.",
    15,
    "不羁之才",
    "人物评语成句",
    "吴国桢评语",
    "作者引吴国桢称任显群为不受拘束的才士。",
    15,
    "校对补入，只收人物评语成句；不收任显群、财政厅和蒋经国顾正秋关系语境。",
  ),
  q(
    "020.",
    59,
    "叹为观止",
    "成语",
    "中文成语",
    "作者用成语形容道行高到令人赞叹。",
    59,
    "校对补入，只收成语本体；不收许丙、顾正秋和台湾地方政治语境。",
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
  ...proofreadRemovedRows.map((row) => {
    const present = quotePresent(row);
    const politicalHits = hasPoliticalHit(row);
    return { action: "remove", reason: "校对删除", row, present, politicalHits };
  }),
  ...proofreadAdditions.map((row) => {
    const finalRow = selectedVersion(row);
    const present = quotePresent(finalRow);
    const politicalHits = hasPoliticalHit(finalRow);
    return { action: "add", reason: "校对补入非政治诗文格言条目", row: finalRow, present, politicalHits };
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

const reportLines = [
  `${book} proofread extraction report`,
  `generatedDate: ${generatedDate}`,
  `sourceDir: ${sourceDir}`,
  `sourceFilesForExport: ${files.length}`,
  `quoteCandidates: ${quoteCandidates}`,
  `uniqueQuoteTexts: ${uniqueQuoteTexts}`,
  `keywordLines: ${keywordLines}`,
  `reviewCandidates: ${reviewCandidateLines}`,
  `initialSelectedRowsBeforeProofread: ${rawRows.length}`,
  `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
  `proofreadAddedRows: ${proofreadAdditions.length}`,
  `selectedRows: ${selectedRows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is dominated by Chiang Ching-kuo/Chiang family studies, KMT/Taiwan party-state disputes, martial-law politics, secret-police materials, succession debates, Soviet experience, assassination and modern anti-Chiang/pro-Chiang polemics; exclude direct modern party, regime, leader, president, military, war, revolution, state, national-identity, diplomacy, constitutional, human-rights, ideological and succession quotations, while keeping independently reusable classical poetry/prose, ritual prose, idioms, proverbs, couplets, literary quotations and non-political maxims.",
  "",
  "selectedHighlights:",
  "- 缘起/004/005: 收“以子之矛，攻子之盾”、宋案叙述中的通用成语和《嵩高山记》异闻；李敖诉讼、总统暗杀和袁世凯政治攻防语录不收。",
  "- 006/007: 收《周礼》、邴原、《元史》、孔子、薛蕙、民事习惯文献、“为配王氏女合葬之，且为之立嗣”、“大宗无子，不可以绝”、糟糠成句和王安石诗句；蒋家过继、冥婚批评和现代政治人物身份语境不收。",
  "- 008/011/014: 收“诗以人传”、朱元璋咏菊诗、苏轼诗句、《周易》成句、“中学为体，西学为用”等；毛泽东词、斯大林名言、接班论和现代意识形态语录不收。",
  "- 015/017/018: 校对补入“一筹莫展”“顺水推舟”“情词恳切，应予照准。”“一语中的”；另收《三国演义》曹操哭郭嘉文句、曾国藩手书对联、卡内基格言、孟子句及若干通用成语；戴笠、吴国桢、蒋氏父子和国府政治评价语境不收。",
  "- 019/020/022: 校对补入“冷落异常，触景伤怀”“不羁之才”“叹为观止”；另收“大胆假设，小心求证”、梨园俗语、声乐成语、温莎公爵夫人文字和“当仁不让”；私人生活、接班和台湾政治体制语境不收。",
  "",
  "excludedHighlights:",
  "- 001/002/003/004: 诋毁元首、骂总统、总统任期、暗杀政敌等现代政治史料和政治讽刺语录不收。",
  "- 008/011/013/015/021/022/024/025: 毛泽东、斯大林、青年军口号、“有比无好，快比慢好，多比少好”、光复大陆、总统继任、接班人和蒋经国致母政治信件均从严不收。",
  "- 014/017/018/019: 蒋青天、戴笠不死、戴笠不死大陆不亡、国民大会法统、总统继任、蒋吴争斗、蒋家私生活与现代人物评价语录不收；只留可独立检索的诗文、成语、俗语、典故和非政治格言。",
  "- 024: Asiaweek 相关政权、总统、民主和法统评论语录，以及“实践是检验真理的标准”等现代政治/意识形态口号不收。",
];

fs.writeFileSync(reportTxt, reportLines.join("\n") + "\n", "utf8");
fs.writeFileSync(proofreadReportTxt, reportLines.join("\n") + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rows: selectedRows.length,
      missing: missing.length,
      duplicates: duplicates.length,
      politicalHitRows: politicalHits.length,
      quoteCandidates,
      uniqueQuoteTexts,
      keywordLines,
      reviewCandidates: reviewCandidateLines,
      initialRows: rawRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
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
