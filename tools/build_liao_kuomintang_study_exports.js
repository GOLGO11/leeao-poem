const fs = require("fs");
const path = require("path");

const book = "国民党研究";
const idPrefix = "LAGMDYJ";
const generatedDate = "2026-06-28";
const sourceDir = path.join("《大李敖全集6.0》分章节", "013.国民党史政", "001.国民党研究");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_kuomintang_study_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_kuomintang_study_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_kuomintang_study_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_kuomintang_study_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_kuomintang_study_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_kuomintang_study_proofread_report.txt");
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
      "校对后保守收入：《国民党研究》以现代党史、党国宣传、军政制度、反攻复国、选举、司法整肃、老兵与军中乐园等政治材料为主体；现代政党、政权、政府机关、领袖、军政、革命、反共/反攻/复国、选举、统独、民主自由人权、国家民族、司法整肃和政治攻防语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、成语俗语、笑话、联语、民俗文献、文学典故、外文格言和非政治生活格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    15,
    "知当时实事者已少，夸诞之士，乃欲一切笼为己有",
    "文言史评",
    "章太炎《中华民国开国前革命史》序",
    "李敖引用章太炎史评，讥刺夸诞者把历史功劳一概揽归己有。",
    15,
    "只收文言史评本体，不收同段现代党史归属论战。",
  ),
  q("001.", 15, "贪天之功", "成语", "中文成语", "李敖引用成语，表示把不属于自己的功劳据为己有。"),
  q("001.", 15, "贪人之功", "成语化用", "贪天之功化用", "李敖化用成语，表示把他人的功劳据为己有。"),
  q("002.", 5, "如今何罪？", "古笑话语", "《笑倒》", "李敖引用笑话中僧人的问句，形成机锋式诙谐。"),
  q("002.", 5, "你如今闭了眼睛正想得我好！", "古笑话语", "《笑倒》", "李敖引用笑话中妇人的回击，写闭眼意想也逃不过揶揄。"),
  q("002.", 11, "我未曾看你。", "古笑话语", "《笑禅录》", "李敖引用笑话中长者的辩解。"),
  q("002.", 11, "看的何妨？闭眼想的独狠。", "古笑话语", "《笑禅录》", "李敖引用笑话中歌妓的妙语。"),
  q(
    "003.",
    11,
    "吹大法螺、击大法鼓、燃大法炬、雨胜法雨。",
    "佛典文句",
    "《金光明经》",
    "李敖引用佛典文句，说明“吹大法螺”的原始宗教语义。",
    11,
    "只收佛典文句本体，不收同段现代党史讽刺语境。",
  ),
  q("003.", 21, "譬如妖韶女，老自有余态。", "宋诗句", "欧阳修《水谷夜行寄子美圣俞》", "李敖引用欧阳修诗句，借妖韶老女仍有余态作比。"),
  q("005.", 7, "情不可却", "成语化短语", "中文成句", "李敖摘出“情不可却”，表示情面难以推辞。"),
  q("005.", 7, "情非得已", "谐拟成句", "情非得已/情非得已式谐拟", "李敖摘出“情非得已”，形成情势所迫的谐拟说法。"),
  q(
    "005.",
    11,
    "当这乱世，我虽希望真命天子出现，却不愿再有纣王复生……",
    "笑话语",
    "《逸经》半月刊《纣王复生》",
    "李敖引用乡间笑话，以“救亡复兴”和“纣王复生”的谐音构成讽刺。",
    11,
    "只收笑话语本体，不收同段现代宣传语境。",
  ),
  q("006.", 17, "莫予毒也", "古典成语", "《左传》相关成句", "李敖用莫予毒也形容自恃无人能害的气焰。"),
  q("006.", 19, "那拉氏者，先帝之遗妾耳", "文言讽语", "康有为清议报文字", "李敖引用康有为讥刺西太后的文言句。"),
  q("006.", 21, "得计矣。", "古代轶事语", "刘成禺《世载堂杂忆》", "李敖引用李莲英轶事中的得计之语。"),
  q("006.", 21, "民间随意伪造，此风不可长", "古代轶事语", "刘成禺《世载堂杂忆》", "李敖引用宫廷轶事中反制伪造照片的劝禁语。"),
  q("006.", 23, "羊车行幸六宫", "古典典故", "羊车望幸典故", "李敖用羊车行幸六宫典故形容姬妾分处、轮流宠幸的场面。"),
  q("007.", 11, "目下一言为定，早晚市价不同", "市井成句", "通货膨胀时期店招", "李敖引用店招，写物价朝夕不同的市井现实。"),
  q("007.", 61, "不胜枚举", "成语", "中文成语", "李敖引用不胜枚举，表示同类例子极多。"),
  q("007.", 65, "勇于代人受过", "成语化短语", "中文成句", "李敖摘出勇于代人受过，用来概括替别人承担过错的说法。"),
  q("009.", 21, "天下没有白吃的午餐", "俗语", "中文俗语", "李敖引用俗语，说明利益与代价相连。", 21, "只收俗语本体，不收同段国家安全、民主自由等政治论述。"),
  q("009.", 27, "孝亲、养亲、显亲", "传统伦理语", "中国孝道观念", "李敖摘出传统孝道中的孝亲、养亲、显亲三层说法。"),
  q("011.", 91, "十步芳草，洵可嘉许", "文言评语", "监察纠举书语", "李敖摘出十步芳草的文言评语，表示人才随处可见、值得嘉许。"),
  q("011.", 103, "一朝权在手，便把令来行", "俗语", "中文俗语", "李敖引用俗语，写一旦得权便发号施令的心态。"),
  q("011.", 143, "鸿案相庄", "典故成语", "梁鸿孟光举案齐眉相关典故", "李敖摘出鸿案相庄，用来形容夫妻相敬。"),
  q("011.", 143, "坤德济以贞恒", "文言赞语", "筹募学术基金缘起", "李敖引用文言赞语，写以贞恒之德相辅。"),
  q("013.", 65, "千算万算，不如天算", "俗语", "中文俗语", "李敖引用俗话，表达机关算尽仍不如天命因果。", 65, "只收俗语本体，不收同篇现代政治杀戮与毛词语境。"),
  q("014.", 519, "我只有‘爱钱’，没有爱人。", "机智口语", "军中乐园对话", "李敖引用妓女答语，以爱钱/爱人构成机智反讽。"),
  q("014.", 525, "有钱的王八大三辈！", "俗语", "中文俗语", "李敖引用俗语，写有钱者即使身份低贱也被抬高。"),
  q("014.", 527, "当兵三年，老母猪看做貂蝉", "军中俗语", "中文俗语", "李敖引用军中俗语，形容长期单调生活造成的审美饥渴。", 527, "只收俗语本体，不收同段军中乐园制度语境。"),
  q("014.", 541, "火烧眉毛，只顾眼下", "俗语", "中文俗语", "李敖引用俗语，形容急切时只顾眼前。"),
  q("014.", 545, "泛爱众而肏人", "论语谐拟", "《论语》“泛爱众”谐拟", "李敖以《论语》成句作粗俗谐拟，形容不分对象一概购买。"),
  q("014.", 551, "怜惜枕边红粉 记取故国佳人", "对联", "马祖军中乐园联语", "李敖记录军中乐园联语，上下句以枕边红粉对故国佳人。", 551, "只收联语本体，不收军政制度与前线宣传语境。"),
  q("014.", 553, "把握欢乐高潮 莫惹终身遗憾", "对联", "马祖军中乐园联语", "李敖记录军中乐园联语，以欢乐高潮对终身遗憾。", 553, "只收联语本体，不收军政制度与前线宣传语境。"),
  q("014.", 585, "暮春三月，江南草长，莺花乱飞", "古典文句", "丘迟《与陈伯之书》相关名句", "李敖引用暮春江南文句，写外岛景物的莺花意象。"),
  q("014.", 587, "只此一家，别无分号", "俗语", "中文俗语", "李敖引用俗语，表示某处独一无二。"),
  q("014.", 595, "有钱八字开，无钱莫进来", "俗语", "中文俗语", "李敖引用俗语，写有钱才进得门的势利规矩。"),
  q("014.", 597, "蝗虫过境", "成语化短语", "中文成句", "李敖引用蝗虫过境，比喻人群蜂拥而至。"),
  q("014.", 607, "戏子无义，婊子无情", "俗语", "中文俗语", "李敖引用俗语，概括旧社会对戏子、妓女的刻板说法。"),
  q("014.", 607, "一妻当关，万夫莫敌", "谐拟成句", "一夫当关万夫莫开谐拟", "李敖用谐拟句写妓女应付众多客人的架势。"),
  q("014.", 623, "满纸荒唐言，心中泪一把", "红楼梦化用", "《红楼梦》开篇诗化用", "李敖化用《红楼梦》开篇诗句，写回忆中荒唐与辛酸并存。"),
  q("014.", 639, "唯本色英雄，方能至此；是可怜儿女，何必苛求。", "标语联语", "军中乐园标语", "李敖引用标语联语，记录劝勉式的风月场文字。"),
  q("015.", 7, "好像圆锹，人可休息，工作器具不能休息。", "比喻句", "军中笑谈", "李敖引用比喻句，把人和工具作荒诞对照。"),
  q("016.", 21, "孔雀为何东南飞，而不西北飞", "古诗笑话", "《孔雀东南飞》笑话", "李敖引用以古诗题目设问的笑话。"),
  q("016.", 21, "孔雀东南飞", "古诗题名", "汉乐府《孔雀东南飞》", "李敖引用古诗题名作为笑话的前半。"),
  q("016.", 21, "西北有高楼", "古诗题名", "《古诗十九首》", "李敖引用古诗题名作为笑话的回答。"),
  q("016.", 21, "诸葛亮乃音乐家", "笑话语", "支那通读书笑话", "李敖引用把管仲、乐毅误读成管乐的笑话结论。"),
  q(
    "016.",
    21,
    "亮躬耕陇亩，好为《梁父吟》。身长八尺，每自比于管仲、乐毅，时人莫之许也。",
    "史传文句",
    "《三国志·诸葛亮传》",
    "李敖引用《三国志》文句，指出诸葛亮自比管仲、乐毅的原文。",
  ),
  q("017.", 121, "老兵永远不死，他们只是凋谢。（Old soldiers never die；they just fade away.）", "名言翻译", "旧军歌/麦克阿瑟引语", "李敖转引旧军歌名句的中文译句。", 121, "只收名言译句本体，不收同篇老兵政策与反共复国语境。"),
  q("020.", 29, "暮投石壕村，有吏夜捉人", "唐诗名句", "杜甫《石壕吏》", "李敖引用杜甫诗句，写古代拉夫的凄惨情形。"),
  q("020.", 51, "子弹没眼，上天有眼", "俗语", "中文俗语", "李敖引用俗语，表达枪弹无情而天理有眼。"),
  q("020.", 99, "哀矜勿喜", "古典成语", "《论语》相关成句", "李敖用哀矜勿喜说明面对罪犯应有怜悯。"),
  q("020.", 101, "此水本自清，是谁搅令浊？", "诗句", "古诗句", "李敖引用诗句，以清水被搅浊比喻是非被颠倒。"),
  q("020.", 127, "不畏死，奈何以死惧之？", "道家名句", "《老子》", "李敖引用《老子》名句，说明不怕死者不能再用死亡恐吓。", 127, "只收《老子》句本体，不收同段死刑与现代司法语境。"),
  q("022.", 3, "扰者酷吏非庸人", "题句化用", "宋人语意化用", "李敖以题句概括酷吏扰民往往不是庸人而是才吏。"),
  q("022.", 5, "刖其左足", "古史文句", "《韩非子》相关和氏璧故事", "李敖引用和氏璧故事中卞和先被刖左足的句子。"),
  q("022.", 5, "刖其右足", "古史文句", "《韩非子》相关和氏璧故事", "李敖引用和氏璧故事中卞和又被刖右足的句子。"),
  q("022.", 5, "天下之刖者多矣！", "古史文句", "《韩非子》相关和氏璧故事", "李敖引用古书中劝卞和的话，写受刖者之多。"),
  q("022.", 5, "踊贵而履贱", "古典成句", "古书刑罚成句", "李敖引用踊贵而履贱，写受刖者多到假足比鞋贵。"),
  q("022.", 7, "赭衣塞路", "古典成句", "《汉书·刑法志》", "李敖引用赭衣塞路，形容罪人众多堵塞道路。"),
  q("022.", 7, "赭衣满道", "古典成句", "《北史·酷吏传》", "李敖引用赭衣满道，形容罪人遍布道路。"),
  q("022.", 7, "赭衣半道", "古典成句", "《汉书·贾山传》", "李敖引用赭衣半道，形容穿赭衣的罪人占据道路。"),
  q("022.", 11, "父老苦秦苛法久矣！", "古史文句", "刘邦约法三章故事", "李敖引用刘邦对父老所说秦法苛酷的句子。"),
  q("022.", 11, "与父老约，法，三章耳", "古史文句", "刘邦约法三章故事", "李敖引用刘邦约法三章的古史文句。"),
  q("022.", 11, "三章之法不足以御奸", "古史文句", "汉代法制史语", "李敖引用三章之法不足以御奸，写法令逐渐繁密。"),
  q(
    "022.",
    11,
    "律令凡三百五十九章，大辟四百九条，千八百八十二事，死罪决事比万三千四百七十二事。文书盈于几阁，典者不能遍睹。",
    "法史文句",
    "汉代法制史材料",
    "李敖引用汉武帝时代律令繁密的法史文句。",
  ),
  q("022.", 13, "极知禹无害，然文深，不可以居大府。", "史记文句", "《史记·酷吏列传》相关", "李敖引用周亚夫评赵禹的话，说明用法深刻者不宜掌大府。"),
  q("022.", 19, "今之狱吏（司法官）上下相驱，以刻为明，深者获功名，平者多后患。", "汉书文句", "《汉书·刑法志》", "李敖引用《汉书》文句，写狱吏以刻薄为明察。"),
  q("022.", 21, "刀笔吏不可做公卿", "古语", "汉朝人语", "李敖引用古语，说明刀笔吏不宜位列公卿。"),
  q("022.", 21, "本来无事只畏扰，扰者才吏非庸人。", "古诗文句", "宋朝人语", "李敖引用宋人语，说明真正扰民者往往是能干才吏。"),
  q("022.", 25, "古之知法者能省刑，本也；今之知法者不失有罪，末矣！", "孔子语", "孔子论法", "李敖引用孔子语，说明知法应以省刑为本。"),
  q("022.", 25, "今之听狱者，求所以杀之；古之听狱者，求所以生之。", "孔子语", "孔子论狱", "李敖引用孔子语，比较古今听狱以生人为本或以杀人为务。"),
  q("022.", 25, "囹圄成市", "古典成句", "《汉书·刑法志》", "李敖引用囹圄成市，形容监狱人满如市。"),
  q("023.", 5, "最后一根草，压垮骆驼背（The last straw breaks the camel’s back.语出 John Ray 的 English Proverbs）。", "英国谚语", "John Ray, English Proverbs", "李敖引用英国谚语，说明最后一点负担足以压垮整体。"),
  q("025.", 19, "清客材也……浮躁嗜进", "人物评语", "李慈铭《越缦堂日记》", "李敖引用李慈铭评吴大澂浮躁嗜进的文字。"),
  q("025.", 19, "其人书痴，非吾意中人", "人物评语", "王闿运《湘绮楼日记》", "李敖引用王闿运评吴大澂书痴的句子。"),
  q("025.", 19, "怖其河汉无极", "人物评语", "叶昌炽《缘督庐日记》", "李敖引用叶昌炽评吴大澂夸诞无边的句子。"),
  q("025.", 19, "有将军慷慨来渡辽，飞鞭跃马夸人豪。平时搜集得汉印，今作将印悬在腰。", "讽刺诗句", "黄遵宪《渡辽将军歌》", "李敖引用黄遵宪诗句，讥刺吴大澂嗜古好夸。"),
  q("025.", 19, "两军相接战甫交，纷纷鸟兽空营逃。弃官脱剑无人惜，只幸腰间印未失。", "讽刺诗句", "黄遵宪《渡辽将军歌》", "李敖引用黄遵宪诗句，讥刺吴大澂败逃仍保其印。"),
  q("027.", 7, "谎话、可恶的谎话和统计学（There are three kinds of lies；lies, damned lies, and statistics）。", "外文格言翻译", "狄士累利/马克·吐温相关名言", "李敖引用关于谎言与统计学的格言。"),
  q("028.", 17, "老师既然斋蚊，因何又打他？", "古笑话语", "《笑得好·斋蚊虫》", "李敖引用斋蚊虫笑话中旁人的问句。"),
  q("028.", 17, "他吃过又来吃，我所以打他。", "古笑话语", "《笑得好·斋蚊虫》", "李敖引用斋蚊虫笑话中和尚的回答。"),
  q("028.", 23, "徐青藤门下走狗郑燮", "文人题署", "郑板桥自署", "李敖引用郑板桥自称徐青藤门下走狗的文人雅谑。"),
  q("028.", 23, "我欲九原为走狗", "诗句", "齐白石诗句", "李敖引用齐白石诗句，写对徐渭的仰慕。"),
  q("029.", 9, "场上歌舞，局外指点，知三百年之基业，隳于何人？败于何事？消于何年？歇于何地？", "戏曲评论文句", "《桃花扇》相关评语", "李敖引用《桃花扇》相关评语，写历史剧借场上歌舞追问兴亡。"),
  q("029.", 9, "私君、私臣、私恩、私仇，南朝无一不私，焉得不亡？", "戏曲评论文句", "《桃花扇》相关评语", "李敖引用《桃花扇》相关评语，指出南朝一切皆私的亡国根由。"),
  q("029.", 15, "仁义道德", "成语", "中文成语", "李敖摘出仁义道德，表示儒家伦理名目。"),
  q("029.", 15, "男盗女娼", "成语", "中文成语", "李敖摘出男盗女娼，表示道德表象下的龌龊行为。"),
  q("030.", 23, "苟存性命于乱世，又能闻达于诸侯", "古文谐拟", "诸葛亮《出师表》化用", "李敖化用出师表名句，写乱世中幸存并闻达的反讽。", 23, "只收古文化用本体，不收同段现代政治人物攻防。"),
];

