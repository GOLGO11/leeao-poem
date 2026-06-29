const fs = require("fs");
const path = require("path");

const book = "你不知道的二二八";
const idPrefix = "LANBZD228";
const generatedDate = "2026-06-29";
const sourceDir = path.join("《大李敖全集6.0》分章节", "014.台湾史政类", "007.你不知道的二二八");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_unknown_228_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_unknown_228_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_unknown_228_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_unknown_228_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_unknown_228_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_unknown_228_proofread_report.txt");
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
    .replace(/[“”‘’《》「」『』"']/g, "")
    .replace(/\s+/g, "");
}

function q(selector, lineStart, quoteText, category, sourceOrOrigin, summary, lineEnd = lineStart, extraNotes = "") {
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
    source_or_origin: sourceOrOrigin,
    summary,
    notes: [
      "校对后从严保留：《你不知道的二二八》为二二八事件史料问答，现代政论、党派/族群/国族/政府机关/报告书/人物攻防/政治口号不收；只取句子本体可独立检索的古典成句、俗谚、民间诗歌和少量非政治诗文。",
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
    "安身立命",
    "中文成语",
    "佛教/儒家成语",
    "李敖在序中使用安身立命，保存可独立检索的传统成语。",
  ),
  q(
    "001.",
    41,
    "障百川而东之，挽狂澜于既倒",
    "韩愈文句",
    "韩愈《进学解》相关成句",
    "李敖化用韩愈文句，写力挽已经倾倒的狂澜、导正众流。",
    41,
    "源文作“挽狂澜”，按本书文字保留；不收同段现代族群政治判断。",
  ),
  q(
    "001.",
    47,
    "知其所止",
    "儒家成句",
    "《大学》相关成句",
    "李敖用知其所止说明行动应知界限与止境。",
    47,
    "只收古典成句本体，不收同段二二八诉求与现实政治论述。",
  ),

  q(
    "003.",
    87,
    "人上一百，形形色色。",
    "中文俗语",
    "中文俗语",
    "李敖引录彭孟缉回忆中明示的俗语，说明人多则各色人都有。",
    87,
    "同段另有国家亲属化比喻，首轮不收入。",
  ),
  q(
    "003.",
    119,
    "放尿搅沙不作伙",
    "台语俗语",
    "台湾话俗语",
    "李敖引录访问记录中的台湾话俗语，写彼此不合、不肯合伙。",
  ),
  q(
    "003.",
    127,
    "撒尿的不要，换一个下痢者",
    "台语俗语",
    "台湾民间俗话",
    "李敖引录台湾民间俗话，形容弃一弊而换来更坏的对象。",
    127,
    "只收俗语本体，不收同段政权移转论述。",
  ),
  q(
    "003.",
    131,
    "乞丐赶庙公",
    "闽南语俗谚",
    "闽南语俗谚",
    "李敖引录闽南语俗谚，源文说明其意近喧宾夺主。",
  ),
  q(
    "003.",
    139,
    "抱狗仔过户磴也桌钱",
    "台语俗语",
    "台湾话俗语",
    "李敖引录访问记录中的台语俗语，形容连极小事务也要收费索取。",
  ),

  q(
    "003.",
    149,
    "小毛闹烘烘，老婆催办公，拔腿往外走，匆匆。",
    "十七字诗",
    "《新闻报》所载台湾流行十七字诗",
    "李敖引录台湾流行十七字诗，写上班前匆促奔走的生活情状。",
  ),
  q(
    "003.",
    151,
    "司机起得迟，巴士人太挤，半路又抛锚，走去。",
    "十七字诗",
    "《新闻报》所载台湾流行十七字诗",
    "李敖引录台湾流行十七字诗，写交通拥挤、车辆抛锚后的无奈。",
  ),
  q(
    "003.",
    153,
    "登到簿无踪，股长无笑容，埋头忙抄写，脸红。",
    "十七字诗",
    "《新闻报》所载台湾流行十七字诗",
    "李敖引录台湾流行十七字诗，写办公室点卯与抄写中的窘态。",
  ),
  q(
    "003.",
    155,
    "派克车威风，主管也办公，抽烟看看报，从容。",
    "十七字诗",
    "《新闻报》所载台湾流行十七字诗",
    "李敖引录台湾流行十七字诗，写主管乘车办公的悠闲姿态。",
  ),
  q(
    "003.",
    157,
    "老李眼迷迷，盯着王美丽，科长发脾气，醋意。",
    "十七字诗",
    "《新闻报》所载台湾流行十七字诗",
    "李敖引录台湾流行十七字诗，写办公室里的轻佻与尴尬。",
  ),
  q(
    "003.",
    159,
    "天天都一样，中午汽笛放，打开抽屉来，便当。",
    "十七字诗",
    "《新闻报》所载台湾流行十七字诗",
    "李敖引录台湾流行十七字诗，写日常作息与午饭便当。",
  ),
  q(
    "003.",
    161,
    "庶务最风流，用钱不用愁，电钟五点半，北投。",
    "十七字诗",
    "《新闻报》所载台湾流行十七字诗",
    "李敖引录台湾流行十七字诗，写庶务人员用钱与下班消遣。",
  ),
  q(
    "003.",
    163,
    "一月挨到终，今天领薪俸，扣掉借支钱，空空。",
    "十七字诗",
    "《新闻报》所载台湾流行十七字诗",
    "李敖引录台湾流行十七字诗，写领薪后被借支扣空的窘困。",
  ),
  q(
    "003.",
    165,
    "老婆等薪水，无米又无煤，骂我老不死，受罪。",
    "十七字诗",
    "《新闻报》所载台湾流行十七字诗",
    "李敖引录台湾流行十七字诗，写家庭生活中缺米缺煤的困顿。",
  ),
  q(
    "003.",
    167,
    "这是什么年，倒霉公务员，死活靠调整，可怜。",
    "十七字诗",
    "《新闻报》所载台湾流行十七字诗",
    "李敖引录台湾流行十七字诗，写公务员薪资与生活调整的可怜处境。",
  ),
  q(
    "003.",
    199,
    "天上来，地下来，老百姓活不来",
    "民谣",
    "郑东华《台湾问题——回顾与前瞻》所引民谣",
    "李敖引录民谣，写百姓生活困苦、难以维生。",
    199,
    "同段“盼中央”句政治口号色彩过重，首轮不收。",
  ),
  q(
    "003.",
    207,
    "黑狗偷食白狗受罪",
    "中文俗语",
    "中文俗语",
    "李敖引录蒋渭川书中明示的俗语，写一方作恶而另一方受罪。",
  ),

  q(
    "003.",
    319,
    "五子登科",
    "中文成语",
    "中文成语",
    "李敖引录吴三连回忆中对金子、银子、车子、房子、女子的讽刺性称呼。",
  ),
  q(
    "003.",
    543,
    "以讹传讹",
    "中文成语",
    "中文成语",
    "李敖引录唐贤龙书中以讹传讹一语，写误称经传播而固定。",
  ),
  q(
    "003.",
    631,
    "不分青红皂白",
    "中文成语",
    "中文成语",
    "李敖引录访问记录中不分青红皂白一语，写不问情由地行动。",
  ),
  q(
    "003.",
    771,
    "抱头鼠窜",
    "中文成语",
    "中文成语",
    "李敖引录访问记录中抱头鼠窜一语，写惊慌逃窜的状态。",
  ),
  q(
    "003.",
    1023,
    "唱空城计",
    "三国成语",
    "《三国演义》空城计典故",
    "李敖引录访问记录中唱空城计一语，写县府无人、形同空城的情形。",
  ),
  q(
    "003.",
    1027,
    "脚底抹油",
    "中文俗语",
    "中文俗语",
    "李敖引录访问记录中脚底抹油一语，写临阵逃走。",
  ),
  q(
    "003.",
    1527,
    "枪声一响，黄金万两",
    "俗语",
    "中文俗语",
    "李敖引录所谓枪声一响、黄金万两的说法，讽刺兵乱中趁机发财。",
    1527,
    "只收俗语本体，不收同段外省人与军队攻防史料。",
  ),
  q(
    "003.",
    1531,
    "投鼠忌器",
    "中文成语",
    "《汉书》相关成语",
    "李敖引录投鼠忌器成语，说明因顾忌被牵连者而不敢动手。",
  ),
  q(
    "003.",
    1647,
    "生不如死",
    "中文成语",
    "中文成语",
    "李敖引录访问记录中生不如死一语，写痛苦至极的状态。",
  ),
  q(
    "003.",
    3675,
    "用人勿疑，疑人勿用",
    "用人格言",
    "中文用人俗谚",
    "李敖引录用人勿疑、疑人勿用的格言，说明任人时的信任原则。",
    3675,
    "只收传统用人格言本体，不收同段陈仪人事制度评价。",
  ),
  q(
    "003.",
    3795,
    "治生敢曰太无方，病在偏怜晚节香，廿载服官无息日，一朝罢去便饥荒",
    "近现代诗句",
    "陈仪自作诗",
    "李敖引录陈仪自作诗，写仕宦多年、离职后生计困窘的自述。",
    3795,
    "诗句本体不作政治主张，首轮保留；不收同段人物政论评价。",
  ),
];

const proofreadAdditions = [
  q(
    "001.",
    5,
    "口口声声",
    "中文成语",
    "中文成语",
    "李敖使用口口声声形容反复声称某种立场，句子本体为常用成语。",
  ),
  q(
    "001.",
    11,
    "顺水人情",
    "中文成语",
    "中文成语",
    "李敖使用顺水人情形容顺势接受他人送来的便利，保存成语本体。",
    11,
    "校对补入：只收成语本体，不收同段现代党派叙述。",
  ),
  q(
    "001.",
    13,
    "视而不见",
    "中文成语",
    "中文成语",
    "李敖使用视而不见形容明知资料存在却不加理会，保存成语本体。",
  ),
  q(
    "001.",
    23,
    "轻描淡写",
    "中文成语",
    "中文成语",
    "李敖使用轻描淡写形容有意淡化事实，保存成语本体。",
  ),
  q(
    "001.",
    29,
    "不着边际",
    "中文成语",
    "中文成语",
    "李敖使用不着边际形容说法离事实太远，保存成语本体。",
  ),
  q(
    "001.",
    31,
    "天马行空",
    "中文成语",
    "中文成语",
    "李敖使用天马行空形容数字推测漫无边际，保存成语本体。",
  ),
  q(
    "001.",
    45,
    "适可而止",
    "中文成语",
    "中文成语",
    "李敖使用适可而止说明行动应知分寸、不可过度。",
  ),
  q(
    "001.",
    47,
    "墓草久宿",
    "古典成语",
    "古典成语",
    "李敖使用墓草久宿写事过多年、人物已逝的时间感。",
  ),
  q(
    "001.",
    53,
    "巨细不遗",
    "中文成语",
    "中文成语",
    "李敖使用巨细不遗形容细大事项都加以列出。",
  ),
  q(
    "003.",
    43,
    "不知所云",
    "中文成语",
    "中文成语",
    "李敖引录史料中不知所云一语，写听者不明其意。",
  ),
  q(
    "003.",
    515,
    "死灰复燃",
    "中文成语",
    "中文成语",
    "李敖引录史料中死灰复燃一语，保存成语本体。",
    515,
    "校对补入：只收成语本体，不收同段政治原因列表。",
  ),
  q(
    "003.",
    907,
    "庸人自扰",
    "中文成语",
    "中文成语",
    "李敖引录文章题名中的庸人自扰成语，指无谓自生烦扰。",
  ),
  q(
    "003.",
    915,
    "销声匿迹",
    "中文成语",
    "中文成语",
    "李敖引录销声匿迹成语，写事物在变乱后不再出现。",
  ),
  q(
    "003.",
    947,
    "呆若木鸡",
    "庄子成语",
    "《庄子·达生》相关成语",
    "李敖引录呆若木鸡成语，形容众人一时发呆愣住。",
  ),
  q(
    "003.",
    1423,
    "层出不穷",
    "中文成语",
    "中文成语",
    "李敖引录层出不穷成语，写类似事件连续出现。",
  ),
  q(
    "003.",
    1855,
    "明哲保身",
    "诗经成语",
    "《诗经·大雅·烝民》相关成语",
    "李敖引录明哲保身成语，写为保全自己而采取的处世方式。",
    1855,
    "校对补入：只收成语本体，不收同段人物攻防内容。",
  ),
  q(
    "003.",
    3311,
    "借题发挥",
    "中文成语",
    "中文成语",
    "李敖引录借题发挥成语，写借某个题目扩张为其他目的。",
    3311,
    "校对补入：只收成语本体，不收同段现代政治训词。",
  ),
  q(
    "003.",
    3367,
    "言犹在耳",
    "中文成语",
    "中文成语",
    "李敖引录言犹在耳成语，写旧日言语仿佛仍在耳边。",
  ),
  q(
    "003.",
    3387,
    "虚与委蛇",
    "庄子成语",
    "《庄子·应帝王》相关成语",
    "李敖引录虚与委蛇成语，写表面敷衍周旋。",
  ),
  q(
    "003.",
    3419,
    "天怒人怨",
    "中文成语",
    "中文成语",
    "李敖引录天怒人怨成语，形容怨恨极深、众人不满。",
  ),
  q(
    "003.",
    3427,
    "甚嚣尘上",
    "左传成语",
    "《左传·成公十六年》相关成语",
    "李敖引录甚嚣尘上成语，写议论或声势喧腾。",
  ),
  q(
    "003.",
    3483,
    "不择手段",
    "中文成语",
    "中文成语",
    "李敖引录不择手段成语，形容为达目的不顾方法。",
  ),
  q(
    "003.",
    3619,
    "故步自封",
    "汉书成语",
    "《汉书·叙传上》相关成语",
    "李敖引录故步自封成语，写自我封闭、不求进取。",
  ),
  q(
    "003.",
    3819,
    "官官相护",
    "中文成语",
    "中文成语",
    "李敖引录官官相护成语，写官场中彼此包庇。",
    3819,
    "校对补入：只收成语本体，不收同段现代贪污叙述。",
  ),
  q(
    "003.",
    3831,
    "为所欲为",
    "中文成语",
    "中文成语",
    "李敖引录为所欲为成语，写表面上可以随心行事的权力状态。",
    3831,
    "校对补入：不用问句行，只取引文中实际出现处。",
  ),
  q(
    "003.",
    3831,
    "阳奉阴违",
    "中文成语",
    "中文成语",
    "李敖引录阳奉阴违成语，写表面服从而暗中违背。",
  ),
  q(
    "003.",
    4043,
    "义正词严",
    "中文成语",
    "中文成语",
    "李敖引录义正词严成语，写言辞严正而理由堂皇。",
    4043,
    "校对补入：只收成语本体，不收同段赔偿与政治责任争论。",
  ),
];

const modernPoliticalTerms = [
  "二二八",
  "国民党",
  "共产党",
  "中共",
  "党外",
  "民进党",
  "政府",
  "政权",
  "总统",
  "领袖",
  "国父",
  "革命",
  "反共",
  "反攻",
  "复国",
  "政治",
  "政党",
  "民主",
  "自由",
  "人权",
  "宪法",
  "司法",
  "法院",
  "法官",
  "戒严",
  "军法",
  "特务",
  "情报",
  "监狱",
  "自诉",
  "诽谤",
  "选举",
  "立法院",
  "监察院",
  "行政院",
  "国会",
  "中央",
  "台湾",
  "大陆",
  "中国",
  "台独",
  "统一",
  "省籍",
  "本省",
  "外省",
  "蒋介石",
  "蒋经国",
  "孙中山",
  "陈水扁",
  "李登辉",
  "陈仪",
  "白崇禧",
  "彭孟缉",
];

const omittedBoundaryExamples = [
  {
    source: "001.《你不知道的二二八》序（一）李敖.txt:11",
    quote_text: "二二八事件是中国人民在毛主席和中国共产党领导下，反帝反封建反官僚资本主义的新民主主义的一部分。",
    reason: "现代政治意识形态定性，按政治语录排除。",
  },
  {
    source: "001.《你不知道的二二八》序（一）李敖.txt:37",
    quote_text: "惩凶赔款；不秋后算账",
    reason: "虽短而可口号化，但直接属于事件谈判条件与政治处置语境，首轮不收。",
  },
  {
    source: "003.你不知道的二二八.txt:143",
    quote_text: "总督威风受不了，长官凶焰更难当。除去犲狼来虎豹，脱离地狱跳火坑。颠沛未曾忘祖国，流离何处找中央？哀哀千万倒悬子，何日云开见太阳！",
    reason: "虽为诗歌，但内容直接是现代政治讽刺与国族诉求，首轮按政治歌谣排除。",
  },
  {
    source: "003.你不知道的二二八.txt:171",
    quote_text: "开口奴化，闭口奴化，卑躬屈膝，奴颜事仇，竟称独立自主。伸手要金，缩手要银，与民争利，唯利是图，也说为民服务。",
    reason: "对联直接讽刺现代政治与政府治理，政治语录色彩过重。",
  },
  {
    source: "003.你不知道的二二八.txt:195",
    quote_text: "实行三民取利；三眠主义；建设谋叛的台乱",
    reason: "现代政治口号改写，首轮不收。",
  },
  {
    source: "003.你不知道的二二八.txt:199",
    quote_text: "盼中央，望中央，中央来了更遭殃",
    reason: "民谣中直接指向中央政治权力，首轮按政治歌谣排除。",
  },
  {
    source: "003.你不知道的二二八.txt:203",
    quote_text: "轰炸惊天动地，光复欢天喜地，接收花天酒地，政治黑天黑地，人们呼天唤地。",
    reason: "直接含现代政治控诉和事件歌谣色彩，按政治歌谣排除。",
  },
  {
    source: "003.你不知道的二二八.txt:3679",
    quote_text: "工作是道德；忙碌是幸福；闲空是堕落；懒惰是罪恶。",
    reason: "虽名为格言，但属于陈仪用人教条，现代政治人物语录色彩较重，首轮不收。",
  },
  {
    source: "001.《你不知道的二二八》序（一）李敖.txt:41",
    quote_text: "挽狂澜于既倒",
    reason: "已收入更完整的韩愈化用句“障百川而东之，挽狂澜于既倒”，校对轮不重复拆收。",
  },
  {
    source: "003.你不知道的二二八.txt:87",
    quote_text: "认贼作父",
    reason: "此处直接服务侵略者/祖国的民族敌我比喻，同段国家亲属化语境过重，校对轮不收。",
  },
  {
    source: "003.你不知道的二二八.txt:3283",
    quote_text: "引咎辞职",
    reason: "官场处置与现代政治职务语境太强，虽总表有近似先例，本书校对轮不补。",
  },
];

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
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
  const lineDiff = a.line_start - b.line_start;
  if (lineDiff) return lineDiff;
  return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
}

