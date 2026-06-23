const fs = require("fs");
const path = require("path");

const generatedDate = "2026-06-21";
const book = "李敖随写录后集";
const idPrefix = "LASXLHJ";
const sourceRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "006.沉思日记类",
  "010.李敖随写录后集",
);
const outDir = path.join(process.cwd(), "exports");
const analysisDir = path.join(process.cwd(), "analysis");
const sourceDecoder = new TextDecoder("gb18030");

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

function chapterFromFile(file) {
  return file.replace(/\.txt$/, "").replace(/^\d+\./, "");
}

function row(sourceFile, lineStart, lineEnd, quoteText, category, sourceOrOrigin, summary, notes = "") {
  return {
    id: "",
    book,
    chapter: chapterFromFile(sourceFile),
    source_file: sourceFile,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrOrigin,
    summary,
    notes,
  };
}

const data = [
  row(
    "005.每人每年只花二十元买书.txt",
    9,
    9,
    "怪力乱神",
    "论语成句",
    "《论语·述而》“子不语怪力乱神”成句",
    "以怪异、勇力、悖乱、鬼神一类内容概括不正经的读物趣味。",
  ),
  row(
    "014.中医解决不了检验问题.txt",
    3,
    3,
    "视病，尽见五藏症结，特以诊脉为名耳",
    "史记引文",
    "司马迁《史记·扁鹊仓公列传》",
    "以扁鹊能看见五脏症结说明其诊病并非仅靠把脉。",
  ),
  row(
    "014.中医解决不了检验问题.txt",
    9,
    9,
    "我有禁方，年老，欲传与公，公毋泄。",
    "史记文句",
    "司马迁《史记·扁鹊仓公列传》",
    "长桑君向扁鹊传授秘方前的嘱托，保留为史传人物对白。",
  ),
  row(
    "014.中医解决不了检验问题.txt",
    9,
    9,
    "饮是以上池之水，三十日当知物矣。",
    "史记文句",
    "司马迁《史记·扁鹊仓公列传》",
    "长桑君告知扁鹊服药方法，带出“上池之水”的典故。",
  ),
  row(
    "014.中医解决不了检验问题.txt",
    11,
    11,
    "上池之水",
    "古籍典故",
    "《史记·扁鹊仓公列传》典故语",
    "指尚未落到地面的雨露之水，文中据以解释扁鹊传说。",
  ),
  row(
    "014.中医解决不了检验问题.txt",
    11,
    11,
    "视见垣一方人",
    "古籍典故",
    "《史记·扁鹊仓公列传》文句",
    "指能够看见墙另一边的人，文中用作解释扁鹊神视传说。",
  ),
  row(
    "027.陈翰珍的真面目.txt",
    11,
    11,
    "若待有余而济人，则一生无济人之事。有心帮助人，就要强迫自己节衣缩食，民国十七年，设了翰珍奖助学金后，我连烟都戒了。",
    "公益处世格言",
    "陈翰珍语，《中国时报》专文转述，李敖摘录",
    "以不等有余才济人、而要节衣缩食帮助人概括公益实践的主动性。",
    "校对补入：只收济人处世句，不收同篇政治履历和雷震案语境。",
  ),
  row(
    "037.俞大维乃一浑人.txt",
    7,
    7,
    "经文纬武奇男子，特立独行大丈夫。",
    "题字联语",
    "毛子水题字",
    "以经文纬武、特立独行称颂人物的才具与人格。",
  ),
  row(
    "051.杨西崑来坐.txt",
    5,
    5,
    "你们没有办公厅，你们的办公厅就在田里。",
    "现代工作格言",
    "杨西崑语，李敖转录",
    "以办公地点应在现场说明农耕队工作重在深入田间。",
    "非政治内容；只收工作格言本体。",
  ),
  row(
    "064.乱世情鸯又二例.txt",
    13,
    13,
    "砣不离秤、秤不离砣",
    "传统俗谚",
    "传统俗谚",
    "以秤砣相依比喻夫妻或伴侣分不开。",
    "只收俗谚本体，不收两岸配偶名额新闻语境。",
  ),
  row(
    "082.收到章太炎字.txt",
    7,
    7,
    "汉第六曲《战城南》，今第六曲《定武功》，言曹公初破邺，武功之定，始乎此也。",
    "古籍乐志引文",
    "《宋书·乐志》",
    "解释汉魏鼓吹曲《战城南》《定武功》的承改关系。",
  ),
  row(
    "082.收到章太炎字.txt",
    9,
    9,
    "定武功，济黄河。河水汤汤，旦莫有橫流波。袁氏欲衰，兄弟寻干戈。决漳水，水流滂沱。嗟城中如流鱼，谁能复顾室家！计穷虑尽，求来连和。和不时，心中忧戚。贼众内溃，君臣奔北。拔邺城，奄有魏国。王业艰难，览观古今，可为长叹。",
    "乐府古诗",
    "缪袭《定武功曲》，章太炎中堂所书",
    "以曹操破邺、袁氏败亡写王业艰难和古今长叹。",
  ),
  row(
    "082.收到章太炎字.txt",
    15,
    15,
    "嗟城中如流鱼",
    "乐府诗句",
    "缪袭《定武功曲》句",
    "李敖特别指出标点本误断的一句，写城中受困如流鱼。",
  ),
  row(
    "082.收到章太炎字.txt",
    23,
    23,
    "毁土山、地道，凿堑围城，周回四十里。初令浅，示若可越。〔审〕配望见，笑之，不出争利。操一夜濬之，广深二丈，引漳水以灌之，城中饿死者过半",
    "资治通鉴引文",
    "司马光《资治通鉴》献帝建安九年",
    "记曹操围邺凿堑引漳水的战事，说明《定武功》所指史事。",
  ),
  row(
    "085.张大千题牡丹诗.txt",
    5,
    11,
    "一种天香异，\n\n千株国色新。\n\n为怜花似脸，\n\n半醉调太真。",
    "题画诗",
    "张大千题牡丹诗",
    "以天香、国色、太真写牡丹艳丽。",
  ),
  row(
    "089.秦始皇陵新消息.txt",
    5,
    5,
    "令匠做机弩矢，有所穿近者辄射之。",
    "史记引文",
    "司马迁《史记·秦始皇本纪》",
    "写秦陵设置机关弩矢以防接近者。",
  ),
  row(
    "089.秦始皇陵新消息.txt",
    5,
    5,
    "以水银为百川江河大海，机相灌输，上具天文，下具地理。",
    "史记引文",
    "司马迁《史记·秦始皇本纪》",
    "写秦陵地宫以水银象征江河大海并配合天地布局。",
  ),
  row(
    "089.秦始皇陵新消息.txt",
    5,
    5,
    "下外羡门，尽闭工匠臧者，无复出者。",
    "史记引文",
    "司马迁《史记·秦始皇本纪》",
    "写秦陵完工后封闭墓道、工匠不得复出的残酷设计。",
  ),
  row(
    "096.妖僧的新妖妄.txt",
    7,
    7,
    "金蝉脱壳",
    "传统成语",
    "传统成语，亦见兵法语汇",
    "比喻用脱身之法摆脱困境，文中作为宗教仪式名目出现。",
  ),
  row(
    "096.妖僧的新妖妄.txt",
    15,
    15,
    "取之有道，用之有道",
    "处世格言",
    "传统理财伦理“取之有道”的扩展句",
    "以获得和使用钱财都应合乎正道来概括金钱价值观。",
  ),
  row(
    "107.蔡万霖的“金玉满堂”.txt",
    3,
    3,
    "金玉满堂，莫之能守；富贵而骄，自遗其咎。",
    "老子名句",
    "《老子》第九章",
    "以金玉满堂难守、富贵而骄自招灾咎警戒富贵骄盈。",
  ),
  row(
    "107.蔡万霖的“金玉满堂”.txt",
    3,
    3,
    "王长史谓林公：‘真长可谓金玉满堂。’林公曰：‘金玉满堂，复何为简选？’王曰：‘非为简选，直致言处自寡耳。’",
    "世说新语引文",
    "《世说新语·赏誉》",
    "以“金玉满堂”称誉才学充盈，并用问答解释并非简选而是言处自寡。",
  ),
  row(
    "115.戒之在失.txt",
    3,
    3,
    "戒之在得",
    "论语成句",
    "《论语·季氏》“及其老也，血气既衰，戒之在得”",
    "孔子以年老戒贪得，李敖借来反衬“戒之在失”。",
  ),
  row(
    "115.戒之在失.txt",
    3,
    3,
    "戒之在失",
    "论语成句反用",
    "李敖据《论语》“戒之在得”变用",
    "把戒贪得反转为戒失去，用来讽刺老人防失之心。",
  ),
  row(
    "119.囚犯产品大哥莫笑二哥.txt",
    1,
    1,
    "大哥莫笑二哥",
    "传统俗语",
    "传统俗语",
    "以彼此相差无几来劝不要互相讥笑。",
    "校对补入：标题中俗语，只收本体，不收囚犯产品和人权新闻语境。",
  ),
  row(
    "120.七日参禅，军头落泪.txt",
    3,
    3,
    "人如果只有物质生活而没有精神生活，将只是虚度一生。",
    "宗教人生格言",
    "陈守山参禅感想，报载引语",
    "以精神生活不可缺少说明只有物质生活会使人生虚度。",
    "校对补入：只收参禅后的人生格言本体，不收军政身份和李敖评论语境。",
  ),
  row(
    "123.引以为耻.txt",
    3,
    3,
    "吾愧居卢前，耻居王后！",
    "文学轶语",
    "初唐四杰轶语，杨炯语",
    "杨炯以愧居卢照邻前、耻居王勃后表达对四杰排序的态度。",
    "校对补入：只收文学史轶语，不收现代出版文案和李敖自嘲语境。",
  ),
  row(
    "131.胡虚一信中的傅正.txt",
    19,
    19,
    "人善被人欺",
    "传统俗谚",
    "传统俗谚，常见完整语为“人善被人欺，马善被人骑”",
    "以人太善良便易受欺负来概括处境中的怨叹。",
    "只收俗谚本体，不收来信中的政治派系语境。",
  ),
  row(
    "135.看周之鸣藏艺品.txt",
    7,
    7,
    "宋米元章行草书易说帖，名贤题识，项子京珍秘",
    "书画题识",
    "项元汴记语",
    "书画收藏题识，标举米芾《易说帖》及历代题识珍秘。",
  ),
  row(
    "135.看周之鸣藏艺品.txt",
    9,
    9,
    "此卷予从项氏借摹刻于戏鸿堂帖，甲戌修禊日再展现于长安苑西邸中",
    "书画题记",
    "董其昌题记",
    "董其昌记述从项氏借卷摹刻入《戏鸿堂帖》及再展观之事。",
  ),
  row(
    "135.看周之鸣藏艺品.txt",
    13,
    13,
    "吴兴书易学，米书不易学，二公书品，于此辨矣",
    "书论名句",
    "董其昌书论",
    "以赵孟頫书容易学、米芾书不易学来判别二人书品。",
  ),
  row(
    "135.看周之鸣藏艺品.txt",
    13,
    13,
    "吾尝评米书以为宋朝第一，毕竟出东坡之上，山谷直以品胜，非专门名家也",
    "书论名句",
    "董其昌书论",
    "评米芾书法为宋朝第一，并比较苏轼、黄庭坚的书品。",
  ),
  row(
    "135.看周之鸣藏艺品.txt",
    13,
    13,
    "自唐以后未有能过元章书者，虽赵文敏亦于元章叹服曰：今人去古远矣",
    "书论名句",
    "董其昌书论",
    "称唐以后无人超过米芾，并引赵孟頫叹今人去古已远。",
  ),
  row(
    "135.看周之鸣藏艺品.txt",
    15,
    15,
    "法无定相、气概成章耳",
    "画论题语",
    "石涛画上题语",
    "以法无固定形态而气概自然成章概括画法自由。",
  ),
  row(
    "144.胡适死了三十年.txt",
    3,
    3,
    "吾道一以贯之",
    "论语名句",
    "《论语·里仁》孔子语",
    "孔子以一贯之道概括自身思想，李敖借来批评文人死后改口。",
  ),
  row(
    "146.郭为藩抄袭.txt",
    5,
    5,
    "林木不可胜用也",
    "孟子引文",
    "《孟子·梁惠王上》",
    "孟子论不违农时、资源可持续时的文句。",
  ),
  row(
    "153.关于杨西崑的资料.txt",
    33,
    33,
    "量入为出",
    "传统成语",
    "传统理财成语",
    "以收入多少决定支出多少，概括节制生活原则。",
    "只收成语本体，不收外交报道语境。",
  ),
  row(
    "153.关于杨西崑的资料.txt",
    35,
    35,
    "在中国人的社会里，就需要不停的学习。",
    "现代处世格言",
    "杨西崑语，原文称“杨大使如是说道”",
    "以不断学习概括在中国人社会中的处世能力。",
    "非政治内容；只收处世格言本体。",
  ),
];

