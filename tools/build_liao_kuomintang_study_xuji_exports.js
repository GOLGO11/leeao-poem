const fs = require("fs");
const path = require("path");

const book = "国民党研究续集";
const idPrefix = "LAGMDYJXJ";
const generatedDate = "2026-06-28";
const sourceDir = path.join("《大李敖全集6.0》分章节", "013.国民党史政", "002.国民党研究续集");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_kuomintang_study_xuji_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_kuomintang_study_xuji_review_candidates.tsv");
const selectedJson = path.join("analysis", "liao_kuomintang_study_xuji_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_kuomintang_study_xuji_proofread_review.tsv");
const auditTsv = path.join("analysis", "liao_kuomintang_study_xuji_proofread_audit.tsv");
const reportTxt = path.join("analysis", "liao_kuomintang_study_xuji_proofread_report.txt");
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
      "校对后从严收入：《国民党研究续集》以现代党史、特务、司法、暗杀、反共宣传和政论攻防为主体；现代政党、政权、政府机关、领袖、军政、革命、反共/反攻/复国、选举、统独、民主自由人权、司法整肃、暗杀与宣传攻防语录不收，只保留可脱离具体政治攻防独立检索的古典诗文、成语俗语、宗教/文学典故、外文格言和非政治生活格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q("《国民党研究续集》自序", 7, "大德不踰闲，小德出入可也", "儒家成句", "《论语·子张》相关成句", "李敖引用传统儒家成句，说明大节与小节之分。"),
  q("《国民党研究续集》自序", 9, "鞠躬尽瘁，死而后已。", "古文名句", "诸葛亮《后出师表》", "李敖引用诸葛亮名句，作为忠勤至死的古典成句。", 9, "只收古文名句本体，不收同段现代军国主义、法西斯与党国批判语境。"),

  q("001.", 51, "剑及履及", "成语", "中文成语", "李敖摘出成语，表示行动迅速、说做就做。"),
  q("001.", 51, "夜长梦多", "成语", "中文成语", "李敖摘出成语，表示拖延太久容易生变。"),
  q("001.", 202, "寄字远从千里外，论交深在十年前", "联语", "黄兴赠蔡锷联", "李敖引用黄兴联语，写远寄文字与十年论交。"),
  q("001.", 222, "贪天之功", "成语", "中文成语", "李敖摘出成语，表示把天成或他人的功劳据为己有。"),
  q("001.", 222, "夫子自道", "成语", "中文成语", "李敖摘出成语，表示说别人其实正说自己。"),
  q("001.", 262, "急功近利", "成语", "中文成语", "李敖摘出成语，表示急求眼前功利。"),
  q("001.", 262, "欺世盗名", "成语", "中文成语", "李敖摘出成语，表示欺骗世人、窃取名声。"),
  q("001.", 262, "首鼠异端", "成语", "中文成语", "李敖摘出成语，表示犹豫摇摆、持两端。"),
  q("001.", 262, "模棱两可", "成语", "中文成语", "李敖摘出成语，表示态度含混、不置可否。"),

  q("003.", 5, "世外桃源", "文学典故", "陶渊明《桃花源记》", "李敖摘出典故，表示远离尘世的理想天地。"),
  q("003.", 5, "避秦之地", "文学典故", "《桃花源记》避秦故事", "李敖摘出典故，表示躲避乱世的隐居之地。"),
  q("003.", 17, "不出户，知天下", "道家名句", "《老子》", "李敖引用《老子》名句，写不出门户而知天下。"),
  q("003.", 27, "筚路蓝缕", "成语", "中文成语", "李敖摘出成语，表示创业艰难。"),
  q("003.", 33, "人家是流泪撒种、欢呼收割；我们是欢呼撒种、流泪收割。", "宗教化用语", "《诗篇》撒种收割意象化用", "李敖记录宗教意象化用的反转句，以撒种收割对照始末。"),
  q("003.", 35, "十年辛苦不寻常", "文学成句", "《红楼梦》开篇诗相关", "李敖引用《红楼梦》相关成句，写长期辛苦之不寻常。"),

  q("004.", 5, "世风日下", "成语", "中文成语", "李敖摘出成语，表示社会风气日渐衰落。"),
  q("004.", 19, "苦恨年年压金线，为他人作嫁衣裳", "唐诗名句", "秦韬玉《贫女》", "李敖引用唐诗名句，借替人作嫁衣裳写徒劳为人。"),
  q("004.", 19, "人情冷暖", "成语", "中文成语", "李敖摘出成语，表示人情随势冷热。"),
  q("004.", 19, "车水马龙", "成语", "中文成语", "李敖摘出成语，表示往来热闹繁盛。"),
  q("004.", 19, "座无虚席", "成语", "中文成语", "李敖摘出成语，表示座位坐满。"),
  q("004.", 19, "门已可罗雀", "成语化用", "门可罗雀", "李敖化用成语，表示门庭冷落。"),
  q("004.", 19, "世态炎凉", "成语", "中文成语", "李敖摘出成语，表示世情随势改变。"),

  q("005.", 7, "白里透红", "俗语成句", "中文成句", "李敖摘出俗语成句，写白中透红的容貌。"),

  q("007.", 3, "人在人情在，人死什么都没有了", "俗语", "中文俗语", "李敖引用俗语化口语，写人死之后人情即散。"),
  q("007.", 3, "文酒之会", "文人雅语", "中文成句", "李敖摘出文人雅语，表示文人与饮酒聚会。"),
  q("007.", 3, "尸骨未寒", "成语", "中文成语", "李敖摘出成语，表示人刚死不久。"),
  q("007.", 3, "不认得耶稣", "圣经典故", "彼得三次不认主故事", "李敖借圣经典故，写翻脸不认人的状态。"),

  q("008.", 31, "有则改之，无则加勉", "格言成句", "中文格言", "李敖引用格言，表示有过则改、无过则自勉。"),
  q("008.", 31, "Caesar’s wife must be above suspicion.", "外文格言", "恺撒之妻格言", "李敖引用英文格言，表示近身者也必须不容怀疑。"),

  q("009.", 7, "武大郎玩夜猫子——什么人玩什么鸟", "歇后语", "中文俗语", "李敖引用歇后语，以人物和鸟作粗俗俏皮对照。"),
  q("009.", 29, "教祖母吸蛋", "外文俗语翻译", "英语俗语 teach one's grandmother to suck eggs", "李敖引用英语俗语译语，表示向老手卖弄本领。"),
  q("009.", 31, "年轻人有从没达成的大志，年老人有从没发生的往事。", "外文格言翻译", "Hector Hugh Munro / Saki", "李敖引用外文格言译句，写青年空有抱负、老人虚构回忆。"),
  q("009.", 31, "The young have aspirations that never come to pass,the old have reminiscences of what never happened.", "外文格言", "Hector Hugh Munro / Saki", "李敖转引英文原句，写青年与老人的两种虚空。"),

  q("013.", 13, "感慨系之", "成语", "王羲之《兰亭集序》相关成句", "李敖摘出成语，表示感触牵系而起。"),
  q("013.", 13, "息肩终老", "成语化短语", "中文成句", "李敖摘出成句，表示卸下负担、安度晚年。"),
  q("013.", 21, "富皇都丽", "文言形容语", "中文文言成句", "李敖摘出文言形容语，表示富丽堂皇。"),

  q("016.", 5, "仰天长啸", "诗词成句", "岳飞《满江红》相关", "李敖摘出诗词成句，写昂首向天长啸。"),
  q("016.", 5, "人皆善啸", "古书文句", "《拾遗记》", "李敖引用古书文句，说明啸的奇异传说。"),
  q("016.", 5, "丈夫啸闻百里，妇人啸闻五十里。如笙竽之音。", "古书文句", "《拾遗记》", "李敖引用古书关于啸声远闻、如笙竽的文句。"),
  q("016.", 7, "绵驹结舌而丧精、王豹衽口而失色、虞人辍声而止歌、商子敛手而叹息、钟期弃琴而改听、孔父忘味而不食、百兽率舞而抃足、凤凰来仪而附翼，乃知长啸之奇妙，盖亦声音之至极。", "赋体文句", "成公绥《啸赋》", "李敖引用《啸赋》长句，写长啸之声令众艺失色、百兽凤凰响应。"),
  q("016.", 11, "其啸也歌", "诗经句", "《诗经》", "李敖引用《诗经》句，说明啸与歌的关系。"),
  q("016.", 11, "尝于苏门山遇孙登，与商略终古及栖神导气之术，登皆不应，因长啸而退。至半岭，闻有声若鸾凤之音，响乎岩谷，乃登之啸也", "史传文句", "《晋书·阮籍传》", "李敖引用阮籍遇孙登故事，写长啸响于岩谷。"),
  q("016.", 11, "孙登尝经宜阳山，上峰行且啸，如箫韶笙簧之音，声振山谷。", "古书文句", "《水经注》", "李敖引用孙登行啸故事，写其声如箫韶笙簧。"),
  q("016.", 11, "少时常赋长啸却胡骑，晚使辽，人相曰：‘此长啸公也！’", "史传文句", "《宋史·范镇传》", "李敖引用范镇长啸公故事，写长啸成名。"),
  q("016.", 11, "划然长啸", "古文名句", "苏轼《后赤壁赋》", "李敖引用苏轼文句，写忽然长啸。"),
  q("016.", 19, "百兽率舞", "古典成语", "古典乐舞意象", "李敖摘出成语，表示百兽随乐起舞。"),
  q("016.", 19, "凤凰来仪", "古典成语", "古典祥瑞意象", "李敖摘出成语，表示凤凰来临呈祥。"),

  q("017.", 9, "鳏寡孤独", "古典成语", "《礼记·王制》", "李敖摘出古典成语，指无依无靠的四类人。"),
  q("017.", 9, "穷而无告", "古典成句", "《礼记·王制》", "李敖摘出古典成句，表示困穷而无处申诉。"),
  q("017.", 9, "水有源头木有本，人到老来思故乡。回忆往事乱如麻，擅借拙笔叙端详。", "旧体诗句", "宗荣禄自述诗句", "李敖引用自述诗句，写老来思乡与追忆往事。", 9, "只收抒情起句，不收后文反攻、总统、毛匪等现代政治诗文。"),
  q("017.", 27, "曲突徙薪不为谢", "古典成语化用", "曲突徙薪典故", "李敖化用曲突徙薪典故，写预防祸患者反不受谢。"),
  q("017.", 29, "塞翁失马，焉知非福？", "古典成语", "塞翁失马典故", "李敖引用成语，表示祸福相倚、未可预料。"),
  q("017.", 37, "克己复礼，为善最乐！", "儒家/劝善成句", "《论语》与传统劝善语", "李敖摘出克己复礼、为善最乐的合用句。"),
  q("017.", 63, "人打你左腮，你把右腮给他。", "圣经成句", "《马太福音》相关教训", "李敖引用圣经教训，写受辱仍不报复。"),
  q("017.", 69, "好男不当兵", "俗语", "中文俗语", "李敖引用俗语，表示旧社会对从军的看法。", 69, "只收俗语本体，不收同段军政叙述。"),
  q("017.", 77, "飞鸟尽，良弓藏，狡兔死，走狗烹", "古典成语", "范蠡相关成句", "李敖引用古典成语，表示功成之后功臣遭弃。"),
  q("017.", 137, "登上贼船，进退维谷", "俗语/成语合用", "中文俗语与成语", "李敖摘出俗语化表达，写上船之后进退两难。"),
  q("017.", 317, "鞠躬尽瘁，死而不已。", "古文名句化用", "诸葛亮名句化用", "李敖引用雷鸣远神父化用句，把死而后已改作死而不已。", 317, "校对改挂到雷鸣远神父评价段，避开宗荣禄早年特务/反共自述段。"),
  q("017.", 179, "山外青山楼外楼，西湖歌舞几时休，暖风熏得游人醉，直把杭州当汴州。", "宋诗名句", "林升《题临安邸》", "李敖引用宋诗全句，写偏安享乐。"),
  q("017.", 179, "各人自扫门前雪，莫管他人瓦上霜", "俗语", "中文俗语", "李敖引用俗语，表示只顾自己、不管他人。"),
  q("017.", 185, "凡事之不近人情者，鲜不为大奸慝！", "古文名句", "苏洵《辨奸论》", "李敖引用苏洵名句，写不近人情者常有大奸。"),
  q("017.", 193, "官庭薄如纸", "俗语成句", "中文成句", "李敖摘出成句，写官场情分薄弱。"),
  q("017.", 193, "谁无父兄，谁无子女，提携捧负，畏其不寿。", "古文名句", "李华《吊古战场文》", "李敖引用古文，写人人都有亲属牵挂。"),
  q("017.", 197, "如临深渊、如履薄冰", "古典成语", "《诗经·小雅》相关成句", "李敖引用成语，表示谨慎恐惧。"),
  q("017.", 203, "愿意者不苦！", "格言", "中文格言", "李敖引用格言，表示自愿承受便不觉其苦。"),
  q("017.", 203, "愿意者不苦，再苦也要拉下去。", "格言化用", "中文格言化用", "李敖化用愿意者不苦，写自愿承受艰难。"),
  q("017.", 203, "君子得其时则驾，不得其时则蓬累而行", "古典成句", "古代君子出处语", "李敖引用古语，写君子得时则行、不得时则穷行。"),
  q("017.", 209, "君子固穷，小人穷思滥矣！", "古典成句", "《论语》“君子固穷”化用", "李敖引用并化用古语，写君子安贫、小人乱为。"),
  q("017.", 221, "察秋毫不见舆薪", "古典成句", "《孟子》相关成句", "李敖引用成句，写能察细微却不见大物。"),
  q("017.", 227, "安得广厦千万间，大庇天下寒士俱欢颜", "唐诗名句", "杜甫《茅屋为秋风所破歌》", "李敖引用杜甫名句，写广厦庇护寒士的愿望。"),
  q("017.", 235, "一粒米煮成汤，大家喝", "俗语", "中文俗语", "李敖引用俗语，写极少资源分给众人。"),
  q("017.", 235, "剜却心头肉，医得眼下疮", "俗语/诗化成句", "中文俗语", "李敖引用成句，写以根本损害救眼前之急。"),
  q("017.", 235, "五伦之中只剩一，除却朋友还有谁？", "诗化成句", "中文诗化成句", "李敖引用成句，写朋友关系在五伦中的重要。"),
  q("017.", 245, "除恶务尽，树德务兹。", "古典成句", "《尚书》相关成句", "李敖引用古典成句，表示除恶须尽、立德须及时。"),
  q("017.", 253, "知己知彼，才能百战百胜", "兵家成句化用", "《孙子》相关", "李敖化用兵家成句，表示了解彼此才能取胜。"),
  q("017.", 253, "知己而不知彼，形同闭门造车", "成语化用", "知己知彼与闭门造车合用", "李敖摘出成句，写只知己不知彼如闭门造车。"),
  q("017.", 253, "忠言逆耳", "成语", "中文成语", "李敖引用成语，表示忠诚劝告往往刺耳。"),
  q("017.", 271, "家有敝帚享千金", "古典成语", "敝帚自珍相关成句", "李敖引用成句，写自家破帚也珍视如千金。"),
  q("017.", 271, "灭六国者，六国也，非秦也，亡秦者，秦也，非天下也。", "古文名句", "杜牧《阿房宫赋》", "李敖引用杜牧名句，写兴亡根由在自身。"),
  q("017.", 271, "秦不暇自哀，而后人哀之，后人哀之而不鉴之，亦使后人而复哀后人也。", "古文名句", "杜牧《阿房宫赋》", "李敖引用杜牧名句，写后人若不鉴戒便又成后人所哀。"),
  q("017.", 275, "一言而为天下法，匹夫而为天下师", "古文名句", "苏轼《潮州韩文公庙碑》相关", "李敖引用古文，写一言可成天下法、一介匹夫可为天下师。"),
  q("017.", 275, "悬崖勒马", "成语", "中文成语", "李敖引用成语，表示到危险边缘及时止步。"),
  q("017.", 287, "和尚没儿同道多，野鹤无粮天地宽", "俗语联句", "中文俗语", "李敖引用俗语联句，写无牵挂者同道多、天地宽。"),
  q("017.", 287, "忠言逆耳，良药苦口", "成语格言", "中文格言", "李敖引用成语格言，表示劝告刺耳、良药苦口。"),
  q("017.", 297, "人生有七尺之形，死为一椁之土", "古文名句", "古文成句", "李敖引用古文，写人生躯体终归棺土。"),
  q("017.", 297, "钓者负鱼，鱼何负于钓？猎者负兽，兽何负于猎？", "古文名句", "苏洵文句", "李敖引用古文设问，写钓猎者负鱼兽而非鱼兽负人。"),
  q("017.", 297, "斩关之盗，人不责其穿窬，杀人之囚，人不责其斗殴。以斩关而概穿窬，余事也；以杀人而概斗殴，微罪也。", "古文名句", "苏洵文句", "李敖引用古文，写大罪之下不再责细罪。"),
  q("017.", 297, "皋陶曰杀之三，尧白肴之三。", "古书文句", "古代司法传说", "李敖引用古书文句，写尧与皋陶的反复对答。"),
  q("017.", 297, "周处除三害", "古典典故", "周处故事", "李敖摘出典故，表示除去乡里三害。"),
  q("017.", 297, "牵牛过蹊而夺其牛", "古典典故", "古代执法故事", "李敖引用典故，写处罚过度。"),
  q("017.", 307, "多行不义必自毙", "古典成语", "《左传》", "李敖引用成语，表示恶行多了必自取灭亡。"),
  q("017.", 307, "坐享渔人之利", "成语", "鹬蚌相争典故", "李敖引用成语，表示第三者坐收利益。"),
  q("017.", 307, "守株待兔", "成语", "《韩非子》相关寓言", "李敖引用成语，表示墨守偶然经验而不知变通。"),
  q("017.", 307, "不入虎穴焉得虎子。", "成语格言", "《后汉书》相关成句", "李敖引用成语格言，表示不冒险不能有所得。"),
  q("017.", 307, "天时不如地利，地利不如人和。", "孟子名句", "《孟子》", "李敖引用孟子名句，表示人和胜于地利天时。"),
  q("017.", 307, "天予不受，反得其咎。", "古典成句", "《史记》相关成句", "李敖引用古典成句，表示天赐机会不接受反受其害。"),
  q("017.", 307, "物极必反", "成语", "中文成语", "李敖引用成语，表示事物发展到极点会转向反面。"),
  q("017.", 317, "以苦为乐，以乐为罪", "宗教格言", "宗教修行语", "李敖引用格言，写把苦看作乐、把乐视为罪。"),
  q("017.", 317, "爱人如己", "圣经成句", "《圣经》", "李敖引用圣经成句，表示爱别人如爱自己。"),
  q("017.", 335, "人是受造之物，原属于土，将来还归于土。", "宗教成句", "基督教教义语", "李敖引用宗教成句，写人由土而来、归于土。"),
  q("017.", 335, "猫哭老鼠", "俗语", "中文俗语", "李敖引用俗语，表示假慈悲。"),
  q("017.", 335, "雨淋罗汉两行珠泪假慈悲，雪塑观音一片冰心难救苦。", "俗联", "中文俗联", "李敖引用俗联，写假慈悲与难救苦的讽刺。"),

  q("018.", 3, "和尚打伞", "俗语", "中文俗语", "李敖摘出俗语前半，指向“无法无天”的俗语说法。"),
  q("018.", 3, "用之则行，舍之则藏", "论语成句", "《论语·述而》", "李敖引用孔子出处语，表示被用则行、不被用则藏。"),

  q("020.", 15, "汝为县，可以指麾百姓为儿。既天子好猎，即合多留余地。安得纵百姓耕耜，遍妨天子鹰犬？而又不能自责，更敢咄咄。吾知汝当死罪！", "古代轶事文句", "《五代史补》相关", "李敖引用五代轶事中反讽县令的长句。"),
  q("020.", 15, "请数烛雏之罪而诛之。", "古代轶事文句", "晏子烛雏故事", "李敖引用晏子故事中请数罪而诛的反讽句。"),
  q("020.", 15, "同以滑稽回人主之怒。实皆由晏子之语出来。", "古代评语", "古书评语", "李敖引用评语，指出用滑稽转圜君怒的共同来源。"),
  q("020.", 17, "诸邀车驾……以身自理诉而不实者，杖八十", "古代律文", "唐律相关", "李敖引用古代律文，记录邀驾自诉不实时的刑罚。", 17, "只收古代律文材料，不收同篇现代司法与政治案语境。"),
  q("020.", 17, "以身自理诉而不实", "古代律文短语", "唐律相关", "李敖摘出古代律文短语，表示亲自诉冤而不实。"),
  q("020.", 19, "举目有河山之异", "文言成句", "古文成句", "李敖引用文言成句，写举目所见河山已异。", 19, "只收文言成句本体，不收同段现代政治感慨。"),

  q("021.", 29, "擒贼先擒王，射人先射马", "唐诗名句", "杜甫《前出塞》", "李敖引用杜甫名句，表示解决问题要抓关键。", 29, "只收诗句本体，不收同篇现代暗杀叙事。"),

  q("023.", 19, "贼喊捉贼", "俗语", "中文俗语", "李敖引用俗语，表示作恶者反诬他人。"),
  q("023.", 23, "死鸭硬嘴巴", "俗语", "中文俗语", "李敖引用俗语，表示嘴硬不认错。"),
  q("023.", 27, "纸包不住火", "俗语", "中文俗语", "李敖引用俗语，表示真相终究遮掩不住。"),
  q("023.", 33, "弄巧成拙", "成语", "中文成语", "李敖摘出成语，表示想巧反坏。"),
  q("023.", 35, "欲盖弥彰", "成语", "中文成语", "李敖摘出成语，表示越想遮盖越显明。"),
];

