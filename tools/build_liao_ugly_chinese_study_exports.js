const fs = require("fs");
const path = require("path");

const book = "丑陋的中国人研究";
const idPrefix = "LACLZG";
const generatedDate = "2026-06-27";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "013.丑陋的中国人研究");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_ugly_chinese_study_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_ugly_chinese_study_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_ugly_chinese_study_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_ugly_chinese_study_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_ugly_chinese_study_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_ugly_chinese_study_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_ugly_chinese_study_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_ugly_chinese_study_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_ugly_chinese_study_proofread_report.txt");
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
  return file.replace(/^\d+\.?/, "").replace(/\.txt$/, "");
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
      "筛选口径：本书夹杂柏杨论争、党国人物、文字狱、现代政治与民族性争辩；现代党派/政权/领袖/营救/人权/电报语录不收，只保留可独立检索的古典文句、诗文、成语俗谚、治学格言、翻译校勘材料和非政治性文化格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q("001.", 3, "大同而与小同异，此之谓小同异；万物毕同毕异，此之谓大同异。", "古典哲学文句", "《庄子》记惠施同异说", "李敖以《庄子》惠施同异说说明民族性与国民性问题。"),
  q("001.", 5, "性相近，习相远", "论语成句", "《论语·阳货》", "李敖引用孔子成句，说明民族差异可由习染与教化形成。"),
  q("001.", 7, "出乎其类，拔乎其萃", "孟子成句", "《孟子·公孙丑上》", "李敖借孟子成句说明民族性中也有杰出变体。"),
  q("004.", 19, "既贵之后……无赖之徒苟合，借其权势，拜伏为兄叔者甚众", "史传文句", "《旧唐书·李义府传》", "李敖引用《旧唐书》语，说明攀附权势、认亲附贵的古已有之。"),
  q("004.", 21, "认贼为子", "佛经成语", "《楞严经》", "李敖引佛经成语，与俗语“认贼作父”并举，说明攀附认亲的荒唐。"),
  q("004.", 21, "认贼作父", "俗语", "中国俗语", "李敖引用俗语，说明把恶人认作父辈的攀附心态。"),
  q("005.", 3, "爱情的代价是痛苦，爱情的方法是忍受痛苦", "近代文人题语", "胡适题扇语", "李敖引用胡适题扇语，说明胡适对婚姻与忍受的心境。"),
  q("005.", 5, "谈笑有鸿儒，往来无白丁", "唐文成句", "刘禹锡《陋室铭》", "李敖借刘禹锡成句写江冬秀进入胡适交游圈后的自卑。"),
  q("005.", 37, "玉不琢，不成器。", "蒙学成句", "《三字经》", "李敖引用《三字经》成句，又反用来说明朴素文字的真趣。"),
  q("005.", 81, "交友以自大其身，求士以求此身之不朽", "清儒格言", "李塨语", "李敖引用胡适所喜李塨语，反衬朋友凉薄与过河拆桥。"),
  q("007.", 347, "苛政猛于虎", "古典成语", "《礼记·檀弓下》", "来信者用经典成语形容威权压力所造成的恐惧。", 347, "只收古典成语本体，不收同段现代政治营救论述。"),
  q("007.", 369, "介之推不言禄，禄亦弗及", "古典故事成句", "介之推故事", "李敖借介之推故事说明施恩者虽不求回报，受恩者仍应知恩。"),
  q("007.", 371, "以志吾过，且旌善人。", "古典史语", "晋文公语", "李敖引用晋文公语，劝人承认过失并表彰善人。"),
  q("008.", 149, "春蚕到死丝方尽，蜡炬成灰泪始干", "唐诗名句", "李商隐《无题》", "艾玫信中化用李商隐诗句表达至死不渝的情意。"),
  q("008.", 149, "曾经沧海难为水，除却巫山不是云", "唐诗名句", "元稹《离思》", "艾玫信中引用元稹诗句表达爱情不可替代。"),
  q("010.", 41, "知耻近乎勇", "儒家成句", "《中庸》", "李敖用儒家成句说明廉颇知耻认错才成就将相和。"),
  q("010.", 89, "没有仆人能侍奉两个主人：不是恨这个，就得爱那个；不是重这个，就得轻那个，你不能同时侍奉上帝，又侍奉财神。", "圣经典故", "《新约》", "李敖引用《新约》说明不能同时侍奉彼此冲突的价值。"),
  q("010.", 89, "同时侍奉上帝和财神的，很快就会发现上帝没了。", "外国格言", "劳根·史密斯", "李敖引用劳根·史密斯语，说明价值折中会失去真正信仰。"),
  q("010.", 91, "我在南都以前，尚有些子乡愿的意思在。我今信得这良知，真是真非，信手行去，更不着些覆藏，我今才做得个狂者的胸次。……", "明儒语录", "王阳明语", "李敖引用王阳明语，说明真是真非、直行良知的态度。"),
  q("011.", 17, "左氏艳而富，其失也巫。", "古典文论", "范宁评《左传》", "李敖引用范宁评语，说明《左传》文笔与内容俱佳但多鬼神祸福。"),
  q("011.", 23, "笔则笔，削则削", "春秋笔法成句", "《史记·孔子世家》相关成句", "李敖用春秋笔法成句解释写与不写都有褒贬力量。"),
  q("011.", 39, "肝胆两昆仑", "近代诗句", "谭嗣同《狱中题壁》", "屠申虹来信引用谭嗣同诗句形容赴难豪气。"),
  q("011.", 51, "我这一生中，只要有一个女人，愿意为我心甘情愿地煮一顿饭，我就可以死而无憾了。", "外国文学语录", "托尔斯泰语", "屠申虹引托尔斯泰语，劝柏杨珍惜患难中的情义。"),
  q("012.", 3, "人皆玳瑁，我独乌龟，何也？", "现代谐趣语", "成舍我电文", "李敖引用成舍我十字电文，作为玳瑁与乌龟辨名的笑谈开端。"),
  q("012.", 11, "毛虫，毛而后生；羽虫，羽而后生；毛羽之虫，阳气之所生也；介虫，介而后生；鳞虫，鳞而后生；介鳞之虫，阴气之所生也。惟人为倮匈而后生也（王聘珍校曰：倮匈谓无毛羽与鳞介也），阴阳之精也。毛虫之精者曰麟，羽虫之精者曰凤，介虫之精者曰龟，鳞虫之精者曰龙，倮虫之精者曰圣人。", "古书博物文句", "《大戴礼》", "李敖引用《大戴礼》说明古人把龟列为介虫之精。"),
  q("012.", 13, "昔者，圣人建阴阳天地之情，立以为易，易抱龟南面，天子卷冕北面，虽有明知之心，必进断其志焉，示不敢专，以尊天也。", "礼记文句", "《礼记》", "李敖引用《礼记》说明古代占龟与尊天观念。"),
  q("012.", 13, "我龟既厌，不我告犹", "诗经句", "《诗经》", "李敖引用《诗经》句说明古人向龟问卜而龟不告的意象。"),
  q("012.", 27, "龟，旧也。外骨内肉者也。从它（蛇）。龟头与它（蛇）头同。天地之性，广肩无雄、龟鳖之类，以它（蛇）为雄。", "说文字训", "《说文解字》", "李敖引用《说文》龟字条，说明古人误认龟蛇关系。"),
  q("012.", 29, "广肩无雄，与蛇为匹，故龟与蛇合，谓之玄武。", "古书博物文句", "《埤雅》", "李敖引用《埤雅》说明龟蛇相配为玄武的说法。"),
  q("012.", 29, "面盆脞水（脞水，贮水也）津呵呵（清到彻底也），照见北爷（玄天上帝也）在后座，头毛披肩手骑（骑，拿也）剑，脚下踏着龟蛇哥。", "民间歌谣", "《民俗》所收潮州儿童歌", "李敖引用潮州儿童歌，说明玄武拟人化与踏龟蛇的民俗形象。"),
  q("012.", 37, "明制乐人例用碧绿巾裹头，故吴人以妻之有淫行者。谓其夫为绿头巾，事见《七修类稿》。又《知新录》云明制伶人服绿色衣，良家带用绢布，妓女无带，伶人妇不带冠子、不穿褙子，然则伶人不惟裹绿巾，兼着绿衣。按《唐史》及《封氏闻见记》李封为延陵令，吏人有罪，不加杖，但令裹碧绿巾以耻之，随所犯重轻以定日数，吴人遂以此服为耻。明之令乐人裹绿巾，或本诸此也。", "清人考据", "《陔余丛考》引述", "李敖引用《陔余丛考》材料，说明绿头巾语源。"),
  q("012.", 39, "但又思当时李封何必欲用绿巾？及见春秋时有货妻女求食者，谓之‘娼夫’，以绿巾裹头，以别贵贱。然后知从来已远。李封亦因是以辱之。今则深于乐人耳。", "明人笔记", "郎瑛《七修类稿》", "李敖引用郎瑛笔记，继续考辨绿头巾源流。"),
  q("012.", 39, "帽儿改绿，顶子飞红", "近代赋句", "易实甫《王之春赋》", "李敖引用易实甫赋句，说明绿帽子用法的著名例子。"),
  q("012.", 49, "忠臣不佐二主，汝乃降乎？", "史传文句", "《金史·忠义传》", "李敖引用《金史》中王毅斥王八的话，考王八作为人名的早期用例。"),
  q("012.", 57, "王八好做气难当", "民间谚语", "中国民间谚语", "李敖列举王八相关民间谚语，说明王八词义的俗化。"),
  q("012.", 57, "有钱的王八大三辈", "民间谚语", "中国民间谚语", "李敖列举王八相关民间谚语，说明王八词义的俗化。"),
  q("012.", 57, "王八看绿豆——对眼", "歇后语", "中国歇后语", "李敖列举王八歇后语，说明王八词义的俗化。"),
  q("014.", 61, "过我门而不入我室，我不憾焉者，其惟乡愿乎？乡愿，德之贼也。", "论语成句", "孔子语", "李敖引用孔子严斥乡愿之语，说明伪君子之害。"),
  q("014.", 61, "非之，无举也；刺之，无刺也。同乎流俗，合乎污世。居之似忠信、行之似廉洁，众皆悦之，自以为是，而不可与入尧舜之道。故曰：德之贼也。", "孟子文句", "《孟子·尽心下》", "李敖引用孟子解释乡愿，说明其同流合污而貌似廉洁。"),
  q("015.", 13, "上（汉武帝）以迁为诬罔，欲沮贰师，为陵游说，下迁腐刑。", "史书文句", "司马光《资治通鉴》", "李敖引用《资治通鉴》关于司马迁受腐刑的简明记载。"),
  q("015.", 23, "仆怀欲陈之而未有路，适会召问，即以此指推言陵之功，欲以广主上之意，塞睚眦之辞，未能尽明。明主不深晓，以为仆沮贰师，而为李陵游说，遂下于理。拳拳之忠，终不能自列。因为诬上，卒从吏议。家贫，财赂不足以自赎，交游莫救，左右亲近，不为一言，身非木石，独与法吏为伍，深幽囹圄之中，谁可告诉者！", "古文名篇", "司马迁《报任少卿书》", "李敖引用司马迁自述，说明其受刑关键在无财自赎。"),
  q("020.", 13, "狱囚有意气者，感勉求生，勉纵而逸之。后数岁，勉罢秩客游河北，偶见故囚。故囚喜，迎归厚待之。告其妻曰：“此活我者，何以报德？”妻曰：“偿缣千匹可乎？”曰：“未也。”妻曰：“二千匹可乎？”亦曰：“未也。”妻曰：“若此，不如杀之。”故囚心动。其仆哀勉，密告之。勉衩衣乘马而逸。比夜半，行百余里，至津店。店老父曰：“此多猛兽，何敢夜行？”勉因话言。言未毕，粱上有人瞥下，曰：“我几误杀长者！”乃去。未明，携故囚夫妻二首以示勉。", "唐人笔记故事", "李肇《国史补》李勉故事", "李敖引用李勉救囚反被图害的故事，作为恩仇心理学材料。"),
  q("020.", 17, "恩将仇报", "俗语成语", "中国俗语", "李敖引用俗语，并从变态心理学角度解释其意义。"),
  q("023.", 7, "初学最急，莫如《史记》、两《汉书》、《三国志》、以后便读《通鉴》。", "读史格言", "姚鼐语", "李明德引用姚鼐语，说明《资治通鉴》在读史入门中的地位。"),
  q("023.", 21, "非名不著，非器不形。名以命之，器以别之", "古典史论成句", "司马光《资治通鉴》", "李明德引用司马光原典，辨析名与器的意义。"),
  q("023.", 21, "惟器与名，不可假人", "古典成句", "孔子语，见《左传》成公二年", "李明德引司马光所引孔子语，说明名器不可随便授人。"),
  q("023.", 47, "形上谓道，形下谓器，……器者，所以藏礼，故孔子曰，唯器与名不可假人。", "清儒考据", "阮元《研经室三集》", "李明德引用阮元解释道、器、礼的关系。"),
  q("023.", 51, "夫事未有不生于微而成于著。圣人之虑远，故能谨其微而治之；众人之识近，故必待其著而救之。治其微则用力寡而功多；救其著则竭力而不能及也。易曰：“履霜坚冰至”，书曰：“一日二日万岁”，谓此类也。", "古典史论", "司马光《资治通鉴》", "李明德引用温公史论，说明慎始、识微、知几之义。"),
  q("023.", 53, "履霜坚冰至", "易经成句", "《易经·坤卦》", "李明德解释《资治通鉴》用《易》句表达由微至著。"),
  q("023.", 53, "于无声处听惊雷", "现代文学成句", "鲁迅语", "李明德借鲁迅语解释见微知著的历史意识。"),
  q("023.", 53, "商鉴不远，在夏后之世。", "诗经成句", "《诗经·大雅·荡》", "李明德引用《资治通鉴序》所引诗句，说明以古鉴今之义。"),
  q("023.", 53, "治史所得，在能知几，非惟就已往之事，陈述其变已也。", "近代史学格言", "柳诒徵《国史要义》", "李明德引用柳诒徵语，说明治史重在知几。"),
  q("023.", 61, "著书不易，笺书尤难。", "治学格言", "杭世骏语", "李明德引用清人语，说明笺注古籍比著书更难。"),
  q("023.", 61, "著书难，注书更难。", "治学格言", "黄本骥语", "李明德引用清人语，说明注书之难。"),
  q("023.", 65, "一个蛋只要吃一口，就可以知道是好蛋还是臭蛋。", "西方俗谚", "西谚", "李明德引用西谚，说明以局部足判整体质量。"),
  q("023.", 65, "序者，叙所以作之指也。", "文体格言", "娄坚重刻《白氏长庆集》语", "李明德引用娄坚语，说明序文是叙明作书宗旨。"),
  q("024.", 17, "关国家的盛衰，系生民之休戚，善可为法，恶可为戒者", "史学取材原则", "司马光述《资治通鉴》取材标准", "孙国栋引用司马光取材标准，说明《通鉴》贯注史识与使命感。"),
  q("024.", 39, "基广则难倾、根深则难拔、理节则不乱、胶结则不迁。", "古典史论成句", "《资治通鉴》", "孙国栋引用《通鉴》语，说明教化是维持礼制的基础。"),
  q("024.", 49, "国将亡，必多制。", "古典史论成句", "叔向语，见《资治通鉴》引", "孙国栋引用叔向语，说明法制烦苛与国势危亡的关系。"),
  q("024.", 147, "十月获稻，为此春酒，以介眉寿……", "诗经句", "《诗经·豳风·七月》", "孙国栋引用《诗经》句，说明周代农民饮酒食肉的生活。"),
  q("024.", 147, "十月涤场，朋酒斯飨，曰杀羔羊……", "诗经句", "《诗经·豳风·七月》", "孙国栋引用《诗经》句，说明周代农民宴饮杀羊的生活。"),
  q("024.", 149, "胡姬招素手，延客醉金樽", "唐诗句", "李白诗句", "孙国栋引用唐诗句，说明古代市井饮酒欢宴并非处处禁绝。"),
  q("024.", 149, "时人食狗，亦与羊豕同，故哙专屠以卖。", "汉书注文", "颜师古注《汉书》", "孙国栋引用颜师古注，说明古人食狗与羊豕同常。"),
  q("024.", 157, "（文帝）专务以德化民，是以海内殷富，兴于礼义，断狱数百，几致刑错。", "史书评语", "《汉书·文帝纪》赞", "孙国栋引用《汉书》赞语，说明文帝时刑罚大省。"),
  q("026.", 29, "王者求多闻以立事，学于古训，乃有所得。", "经学注文", "《尚书正义》", "孙国栋引用《尚书正义》解释“王、人求多闻，时惟建事”。"),
  q("026.", 71, "尽信《书》则不如无《书》，吾于‘武成’，取二三策而已。", "孟子成句", "《孟子·尽心下》", "孙国栋引用孟子语，说明读《书》不可尽信。"),
  q("028.", 13, "东方的文明的最大特色是知足，西洋的近代文明的最大特色是不知足", "文化格言", "胡适语", "水逆蕃引用胡适语，比较东西文明的心理特色。"),
  q("028.", 33, "女为容悦也，本义如此", "字训", "《六书故》", "水逆蕃引用字训解释“媚”的本义。"),
  q("028.", 33, "非独女以色媚，而仕宦亦有之", "史记文句", "《史记·佞幸列传》", "水逆蕃引用《史记》句，说明“媚”亦可用于仕宦谄媚。"),
  q("029.", 13, "冤有头，债有主", "俗语", "中国俗语", "大风引用俗语，说明责难应有明确对象。"),
  q("030.", 7, "其美者自美，吾不知其美也；其恶者自恶，吾不知其恶也", "庄子寓言", "《庄子·山木》", "宗鹰引用《庄子》旅舍故事，说明自美自恶与审美反应。"),
  q("031.", 9, "行不更名、坐不改姓", "俗语成语", "中国俗语", "孙国栋用俗语说明自己发表学术文字均用本名。"),
  q("034.", 7, "夫人情安则乐生，痛则思死。棰楚之下，何求而不得？故囚人不胜痛，则饰辞以视之；吏治者利其然，则指道以明之；上奏畏却，则锻炼而周内之。盖奏当之成，虽皋陶听之，犹以为死有余辜。何则？成练者众，文致之罪明也。", "古文名篇", "路温舒《尚德缓刑书》", "李敖引用路温舒论刑求文字，批评柏杨误译《通鉴》。"),
  q("034.", 7, "画地为狱，议不入；刻木为吏，期不对。", "古代俗语", "路温舒《尚德缓刑书》所引俗语", "李敖引用路温舒所引俗语，说明人民痛恨狱吏。"),
  q("036.", 5, "阮咸之子瞻尝见戎，戎问曰：“圣人贵名教，老庄明自然，其旨同异？”瞻曰：“将无同！”戎咨嗟良久，遂辟之。时人谓之“三语掾”。", "资治通鉴文句", "司马光《资治通鉴》", "李敖引用《通鉴》阮瞻三语掾故事，辨析“将无同”语义。"),
  q("036.", 17, "阮宣子有令闻，太尉王夷甫见而问曰：“老、庄与圣教同异？”对曰：“将无同！”太尉善其言，辟之为掾。世谓“三语掾”。卫玠嘲之曰：“一言可辟，何假于三？”宣子曰：“苟是天下人望，亦可无言而辟，复何假一？”遂相与为友。", "世说新语", "《世说新语·文学》", "李敖引用《世说新语》相近故事，说明“将无同”出处与语气。"),
  q("036.", 55, "谢太傅盘桓东山时，与孙兴公诸人泛海戏。风起浪涌，孙、王诸人色并遽，便唱使还。太傅神情方王，吟啸不言。舟人以公貌闲意说，犹去不止。既风转急，浪猛，诸人皆喧动不坐。公徐云：“如此，将无归！”众人即承响而回。于是审其量，足以镇安朝野。", "世说新语", "《世说新语·雅量》", "李敖引用谢安泛海故事，说明“将无”有“那就……吧”的意思。"),
  q("036.", 63, "太保居在正始中，不在能言之流。及与之言，理中清远，将无以德掩其言！", "世说新语", "《世说新语·德行》", "李敖引用王戎语，进一步说明“将无”的语气与用法。"),
  q("038.", 67, "曲突徙薪亡恩泽，焦头烂额者为上客", "古典成语", "曲突徙薪故事", "李敖引用曲突徙薪典故，讽刺真正预防灾祸者反被遗忘。"),
];

