const fs = require("fs");
const path = require("path");

const book = "胡适与我";
const idPrefix = "LAHSYW";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "003.胡适与我");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_hushi_yuwo_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_hushi_yuwo_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_hushi_yuwo_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_hushi_yuwo_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_hushi_yuwo_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_hushi_yuwo_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_hushi_yuwo_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_hushi_yuwo_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_hushi_yuwo_proofread_report.txt");
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

function sourceFile(prefix) {
  const found = files.find((file) => file.startsWith(prefix));
  if (!found) throw new Error(`Source file not found for prefix: ${prefix}`);
  return found;
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"'「」『』]/g, "")
    .replace(/\s+/g, "");
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
      "校对轮保守收入：本书大量涉及胡适遗著、论战、党派、宪政、战时外交和现代政治人物；本轮继续排除明显政论、现代政治争辩、政治人物攻防、法律案材料、碎片化场景笑话和过度具体的人物评语，只保留可独立成立的寿诗、古典文句、治学方法、书话格言、语文格言、幽默语和非政治出版/编选格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "《胡适与我》自序",
    3,
    "交友以自大其身，求士以求此身之不朽",
    "古典格言",
    "李恕谷语，胡适转引",
    "李敖在自序中转述胡适喜欢引用的李恕谷名言，用来说明求友与求士的身后意义。",
  ),
  q(
    "《胡适与我》自序",
    11,
    "吾志若不就，他无所愿，但愿先子死耳！",
    "知己文句",
    "王源《刘处士墓表》记刘献廷语",
    "李敖借刘献廷未成其志而托望知己的感叹，说明识人、传人的情义。",
  ),
  q(
    "《胡适与我》自序",
    11,
    "吾生平知己，舍子其谁？得子为吾传以传，复何恨哉？",
    "知己文句",
    "王源《刘处士墓表》记刘献廷语",
    "李敖借刘献廷以知己作传为憾事已足的文句，说明身后文章的托付。",
  ),
  q(
    "001.",
    5,
    "哈哈笑声里，\n六十八岁来到，\n看你白头少年，\n一点都不老。\n寿星说话不妨多，\n喝酒可要少，\n不然太太晓得，\n那可不得了！",
    "寿诗",
    "李敖《好事近》",
    "李敖给胡适六十八岁生日的小词，写得轻快诙谐。",
    19,
  ),
  q(
    "001.",
    29,
    "凡能做打油诗的，才可以做好诗。",
    "诗论格言",
    "胡适回信",
    "胡适回李敖生日诗时对打油诗与好诗关系的幽默判断。",
  ),
  q(
    "001.",
    39,
    "南港山边吹寿风，一吹吹上一老翁，六十九年真好过，今天又要做寿星。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第一首，写南港寿风与寿星。",
    41,
  ),
  q(
    "001.",
    45,
    "昨晚读书到三更，“动手动脚”大用功，野鸡报晓才睡觉，不梦周公梦任公。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第二首，以读书到三更写胡适勤读与旧友。",
    47,
  ),
  q(
    "001.",
    51,
    "怀疑直疑到王充，橘汁喝下谈笑生，有人愈老愈顽固，院长愈老愈年轻。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第三首，以王充、怀疑精神和老而年轻作寿意。",
    53,
  ),
  q(
    "001.",
    57,
    "“人生七十古来稀”，“旧梦”应该梦老妻，卫生麻将随处打，纽约却闹三缺一。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第四首，借古句和家庭生活写诙谐寿意。",
    59,
  ),
  q(
    "001.",
    63,
    "博士虽老却多情：情书常到纽约城，半日独做骨牌戏，“一生梦想大光明”。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第五首，写胡适晚年情趣与乐观。",
    65,
  ),
  q(
    "001.",
    69,
    "高才经济在从容，大刀阔斧不雕虫，杀鸡何须屠龙手？垂老应知莫“拷红”。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第六首，以大才不雕虫写胡适气度。",
    71,
  ),
  q(
    "001.",
    75,
    "四十年来做文雄，但求立异不求同，佛法无边难清算，故国胡适有“幽灵”。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第七首，写胡适文名与立异精神。",
    77,
  ),
  q(
    "001.",
    81,
    "拥护科学不谈玄：研究和尚不参禅，洋房明镜笑白发，如此新派老少年！",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第八首，写科学态度与新派老少年。",
    83,
  ),
  q(
    "001.",
    93,
    "大笔蓝天抹彩霞，右臂写得有点麻，年轻“努力向上跑”；年老仍然向前爬。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第十首，把早年努力与晚年奋进连在一起。",
    95,
  ),
  q(
    "001.",
    99,
    "当年提倡写白话，四十年来不变卦，真理自古要辩驳，哪能缩头怕挨骂？",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第十一首，写白话与辩驳真理的精神。",
    101,
  ),
  q(
    "001.",
    117,
    "千篇文字百卷书，又领“风骚”又高呼，“福不唐捐”功须记，圣人自古不空出！",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第十四首，写文字成就与功不唐捐。",
    119,
  ),
  q(
    "001.",
    129,
    "不知老来不知愁，垂柳三尺不嫌柔，西风虽笑长条弱，几番风雨鞭高楼。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第十六首，以垂柳写老来韧性。",
    131,
  ),
  q(
    "001.",
    141,
    "书房南面拥百城，“无智”“无为”又“无能”，高鸣何须求“灵乌”？忍看老友渐凋零！",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第十八首，写书房、老友与自嘲式典故。",
    143,
  ),
  q(
    "001.",
    159,
    "爱乌兴来做诗篇，呢喃献媚心不甘，浮云遮眼何足畏？不可救药是乐观。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第二十一首，写乐观气质。",
    161,
  ),
  q(
    "001.",
    165,
    "挪威文豪有名言：“现在好像翻了船”。世乱浮海遭飘荡，生还可遂不偶然。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第二十二首，借挪威文豪名言写漂泊与生还。",
    167,
  ),
  q(
    "001.",
    195,
    "笑口常开不发怒，认真每做周郎顾，洋烟一包大量抽，埋头狂校水经注。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第二十七首，以生活细节写胡适风神。",
    197,
  ),
  q(
    "001.",
    201,
    "烟尘弥漫千重雾，辛苦或失“楼前树”，达者无为无不为，且为后世铺长路。",
    "寿诗",
    "李敖《白话打油诗三十首》",
    "李敖七十寿诗第二十八首，写达者在困境中为后世铺路。",
    203,
  ),
  q(
    "003.",
    9,
    "没被开除，没被开除，开除还得了？",
    "幽默语",
    "胡适语",
    "李敖记胡适谈怕太太协会时的幽默答语。",
  ),
  q(
    "003.",
    41,
    "所谓“三从”就是：太太下令要“服从”，太太上街买东西或是看朋友打麻将要“随从”，太太发错了脾气冤枉了先生要“盲从”。",
    "幽默语",
    "胡适谈惧内",
    "胡适把传统三从改写成怕太太的诙谐说法。",
  ),
  q(
    "005.",
    73,
    "若吾则昆山之圃，到处如是璆琳琅玕，并不患人拾去数块也！",
    "学问譬喻",
    "章太炎信",
    "章太炎以昆山玉圃比喻自家学问丰厚，不怕别人拾取。",
  ),
  q(
    "005.",
    95,
    "若必取难解者而强解之，纵人或信我，而自心转不自信也。",
    "治学格言",
    "章太炎信",
    "章太炎论解读难文不可勉强附会。",
  ),
  q(
    "005.",
    119,
    "经多陈事实；诸子多明义理",
    "治学格言",
    "章太炎信",
    "章太炎概括治经与治诸子的基本差异。",
  ),
  q(
    "005.",
    123,
    "训诂之术，略有三途：一曰直训，二曰语根，三曰界说。",
    "治学格言",
    "章太炎信",
    "章太炎概括训诂方法的三种路径。",
  ),
  q(
    "005.",
    143,
    "校勘已审，然后本子可读：本子可读，然后训诂可明：训诂明，然后义理可定。",
    "治学格言",
    "胡适论治古书",
    "胡适说明校勘、训诂、义理之间的次第。",
  ),
  q(
    "005.",
    173,
    "这五十年是中国古文学的结束时期。做这个大结束的人物，很不容易得。恰好有一个章炳麟，真可算是古文学很光荣的结局了。",
    "文学评语",
    "胡适评章太炎",
    "胡适把章太炎看作古文学结束时期的光荣结局。",
  ),
  q(
    "005.",
    175,
    "其余的只是结集、只是语录、只是稿本，但不是著作。",
    "书话格言",
    "胡适评章太炎",
    "胡适区分结构完整的著作与一般结集、语录、稿本。",
  ),
  q(
    "005.",
    175,
    "他的古文学功夫很深，他又是很富于思想与组织力的，故他的著作在内容与形式两方面，都能“成一家言”。",
    "文学评语",
    "胡适评章太炎",
    "胡适评价章太炎作品能在内容和形式上成一家言。",
  ),
  q(
    "005.",
    179,
    "古文学须有学问与论理做底子",
    "文学格言",
    "胡适评章太炎",
    "胡适从章太炎成败中抽出的文学判断。",
  ),
  q(
    "005.",
    209,
    "研究一种学问应该参考的书是多至不可计的。",
    "读书格言",
    "顾颉刚回忆陈伯弢",
    "顾颉刚回忆陈伯弢讲学时得到的读书启发。",
  ),
  q(
    "005.",
    211,
    "他虽没有伯弢先生读书多，但在裁断上，是足以自立的。",
    "治学评语",
    "顾颉刚评胡适",
    "顾颉刚初听胡适中国哲学史课后，对胡适裁断能力的判断。",
  ),
  q(
    "005.",
    211,
    "胡先生讲得的确不差，他有眼光、有胆量、有断制，确是一个有能力的历史家。",
    "治学评语",
    "顾颉刚评胡适",
    "顾颉刚赞胡适讲课有眼光、胆量和断制。",
  ),
  q(
    "005.",
    235,
    "水浒、红楼作者，均博极群书之人，总之非读破万卷，不能为古文，亦并不能为白话。",
    "文学格言",
    "林纾语，蔡元培转引",
    "蔡元培答林纾时转引林纾论读书与古文、白话的关系。",
  ),
  q(
    "005.",
    245,
    "学术上的派别是相对的，不是绝对的",
    "学术格言",
    "蔡元培语",
    "蔡元培说明学术派别应相对看待。",
  ),
  q(
    "005.",
    245,
    "言之成理，持之有故",
    "学术格言",
    "蔡元培语",
    "蔡元培提出兼容不同学术主张的判断标准。",
  ),
  q(
    "006.",
    15,
    "这一“语粹”式的编法，把才智之士的全部著作，不论长篇大论也好、片语只字也罢，都能一一撷取精华，巨细不遗，故对整个思想的选样流传，极有帮助。",
    "文选格言",
    "李敖论语粹编法",
    "李敖说明语粹式选本的价值。",
  ),
  q(
    "006.",
    65,
    "圣人不空出，贤者不虚生",
    "古典格言",
    "古语/李敖转用",
    "李敖借古语说明胡适遗著分类编印的意义。",
  ),
  q(
    "007.",
    99,
    "大丈夫的条件，除了“富贵不能淫，贫贱不能移，威武不能屈”外，还得加上一条——“时髦不能动”。",
    "处世格言",
    "胡适语意，李敖概括",
    "李敖概括胡适做人做事做文章的理智性格，把孟子三句外加时髦不能动。",
  ),
  q(
    "007.",
    101,
    "只有事实能给我们真理，只有真理能使我们独立。",
    "治学格言",
    "胡适语",
    "胡适强调不唱时髦调子，只从事实求真理。",
  ),
  q(
    "007.",
    105,
    "说的话是不是用我们的公心和理智去思考的结果？说话的人是不是愿意对于他的主张负道德上的责任？",
    "立言格言",
    "胡适语",
    "胡适谈说话立论须经过公心、理智与道德责任的检验。",
  ),
  q(
    "007.",
    109,
    "故君子名之必可言也，言之必可行也。君子于其言，无所苟而已矣。",
    "孔子语",
    "《论语》/胡适转引",
    "胡适引用孔子的话说明立言必须可行且无所苟。",
  ),
  q(
    "007.",
    313,
    "去努力、去追求、去寻找——永不退却、不屈服。",
    "外国诗句",
    "丁尼生诗句，胡适书写",
    "李敖记录胡适死前四个月写下的丁尼生诗句。",
  ),
  q(
    "009.",
    27,
    "别看他笑得那样好，我总觉得胡适之是一个寂寞的人。",
    "人物文句",
    "李敖《播种者胡适》",
    "李敖自引早年对胡适笑容背后寂寞气质的判断。",
  ),
  q(
    "009.",
    121,
    "他的目的，是要使他的遗著不成为他“亲近的人”的私产，而成为“全人类的共有产业”，谁都可以有自由印行的权利。",
    "遗著格言",
    "李敖述托尔斯泰遗嘱",
    "李敖借托尔斯泰例子说明遗著应成公共文化资产。",
  ),
  q(
    "011.",
    7,
    "忌者不自修而畏人修",
    "古典格言",
    "李敖转用古语",
    "李敖用此句批评只忌惮别人整理而自己不修的人。",
  ),
  q(
    "011.",
    73,
    "学生替先生编定诗文遗集，要用自己的判断力，该收的收、该去的去，不要把随便什么东西都收进去。",
    "编选格言",
    "胡适语",
    "胡适谈学生替先生编定诗文遗集时要有判断力。",
  ),
  q(
    "011.",
    73,
    "你们后死有责！",
    "遗著格言",
    "胡适语",
    "胡适对后来整理遗稿者的叮嘱。",
  ),
  q(
    "012.",
    63,
    "天神言，“尔虽有志气，何足云也？”对曰：“尝侨居是山，不忍见耳。”",
    "古文寓言",
    "周栎园《书影》",
    "胡适引鹦鹉濡羽救火故事，取不忍旁观之意。",
  ),
  q(
    "014.",
    5,
    "宁可减低推销，不可降低标准。",
    "办报格言",
    "胡适语",
    "胡适谈刊物内容时提出宁可少销也不可降低标准。",
  ),
  q(
    "014.",
    9,
    "你是为理想而办报呢？抑是为营利而办报？",
    "办报格言",
    "胡适语",
    "胡适追问办报目的，强调理想与营利的取舍。",
  ),
  q(
    "014.",
    9,
    "以有限的宝贵篇幅，似不宜刊载与现代文化思想潮流相背驰的文艺作品吧？",
    "办报格言",
    "胡适语",
    "胡适提醒报纸篇幅有限，应慎选文艺内容。",
  ),
  q(
    "016.",
    7,
    "你简直比我胡适之还了解胡适之！",
    "人物评语",
    "胡适语",
    "胡适称赞李敖搜集其著作目录之细密。",
  ),
];

