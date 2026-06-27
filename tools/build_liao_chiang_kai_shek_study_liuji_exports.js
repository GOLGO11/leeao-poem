const fs = require("fs");
const path = require("path");

const book = "蒋介石研究六集";
const idPrefix = "LAJJS6";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "021.蒋介石研究六集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chiang_kai_shek_study_liuji_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chiang_kai_shek_study_liuji_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_chiang_kai_shek_study_liuji_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_chiang_kai_shek_study_liuji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chiang_kai_shek_study_liuji_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_chiang_kai_shek_study_liuji_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_chiang_kai_shek_study_liuji_initial_report.txt");
const proofreadReviewTsv = path.join("analysis", "liao_chiang_kai_shek_study_liuji_proofread_review.tsv");
const proofreadAuditTsv = path.join("analysis", "liao_chiang_kai_shek_study_liuji_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_chiang_kai_shek_study_liuji_proofread_report.txt");
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
      "保守收入：《蒋介石研究六集》以孙中山、道统、迁都、陈布雷、江南案、吴稚晖、吴国桢、《文星》查禁与情治材料为主体；现代党派、政权、领袖、军政、战争、革命、国家民族、暗杀、情治、查禁、言论自由、党国文件、法庭与意识形态语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、俗语、成语、文学格言和非政治成句。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "003.",
    7,
    "去圣人之世，若此其未远也；近圣人之居，若此其甚也",
    "孟子古文句",
    "《孟子·尽心下》",
    "李敖引孟子句，说明孟子对自己所处圣人传统远近的定位。",
    7,
    "只收孟子古文句本体；不收道统被现代政治挪用的论证。",
  ),
  q(
    "003.",
    7,
    "然而无有乎尔，则亦无有乎尔",
    "孟子古文句",
    "《孟子·尽心下》",
    "李敖引孟子句，说明无人继起时自任其责的语气。",
    7,
    "只收孟子古文句本体；不收现代道统宣传语境。",
  ),
  q(
    "003.",
    7,
    "如欲平治天下，当今之世，舍我其谁哉？",
    "孟子古文句",
    "《孟子·公孙丑下》",
    "李敖引孟子名句，写其以平治天下自任的气魄。",
    7,
    "只收古典文本本体；不收后文革命思想、领袖继承等现代政治话语。",
  ),
  q(
    "003.",
    7,
    "乃所愿，则学孔子也！",
    "孟子古文句",
    "《孟子·公孙丑上》",
    "李敖引孟子句，表示孟子所愿在于学习孔子。",
    7,
    "只收孟子古文句本体；不收道统宣传语境。",
  ),
  q(
    "003.",
    13,
    "尧以是传之舜，舜以是传之禹，禹以是传之汤，汤以是传之文、武、周公，文、武、周公传之孔子，孔子传之孟轲，轲之死，不得其传焉",
    "韩愈古文句",
    "韩愈《原道》",
    "李敖转引韩愈《原道》中的道统传承叙述。",
    13,
    "只收韩愈古文句本体；不收现代党国借道统包装政治合法性的语境。",
  ),
  q(
    "003.",
    15,
    "自是以来，圣圣相承，若成汤、文、武之为君，皋陶、伊、傅、周、召之为臣，既皆以此而接夫道统之传。",
    "朱熹古文句",
    "朱熹《中庸章句序》",
    "李敖转引朱熹序文中说明圣贤相承、接续道统的句子。",
    15,
    "只收朱熹古文句本体；不收后文统治者抢道统的现代政治批评。",
  ),
  q(
    "003.",
    23,
    "曾子不在四科之目……舍孔子而宗孟轲，则于本统离矣！",
    "宋人论学文句",
    "叶适论道统",
    "李敖转引叶适反驳朱熹道统说的论学句。",
    23,
    "只收宋人论学句本体；不收现代政治人物道统宣传。",
  ),
  q(
    "003.",
    77,
    "大道之行也，天下为公，选贤与能，讲信修睦。故人不独亲其亲、不独子其子，使老有所终，壮有所用，幼有所长，矜寡孤独废疾者皆有所养，男有分，女有归。货恶其弃于地也，不必藏于己；力恶其不出于身也，不必为己。是故谋闭而不兴，盗窃乱贼而不作，故外户而不闭，是谓大同。",
    "古典礼运文句",
    "《礼记·礼运》",
    "李敖转引《礼运》大同篇，作为被反复挪用的古典思想文本。",
    77,
    "只收《礼记》古典文本本体；不收三民主义、革命思想和领袖宣传语境。",
  ),
  q(
    "004.",
    85,
    "宾至如归",
    "俗语成语",
    "中国俗语",
    "李敖转引黄仁霖说明招待所张贴的俗语，表示客人到来如同回家。",
    85,
    "只收俗语本体；不收战地服务团、来华助战洋人与国民党财政负担语境。",
  ),
  q(
    "005.",
    49,
    "不求安乐者，子孙有时可以得到安乐；求安乐者，每不得安乐。",
    "现代格言",
    "傅斯年《战后建都问题》",
    "李敖转引傅斯年关于求安乐反不得安乐的警句。",
    49,
    "只收格言本体；不收战后建都、首都选择和党国迁都论证。",
  ),
  q(
    "005.",
    75,
    "青山绕郭，长江如带",
    "骈文景物句",
    "蒋介石《还都敬告国父文》",
    "李敖转引还都告文中的景物句，写南京山水环绕、长江如带。",
    75,
    "只收景物句本体；不收还都、首都失守与现代政治哀鸣语境。",
  ),
  q(
    "006.",
    35,
    "长太息以掩涕兮，哀民生之多艰",
    "楚辞句",
    "屈原《离骚》",
    "李敖转引屈原《离骚》句，写临景悲怆、忧患深重。",
    35,
    "只收楚辞句本体；不收陈布雷、南京与政权亡国论证。",
  ),
  q(
    "006.",
    39,
    "贫僧塔坏，陛下社稷随坏。",
    "历史传说文句",
    "宝志禅师与梁武帝传说",
    "李敖转引灵谷寺旧事中宝志禅师答梁武帝的预言句。",
    39,
    "只收古代寺塔传说本体；不收借古讽今的亡国政治论证。",
  ),
  q(
    "006.",
    39,
    "六帝园林堕劫灰，独余灵谷葬崔嵬，行人指点云间鹤，唤得齐梁一梦回。",
    "宋人题寺诗",
    "宋人题灵谷寺诗",
    "李敖转引宋人题灵谷寺诗，写六朝旧迹与灵谷寺沧桑。",
    39,
    "只收题寺诗本体；不收后文李敖翻作的亡国政治讽刺诗。",
  ),
  q(
    "013.",
    89,
    "生未带来，死乃支配，可耻！",
    "遗嘱警句",
    "吴稚晖遗嘱文句（魏景蒙转述）",
    "李敖转引吴稚晖遗嘱中的警句，表示身外之财生未带来而死后支配可耻。",
    89,
    "只收遗嘱警句本体；不收吴稚晖党国元老身份、金钱往来和政治评价。",
  ),
  q(
    "016.",
    5,
    "星沉海底当窗见，雨过河源隔座看。",
    "唐诗句",
    "李商隐《碧城诗》",
    "李敖以李商隐诗句题《文星》兴亡，借星沉、雨过写旁观与亲历。",
    5,
    "只收李商隐诗句本体；不收《文星》查禁与出版政治语境。",
  ),
  q(
    "016.",
    19,
    "有多少人是因为读了一本书才开始他的新生命",
    "读书格言",
    "梭罗语",
    "李敖转引梭罗读书格言，说明一本书可能开启人的新生命。",
    19,
    "只收读书格言本体；不收《文星》思想路线、查禁和官方罗织语境。",
  ),
  q(
    "016.",
    47,
    "儿大爷难做",
    "口语成句",
    "萧同兹口语",
    "李敖转述萧同兹的话，说明儿子长大后父亲难以管束。",
    47,
    "只收家常口语成句；不收萧同兹、萧孟能与国民党权力关系语境。",
  ),
  q(
    "016.",
    445,
    "与人刃我，宁我自刃",
    "李敖成句",
    "李敖叙述成句",
    "李敖用成句概括与其让别人下手，不如自己结束的处境。",
    445,
    "只收自我了断式成句；不收文星被迫停业、警总搜查和查禁语境。",
  ),
  q(
    "016.",
    477,
    "有福先享、有难独当",
    "李敖自况成句",
    "李敖自述",
    "李敖用这句概括自己享福在前、遇难独当的行事风格。",
    477,
    "只收自况成句；不收文星资料室、禁书栽赃和保安处查问语境。",
  ),
  q(
    "020.",
    23,
    "临老去国，昔人所悲，唯借楮墨，以遣旅怀",
    "题跋散文句",
    "童轩荪《生的哀歌日记》题意",
    "李敖转引童轩荪用以说明晚年去国、借笔墨遣怀的散文句。",
    23,
    "只收题跋散文句本体；不收童轩荪受难与政治犯经历语境。",
  ),
  q(
    "020.",
    41,
    "江海有能容之量",
    "旧式颂语",
    "旧式成语化颂语",
    "李敖转引赞人有江海能容之量的旧式颂语。",
    41,
    "只收容量成句本体；不收革命领袖评价和政治人物比较语境。",
  ),
  q(
    "020.",
    157,
    "他年得遂投闲计，只对青山不著书",
    "现代诗句",
    "童轩荪诗句",
    "李敖转引童轩荪自述晚年愿望的诗句，写得遂闲居后只对青山不再著书。",
    157,
    "只收诗句本体；不收国民党刑狱、寄迹异邦和政治受难语境。",
  ),
  q(
    "020.",
    159,
    "如今腐草无萤火，终古垂杨有暮鸦！",
    "唐诗句",
    "李商隐《隋宫》",
    "李敖转引李商隐诗句，借腐草、垂杨写沧桑荒凉。",
    159,
    "只收李商隐诗句本体；不收童轩荪受难、政治犯与白色恐怖语境。",
  ),
];