const proofreadExclusions = new Map([
  ["苛政猛于虎", "所在段落直接写台湾当政者、冤狱、营救与政治恐惧；校对轮按现代政治语境残留删除。"],
  ["忠臣不佐二主，汝乃降乎？", "原句虽为《金史》史传文句，但核心是忠臣事主的政治伦理；本处只为考王八人名，校对轮从严删除。"],
  ["上（汉武帝）以迁为诬罔，欲沮贰师，为陵游说，下迁腐刑。", "这是《通鉴》案件摘要，依附皇帝、刑罚与政治案件说明，独立诗文格言价值不足。"],
  ["非名不著，非器不形。名以命之，器以别之", "名器制度句直接服务君臣等级与政体秩序辨析，校对轮按古典政治/治理语录删除。"],
  ["惟器与名，不可假人", "名器不可假人的核心含义是权位不可假借，属古典政治制度语录，校对轮删除。"],
  ["形上谓道，形下谓器，……器者，所以藏礼，故孔子曰，唯器与名不可假人。", "阮元考据在本段服务名器/车服/爵号等政治礼制辨析，校对轮删除。"],
  ["关国家的盛衰，系生民之休戚，善可为法，恶可为戒者", "司马光取材标准明确以国家盛衰、生民休戚为对象，属史政治理口径，校对轮删除。"],
  ["国将亡，必多制。", "直接判断国家兴亡与法制烦苛，属于古典政治治理格言，校对轮删除。"],
  ["（文帝）专务以德化民，是以海内殷富，兴于礼义，断狱数百，几致刑错。", "《汉书》赞语主旨是帝王德化与刑政成效，属古典政治治理评语，校对轮删除。"],
  ["王者求多闻以立事，学于古训，乃有所得。", "《尚书》注文以王者建事为主语与用途，虽有治学意味，仍属君王政务语境，校对轮删除。"],
]);