const proofreadExclusions = new Map([
  ["吾志若不就，他无所愿，但愿先子死耳！", "与下一句同属刘献廷长段托付文，第一轮拆得过碎；校对轮改收完整引文。"],
  ["吾生平知己，舍子其谁？得子为吾传以传，复何恨哉？", "与上一句同属刘献廷长段托付文，第一轮拆得过碎；校对轮改收完整引文。"],
  ["没被开除，没被开除，开除还得了？", "怕太太协会场景笑话，脱离语境后格言性不足。"],
  [
    "这五十年是中国古文学的结束时期。做这个大结束的人物，很不容易得。恰好有一个章炳麟，真可算是古文学很光荣的结局了。",
    "胡适对章太炎的具体文学史定位，人物评语色彩较强，校对轮从格言集中移出。",
  ],
  [
    "他的古文学功夫很深，他又是很富于思想与组织力的，故他的著作在内容与形式两方面，都能“成一家言”。",
    "胡适对章太炎作品的具体人物评语，独立格言性不足。",
  ],
  ["胡先生讲得的确不差，他有眼光、有胆量、有断制，确是一个有能力的历史家。", "顾颉刚对胡适课堂的具体人物评语，校对轮保守剔除。"],
  ["他虽没有伯弢先生读书多，但在裁断上，是足以自立的。", "顾颉刚对胡适与陈伯弢的具体比较，脱离场景后格言性不足。"],
  [
    "这一“语粹”式的编法，把才智之士的全部著作，不论长篇大论也好、片语只字也罢，都能一一撷取精华，巨细不遗，故对整个思想的选样流传，极有帮助。",
    "李敖自述选本编法的说明文字，较像编辑说明而非引用诗文格言。",
  ],
  [
    "他的目的，是要使他的遗著不成为他“亲近的人”的私产，而成为“全人类的共有产业”，谁都可以有自由印行的权利。",
    "托尔斯泰遗著例子服务于胡适选集版权争议，现代法律/出版争论色彩较重。",
  ],
  ["你简直比我胡适之还了解胡适之！", "胡适对李敖搜书能力的场景化称赞，人物评语色彩强。"],
]);

