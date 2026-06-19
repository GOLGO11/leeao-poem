const fs = require("fs");
const path = require("path");

const book = "求是新语";
const idPrefix = "LAQSXY";
const outDir = "exports";

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function row(chapter, file, lineStart, lineEnd, quoteText, category, sourceOrigin, usageSummary, notes = "") {
  return {
    id: "",
    book,
    chapter,
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrigin,
    summary: usageSummary,
    notes,
  };
}

const data = [
  row("台湾哪有大事！", "003.台湾哪有大事！.txt", 5, 5, "新意见常被怀疑且时遭反对者，无他焉，只因其不落俗套耳。", "西方哲人名言", "洛克（John Locke）语，文中附英文原文。", "李敖用洛克关于新意见常被怀疑的名言，为自己以小事论大义、发表不落俗套的新意见辩护。"),
  row("“伽冠哥戴”", "010.“伽冠哥戴”.txt", 9, 9, "但它（地球）还在动啊！", "外国科学家名言", "文中称为伽利略悔罪签字后的传说名言，附 E pur si muove。", "李敖用这句校正报纸把哥白尼与伽利略混淆的错误。"),
  row("“何其声之似我也！”", "027.“何其声之似我也！”.txt", 5, 5, "此非吾君也，何其声之似我也！", "古话成句", "文中称“古话说”。", "李敖借这句古话讽刺反国民党者反而复述国民党旧日宪制思路。"),
  row("不足为训的弃投", "036.不足为训的弃投.txt", 3, 3, "跳出油锅又入火坑", "英语谚语中译", "Out of the frying-pan into the fire 的中文译语。", "李敖用这句说明为私利弃此投彼，可能只是脱小难而陷大难。"),
  row("“跖非诛盗之人”", "037.“跖非诛盗之人”.txt", 3, 3, "以盗首弭盗", "古话成句", "文中称为古话，与“以贼捉贼”并列。", "李敖以此引出用贼抓贼的逻辑，再转入对清流评鉴的讽刺。"),
  row("“跖非诛盗之人”", "037.“跖非诛盗之人”.txt", 3, 3, "以贼捉贼", "俗语成句", "流行说法，文中并列英谚 Set a thief to catch a thief。", "李敖用这句解释为什么当政者会用同类人去清查同类人。"),
  row("“跖非诛盗之人”", "037.“跖非诛盗之人”.txt", 3, 3, "Set a thief to catch a thief", "英语谚语", "英谚，意思为以贼捉贼。", "李敖以英谚补充中文成句，说明用贼抓贼的通俗逻辑。"),
  row("“跖非诛盗之人”", "037.“跖非诛盗之人”.txt", 5, 5, "盗固不义，而跖非诛盗之人。", "古语典故", "盗跖典故化语，用来说明盗虽不义，盗跖也不是讨盗的人。", "李敖用这句指出同类货色没有资格以清算者姿态审判同类。"),
  row("“跖非诛盗之人”", "037.“跖非诛盗之人”.txt", 5, 5, "盗亦有道", "传统成语", "《庄子》盗跖相关成语。", "李敖在“跖非诛盗”的语境中再引此成语，说明一流货之间也有同类规范。"),
  row("冷眼看选热", "039.冷眼看选热.txt", 5, 5, "温、良、恭、俭、让", "论语成句", "《论语》所称孔子德性。", "李敖借这组儒家德目反衬选举热中朝野互揭内幕、全无斯文。"),
  row("说小人，则藐之", "043.说小人，则藐之.txt", 3, 3, "说大人，则藐之，勿视其巍巍然。", "孟子名句", "《孟子》句。", "李敖引用孟子轻视权贵的气概，转而讽刺台湾政治人物的小格局。"),
  row("土城事件内幕", "048.土城事件内幕.txt", 9, 9, "每人都抱怨自己记忆力不好，却从不抱怨自己判断力太差。", "洋人谚语", "文中附英文 Everyone complains of his memory, and no one complains of his judgment.", "李敖用这句说明选民判断力差，往往与政治记忆太短有关。"),
  row("不认老大而性好从政", "049.不认老大而性好从政.txt", 3, 3, "盗亦有道", "传统成语", "《庄子》盗跖相关成语。", "李敖把这句转用于台湾流氓生态，讽刺连老大都不认的“盗亦无道”。"),
  row("赞成人道与接近人道", "073.赞成人道与接近人道.txt", 5, 5, "五世其昌", "传统吉语", "传统祝颂子孙昌盛的成语。", "李敖用这句反衬资本主义虽丑恶却有生育与延续的能力，并谐作“五世其娼”。"),
  row("赞成人道与接近人道", "073.赞成人道与接近人道.txt", 5, 5, "仓廪实而知礼义", "古代经济格言", "《管子》相关名句，亦为常见古典成句。", "李敖借此说明现实繁荣之后才有礼义可能，反衬空洞理想离人道太远。"),
  row("蒋纬国的肉麻无耻", "097.蒋纬国的肉麻无耻.txt", 9, 9, "攻略高卢的，不是罗马的军队，而是凯撒；震惊罗马的，不是卡尔泰的士兵，而是汉尼拔；侵入印度的，不是马其顿的军队，而是亚历山大；七年战争，保卫普鲁士的，不是普鲁士的军队，而是腓特烈大帝。", "拿破仑名言", "文中称为拿破仑关于统帅作用的名言。", "李敖引用蒋纬国书中转述的拿破仑名言，反讽其借外国名言替蒋介石拍马屁。"),
  row("呜呼蒋经国死得好", "108.呜呼蒋经国死得好.txt", 3, 3, "死得好，死得好！", "小说名句", "《儒林外史》中王三姑娘父亲语。", "李敖用《儒林外史》中的突兀赞叹，引出“死得恰如其时”的反讽结构。"),
  row("呜呼蒋经国死得好", "108.呜呼蒋经国死得好.txt", 9, 9, "呜呼！世道衰、人伦坏，而亲疏之理反其常，干戈起于骨肉，异类合为父子。……盖其大者取天下，其次立功名、位将相，岂非因时之隙，以利合而相资者邪？唐……往往养以为儿，号‘义儿军’，至其有天下，多用以成功业，及其亡也亦由焉。", "古文名段", "欧阳修《新五代史》卷三十六《义儿传》。", "李敖引用欧阳修论义儿的长段，借古文结构讽刺现代政治继承关系。"),
  row("何必学独裁国家的党员训练班模式？", "110.何必学独裁国家的党员训练班模式？.txt", 3, 3, "此非吾君也，何其声之似我也", "古话成句", "文中称“古话说”。", "李敖再次用这句古话，讽刺民进党的组织设计反倒像国民党旧路。"),
  row("成舍我“我独乌龟”趣闻", "117.成舍我“我独乌龟”趣闻.txt", 3, 3, "人皆玳瑁，我独乌龟，何也？", "现代文人趣语", "成舍我电报趣语。", "李敖转述成舍我为节省电报费写出的十字妙问，作为文字趣闻。"),
  row("“只是想吃一顿”、“只是想搞一下”、“只是想干一次”", "122.“只是想吃一顿”、“只是想搞一下”、“只是想干一次”.txt", 3, 3, "襄阳罗友，少时多谓之痴。尝伺人祠，欲乞食，往太蚤，门未开。主人迎神出见，问以非时何得在此，答曰：‘闻卿祠，欲乞一顿食耳！’遂隐门侧，至晓得食，乃退。", "古书故事", "李卓吾《初潭集》所记罗友故事。", "李敖引用这则故事，欣赏其直白地只想吃一顿的洒脱，进而转化为写文章的快意。"),
  row("台湾的毛笔", "127.台湾的毛笔.txt", 3, 3, "千载纷争共一毛", "宋诗名句", "王安石诗句。", "李敖借王安石诗句玩“毛笔字”的文字关节，讽刺台湾书法界不足以争。"),
  row("评王天竞、王滔夫服务处遭骚扰事件", "128.评王天竞、王滔夫服务处遭骚扰事件.txt", 9, 9, "我打你，不许你还手；骂你，不许你还口；杀你，不许你流血。", "戏曲俗语", "文中称为京戏里所说。", "李敖用这句概括单面道德：自己可以施暴，却不许别人反抗。"),
  row("朱士烈多恶心人呀！", "129.朱士烈多恶心人呀！.txt", 9, 9, "蝉曳残声到别枝", "古诗名句", "旧诗成句，写蝉声余响转到别枝。", "李敖用它讽刺朱士烈自称不恋栈却又转任新职。"),
  row("布什私见达赖，伪君子又添一章", "139.布什私见达赖，伪君子又添一章.txt", 9, 9, "欲盖弥彰", "传统成语", "比喻想掩盖反而更加暴露的成语。", "李敖用它概括布什私下接待达赖而又避公开日程的矛盾。"),
  row("线民火烧刑事局", "148.线民火烧刑事局.txt", 7, 7, "千万别同警察交朋友，因为你不晓得他什么时候‘公事公办’。", "外国谚语", "文中称为美国黑社会谚语。", "李敖用这句说明警察关系随时可能翻脸，回应线民火烧刑事局事件。"),
  row("关中的科学", "172.关中的科学.txt", 5, 5, "天马行空", "传统成语", "比喻思想或行动不着实际的成语。", "李敖用它反衬国民党统一宣传空泛，不如“一国两制”具体。"),
  row("关中上了当", "187.关中上了当.txt", 9, 9, "借尸还魂", "传统成语", "借死人躯壳使魂魄复活的成语。", "李敖用它概括民主基金会借孙中山《建国大纲》思路再造党八股。"),
  row("胡言中的真话", "008.胡言中的真话.txt", 3, 3, "盗亦有道", "庄子成语", "《庄子·胠箧》成句。", "李敖用它概括国民党对大陆与台湾的取舍：虽是掠夺逻辑，却仍有其内部秩序。", "校对补入。"),
  row("不足为训的弃投", "036.不足为训的弃投.txt", 3, 3, "弃暗投明", "传统成语", "比喻离开黑暗错误一方、投向光明正确一方的成语。", "李敖把它放进引号，反讽为私利投向另一政党的理由并不足训。", "校对补入。"),
  row("刘宾雁见不到李敖", "082.刘宾雁见不到李敖.txt", 9, 9, "才如江海命如丝", "诗句", "诗句，出处待考。", "李敖在回赠刘宾雁的诗中嵌用此句，赞其文章才情而慨叹命运纤危。", "校对补入；仅收嵌用诗句，不收李敖全首自作诗。"),
  row("“中社”的嘴脸", "111.“中社”的嘴脸.txt", 5, 5, "知识的力量", "西方格言", "近代西方格言，常归于培根“Knowledge is power”。", "李敖借这句反讽中社知识分子低估并浪费知识本身的力量。", "校对补入。"),
];