const proofreadAdditions = [
  q("006.", 111, "清官难断家务事", "民间俗谚", "中国俗语", "林坤元信中以俗谚说明家族内部纠纷外人难断。", 111, "校对补入：非政治俗谚，独立检索价值高。"),
  q("006.", 111, "吃三年清斋都不知人家内事", "民间俗谚", "中国俗语", "林坤元信中并引俗谚，说明外人难尽知家庭内情。", 111, "校对补入：非政治俗谚，独立检索价值高。"),
  q("006.", 125, "君子爱财，取之有道", "传统格言", "古人有言", "林坤元信中引用传统格言，劝人处理债务不可夺理强霸。", 125, "校对补入：财义格言，非政治语录。"),
  q("006.", 125, "钱四脚，人两脚", "民间俗谚", "中国俗语", "林坤元信中引用俗语，说明人与财物不可本末倒置。", 125, "校对补入：非政治俗谚，独立检索价值高。"),
  q("006.", 127, "人在人情在、人亡人情亡", "民间俗谚", "中国俗语", "林坤元信用俗语形容人亡后情义顿失的世态。", 127, "校对补入：非政治俗谚。"),
  q("006.", 129, "良药苦口，忠言逆耳", "传统格言", "中国俗语", "林坤元信末用传统格言说明直言劝谏不易被接受。", 129, "校对补入：非政治格言。"),
  q("035", 17, "太岁头上动土", "民间俗谚", "中国俗谚", "李敖解释太岁避忌迷信时引用俗谚，并说明其真义。", 17, "校对补入：民俗训诂材料，非政治语录。"),
  q("035", 23, "太岁，所以纪岁也。其名有六：太岁，一也；太阴，二也；岁阴，三也；天一，四也；摄提，五也；青龙，六也（青龙或曰苍龙）。……名异而实同也。", "清儒训诂", "《经义述闻·太岁考》", "李敖引用《经义述闻》解释太岁诸名，辨正柏杨对太岁的误解。", 23, "校对补入：术数名物训诂，非政治语录。"),
];