const proofreadAdditions = [
  q(
    "《胡适与我》自序",
    11,
    "‘吾志若不就，他无所愿，但愿先子死耳！’予惊问故，曰：‘吾生平知己，舍子其谁？得子为吾传以传，复何恨哉？’",
    "知己文句",
    "王源《刘处士墓表》记刘献廷语",
    "校对轮把刘献廷托付知己作传的一整段合并收入，避免第一轮拆句过碎。",
    11,
    "校对补入：合并第一轮两条拆分引文。",
  ),
  q(
    "005.",
    223,
    "中国文言同拉丁文一样，所以我们不能不改用白话……虽现在白话的组织不完全，可是我们绝不可错了这个趋势。",
    "语文格言",
    "蔡元培语",
    "蔡元培说明文言与白话趋势的语文判断。",
    223,
    "校对补入：语文/文学范围，不属政治语录。",
  ),
  q(
    "005.",
    227,
    "我敢断定白话派一定占优胜……将来应用文一定全用白话：但美术文或者有一部分仍用文言。",
    "语文格言",
    "蔡元培语",
    "蔡元培对应用文与美术文中白话、文言位置的判断。",
    227,
    "校对补入：语文/文学范围，不属政治语录。",
  ),
];

const sourceOrder = new Map(files.map((file, index) => [file, index]));
function rowCompare(a, b) {
  return (
    (sourceOrder.get(a.source_file) ?? 9999) - (sourceOrder.get(b.source_file) ?? 9999) ||
    Number(a.line_start) - Number(b.line_start) ||
    Number(a.line_end) - Number(b.line_end) ||
    a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN")
  );
}

