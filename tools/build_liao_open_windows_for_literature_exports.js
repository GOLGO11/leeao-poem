const fs = require("fs");
const path = require("path");

const book = "为文学开窗";
const idPrefix = "LAWXKC";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "012.为文学开窗");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_open_windows_for_literature_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_open_windows_for_literature_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_open_windows_for_literature_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_open_windows_for_literature_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_open_windows_for_literature_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_open_windows_for_literature_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_open_windows_for_literature_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_open_windows_for_literature_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_open_windows_for_literature_proofread_report.txt");
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
      "首轮保守收入：本书以文学批评、翻译、古书整理和文坛论争为主；普通小说对白、标题碎片、现代文坛互骂、党国/政论/革命/选举/政府机关语录不收，只保留能独立检索的诗文、古书典故、翻译文本、文学格言和非政治性写作格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    35,
    "你吃一个坏了的蛋的时候，难道全吃下去，才知道它是坏蛋吗？",
    "文学批评格言",
    "李敖答话",
    "李敖用坏蛋比喻说明判断劣质文坛作品不必逐一读尽。",
  ),
  q(
    "001.",
    95,
    "余弱冠时，读书杭州，闻有某贾人女，明艳工诗，以酷嗜《红楼梦》，致成瘵疾。当绵惙时，父母以是书贻祸，取投之火。女在床，乃大哭曰：“奈何烧煞我宝玉！”遂死。杭州人传以为笑。",
    "清人笔记",
    "陈子庄《庸闲斋笔记》",
    "李敖引用清人笔记中痴迷《红楼梦》的故事，用作文艺影响的反面掌故。",
  ),
  q(
    "001.",
    426,
    "灵对肉的援助并不比肉对灵来得多。",
    "外国诗句",
    "勃朗宁诗句",
    "李敖引用勃朗宁诗句，说明灵与肉互相成就、不可偏废。",
  ),
  q(
    "001.",
    448,
    "儒者论曰：天地故生人，此言妄也！夫天地合气，人偶自生也。犹夫妇合气，子则自生也。夫妇合气，非当时欲得生子，情欲动而合，合而生子矣！且夫妇不故生子，以知天地不故生人也。",
    "古典哲学文句",
    "王充《论衡·物势》",
    "李敖引用王充文字，说明天地与生育并非有意造作，而是自然合气而生。",
  ),
  q(
    "001.",
    544,
    "每张我碰到的脸上都有一个痕迹，软弱的痕迹，苦恼的痕迹。A mark in every face I meet, Marks of weakness, marks of woe.",
    "外国诗句",
    "布雷克诗句",
    "李敖引用布雷克诗句，说明软弱与苦恼的文学气息。",
    550,
  ),
  q(
    "003.",
    153,
    "满招损、谦受益",
    "古典格言",
    "《尚书·大禹谟》成句",
    "来信者借古训劝人谦虚受益、骄满招损。",
  ),
  q(
    "003.",
    153,
    "虚怀若谷",
    "成语",
    "中国成语",
    "来信者用成语劝人胸怀宽广、能纳意见。",
  ),
  q(
    "003.",
    179,
    "人之不死，不仅因为他有忍受的能力，而是因为他有灵魂和精神，能同情、牺牲和忍受。诗人和作家的责任就在描写这些，以提高人们的情绪、勇气、希望、荣誉、自尊、同情、怜悯、牺牲和光荣，帮助他们忍受困难。",
    "外国文学格言",
    "福克纳诺贝尔文学奖演说",
    "来信者引用福克纳演说，说明诗人与作家的责任在提高人的精神力量。",
  ),
  q(
    "003.",
    181,
    "宁缺毋滥",
    "成语格言",
    "中国成语",
    "来信者用成语劝作家少写粗劣作品，宁可缺少也不要滥造。",
  ),
  q(
    "003.",
    181,
    "放下屠刀立地成佛",
    "佛家成语",
    "佛教成语",
    "来信者借佛家成语劝人停止有害创作、改过向善。",
  ),
  q(
    "007.",
    7,
    "立身先须谨重文章且须放荡",
    "古典文论",
    "梁简文帝《诫当阳公大心书》",
    "居浩然引梁简文帝文字，提出做人应谨重而文章须放荡的文论。",
  ),
  q(
    "007.",
    11,
    "心中有魇，则好比头上戴了紧箍帽，写文章时不敢稍逾范围，也就放不开或放荡不起来了。",
    "写作格言",
    "居浩然语",
    "居浩然用“魇”解释写作者心中禁制，说明文章不能放开的原因。",
  ),
  q(
    "007.",
    19,
    "万般皆下品，唯有读书高",
    "俗语",
    "中国俗语",
    "居浩然引用俗语，说明传统教育把读书视为最高升进道路。",
  ),
  q(
    "007.",
    27,
    "文章先须放荡，落笔更须恣肆",
    "文论格言",
    "居浩然化用梁简文帝语",
    "居浩然化用古人文论，称赞李敖文章放得开而落笔恣肆。",
  ),
  q(
    "008.",
    5,
    "硕鼠硕鼠，胖老鼠啊胖老鼠，无食我黍！别吃我黄黍！三岁贯女，养你养了三年多，莫我肯顾。你却对我不照顾。逝将去女，我要发誓离开你，适彼乐土。去到那乐土。乐土乐土，乐土啊乐土，爰得我所。那儿才是我住处。硕鼠硕鼠，胖老鼠啊胖老鼠，无食我麦！别吃我小麦！三岁贯女，养你养了三年多，莫我肯德。你却对我还赖债。逝将去女，我要发誓离开你，适彼乐国。去到那乐国。乐国乐国，乐国啊乐国，爰得我直。那儿一住才值得。硕鼠硕鼠，胖老鼠啊胖老鼠，无食我苗！别吃我禾苗！三岁贯女，养你养了三年多，莫我肯劳。你却对我不慰劳。逝将去女，我要发誓离开你，适彼乐郊。去到那乐郊。乐郊乐郊，乐郊啊乐郊，谁之永号？那儿住下，谁还大哭大号？",
    "诗经今译",
    "《诗经·魏风·硕鼠》原诗及李敖今译",
    "李敖列出《硕鼠》原诗并作白话今译，用作古代诗歌今译例证。",
    51,
  ),
  q(
    "009.",
    3,
    "吾死以后，中夏文化亦亡矣！",
    "文化格言",
    "章太炎语",
    "李敖引用章太炎自我期许之语，说明他以中夏文化传承自任。",
    3,
    "只收文化自任之语，不收同段革命履历。"
  ),
  q(
    "009.",
    15,
    "这五十年是中国古文学的结束时期。……恰好有一个章炳麟，真可算是古文学很光荣的结局了！",
    "文学史评语",
    "胡适《五十年来中国之文学》",
    "李敖引用胡适评章太炎语，说明章太炎在中国古文学尾声中的位置。",
  ),
  q(
    "009.",
    19,
    "蹈海千行旅，磨坚一秃翁。蒹葭随露白，鸿雁入云空。地坼成初郡，民劳不素风。试吟紫芝曲，应与夏黄同。",
    "近代诗",
    "章太炎《寄亦韩仲荪》",
    "李敖录章太炎五言律诗，特别指出末句用商山四皓夏黄公“紫芝曲”典故。",
    25,
  ),
  q(
    "010.",
    3,
    "我已梦得疲惫不堪。",
    "外国诗句译文",
    "叶芝诗句译文",
    "李敖引用叶芝老年诗句的中文译文，表现梦的疲惫与珍惜。",
  ),
  q(
    "010.",
    3,
    "I am worn out with dreams.",
    "外国诗句",
    "W. B. Yeats",
    "李敖引用叶芝诗句原文，表现梦的疲惫。",
  ),
  q(
    "010.",
    5,
    "Had I heaven's embroidered cloths, Enwrought with golden and silver light, The blue and the dim and the dark cloths Of night and light and the half light, I would spread the colths under you feet; But I, being poor, have only my dreams; I have spread my dreams under your feet; Tread softly because you tread on my dreams.",
    "外国诗",
    "W. B. Yeats, He wishes for the Cloths of Heaven",
    "李敖引用叶芝《他想要天上的呢绒》原诗，表现以梦铺在爱人脚下的脆弱心意。",
    19,
    "源文作 colths 与 you feet，按源文保留以便回查。",
  ),
  q(
    "010.",
    25,
    "若我有天上的呢绒，上面绣着灿烂的金银线，那蔚蓝、暗灰和漆黑色的呢绒代表着白昼、黄昏和夜晚，我要将这呢绒铺在你的脚下；但是，我因为穷，只有自己的梦；现在，我已将我的梦铺在你的脚下；轻点儿踩呀，因为你踩的是我的梦。",
    "外国诗译文",
    "陈绍鹏译叶芝诗",
    "李敖引用陈绍鹏译叶芝《他想要天上的呢绒》，作为英诗中译例。",
    39,
  ),
  q(
    "010.",
    41,
    "我觉得英诗的meter似乎有赖于古诗的平仄来传神，若是只有脚韵，则难免成为一句（包括半句子句及短句）一行的分列式散文了。",
    "翻译格言",
    "居浩然语",
    "李敖引用居浩然论英诗中译的话，说明英诗节奏可借古诗平仄传神。",
  ),
  q(
    "010.",
    43,
    "如有天孙锦 愿为君铺地 镶金复镶银 明暗日夜继 家贫锦难求 唯有以梦替 践履慎轻置 吾梦不堪碎",
    "外国诗古体译",
    "居浩然译叶芝诗",
    "李敖引用居浩然用古诗体裁翻译叶芝诗，认为最为传神。",
    57,
  ),
  q(
    "011.",
    5,
    "挂帆沧海，风波茫茫，或沦无底，或达仙乡。It may be that the gulfs will wash us down; It may be we shall touch the Happy Isles.",
    "外国诗译文",
    "丁尼生《尤利西斯》，严复《天演论》译引",
    "李敖引用严复译丁尼生诗句，称其信雅达俱佳。",
    11,
  ),
  q(
    "011.",
    17,
    "名满天下，谤亦随之",
    "成语格言",
    "中国成语",
    "李敖用成语说明赫胥黎宣扬达尔文学说后名声与诽谤并至。",
  ),
  q(
    "011.",
    17,
    "匹夫而为百世师，一言而为天下法",
    "古典成句",
    "苏轼《潮州韩文公庙碑》",
    "李敖借苏轼成句赞赏赫胥黎有可为百世师、天下法的大儒气概。",
  ),
  q(
    "011.",
    17,
    "迭相食，非相为而生之",
    "古典哲学文句",
    "《列子》鲍氏之子语",
    "李敖引用《列子》语，说明生物相食并非彼此预设而生。",
  ),
  q(
    "017.",
    3,
    "“信”“雅”“达”",
    "翻译原则",
    "严复译事原则",
    "李敖引用严复翻译原则，并推及理解中国古人与今人思想的表达。",
  ),
  q(
    "017.",
    3,
    "辞达",
    "论语成句",
    "《论语·卫灵公》",
    "李敖引用孔子“辞达”观念，说明表达思想要清楚。",
  ),
  q(
    "017.",
    3,
    "知言",
    "孟子成句",
    "《孟子》",
    "李敖引用孟子“知言”，说明理解别人思想表达的重要。",
  ),
  q(
    "017.",
    7,
    "Le seul mot juste, the unique right word",
    "外国文论",
    "福楼拜文论",
    "李敖引用福楼拜追求唯一合适字词的文论，说明广义修辞学目标。",
  ),
  q(
    "018.",
    11,
    "忧劳所以兴国，逸豫适足亡身",
    "古典史论成句",
    "欧阳修《新五代史·伶官传序》",
    "李敖讨论作文题出典时引用欧阳修成句，说明用典必须知道来源。",
    11,
    "只收古典成句本体，不收同段考试与官方护航争论。",
  ),
  q(
    "018.",
    13,
    "鲍叔牙奉杯而起曰：‘使公毋忘出入莒时也，使管子毋忘束缚在鲁也，使宁戚毋忘饭牛车下也。’桓公避席再拜曰：‘寡人与二大夫能毋忘夫子之言，国之社稷必不危矣！’",
    "古书典故",
    "《管子》",
    "李敖引用《管子》中“毋忘在莒”原典，说明典故本义。",
  ),
  q(
    "018.",
    13,
    "鲍叔奉酒而起曰：‘祝吾君无忘其出而在莒也，使管仲无忘其束缚而从鲁也，使宁子无忘其饭牛于车下也。’桓公避席再拜曰：‘寡人与二大夫皆无忘夫子之言，齐之社稷必不废矣！’此言常思困隘之时，必不骄矣！",
    "古书典故",
    "《新序》",
    "李敖并引《新序》中相近文字，说明“毋忘在莒”典故的训诫意义。",
  ),
  q(
    "020.",
    15,
    "把难以分类的古书，纳入现代分类，是这套《中国名著精华全集》的一个特色。",
    "读书出版格言",
    "李敖《〈中国名著精华全集〉序》",
    "李敖自引序文，说明古书整理应纳入现代分类。",
  ),
  q(
    "020.",
    21,
    "作为新时代的中国人，我们评判文章，实在该用一种新的标准，我们必须放弃什么山水标准、什么雅俗标准、什么气骨标准、什么文白标准。我们看文章，要问的只是两个问题：一、要表达什么？二、表达得好不好？",
    "文学批评格言",
    "李敖《〈中国名著精华全集〉序》",
    "李敖自引序文，提出评判文章应回到表达内容与表达效果两个问题。",
  ),
  q(
    "020.",
    43,
    "百余年来之为学者，往往言心言性，而茫然不得其解也。……聚宾客门人数十百人，与之言心、言性，舍‘多学而识’以求‘一贯’之方，置四海困穷不言，而讲危微精一。……我弗敢知也。……愚所谓圣人之道者如之何？曰博学于文、曰行己有耻。自一身以至于天下国家，皆学之事也；自子臣弟友以至出入往来辞受取与之间，皆有耻之事也。士而不先言耻，则为无本之人；非好古多闻，则为空虚之学。以无本之人，而讲空虚之学，吾见其日从事于圣人，去之弥远也。",
    "古典治学格言",
    "顾炎武语",
    "李敖引用顾炎武论学文字，说明为学应博学于文、行己有耻，不能空谈心性。",
  ),
  q(
    "020.",
    47,
    "在南宋人著述之中，最切于实用，胜理气心性之空谈。",
    "古书评价语",
    "李敖引评《救荒活民书》语",
    "李敖引用评价语，说明《救荒活民书》切于实用、胜过空谈心性。",
  ),
  q(
    "020.",
    93,
    "把现代人看古书的问题，得到满意的一次解决",
    "读书出版格言",
    "李敖《〈中国名著精华全集〉序》",
    "李敖自引序文，说明《中国名著精华全集》意在解决现代人读古书的问题。",
  ),
  q(
    "020.",
    95,
    "集天下之书为一书",
    "读书志愿",
    "郑樵志愿",
    "李敖引用郑樵宏愿，说明总集中国古书的出版理想。",
  ),
  q(
    "021.",
    3,
    "陶渊明意不在诗，诗以寄其意耳。采菊东篱下，悠然望南山，则既采菊又望山，意尽于此，无余蕴矣，非渊明意也。采菊东篱下，悠然见南山，则本自采菊，无意望山，适举首而见之，故悠然忘情，趣闲而景远。……",
    "诗话",
    "《鸡肋集》记苏轼语",
    "李敖引用苏轼论陶渊明诗句，辨析“见南山”与“望南山”的境界差异。",
  ),
  q(
    "021.",
    5,
    "无意‘望’山，适举首而‘见’之",
    "诗学格言",
    "李敖释陶诗语",
    "李敖据苏轼诗话概括“见”与“望”的不同审美境界。",
  ),
];