const excludedHighlights = [
  "《李敖随写录后集》自序中的“古典李敖”“当代李敖”“世界性、永恒性的大手笔”等为李敖自我分期与写作定位，不作外部诗文格言收录。",
  "005 “饱暖思艺文”：新闻官员的文化政策口号，未收；同篇只保留《论语》成句“怪力乱神”。",
  "013 “六亿农民皆诗人”：大跃进政治口号和新闻评论语境，未收。",
  "031 “依法而来，依法而去”“非法而来，非法而去”：国会改选政论语境，未收。",
  "043 “拒辟邪辞，阐扬正学”：现代政治人物贺词，未收。",
  "058 “盛德伟业，灿若日星，举世景仰”：现代政治人物纪念报告颂词，未收。",
  "067 “五绝”“七绝”与“绝子绝孙”：私下讥刺玩笑，未收。",
  "068 “低头向暗壁，千唤不一回”及 071 《宠猫江江颂》：李敖自作猫诗/笑语，未见明确外部出处，未整首收入。",
  "122 斯威夫特、海斯利特段落：仅为作品与观点转述，未录明确诗文原句，首轮不收。",
  "113 “足不出户能知天下事”：私人转述李敖自况，且前集已收更规范的老子成句“不出户，知天下”，校对轮不补。",
  "119 附录标题“充耳不闻？尊口难开？”与“三缄其口”等：普通新闻标题成语，未作为独立诗文格言补入；只补题名俗语“大哥莫笑二哥”。",
  "120 “拿到的皈依手册，比这一年所得的勋章，都还要高”：个人宗教体验比较句，未作为通用格言补入。",
  "123 “读史以识世局、决大势”等：现代出版文案，未收；只补杨炯文学轶语。",
  "133 张灵甫战事电报与绝笔：现代军事政治语境，未收。",
  "149 《北京法源寺》广播广告词：李敖自拟宣传文案，未收。",
  "153 杨西崑外交史报道中的联合国、外交、代表权等现代政治语录未收；只取非政治的成语/处世句。",
  "154 台大二二八活动、“怨魂”“不屈服的抗争”等：现代政治事件和活动文案语境，未收。",
  "155 《人民日报》论西藏与 156 海峡两岸二二八：现代政治宣传和人权/主权语录，未收。",
];