const modernPoliticalTerms = [
  "共产党",
  "共党",
  "中共",
  "国民党",
  "民进党",
  "台独",
  "总统",
  "副总统",
  "总统府",
  "立法院",
  "行政院",
  "司法院",
  "选举",
  "竞选",
  "中华民国",
  "蒋介石",
  "蒋经国",
  "毛泽东",
  "李登辉",
  "陈水扁",
  "政治",
  "政党",
  "政权",
  "革命",
  "反共",
  "戒严",
  "党禁",
  "国民大会",
  "特务",
  "人权",
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

const initialRows = [...rawRows].sort(rowCompare).map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const proofreadRemovedRows = initialRows
  .filter((row) => proofreadExclusions.has(row.quote_text))
  .map((row) => ({
    ...row,
    proofread_reason: proofreadExclusions.get(row.quote_text),
  }));

const proofreadRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(row.quote_text)),
  ...proofreadAdditions,
];

const rows = [...proofreadRows].sort(rowCompare).map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const auditRows = rows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of rows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = rows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

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

fs.writeFileSync(outCsv, `${header}\n${rows.map(rowToCsv).join("\n")}\n`, "utf8");

const txt = rows
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
fs.writeFileSync(outTxt, `${book} 诗文格言歌谣引用\n生成日期：${generatedDate}\n条目数：${rows.length}\n\n${txt}\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

fs.writeFileSync(
  reviewTsv,
  [
    "id\tsource_file\tline_start\tline_end\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
    ...rows.map((row) =>
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

const finalIdByQuote = new Map(rows.map((row) => [normalizeText(row.quote_text), row.id]));

fs.writeFileSync(
  proofreadAuditTsv,
  [
    "action\tid\tsource_file\tline_start\tline_end\tcategory\tquote_text\treason",
    ...proofreadRemovedRows.map((row) =>
      [
        "remove",
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.proofread_reason,
      ].join("\t"),
    ),
    ...proofreadAdditions.map((row) =>
      [
        "add",
        finalIdByQuote.get(normalizeText(row.quote_text)) || "",
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.notes,
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
  `sourceFiles: ${files.length}`,
  `quoteCandidates: ${quoteCandidates}`,
  `keywordLines: ${keywordLines}`,
  `reviewCandidates: ${reviewCandidateLines}`,
  `attributedLines: ${attributedLines}`,
  `initialSelectedRows: ${initialRows.length}`,
  `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
  `proofreadAddedRows: ${proofreadAdditions.length}`,
  `selectedRows: ${rows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is largely a polemic around Bai Yang, modern party-state figures, literary imprisonment, national-character debate, and anti-Bai-Yang historical argument; exclude direct modern political, party, regime, leader, rescue, human-rights, telegram, and state-governance quotations, while keeping independently reusable literary, classical, philological, folk-proverb, reading, and translation/collation material.",
  "",
  "proofreadRemovedRows:",
  ...proofreadRemovedRows.map(
    (row) =>
      `- ${row.id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}\t${row.proofread_reason}`,
  ),
  "",
  "proofreadAddedRows:",
  ...proofreadAdditions.map(
    (row) =>
      `- ${finalIdByQuote.get(normalizeText(row.quote_text)) || ""}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`,
  ),
  "",
  "continueExcludedHighlights:",
  "- 003.蒋介石、蒋经国的“田单症””.txt: 管子/新序“毋忘在莒”相关材料虽为古典出处，但本章强绑定蒋氏政治口号与现代党国叙事，校对确认继续排除。",
  "- 006.辜振甫忘恩负义了吗？.txt:115 孟子“欲治其国者，必先齐其家”在本信中嵌入副总统、国家多难等政治恭维语境，校对确认继续排除。",
  "- 037-038 跋文中的营救、匪谍、主子、统战、冤狱等现代政治/司法攻防语录继续排除，只保留非政治的曲突徙薪典故本体。",
];

fs.writeFileSync(reportTxt, reportLines.join("\n") + "\n", "utf8");
fs.writeFileSync(proofreadReportTxt, reportLines.join("\n") + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rows: rows.length,
      missing: missing.length,
      duplicates: duplicates.length,
      politicalHitRows: politicalHits.length,
      quoteCandidates,
      keywordLines,
      reviewCandidates: reviewCandidateLines,
      attributedLines,
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
      proofreadAuditTsv,
      proofreadReportTxt,
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
    },
    null,
    2,
  ),
);
