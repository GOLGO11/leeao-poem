const fs = require("fs");
const path = require("path");

const book = "胡适研究";
const idPrefix = "LAHSY";
const generatedDate = "2026-06-25";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "001.胡适研究");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const extractedCandidatesJson = path.join("analysis", "liao_hushi_yanjiu_quote_candidates.json");
const extractedReviewTsv = path.join("analysis", "liao_hushi_yanjiu_review_candidates.tsv");
const extractedAttributedTsv = path.join("analysis", "liao_hushi_yanjiu_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_hushi_yanjiu_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_hushi_yanjiu_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_hushi_yanjiu_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_hushi_yanjiu_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_hushi_yanjiu_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_hushi_yanjiu_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
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
    .replace(/[“”‘’"'「」『』]/g, "")
    .replace(/\s+/g, "");
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, summary, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(filePrefix);
  const notes = [
    "校对轮保守收入：本书夹杂大量苏俄、党派、国家治理、时事论战和现代人物评议，本轮只取句子本体可独立成立的诗文、治学格言、文学论句、传记方法、古典成语、宗教文句和爱情诗句。",
    extraNotes,
  ]
    .filter(Boolean)
    .join(" ");
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
    notes,
  };
}

const rawRows = [
  q(
    "《胡适研究》前记",
    5,
    "别看他笑得那样好，我总觉得胡适之是一个寂寞的人。",
    "胡适评语",
    "温源宁评胡适语",
    "李敖在前记开篇引用温源宁笔下的胡适印象，概括胡适笑容背后的寂寞气质。",
  ),
  q(
    "《胡适研究》前记",
    67,
    "搞历史的人只晓得追求历史的真相，不计其他。",
    "史学格言",
    "李敖史学自述",
    "李敖说明研究胡适的出发点时提出的史学态度，重在追求真相。",
  ),
  q(
    "001.",
    35,
    "要有话说，方才说话。",
    "白话文原则",
    "胡适《建设的文学革命论》",
    "胡适白话文写作原则之一，强调有内容才说话。",
  ),
  q(
    "001.",
    37,
    "有什么话，说什么话；话怎么说，就怎么说。",
    "白话文原则",
    "胡适《建设的文学革命论》",
    "胡适白话文写作原则之一，强调自然表达。",
  ),
  q(
    "001.",
    39,
    "要说我自己的话，别说别人的话。",
    "白话文原则",
    "胡适《建设的文学革命论》",
    "胡适白话文写作原则之一，强调自我表达。",
  ),
  q(
    "001.",
    41,
    "是什么时代的人，说什么时代的话。",
    "白话文原则",
    "胡适《建设的文学革命论》",
    "胡适白话文写作原则之一，强调语言要属于自己的时代。",
  ),
  q(
    "001.",
    107,
    "只要我们有东西，不怕人家拿‘没有东西’来打我们。",
    "治学格言",
    "胡适语",
    "胡适用英文格言意译出的自信句，李敖据此说明有实质贡献才不怕批评。",
  ),
  q(
    "001.",
    107,
    "只要我们负责任，不怕人家拿‘不负责任’来骂我们。",
    "治学格言",
    "李敖补胡适语",
    "李敖顺着胡适原句补出负责精神，作为个人主义的补充说明。",
  ),
  q(
    "001.",
    113,
    "不叫别人牵着鼻子走",
    "人格格言",
    "胡适个人主义说明语",
    "李敖用此句概括独立人格，不收同段较长的思想论述。",
  ),
  q(
    "001.",
    113,
    "好汉做事好汉当",
    "传统俗语",
    "中国俗语",
    "李敖借俗语说明负责气概，句子本体为常用俗谚。",
  ),
  q(
    "001.",
    119,
    "爱情的代价是痛苦，爱情的方法是要忍得住痛苦。",
    "爱情箴言",
    "胡适题张慰慈扇语",
    "胡适谈爱情与忍受痛苦的句子，后又化为小诗。",
  ),
  q(
    "001.",
    123,
    "名满天下，谤亦随之",
    "传统成语",
    "传统成语",
    "李敖用成语说明胡适毁誉交加的处境。",
  ),
  q(
    "001.",
    123,
    "说他叛道离经则可，说他洪水猛兽则未必。",
    "人物评语",
    "李敖评胡适语",
    "李敖评价胡适的分寸语，只取人物判断，不取同段社会论述。",
  ),
  q(
    "001.",
    179,
    "吾国文艺犹在古典主义、理想主义时代，今后当趋向写实主义",
    "文学论句",
    "陈独秀《文学革命论》",
    "李敖追溯文学革命源流时引用陈独秀的文学判断。",
  ),
  q(
    "001.",
    239,
    "学问上只有靠积极贡献成功的，断无靠骂打成功的。",
    "治学格言",
    "《超越传统派西化派俄化派而前进》引语",
    "李敖引此句讨论学术贡献与批评的关系，本轮只取治学层面的句子。",
  ),
  q(
    "001.",
    437,
    "我播下了龙的种子，我却收获了跳蚤。",
    "外国文学名句",
    "海涅语",
    "李敖引海涅名句讽刺播种与收获之间的反差。",
  ),
  q(
    "001.",
    459,
    "大胆的假设、小心的求证",
    "治学格言",
    "胡适治学方法",
    "李敖谈胡适科学方法时收入的常用格言。",
  ),
  q(
    "002.",
    205,
    "也想不相思，\n可免相思苦。\n几次细思量，\n情愿相思苦！",
    "爱情小诗",
    "胡适小诗",
    "胡适把爱情箴言化入生查子词调，表达宁愿承受相思之苦。",
    211,
  ),
  q(
    "002.",
    539,
    "看戏是享受，为什么一定要用眼泪陪悲剧呢？",
    "文学批评句",
    "郑学稼论旧戏语",
    "李敖转述并批评郑学稼的戏剧观，本轮仅取其文学理论句。",
  ),
  q(
    "002.",
    641,
    "不摹仿古人，语语须有个我在",
    "文学论句",
    "文学革命八不相关语",
    "李敖说明白话文和新文学的个性原则时摘出的文学论句。",
  ),
  q(
    "003.",
    5,
    "一生学问之得力，皆在此年",
    "治学自述",
    "梁启超《三十自述》",
    "梁启超回忆一生学问关键年份，李敖用于梁胡关系脉络。",
  ),
  q(
    "003.",
    29,
    "时有征引浚发，深造盖迈先辈",
    "学术评语",
    "梁启超评胡适、章太炎治墨语",
    "梁启超称许胡适、章太炎对墨学的征引发明与深入研究。",
  ),
  q(
    "003.",
    35,
    "此种序文，表示极肫笃的学者风度，于学风大有所裨，岂唯私人纫感而己。",
    "学术评语",
    "梁启超答胡适书",
    "梁启超称许胡适坦白作序，认为这种学者风度有益学风。",
  ),
  q(
    "003.",
    41,
    "不废江河万古流",
    "唐诗名句",
    "杜甫《戏为六绝句》",
    "梁启超评胡适著作价值时借用杜甫诗句。",
  ),
  q(
    "003.",
    51,
    "胡蝶儿，晚春时，又是一般闲暇；\n梧桐树，三更雨，不知多少秋声。",
    "诗词联语",
    "梁启超集前人词句赠胡适联",
    "梁启超从前人词中集句成联赠胡适，李敖收入梁胡交往。",
    53,
  ),
  q(
    "003.",
    57,
    "我虽自知学问浅陋，说我连国学最低限度都没有，我却不服。",
    "读书评语",
    "梁启超评胡适书目语",
    "梁启超批评胡适国学书目时的俏皮自辩。",
  ),
  q(
    "003.",
    61,
    "真不能不算石破天惊的怪论！",
    "批评格言",
    "梁启超评胡适书目语",
    "梁启超用夸张语气批评胡适书目，句子本体可作文学批评语。",
  ),
  q(
    "003.",
    81,
    "我的也该烧了！",
    "古典小说名句",
    "《石头记》宝玉语",
    "徐志摩读梁启超文章时借《石头记》宝玉读诗语自谦。",
  ),
  q(
    "003.",
    81,
    "弟子的也该烧了！",
    "读书评语",
    "徐志摩仿《石头记》语",
    "徐志摩仿宝玉语称赞梁启超文字，表达读后自愧。",
  ),
  q(
    "003.",
    91,
    "万不容以他人之苦痛，易自己之快乐",
    "人生箴言",
    "梁启超劝徐志摩书",
    "梁启超劝徐志摩不可用他人的痛苦交换自己的快乐。",
  ),
  q(
    "003.",
    95,
    "天下岂有圆满之宇宙？当知吾侪以不求圆满为生活态度，斯可以领略生活之妙味矣。",
    "人生箴言",
    "梁启超劝徐志摩书",
    "梁启超劝徐志摩以不求圆满为生活态度。",
  ),
  q(
    "003.",
    103,
    "我将于茫茫人海中访我唯一灵魂之伴侣，得之，我幸；不得，我命，如此而已。",
    "爱情名句",
    "徐志摩语",
    "徐志摩回应梁启超时表达寻找灵魂伴侣的名句。",
  ),
  q(
    "003.",
    117,
    "临流可奈清癯，第四桥边，呼棹过环碧；\n此意平生飞动，海棠影下，吹笛到天明。",
    "诗词联语",
    "梁启超集前人词句赠徐志摩联",
    "梁启超集词句成联赠徐志摩，用以写其性格与故事。",
    119,
  ),
  q(
    "003.",
    151,
    "提倡有心，创造无力",
    "文学评语",
    "李敖评胡适新文学语",
    "李敖概括胡适在新文学创作上的位置，句子本体为文学评价。",
  ),
  q(
    "003.",
    173,
    "他不白来了一世，我们有了他做朋友，也可以安慰自己说不曾白来了一世",
    "悼友文句",
    "胡适悼徐志摩语",
    "胡适追悼徐志摩时写下的深情悼友句。",
  ),
  q(
    "003.",
    177,
    "依旧是月明时，\n依旧是空山夜；\n我踏月独自归来，\n这凄寂如何能解？\n翠微山上的一阵松涛，\n惊破了空山的寂静；\n山风吹乱了窗上的松痕，\n吹不散我心头的人影！",
    "胡适诗",
    "胡适《依旧月明时》",
    "李敖录胡适悼徐志摩诗，写月夜归来与心头人影。",
    191,
  ),
  q(
    "003.",
    201,
    "三年不见他，\n就自信能把他忘了。\n今天又看见他，\n这久冷的心又发狂了。\n我终夜不成眠，\n萦想着他的愁，病，衰老。\n刚闭上了一双倦眼，\n又只见他庄严曼妙。\n我欢喜醒来，\n眼里还噙着两滴欢喜的泪，\n我忍不住笑出声来，\n“你总是这样教人牵记！”",
    "胡适诗",
    "胡适《三年不见他》",
    "李敖在后记中附录胡适未发表旧诗，写久别后重新被牵动的情感。",
    223,
  ),
  q(
    "004.",
    9,
    "我不入地狱，谁入地狱？",
    "佛教名句",
    "地藏菩萨相关俗语",
    "李敖寓言式写法中借地藏菩萨语，句子本体为宗教名句。",
  ),
  q(
    "004.",
    45,
    "文章忌刻薄",
    "文章格言",
    "刘星评语",
    "文章末尾列出刘星语，提醒文章不可流于刻薄。",
  ),
  q(
    "006.",
    19,
    "不降志，不辱身",
    "古典成语",
    "《论语》相关成语",
    "胡适谈有所不为时引古典成语说明人格自重。",
  ),
  q(
    "006.",
    47,
    "诸松傲秋霜，未始有衰意。\n举世随风靡，独汝益苍萃。",
    "胡适诗",
    "胡适《秋》",
    "李敖录胡适旧作《秋》中的诗句，以松树写独立苍翠。",
    49,
  ),
  q(
    "006.",
    53,
    "一点一滴都不苟且，一字一笔都不放过",
    "治学格言",
    "胡适治学态度",
    "李敖概括胡适写作治学的矜慎态度。",
  ),
  q(
    "006.",
    53,
    "不着急，不要轻易发表，不要轻易下结论",
    "治学格言",
    "胡适治学态度",
    "胡适主张缓下结论、谨慎发表的治学方法。",
  ),
  q(
    "006.",
    69,
    "做文章是要用力气的。",
    "文章格言",
    "胡适忠告",
    "胡适给有志做好文章者的简短忠告。",
  ),
  q(
    "006.",
    71,
    "信云开终有时",
    "诗性格言",
    "胡适人生看法",
    "李敖写胡适乐观人生观时摘出的希望之语。",
  ),
  q(
    "006.",
    71,
    "不畏浮云遮望眼",
    "宋诗名句",
    "王安石《登飞来峰》",
    "李敖写胡适乐观人生观时借王安石诗句。",
  ),
  q(
    "006.",
    71,
    "不可救药的乐观主义者",
    "人生评语",
    "胡适自称",
    "胡适自称乐观到不可救药，李敖用以概括其人生看法。",
  ),
  q(
    "006.",
    71,
    "文如其人",
    "文章格言",
    "传统评文语",
    "李敖评价胡适文章与人格相合时引用传统评文语。",
  ),
  q(
    "006.",
    75,
    "适之呀！你的白话不够白。",
    "文学评语",
    "赵元任打趣胡适语",
    "赵元任打趣胡适白话文仍带古文痕迹。",
  ),
  q(
    "006.",
    75,
    "做惯古文的人，改做白话，往往不能脱胎换骨",
    "白话文原则",
    "胡适自述",
    "胡适承认古文训练会妨碍纯粹白话表达。",
  ),
  q(
    "006.",
    75,
    "裹了小脚之后是放不大的，说我白话文做得好，也是假的。",
    "文学评语",
    "胡适自嘲",
    "胡适以小脚比喻古文训练对自己白话文的限制。",
  ),
  q(
    "006.",
    77,
    "行文颇大胆，苦思欲到底。\n十字以自嘲，傥可示知己。",
    "胡适诗",
    "胡适美国时期小诗",
    "李敖录胡适民国五年在美国所写的小诗，见其治学与作文态度。",
    79,
  ),
  q(
    "006.",
    81,
    "易卜生的长处，只在他肯说老实话",
    "文学评语",
    "胡适论易卜生",
    "李敖谈胡适文章风格时引用其对易卜生的判断。",
  ),
  q(
    "007.",
    5,
    "作传太易。作者大抵率尔操觚，不深知所传之人。史官一人须作传数百，安得有佳传？",
    "传记文学论句",
    "胡适留学日记",
    "胡适早年谈中国传记不足，批评作传太容易而不深知其人。",
  ),
  q(
    "007.",
    5,
    "琐事多而详，读之者如亲见其人，亲聆其谈论",
    "传记文学论句",
    "胡适留学日记",
    "胡适说明西方传记详尽琐事所带来的如见其人之效。",
  ),
  q(
    "007.",
    9,
    "此亦人子也，可善遇之。",
    "古文家书",
    "陶渊明家信",
    "胡适回忆朱子《小学》所载陶渊明家信，以此说明传记材料的教育力量。",
  ),
  q(
    "007.",
    13,
    "传记写所传的人最要能写出他的实在身份、实在神情、实在口吻，要使读者如见其人，要使读者感觉真可以尚友其人",
    "传记文学论句",
    "胡适《南通张季直先生传记序》",
    "胡适提出新体传记应写出人物真实身份、神情和口吻。",
  ),
  q(
    "007.",
    13,
    "用绣花针的细密功夫来搜求考证他们的事实，用大刀阔斧的远大识见来评判他们在历史上的地位",
    "传记方法论",
    "胡适《南通张季直先生传记序》",
    "胡适用两组比喻说明传记写作兼需细密考证和远大识见。",
  ),
  q(
    "007.",
    31,
    "不但要记载他的一生事迹，还要写出他的学问思想的历史",
    "传记方法论",
    "胡适《章实斋先生年谱》旧例",
    "胡适说明人物传记不仅记事，也要写出学问思想的发展。",
  ),
  q(
    "007.",
    31,
    "凡可以表示他的思想主张的变迁沿革的，都摘要摘录。",
    "传记方法论",
    "胡适《章实斋先生年谱》旧例",
    "胡适说明传记摘录材料的标准，在于表现思想主张的变迁。",
  ),
  q(
    "007.",
    37,
    "一个天生的能办事、能领导人、能训练人才、能建立学术的大人物",
    "人物评语",
    "胡适评丁文江语",
    "胡适称许丁文江办事、用人和建立学术的能力。",
  ),
  q(
    "007.",
    37,
    "真诚的爱护人才，热诚而大度的运用中外老少的人才",
    "人才评语",
    "胡适评丁文江语",
    "胡适概括丁文江爱护并运用人才的方式。",
  ),
  q(
    "007.",
    41,
    "传记文学写得好，必须能够没有忌讳；忌讳太多、顾虑太多，就没有法子写可靠的生动的传记了。",
    "传记文学论句",
    "胡适《传记文学》演讲",
    "胡适强调传记写作需要少忌讳、少顾虑，才能可靠生动。",
  ),
  q(
    "007.",
    41,
    "中国的传记文学，因为有了忌讳，就有许多话不敢说、许多材料不敢用，不敢赤裸裸地写一个人，写一个伟大人物，写一个值得做传记的人物。",
    "传记文学论句",
    "胡适《传记文学》演讲",
    "胡适指出传记文学受忌讳限制，难以真实写人。",
  ),
  q(
    "007.",
    43,
    "向来的传记，往往只说本人的好处，不说他的坏处；我……不但说他的长处，还常常指出他的短处。……我不敢说我的评判都不错，但这种批评的方法，也许能开一个创例。",
    "传记方法论",
    "胡适《章实斋先生年谱》自序",
    "胡适说明传记批评应同时写长处与短处。",
  ),
  q(
    "007.",
    45,
    "性情的偏向，很难遏止",
    "治学自述",
    "胡适《庐山游记》",
    "胡适自称考据癖是性情偏向，很难遏止。",
  ),
  q(
    "007.",
    47,
    "丁在君是我们这个新时代的徐霞客",
    "人物评语",
    "胡适评丁文江语",
    "胡适以徐霞客比丁文江，突出其探奇远游与调查精神。",
  ),
  q(
    "007.",
    47,
    "他要看徐霞客所不曾看见，他要记徐霞客所不曾记载",
    "人物评语",
    "胡适评丁文江语",
    "胡适说明丁文江在调查旅行中有继承又有超越徐霞客的志向。",
  ),
  q(
    "007.",
    49,
    "五岁就传，寓目成诵",
    "古典评语",
    "崔东壁《考信附录》相关语",
    "胡适借崔东壁材料旁证丁文江幼年聪敏并非孤例。",
  ),
  q(
    "007.",
    63,
    "有时于长篇之中，仅取一两段；有时一段之中，仅取重要的或精彩的几句。……删存的句子，又须上下贯串，自成片段。这一番功夫，很费了一点苦心。",
    "摘录方法论",
    "胡适《章实斋先生年谱》自序",
    "胡适谈摘录史料时的删存与贯串功夫。",
  ),
  q(
    "007.",
    69,
    "准备着明天就会死，工作着仿佛永远活着的。",
    "人生箴言",
    "丁文江转述西方格言",
    "胡适记录丁文江常说的工作与死亡格言。",
  ),
  q(
    "007.",
    71,
    "明天就死又何妨；\n只拼命做工，\n就像你永远不会死一样。",
    "格言译诗",
    "胡适译西方格言",
    "胡适把丁文江所引格言译为白话韵文。",
    75,
  ),
  q(
    "007.",
    79,
    "Study as if you were to live forever，\nLive as if you were to die tomorrow.",
    "西方格言原文",
    "Isidore相关格言英译",
    "李敖指出丁文江所引格言的较正确英译原文。",
    81,
  ),
  q(
    "007.",
    89,
    "究竟是一个受史学训练深于文学训练的人",
    "人物评语",
    "胡适《四十自述》自序",
    "胡适自称史学训练深于文学训练，李敖用以评其传记风格。",
  ),
];

const proofreadExclusions = new Map([
  ["搞历史的人只晓得追求历史的真相，不计其他。", "李敖前记中的自述性判断，不属于被引用的诗文格言。"],
  ["只要我们负责任，不怕人家拿‘不负责任’来骂我们。", "李敖顺手补句，非引文；校对轮不收入。"],
  ["说他叛道离经则可，说他洪水猛兽则未必。", "李敖对胡适的临场人物判断，格言性不足。"],
  ["此种序文，表示极肫笃的学者风度，于学风大有所裨，岂唯私人纫感而己。", "梁启超答胡适书中的具体酬答语，过于场景化。"],
  ["我虽自知学问浅陋，说我连国学最低限度都没有，我却不服。", "梁启超批评书目时的具体自辩，非独立格言。"],
  ["真不能不算石破天惊的怪论！", "短促评语，脱离原文后过碎。"],
  ["弟子的也该烧了！", "仿《石头记》的临场改写，保留原典句即可。"],
  ["一个天生的能办事、能领导人、能训练人才、能建立学术的大人物", "对丁文江的具体人物评语，且含现代领袖/领导语汇，校对轮剔除。"],
  ["真诚的爱护人才，热诚而大度的运用中外老少的人才", "对丁文江用人方式的具体评语，独立格言性不足。"],
]);

const proofreadAdditions = [
  q(
    "001.",
    97,
    "任重而道远",
    "论语成语",
    "《论语》",
    "胡适谈发展科学责任时明引古人语，本轮只取成语本体。",
    97,
    "校对补入：古典成语本体独立成立，未收入同句国家科学语境。",
  ),
  q(
    "006.",
    19,
    "有所不为",
    "人格格言",
    "胡适论人格修养语",
    "胡适以此说明人格自重与牺牲精神，是同段论述的核心短语。",
    19,
    "校对补入：与同段“不降志，不辱身”互为说明，非政治语录。",
  ),
  q(
    "006.",
    71,
    "悲观声浪里的乐观",
    "人生格言",
    "胡适人生看法",
    "李敖写胡适乐观人生观时摘出的短语，概括逆境中的乐观。",
    71,
    "校对补入：句子本体为人生看法，不涉政治。",
  ),
  q(
    "006.",
    81,
    "注重学问思想的方法",
    "治学格言",
    "胡适文章宗旨",
    "李敖概括《胡适文存》文章重心时摘出的治学方法语。",
    81,
    "校对补入：与“说老实话”同段，本轮取较完整的方法短语。",
  ),
  q(
    "007.",
    5,
    "大抵静而不动，……但写其人为谁某而不写其人之何以得成谁某",
    "传记文学论句",
    "胡适留学日记",
    "胡适比较中西传记时指出传统传记偏静态、不写人格形成过程。",
    5,
    "校对补入：传记方法论句，非政治语录。",
  ),
  q(
    "007.",
    5,
    "其人格进退之次第及其进退之动力",
    "传记文学论句",
    "胡适留学日记",
    "胡适称西方传记能写人格变化的次第与动力。",
    5,
    "校对补入：传记文学核心句，独立成立。",
  ),
  q(
    "007.",
    9,
    "只须剪裁得得当、描写得生动，也未尝不可以做少年人的良好教育材料，也未尝不可介绍一点做人的风范。",
    "传记文学论句",
    "胡适《领袖人才的来源》",
    "胡适说明传记材料即使简略，只要剪裁得当、描写生动，也能提供做人风范。",
    9,
    "校对补入：传记文学与人格教育句，不收入同段历史人物政治背景。",
  ),
  q(
    "007.",
    13,
    "二千年来，几乎没有一篇可读的传记。",
    "传记文学论句",
    "胡适《南通张季直先生传记序》",
    "胡适批评旧传记文字不能写生传神时提出的激烈判断。",
    13,
    "校对补入：传记文学判断，非政治语录。",
  ),
];

const proofreadExcludedRows = rawRows
  .map((row, index) => ({
    original_id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
    ...row,
    reason: proofreadExclusions.get(row.quote_text),
  }))
  .filter((row) => row.reason);

const sourceOrder = new Map(files.map((file, index) => [file, index]));
const proofreadRows = [...rawRows.filter((row) => !proofreadExclusions.has(row.quote_text)), ...proofreadAdditions].sort(
  (a, b) =>
    (sourceOrder.get(a.source_file) ?? 9999) - (sourceOrder.get(b.source_file) ?? 9999) ||
    Number(a.line_start) - Number(b.line_start) ||
    Number(a.line_end) - Number(b.line_end),
);

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

const reviewColumns = columns;
fs.writeFileSync(
  reviewTsv,
  `${reviewColumns.join("\t")}\r\n${rows.map((row) => reviewColumns.map((column) => tsvEscape(row[column])).join("\t")).join("\r\n")}\r\n`,
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
if (fs.existsSync(extractedCandidatesJson)) {
  const candidateData = JSON.parse(fs.readFileSync(extractedCandidatesJson, "utf8"));
  extractedCandidateCount = Array.isArray(candidateData.quoteCandidates)
    ? candidateData.quoteCandidates.length
    : Array.isArray(candidateData)
      ? candidateData.length
      : "unknown";
}
const reviewCandidateCount = fs.existsSync(extractedReviewTsv)
  ? Math.max(0, fs.readFileSync(extractedReviewTsv, "utf8").split(/\r?\n/).filter(Boolean).length - 1)
  : "not available";
const attributedLineCount = fs.existsSync(extractedAttributedTsv)
  ? Math.max(0, fs.readFileSync(extractedAttributedTsv, "utf8").split(/\r?\n/).filter(Boolean).length - 1)
  : "not available";

const report = [
  `book=${book}`,
  `generatedDate=${generatedDate}`,
  `sourceDir=${sourceDir}`,
  `sourceFiles=${files.length}`,
  `extractedCandidates=${extractedCandidateCount}`,
  `reviewCandidates=${reviewCandidateCount}`,
  `attributedLines=${attributedLineCount}`,
  `rawRows=${rawRows.length}`,
  `proofreadRemovedRows=${proofreadExcludedRows.length}`,
  `proofreadAddedRows=${proofreadAdditions.length}`,
  `selectedRows=${rows.length}`,
  `missingAtDeclaredRange=${missingAtDeclaredRange.length}`,
  `politicalHits=${politicalHits.length}`,
  `csv=${outCsv}`,
  `txt=${outTxt}`,
  `selectedJson=${selectedJson}`,
  `reviewTsv=${reviewTsv}`,
  `auditTsv=${auditTsv}`,
  `proofreadAuditTsv=${proofreadAuditTsv}`,
  `proofreadReportTxt=${proofreadReportTxt}`,
  "",
  "selectionNotes=校对轮剔除李敖自述/补句、碎片化临场评语和过于具体的现代人物评语；苏俄、党派、国家治理、时事论战和现代政治人物评议均未收；保留文学、传记、治学、古典成语、宗教文句和爱情诗文。",
  "",
  "proofreadRemovedRows=",
  ...proofreadExcludedRows.map(
    (row) => `${row.original_id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}\t${row.reason}`,
  ),
  "",
  "proofreadAddedRows=",
  ...proofreadAdditions.map((row) => `${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`),
  "",
  "missingAtDeclaredRangeIds=",
  ...missingAtDeclaredRange.map((row) => `${row.id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`),
  "",
  "politicalHits=",
  ...politicalHits.map((item) => `${item.id}\t${item.hits.join("|")}`),
];
fs.writeFileSync(reportTxt, `${report.join("\r\n")}\r\n`, "utf8");
fs.writeFileSync(proofreadReportTxt, `${report.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rawRows: rawRows.length,
      proofreadRemovedRows: proofreadExcludedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
      rows: rows.length,
      csv: outCsv,
      txt: outTxt,
      missingAtDeclaredRange: missingAtDeclaredRange.length,
      politicalHits: politicalHits.length,
    },
    null,
    2,
  ),
);