const proofreadRemovedQuoteTexts = new Map([
  ["情非得已", "校对从严删除：这是戒严语境中的现代政治谐拟，独立检索价值弱。"],
  ["得计矣。", "校对从严删除：只是清末轶事中的短对话，不足以作为诗文格言条目。"],
  ["民间随意伪造，此风不可长", "校对从严删除：更像事件处置语，不是稳定诗文格言。"],
  ["十步芳草，洵可嘉许", "校对改写：删去现代纠举书评语后半，只保留成语本体“十步芳草”。"],
  ["坤德济以贞恒", "校对从严删除：现代人物寿庆赞语，带颂词性质。"],
  ["怜惜枕边红粉 记取故国佳人", "校对从严删除：前线军中乐园联语中的“故国”指向太强，政治/军政语境不够干净。"],
]);

const proofreadAdditions = [
  q(
    "003.",
    11,
    "吹法螺",
    "佛教成语",
    "佛教用语",
    "李敖说明“吹法螺”由佛教用语引申为吹牛，校对补入成语本体。",
    11,
    "校对补入：只收佛教成语本体，不收同段现代党史讽刺语境。",
  ),
  q(
    "011.",
    91,
    "十步芳草",
    "成语",
    "中文成语",
    "李敖摘出十步芳草，表示十步之内也有芳草，人才随处可见。",
    91,
    "校对改写：只保留成语本体，删去现代纠举书评语后半。",
  ),
  q("014.", 529, "偷鸡不着蚀把米", "俗语", "中文俗语", "李敖引用俗语，形容占便宜不成反而吃亏。"),
  q("014.", 529, "羊肉没吃到，惹得一身膻", "俗语", "中文俗语", "李敖引用俗语，形容好处没得到反招麻烦。"),
  q("020.", 99, "抑强扶弱", "成语", "中文成语", "李敖用抑强扶弱说明真正的社会公义应压抑强者、扶助弱者。"),
  q("020.", 99, "行侠仗义", "成语", "中文成语", "李敖用行侠仗义说明扶助弱者的侠义精神。"),
  q("020.", 99, "卖友求荣", "成语", "中文成语", "李敖用卖友求荣形容出卖朋友以换取利益。"),
  q("029.", 11, "判若云泥", "成语", "中文成语", "李敖用判若云泥形容人格高下差别极大。"),
];

