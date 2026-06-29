const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = path.resolve(__dirname, "..");
const BOOK = "李敖智慧书";
const ID_PREFIX = "LAWIS";
const SOURCE_DIR = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "016.李敖祸台五十年庆祝十书",
  "003.李敖智慧书"
);

const OUTPUT_CSV = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.csv`);
const OUTPUT_TXT = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.txt`);
const ANALYSIS_JSON = path.join(ROOT, "analysis", "liao_wisdom_book_selected_rows.json");
const REPORT_JSON = path.join(ROOT, "analysis", "liao_wisdom_book_proofread_build_report.json");
const REJECTS_JSON = path.join(ROOT, "analysis", "liao_wisdom_book_proofread_rejects.json");

const decoder = new TextDecoder("gb18030");

function readText(filePath) {
  return decoder.decode(fs.readFileSync(filePath));
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function normalize(value) {
  return String(value ?? "")
    .replace(/\s+/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/……/g, "...")
    .trim();
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_DIR)
    .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

const fileNames = sourceFiles();
const fileBySelector = new Map();
for (const name of fileNames) {
  if (name.includes("题辞")) {
    fileBySelector.set("preface", name);
  }
  const match = name.match(/^(\d{3})\./);
  if (match) {
    fileBySelector.set(match[1], name);
  }
}

function q(selector, lineStart, quoteText, sourceOrOrigin, category, note, lineEnd = lineStart) {
  const fileName = fileBySelector.get(selector);
  if (!fileName) {
    throw new Error(`Cannot find source file for selector ${selector}`);
  }
  return {
    selector,
    fileName,
    chapter: fileName.replace(/\.txt$/i, ""),
    lineStart,
    lineEnd,
    quoteText,
    sourceOrOrigin,
    category,
    note,
  };
}

const rawRows = [
  q("preface", 3, "生公说法鬼神听", "佛教典故", "诗文典故", "题辞借佛门说法典故谈智慧，语句可独立成典。"),
  q("preface", 3, "满街皆圣人", "王阳明", "格言", "题辞引王阳明语，保留其普遍性智慧意味。"),
  q("preface", 3, "鸡飞蛋打", "俗语", "俗语", "题辞中的俗语，用来写智慧不足的后果。"),
  q("001", 3, "三月换一把，爱情如牙刷", "李敖化用", "格言", "爱情比喻独立完整，未涉政治判断。"),

  q("002", 3, "说大人，则藐之。勿视其巍巍然。……吾何畏彼哉!", "《孟子》", "古文", "孟子语，虽被用于公共人物讨论，但原句可独立成古典格言。"),
  q("002", 5, "年十三，杀人，人不敢忤视。", "《史记》荆轲典故", "古文", "秦舞阳故事中的史传句。"),
  q("002", 5, "色变振恐", "《史记》荆轲典故", "成语", "史传语汇，可独立检索。"),
  q("002", 5, "不敢忤视", "《史记》荆轲典故", "成语", "史传语汇，可独立检索。"),
  q("002", 15, "仁义道德", "成语", "成语", "从反讽段落中保留成语本身。"),
  q("002", 15, "男盗女娼", "成语", "成语", "从反讽段落中保留成语本身。"),
  q("002", 15, "弃甲曳兵", "《孟子》", "成语", "孟子语源成语。"),
  q("002", 15, "不苟言笑", "成语", "成语", "独立性强的性情描写成语。"),
  q("002", 15, "忍俊不禁", "成语", "成语", "独立性强的情态成语。"),
  q("002", 15, "高高在上", "成语", "成语", "独立性强的姿态成语。"),

  q("004", 5, "无心雕作木居士，便有无穷求福人。", "古诗", "诗句", "木居士诗句，保留其讽喻性。"),
  q("004", 7, "朝三暮四", "《庄子》寓言", "成语", "庄子猴子寓言成语。"),
  q("004", 7, "朝三暮四或暮三朝四，实质未变", "李敖概括《庄子》寓言", "格言", "对庄子寓言的格言化概括。"),

  q("005", 7, "依违其间", "伊索寓言", "成语", "蝙蝠寓言的立场摇摆语汇。"),
  q("005", 7, "不容毛群，斥逐羽族", "伊索寓言", "格言", "蝙蝠寓言中的两边不容。"),
  q("005", 7, "不容兽群，斥逐哺乳类之族", "伊索寓言", "格言", "蝙蝠寓言中的两边不容。"),
  q("005", 13, "青出于蓝", "成语", "成语", "独立成语。"),
  q("005", 13, "后来居上", "成语", "成语", "独立成语。"),
  q("005", 17, "勃然变色", "成语", "成语", "独立成语。"),
  q("005", 25, "见者主有喜庆", "古籍动物占验", "古文", "古籍中关于凤的占验语。"),
  q("005", 25, "啮人不可疗", "古籍动物占验", "古文", "古籍中关于蝙蝠的占验语。"),
  q("005", 25, "江河日下", "成语", "成语", "独立成语。"),
  q("005", 25, "呜呼哀哉", "成语", "成语", "独立成语。"),

  q("007", 3, "可怜南面称孤贵，才作仙家守厕人", "古诗", "诗句", "关于厕神的诗句，脱离原章政治段落仍可独立。"),

  q("009", 17, "一篮烂苹果，没有什么好挑的", "莎士比亚", "格言", "以苹果作喻的文学性判断，未保留其选举语境。"),

  q("018", 21, "我很抱歉。不过我们的报说你死了，那你就死了。", "外国轶事", "格言", "报纸权威轶事中的荒诞讽刺。"),
  q("018", 21, "当我开的是肺炎药，包你死于肺炎。", "外国轶事", "格言", "医生权威轶事中的荒诞讽刺。"),

  q("031", 11, "人类第一个大施主——亚当有深恩于吾人：他将死亡带到世界上。", "马克·吐温", "格言", "马克·吐温死亡讽刺。"),
  q("031", 11, "We owe a deep debt of gratitude to Adam, the first great benefactor of the human race: he brought death into the world.", "Mark Twain", "格言", "马克·吐温原文。"),
  q("031", 15, "把你所有的蛋放进一个篮子里，然后——盯着这个篮子。", "马克·吐温", "格言", "马克·吐温风险与专注格言。"),
  q("031", 15, "Put all your eggs in one basket and-watch the basket.", "Mark Twain", "格言", "马克·吐温原文，按源文保留连字符形式。"),
  q("031", 19, "人是唯一知道——或需要——害臊的动物。", "马克·吐温", "格言", "马克·吐温人性讽刺。"),
  q("031", 19, "Man is the only animal that blushes-or needs to.", "Mark Twain", "格言", "马克·吐温原文。"),
  q("031", 23, "我们的‘天父’造人，因为他对猴子已经失望。", "马克·吐温", "格言", "马克·吐温宗教与人性讽刺。"),
  q("031", 23, "Our Heavenly Father invented man because he was disappointed in the monkey.", "Mark Twain", "格言", "马克·吐温原文。"),
  q("031", 27, "多谢愚蠢之徒；若非拜他们之赐，吾人岂有成功之日！", "马克·吐温", "格言", "马克·吐温关于愚人和成功的讽刺。"),
  q("031", 27, "Let us be thankful for the fools; but for them the rest of us could not succeed.", "Mark Twain", "格言", "马克·吐温原文。"),
  q("031", 31, "到了听说别人模仿他时，人才知道自己有多笨。", "马克·吐温", "格言", "马克·吐温自知讽刺。"),
  q("031", 31, "A man never knows what a fool he is until he hears himself imitated by one.", "Mark Twain", "格言", "马克·吐温原文。"),
  q("031", 35, "猫与谎话的显明差别之一，就是：猫只有九条命。", "马克·吐温", "格言", "马克·吐温关于谎言的讽刺。"),
  q("031", 35, "One of he striking differences between a cat and a lie is that a cat has only nine lives.", "Mark Twain", "格言", "马克·吐温原文，保留源文拼写。"),
  q("031", 39, "4月1日是提醒我们其余三百六十四天我们在干什么的日子。", "马克·吐温", "格言", "马克·吐温愚人节讽刺。"),
  q("031", 39, "April 1 is the day upon which we are reminded of what we are on the other 364.", "Mark Twain", "格言", "马克·吐温原文。"),
  q("031", 47, "先把事实弄清楚；然后，愿意怎样扭曲，你就怎样扭曲。", "马克·吐温", "格言", "马克·吐温事实与歪曲讽刺。"),
  q("031", 47, "Get your facts first, and then you can distort them as much as you please.", "Mark Twain", "格言", "马克·吐温原文。"),
  q("031", 51, "银行家就是这样的家伙：晴天时把伞借给你；下雨时又要回去。", "马克·吐温", "格言", "马克·吐温银行家讽刺。"),
  q("031", 51, "A banker is a fellow who lends you his umbrella when the sun is shining and wants it back the minute it begins to rain.", "Mark Twain", "格言", "马克·吐温原文。"),
  q("031", 53, "也无风雨也无晴", "苏轼《定风波》", "诗句", "借苏轼词句写银行家态度，诗句本身可独立检索。"),
  q("031", 55, "生气时数四；非常生气时发誓。", "马克·吐温", "格言", "马克·吐温情绪格言。"),
  q("031", 55, "When angry, count rout; when very angry, swear.", "Mark Twain", "格言", "马克·吐温原文，按源文保留拼写。"),

  q("032", 5, "不敬先生，天诛地灭", "俗语", "俗语", "关于先生权威的俗语，未保留原章教育政治论述。"),
  q("032", 15, "焚琴煮鹤", "成语", "成语", "独立成语。"),

  q("034", 5, "尽信报不如无报", "李敖化用《孟子》", "格言", "从“尽信书不如无书”化出的新闻判断。"),
  q("034", 13, "不能粑粪，报章之耻", "李敖", "格言", "新闻职业格言，未取其政治背景。"),
  q("035", 7, "追新闻屁", "李敖", "俗语", "李敖对新闻跟风的俗化说法。"),
  q("035", 7, "追踪黑屁", "李敖", "俗语", "李敖对新闻跟风的俗化说法。"),
  q("035", 11, "明日黄花", "成语", "成语", "独立成语。"),
  q("035", 11, "柏金森定律", "帕金森定律", "格言", "源文作“柏金森定律”，保留其定律名。"),
  q("035", 13, "因新闻就导", "李敖化用", "格言", "化用“因势利导”的新闻语汇。"),
  q("035", 15, "多揭发黑暗，少追踪黑屁。", "李敖", "格言", "新闻判断格言，文本本身不含政党或政论口号。"),

  q("042", 3, "杠上开花", "俗语", "俗语", "麻将俗语。"),
  q("042", 5, "郭良惠啊！这件事有两个错误：第一个错误是他们不该开除你；第二个错误是你不该加入。", "梁实秋", "格言", "梁实秋对加入与开除的双重讽刺。"),

  q("044", 11, "王门立雨", "典故", "成语", "师门求教典故。"),
  q("044", 11, "孺子可教", "成语", "成语", "独立成语。"),
  q("044", 15, "当仁不让", "《论语》", "成语", "论语语源成语。"),
  q("044", 15, "声色俱厉", "成语", "成语", "独立成语。"),
  q("044", 19, "乡愿", "《论语》", "典故", "儒家人格批评语。"),
  q("044", 19, "见义无勇", "成语", "成语", "独立成语。"),
  q("044", 19, "忘恩负义", "成语", "成语", "独立成语。"),
  q("044", 19, "知过能改", "成语", "成语", "独立成语。"),
  q("044", 43, "见贤而不用", "古典化语汇", "格言", "关于识人用人的短句。"),
  q("044", 51, "众口铄金", "成语", "成语", "独立成语。"),
  q("044", 51, "人言籍籍", "成语", "成语", "独立成语。"),
  q("044", 79, "不学有术", "李敖化用", "格言", "反讽“不学无术”的说法。"),
  q("044", 79, "希旨承风", "成语", "成语", "独立成语。"),
  q("044", 79, "去之而后快", "成语", "成语", "独立成语。"),
  q("044", 97, "天外有天", "俗语", "俗语", "独立俗语。"),
  q("044", 123, "饮水思源", "成语", "成语", "独立成语。"),
  q("044", 175, "石沉大海", "成语", "成语", "独立成语。"),
  q("044", 175, "若无其事", "成语", "成语", "独立成语。"),
  q("044", 177, "言笑晏晏", "《诗经》", "成语", "诗经典故语。"),
  q("044", 177, "公事公办", "俗语", "俗语", "独立俗语。"),
  q("044", 189, "愈辩愈明", "俗语", "俗语", "辩论越清楚的俗语。"),
  q("044", 189, "为长者折枝", "《孟子》", "典故", "孟子典故。"),
  q("044", 203, "人情世故", "成语", "成语", "独立成语。"),
  q("044", 203, "坦白待人", "俗语", "俗语", "做人处世短语。"),
  q("044", 203, "有话直说", "俗语", "俗语", "做人处世短语。"),
  q("044", 203, "有脾气就发", "俗语", "俗语", "做人处世短语。"),
  q("044", 203, "严师之下", "俗语", "俗语", "师生关系短语。"),
  q("044", 207, "不智、不仁、不勇", "儒家化评语", "格言", "以智仁勇三德作判断的短语。"),
  q("044", 209, "春风化雨之学", "成语化语汇", "格言", "教育感化语汇。"),
  q("044", 209, "美中不足", "成语", "成语", "独立成语。"),
  q("044", 209, "大丈夫", "古典语汇", "典故", "古典人格称谓。"),
  q("044", 209, "藏头缩尾", "成语", "成语", "独立成语。"),
  q("044", 221, "外行人说内行话", "俗语", "俗语", "关于专业边界的俗语。"),
  q("044", 221, "信口开河", "成语", "成语", "独立成语。"),
  q("044", 235, "狼狈为奸", "成语", "成语", "独立成语。"),
  q("044", 237, "一面之说", "俗语", "俗语", "关于偏听的短语。"),
  q("044", 237, "感情用事", "成语", "成语", "独立成语。"),
  q("044", 241, "强词夺理", "成语", "成语", "独立成语。"),
  q("044", 267, "此地不留爷，自有留爷处", "俗语", "俗语", "民间俗语，脱离学术争论语境仍可独立。"),
  q("044", 267, "内举不避", "古典语汇", "格言", "化用古典用人语。"),
  q("044", 267, "雪中送炭", "成语", "成语", "独立成语。"),
  q("044", 267, "用心如日月", "古典化语汇", "格言", "关于用心昭然的短句。"),
  q("044", 267, "野有遗贤", "古典语汇", "典故", "古典人才典故语。"),
  q("044", 267, "大义灭师", "李敖化用", "格言", "化用“大义灭亲”的师门说法。"),
  q("044", 267, "哭笑不得", "成语", "成语", "独立成语。"),
  q("044", 269, "低级行径", "俗语", "俗语", "行为评语短语。"),
  q("044", 269, "套招", "俗语", "俗语", "李敖所用俗化说法。"),
  q("044", 271, "大彻大悟", "成语", "成语", "独立成语。"),
  q("044", 271, "大庭广众", "成语", "成语", "独立成语。"),
  q("044", 283, "做贼心虚", "成语", "成语", "独立成语。"),
  q("044", 305, "占着茅坑不拉屎", "俗语", "俗语", "民间俗语。"),
  q("044", 305, "水肥不落外人田", "俗语", "俗语", "民间俗语。"),
  q("044", 305, "志士仁人", "成语", "成语", "独立成语。"),
  q("044", 305, "君子之爱人也，以德；细人之爱人也，以姑息", "古典语录", "古文", "关于爱人与姑息的古典格言。"),
  q("044", 305, "姑息护短", "成语", "成语", "独立成语。"),
  q("044", 305, "爱之适足以害之", "古典化格言", "格言", "关于姑息之爱的短句。"),
];

const proofreadRejectQuoteTexts = new Set([
  "仁义道德",
  "男盗女娼",
  "弃甲曳兵",
  "不苟言笑",
  "忍俊不禁",
  "高高在上",
  "青出于蓝",
  "后来居上",
  "勃然变色",
  "江河日下",
  "呜呼哀哉",
  "一篮烂苹果，没有什么好挑的",
  "杠上开花",
]);

const missingRejects = [...proofreadRejectQuoteTexts].filter(
  (quoteText) => !rawRows.some((row) => row.quoteText === quoteText)
);
if (missingRejects.length) {
  throw new Error(`Proofread rejects not found in raw rows: ${missingRejects.join(" | ")}`);
}

const proofreadRejectedRows = rawRows.filter((row) =>
  proofreadRejectQuoteTexts.has(row.quoteText)
);
const rowsAfterProofread = rawRows.filter(
  (row) => !proofreadRejectQuoteTexts.has(row.quoteText)
);

const seen = new Set();
const selected = rowsAfterProofread.map((row, index) => {
  const key = normalize(row.quoteText);
  if (seen.has(key)) {
    throw new Error(`Duplicate quote: ${row.quoteText}`);
  }
  seen.add(key);

  const filePath = path.join(SOURCE_DIR, row.fileName);
  const text = readText(filePath);
  if (!normalize(text).includes(key)) {
    throw new Error(`Quote not found in ${row.fileName}: ${row.quoteText}`);
  }

  return {
    id: `${ID_PREFIX}-${String(index + 1).padStart(3, "0")}`,
    book: BOOK,
    chapter: row.chapter,
    source_file: path.relative(ROOT, filePath).replace(/\\/g, "/"),
    line_start: row.lineStart,
    line_end: row.lineEnd,
    quote_text: row.quoteText,
    category: row.category,
    source_or_origin: row.sourceOrOrigin,
    summary: row.note,
    notes: "",
  };
});

const politicalPattern =
  /(国家|中国|台湾|中华|台独|统一|独立|民主|自由|政府|政权|政治|政党|国民党|民进党|共产党|共匪|选举|候选|总统|宪法|革命|主义|意识形态|权力使人腐化|Power tends to corrupt)/i;
const politicalHits = selected.filter((row) => politicalPattern.test(row.quote_text));
if (politicalHits.length) {
  throw new Error(
    `Political keyword hits in quote_text:\n${politicalHits
      .map((row) => `${row.id}\t${row.quote_text}`)
      .join("\n")}`
  );
}

fs.mkdirSync(path.dirname(OUTPUT_CSV), { recursive: true });
fs.mkdirSync(path.dirname(ANALYSIS_JSON), { recursive: true });

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

const csv = [columns.join(",")]
  .concat(selected.map((row) => columns.map((column) => csvEscape(row[column])).join(",")))
  .join("\n");
fs.writeFileSync(OUTPUT_CSV, `${csv}\n`, "utf8");

const txt = selected
  .map((row) => {
    return [
      `${row.id}｜${row.quote_text}`,
      `出处：${row.source_or_origin}；类别：${row.category}`,
      `位置：${row.book} / ${row.chapter} / ${row.line_start}-${row.line_end}`,
      `说明：${row.summary}`,
    ].join("\n");
  })
  .join("\n\n");
fs.writeFileSync(OUTPUT_TXT, `${txt}\n`, "utf8");

fs.writeFileSync(ANALYSIS_JSON, JSON.stringify(selected, null, 2), "utf8");
fs.writeFileSync(REJECTS_JSON, JSON.stringify(proofreadRejectedRows, null, 2), "utf8");

const report = {
  book: BOOK,
  sourceDir: SOURCE_DIR,
  sourceFileCount: fileNames.length,
  rawRows: rawRows.length,
  removedInProofread: proofreadRejectedRows.length,
  rows: selected.length,
  firstId: selected[0]?.id,
  lastId: selected[selected.length - 1]?.id,
  politicalQuoteTextHits: politicalHits.length,
  outputs: {
    csv: path.relative(ROOT, OUTPUT_CSV).replace(/\\/g, "/"),
    txt: path.relative(ROOT, OUTPUT_TXT).replace(/\\/g, "/"),
    json: path.relative(ROOT, ANALYSIS_JSON).replace(/\\/g, "/"),
    rejects: path.relative(ROOT, REJECTS_JSON).replace(/\\/g, "/"),
  },
};

fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), "utf8");

console.log(`book: ${BOOK}`);
console.log(`sourceFiles: ${fileNames.length}`);
console.log(`rawRows: ${rawRows.length}`);
console.log(`removedInProofread: ${proofreadRejectedRows.length}`);
console.log(`rows: ${selected.length}`);
console.log(`firstId: ${report.firstId}`);
console.log(`lastId: ${report.lastId}`);
console.log(`politicalQuoteTextHits: ${politicalHits.length}`);
console.log(`csv: ${report.outputs.csv}`);
console.log(`txt: ${report.outputs.txt}`);