function rowKey(row) {
  return `${row.source_file}:${row.line_start}:${row.line_end}:${normalizeText(row.quote_text)}`;
}

const proofreadAdditionKeys = new Set(proofreadAdditions.map(rowKey));
const selectedRows = rawRows
  .concat(proofreadAdditions)
  .slice()
  .sort(rowCompare)
  .map((row, index) => ({
    ...row,
    id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
  }));
const addedRows = selectedRows.filter((row) => proofreadAdditionKeys.has(rowKey(row)));

const auditRows = selectedRows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of selectedRows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = selectedRows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

if (missing.length) {
  throw new Error(`Missing quote text in source: ${missing.map((item) => `${item.row.id}:${item.row.quote_text}`).join(", ")}`);
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
const header = columns.join(",");

fs.writeFileSync(outCsv, `\uFEFF${header}\r\n${selectedRows.map(rowToCsv).join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`条目数：${selectedRows.length}`);
txt.push("");
for (const row of selectedRows) {
  txt.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txt.push(`引用：${row.quote_text}`);
  txt.push(`出处线索：${row.source_or_origin}`);
  txt.push(`摘要：${row.summary}`);
  txt.push(`备注：${row.notes}`);
  txt.push("");
}
fs.writeFileSync(outTxt, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(selectedRows, null, 2)}\n`, "utf8");

const reviewHeader = [
  "id",
  "decision",
  "category",
  "quote_text",
  "source_or_origin",
  "source_file",
  "line_start",
  "line_end",
  "summary",
  "notes",
];
const reviewLines = [
  reviewHeader.join("\t"),
  ...selectedRows.map((row) =>
    reviewHeader
      .map((column) => {
        if (column === "decision") return proofreadAdditionKeys.has(rowKey(row)) ? "add-proofread" : "keep-proofread";
        return String(row[column] ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
      })
      .join("\t"),
  ),
];
fs.writeFileSync(reviewTsv, `${reviewLines.join("\r\n")}\r\n`, "utf8");

const auditHeader = ["id", "present", "political_hits", "duplicate_count", "quote_text", "source_file", "line_start", "line_end"];
const auditLines = [
  auditHeader.join("\t"),
  ...auditRows.map((item) =>
    [
      item.row.id,
      item.present ? "yes" : "no",
      item.politicalHits.join("|"),
      duplicateTexts.get(normalizeText(item.row.quote_text)),
      item.row.quote_text,
      item.row.source_file,
      item.row.line_start,
      item.row.line_end,
    ]
      .map((value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " "))
      .join("\t"),
  ),
];
fs.writeFileSync(auditTsv, `${auditLines.join("\r\n")}\r\n`, "utf8");

const report = {
  book,
  generatedDate,
  sourceDir,
  sourceFiles: files.length,
  candidatesJson,
  reviewCandidatesTsv,
  initialRowsBeforeProofread: rawRows.length,
  selectedRows: selectedRows.length,
  proofreadAddedRows: addedRows.map((row) => ({
    id: row.id,
    quote_text: row.quote_text,
    source_file: row.source_file,
    line_start: row.line_start,
    category: row.category,
  })),
  proofreadRemovedRows: [],
  missingQuotes: missing.map((item) => item.row.id),
  politicalHits: politicalHits.map((item) => ({
    id: item.row.id,
    quote_text: item.row.quote_text,
    hits: item.politicalHits,
  })),
  duplicateQuotes: duplicates.map((row) => row.id),
  omittedBoundaryExamples,
  csvPath: outCsv,
  txtPath: outTxt,
  selectedJson,
  reviewTsv,
  auditTsv,
};
fs.writeFileSync(reportTxt, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report, null, 2));