const proofreadRemovedRows = [];

const proofreadAdditions = [
  q(
    "003.",
    13,
    "觝排异端，攘斥佛老",
    "韩愈论学成句",
    "韩愈排斥佛老语",
    "李敖引此概括韩愈排斥佛老、维护儒学的论学姿态。",
    13,
    "校对补入，只收论学成句；不收现代道统/党国政治语境。",
  ),
  q(
    "003.",
    21,
    "孔子之外，古今百家，随其浅深，无得免者",
    "古人评语",
    "陈振孙评叶适语",
    "李敖转引陈振孙评叶适议论广泛、诸家难免被其批评。",
    21,
    "校对补入，只收古人评语本体；不收叶适政治立场和道统政治化语境。",
  ),
  q(
    "006.",
    15,
    "百事要看得浑些。",
    "劝慰格言",
    "陈训慈、陈训愿劝慰语",
    "李敖转述陈布雷兄弟以此劝他凡事看得宽些、浑些。",
    15,
    "校对补入，只收私人劝慰格言；不收陈布雷、南京政府和自杀政治语境。",
  ),
  q(
    "012.",
    25,
    "沛公至军，立诛杀曹无伤",
    "史记训诂例句",
    "《史记·项羽本纪》",
    "李敖引鸿门宴后刘邦杀曹无伤的句子，用作“诛”字训诂例证。",
    25,
    "校对补入，只收《史记》例句；不收“乱臣贼子，人人得而诛之”、江南案、暗杀与法庭政治语境。",
  ),
  q(
    "012.",
    25,
    "其君无日不讨国人而训之。",
    "左传训诂例句",
    "《左传·宣公十二年》",
    "李敖引《左传》“讨”字例句，说明“诛”有讨责之义。",
    25,
    "校对补入，只收训诂例句；不收江南案和暗杀辩护语境。",
  ),
  q(
    "012.",
    25,
    "以敝邑褊小，介于大国，诛求无时。",
    "左传训诂例句",
    "《左传·襄公三十一年》",
    "李敖引《左传》句和注解，说明“诛”有责求之义。",
    25,
    "校对补入，只收训诂例句；不收江南案和暗杀辩护语境。",
  ),
  q(
    "016.",
    279,
    "虚膺其名，滥竽遗讥",
    "文言成句",
    "端木恺信札成句",
    "李敖转引端木恺以此表示徒居名位、招致滥竽之讥。",
    279,
    "校对补入，只收信札成句；不收《文星》诉讼、公司改组和查禁政治语境。",
  ),
  q(
    "016.",
    285,
    "直谅多闻之友",
    "论语化用成句",
    "《论语·季氏》语义",
    "萧同兹信中化用《论语》“友直、友谅、友多闻”的成句。",
    285,
    "校对补入，只收论语化用成句；不收《文星》公司纠纷与言论环境语境。",
  ),
  q(
    "020.",
    15,
    "念书太多，我们不可及",
    "读书评语",
    "居浩然评李敖语",
    "童轩荪转述居浩然称赞李敖读书太多、旁人难及。",
    15,
    "校对补入，只收读书评语；不收信中关于政治营区和历史考证的材料。",
  ),
  q(
    "020.",
    123,
    "冠盖云集，备极哀荣",
    "哀荣成句",
    "中文成语化成句",
    "李敖转引葬礼报道句，写达官名流聚集、哀荣隆重。",
    123,
    "校对补入，只收哀荣成句；不收国府政要和白色恐怖家属处境语境。",
  ),
  q(
    "020.",
    139,
    "陈蕃之榻",
    "古人典故",
    "陈蕃下榻典故",
    "童轩荪用陈蕃下榻典故，说明此后不再接待宾客。",
    139,
    "校对补入，只收典故本体；不收台湾故旧往来与政治受难语境。",
  ),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
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
  "警备总部",
  "情报局",
  "调查局",
  "军法",
  "特务",
  "匪谍",
  "反共",
  "通匪",
  "叛乱",
  "革命",
  "三民主义",
  "主义",
  "战争",
  "抗战",
  "抗日",
  "北伐",
  "反攻",
  "大陆",
  "台湾",
  "日本",
  "美国",
  "苏联",
  "俄国",
  "杀人",
  "暗杀",
  "俘",
  "战犯",
  "法治国家",
  "言论自由",
  "人权",
  "国家安全",
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

const auditRows = selectedRows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

function selectedVersion(row) {
  const key = [row.source_file, row.line_start, normalizeText(row.quote_text)].join("\u0001");
  return (
    selectedRows.find(
      (selectedRow) =>
        [selectedRow.source_file, selectedRow.line_start, normalizeText(selectedRow.quote_text)].join("\u0001") === key,
    ) || row
  );
}

const proofreadAuditRows = [
  ...proofreadRemovedRows.map((row) => ({
    action: "remove",
    reason: "校对删除",
    row,
    present: quotePresent(row),
    politicalHits: hasPoliticalHit(row),
  })),
  ...proofreadAdditions.map((row) => ({
    action: "add",
    reason: "校对补入",
    row: selectedVersion(row),
    present: quotePresent(row),
    politicalHits: hasPoliticalHit(row),
  })),
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
fs.writeFileSync(proofreadReviewTsv, fs.readFileSync(reviewTsv, "utf8"), "utf8");

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
        item.row.id || "(unassigned)",
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
  "policy: this book is dominated by modern political history, Chiang Kai-shek polemics, Sun Yat-sen and Chiang Kai-shek source disputes, doctrinal lineage propaganda, capital relocation, Chen Bulei, the Henry Liu case, Wu Zhihui, Wu Kuo-chen, Wenh Hsing censorship, intelligence files, court and party-state documents; exclude direct party, regime, leader, military, war, revolution, national identity, assassination, intelligence, censorship, free-speech, legal, court, party-state document, and ideological quotations, while keeping independently reusable classical poetry/prose, proverbs, idioms, literary maxims, and non-political set phrases.",
  "",
  "selectedHighlights:",
  "- 003: 收《孟子》、韩愈《原道》、朱熹《中庸章句序》、叶适论学句与《礼记·礼运》古典文本本体；校对补入“觝排异端，攘斥佛老”和陈振孙评叶适句；孙中山/蒋介石道统宣传、革命思想和领袖继承话语不收。",
  "- 004/005: 收“宾至如归”、傅斯年“不求安乐者……”和“青山绕郭，长江如带”；来华助战洋人、迁都、首都、还都与现代政治判断不收。",
  "- 006: 收《离骚》句、宝志禅师传说、宋人题灵谷寺诗和“百事要看得浑些。”；陈布雷、中华民国亡国论证与李敖翻作政治讽刺诗不收。",
  "- 012: 校对补入《史记》《左传》训诂例句；“乱臣贼子，人人得而诛之”、江南案、暗杀辩词与法庭政治语境不收。",
  "- 013/016: 收吴稚晖遗嘱警句、李商隐《碧城诗》、梭罗读书格言、“儿大爷难做”、两条李敖成句；校对补入“虚膺其名，滥竽遗讥”和“直谅多闻之友”；《文星》查禁、党纪、情治与言论自由政治材料不收。",
  "- 020: 收童轩荪去国题意、旧式容量颂语、童轩荪诗句和李商隐《隋宫》句；校对补入居浩然读书评语、“冠盖云集，备极哀荣”和“陈蕃之榻”；政治犯、特务笑话、白色恐怖与国民党批判语境不收。",
  "",
  "excludedHighlights:",
  "- 自序/001/002: 法院判决、出版查禁、孙中山暗杀陶成章、剜心肝/挖眼睛等材料直接贴着现代政治、暗杀、革命与暴力语境；“恶莠不除，则嘉禾不长”“二桃杀三士”“斩草除根，擒贼擒王”等首轮不收。",
  "- 003: 康熙“道统即治统”、孙中山革命思想基础、三民主义、国父年谱、蒋中正讲话、胡适查证信中关于政治思想的现代材料不收，只留古典文本本体。",
  "- 005/008/009/010/011/012: 首都、迁都、中日和约、报告狂、查房间、江南案与法律文件为现代政治史料；“乱臣贼子，人人得而诛之”“不自由，毋宁死”等政治性强的名句不收，仅补入不带现代政治判断的古书训诂例句。",
  "- 013/014/015/016: 吴稚晖、吴家/蒋家、吴国桢、《文星》相关党派、政权、查禁、特务、法庭、国安与言论自由语录不收；“天下兴亡，匹夫有责”“汉贼不两立，王业不偏安”“天下乌鸦一般黑”等政治语境过强不收。",
  "- 020/021/022: 童轩荪受难、马克思恐惧症、政治笑话、白色恐怖、两个太阳与水晶寿星等现代政治讽刺不收；“你别翻供了——肖邦已经招了！”“天无二日，民无二王”等不收。",
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