const auditExcludes = [
  ["exclude", "", "005.每人每年只花二十元买书.txt", "3-3", "饱暖思艺文", "现代官员文化口号，未收"],
  ["exclude", "", "013.“六亿农民皆诗人”之后.txt", "1-3", "六亿农民皆诗人", "大跃进政治口号，未收"],
  ["exclude", "", "031.梁肃戎临别瞎说.txt", "15-15", "依法而来，依法而去 / 非法而来，非法而去", "现代政论语境，未收"],
  ["exclude", "", "043.李登辉的“正学”论.txt", "3-3", "拒辟邪辞，阐扬正学", "现代政治人物贺词，未收"],
  ["exclude", "", "058.林洋港口出无耻之言.txt", "3-3", "盛德伟业，灿若日星，举世景仰", "现代政治人物颂词，未收"],
  ["exclude", "", "067.“五绝”与“七绝”.txt", "3-3", "五绝 / 七绝 / 绝子绝孙", "私下讥刺玩笑，未收"],
  ["exclude", "", "068.“小警总”.txt", "3-5", "低头向暗壁，千唤不一回 / 小警总", "李敖自作宠猫笑语与政治绰号，未收"],
  ["exclude", "", "071.宠猫江江颂.txt", "3-31", "宠猫江江颂", "李敖自作诗，未整首收入"],
  ["exclude", "", "122.听刘绍唐、杨西昆谈往.txt", "31-31", "斯威夫特、海斯利特观点转述", "无明确原句且出处待考，未收"],
  ["exclude", "", "113.视野问题.txt", "3-3", "足不出户能知天下事", "私人转述李敖自况，且前集已收更规范的老子成句，不补"],
  ["exclude", "", "119.囚犯产品大哥莫笑二哥.txt", "11-35", "充耳不闻？尊口难开？ / 三缄其口 / 奴工产品出口", "政治新闻附录标题和普通成语，不补"],
  ["exclude", "", "120.七日参禅，军头落泪.txt", "3-7", "拿到的皈依手册，比这一年所得的勋章，都还要高。", "个人宗教体验比较句及李敖军政评论，不补"],
  ["exclude", "", "123.引以为耻.txt", "3-3", "读史以识世局、决大势 / 引以为耻", "现代出版文案和李敖自嘲，不补"],
  ["exclude", "", "133.张灵甫死事异说.txt", "7-19", "张灵甫电文/绝笔", "现代军事政治语录，未收"],
  ["exclude", "", "149.《北京法源寺》广告词.txt", "3-3", "北京法源寺广告词", "李敖自拟宣传文案，未收"],
  ["exclude", "", "153.关于杨西崑的资料.txt", "5-25", "非洲就是你嘛 / 外交下乡，农业出洋", "现代外交政治报道语录，未收"],
  ["exclude", "", "154.台大怪火案.txt", "5-37", "怨魂 / 不屈服的抗争 / 二二八活动文案", "现代政治活动文案，未收"],
  ["exclude", "", "155.《人民日报》论西藏.txt", "3-49", "西藏人权/主权相关引语", "现代政治宣传语境，未收"],
];

