const fs = require("fs");
const path = require("path");

const book = "另一面的二二八";
const idPrefix = "LAOS228";
const generatedDate = "2026-06-29";
const sourceDir = path.join("《大李敖全集6.0》分章节", "014.台湾史政类", "008.另一面的二二八");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_other_side_228_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_other_side_228_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_other_side_228_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_other_side_228_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_other_side_228_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_other_side_228_proofread_report.txt");
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
    .replace(/[“”‘’『』「」《》〈〉"'，。！？；：、\s]/g, "");
}

const scopeNote =
  "首轮保守收入：《另一面的二二八》为二二八事件史料、道歉/立碑/陈仪与外省人被害文献密集文本；现代政论、党派/族群/国族/政府机关/报告书、人物攻防、政治口号不收；只取句子本体可独立检索的古典成句、俗谚、民间诗文、外文格言和少量非政治诗文。";

function autoSummary(quoteText, category) {
  return `李敖在本章使用或引录「${quoteText}」，保存可独立检索的${category}。`;
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
    summary: summary || autoSummary(quoteText, category),
    notes: [scopeNote, extraNotes].filter(Boolean).join(" "),
  };
}

function qa(selector, lineStart, quoteText, category, sourceOrOrigin, summary, lineEnd = lineStart, extraNotes = "") {
  return q(selector, lineStart, quoteText, category, sourceOrOrigin, summary, lineEnd, ["校对轮补入。", extraNotes].filter(Boolean).join(" "));
}