const proofreadRemovedQuoteTexts = new Map([
  ["富皇都丽", "校对删除：疑似OCR或临时错置短语，不是稳定诗文格言。"],
  ["官庭薄如纸", "校对删除：疑似“官情薄如纸”类俗语的OCR/异文，且官场语境太重，不稳。"],
  ["愿意者不苦，再苦也要拉下去。", "校对删除：同线已保留更干净的格言本体“愿意者不苦！”，此句为语境化扩展。"],
  ["灭六国者，六国也，非秦也，亡秦者，秦也，非天下也。", "校对删除：虽出《阿房宫赋》，但本体是国家兴亡判断，按政治/统治语录从严排除。"],
  ["秦不暇自哀，而后人哀之，后人哀之而不鉴之，亦使后人而复哀后人也。", "校对删除：虽出《阿房宫赋》，但本体是历史兴亡鉴戒，按政治/统治语录从严排除。"],
  ["一言而为天下法，匹夫而为天下师", "校对删除：本体直接指向天下法与政治法统，按政治/法政语录从严排除。"],
  ["皋陶曰杀之三，尧白肴之三。", "校对删除：源文疑有OCR错字，且属于古代司法处置材料，不作为稳定诗文格言保留。"],
  ["同以滑稽回人主之怒。实皆由晏子之语出来。", "校对删除：这是古书出处评述，不是独立诗文格言。"],
  ["以身自理诉而不实", "校对删除：古代律文片段过于程序化，不是诗文格言。"],
  ["诸邀车驾……以身自理诉而不实者，杖八十", "校对删除：古代律文条款涉及统治者车驾与刑罚，按法政材料从严排除。"],
  ["举目有河山之异", "校对删除：本书此处嵌在现代政治翻译与政论争议中，政治指向过强。"],
]);