const proofreadRemovedRows = rawRows
  .filter((row) => proofreadRemovedQuoteTexts.has(row.quote_text))
  .map((row) => ({
    ...row,
    proofread_reason: proofreadRemovedQuoteTexts.get(row.quote_text),
  }));
const proofreadRemovedKeys = new Set(proofreadRemovedRows.map((row) => normalizeText(row.quote_text)));
const proofreadRows = [
  ...rawRows.filter((row) => !proofreadRemovedKeys.has(normalizeText(row.quote_text))),
  ...proofreadAdditions,
];

const modernPoliticalTerms = [
  "共产党",
  "中共",
  "共党",
  "国民党",
  "民进党",
  "台独",
  "中华民国",
  "党国",
  "政府",
  "政权",
  "总统",
  "总裁",
  "行政院",
  "立法院",
  "司法院",
  "监察院",
  "国防部",
  "警备总部",
  "调查局",
  "反攻",
  "复国",
  "戡乱",
  "革命",
  "反革命",
  "反共",
  "选举",
  "统独",
  "民主",
  "人权",
  "国家",
  "民族",
  "政治",
  "领袖",
  "蒋介石",
  "蒋经国",
  "孙中山",
  "李登辉",
  "毛泽东",
  "台湾",
  "大陆",
  "军中乐园",
  "献身报国",
  "效命疆场",
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
function rowCompare(a, b) {
  const fileDiff = fileIndex.get(a.source_file) - fileIndex.get(b.source_file);
  if (fileDiff) return fileDiff;
  if (a.line_start !== b.line_start) return a.line_start - b.line_start;
  return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
}

const selectedRows = proofreadRows.sort(rowCompare).map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

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

const candidatesData = fs.existsSync(candidatesJson) ? JSON.parse(fs.readFileSync(candidatesJson, "utf8")) : [];
const quoteCandidates = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "quote").length
  : "missing";