const rawRows = [
  q("001.", 9, "以德报怨", "中文成语", "传统成语", "李敖引录报载说法中的以德报怨，保存成语本体；同段政治判断不收。"),
  q("001.", 29, "以人废言", "中文成语", "传统成语", "李敖使用以人废言，说明不因说话者身份而废弃其言，保存成语本体。"),
  q("001.", 33, "瞒天过海", "中文成语", "传统成语", "李敖使用瞒天过海，写隐瞒材料、掩盖事实的做法，保存成语本体。"),
  q("001.", 35, "欲盖弥彰", "中文成语", "传统成语", "李敖使用欲盖弥彰，写越遮掩越显露的效果，保存成语本体。"),

  q("002.", 7, "口口声声", "中文成语", "传统成语", "李敖使用口口声声，形容反复声称某种立场，保存成语本体。"),

  q("003.", 7, "天方夜谭", "中文成语", "传统成语", "李敖使用天方夜谭，形容说法荒诞不可信，保存成语本体。"),
  q("003.", 7, "特立独行", "中文成语", "传统成语", "李敖以特立独行自指历史家的独立姿态，保存成语本体。"),
  q("003.", 7, "头疼医头、脚疼医脚", "中文俗语", "中文俗语", "李敖使用头疼医头、脚疼医脚，形容只作局部补救而不治根本。"),
  q("003.", 9, "顺水人情", "中文成语", "传统成语", "李敖使用顺水人情，形容顺势接受送上门的便利，保存成语本体。"),
  q("003.", 15, "旁征博引", "中文成语", "传统成语", "李敖说明编书方法时使用旁征博引，保存成语本体。"),
  q("003.", 15, "巨细不遗", "中文成语", "传统成语", "李敖说明编书方法时使用巨细不遗，保存成语本体。"),
  qa("003.", 15, "毛骨悚然", "中文成语", "传统成语", "李敖在材料说明中使用毛骨悚然，形容读来惊惧。"),
  qa("003.", 15, "心惊肉跳", "中文成语", "传统成语", "李敖在材料说明中使用心惊肉跳，形容读来惊惧不安。"),
  qa("003.", 15, "众说纷陈", "中文成语", "传统成语", "李敖使用众说纷陈，形容多种材料和说法并列呈现。"),
  q("003.", 15, "慎思明辨", "儒家成语", "《礼记·中庸》相关成句", "李敖使用慎思明辨，强调细思并辨明材料取舍，保存儒家成句。"),
  q("003.", 15, "知所去取", "中文成语", "传统成语", "李敖使用知所去取，说明读者应懂得取舍判断，保存成语本体。"),
  q("003.", 15, "眼观四面", "中文俗语", "中文俗语", "李敖使用眼观四面，形容观察材料时不偏一隅，保存俗语本体。"),
  q("003.", 15, "无征不信", "古典成语", "古典史学/经学成句", "李敖使用无征不信，强调没有证据便不轻信，保存古典成句。"),
  qa("003.", 15, "金针度人", "中文成语", "传统成语", "李敖用金针度人写把方法与要领传给读者。"),

  q("004.", 3, "不入于杨、则入于墨", "孟子成句", "《孟子》相关成句", "李敖引不入于杨、则入于墨，写非此即彼的偏执状态。"),
  q("004.", 9, "断烂朝报", "中文成语", "古代文献成语", "李敖使用断烂朝报，形容材料零碎残缺、难成完整判断。"),

  q("005.", 17, "不识大体", "中文成语", "传统成语", "李敖使用不识大体，形容只看局部而不明全局。"),
  q("005.", 17, "天下之恶皆归之", "古典化成句", "传统文言句式", "李敖引天下之恶皆归之一语，形容把所有罪恶都归到一人身上。"),

  q("006.", 9, "悬崖勒马", "中文成语", "传统成语", "李敖引录回忆文字中的悬崖勒马，写及时止步。"),
  q("006.", 9, "刀下留人", "中文成语", "传统成语", "李敖引录回忆文字中的刀下留人，写危急时请求饶命。"),
  q("006.", 13, "淋漓尽致", "中文成语", "传统成语", "李敖使用淋漓尽致，形容长处充分发挥。"),
  q("006.", 21, "恩将仇报", "中文成语", "传统成语", "李敖使用恩将仇报，保存可独立检索的成语本体。"),
  q(
    "006.",
    25,
    "事业平生悲剧多，循环历史究如何？痴心爱国浑忘老，爱到痴心即是魔。",
    "近现代诗句",
    "陈仪《无题》",
    "李敖引录陈仪自作诗，写平生悲剧、历史循环与痴心成魔的自述。",
    25,
    "收入诗句本体；不收同段人物功过判断。",
  ),
  q(
    "006.",
    25,
    "治生敢曰太无方，病在偏怜晚节香。廿载服官无息日，一朝罢去便饥荒。",
    "近现代诗句",
    "陈仪《无题》",
    "李敖引录陈仪自作诗，写仕宦多年、离职后生计困窘的自述。",
    25,
    "收入诗句本体；不收同段人物功过判断。",
  ),

  q("007.", 11, "莫名其妙", "中文成语", "传统成语", "李敖使用莫名其妙，形容事情荒唐难解，保存成语本体。"),

  q("010.", 5, "比邻若天涯", "中文成语", "传统成语", "李敖使用比邻若天涯，写近在邻里却相隔如远方。"),
  q("010.", 41, "凤毛麟角", "中文成语", "传统成语", "李敖使用凤毛麟角，形容极少见、极珍贵。"),
  q("010.", 87, "不择手段", "中文成语", "传统成语", "李敖引录来文中的不择手段，保存成语本体。"),
  q("010.", 95, "高高在上", "中文成语", "传统成语", "李敖引录来文中的高高在上，形容居高临下的姿态。"),

  q("011.", 3, "大惊小怪", "中文成语", "传统成语", "李敖使用大惊小怪，写对某事过分惊异，保存成语本体。"),

  qa("012.", 9, "望洋兴叹", "庄子成语", "《庄子》相关成语", "李敖使用望洋兴叹，形容面对巨大资源或局面只能感叹无力。"),
  qa("012.", 9, "得不偿失", "中文成语", "传统成语", "李敖使用得不偿失，说明所得不足以抵偿损失。"),
  qa("012.", 11, "丰衣足食", "中文成语", "传统成语", "李敖使用丰衣足食，形容生活富足。"),
  qa("012.", 11, "衣锦还乡", "中文成语", "传统成语", "李敖使用衣锦还乡，形容富贵后回到故乡。"),
  qa("012.", 11, "心满意足", "中文成语", "传统成语", "李敖使用心满意足，形容愿望满足后的状态。"),
  qa("012.", 13, "以讹传讹", "中文成语", "传统成语", "李敖引录来文中的以讹传讹，写错误说法经传播而扩大。"),
  q("012.", 19, "远水救不了近火", "中文俗语", "中文俗语", "李敖用远水救不了近火说明远处资源难解近前急需。"),
  q("012.", 19, "一钱难倒英雄汉", "中文俗语", "中文俗语", "李敖引中国俗话一钱难倒英雄汉，说明现金在困局中的关键。"),
  q("012.", 19, "忠友有三，老婆、老狗、与现金。", "外文格言译句", "美国俗话", "李敖引美国俗话的中文译句，说明可靠朋友与现金的重要。"),
  q(
    "012.",
    19,
    "There are three faithful friends-an old wife, an old dog, and ready money.",
    "英文格言",
    "American proverb",
    "李敖引美国俗话英文原句，说明乱世与困局中现金的现实价值。",
  ),
  q("012.", 19, "一匹马！一匹马！我以江山换一匹马！", "莎士比亚译句", "莎士比亚《理查三世》", "李敖引莎士比亚名句译文，写兵败逃亡时一匹马可抵江山。"),
  q(
    "012.",
    19,
    "A horse! a horse! my kingdom for a horse!",
    "英文戏剧名句",
    "Shakespeare, Richard III",
    "李敖引莎士比亚《理查三世》英文名句，保存外文原句。",
  ),
  q("012.", 25, "其言也善", "论语成句", "《论语·泰伯》相关成句", "李敖化用其言也善，说明人将老或将死时言语可取。"),

  q("014.", 5, "还吾头来", "三国故事成句", "《三国演义》关公故事", "李敖以关公还吾头来故事作喻，保存故事成句本体。"),
  q("014.", 5, "如长江大河", "中文成语", "传统比喻", "李敖使用如长江大河，形容学问浩大奔放。"),

  q("016.", 7, "虚与委蛇", "庄子成语", "《庄子》相关成语", "李敖引录史料中的虚与委蛇，写表面敷衍周旋。"),

  q("018.", 9, "历历笔上", "中文成语", "传统成语", "李敖使用历历笔上，写狱中生活细节在信中清楚呈现。"),
  q("018.", 9, "跃然纸上", "中文成语", "传统成语", "李敖使用跃然纸上，写人物处境和神态在文字中鲜明呈现。"),

  q("019.", 7, "偷天换日", "中文成语", "传统成语", "李敖使用偷天换日，形容暗中替换真相或概念。"),
  q("019.", 29, "实事求是", "中文成语", "传统治学成语", "李敖使用实事求是，强调按事实求得判断。"),

  q("020.", 3, "不甘寂寞", "中文成语", "传统成语", "李敖使用不甘寂寞，形容不愿沉默、想有所动作。"),

  q("021.", 5, "身首分裂", "后汉书成语", "《后汉书》相关成语", "李敖列举身首分裂，说明中国成语中身体与头颅分离的说法。"),
  q("021.", 5, "身首分离", "新序成语", "《新序》相关成语", "李敖列举身首分离，说明中国成语中身体与头颅分离的说法。"),
  q("021.", 5, "身首异处", "中文成语", "传统成语", "李敖说明最通用的说法是身首异处，保存成语本体。"),
  q("021.", 11, "还我头来！", "三国故事成句", "《三国演义》关公故事", "李敖引《三国演义》中关公英魂呼喊还我头来，保存故事成句。"),
  q("021.", 11, "云长安在？", "三国故事成句", "《三国演义》关公故事", "李敖引《三国演义》中普净点化关公的一问，保存故事成句。"),
  q(
    "021.",
    11,
    "昔非今是，一切休论；后果前因，彼此不爽。今将军为吕蒙所害，大呼还我头来，然则颜良、文丑、五关六将等众人之头，又将向谁索耶？",
    "三国演义引文",
    "《三国演义》普净点化关公语",
    "李敖引《三国演义》普净点化关公的一段话，保存其因果报应式的警句。",
    11,
    "引文属古典小说语境；不收同段对现实政治人群的评议。",
  ),
  qa("021.", 11, "恍然大悟", "中文成语", "传统成语", "李敖引《三国演义》语境中的恍然大悟，写忽然明白。"),
  qa("021.", 11, "一干二净", "中文成语", "传统成语", "李敖使用一干二净，形容忘得干净彻底。"),
  qa("021.", 17, "目光如豆", "中文成语", "传统成语", "李敖使用目光如豆，形容眼光短浅。"),
  qa("021.", 17, "一厢情愿", "中文成语", "传统成语", "李敖使用一厢情愿，形容只按自己愿望想事。"),
  qa("021.", 17, "自以为是", "中文成语", "传统成语", "李敖使用自以为是，形容自认正确而不察。"),
  q("021.", 25, "知过能改", "中文成语", "传统成语", "李敖使用知过能改，写明白错误后能够改正。"),

  q("022.", 3, "断章取义", "中文成语", "传统成语", "李敖使用断章取义，形容截取片段而曲解整体。"),
  q("022.", 21, "仁民爱物", "孟子成语", "《孟子》相关成语", "李敖使用仁民爱物，保存儒家成语本体。"),
  q("022.", 21, "仁义道德", "中文成语", "儒家伦理成语", "李敖使用仁义道德，保存伦理成语本体。"),

  qa("025.", 59, "画蛇添足", "中文成语", "传统成语", "李敖使用画蛇添足，形容多此一举反坏其事。"),
  qa("025.", 59, "自作聪明", "中文成语", "传统成语", "李敖使用自作聪明，形容自以为聪明而弄巧。"),

  q("026.", 19, "充耳不闻", "诗经成语", "《诗经》相关成语", "李敖使用充耳不闻，写对周遭声音不加理会。"),
  qa("026.", 19, "叱咤风云", "中文成语", "传统成语", "李敖使用叱咤风云，形容气势和影响力很大。"),
  q("026.", 19, "敢作敢当", "中文成语", "传统成语", "李敖使用敢作敢当，形容有担当、敢承担后果。"),
  q("026.", 19, "舍生取义", "孟子成语", "《孟子》相关成语", "李敖使用舍生取义，保存古典成语本体。"),
  q("026.", 19, "视死如归", "中文成语", "传统成语", "李敖使用视死如归，形容把死亡看得如归去一般。"),
  q("026.", 21, "佩虎符、坐皋比", "古典文句", "古典军事/讲席意象", "李敖用佩虎符、坐皋比写将军声势，保存古典化文句。"),
  q("026.", 21, "求仁得仁", "论语成语", "《论语》相关成语", "李敖使用求仁得仁，写所追求者最终得其所愿。"),
  q("026.", 23, "杀身成仁", "论语成语", "《论语》相关成语", "李敖使用杀身成仁，保存儒家成语本体。"),
  q("026.", 23, "其犹龙乎？", "古典引文", "《史记·老子韩非列传》相关引文", "李敖引孔子惊讶老子其犹龙乎一语，保存古典引文。"),
  q("026.", 23, "独行其是", "中文成语", "传统成语", "李敖使用独行其是，形容按自己的判断行事。"),
  q("026.", 23, "之死靡它", "诗经成语", "《诗经》相关成语", "李敖使用之死靡它，写至死不改其志。"),
  q("026.", 23, "肝脑涂地", "史记成语", "《史记》相关成语", "李敖使用肝脑涂地，写不惜牺牲。"),
  q("026.", 23, "强项不屈", "后汉书成语", "《后汉书》相关成语", "李敖使用强项不屈，写刚直不屈。"),
  q("026.", 23, "气象万千", "中文成语", "传统成语", "李敖使用气象万千，形容气象丰富宏大。"),
  qa("026.", 23, "风生水起", "中文成语", "传统成语", "李敖使用风生水起，形容气象活泼兴盛。"),

  q("027.", 21, "障百川而东之，挽狂澜于既倒", "韩愈文句", "韩愈《进学解》相关成句", "李敖化用韩愈文句，写导正众流、力挽倾倒狂澜。"),
  q("027.", 25, "适可而止", "中文成语", "传统成语", "李敖使用适可而止，说明行动应知分寸。"),
  q("027.", 27, "知其所止", "儒家成句", "《大学》相关成句", "李敖使用知其所止，说明行动应知止境。"),
  q("027.", 27, "墓草久宿", "古典成语", "古典成语", "李敖使用墓草久宿，写事过多年、人物已逝的时间感。"),

  q("028.", 5, "助纣为虐", "中文成语", "传统成语", "李敖使用助纣为虐，保存可独立检索的成语本体。"),
  qa("028.", 7, "语焉不详", "中文成语", "传统成语", "李敖使用语焉不详，形容说得不清楚、不充分。"),
  qa("028.", 15, "理直气壮", "中文成语", "传统成语", "李敖引林今开文章中的理直气壮，写理由充分时的口气。"),
  q(
    "028.",
    19,
    "从今以后，千万别管闲事，我们走我们的路，驴子吃人家的稻子，你要听话，叔叔才会常常带你到乡下来玩。",
    "寓言式训诫",
    "林今开《新闻记者与黑驴子》",
    "李敖引林今开文章中的叔叔训诫，保存别管闲事、各走各路的寓言式口吻。",
    19,
    "收入寓言式训诫本体；不收同篇现实政治类比。",
  ),

  q("029.", 9, "虎而翼之", "韩非子成语", "《韩非子》相关成语", "李敖使用虎而翼之，形容恶势力更添助力。"),
  q("029.", 145, "灰头土脸", "中文成语", "传统成语", "李敖使用灰头土脸，形容狼狈失面子。"),

  q("030.", 15, "涕泗横流", "中文成语", "传统成语", "李敖使用涕泗横流，形容痛哭流涕。"),
  q(
    "030.",
    23,
    "夫贤士之处世也，譬若锥之处囊中，其末立见。",
    "史记引文",
    "《史记·平原君虞卿列传》相关引文",
    "李敖引古书锥处囊中的话，说明贤士终会显露。",
  ),
  q("030.", 23, "脱颖而出", "史记成语", "《史记》相关成语", "李敖使用脱颖而出，说明才能自然显露。"),
  q("030.", 27, "种豆得豆", "中文俗语", "中文俗语", "李敖使用种豆得豆，形容行动得到相应结果。"),
  qa("030.", 29, "平心静气", "中文成语", "传统成语", "李敖使用平心静气，形容冷静平和地思考。"),
  q("030.", 31, "虽千万人吾往矣", "孟子成句", "《孟子》相关成句", "李敖引虽千万人吾往矣，写勇于坚持所当为之事。"),
  qa("030.", 31, "哗众取宠", "中文成语", "传统成语", "李敖使用哗众取宠，形容用浮夸言行迎合众人。"),
  qa("030.", 31, "恃宠而骄", "中文成语", "传统成语", "李敖使用恃宠而骄，形容倚仗受宠而骄纵。"),
  q("030.", 35, "为虎作伥", "中文成语", "传统成语", "李敖引录报告中的为虎作伥，保存成语本体。"),

  q("031.", 9, "为所欲为", "中文成语", "传统成语", "李敖使用为所欲为，形容表面上似乎可以随心行事。"),
  q("031.", 9, "阳奉阴违", "中文成语", "传统成语", "李敖使用阳奉阴违，写表面服从而暗中违背。"),
  q("031.", 11, "牵强附会", "中文成语", "传统成语", "李敖使用牵强附会，形容勉强拉合解释。"),
  q("031.", 21, "独善其身", "孟子成语", "《孟子》相关成语", "李敖使用独善其身，保存儒家成语本体。"),

  q("032.", 13, "不失其赤子之心", "孟子成句", "《孟子》相关成句", "李敖引录文章中不失其赤子之心，保存儒家成句。"),
  q("032.", 17, "世界上无论什么地方都有好人，也有坏人。", "现代格言", "《正气月刊》引文", "李敖引录文章中人人承认的公道话，句子本体为泛化格言。"),
  q("032.", 41, "不明不白", "中文成语", "传统成语", "李敖引录文章中的不明不白，写死者无人明了情由。"),
  q("032.", 57, "死灰复燃", "中文成语", "传统成语", "李敖引录文章中的死灰复燃，保存成语本体。"),
  q("032.", 71, "任劳任怨", "中文成语", "传统成语", "李敖引录文章中的任劳任怨，形容能承受劳苦与怨言。"),
  q("032.", 119, "间不容发", "中文成语", "传统成语", "李敖引录文章中的间不容发，形容情势极其危急。"),
  q("032.", 135, "呆若木鸡", "庄子成语", "《庄子》相关成语", "李敖引录文章中的呆若木鸡，形容众人一时发愣。"),
];

