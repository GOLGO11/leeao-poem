const fs = require("fs");
const path = require("path");

const book = "中国迷信新研";
const idPrefix = "LACMSN";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "009.历史文化类", "010.中国迷信新研");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_china_superstition_new_study_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_china_superstition_new_study_review_candidates.tsv");
const auditTsv = path.join("analysis", "liao_china_superstition_new_study_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_china_superstition_new_study_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_china_superstition_new_study_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_china_superstition_new_study_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => /^\d{3}\..+\.txt$/.test(name))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const fullPath = path.join(sourceDir, file);
  const text = sourceDecoder.decode(fs.readFileSync(fullPath));
  sourceCache.set(file, {
    text,
    lines: text.split(/\r?\n/),
  });
}

function sourceFile(prefix) {
  const found = files.find((file) => file.startsWith(prefix));
  if (!found) throw new Error(`Source file not found for prefix: ${prefix}`);
  return found;
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"']/g, "")
    .replace(/\s+/g, "");
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, note, lineEnd = lineStart) {
  const file = sourceFile(filePrefix);
  return {
    id: "",
    book,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: attributedTo,
    summary: note,
    notes: "",
  };
}

const rawRows = [
  q("001.", 9, "吾将从彭咸之所居", "诗句", "屈原《离骚》", "李敖讨论巫医、医术与自杀观念时引用的楚辞句。"),
  q("001.", 9, "巫彭作医", "古籍成句", "《世本》", "用于说明中国早期医术与巫术相联。"),
  q("001.", 9, "巫咸初作医", "古籍成句", "《世本》", "用于说明医与巫同源的古说。"),
  q("001.", 13, "介之推至忠也，自割其股，以食文公", "古籍文句", "《庄子》", "割股叙事的先秦例证。"),
  q("001.", 1271, "兔肺羹可救", "方术俗语", "《淮安府志》", "割肺故事中的医巫说法。"),
  q("001.", 1271, "吾身受之父母，苟可愈父，吾何爱焉？", "古籍文句", "《淮安府志》", "割肺救父故事中的自述。"),
  q("001.", 1335, "唐时陈藏器著《本草拾遗》，谓人肉治羸疾，自是民间以父母疾，多刲股肉而进。", "史传文句", "《新唐书·孝友传》", "说明割股风气与本草说法的关系。"),
  q("001.", 1339, "非人肉无以瘳", "方术俗语", "《安福县志》", "地方志割股故事中的医者说法。"),
  q("001.", 1345, "父母疾，亨药饵，以是为孝，未闻毁支体者也。苟不伤义，则圣贤先众而为之。是不幸因而且死，则毁伤灭绝之罪有归矣，安可旌其门以表异之？", "古文格言", "韩愈《鄠人对》", "韩愈反对毁伤身体求孝的核心议论。"),
  q("001.", 1351, "母疾则止于烹粉药石以为是，未闻毁伤支体以为养，在教未闻有如此者。苟不伤于义，则圣贤当先众而为之也。是不幸因而致死，则毁伤灭绝之罪有归矣。其为不孝，得无甚乎？", "古文格言", "韩愈《鄠人对》", "韩愈以孝道反驳割股的长段论证。"),
  q("001.", 1351, "即以一家为孝，是辨一邑里皆无孝矣；以一身为孝，是辨其祖父皆无孝矣。", "古文格言", "韩愈《鄠人对》", "韩愈批评以割股一事独占孝名。"),
  q("001.", 1357, "五代之际，民苦于兵，往往因亲疾以割股，或既丧而割乳庐墓，以规免州县赋役。", "史传文句", "《新五代史·何泽传》", "揭示割股行为与社会利益的关系。"),
  q("001.", 1365, "割股卧冰，伤生有禁", "史传文句", "《明史·孝义传》", "官方限制伤生求孝的成句。"),
  q("001.", 1373, "至卧冰割股，上古未闻。倘父母止有一子，或割肝而丧生、或卧冰而致死，使父母无依、宗祀永绝，反为不孝之大。", "议论文句", "《明史·孝义传》", "礼臣议论割股卧冰不合古道。"),
  q("001.", 1373, "割股不已，至于割肝；割肝不已，至于杀子。违道伤生，莫此为甚。", "议论文句", "《明史·孝义传》", "反对伤生迷信的警句。"),
  q("001.", 1387, "视人命为至重，不可以愚昧误戕；念孝道为至弘，不可以毁伤为正。", "谕旨文句", "清世宗谕", "以孝道反对愚昧伤生的清代谕文。"),

  q("002.", 25, "我思孝子孝，愚乃成其纯。世人薄天性，剿说摇其唇。毁伤固有戒，杀身亦成仁。", "诗句", "黄仲则《新安孝子行》", "割肝救母长诗中概括忠孝冲突的诗句。"),
  q("002.", 33, "懿厥孝思，兹惟淑灵。禀承粹和，笃守天经。泣侍羸疾，默祷隐冥。引刃自响，残肌败形。羞膳奉进，忧劳孝诚。", "铭文", "柳宗元《孝门铭》", "唐代孝门铭中称述割股的文字。"),
  q("002.", 37, "父母全而生之，子全而归之", "孝道成句", "传统孝道语", "李敖引作反割股的身体伦理依据。"),
  q("002.", 37, "不敢毁伤", "孝经成句", "《孝经》", "李敖用来反证割股并非正统孝道。"),
  q("002.", 81, "韩退之作《鄠人对》，以毁伤支体为害义。", "史论成句", "《宋史·孝义传》", "宋史转述韩愈反割股论。"),
  q("002.", 85, "陈宗自毁其体，哀恸伤生，虽非孝道之正，而能为人所难为之事，亦天性之至。", "史传评语", "《宋史·孝义传》", "对割股行为的折中评价。"),
  q("002.", 115, "慈母生我劬劳，今当捐身报之。", "古籍文句", "《元史·孝义传》", "割股救母故事中的自述。"),
  q("002.", 127, "人子事亲，居则致其敬、养则致其乐、有疾则医药吁祷，迫切之情，人子所得为也。", "议论文句", "《明史·孝义传》", "明代礼臣对孝道限度的论述。"),
  q("002.", 135, "吾妇人，安知汤药？昔夫子以臂肉疗吾舅，吾独不能疗吾姑哉？", "古籍文句", "《明史·孝义传》", "割股故事中的妇人答语。"),
  q("002.", 135, "子事父，妇事姑，一也。方危急时，召子何及。且事必待子，安用妇为？", "古籍文句", "《明史·孝义传》", "割股故事中的伦理答辩。"),
  q("002.", 143, "吾兄割臂愈父，吾不能割以愈吾兄乎？", "古籍文句", "《明史·孝义传》", "割股故事中的兄弟伦理表述。"),
  q("002.", 163, "父母之年，不可不知", "论语名句", "《论语·里仁》", "李敖讨论母亲年龄观念时引用。"),
  q("002.", 175, "肝收无难，吾欲出之百日，令世人观之教孝耳！", "志怪梦语", "《孝史》引《启桢野乘》", "割肝志怪故事中的梦语。"),

  q("003.", 7, "父疮不治八十天 割肉补痊疮安然\n总督表彰褒孝行 数天梨园称心田", "歌谣", "《全省孝子孝妇事录》", "台湾割股材料中的通俗歌谣。", 9),
  q("003.", 19, "有孝无财可敬亲 舍己割肉不顾身\n美味奉敬克百难 尝问何时可再餐", "歌谣", "《全省孝子孝妇事录》", "台湾割股材料中的通俗歌谣。", 21),
  q("003.", 31, "孝可格天真实事 老母缠病莫奈何\n臂肉安能胜医药 可证孝心感上苍", "歌谣", "《全省孝子孝妇事录》", "台湾割股材料中的通俗歌谣。", 33),

  q("004.", 59, "薄情郎儿情不真，\n少女坠楼竟轻生。\n双方家长无奈何，\n最后人鬼缔良缘。\n如此一切都遮盖，\n唯此才可化纠纷！\n从此冤家成亲家，\n谁说人鬼不可婚？", "打油诗", "虚一《读“人鬼结婚”趣闻有感》", "人鬼冥婚新闻引出的打油诗。", 73),
  q("004.", 93, "诗家有大判断，有小结裹", "诗论文句", "方回《瀛奎律髓》", "李敖借方回诗评说明整理材料的方法。"),
  q("004.", 97, "古人一事必具数家之学：著述与比类两家，其大要也。", "史学格言", "章学诚《报黄大俞先生书》", "章学诚论著述与比类。"),
  q("004.", 97, "著述譬之韩信运兵，而比类譬之萧何转饷，二者固缺一而不可；而其人之才，固易地而不可为良者也。", "史学格言", "章学诚《报黄大俞先生书》", "本篇题名所据的史学方法比喻。"),

  q("005.", 5, "乃以铜铸高祖及咸阳王禧等六王子孙像，成者当奉为王，惟庄帝独就。", "史传文句", "《魏书·尔朱荣传》", "铸像卜休咎的北魏故事。"),
  q("005.", 9, "荣既有异图，遂铸金为己像，数四不成。", "史传文句", "《魏书·尔朱荣传》", "铸像不成作为凶兆的叙事。"),
  q("005.", 13, "乃使李密卜之，遇大横。曰：‘大吉，汉文帝之卦也！’帝乃铸象以卜之，一写而成。", "史传文句", "《北史·隋本纪》", "以卜卦与铸像判断休咎的故事。"),
  q("005.", 15, "魏故事：将立皇后，必令手铸金人，以成者为吉，不则不得立也。", "史传文句", "《北史·后妃传》", "立后铸金人的迷信制度。"),

  q("006.", 5, "单于来朝，上以太岁厌胜所在，舍之上林苑蒲陶宫。告之以加敬于单于，单于知之。", "史传文句", "《汉书·匈奴传下》", "太岁厌胜观念的汉代例证。"),
  q("006.", 7, "八月，莽亲之南郊，铸作威斗。威斗者，以五石铜为之，若北斗，长二尺五寸，欲以厌胜众兵。", "史传文句", "《汉书·王莽传下》", "王莽威斗厌胜术。"),
  q("006.", 9, "病思生菟，令家求之", "史传文句", "《后汉书·清河孝王庆传》", "厌胜故事中的梦病语。"),
  q("006.", 11, "画瓦书符，作诸厌胜", "古籍文句", "《颜氏家训·风操》", "颜之推记厌胜风俗。"),
  q("006.", 15, "今俗，与人有深仇，即剌得其人之生年月日时，书于小纸，通诚祝告，然后取纸压于马桶之下，或灶觚之上，云其人非患大病，即入败运。", "笔记文句", "《梵天庐丛录·压八字》", "压八字厌胜术的笔记记录。"),

  q("007.", 5, "凤阳宫殿成，帝坐殿中，若有人持兵斗殿脊者。", "笔记文句", "《续通典·刑·守正》", "营造厌镇故事。"),
  q("007.", 7, "闻凡梓人家传，未有不造魇镇者，苟不施于人，必至自孽。稍失其意则忍心为之，此则营造所当知也。", "笔记文句", "《西墅杂记》", "关于工匠魇镇的俗信记录。"),
  q("007.", 9, "水郎水郎，远去震方，天篷力士，助我刚强。净祛忧屋，世保吉康。天乙贵神，解魔镇殃。凡有诅咒，做者身当，急急如荧惑律令！", "咒语", "《花笺录》", "解除魇镇的咒语。"),

  q("008.", 5, "光绪甲午（1894）春，四川顺庆土匪作乱，徐杏林时以全省营务处代理提督，适患足疾，遣部将马总兵雄飞带兵平之。一日，战未毕，忽见对阵之匪拥出裸妇人数十，哭声震天，官军大炮竟不燃。", "笔记文句", "《梵天庐丛录·厌炮》", "厌炮迷信的晚清笔记例证。"),
  q("008.", 9, "贼中有服黄绫马褂者……坐对南城仅数百步，口中默念不知何词。〔官兵以〕众炮丛集拟之，铅丸将及其身一二尺许，即堕地。", "笔记文句", "《临清纪略》", "义和团厌炮故事。"),
  q("008.", 9, "忽一老弁，急呼妓女上城。解其亵衣，以阴对之，而令燃炮。群见铅丸已堕地，忽跃而起，中其腹，一时兵民欢声雷动。", "笔记文句", "《临清纪略》", "以阴部破厌炮的迷信叙事。"),
  q("008.", 11, "东交民巷及西什库，洋人使妇女赤体围绕，以御枪炮。", "笔记文句", "《金銮琐记》", "庚子厌炮传闻。"),
  q("008.", 13, "陈牲酪酒，军主亲诣三揖以衅之", "笔记文句", "《清稗类钞·迷信》", "炮神赏罚迷信中的祭炮仪式。"),

  q("009.", 3, "民或祝诅上，以相约结，而后相谩，吏以为大逆", "史传文句", "《史记·平准书》", "祝诅入罪的汉代史料。"),
  q("009.", 5, "咒诅君父，大逆不道", "史传文句", "《宋史·卢多逊传》", "祝诅罪名的史传用语。"),
  q("009.", 7, "令巫诅仲舒", "笔记文句", "《风俗通义·怪神》", "汉武帝命巫诅董仲舒的故事。"),
  q("009.", 9, "孝武帝下我", "史传文句", "《汉书·武五子传》", "广陵厉王诅祝故事中的神语。"),
  q("009.", 9, "吾必令胥为天子", "史传文句", "《汉书·武五子传》", "广陵厉王诅祝故事中的巫语。"),
  q("009.", 13, "不自安，稍怨望，乃为左道厌魅以求福助，刻木为偶人，衣以道士之服，施机关，能拜跪，昼夜于日月下醮之，祝诅于上", "史传文句", "《陈书·始兴王叔陵传》", "祝诅与偶人厌魅相联的史传材料。"),

  q("010.", 3, "先皇（金章宗）平昔或有幸御，〔元妃〕李氏嫉妒，令女巫李定奴做纸木人、鸳鸯符以事魇魅，致绝圣嗣。", "史传文句", "《金史·后妃传下》", "纸人与魇魅相联的宫廷故事。"),
  q("010.", 7, "赛儿自称佛母，知成败，得石函中妖书宝剑，役鬼神，剪纸做人马相战斗，衣食财物随所需以术运致。", "史传文句", "《通鉴辑览》", "唐赛儿剪纸为兵故事。"),
  q("010.", 11, "向赵姨娘要了张纸，拿剪子铰了两个纸人儿，问了他二人年庚，写在上面；又找了一张蓝纸，铰了五个青面鬼，叫他并在一处，拿针钉了：‘回去我再作法，自有效验的。’", "小说文句", "《红楼梦》", "纸人与魇魅入小说的例子。"),
  q("010.", 13, "遣纸人之法，或言令生人卧于地，以纸人置其身，一人从旁诵咒书符，则生者如睡，而真灵附纸人飞出矣。", "笔记文句", "《清稗类钞》", "遣纸人法的清代笔记记录。"),

  q("011.", 5, "栗姬与诸贵夫人幸姬会，常使侍者祝唾其背，挟邪媚道。", "史传文句", "《史记·外戚世家》", "媚道一词的史记例证。"),
  q("011.", 5, "皇后失序，惑于巫祝，不可以承天命。其上玺绶，罢退居长门宫。", "史传文句", "《汉书·外戚传》", "巫祝媚道导致废后的史传文字。"),
  q("011.", 7, "女巫楚服，自言有术，能令上意回。昼夜祭祀，合药服之。", "史传文句", "《汉孝武故事》", "女巫楚服媚道故事。"),
  q("011.", 9, "妾闻死生有命，富贵在天。修正尚未蒙福，为邪欲以何望？使鬼神有知，不受不臣之诉；如其无知，诉之何益，故不为也。", "古文格言", "《汉书·外戚传》", "班婕妤拒绝巫蛊媚道的名段。"),

  q("012.", 3, "为蛊毒者，男女皆斩，而焚其家；巫蛊者，负羖羊抱犬沉诸渊。", "律令文句", "《魏书·刑罚志》", "蛊毒与巫蛊处罚的古代制度。"),
  q("012.", 7, "陀若蠹政害民者，妾不敢言。今坐为妾身，敢请其命。", "史传文句", "《魏书·文成文明皇后冯氏传》", "蛊案中冯太后的答语。"),

  q("013.", 3, "帝武乙无道，为偶人，谓之天神", "史传文句", "《史记·殷本纪》", "偶人迷信的早期史料。"),
  q("013.", 7, "遂从狱中上书，告敬声与阳石公主私通，及使人巫祭祠诅上，且上甘泉当驰道埋偶人，祝诅有恶言。", "史传文句", "《汉书·公孙贺传》", "偶人与祝诅案相联的汉代史料。"),
  q("013.", 11, "请西岳华山慈父圣母神兵九亿万骑，收杨谅魂神，闭在华山下，勿令散荡。", "咒语", "《隋书·五行志》", "偶人诅祝中的咒语。"),
  q("013.", 13, "遂为巫蛊，以玉人为上（宋文帝）形像，埋于含章殿前", "史传文句", "《宋书·庾炳之传》", "玉人偶像巫蛊故事。"),

  q("014.", 13, "外药济世，内药修身。葫芦横背，拐杖直撑。有缘遇此，大地皆春。", "题画诗", "《谈异·摄魂作画》", "摄魂作画故事中的题画诗。"),
  q("014.", 19, "西洋画法于中国工细人物外，别出一奇，近日又有照像之术，则参以算法，尤为精巧，凡衣之右衽者，照之则为左衽，故富人有特制左衽之服以照像者。或云对之诵《大悲咒》，则其像不成。", "笔记文句", "《谈异·照像》", "早期照相摄魂迷信材料。"),

  q("015.", 5, "天生德于予，桓魋其如予何？", "论语名句", "《论语·述而》", "李敖讨论孔子遇难故事的核心引文。"),
  q("015.", 5, "知命者不立乎岩墙之下", "格言", "《朱子语类》", "朱子解释孔子知命时引出的警句。"),
  q("015.", 7, "文王既没，文不在兹乎！天之将丧斯文也，后死者不得与于斯文也。天之未丧斯文也，匡人其如予何？", "论语名句", "《论语·子罕》", "孔子遇匡人时的自信名段。"),
  q("015.", 9, "天生德于予，汉兵其如予何！", "仿论语成句", "《汉书·王莽传下》", "王莽仿孔子语的史传记录。"),
  q("015.", 11, "天生黑于予，澡豆其如予何！", "仿论语成句", "王安石语", "王安石仿孔子语的趣味成句。"),

  q("016.", 3, "我何罪于天，无过而死乎？", "史传文句", "《史记·蒙恬列传》", "蒙恬临死自问，引出地脉观念。"),
  q("016.", 3, "恬罪固当死矣！起临洮属之辽东，城堑万余里，此其中不能无绝地脉哉？此乃恬之罪也！", "史传文句", "《史记·蒙恬列传》", "蒙恬以绝地脉解释自身死罪。"),
  q("016.", 9, "前岗见一牛眠山汙中，其地若葬，位极人臣矣。", "风水文句", "《晋书·周访传》", "牛眠地风水故事。"),
  q("016.", 9, "此亦其次，当世出二千石。", "风水文句", "《晋书·周访传》", "牛眠地故事中的次等葬地判断。"),
  q("016.", 9, "葬龙角，此法当灭族", "风水文句", "《晋书·周访传》", "祖坟风水故事中的凶断。"),
  q("016.", 11, "掘破此山，贼自败散", "风水文句", "《六朝事迹编类》", "以破山断军事胜负的风水传说。"),
  q("016.", 15, "王师讨不服耳，岂有发人坟墓之理。", "史传文句", "《元史·李恒传》", "反对发坟的史传答语。"),

  q("017.", 5, "不食新矣！", "占梦语", "《左传·成公十年》", "晋景公病梦故事中的预言。"),
  q("017.", 5, "居肓之上，膏之下，若我何！", "古籍文句", "《左传·成公十年》", "病入膏肓故事中的二竖语。"),
  q("017.", 5, "疾不可为也！在肓之上，膏之下，攻之不可，达之不及，药不至焉，不可为也！", "古籍文句", "《左传·成公十年》", "病入膏肓成语所出。"),
  q("017.", 9, "厉之不如", "古籍成句", "《左传·襄公二十六年》", "厉鬼故事中的成句。"),
  q("017.", 13, "寡君寝疾，于今三月矣，并走群望，有加而无瘳。今梦黄熊入于寝门，其何厉鬼也？", "古籍文句", "《左传·昭公七年》", "黄熊厉鬼故事。"),
  q("017.", 13, "以君之明，子为大政，其何厉之有？昔尧殛鲧于羽山，其神化为黄熊，以入于羽渊，实为夏郊，三代祀之。晋为盟主，其或者未之祀也乎？", "古籍文句", "《左传·昭公七年》", "对子产释黄熊梦的长段引文。"),
  q("017.", 17, "鬼有所归，乃不为厉，吾为之归也。", "古籍格言", "《左传·昭公七年》", "伯有为厉故事中的鬼神观。"),
  q("017.", 17, "人生始化曰魄，既生魄，阳曰魂。用物精多，则魂魄强，是以有精爽至于神明。", "古籍格言", "《左传·昭公七年》", "子产论魂魄的名段。"),
  q("017.", 17, "匹夫匹妇强死，其魂魄犹能冯依于人，以为淫厉", "古籍文句", "《左传·昭公七年》", "子产解释厉鬼来源。"),
  q("017.", 19, "国为虚厉", "古籍成句", "《庄子·人间世》", "厉鬼语汇的庄子用例。"),
  q("017.", 21, "不知人鬼耶？亦厉鬼耶？", "古籍文句", "《说苑·杂言》", "厉鬼概念的说苑用例。"),
  q("017.", 21, "驱厉鬼兮山之左", "诗句", "韩愈《祭马仆射文》", "韩愈祭文中的厉鬼诗句。"),
  q("017.", 21, "臣智勇俱竭，不能式遏强寇，保守孤城。臣虽为鬼，誓与贼为厉，以答明恩。", "史传文句", "《旧唐书·张巡传》", "张巡以厉鬼自誓的史传名段。"),

  q("018.", 3, "“道”“在屎溺”", "庄子文句", "《庄子·知北游》", "李敖讨论阴部迷信时引庄子泛论道无所不在。"),
  q("018.", 7, "妇人裸以厌敌", "古籍成句", "《新五代史·一行传》", "阴部厌胜观念的史传用例。"),
];