for (const [index, item] of data.entries()) {
  item.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
}

const initialRecordCount = 34;
const proofreadAddedRows = data.filter((item) => item.notes.includes("校对补入"));
const proofreadUpdatedRows = [];
const proofreadDeletedRows = [];
const proofreadExcludeFiles = new Set([
  "113.视野问题.txt",
  "119.囚犯产品大哥莫笑二哥.txt",
  "120.七日参禅，军头落泪.txt",
  "123.引以为耻.txt",
]);
const proofreadExcludeRows = auditExcludes.filter((row) => proofreadExcludeFiles.has(row[2]));

const sourceCache = new Map();
function sourceLines(sourceFile) {
  if (!sourceCache.has(sourceFile)) {
    const fullPath = path.join(sourceRoot, sourceFile);
    sourceCache.set(
      sourceFile,
      sourceDecoder.decode(fs.readFileSync(fullPath)).replace(/\r\n/g, "\n").split("\n"),
    );
  }
  return sourceCache.get(sourceFile);
}

function compact(text) {
  return String(text).replace(/\s+/g, "");
}

for (const item of data) {
  const lines = sourceLines(item.source_file)
    .slice(item.line_start - 1, item.line_end)
    .join("\n");
  if (!lines.includes(item.quote_text) && !compact(lines).includes(compact(item.quote_text))) {
    throw new Error(`Quote not found in source for ${item.id}: ${item.quote_text}`);
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_suixielu_houji_initial_report.txt");
const auditPath = path.join(analysisDir, "liao_suixielu_houji_initial_audit.tsv");
const proofreadReportPath = path.join(analysisDir, "liao_suixielu_houji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_suixielu_houji_proofread_audit.tsv");

const csvEscape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const tsvEscape = (value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " / ");

const csvLines = [
  columns.join(","),
  ...data.map((item) => columns.map((column) => csvEscape(item[column])).join(",")),
];
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`总计：${data.length} 条`);
txt.push("范围：收古籍原文、诗词联语、题画/书画题记、传统俗谚成语、非政治的处世/工作格言；不收现代政治语录、政策口号、司法新闻、公文广告、普通私人对白和李敖自作笑语。");
txt.push("");

let currentChapter = "";
for (const item of data) {
  if (item.chapter !== currentChapter) {
    currentChapter = item.chapter;
    txt.push(`## ${currentChapter}`);
  }
  txt.push(`- ${item.id}｜${item.quote_text}`);
  txt.push(`  - 位置：${item.source_file}:${item.line_start}-${item.line_end}`);
  txt.push(`  - 类别：${item.category}`);
  txt.push(`  - 来源：${item.source_or_origin}`);
  txt.push(`  - 摘要：${item.summary}`);
  if (item.notes) {
    txt.push(`  - 备注：${item.notes}`);
  }
}
fs.writeFileSync(txtPath, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

const categoryCounts = new Map();
for (const item of data) {
  categoryCounts.set(item.category, (categoryCounts.get(item.category) ?? 0) + 1);
}

const reportLines = [];
reportLines.push(`《${book}》首轮抽取报告`);
reportLines.push(`生成日期：${generatedDate}`);
reportLines.push(`源目录：${sourceRoot}`);
reportLines.push("原始候选：analysis/liao_suixielu_houji_quote_candidates.json");
reportLines.push("复筛候选：analysis/liao_suixielu_houji_review_candidates.tsv");
reportLines.push("归因线索：analysis/liao_suixielu_houji_attributed_lines.tsv");
reportLines.push(`输出 CSV：${csvPath}`);
reportLines.push(`输出 TXT：${txtPath}`);
reportLines.push(`首轮收录条数：${initialRecordCount}`);
reportLines.push(`校对补入条数：${proofreadAddedRows.length}`);
reportLines.push(`校对修订条数：${proofreadUpdatedRows.length}`);
reportLines.push(`校对删除条数：${proofreadDeletedRows.length}`);
reportLines.push(`当前收录条数：${data.length}`);
reportLines.push("");
reportLines.push("候选概况：");
reportLines.push("- sourceFiles=160");
reportLines.push("- quoteCandidates=712");
reportLines.push("- uniqueQuoteTexts=509");
reportLines.push("- keywordLines=133");
reportLines.push("- attributedLines=223");
reportLines.push("- reviewCandidates=281");
reportLines.push("");
reportLines.push("分类统计：");
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], "zh-Hans-CN"),
)) {
  reportLines.push(`- ${category}: ${count}`);
}
reportLines.push("");
reportLines.push("本轮排除：");
for (const item of excludedHighlights) {
  reportLines.push(`- ${item}`);
}
reportLines.push("");
reportLines.push("明细：");
reportLines.push(
  [
    "id",
    "source_file",
    "line_start",
    "line_end",
    "category",
    "source_or_origin",
    "quote_text",
    "summary",
    "notes",
  ].join("\t"),
);
for (const item of data) {
  reportLines.push(
    [
      item.id,
      item.source_file,
      item.line_start,
      item.line_end,
      item.category,
      item.source_or_origin,
      item.quote_text,
      item.summary,
      item.notes,
    ]
      .map(tsvEscape)
      .join("\t"),
  );
}
fs.writeFileSync(reportPath, `\uFEFF${reportLines.join("\r\n")}\r\n`, "utf8");

const auditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ...data.map((item) => [
    "keep",
    item.id,
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.summary,
  ]),
  ...auditExcludes,
];
fs.writeFileSync(
  auditPath,
  `\uFEFF${auditRows.map((auditRow) => auditRow.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

const proofreadReportLines = [];
proofreadReportLines.push(`《${book}》校对轮报告`);
proofreadReportLines.push(`生成日期：${generatedDate}`);
proofreadReportLines.push(`源目录：${sourceRoot}`);
proofreadReportLines.push(`输出 CSV：${csvPath}`);
proofreadReportLines.push(`输出 TXT：${txtPath}`);
proofreadReportLines.push(`首轮收录条数：${initialRecordCount}`);
proofreadReportLines.push(`校对补入条数：${proofreadAddedRows.length}`);
proofreadReportLines.push(`校对修订条数：${proofreadUpdatedRows.length}`);
proofreadReportLines.push(`校对删除条数：${proofreadDeletedRows.length}`);
proofreadReportLines.push(`当前收录条数：${data.length}`);
proofreadReportLines.push("");
proofreadReportLines.push("校对结论：");
proofreadReportLines.push("- 首轮 34 条未发现需要删除的政治语录。");
proofreadReportLines.push("- 补入 027 的公益处世格言、119 标题俗语、120 参禅人生格言、123 杨炯文学轶语。");
proofreadReportLines.push("- 继续排除政治/司法/外交/二二八/西藏新闻语录，以及李敖自作猫诗、出版广告文案和普通私人对白。");
proofreadReportLines.push("");
proofreadReportLines.push("校对补入：");
for (const item of proofreadAddedRows) {
  proofreadReportLines.push(
    `- ${item.id}\t${item.source_file}:${item.line_start}-${item.line_end}\t${item.category}\t${item.quote_text}`,
  );
}
proofreadReportLines.push("");
proofreadReportLines.push("校对复核排除：");
for (const rowItem of proofreadExcludeRows) {
  proofreadReportLines.push(`- ${rowItem[2]}:${rowItem[3]}\t${rowItem[4]}\t${rowItem[5]}`);
}
fs.writeFileSync(proofreadReportPath, `\uFEFF${proofreadReportLines.join("\r\n")}\r\n`, "utf8");

const proofreadAuditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ...proofreadAddedRows.map((item) => [
    "add",
    item.id,
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.notes,
  ]),
  ...proofreadExcludeRows,
];
fs.writeFileSync(
  proofreadAuditPath,
  `\uFEFF${proofreadAuditRows.map((auditRow) => auditRow.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      book,
      initialRecords: initialRecordCount,
      records: data.length,
      proofreadAdded: proofreadAddedRows.length,
      proofreadUpdated: proofreadUpdatedRows.length,
      proofreadDeleted: proofreadDeletedRows.length,
      csvPath,
      txtPath,
      reportPath,
      auditPath,
      proofreadReportPath,
      proofreadAuditPath,
    },
    null,
    2,
  ),
);