const omittedBoundaryExamples = [
  {
    source_file: sourceFile("001."),
    line_start: 31,
    quote_text: "有关二二八事件的资料，行政院目前找不到任何有关文件，政府所有的资料也很少",
    reason: "现代政府声明与事件资料攻防，属于政治语录，不收。",
  },
  {
    source_file: sourceFile("007."),
    line_start: 5,
    quote_text: "公开道歉，当然不是要你再召开一个记者会用河洛语北京语客家语各说一声对不起……",
    reason: "二二八道歉诉求与现实政治请愿文字，不收。",
  },
  {
    source_file: sourceFile("020."),
    line_start: 13,
    quote_text: "李登辉或国民党的现任党主席应向二二八受难者家属正式道歉。",
    reason: "现实政治人物/政党道歉主张，不收。",
  },
  {
    source_file: sourceFile("032."),
    line_start: 19,
    quote_text: "发挥同胞爱，消除仇恨心",
    reason: "事件后社会动员口号，虽有格言外形但政治情境过强，不收。",
  },
];

const modernPoliticalTerms = [
  "二二八",
  "国民党",
  "共产党",
  "民进党",
  "台湾人",
  "外省人",
  "本省人",
  "日本人",
  "中国人",
  "政府",
  "总统",
  "行政院",
  "国军",
  "军队",
  "事件",
  "事变",
  "平息",
  "暴民",
  "暴动",
  "镇压",
  "屠杀",
  "通缉",
  "密件",
  "报告",
  "调查",
  "赔偿",
  "道歉",
  "选举",
  "民主",
  "独裁",
  "革命",
  "政治",
  "国家",
  "民族",
  "同胞",
  "国族",
  "国殇",
  "国庆",
  "国难",
  "亡国奴",
  "陈仪",
  "蒋介石",
  "蒋经国",
  "李登辉",
  "彭孟缉",
  "白崇禧",
  "侯素心",
  "俞国华",
];

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function rowToCsv(row) {
  return columns.map((column) => csvEscape(row[column])).join(",");
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

const selectedRows = rawRows
  .slice()
  .sort(rowCompare)
  .map((row, index) => ({
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
        if (column === "decision") return row.notes.includes("校对轮补入") ? "add-proofread" : "keep-proofread";
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
  selectedRows: selectedRows.length,
  proofreadAddedRows: selectedRows
    .filter((row) => row.notes.includes("校对轮补入"))
    .map((row) => ({
      id: row.id,
      quote_text: row.quote_text,
      source_file: row.source_file,
      line_start: row.line_start,
      category: row.category,
    })),
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

console.log(
  JSON.stringify(
    {
      book,
      sourceFiles: files.length,
      selectedRows: selectedRows.length,
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
