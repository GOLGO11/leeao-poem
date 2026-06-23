const fs = require("fs");
const path = require("path");

const book = "读史指南";
const idPrefix = "LADSZ";
const generatedDate = "2026-06-23";
const outDir = "exports";
const analysisDir = "analysis";
const analysisPrefix = "liao_dushi_zhinan";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "009.历史文化类",
  "002.读史指南",
);

const sourceDecoder = new TextDecoder("gb18030");
const lineCache = new Map();

function readLines(file) {
  if (!lineCache.has(file)) {
    const sourcePath = path.join(process.cwd(), sourceDir, file);
    lineCache.set(file, sourceDecoder.decode(fs.readFileSync(sourcePath)).split(/\r?\n/));
  }
  return lineCache.get(file);
}

function sourceFiles() {
  return fs.readdirSync(path.join(process.cwd(), sourceDir))
    .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function chapterFromFile(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
}

function quoteFromLines(file, lineStart, lineEnd) {
  return readLines(file)
    .slice(lineStart - 1, lineEnd)
    .map((line) => line.replace(/^[\s　]+/, "").replace(/\s+$/, ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

function compact(text) {
  return String(text).replace(/[\s　]+/g, "");
}

function stripSourceNotes(text) {
  return String(text).replace(/（wjm_tcy注：[^）]*）/g, "");
}

function comparable(text) {
  return compact(stripSourceNotes(text));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
}

function row(file, lineStart, lineEnd, quoteText, category, sourceOrigin, summary, notes = "") {
  return {
    id: "",
    book,
    chapter: chapterFromFile(file),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrigin,
    summary,
    notes,
  };
}

function lineRow(file, lineStart, lineEnd, category, sourceOrigin, summary, notes = "") {
  return row(
    file,
    lineStart,
    lineEnd,
    quoteFromLines(file, lineStart, lineEnd),
    category,
    sourceOrigin,
    summary,
    notes,
  );
}

const data = [
  row(
    "002.《古今图书集成》研究.txt",
    155,
    155,
    "目营手检，无间晨夕",
    "治学格言",
    "陈梦雷《进汇编启略》转述",
    "李敖写陈梦雷编书勤苦时摘出的治学语。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    161,
    161,
    "以一人独肩斯任",
    "治学格言",
    "陈梦雷编纂事迹",
    "概括陈梦雷独力承担巨编的精神。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    247,
    247,
    "铜铸字，工费而不便久藏。",
    "印刷史格言",
    "沈括《梦溪笔谈》转引",
    "李敖引沈括语说明铜活字工费高且不便久藏。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    263,
    263,
    "恐书先印，序是后加",
    "版本考据语",
    "蒋复璁《古今图书集成的前因后果》",
    "蒋复璁以版本纸张版式推测序文后加。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    421,
    421,
    "古今未有之奇书，宇内读书人求一见不可得，而玉竟得两部以贻子孙，亦古今未有之幸事也！",
    "藏书题跋名句",
    "张廷玉《澄怀园语》",
    "张廷玉赞《古今图书集成》珍贵难得。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    425,
    425,
    "自有书契以来，以一书贯串古今，包罗万有，未有如我朝古今图书集成者。",
    "藏书题跋名句",
    "张廷玉《澄怀园语》",
    "张廷玉以包罗万有形容《古今图书集成》的规模。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    425,
    425,
    "诚册府之巨观，为群书之渊海。",
    "藏书题跋名句",
    "张廷玉《澄怀园语》",
    "以册府巨观、群书渊海赞巨型类书。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    455,
    455,
    "这个书也不过如聋子的耳朵，摆设而已。",
    "小说俗语",
    "陈森《品花宝鉴》",
    "小说人物用俗语讽刺藏书有而不用。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    465,
    465,
    "一万卷皆完好，诚中国之瑰宝也！愿为中国之文明保存之。",
    "藏书题跋名句",
    "康有为跋《古今图书集成》",
    "康有为跋语中保存文化典籍的感慨。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    475,
    475,
    "儿时闻图书集成之名，某处有一部，某老人曾阅过几遍，心向往之，未见其书也！",
    "出版回忆语",
    "陆费逵《影印缘起》",
    "陆费逵回忆早年向往《古今图书集成》而不得见。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    481,
    481,
    "当兹四海困穷之时，能以千元购书者，究有几人？",
    "出版感叹语",
    "陆费逵《影印缘起》",
    "陆费逵感叹民国年间重印巨书定价高昂。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    513,
    513,
    "摭拾群书、以类相从",
    "类书方法语",
    "李敖《〈古今图书集成〉研究》",
    "李敖概括类书的资料组织方法。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    513,
    513,
    "兔园册子",
    "类书贬称",
    "古代读书人讥称",
    "李敖说明古人轻视类书时使用的讥称。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    527,
    527,
    "然因编纂体例凌乱，检查亦殊不易也！",
    "治学评语",
    "梁启超《图书大辞典簿录之部》",
    "梁启超评《古今图书集成》检索不便。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    533,
    533,
    "中有苦心而不能显",
    "史学格言",
    "章学诚语",
    "李敖借章学诚语说明索引编制的隐微辛苦。",
  ),
  row(
    "002.《古今图书集成》研究.txt",
    533,
    533,
    "中有调剂而人不知",
    "史学格言",
    "章学诚语",
    "李敖借章学诚语说明整理旧书的斟酌调剂。",
  ),
  row(
    "003.介绍世界最大的百科全书.txt",
    11,
    11,
    "读书五十载",
    "治学格言",
    "陈梦雷事迹",
    "李敖介绍陈梦雷编成巨著前的长期读书积累。",
  ),
  row(
    "003.介绍世界最大的百科全书.txt",
    11,
    11,
    "涉猎万余卷",
    "治学格言",
    "陈梦雷事迹",
    "李敖介绍陈梦雷广泛涉猎古籍的治学底子。",
  ),
  row(
    "003.介绍世界最大的百科全书.txt",
    43,
    43,
    "作〔宰〕相须用读书人",
    "读书格言",
    "宋太祖、窦仪故事",
    "镜部纪事中借宋太祖故事凸显读书人的用处。",
  ),
  row(
    "003.介绍世界最大的百科全书.txt",
    43,
    43,
    "由是大重儒者",
    "读书格言",
    "宋太祖、窦仪故事",
    "宋太祖因窦仪解惑而重视儒者的故事语。",
  ),
  row(
    "003.介绍世界最大的百科全书.txt",
    45,
    45,
    "运用之妙，存乎一把钥匙",
    "治学格言",
    "李敖《介绍世界最大的百科全书》",
    "李敖把索引比为活用巨书的钥匙。",
  ),
  row(
    "003.介绍世界最大的百科全书.txt",
    45,
    45,
    "坐拥百城、白首穷经，实际上却往往事倍而功不半",
    "治学格言",
    "李敖《介绍世界最大的百科全书》",
    "李敖批评无索引方法的死读书。",
  ),
  row(
    "003.介绍世界最大的百科全书.txt",
    47,
    47,
    "只会死编书，而不会活用书",
    "治学格言",
    "李敖《介绍世界最大的百科全书》",
    "李敖批评只编书而不懂索引活用的治学毛病。",
  ),
  lineRow(
    "004.中国历史演义总说.txt",
    9,
    43,
    "清代曲文",
    "归庄《万古愁》",
    "李敖引归庄曲文讽写帝王兴替与历史名号繁多。",
  ),
  row(
    "004.中国历史演义总说.txt",
    45,
    45,
    "一部十七史，从何处说起？我今日非赴博学宏词科，不暇泛言。",
    "历史掌故语",
    "文天祥答博罗丞相语",
    "文天祥以十七史浩繁回应对方追问。",
  ),
  row(
    "004.中国历史演义总说.txt",
    47,
    47,
    "全史浩繁，从何说起",
    "读史格言",
    "张之洞读史主张",
    "张之洞概括通读全史的浩繁难处。",
  ),
  row(
    "004.中国历史演义总说.txt",
    47,
    47,
    "四史为最重要",
    "读史格言",
    "张之洞读史主张",
    "张之洞主张先重四史的读史取径。",
  ),
  row(
    "004.中国历史演义总说.txt",
    55,
    55,
    "欲知后事如何，且听下回分解",
    "说书套语",
    "章回小说、说书传统",
    "李敖说明说书与章回小说的悬念套语。",
  ),
  row(
    "004.中国历史演义总说.txt",
    59,
    59,
    "《三国演义》究竟是一部绝好的通俗历史。",
    "文学评论名句",
    "胡适《三国志演义序》",
    "胡适肯定《三国演义》的通俗历史价值。",
  ),
  row(
    "004.中国历史演义总说.txt",
    59,
    59,
    "在几千年的通俗教育史上，没有一部比得上它的魔力。",
    "文学评论名句",
    "胡适《三国志演义序》",
    "胡适称《三国演义》在通俗教育史上具有巨大魔力。",
  ),
  row(
    "004.中国历史演义总说.txt",
    59,
    59,
    "五百年来，无数的失学国民从这部书里得着了无数的常识与智慧，从这部书里学会了看书写信作文的技能，从这部书里学得了做人与应世的本领。",
    "文学评论名句",
    "胡适《三国志演义序》",
    "胡适说明《三国演义》对民间教育的影响。",
  ),
  row(
    "004.中国历史演义总说.txt",
    59,
    59,
    "他们只求一部趣味浓厚，看了使人不肯放手的教科书。",
    "文学评论名句",
    "胡适《三国志演义序》",
    "胡适概括民众需要的通俗教科书。",
  ),
  row(
    "004.中国历史演义总说.txt",
    65,
    65,
    "管鲍之交",
    "成语典故",
    "《东周列国志》",
    "李敖列举《东周列国志》保存的成语来历。",
  ),
  row(
    "004.中国历史演义总说.txt",
    65,
    65,
    "弦高犒师",
    "成语典故",
    "《东周列国志》",
    "李敖列举《东周列国志》保存的成语来历。",
  ),
  row(
    "004.中国历史演义总说.txt",
    65,
    65,
    "退避三舍",
    "成语典故",
    "《东周列国志》",
    "李敖列举《东周列国志》保存的成语来历。",
  ),
  row(
    "004.中国历史演义总说.txt",
    65,
    65,
    "食指大动",
    "成语典故",
    "《东周列国志》",
    "李敖列举《东周列国志》保存的成语来历。",
  ),
  row(
    "004.中国历史演义总说.txt",
    65,
    65,
    "大义灭亲",
    "成语典故",
    "《东周列国志》",
    "李敖列举《东周列国志》保存的成语来历。",
  ),
  row(
    "004.中国历史演义总说.txt",
    65,
    65,
    "奇货可居",
    "成语典故",
    "《东周列国志》",
    "李敖列举《东周列国志》保存的成语来历。",
  ),
  row(
    "004.中国历史演义总说.txt",
    65,
    65,
    "欲加之罪，何患无辞",
    "成语典故",
    "《东周列国志》",
    "李敖列举《东周列国志》保存的成语来历。",
  ),
  row(
    "004.中国历史演义总说.txt",
    109,
    109,
    "三王之世，若存若亡；五帝之世，若觉若梦。……太古至于今日，年数不可胜数。",
    "古籍名句",
    "《列子-杨朱篇》",
    "李敖借《列子》说明太古历史遥远难考。",
  ),
  row(
    "004.中国历史演义总说.txt",
    123,
    123,
    "指鹿为马",
    "成语典故",
    "《秦汉演义》相关典故",
    "李敖列举秦汉故事中流传下来的成语语源。",
  ),
  row(
    "004.中国历史演义总说.txt",
    123,
    123,
    "破釜沉舟",
    "成语典故",
    "《秦汉演义》相关典故",
    "李敖列举秦汉故事中流传下来的成语语源。",
  ),
  row(
    "004.中国历史演义总说.txt",
    123,
    123,
    "陈仓暗渡",
    "成语典故",
    "《秦汉演义》相关典故",
    "李敖列举秦汉故事中流传下来的成语语源。",
  ),
  row(
    "004.中国历史演义总说.txt",
    123,
    123,
    "鸿沟为界",
    "成语典故",
    "《秦汉演义》相关典故",
    "李敖列举秦汉故事中流传下来的成语语源。",
  ),
  row(
    "004.中国历史演义总说.txt",
    123,
    123,
    "兔死狗烹",
    "成语典故",
    "《秦汉演义》相关典故",
    "李敖列举秦汉故事中流传下来的成语语源。",
  ),
  row(
    "004.中国历史演义总说.txt",
    139,
    139,
    "人心思汉",
    "成语典故",
    "《后汉演义》相关典故",
    "李敖列举后汉故事中流传下来的成语语源。",
  ),
  row(
    "004.中国历史演义总说.txt",
    139,
    139,
    "差强人意",
    "成语典故",
    "《后汉演义》相关典故",
    "李敖列举后汉故事中流传下来的成语语源。",
  ),
  row(
    "004.中国历史演义总说.txt",
    139,
    139,
    "咄咄逼人",
    "成语典故",
    "《后汉演义》相关典故",
    "李敖列举后汉故事中流传下来的成语语源。",
  ),
  row(
    "004.中国历史演义总说.txt",
    139,
    139,
    "马革裹尸",
    "成语典故",
    "《后汉演义》相关典故",
    "李敖列举后汉故事中流传下来的成语语源。",
  ),
  row(
    "004.中国历史演义总说.txt",
    139,
    139,
    "文君新寡",
    "成语典故",
    "《后汉演义》相关典故",
    "李敖列举后汉故事中流传下来的成语语源。",
  ),
  row(
    "004.中国历史演义总说.txt",
    145,
    145,
    "或谑张飞胡，或笑邓艾吃",
    "唐诗残句",
    "李商隐诗句",
    "李敖引李商隐诗句说明唐代已有三国故事流传。",
  ),
  row(
    "004.中国历史演义总说.txt",
    157,
    157,
    "乐不思蜀",
    "成语典故",
    "刘禅故事",
    "李敖用刘禅故事中的成语说明三国归晋前后。",
  ),
  row(
    "004.中国历史演义总说.txt",
    157,
    157,
    "金陵王气黯然收",
    "唐诗名句",
    "刘禹锡《西塞山怀古》",
    "李敖借刘禹锡诗句写孙吴终局。",
  ),
  row(
    "004.中国历史演义总说.txt",
    177,
    177,
    "南朝四百八十寺",
    "唐诗名句",
    "杜牧《江南春》",
    "李敖化用杜牧诗句说明南北朝佛寺之盛。",
  ),
  row(
    "004.中国历史演义总说.txt",
    189,
    189,
    "休休有容",
    "古典成语",
    "《尚书》相关典故",
    "李敖用古典成语形容唐太宗对外来与异己的度量。",
  ),
  row(
    "004.中国历史演义总说.txt",
    189,
    189,
    "汪汪叔度",
    "古典成语",
    "黄宪叔度典故",
    "李敖用古典成语形容唐太宗对人才的度量。",
  ),
  row(
    "004.中国历史演义总说.txt",
    191,
    191,
    "唐时才士，无不遇之叹。",
    "历史评语",
    "魏元旷《蕉厂随笔》",
    "李敖借魏元旷语说明唐代人才际遇。",
  ),
  row(
    "004.中国历史演义总说.txt",
    193,
    193,
    "可怜‘玉环’倚新装",
    "诗文名句",
    "唐朝文化相关诗句",
    "李敖借诗句点出唐代文化形象。",
  ),
  row(
    "004.中国历史演义总说.txt",
    193,
    193,
    "内库烧为锦绣灰",
    "诗文名句",
    "唐朝文化相关诗句",
    "李敖借诗句写唐朝物质繁华已逝而文化长存。",
  ),
  row(
    "004.中国历史演义总说.txt",
    275,
    275,
    "会读历史演义的人，会用最少的精力，得到最大的好处。",
    "读史格言",
    "李敖《中国历史演义总说》",
    "李敖概括历史演义作为通俗读史入口的好处。",
  ),
  row(
    "004.中国历史演义总说.txt",
    289,
    289,
    "无端忽作太平梦，放眼昆仑绝顶来，河岳层层团锦绣，华严界界有楼台。六州牛耳无双誉，百轴麟图不世才，掀髯正视群龙笑，谁信晨鸡蓦换回？",
    "近代诗",
    "梁启超《自题〈新中国未来记〉》",
    "李敖引梁启超自题诗第一首。",
    "入选为诗文引用；虽在政治小说背景中，非政治语录。",
  ),
  row(
    "004.中国历史演义总说.txt",
    291,
    291,
    "却横西海望中原，黄雾沉沉白日昏，万壑豕蛇谁是主？千山魑魅寂无人。青年心死秋梧悴，老国魂归蜀道难，道是夭亡天不管，朅来予亦欲无言。",
    "近代诗",
    "梁启超《自题〈新中国未来记〉》",
    "李敖引梁启超自题诗第二首。",
    "入选为诗文引用；虽在政治小说背景中，非政治语录。",
  ),
  row(
    "004.中国历史演义总说.txt",
    295,
    295,
    "白头宫女谈天宝",
    "诗文典故",
    "白居易《长恨歌》化用",
    "李敖以宫女谈天宝比喻熟悉旧事的讲述者。",
  ),
  row(
    "004.中国历史演义总说.txt",
    295,
    295,
    "古董山人说晚明",
    "诗文典故",
    "李敖《中国历史演义总说》",
    "李敖以古董山人说晚明比喻渊博谈史。",
  ),
];

const riskPattern = /大总统|总统|革命|民主|自由|政府|国民党|共产党|国家|人权|宪法|政治|政党|政权|军阀|北洋|统治|特工|锦衣卫|太监|廷杖|民族大义|夷夏之防|驱逐|鞑虏|中华民国|民国演义|民国成立|民国来了|民国主政|新中国|未来记|先知|理想国/;
const candidatePattern = /[“”‘’]|曰：|云：|说：|诗句|诗云|曲子|格言|名言|谚|典故|成语|《[^》]+》|欲知后事|从何处说起|作〔宰〕相|读书五十载|中有苦心|中有调剂|力防其所疑/;

function assignIds(rows) {
  rows.forEach((record, index) => {
    record.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
  });
}

function validateRows(rows) {
  assignIds(rows);
  const errors = [];
  const seen = new Set();

  for (const record of rows) {
    if (seen.has(record.id)) errors.push(`${record.id}: duplicate id`);
    seen.add(record.id);

    const lines = readLines(record.source_file);
    const sourceText = lines.slice(record.line_start - 1, record.line_end).join("\n");
    if (!sourceText.includes(record.quote_text) && !comparable(sourceText).includes(comparable(record.quote_text))) {
      errors.push(`${record.id}: quote not found at ${record.source_file}:${record.line_start}-${record.line_end}`);
    }
  }

  if (errors.length) {
    throw new Error(`Validation failed:\n${errors.join("\n")}`);
  }
}

function writeCsv(rows, csvPath) {
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
  const lines = [
    columns.join(","),
    ...rows.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
  ];
  fs.writeFileSync(csvPath, `\uFEFF${lines.join("\r\n")}\r\n`, "utf8");
}

function writeTxt(rows, txtPath) {
  const lines = [
    `《${book}》诗文格言歌谣引用`,
    `生成日期：${generatedDate}`,
    `条目数：${rows.length}`,
    "",
  ];

  for (const record of rows) {
    lines.push(`${record.id}｜${record.chapter}｜${record.source_file}:${record.line_start}-${record.line_end}`);
    lines.push(`类别：${record.category}`);
    lines.push(`来源：${record.source_or_origin}`);
    lines.push("原文：");
    lines.push(record.quote_text);
    lines.push(`说明：${record.summary}`);
    if (record.notes) lines.push(`备注：${record.notes}`);
    lines.push("");
  }

  fs.writeFileSync(txtPath, `\uFEFF${lines.join("\r\n")}`, "utf8");
}

function collectCandidates(rows) {
  const selectedKeys = rows.map((record) => ({
    file: record.source_file,
    start: Number(record.line_start),
    end: Number(record.line_end),
  }));
  const candidates = [];
  let totalLines = 0;
  let riskLines = 0;

  for (const file of sourceFiles()) {
    const lines = readLines(file);
    totalLines += lines.length;
    lines.forEach((line, index) => {
      const text = line.trim();
      if (!text) return;
      if (/李敖影音|李敖数字博物馆|资源下载站|leeaoweb|leeao\.net|wjm_tcy|QQ群|油管|抖音/.test(text)) return;
      const risk = riskPattern.test(text);
      if (risk) riskLines += 1;
      if (!candidatePattern.test(text) && !risk) return;
      const lineNumber = index + 1;
      candidates.push({
        source_file: file,
        line: lineNumber,
        text,
        risk,
        selected: selectedKeys.some((item) => item.file === file && lineNumber >= item.start && lineNumber <= item.end),
        context: lines
          .slice(Math.max(0, index - 1), Math.min(lines.length, index + 2))
          .map((item) => item.trim())
          .filter(Boolean)
          .join(" / "),
      });
    });
  }

  return { totalLines, riskLines, candidates };
}

function writeAnalysis(rows, candidatesInfo) {
  const candidateJsonPath = path.join(analysisDir, `${analysisPrefix}_quote_candidates.json`);
  fs.writeFileSync(candidateJsonPath, JSON.stringify(candidatesInfo.candidates, null, 2), "utf8");

  const reviewTsvPath = path.join(analysisDir, `${analysisPrefix}_review_candidates.tsv`);
  const reviewRows = candidatesInfo.candidates.filter((candidate) => !candidate.selected);
  const reviewLines = [
    "source_file\tline\trisk\ttext\tcontext",
    ...reviewRows.map((candidate) =>
      [
        candidate.source_file,
        candidate.line,
        candidate.risk ? "true" : "false",
        tsvEscape(candidate.text),
        tsvEscape(candidate.context),
      ].join("\t"),
    ),
  ];
  fs.writeFileSync(reviewTsvPath, `${reviewLines.join("\r\n")}\r\n`, "utf8");

  const byFile = new Map();
  for (const record of rows) {
    byFile.set(record.source_file, (byFile.get(record.source_file) ?? 0) + 1);
  }

  const selectedRiskLines = candidatesInfo.candidates
    .filter((candidate) => candidate.selected && candidate.risk)
    .map((candidate) => `${candidate.source_file}:${candidate.line}`);

  const reportLines = [
    `《${book}》诗文格言歌谣引用首轮报告`,
    `生成日期：${generatedDate}`,
    "",
    "范围：",
    `- 源目录：${sourceDir}`,
    `- 源文件数：${sourceFiles().length}`,
    `- 源文本行数：${candidatesInfo.totalLines}`,
    "",
    "结果：",
    `- 入选条目：${rows.length}`,
    `- 输出CSV：${path.join(outDir, `${book}_诗文格言歌谣引用.csv`)}`,
    `- 输出TXT：${path.join(outDir, `${book}_诗文格言歌谣引用.txt`)}`,
    "",
    "入选分布：",
    ...[...byFile.entries()].map(([file, count]) => `- ${file}: ${count}`),
    "",
    "候选与风险：",
    `- 候选/风险行：${candidatesInfo.candidates.length}`,
    `- 政治风险行：${candidatesInfo.riskLines}`,
    `- 已入选但带风险词的源行：${selectedRiskLines.length ? selectedRiskLines.join("；") : "无"}`,
    `- 待复核候选：${reviewRows.length}（见 ${reviewTsvPath}）`,
    "",
    "剔除原则：",
    "- 书目表、版本数字、目录条目不入选。",
    "- 民国政治论断、革命口号、政权评价、现代政治人物/制度表述不入选。",
    "- 古代诗文、成语典故、说书套语、读书治学格言可入选；带政治小说背景的梁启超诗，作为诗文引用保留并加备注。",
  ];

  fs.writeFileSync(path.join(analysisDir, `${analysisPrefix}_initial_report.txt`), `${reportLines.join("\r\n")}\r\n`, "utf8");
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(analysisDir, { recursive: true });

  validateRows(data);

  const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
  const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
  writeCsv(data, csvPath);
  writeTxt(data, txtPath);

  const candidatesInfo = collectCandidates(data);
  writeAnalysis(data, candidatesInfo);

  console.log(JSON.stringify({
    book,
    rows: data.length,
    csvPath,
    txtPath,
    reportPath: path.join(analysisDir, `${analysisPrefix}_initial_report.txt`),
  }, null, 2));
}

main();