const keywordLines = Array.isArray(candidatesData)
  ? candidatesData.filter((row) => row.kind === "keyword_line").length
  : "missing";
const uniqueQuoteTexts = Array.isArray(candidatesData)
  ? new Set(candidatesData.filter((row) => row.kind === "quote").map((row) => normalizeText(row.text))).size
  : "missing";
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
  `initialRowsBeforeProofread: ${rawRows.length}`,
  `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
  `proofreadAddedRows: ${proofreadAdditions.length}`,
  `selectedRows: ${selectedRows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is dominated by modern Kuomintang history, party-state documents, military and judicial systems, counteroffensive/recovery rhetoric, elections, veterans, and military brothel material; exclude direct modern party, regime, state, leader, military, revolution, anti-communist, counteroffensive, election, unification/independence, democracy/freedom/human-rights, judicial-purge, and political attack quotations. Keep only independently reusable classical poetry/prose, idioms, proverbs, jokes, couplets, literary allusions, folk/legal-history material, foreign maxims, and non-political life sayings.",
  "",
  "selectedHighlights:",
  "- 001-005: 收章太炎文言史评、贪天/贪人之功、古笑话、佛典句、吹法螺、欧阳修诗句、情不可却与纣王复生笑话；删去戒严语境下的“情非得已”。",
  "- 006-011: 收清末轶事语、店招俗语、天下没有白吃的午餐、传统孝道语、十步芳草、一朝权在手、鸿案相庄；删去普通短对话“得计矣”和现代寿庆赞语“坤德济以贞恒”。",
  "- 013-017: 收千算万算不如天算、妓院/军中俗语、红楼梦化用、古诗笑话、《三国志》文句和老兵名言译句；删去含“故国”的军中乐园前线联语。",
  "- 020-023: 收杜甫诗句、《老子》、古代刑法与酷吏文句、孔子论法、抑强扶弱、行侠仗义、卖友求荣和英国谚语；现代司法、媒体社论、死刑和政治整肃语录不收。",
  "- 025-030: 收吴大澂人物评语、黄遵宪讽刺诗、统计学格言、古笑话、郑板桥/齐白石文人雅谑、《桃花扇》评语和《出师表》化用；反攻无望论、通缉、走狗自白、孔家政治职衔和选举语录不收。",
  "",
  "proofreadChanges:",
  ...proofreadRemovedRows.map((row) => `- 删除「${row.quote_text}」：${row.proofread_reason}`),
  ...proofreadAdditions.map((row) => `- 增补「${row.quote_text}」：${row.summary}`),
  "",
  "excludedHighlights:",
  "- 自序、004、008、010、012、018、019、021、024、026 主体为现代政治口号、官方/司法/军政文书或政论攻防，首轮基本不收。",
  "- 本册结尾李敖骂“老K”的诗、毛泽东《蝶恋花》及“忽报人间曾伏虎”等虽属诗词，但现代政治指向强，首轮不收。",
  "- “自由、自由，多少罪恶假汝之名以行之”“民主、民主……”等虽是格言/化用，但属于现代意识形态与政治论战语录，首轮不收。",
  "- “十年生聚，十年教训”“师文王，大国五年……”等古典句在本册直接嵌入反攻复国讲话，首轮从严不收。",
];

fs.writeFileSync(reportTxt, reportLines.join("\n") + "\n", "utf8");

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
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
    },
    null,
    2,
  ),
);
