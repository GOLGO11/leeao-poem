const fs = require("fs");
const path = require("path");

const book = "蒋家臭史";
const idPrefix = "LAJJCS";
const generatedDate = "2026-06-28";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "026.蒋家臭史");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_chiang_family_ugly_history_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_chiang_family_ugly_history_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_chiang_family_ugly_history_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_chiang_family_ugly_history_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_chiang_family_ugly_history_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_chiang_family_ugly_history_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_chiang_family_ugly_history_proofread_report.txt");
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

function q(selector, lineStart, quoteText, category, attributedTo, summary = "", lineEnd = lineStart, extraNotes = "") {
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
    summary: summary || `李敖引用、摘录或化用“${quoteText}”。`,
    notes: [
      "保守收入：《蒋家臭史》以蒋宋家族、蒋经国、蒋纬国、蒋家后人、国民党党国叙事、反共/革命口号、赣南战事、台湾政治和家族接班为主体；现代党派、政权、领袖、总统、军政、战争、革命、国家民族、外交、统独、宪政、人权、意识形态、政治犯、暗杀、接班与反蒋/拥蒋语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、礼制文句、墓志挽联、成语、俗语、题联、文学引文、家族文书和非政治格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q("001.", 3, "似是而非", "成语", "中文成语", "李敖摘出似是而非一语，表示表面像对而实质不对。", 3, "只收成语本体；不收蒋宋美龄公开信、马列和三面红旗等现代政治语境。"),
  q("002.", 21, "红颜未嫁身先丧，长使鳏夫泪满襟", "诗句化成句", "白丁《刘纪文小史》相关文字", "李敖引白丁写刘纪文未婚妻早逝的诗句化成句。"),
  q("002.", 21, "爱屋及乌", "成语", "中文成语", "李敖引爱屋及乌，说明因爱惜亡女而更看重刘纪文。"),
  q("002.", 25, "请于湘丈，得以越礼侍奉者数夕", "墓志铭警句", "刘纪文亡妻墓志铭", "李敖摘录刘纪文亡妻墓志铭中的香艳警句。"),
  q("002.", 35, "满坑满谷", "成语", "中文成语", "李敖用满坑满谷形容广州大小要人极多。"),
  q("002.", 35, "粥少僧多", "成语", "中文成语", "李敖用粥少僧多形容职位有限而求位者众。"),
  q("002.", 37, "国步尚多艰，公不少留，太息前途演荆棘", "挽联", "刘纪文挽古应芬联", "李敖摘录刘纪文挽古应芬联的上联。", 37, "只收挽联本体；不收刘纪文、古应芬官场关系语境。"),
  q("002.", 37, "泰山今失望，吾将安仰？恪遵遗训慎行藏", "挽联", "刘纪文挽古应芬联", "李敖摘录刘纪文挽古应芬联的下联。", 37, "只收挽联本体；不收刘纪文、古应芬官场关系语境。"),
  q("002.", 49, "横刀夺爱", "成语", "中文成语", "李敖用横刀夺爱形容强行夺去他人所爱。"),
  q("002.", 49, "事半功倍", "成语", "中文成语", "李敖摘出呈文中的事半功倍成语。"),
  q("002.", 49, "驾轻就熟", "成语", "中文成语", "李敖摘出呈文中的驾轻就熟成语。"),
  q("005.", 27, "明察秋毫", "成语", "中文成语", "李敖引陈布雷劝语中的明察秋毫。"),
  q("005.", 27, "言不由衷", "成语", "中文成语", "李敖引陈布雷劝语中的言不由衷。"),
  q("006.", 21, "单刀直入", "成语", "中文成语", "李敖引蒋廷黻回忆中的单刀直入。"),
  q("006.", 67, "天渊之别", "成语", "中文成语", "李敖引蒋经国回忆中的天渊之别。"),
  q("006.", 81, "口口声声", "成语", "中文成语", "李敖用口口声声形容蒋经国反复自称人质。"),
  q("006.", 83, "情词恳切", "成语", "中文成语", "李敖引江南书中形容书信情辞恳切。"),
  q("006.", 83, "踌躇再三", "成语", "中文成语", "李敖引江南书中踌躇再三一语。"),
  q("007.", 11, "先天下之跑而跑", "谐拟成句", "范仲淹名句谐拟", "李敖引张泽生来信中的谐拟句，讽刺先跑。", 11, "只收谐拟句本体；不收保卫赣南、抗战和蒋经国逃跑政治语境。"),
  q("007.", 17, "一败千里", "成语", "中文成语", "李敖引回忆文字中的一败千里。"),
  q("007.", 19, "忧心忡忡", "成语", "中文成语", "李敖引旧部听闻返回赣南时忧心忡忡的成语。"),
  q("007.", 31, "胸有成竹", "成语", "中文成语", "李敖用胸有成竹形容预先已有打算。"),
  q("007.", 55, "冠冕堂皇", "成语", "中文成语", "李敖用冠冕堂皇形容手谕文字表面漂亮。"),
  q("007.", 55, "光风霁月", "成语", "中文成语", "李敖用光风霁月形容文字姿态清明漂亮。"),
  q("007.", 57, "言中有言", "成语", "中文成语", "李敖引刘浩回忆中言中有言一语。"),
  q("007.", 65, "慷慨激昂，声泪俱下", "成语合用", "中文成语", "李敖引吴识沧回忆蒋经国讲话时的两个成语连用。", 65, "只收成语合用本体；不收誓与赣州共存亡的政治口号。"),
  q("007.", 67, "兵临城下", "成语", "中文成语", "李敖引兵临城下形容城池即将被攻到。"),
  q("007.", 69, "众口一辞", "成语", "中文成语", "李敖引用众口一辞形容众人意见一致。"),
  q("007.", 77, "无可奈何", "成语", "中文成语", "李敖引无可奈何形容被包围苦劝后的状态。"),
  q("007.", 79, "停锣住鼓", "俗语成语", "中文俗语", "李敖用停锣住鼓形容新赣南建设就此收场。"),
  q("007.", 83, "破釜沉舟", "成语典故", "项羽典故", "李敖引胡越一回忆中的破釜沉舟。"),
  q("007.", 83, "溜之大吉", "成语", "中文成语", "李敖引胡越一回忆中溜之大吉一语。"),
  q("007.", 83, "措手不及", "成语", "中文成语", "李敖引胡越一回忆中措手不及一语。"),
  q("007.", 89, "兵不血刃", "成语", "中文成语", "李敖引刘浩回忆中兵不血刃一语。"),
  q("009.", 5, "显妣章太夫人讳亚若之墓", "墓碑文句", "章亚若墓碑刻石", "李敖摘录章氏兄弟为母修坟时的墓碑文句。"),
  q("010.", 3, "亡弟瑞青，讳周传，年四岁而夭，母哀之甚，欲勿殇命，以周泰长子经国嗣", "家族哀状文句", "蒋介石《亡弟瑞青哀状》", "李敖摘录《亡弟瑞青哀状》中为亡弟立嗣的文句。"),
  q("010.", 3, "不忍重违母命，以伤骨肉之情，不获已，仍以长子经国嗣之。", "家族哀状文句", "蒋介石《亡弟瑞青哀状》", "李敖摘录《亡弟瑞青哀状》中不忍违母命的文句。"),
  q("010.", 3, "世世子孙，读斯文者，知吾母与吾今日哀其子若弟之苦心，庶奉吾弟祭祀，永永弗替。", "家族哀状文句", "蒋介石《亡弟瑞青哀状》", "李敖摘录《亡弟瑞青哀状》中嘱后世奉祀的文句。"),
  q("010.", 7, "油尽灯枯", "成语", "中文成语", "李敖引蒋复璁纪念文字中的油尽灯枯。"),
  q("010.", 9, "为贤者讳、为尊者讳、为亲者讳", "传统讳法成句", "传统史笔讳法", "李敖用为贤者讳、为尊者讳、为亲者讳概括替尊长避讳的说法。"),
  q("011.", 3, "你看像几岁，就几岁。", "机智口语", "李敖母亲语", "李敖引母亲回答年龄问题的幽默口语。"),
  q("011.", 3, "你看像谁儿子，就是谁儿子", "机智口语", "李敖谐拟语", "李敖仿母亲口吻写出判断父子的机智口语。"),
  q("011.", 9, "放荡不羁", "成语", "中文成语", "李敖引丁文渊回忆中的放荡不羁。"),
  q("011.", 11, "男女问题，是生死关头！", "格言式口语", "戴传贤语", "李敖引戴传贤谈男女问题是生死关头的口语格言。", 11, "只收男女问题格言；不收党国元老身份语境。"),
  q("011.", 11, "认假作真", "成语", "中文成语", "李敖引戴传贤语中的认假作真。"),
  q("013.", 9, "初试云雨情", "文学成句", "中文艳情成句", "李敖用初试云雨情形容男女初次云雨。"),
  q("014.", 5, "有其父必有其子", "成句", "传统父子成句", "李敖用有其父必有其子比喻父子相似。"),
  q("014.", 5, "唯斯人而有斯疾", "文言成句", "文言化用", "李敖用唯斯人而有斯疾表示此人正有此病。"),
  q("014.", 15, "皇天不负苦心人", "俗语", "中文俗语", "李敖引传记中的皇天不负苦心人。"),
  q("016.", 1, "上穷碧落下黄泉", "唐诗名句化用", "白居易《长恨歌》", "标题化用上穷碧落下黄泉，用来写寻访追索。"),
  q("016.", 3, "青出于蓝", "成语", "《荀子》相关成语", "李敖用青出于蓝形容后人超过前人。"),
  q("016.", 3, "含辛茹苦", "成语", "中文成语", "李敖用含辛茹苦形容受害母子长期艰难成全。"),
  q("016.", 27, "荣华富贵于我如浮云", "论语化句", "《论语·述而》富贵于我如浮云", "程英嘉信中化用富贵于我如浮云，表示不贪富贵。"),
  q("016.", 27, "人生五味，全都尝过，复有何求？", "人生感慨成句", "程英嘉信", "李敖摘录程英嘉信中历尽人生五味、别无所求的感慨。"),
  q("016.", 43, "受人之托忠人之事", "俗语", "中文俗语", "许以祺信中用受人之托忠人之事表示受托便尽力。"),
  q("016.", 45, "如数家珍", "成语", "中文成语", "李敖引许以祺信中如数家珍一语。"),
  q("018.", 9, "始终如一", "成语", "中文成语", "李敖引施利聆回忆中始终如一一语。"),
  q("018.", 9, "今非昔比", "成语", "中文成语", "李敖引施利聆回忆中今非昔比一语。"),
  q("018.", 9, "先礼后兵", "成语", "中文成语", "李敖引施利聆回忆中先礼后兵一语。"),
  q("019.", 3, "何处是儿家？", "片名成句", "电影片名", "李敖由旧电影片名何处是儿家引出蒋纬国家世问题。"),
  q("019.", 37, "大道之行也，天下为公，选贤与能，讲信修睦。故人不独亲其亲、不独子其子，使老有所终，壮有所用，幼有所长，矜寡孤独废疾者皆有所养，男有分，女有归。货恶其弃于地也，不必藏于己；力恶其不出于身也，不必为己。是故谋闭而不兴，盗窃乱贼而不作，故外户而不闭，是谓大同。", "礼记名篇", "《礼记·礼运》", "李敖摘录《礼记·礼运》大同篇的经典文句。", 37, "只收《礼记》古典文本本体；不收三民主义、国父思想、天下为公政治论证语境。"),
  q("019.", 47, "瞒天过海", "成语", "中文成语", "李敖用瞒天过海形容把来源推给戴传贤的做法。"),
  q("019.", 51, "乱七八糟", "成语", "中文成语", "李敖用乱七八糟形容相关思想混乱。"),
  q("020.", 13, "居无何，条侯子为父买工官尚方，甲楣五百被可以葬者。取庸苦之，不予钱。庸知其盗买县官器，怒而上变告子，事连汙条侯。书既闻上，上下吏。吏簿责条侯，条侯不对。景帝骂之曰：‘吾不用也！’召诣廷尉。廷尉责曰：‘君侯欲反邪？’亚夫曰：‘臣所买器，乃葬器也，何谓反邪？’吏曰：‘君侯纵不反地上，即欲反地下耳！’吏侵之益急。初，吏捕条侯，条侯欲自杀，夫人止之，以故不得死，遂入廷尉。因不食五日，呕血而死。国除。", "史记文句", "《史记·绛侯周勃世家》", "李敖引用《史记·绛侯周勃世家》周亚夫因葬器被牵连下狱的故事。", 13, "只收古史文本本体；不收蒋纬国私藏军火和现代政党攻防语境。"),
  q("020.", 15, "兔死狗烹", "成语典故", "范蠡、韩信相关成语", "李敖用兔死狗烹形容功臣被统治者弃杀。"),
  q("021.", 3, "上（汉武帝）尝辇至郎署，见一老，髭须皓白，衣服不完。上曰：‘公何时为郎？何其老矣！’对曰：‘臣姓颜名驷，江都人也，文帝时为郎。’上曰：‘何不遇也？’驷曰：‘文帝好文，臣好武；景帝好老，臣又少；陛下好少，臣又老。是以三世不遇。’上感其言，拜为会稽都尉。", "古代故事", "《汉武故事》", "李敖引用《汉武故事》颜驷三世不遇的君臣问答。", 3, "只收古代故事文本本体；不收蒋家三代压人和现代接班语境。"),
  q("021.", 5, "三世不遇", "成语典故", "《汉武故事》颜驷典故", "李敖引三世不遇概括颜驷历文帝、景帝、武帝三朝不得志。"),
  q("021.", 7, "与子偕老", "诗经名句", "《诗经·邶风·击鼓》", "李敖化用与子偕老，写压人者与被压者一代偕老。"),
  q("021.", 7, "适逢其会", "成语", "中文成语", "李敖用适逢其会说明颜驷恰遇三代相压。"),
  q("021.", 9, "差可比拟", "成语", "中文成语", "李敖用差可比拟表示勉强可以相比。"),
  q("021.", 9, "适可而止", "成语", "中文成语", "李敖用适可而止形容西太后的压人没有由亲生骨肉接力。"),
  q("021.", 11, "花花太岁", "俗语成语", "中文俗语", "李敖用花花太岁形容荒唐纨绔子弟。"),
  q("021.", 11, "久压公等，但恨不见替人！", "古人戏语", "杜审言临终戏语", "李敖引杜审言临终戏语，写久压他人而遗憾没有接替者。"),
  q("021.", 11, "此天之亡我，非战之罪也！", "史记名句化用", "项羽语，见《史记·项羽本纪》", "李敖化用项羽此天亡我非战之罪的名句。"),
  q("021.", 13, "砥柱中流", "成语", "中文成语", "李敖用砥柱中流形容自己仍然健在。"),
  q("022.", 7, "灰飞烟灭", "成语", "中文成语", "李敖用灰飞烟灭形容家天下思想消散。"),
  q("022.", 9, "昔者五帝地方千里，其外侯服夷服诸侯或朝或否，天子不能制。今陛下兴义兵、诛残贼、平定天下、海内为郡县、法令由一统，自上古以来未尝有、五帝所不及。臣等谨与博士议曰：‘古有天皇、有地皇、有泰皇、泰皇最贵。’臣等昧死上尊号，王为‘泰皇’、命为‘制’、令为‘诏’、天子自称曰‘朕’。", "史记文句", "《史记·秦始皇本纪》", "李敖引用《史记·秦始皇本纪》李斯等议尊号的文句。", 9, "只收古史文句本体；不收现代终身总统和家族接班语境。"),
  q("022.", 9, "去‘泰’，著‘皇’，采上古‘帝’位号，号曰‘皇帝’。他如议。……朕闻太古有号毋谥，中古有号，死而以行为谥。如此，则子议父、臣议君也，甚无谓，朕弗取焉。自今已来，除谥法。朕为始皇帝。后世以计数，二世、三世、至于万世，传之无穷。", "史记文句", "《史记·秦始皇本纪》", "李敖引用《史记·秦始皇本纪》中秦始皇定皇帝号和废谥法的文句。", 9, "只收古史文句本体；不收现代终身总统和家族接班语境。"),
  q("022.", 11, "后世以计数，二世、三世、至于万世，传之无穷", "史记名句", "《史记·秦始皇本纪》", "李敖反复摘出秦始皇所谓后世计数、传之无穷的句子。", 11, "只收古史名句本体；不收现代家族权力接班语境。"),
  q("022.", 13, "史例斑斑", "成语化成句", "中文成句", "李敖用史例斑斑形容历史例证清楚众多。"),
  q("022.", 13, "应运而生", "成语", "中文成语", "李敖用应运而生形容新封建之徒应时出现。"),
  q("022.", 29, "九五之位", "成语典故", "《易经》九五典故", "李敖用九五之位指最高权位。"),
  q("022.", 29, "七上八下", "成语", "中文成语", "李敖用七上八下形容局面被搅乱。"),
  q("022.", 29, "后之览者，亦将有感于斯‘文’", "兰亭集序化句", "王羲之《兰亭集序》", "李敖化用《兰亭集序》后之览者亦将有感于斯文。"),
  q("025.", 19, "司马昭之心，路人皆知", "成语典故", "司马昭典故", "李敖用司马昭之心路人皆知形容用心明显。"),
  q("026.", 3, "邪魔歪道", "成语", "中文成语", "李敖用邪魔歪道形容佛寺怪异不正。"),
  q("026.", 3, "不伦不类", "成语", "中文成语", "李敖用不伦不类形容法师装束混杂。"),
  q("026.", 3, "莫名其妙", "成语", "中文成语", "李敖用莫名其妙形容性海法师造型怪异。"),
  q("026.", 9, "法力无边", "佛教俗语", "中文佛教俗语", "李敖用法力无边反讽佛门法事。"),
  q("026.", 35, "三千弱水取一瓢", "俗语典故", "弱水三千典故", "李敖在一字韵诗中化用三千弱水取一瓢。"),
  q("027.", 7, "奇货可居", "成语典故", "吕不韦典故", "李敖列举吕不韦奇货可居的历史典故。"),
  q("027.", 7, "顺水人情", "成语", "中文成语", "李敖列举杨贵妃顺水人情的历史典故。"),
  q("027.", 7, "美人如玉剑如虹", "诗句", "清代龚自珍诗句", "李敖引用美人如玉剑如虹来概括美人与权力纠葛。"),
  q("027.", 9, "脱颖而出", "成语", "毛遂自荐相关成语", "李敖用脱颖而出形容章氏兄弟崭露头角。"),
  q("027.", 11, "鼻青眼肿", "俗语成语", "中文俗语", "李敖用鼻青眼肿形容君子涉入实际政治后的下场。"),
  q("027.", 11, "身败名裂", "成语", "中文成语", "李敖用身败名裂形容袁世凯结局。"),
  q("027.", 11, "光宗耀祖", "成语", "中文成语", "李敖用光宗耀祖形容后人成就显耀门第。"),
  q("027.", 11, "终老学术，才是上智", "劝勉格言", "李敖文句", "李敖以终老学术才是上智劝章孝慈。", 11, "只收非政治人生劝勉本体；不收青年党、国民党和实际政治论述。"),
  q("028.", 3, "事属寻常，本不足异", "文言成句", "彭先生来信", "李敖摘录来信中事属寻常、本不足异的文言成句。"),
  q("028.", 5, "一视同仁", "成语", "中文成语", "李敖用一视同仁表示同等看待婚生子和私生子。"),
  q("028.", 5, "出人头地", "成语", "中文成语", "李敖用出人头地表示私生子也能有成就。"),
  q("028.", 19, "君子爱人以德", "儒家成句", "《礼记·檀弓》相关成句", "李敖用君子爱人以德说明劝人远离官迷。"),
  q("028.", 19, "妇人之仁", "成语", "中文成语", "李敖用妇人之仁批评见识偏小的忠厚。"),
  q("029.", 15, "睁眼谎话", "俗语", "中文俗语", "李敖用睁眼谎话形容明知不实仍公开说谎。"),
  q("029.", 17, "自欺而欺天下人", "格言式成句", "李敖文句", "李敖用自欺而欺天下人概括自欺又欺人的说法。", 17, "只收格言式成句本体；不收蒋经国政治犯谈话。"),
];

const proofreadRemovedQuoteTexts = new Set(
  [
    "似是而非",
    "事半功倍",
    "驾轻就熟",
  ].map(normalizeText),
);

const addNote = "校对轮增补：补收可脱离现代政治攻防独立检索的成语、典故、来信文句或文学化用本体。";

const proofreadAdditions = [
  q("002.", 21, "无福消受", "成语", "中文成语", "李敖引无福消受，写已经取得却没有福分承受。", 21, addNote),
  q("002.", 25, "窃笑之资", "文言成句", "中文成句", "李敖摘出窃笑之资，指足以令人暗笑的材料。", 25, addNote),
  q("002.", 35, "一肚牢骚", "俗语成语", "中文俗语", "李敖用一肚牢骚形容满腹不平无从发泄。", 35, addNote),
  q("002.", 37, "有为而发", "文言成句", "中文成句", "李敖用有为而发说明联语并非泛泛而作。", 37, addNote),
  q("002.", 49, "呼之欲出", "成语", "中文成语", "李敖用呼之欲出形容溢美文字十分明显。", 49, addNote),
  q("003.", 5, "不可胜数", "成语", "中文成语", "李敖用不可胜数形容花费数量极多。", 5, addNote),
  q("004.", 25, "含糊其辞", "成语", "中文成语", "李敖用含糊其辞形容说法暧昧不清。", 25, addNote),
  q("005.", 25, "思之又恨之", "格言式短语", "李敖文句", "李敖用思之又恨之概括又想念又恼恨的复杂心情。", 25, addNote),
  q("005.", 29, "言而由衷", "成语化用", "言不由衷反用", "李敖反用言不由衷，写言语确实出于内心。", 29, addNote),
  q("006.", 21, "推托之词", "文言成句", "中文成句", "李敖引推托之词，表示推脱搪塞的话。", 21, addNote),
  q("006.", 67, "不择手段", "成语", "中文成语", "李敖引不择手段，表示为了目的什么方法都用。", 67, addNote),
  q("006.", 83, "把心一横", "俗语", "中文俗语", "李敖引把心一横，写下定决心不再犹豫。", 83, addNote),
  q("007.", 17, "长驱直入", "成语", "中文成语", "李敖引长驱直入，形容一路深入而无阻挡。", 17, addNote),
  q("007.", 19, "热血沸腾", "成语", "中文成语", "李敖引热血沸腾，写情绪激昂。", 19, addNote),
  q("007.", 23, "无济于事", "成语", "中文成语", "李敖用无济于事形容徒然无助于事。", 23, addNote),
  q("007.", 55, "预留伏笔", "成语化短语", "中文成句", "李敖用预留伏笔形容文字中事先留下后路。", 55, addNote),
  q("007.", 87, "鱼贯登机", "成语化短语", "鱼贯而行化用", "李敖引鱼贯登机，形容一队人依次登机。", 87, addNote),
  q("014.", 25, "神童怕证据", "警句", "李敖文句", "李敖用神童怕证据概括神话经不起查证。", 25, addNote),
  q("016.", 27, "不相知怎相契", "格言式成句", "程英嘉信", "李敖摘录信中不相知怎相契，表示不了解便难以契合。", 27, addNote),
  q("016.", 27, "阅尽沧桑", "成语", "中文成语", "李敖摘录信中阅尽沧桑，表示经历世事变迁。", 27, addNote),
  q("016.", 55, "有生之年", "成语", "中文成语", "李敖用有生之年表示尚在人世的年月。", 55, addNote),
  q("016.", 55, "认子归宗", "宗法成句", "中文成句", "李敖用认子归宗表示承认亲子并归入宗族。", 55, addNote),
  q("019.", 49, "无所遁形", "成语", "中文成语", "李敖用无所遁形形容被彻底看穿而无法隐藏。", 49, addNote),
  q("019.", 51, "认祖归宗", "成语", "中文成语", "李敖用认祖归宗说明承认宗族来源。", 51, addNote),
  q("020.", 19, "有识之士", "成语", "中文成语", "李敖用有识之士指有见识的人。", 19, addNote),
  q("026.", 7, "大慈大悲", "佛教成语", "佛教用语", "李敖摘录佛事场景中的大慈大悲匾额。", 7, addNote),
  q("026.", 7, "法界蒙熏", "佛教文句", "佛教用语", "李敖摘录佛事场景中法界蒙熏的绣字。", 7, addNote),
  q("026.", 13, "妖气横溢", "成语化短语", "李敖文句", "李敖用妖气横溢形容怪异气氛浓重。", 13, addNote),
  q("026.", 13, "不成体统", "成语", "中文成语", "李敖用不成体统形容做法极不成样子。", 13, addNote),
  q("027.", 7, "荧惑女宠", "历史典故", "夏桀、商纣相关典故", "李敖列举荧惑女宠，概括女色惑主的古史典故。", 7, addNote),
  q("027.", 7, "赵氏孤儿", "历史典故", "春秋赵氏孤儿故事", "李敖列举赵氏孤儿作为历史典故。", 7, addNote),
  q("027.", 7, "倒扒一灰", "历史俗典", "唐高宗、武后相关俗典", "李敖列举倒扒一灰作为历史俗典。", 7, addNote),
  q("027.", 7, "昭君出塞", "历史典故", "王昭君典故", "李敖列举昭君出塞作为牵动历史的典故。", 7, addNote),
  q("027.", 7, "香妃入关", "历史典故", "香妃故事", "李敖列举香妃入关作为历史典故。", 7, addNote),
  q("027.", 7, "毋忘在莒", "历史典故", "齐襄公相关典故", "李敖列举毋忘在莒作为历史典故。", 7, addNote),
  q("027.", 7, "井底游魂", "历史典故", "陈后主相关典故", "李敖列举井底游魂作为历史典故。", 7, addNote),
  q("027.", 7, "送子张仙", "民俗典故", "张仙送子故事", "李敖列举送子张仙作为民俗典故。", 7, addNote),
  q("027.", 7, "天地一家春", "园林题名", "圆明园题名", "李敖列举天地一家春作为历史题名。", 7, addNote),
  q("027.", 7, "祸国殃民", "成语", "中文成语", "李敖用祸国殃民形容祸害国家和人民。", 7, addNote),
  q("027.", 7, "层出不穷", "成语", "中文成语", "李敖用层出不穷形容例证连续出现。", 7, addNote),
  q("028.", 3, "捷才健笔", "成语化短语", "彭先生来信", "李敖摘录来信中捷才健笔，赞其才思和笔力。", 3, addNote),
  q("028.", 17, "盛德之累", "文言成句", "中文成句", "李敖用盛德之累指有德者仍可能被某事拖累名声。", 17, addNote),
  q("028.", 19, "所见者小矣", "文言成句", "李敖文句", "李敖用所见者小矣批评见识偏小。", 19, addNote),
  q("029.", 5, "各就各位", "成语", "中文成语", "李敖用各就各位表示各自回到该在的位置。", 5, addNote),
  q("029.", 9, "知有母而不知有父", "对偶成句", "李敖文句", "李敖用知有母而不知有父概括父母关系的错位。", 9, addNote),
  q("029.", 9, "知有父而不知有母", "对偶成句", "李敖文句", "李敖用知有父而不知有母概括父母关系的错位。", 9, addNote),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "共匪",
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
  "军法",
  "军队",
  "特务",
  "反共",
  "革命",
  "三民主义",
  "主义",
  "战争",
  "抗战",
  "北伐",
  "内战",
  "反攻",
  "台湾",
  "大陆",
  "西藏",
  "外蒙",
  "美国",
  "日本",
  "苏联",
  "俄国",
  "暗杀",
  "战犯",
  "政治犯",
  "言论自由",
  "人权",
  "民主政治",
  "青年军",
  "金圆券",
  "接班",
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
const rowsAfterProofreadRemoval = rawRows.filter((row) => !proofreadRemovedQuoteTexts.has(normalizeText(row.quote_text)));
const proofreadRemovedRows = rawRows.filter((row) => proofreadRemovedQuoteTexts.has(normalizeText(row.quote_text)));
const allRows = [...rowsAfterProofreadRemoval, ...proofreadAdditions];

const selectedRows = allRows
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
  ? fs.readFileSync(attributedTsv, "utf8").trim().split(/\r?\n/).length - 1
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
  `initialRowsBeforeProofread: ${rawRows.length}`,
  `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
  `proofreadAddedRows: ${proofreadAdditions.length}`,
  `selectedRows: ${selectedRows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is dominated by Chiang/Soong family scandals, Chiang Ching-kuo and Chiang Wei-kuo materials, KMT party-state narratives, anti-communist and revolutionary slogans, Gannan wartime material, Taiwan politics, private children and family succession; exclude direct modern party, regime, leader, president, military, war, revolution, state, national-identity, diplomacy, constitutional, human-rights, ideological, political-prisoner, assassination and succession quotations, while keeping independently reusable classical poetry/prose, ritual prose, epitaph/couplet lines, idioms, proverbs, literary quotations, family-document prose and non-political maxims.",
  "",
  "proofreadChanges:",
  "- 删除 001 的“似是而非”，以及 002 官方呈文中的“事半功倍”“驾轻就熟”：三者虽是通用成语，但原处紧贴现代政治公开信或政务呈文，校对轮按政治/官方语录硬排除。",
  "- 增补 46 条：以家族来信、墓志叙述、佛教场景、历史典故、文学化用、非政治成语俗语为主，跳过反共、革命、抗战、政治犯、党政机关和现代政治人物原话。",
  "",
  "selectedHighlights:",
  "- 002/010/011/014/016/018: 收墓志铭、挽联、家族哀状、机智口语、男女格言、唐诗化句、论语化句和通用成语；婚恋丑闻、蒋家身世攻防和现代人物表态不收。",
  "- 007/019/020/021/022: 收赣南文中可独立检索的成语俗语、《礼记·礼运》、《史记·绛侯周勃世家》、《汉武故事》、《史记·秦始皇本纪》和《兰亭集序》化句；反共、抗战、赣南保卫、国父思想、道统论、终身总统和家族接班语录不收。",
  "- 025/026/027/028/029: 收司马昭之心、佛教俗语、弱水典故、奇货可居、顺水人情、龚自珍诗句、君子爱人以德等非政治成语格言；私生子政治、政治犯谈话、现代党派批评和蒋家杂评语录不收。",
  "",
  "excludedHighlights:",
  "- 001/005/006/007: 蒋宋美龄公开信、蒋经国留苏反蒋书信、打倒蒋介石/打倒国民党/中国革命胜利万岁、誓死保卫新赣南等现代政治口号和人物语录不收。",
  "- 019/020/027/028/029: 国父思想、三民主义、政治者俗人之事、私藏军火政治攻防、政治犯定义和现代政府党派评论不收。",
  "- 023/025/026: 蒋家三代接班亡一组现代政治讽刺顺口溜、蒋孝武挽联和包含现代政治称谓的嘲讽诗句首轮不收；只留可独立检索的非政治诗文格言片段。",
];

fs.writeFileSync(reportTxt, reportLines.join("\n") + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rows: selectedRows.length,
      initialRowsBeforeProofread: rawRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
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
    },
    null,
    2,
  ),
);