const initialRows = [...rawRows].sort(rowCompare);
const proofreadRemovedRows = initialRows
  .map((row, index) => ({
    original_id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
    ...row,
    reason: proofreadExclusions.get(row.quote_text),
  }))
  .filter((row) => row.reason);
const proofreadRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(row.quote_text)),
  ...proofreadAdditions,
].sort(rowCompare);
const rows = proofreadRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

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

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\r?\n/g, "\\n").replace(/\t/g, " ");
}

function sourceSlice(row) {
  const source = sourceCache.get(row.source_file);
  if (!source) return "";
  return source.lines.slice(Number(row.line_start) - 1, Number(row.line_end)).join("\n");
}

function quoteFound(row) {
  const sourceText = sourceSlice(row);
  return sourceText.includes(row.quote_text) || normalizeText(sourceText).includes(normalizeText(row.quote_text));
}

const auditRows = rows.map((row) => ({
  ...row,
  quote_found_at_declared_range: quoteFound(row) ? "yes" : "no",
  source_excerpt: sourceSlice(row),
}));

const missingAtDeclaredRange = auditRows.filter((row) => row.quote_found_at_declared_range !== "yes");
const duplicateQuoteTexts = [...rows.reduce((map, row) => map.set(row.quote_text, (map.get(row.quote_text) || 0) + 1), new Map())]
  .filter(([, count]) => count > 1)
  .map(([quoteText, count]) => ({ quoteText, count }));