const proofreadBeforeRows = 113;
const proofreadRemovedRows = [
  ["LACMSN-005", "刲：割也", "训诂释义，偏工具性，不作诗文格言保留。"],
  ["LACMSN-006", "刲，刳也", "训诂释义，偏工具性，不作诗文格言保留。"],
  ["LACMSN-063", "剪纸为兵", "三四字术语，已由后文完整纸人故事覆盖。"],
  ["LACMSN-064", "剪纸为偷", "三四字术语，缺少独立诗文格言价值。"],
  ["LACMSN-065", "剪纸为祟", "三四字术语，缺少独立诗文格言价值。"],
  ["LACMSN-073", "针三枚、艾一撮，并以素纸包固", "物件清单，像案情道具，不是独立引文。"],
  ["LACMSN-075", "乃斩〔江〕充以徇，炙胡巫上林中", "刑罚叙事片段，缺少独立格言或文句完整性。"],
  ["LACMSN-077", "我不负公，此何意也？", "上下文依赖强的案情问句，单独检索价值低。"],
  ["LACMSN-080", "掘地求偶人", "案情碎片，过短且已由完整偶人案文覆盖。"],
  ["LACMSN-081", "得桐木人", "案情碎片，过短且已由完整偶人案文覆盖。"],
  ["LACMSN-084", "催办钱粮、勾摄公事", "会典官样短语，偏制度用语，不作诗文格言保留。"],
];