data.forEach((item, index) => {
  item.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

fs.mkdirSync(outDir, { recursive: true });

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

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const csvRows = [
  columns.join(","),
  ...data.map((item) => columns.map((column) => csvEscape(item[column])).join(",")),
];
fs.writeFileSync(csvPath, `\uFEFF${csvRows.join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`总计：${data.length} 条`);
txt.push("");

for (const item of data) {
  const location =
    item.line_start === item.line_end
      ? `${item.source_file}:${item.line_start}`
      : `${item.source_file}:${item.line_start}-${item.line_end}`;
  txt.push(`【${item.id}】${item.quote_text}`);
  txt.push(`类别：${item.category}`);
  txt.push(`来源：${item.source_or_origin}`);
  txt.push(`摘要：${item.summary}`);
  txt.push(`位置：${item.book} / ${item.chapter} / ${location}`);
  if (item.notes) txt.push(`备注：${item.notes}`);
  txt.push("");
}

fs.writeFileSync(txtPath, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

fs.mkdirSync("analysis", { recursive: true });
const byCategory = new Map();
const byChapter = new Map();
for (const item of data) {
  byCategory.set(item.category, (byCategory.get(item.category) || 0) + 1);
  byChapter.set(item.chapter, (byChapter.get(item.chapter) || 0) + 1);
}
const proofreadRows = data.filter((item) => item.notes.includes("校对补入"));

const report = [];
report.push(`《${book}》第一轮校对报告`);
report.push("生成日期：2026-06-17");
report.push(`本书导出：${data.length} 条`);
report.push(`本轮校对补入：${proofreadRows.length} 条`);
report.push("");
report.push("范围说明：本轮按用户口径，优先收诗文、古文名句、格言、俗谚、成语、歌谣、史传故事和外国名言；普通政论口号、候选人声明、党报社论、现代政治人物语录不进入本表。");
report.push("本轮取向：这本书政治新闻噪声很重，校对轮补入已知成句和明确格言，仍不收李敖自作政治判断、戴布兹社会主义名言、孙中山/蒋氏相关政治套语。");
report.push("");
report.push("按类别统计：");
for (const [category, count] of [...byCategory.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))) {
  report.push(`- ${category}：${count}`);
}
report.push("");
report.push("按章节统计：");
for (const [chapter, count] of [...byChapter.entries()]) {
  report.push(`- ${chapter}：${count}`);
}
report.push("");
report.push("校对说明：同篇重复出现的短成语不再另开条；已完整收录“温、良、恭、俭、让”，不另拆“温、良、恭、俭”。");
report.push(`CSV：${path.resolve(csvPath)}`);
report.push(`TXT：${path.resolve(txtPath)}`);

const reportPath = path.join("analysis", "liao_qiushi_xinyu_proofread_report.txt");
fs.writeFileSync(reportPath, `${report.join("\r\n")}\r\n`, "utf8");

const auditColumns = ["id", "source_file", "line_start", "quote_text", "category", "source_or_origin", "summary", "notes"];
const auditRows = [
  auditColumns.join("\t"),
  ...proofreadRows.map((item) => auditColumns.map((column) => String(item[column] ?? "").replace(/\r?\n/g, " ")).join("\t")),
];
const auditPath = path.join("analysis", "liao_qiushi_xinyu_proofread_audit.tsv");
fs.writeFileSync(auditPath, `${auditRows.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rows: data.length,
      csvPath: path.resolve(csvPath),
      txtPath: path.resolve(txtPath),
      reportPath: path.resolve(reportPath),
      auditPath: path.resolve(auditPath),
    },
    null,
    2,
  ),
);