const politicalTerms = [
  "共产党",
  "国民党",
  "苏俄",
  "苏维埃",
  "马克思",
  "列宁",
  "斯大林",
  "独裁",
  "专制",
  "革命",
  "宪法",
  "民主",
  "政党",
  "政府",
  "国家治理",
  "政治口号",
  "领袖",
  "统治阶级",
  "人民的敌人",
];
const politicalHits = rows
  .map((row) => ({
    id: row.id,
    hits: politicalTerms.filter((term) =>
      [row.quote_text, row.category].some((value) => String(value).includes(term)),
    ),
  }))
  .filter((item) => item.hits.length > 0);

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(selectedJson), { recursive: true });

const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
].join("\r\n");
fs.writeFileSync(outCsv, `\uFEFF${csv}\r\n`, "utf8");

const txtLines = [
  `《${book}》诗文格言歌谣引用`,
  `生成日期：${generatedDate}`,
  `条目数：${rows.length}`,
  "",
];
for (const row of rows) {
  txtLines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txtLines.push(`引用：${row.quote_text}`);
  txtLines.push(`出处线索：${row.source_or_origin}`);
  txtLines.push(`摘要：${row.summary}`);
  if (row.notes) txtLines.push(`备注：${row.notes}`);
  txtLines.push("");
}
fs.writeFileSync(outTxt, `\uFEFF${txtLines.join("\r\n")}\r\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
fs.writeFileSync(
  reviewTsv,
  `${columns.join("\t")}\r\n${rows.map((row) => columns.map((column) => tsvEscape(row[column])).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

const auditColumns = [...columns, "quote_found_at_declared_range", "source_excerpt"];
fs.writeFileSync(
  auditTsv,
  `${auditColumns.join("\t")}\r\n${auditRows.map((row) => auditColumns.map((column) => tsvEscape(row[column])).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);
fs.writeFileSync(
  proofreadAuditTsv,
  `${auditColumns.join("\t")}\r\n${auditRows.map((row) => auditColumns.map((column) => tsvEscape(row[column])).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

let extractedCandidateCount = "not available";
if (fs.existsSync(candidatesJson)) {
  const candidateData = JSON.parse(fs.readFileSync(candidatesJson, "utf8"));
  extractedCandidateCount = Array.isArray(candidateData.quoteCandidates)
    ? candidateData.quoteCandidates.length
    : Array.isArray(candidateData)
      ? candidateData.length
      : "unknown";
}
const reviewCandidateCount = fs.existsSync(reviewCandidatesTsv)
  ? Math.max(0, fs.readFileSync(reviewCandidatesTsv, "utf8").split(/\r?\n/).filter(Boolean).length - 1)
  : "not available";
const attributedLineCount = fs.existsSync(attributedTsv)
  ? Math.max(0, fs.readFileSync(attributedTsv, "utf8").split(/\r?\n/).filter(Boolean).length - 1)
  : "not available";

const categoryCounts = new Map();
const byFileCounts = new Map();
for (const row of rows) {
  categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1);
  byFileCounts.set(row.source_file, (byFileCounts.get(row.source_file) || 0) + 1);
}

const report = [
  `book=${book}`,
  `generatedDate=${generatedDate}`,
  `sourceDir=${sourceDir}`,
  `sourceFiles=${files.length}`,
  `extractedCandidates=${extractedCandidateCount}`,
  `reviewCandidates=${reviewCandidateCount}`,
  `attributedLines=${attributedLineCount}`,
  `rawRows=${rawRows.length}`,
  `proofreadRemovedRows=${proofreadRemovedRows.length}`,
  `proofreadAddedRows=${proofreadAdditions.length}`,
  `selectedRows=${rows.length}`,
  `missingAtDeclaredRange=${missingAtDeclaredRange.length}`,
  `duplicateQuoteTexts=${duplicateQuoteTexts.length}`,
  `politicalHits=${politicalHits.length}`,
  `csv=${outCsv}`,
  `txt=${outTxt}`,
  `selectedJson=${selectedJson}`,
  `reviewTsv=${reviewTsv}`,
  `auditTsv=${auditTsv}`,
  `proofreadAuditTsv=${proofreadAuditTsv}`,
  `proofreadReportTxt=${proofreadReportTxt}`,
  "",
  "selectionNotes=校对轮从第一轮中剔除拆分残句、场景笑话、过度具体的人物评语、编辑说明式自述和版权争议论断；继续排除现代党派、宪政、战时外交、法律案、政治人物攻防和明显政论语录；补入两条非政治语文格言。",
  "",
  "categoryCounts=",
  ...[...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `${category}\t${count}`),
  "",
  "byFileCounts=",
  ...[...byFileCounts.entries()].map(([file, count]) => `${file}\t${count}`),
  "",
  "missingAtDeclaredRangeIds=",
  ...missingAtDeclaredRange.map((row) => `${row.id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`),
  "",
  "duplicateQuoteTexts=",
  ...duplicateQuoteTexts.map((item) => `${item.count}\t${item.quoteText}`),
  "",
  "politicalHits=",
  ...politicalHits.map((item) => `${item.id}\t${item.hits.join("|")}`),
  "",
  "proofreadRemovedRows=",
  ...proofreadRemovedRows.map(
    (row) => `${row.original_id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}\t${row.reason}`,
  ),
  "",
  "proofreadAddedRows=",
  ...proofreadAdditions.map((row) => `${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`),
];
fs.writeFileSync(reportTxt, `${report.join("\r\n")}\r\n`, "utf8");
fs.writeFileSync(proofreadReportTxt, `${report.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rawRows: rawRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
      rows: rows.length,
      csv: outCsv,
      txt: outTxt,
      selectedJson,
      missingAtDeclaredRange: missingAtDeclaredRange.length,
      duplicateQuoteTexts: duplicateQuoteTexts.length,
      politicalHits: politicalHits.length,
    },
    null,
    2,
  ),
);

if (missingAtDeclaredRange.length > 0 || duplicateQuoteTexts.length > 0 || politicalHits.length > 0) {
  process.exitCode = 1;
}