const modernPoliticalTerms = [
  "国民党",
  "共产党",
  "中共",
  "三民主义",
  "反共",
  "党外",
  "投匪",
  "蒋介石",
  "蒋经国",
  "总统",
  "中华民国",
  "天安门",
  "邓小平",
  "赵紫阳",
  "红卫兵",
  "意识形态",
];

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function formatId(index) {
  return `${idPrefix}-${String(index).padStart(3, "0")}`;
}

function buildRows() {
  const seen = new Set();
  return rawRows.map((row, index) => {
    const source = sourceCache.get(row.source_file);
    if (!source) throw new Error(`Missing source cache: ${row.source_file}`);
    const sourceText = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
    const exactFound = sourceText.includes(row.quote_text);
    const normalizedFound = normalizeText(sourceText).includes(normalizeText(row.quote_text));
    if (!exactFound && !normalizedFound) {
      throw new Error(
        `Quote not found in source: ${row.source_file}:${row.line_start}-${row.line_end}\n${row.quote_text}`,
      );
    }
    const duplicateKey = normalizeText(row.quote_text);
    if (seen.has(duplicateKey)) {
      throw new Error(`Duplicate quote text: ${row.quote_text}`);
    }
    seen.add(duplicateKey);
    return {
      ...row,
      id: formatId(index + 1),
    };
  });
}