const proofreadRows = rawRows
  .filter((row) => !proofreadRemovedQuoteTexts.has(row.quote_text))
  .map((row) => ({ ...row }));
const proofreadRemovedRows = rawRows
  .filter((row) => proofreadRemovedQuoteTexts.has(row.quote_text))
  .map((row) => ({
    ...row,
    proofread_reason: proofreadRemovedQuoteTexts.get(row.quote_text),
  }));

const modernPoliticalTerms = [
  "国民党",
  "共产党",
  "中共",
  "民进党",
  "反共",
  "反攻",
  "复国",
  "总统",
  "政府",
  "政权",
  "革命",
  "台独",
  "统独",
  "人权",
  "民主",
  "自由中国",
  "特务",
  "情报局",
  "军统",
  "保密局",
  "毛匪",
  "党外",
  "选举",
  "宪法",
  "司法",
  "暗杀",
  "委员长",
  "中华民国",
  "三民主义",
  "天下人之天下",
  "本固则邦宁",
  "官逼民反",
  "苛政",
  "得人者昌",
  "天下法",
  "亡秦",
  "亡秦者",
  "灭六国",
  "邀车驾",
  "以身自理诉",
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
  `selectedRows: ${selectedRows.length}`,
  `missingQuotes: ${missing.length}`,
  `duplicateTexts: ${duplicates.length}`,
  `politicalHitRows: ${politicalHits.length}`,
  "policy: this book is dominated by modern Kuomintang history, secret-service, judicial, assassination, anti-communist propaganda, and political polemic material; exclude direct modern party, regime, government, leader, military, revolution, anti-communist, counteroffensive, recovery, election, unification/independence, democracy/freedom/human-rights, judicial-purge, assassination, and propaganda-attack quotations. Keep only independently reusable classical poetry/prose, idioms, proverbs, religious/literary allusions, foreign maxims, and non-political life sayings.",
  "",
  "selectedHighlights:",
  "- 自序与001：收《论语》、诸葛亮名句、黄兴联语和成语；现代党派评价与革命史归属论战不收。",
  "- 003-009：收桃源典故、《老子》、唐诗/红楼梦成句、歇后语、英文格言与宗教意象化用；现代宗教政治组织与军政格言不收。",
  "- 016-017：收长啸古典材料、礼记/孟子/杜甫/苏洵/圣经/俗联等；宗荣禄反攻、总统、毛匪等现代政治诗文不收。",
  "- 018-023：收孔子出处语、五代轶事、杜甫诗句和若干俗语成语；现代司法冤案、暗杀、古代律文条款与宣传攻防语录不收。",
  "",
  "proofreadChanges:",
  ...proofreadRemovedRows.map((row) => `- 删除「${row.quote_text}」：${row.proofread_reason}`),
  "- 调整「鞠躬尽瘁，死而不已。」：改挂到017第317行雷鸣远神父评价段，避开017第169行宗荣禄早年特务/反共自述段。",
  "",
  "excludedHighlights:",
  "- 006《国民党政工头子投共》主要是现代政工、投共、反共与宣传材料，首轮不收。",
  "- 016 祭戴笠文、军统局内外同志、复活飞来等虽有修辞，但属现代特务崇拜/政治祭文，首轮不收。",
  "- 017 宗荣禄现代政治诗、反攻书信、军政口号与领袖颂词均不收，只取少量可脱离政治语境的抒情起句、古典引用、圣经与俗语。",
  "- 020-021 现代邀驾案、司法与暗杀叙事不收；校对后古代律文条款也从严删除，只保留晏子/五代轶事与杜甫诗句本体。",
  "- “天下者，天下人之天下也”“本固则邦宁”“官逼民反”“苛政猛于虎”“得人者昌，失人者亡”等虽为古语，但本体就是统治、民变或国家兴亡判断，按本项目硬口径剔除。",
  "- 校对进一步删除《阿房宫赋》中作为国家兴亡判断使用的两句，以及苏轼“天下法”句，保留更偏文学/人生经验的古典诗文、俗语和宗教材料。",
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