const proofreadExclusions = new Map([
  [
    "吾死以后，中夏文化亦亡矣！",
    "现代人物文化自任语，所在段落强绑定革命、国民党、软禁等政治履历；校对轮按政治人物语录边界删除。",
  ],
  [
    "把现代人看古书的问题，得到满意的一次解决",
    "序文中的宣传性半句，依附《中国名著精华全集》出版说明，独立诗文格言价值不足。",
  ],
]);

const proofreadContinueExcludes = [
  [
    "continue-exclude",
    "political_context",
    "009.“试吟紫芝曲，应与夏黄同”.txt",
    "33-35",
    "虽好作政论 / 学生请愿 / 共党 / 政策",
    "章太炎政治活动与抗日/党派段落，继续排除，只保留前面的文学史评语和五言诗。",
  ],
  [
    "continue-exclude",
    "modern_political_publication",
    "020.介绍一套你该一看的奇书.txt",
    "17;39",
    "凡为帝王者，皆贼也 / 当政者“不准看”的禁书",
    "现代出版说明中涉及帝王、禁书、当政者的政治判断，首轮未收，校对确认继续排除。",
  ],
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "国民党",
  "民进党",
  "台独",
  "总统",
  "副总统",
  "总统府",
  "立法院",
  "行政院",
  "司法院",
  "选举",
  "竞选",
  "中华民国",
  "蒋介石",
  "蒋经国",
  "李登辉",
  "陈水扁",
  "政治",
  "政党",
  "政权",
  "革命",
  "反共",
  "戒严",
  "党禁",
  "国民大会",
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvCell(value) {
  return String(value ?? "").replace(/\r?\n/g, " ").replace(/\t/g, " ");
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
function rowCompare(a, b) {
  const fileDiff = fileIndex.get(a.source_file) - fileIndex.get(b.source_file);
  if (fileDiff) return fileDiff;
  if (a.line_start !== b.line_start) return a.line_start - b.line_start;
  return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
}

const initialRows = [...rawRows].sort(rowCompare).map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const proofreadRemovedRows = initialRows
  .filter((row) => proofreadExclusions.has(row.quote_text))
  .map((row) => ({
    ...row,
    original_id: row.id,
    reason: proofreadExclusions.get(row.quote_text),
  }));

const rows = initialRows
  .filter((row) => !proofreadExclusions.has(row.quote_text))
  .map((row, index) => ({
    ...row,
    original_id: row.id,
    id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
    notes: `${row.notes} 校对轮：通过复核，保留；最终编号可能较首轮审计编号顺延。`,
  }));

const auditRows = rows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of rows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = rows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

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

fs.writeFileSync(outCsv, `${header}\n${rows.map(rowToCsv).join("\n")}\n`, "utf8");

const txt = rows
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
fs.writeFileSync(outTxt, `${book} 诗文格言歌谣引用\n生成日期：${generatedDate}\n条目数：${rows.length}\n\n${txt}\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

fs.writeFileSync(
  reviewTsv,
  [
    "id\tsource_file\tline_start\tline_end\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
    ...rows.map((row) =>
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

const candidatesData = fs.existsSync(candidatesJson) ? JSON.parse(fs.readFileSync(candidatesJson, "utf8")) : null;
const quoteCandidates = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "quote").length
  : candidatesData?.quoteCandidates?.length ?? "missing";
const keywordLines = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "keyword_line").length
  : candidatesData?.keywordLines ?? "missing";
const reviewCandidateLines = fs.existsSync(reviewCandidatesTsv)
  ? fs.readFileSync(reviewCandidatesTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";
const attributedLines = fs.existsSync(attributedTsv)
  ? fs.readFileSync(attributedTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";

fs.writeFileSync(
  proofreadAuditTsv,
  [
    ["action", "original_id", "final_id", "source_file", "line_range", "quote_text", "reason"].join("\t"),
    ...proofreadRemovedRows.map((row) =>
      [
        "removed",
        row.original_id,
        "",
        row.source_file,
        `${row.line_start}-${row.line_end}`,
        row.quote_text,
        row.reason,
      ].map(tsvCell).join("\t"),
    ),
    ...proofreadContinueExcludes.map((row) =>
      ["continue-exclude", "", "", row[2], row[3], row[4], row[5]].map(tsvCell).join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

fs.writeFileSync(
  proofreadReportTxt,
  [
    `${book} proofread extraction report`,
    `generatedDate: ${generatedDate}`,
    `sourceDir: ${sourceDir}`,
    `initialSelectedRows: ${initialRows.length}`,
    `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
    `proofreadAddedRows: 0`,
    `selectedRows: ${rows.length}`,
    `missingQuotes: ${missing.length}`,
    `duplicateTexts: ${duplicates.length}`,
    `politicalHitRows: ${politicalHits.length}`,
    "",
    "proofread policy: keep independently reusable literary, classical, translation, poetics, and reading/writing material; remove modern political-person context, direct political/party/government/revolutionary material, and fragments that only work as publication promotion or article scaffolding.",
    "",
    "removedRows:",
    ...proofreadRemovedRows.map(
      (row) => `- ${row.original_id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}\t${row.reason}`,
    ),
    "",
    "continueExcludedHighlights:",
    ...proofreadContinueExcludes.map((row) => `- ${row[2]}:${row[3]}\t${row[4]}\t${row[5]}`),
  ].join("\n") + "\n",
  "utf8",
);

fs.writeFileSync(
  reportTxt,
  [
    `${book} initial extraction report`,
    `generatedDate: ${generatedDate}`,
    `sourceDir: ${sourceDir}`,
    `sourceFiles: ${files.length}`,
    `quoteCandidates: ${quoteCandidates}`,
    `keywordLines: ${keywordLines}`,
    `reviewCandidates: ${reviewCandidateLines}`,
    `attributedLines: ${attributedLines}`,
    `initialSelectedRows: ${initialRows.length}`,
    `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
    `selectedRows: ${rows.length}`,
    `missingQuotes: ${missing.length}`,
    `duplicateTexts: ${duplicates.length}`,
    `politicalHitRows: ${politicalHits.length}`,
    "policy: this book is literary criticism and textual scholarship; exclude ordinary novel dialogue, title fragments, modern literary attacks, party/state/government/election/revolutionary quotes, and direct political slogans, while keeping independently reusable poems, classical prose, literary aphorisms, translation examples, and writing/reading maxims.",
  ].join("\n") + "\n",
  "utf8",
);

console.log(
  JSON.stringify(
    {
      book,
      rows: rows.length,
      missing: missing.length,
      duplicates: duplicates.length,
      politicalHitRows: politicalHits.length,
      quoteCandidates,
      keywordLines,
      reviewCandidates: reviewCandidateLines,
      attributedLines,
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
      proofreadAuditTsv,
      proofreadReportTxt,
      initialRows: initialRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
    },
    null,
    2,
  ),
);