function politicalFlags(row) {
  return modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
}

function writeOutputs(rows) {
  fs.mkdirSync(path.dirname(outCsv), { recursive: true });
  fs.mkdirSync(path.dirname(candidatesJson), { recursive: true });

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

  const csv = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
  fs.writeFileSync(outCsv, `\uFEFF${csv}\n`, "utf8");

  const txtLines = [];
  txtLines.push(`《${book}》诗文格言歌谣引用`);
  txtLines.push(`生成日期：${generatedDate}`);
  txtLines.push(`条目数：${rows.length}`);
  txtLines.push("");
  for (const row of rows) {
    txtLines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
    txtLines.push(row.quote_text);
    txtLines.push(`出处/来源：${row.source_or_origin}`);
    txtLines.push(`说明：${row.summary}`);
    if (row.notes) txtLines.push(`备注：${row.notes}`);
    txtLines.push("");
  }
  fs.writeFileSync(outTxt, `${txtLines.join("\n")}\n`, "utf8");

  fs.writeFileSync(candidatesJson, JSON.stringify(rows, null, 2), "utf8");

  const reviewHeaders = [
    "id",
    "file",
    "line_start",
    "line_end",
    "chapter",
    "category",
    "quote_text",
    "source_or_origin",
    "summary",
    "notes",
    "modern_political_flags",
  ];
  const review = [
    reviewHeaders.join("\t"),
    ...rows.map((row) =>
      [
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.chapter,
        row.category,
        row.quote_text,
        row.source_or_origin,
        row.summary,
        row.notes,
        politicalFlags(row).join("|"),
      ].map(tsvEscape).join("\t"),
    ),
  ].join("\n");
  fs.writeFileSync(reviewTsv, `\uFEFF${review}\n`, "utf8");

  const byFile = new Map();
  for (const row of rows) byFile.set(row.source_file, (byFile.get(row.source_file) ?? 0) + 1);
  const audit = [
    "source_file\tselected_count",
    ...Array.from(byFile.entries()).map(([file, count]) => `${file}\t${count}`),
  ].join("\n");
  fs.writeFileSync(auditTsv, `${audit}\n`, "utf8");

  const report = [
    `${book} 校对后抽取报告`,
    `记录数：${rows.length}`,
    `编号范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
    `现代政治词命中：${rows.filter((row) => politicalFlags(row).length > 0).length}`,
    "",
    "处理原则：",
    "1. 大批割股统计表不逐条收录，只保留可独立引用的经典、史传议论、歌谣和核心术数材料。",
    "2. 现代政治语录与政党宣传材料不收入本轮结果。",
    "3. 涉及迷信、巫蛊、厌胜、阴部禁忌的材料，只收原始文献、笔记或小说引文，不收李敖评论中的粗鄙发挥。",
    "",
    "按文件分布：",
    ...Array.from(byFile.entries()).map(([file, count]) => `- ${file}: ${count}`),
  ].join("\n");
  fs.writeFileSync(reportTxt, `${report}\n`, "utf8");

  const proofreadAuditLines = [
    ["action", "id", "quote_text", "reason"],
    ["before", "", "", `校对前条目数：${proofreadBeforeRows}`],
    ...proofreadRemovedRows.map(([id, quote, reason]) => ["removed", id, quote, reason]),
    ["changed", "LACMSN-112", "“道”“在屎溺”", "补齐《庄子》引文在源文中的前后引号边界。"],
    ["after", "", "", `校对后条目数：${rows.length}`],
  ].map((line) => line.map(tsvEscape).join("\t"));
  fs.writeFileSync(proofreadAuditTsv, `\uFEFF${proofreadAuditLines.join("\n")}\n`, "utf8");

  const proofreadReport = [
    `《${book}》校对轮报告`,
    `生成日期：${generatedDate}`,
    `校对前条目数：${proofreadBeforeRows}`,
    `删除条目数：${proofreadRemovedRows.length}`,
    "补入条目数：0",
    `校对后条目数：${rows.length}`,
    `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
    `现代政治词命中：${rows.filter((row) => politicalFlags(row).length > 0).length}`,
    "",
    "校对处理：",
    "- 删除训诂释义、微型术语、物件清单、案情碎片、官样短语等不宜单独作为诗文格言的条目。",
    "- 未因古代史传中的君臣、兵事、朝廷场景而扩大删除；本轮政治风险重点仍是现代政治语录，当前保留条目未命中现代政治词。",
    "- 修正《庄子·知北游》“道”“在屎溺”一条的引文边界，使其与源文一致。",
    "",
    "删除明细：",
    ...proofreadRemovedRows.map(([id, quote, reason]) => `- ${id}｜${quote}：${reason}`),
    "",
    "按文件分布：",
    ...Array.from(byFile.entries()).map(([file, count]) => `- ${file}: ${count}`),
  ].join("\n");
  fs.writeFileSync(proofreadReportTxt, `${proofreadReport}\n`, "utf8");
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
}

const rows = buildRows();
writeOutputs(rows);

console.log(
  JSON.stringify(
    {
      book,
      rows: rows.length,
      idRange: `${rows[0].id}-${rows[rows.length - 1].id}`,
      outCsv,
      outTxt,
      candidatesJson,
      reviewTsv,
      auditTsv,
      reportTxt,
      proofreadAuditTsv,
      proofreadReportTxt,
      proofreadRemovedRows: proofreadRemovedRows.length,
      flaggedForPoliticalReview: rows.filter((row) => politicalFlags(row).length > 0).length,
    },
    null,
    2,
  ),
);
