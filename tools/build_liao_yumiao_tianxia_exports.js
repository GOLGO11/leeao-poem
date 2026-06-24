const fs = require("fs");
const path = require("path");

const book = "李敖语妙天下";
const idPrefix = "LAYMTX";
const generatedDate = "2026-06-24";
const sourceDir = path.join("《大李敖全集6.0》分章节", "010.节目演讲类", "009.李敖语妙天下");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_yumiao_tianxia_quote_candidates.json");
const reviewTsv = path.join("analysis", "liao_yumiao_tianxia_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_yumiao_tianxia_attributed_lines.tsv");
const auditTsv = path.join("analysis", "liao_yumiao_tianxia_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_yumiao_tianxia_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_yumiao_tianxia_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_yumiao_tianxia_proofread_report.txt");
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
    .replace(/[“”‘’"'【】]/g, "")
    .replace(/\s+/g, "");
}

function normalizeForSourceCheck(text) {
  return normalizeText(text).replace(/（[^）]*）/g, "");
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, note, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(filePrefix);
  const notes = [
    "首轮保守收入：本书节目稿中现代选举、党派、两岸、军政新闻判断密集，仅收句子本体可独立成立的诗文、古文、成语俗谚、歌词和非政治格言。",
    extraNotes,
  ].filter(Boolean).join(" ");
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
    notes,
  };
}

const proofreadAddNote = "校对轮补入：回扫候选池与源文后确认句子本体属于非政治诗文、经典文句、俗语或李敖自作文句。";
const proofreadBeforeRows = 123;
const proofreadRemovedRows = [];
const proofreadChangedRows = [];

const rawRows = [
  q("001.", 11, "任何好人有时候都想杀人放火，任何坏人有时候都会杀人放火。", "李敖格言", "李敖语录", "李敖说明电视节目“杀人放火”的文字技巧时自引的非政治格言。"),
  q("001.", 13, "不让别人看到你，比减肥更重要；不让你看到镜子，比祈祷更重要。", "李敖格言", "李敖《胖子福音》", "李敖以幽默语录调侃肥胖与自我观看。"),
  q("001.", 17, "不信青春唤不回，不容青史尽成灰。低回海上酬功宴，万里江山酒一杯。", "近代诗", "于右任诗", "李敖展示于右任草书时朗读的诗。"),
  q("001.", 17, "不信青春能唤回，不容青史尽成灰。老眼平生空四海，于有声处听惊雷", "李敖改诗", "李敖改于右任、鲁迅诗句", "李敖说明自己据于右任诗和鲁迅诗意改写的诗句。"),
  q("001.", 17, "万家墨面没蒿莱，敢有歌吟动地哀。心事浩茫连广宇，于无声处听惊雷。", "现代诗", "鲁迅诗", "李敖说明“于有声处听惊雷”所本时引用鲁迅诗。"),
  q("001.", 17, "万家粉墨去复来，鬼哭狼嚎动地哀。心事浩茫连广宇，于有声处听惊雷。", "李敖改诗", "李敖改鲁迅诗", "李敖把鲁迅诗改写为电视语境中的自我宣言。"),

  q("002.", 7, "李敖捧自己（捧他自己）已非猖狂，而是艺术。", "现代文句", "陈文茜评李敖", "李敖引陈文茜文章中形容其自我歌颂的句子。"),
  q("002.", 7, "每当别人赞美我的时候我就扭捏不安，为什么不安呢？因为别人赞美地不够。", "外国格言译文", "萧伯纳语意", "李敖借萧伯纳式自嘲说明自我赞美。"),

  q("003.", 5, "衣带渐宽终不悔，为伊消得人憔悴。", "宋词", "柳永词", "李敖讨论“祖国”用法时引用胡适题写的柳永词句。"),
  q("003.", 7, "老当益壮", "成语", "传统成语", "李敖介绍齐白石题字时引用。"),
  q("003.", 7, "三十六计走为上计", "俗语/兵法成语", "三十六计俗语", "李敖复述三十六计时引用的通行说法。"),
  q("003.", 9, "马谡拒荐失街亭，武侯弹琴退仲达", "小说回目", "《三国演义》第九十五回回目", "李敖讲空城计时引用《三国演义》回目。"),
  q("003.", 11, "笑容可掬，焚香操琴", "小说文句", "《三国演义》", "李敖讲诸葛亮空城计时引用小说原文。"),
  q("003.", 11, "司马昭之心，路人皆知", "成语", "三国典故", "李敖说明司马昭出场时引用的成语。"),
  q("003.", 11, "诸葛亮平生谨慎，不曾弄险。", "小说文句", "《三国演义》", "李敖讲司马懿判断诸葛亮时引用小说原句。"),
  q("003.", 11, "盖因不得已而用之", "小说文句", "《三国演义》", "李敖解释诸葛亮自述空城计缘由时引用。"),
  q("003.", 13, "我们不要太处心积虑地去选敌人。", "外国格言译文", "王尔德语意", "李敖借王尔德语意说明敌人并非可任意挑选。"),
  q("003.", 13, "司马懿悔之无及，仰天叹曰‘吾不如孔明也！’", "小说文句", "《三国演义》", "李敖回看空城计结尾时引用小说原文。"),
  q("003.", 21, "此中乐，不思蜀矣。", "典故成语", "三国典故", "李敖讲刘禅故事时引用“不思蜀”原句。"),

  q("004.", 13, "山中无老虎，猴子称大王", "传统俗语", "中国俗语", "李敖讲蜀汉后期人才凋零时引用。"),
  q("004.", 13, "蜀中无大将，廖化作先锋", "传统俗语", "三国俗语", "李敖讲廖化故事时引用。"),
  q("004.", 15, "苟全性命于乱世，不求闻达于诸侯", "古文名句", "诸葛亮《出师表》", "李敖讲诸葛亮自述出处时引用。"),
  q("004.", 15, "受任于败军之际", "古文名句", "诸葛亮《出师表》", "李敖说明诸葛亮受命情境时引用。"),
  q("004.", 15, "鞠躬尽瘁，死而后已", "古文名句", "《后出师表》语句", "李敖讲诸葛亮精神时引用。"),
  q("004.", 25, "出师未捷身先死，长使英雄泪满襟。", "唐诗", "杜甫诗", "李敖讲诸葛亮悲剧时引用杜甫诗句。"),
  q("004.", 25, "出师不利身未死，长使英雄泪满襟", "李敖改诗", "李敖改杜甫诗", "李敖据诸葛亮评价改写杜甫句。"),
  q("004.", 27, "但问耕耘好不好，不再问收获。", "李敖诗句", "李敖《孔明》", "李敖朗读自己写的《孔明》时出现的格言式诗句。"),
  q("004.", 27, "他年锦里经祠庙，《梁父吟》成恨有余。", "唐诗", "李商隐诗", "李敖讲诸葛亮武侯祠时引用。"),

  q("005.", 3, "徒令上将挥神笔，终见降王走传车。", "唐诗", "李商隐诗", "李敖谈诸葛亮与蜀汉结局时引用。"),
  q("005.", 3, "管乐有才真不忝，关张无命欲何如。", "唐诗", "李商隐诗", "李敖讲外国汉学家误读“管乐”时引用。"),
  q("005.", 5, "结庐在人境，而无车马喧。问君何能尔，心远地自偏。采菊东篱下，悠然见南山。", "晋诗", "陶渊明诗", "李敖讲陶渊明“东篱”“南山”误读笑话时引用。"),
  q("005.", 5, "何以解忧，惟有杜康", "古诗名句", "曹操《短歌行》", "李敖讲曹操禁酒与诗句矛盾时引用。"),
  q("005.", 5, "优游风议，性简傲跌宕", "史书文句", "《三国志·简雍传》", "李敖介绍简雍性格时引用。"),
  q("005.", 7, "彼有其具", "史书文句", "《三国志·简雍传》", "李敖讲简雍以“工具”讽谏刘备禁酒时引用。"),
  q("005.", 11, "养寇自重", "成语", "中国成语", "李敖把空城计与华佗故事相连时引用。"),
  q("005.", 13, "小人养吾病，欲以自重", "史书文句", "《三国志·华佗传》", "李敖讲曹操怀疑华佗时引用。"),
  q("005.", 11, "吾悔杀华佗", "史书文句", "《三国志·华佗传》", "李敖讲曹冲病死时引曹操悔语。"),
  q("005.", 15, "置象大船之上", "史书文句", "曹冲称象故事", "李敖讲曹冲称象时引用原理句。"),

  q("006.", 9, "始作俑者，其无后故。", "孟子名句", "《孟子》", "李敖讲“无后”观念时引用孔子责备殉葬俑的说法。"),
  q("006.", 9, "不孝有三，无后为大", "传统格言", "《孟子》语句", "李敖讲中国传统后嗣观念时引用。"),
  q("006.", 13, "有冥婚不稀奇，稀奇的是还有冥婚后的离婚", "李敖格言", "李敖文句", "李敖讲冥婚习俗时提出的文化观察。"),

  q("007.", 13, "遥想公瑾当年，小乔初嫁了，雄姿英发。", "宋词", "苏轼《念奴娇·赤壁怀古》", "李敖讲周瑜典故时引用。"),
  q("007.", 15, "相看白刃血纷纷，死节从来岂顾勋。君不见沙场征战苦，至今犹忆李将军。", "唐诗", "高适《燕歌行》", "李敖讲“李将军”联想时引用。"),

  q("008.", 3, "清者阅之以成圣，浊者见之以为淫。", "李敖题句", "李敖《上山·上山·爱》扉页语", "李敖说明自己小说被误读时引用扉页题句。"),
  q("008.", 5, "吾少也贱，故多能鄙事。", "论语文句", "《论语·子罕》", "李敖谈自己会木工、电工等技能时引用孔子句。"),
  q("008.", 31, "智照千年，雄开百代", "李敖文句", "李敖《从生离到死别》", "李敖介绍《上山·上山·爱》时自引的评价语。"),

  q("009.", 5, "哦，Danny Boy，当风笛呼唤，幽谷成排，当夏日已尽，玫瑰难怀。你，你天涯远引，而我，我在此长埋。当草原尽夏，当雪地全白，任晴空万里，任四处阴霾。哦，Danny Boy，我如此爱你，等你徘徊。哦，说你爱我，你将前来。纵逝者如斯，死者初裁。谢皇天后土，在荒坟塚上，请把我找到，找到，寻我遗骸。", "外国民歌译文", "《Danny Boy》李敖译文", "李敖展示自己翻译《Danny Boy》的押韵版本。"),
  q("009.", 7, "即令你足音轻轻，在我上面，整个我孤坟感应，甜蜜温暖，你俯身向前，诉说情爱，我将死于安乐，直到与你同在。", "外国民歌译文", "《Danny Boy》李敖译文", "李敖补译《Danny Boy》第四段时引用。"),
  q("009.", 13, "山上没有你，只是漫长的冬季，夕阳虽美，毕竟不是一个人的。啊，亲爱的情人，最美好的夕阳，已同你看过，还有我代你看吗？对下山的情人而言，她无心留恋夕阳，在山路的下坡里，她自己就是夕阳。", "李敖散文句", "李敖《上山·上山·爱》", "李敖朗读小说中女主角信件的抒情段落。"),
  q("009.", 15, "物不在心外，心不在物外，一切都在物内、在心底。", "李敖哲理句", "李敖《上山·上山·爱》", "李敖朗读小说信件中关于“心物合一”的句子。"),
  q("009.", 17, "是神伤？是梦醒？是再会？还是永诀？万劫啊，你和我同样不晓。", "李敖散文句", "李敖《上山·上山·爱》", "李敖朗读小说信件结尾的抒情问句。"),
  q("009.", 19, "焉知原上塚，不有当年吾。", "金元诗句", "元好问诗句", "李敖讲生死存亡与荒坟想象时引用。"),
  q("009.", 19, "有召即重来，若亡而实在。", "现代诗句", "胡适诗句", "李敖借胡适诗说明“影不徙”的记忆哲学。"),
  q("009.", 23, "飞鸟过江来，投影在江水。鸟逝水长流，此影何尝徙？风过镜平湖，湖面生轻绉。湖更镜平时，毕竟难如旧。为他起一念，十年终不改。有召即重来，若亡而实在。", "现代诗", "胡适诗", "李敖完整朗读胡适关于影子与记忆的诗。"),

  q("010.", 5, "不是肥水不落外人田，而是水肥不落外人田。", "训诂格言", "李敖辨俗语", "李敖辨析俗语原形时提出的说法。"),
  q("010.", 21, "与父老约，法，三章耳", "史记文句", "《史记·高祖本纪》", "李敖辨析“约法三章”标点时引用。"),
  q("010.", 21, "杀人者死", "史记文句", "《史记·高祖本纪》", "李敖讲刘邦入关后三条法律时引用。"),
  q("010.", 21, "伤人及盗抵罪", "史记文句", "《史记·高祖本纪》", "李敖讲刘邦入关后三条法律时引用。"),
  q("010.", 27, "可以死可以不死，死伤勇", "孟子文句", "《孟子》语意", "李敖讲临终选择时引用孟子对勇的判断。"),
  q("010.", 27, "与江东弟子八千人渡江而西，今无一人还", "史记文句", "《史记·项羽本纪》", "李敖讲项羽乌江不渡时引用。"),
  q("010.", 27, "我何面目见之", "史记文句", "《史记·项羽本纪》", "李敖讲项羽羞见江东父兄时引用。"),
  q("010.", 27, "吾为若德", "史记文句", "《史记·项羽本纪》", "李敖讲项羽赠头给旧识时引用。"),

  q("012.", 5, "任凭弱水三千，我只取一瓢饮。", "小说文句", "《红楼梦》", "李敖讲贾宝玉回答林黛玉时引用。"),
  q("012.", 5, "瓢之漂水，奈何？", "小说文句", "《红楼梦》", "李敖讲林黛玉追问时引用。"),
  q("012.", 5, "非瓢漂水，水自流，瓢自漂耳。", "小说文句", "《红楼梦》", "李敖讲宝玉回应“漂水”时引用。"),

  q("013.", 27, "力拔山兮气盖世，时不利兮骓不逝兮。骓不逝兮可奈何，虞兮虞兮奈若何！", "古歌", "项羽《垓下歌》", "李敖讲霸王别姬时引用。"),

  q("027.", 25, "客亦知夫水与月乎？逝者如斯，而未尝往也；盈虚者如彼，而卒莫消长也。盖将自其变者而观之，则天地曾不能以一瞬；自其不变者而观之，则物与我皆无尽也，而又何羡乎！且夫天地之间，物各有主，苟非吾之所有，虽一毫而莫取。惟江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭。是造物者之无尽藏也，而吾与子之所共适。", "宋文", "苏轼《赤壁赋》", "李敖讲苏东坡时引用《赤壁赋》名段。"),

  q("031.", 15, "靖康耻，犹未雪，臣子恨，何时灭", "宋词", "岳飞《满江红》", "李敖讲宋代遗民语境时引用。"),
  q("031.", 15, "三万里河东入海，五千仞岳上摩天。遗民泪尽胡尘里，南望王师又一年。", "宋诗", "陆游诗", "李敖讲遗民心情时引用。"),
  q("031.", 27, "去努力、去追求、去寻找——永不退却、不屈服", "外国诗译文", "丁尼生诗胡适译句", "李敖讲胡适题写丁尼生诗句时引用。"),

  q("032.", 5, "嫂溺不援", "孟子文句", "《孟子》", "李敖讲礼与权变时引用。"),
  q("032.", 5, "男女授受不亲", "传统礼法句", "中国传统礼教", "李敖讲礼法常规时引用。"),
  q("032.", 5, "援之以道", "孟子文句", "《孟子》", "李敖讲孟子回答“天下溺”时引用。"),

  q("034.", 11, "结庐在人境，而无车马喧。问君何能尔？心远地自偏。采菊东篱下，悠然见南山。山气日夕佳，飞鸟相与还。此中有真意，欲辨已忘言。", "晋诗", "陶渊明诗", "李敖讲胡适记忆与陶渊明诗意时引用。"),
  q("034.", 11, "但言浑忘不言无", "宋诗句", "王安石诗句", "李敖解释“欲辨已忘言”境界时引用。"),
  q("034.", 11, "You can't beat something with nothing", "外国格言", "胡适所引英文格言", "李敖讲胡适遗信与英文格言出处时引用。"),
  q("034.", 13, "偶有几茎白发，心情微近中年。做了过河卒子，只能拼命向前。", "现代诗", "胡适诗", "李敖讲胡适中年以后处境时引用。"),

  q("035.", 3, "火透波穿不计春，根如头面干如身。偶然题作木居士，便有无穷求福人。", "唐诗", "韩愈《题木居士二首》", "李敖讲迷信对象如何被制造时引用。"),

  q("085.", 7, "观察入微，物理的部分不时要工具", "李敖格言", "李敖读书/观察法", "李敖区分物理观察与人理观察时提出。"),
  q("085.", 7, "人理部分需要大头脑", "李敖格言", "李敖读书/观察法", "李敖说明理解人间道理需要头脑而非工具。"),

  q("087.", 25, "魏王雅望非常；然床头捉刀人，此乃英雄也！", "世说新语文句", "《世说新语》", "李敖讲曹操捉刀见匈奴使时引用。"),

  q("098.", 7, "旧瓶不能够装新酒", "圣经典故误译", "《圣经》典故", "李敖辨析旧瓶/羊皮袋译法时引用通行误译。"),

  q("103.", 11, "别时容易见时难", "五代词句", "李煜词", "李敖讲张大千“别时容易”印章时引用。"),
  q("103.", 11, "流水落花春去也，天上人间。", "五代词句", "李煜词", "李敖讲李后主词时引用。"),
  q("103.", 13, "犹奏别离歌，挥泪对宫娥", "五代词句", "李煜词", "李敖讲李后主辞庙时引用。"),

  q("104.", 7, "不看你的眼，不看你的眉。看了心里都是你，忘了我是谁。不看你的眼，不看你的眉。看的时候心里跳，看过以后眼泪垂。不看你的眼，不看你的眉。不看你也爱上你，忘了我是谁。", "李敖歌词", "李敖《忘了我是谁》", "李敖介绍节目主题曲来源时朗读自己的歌词。"),
  q("104.", 7, "要藏有谁藏，要躲有谁躲。躲躲藏藏他是谁，是谁忘了我。要藏有谁藏，要躲有谁躲。藏的时候火如烟，躲过以后烟如火。要藏有谁藏，要躲有谁躲。偷偷查出他是谁，是谁忘了我。", "李敖歌词", "李敖《是谁忘了我》", "李敖说明自己据《忘了我是谁》结构重写的新词。"),
  q("104.", 11, "爱情的代价是痛苦，爱情的方法是忍受痛苦。", "现代格言", "胡适题句", "李敖讲胡适婚姻与爱情观时引用。"),
  q("104.", 13, "无令我死妇人之手", "古礼文句", "五经传统文句", "李敖讲克里蒙梭临终避女性时连接中国古礼。"),
  q("104.", 17, "长安一片月，万户捣衣声。秋分吹不尽，总是玉关情。何日平胡虏，良人罢远征。", "唐诗", "李白诗，源文作“秋分”", "李敖讲《唐诗三百首》捣衣意义时引用。"),
  q("104.", 21, "解释春风无限恨，沉香亭北倚阑干。", "唐诗", "李白《清平调》", "李敖辨析“阑干”不同义项时引用。"),
  q("104.", 21, "玉容寂寞泪阑干，梨花一枝春带雨。", "唐诗", "白居易《长恨歌》", "李敖辨析“阑干”不同义项时引用。"),
  q("104.", 21, "更深月色半人家，北斗阑干南斗斜。今夜偏知春气暖，虫声新透绿窗纱。", "唐诗", "刘方平诗", "李敖辨析“阑干”不同义项时引用。"),

  q("105.", 3, "眼看他起高楼，眼看他宴宾客，眼看他楼塌了，这青苔碧瓦堆，俺曾睡风流觉，把五十年兴亡看饱。", "清曲文句", "孔尚任《桃花扇》", "李敖讲世事兴亡时引用《桃花扇》曲文。"),

  q("106.", 7, "天苍苍野茫茫，风吹草动见牛羊", "北朝民歌", "《敕勒歌》，源文作“草动”", "李敖讲北方草原诗句时引用。"),

  q("107.", 5, "自是君身有仙骨，直应天赋与诗情", "清代对联", "翁方纲联句", "李敖讲“傲骨”时引用原联。"),
  q("107.", 5, "自是君身有傲骨，直应天赋与诗情", "李敖改联", "李敖改翁方纲联句", "李敖据费太太“一身傲骨”改写联句。"),
  q("107.", 27, "姑射神游阅九关，水晶宫殿不胜寒。下窥人世生尘想，故作梅花与俗看。", "古诗", "《谢幼槃文集》所收诗", "李敖以“故作梅花与俗看”说明节目中的自我呈现。"),
  q("107.", 27, "朱雀桥边野草花，乌衣巷口夕阳斜。旧时王谢堂前燕，飞入寻常百姓家。", "唐诗", "刘禹锡《乌衣巷》", "李敖讲兴亡之感时引用。"),

  q("108.", 3, "疏影横斜水清浅，暗香浮动月黄昏。", "宋诗", "林逋《山园小梅》", "李敖由“浮动”一词引出语言用法时引用。"),
  q("108.", 7, "夫人情，安则乐生，痛则思死。棰楚之下，何求而不得！", "汉书文句", "路温舒《尚德缓刑书》", "李敖讲刑求下供词不可靠时引用。"),
  q("108.", 7, "故囚人不胜痛，则饰辞以视之；吏治者利其然，则指道以明之；上奏畏却，则锻练而周内之。", "汉书文句", "路温舒《尚德缓刑书》", "李敖讲刑求如何制造口供时引用。"),

  q("109.", 7, "苦恨年年压金线（做衣服），为他人作嫁衣裳", "唐诗", "秦韬玉《贫女》", "李敖讲“为人作嫁”典故时引用。"),

  q("110.", 15, "当局能肩天下事，读书深得故人心。", "对联", "邓石如联", "李敖讲自己书房旧联与读书方法时引用。"),
  q("110.", 15, "子曰：加我数年，五十以学易，可以无大过矣。", "论语文句", "《论语》", "李敖辨析孔子“学易”句时引用通行读法。"),
  q("110.", 17, "加我数年，少则五年，多则十年", "训诂文句", "龚元玠《十三经客难》语意", "李敖介绍清人对《论语》该句的另一种解释。"),
  q("110.", 19, "重话轻说，严肃话玩笑说", "李敖格言", "李敖表达方法", "李敖概括自己讲学与开玩笑的表达方式。"),
  q("110.", 19, "爱里不见是非，爱里不见强弱，爱里只有情，情没有对错。爱里只见花飞，爱里只见叶落，爱里只有美，美没有善恶。宁愿因情生灾，宁愿因美致祸，宁愿情人说谎，可是我不说破。", "李敖诗", "李敖《爱里》", "李敖朗读自己关于爱情与不说破的诗。"),

  q("111.", 3, "一闪一闪亮晶晶，满天都是小星星", "儿歌句", "传统儿歌《小星星》", "李敖讲演艺人员问题时引用儿歌原句。"),

  q("112.", 11, "劝君莫惜金缕衣，劝君惜取少年时。花开堪折直须折，莫待无花空折枝。", "唐诗", "杜秋娘《金缕衣》", "李敖讲金缕衣实物与唐诗时引用。"),
  q("112.", 19, "君不见走马川行雪海边，平沙莽莽黄入天。", "唐诗", "岑参诗", "李敖讲古代马匹“走”而非跑时引用。"),
  q("112.", 19, "日凿一窍，七日而浑沌死", "庄子文句", "《庄子》浑沌故事", "李敖讲七窍与好意害人时引用。"),
  q("112.", 41, "每游山水，往辄忘归", "史书文句", "《宋书·宗炳传》", "李敖讲宗炳爱山水与卧游时引用。"),
  q("112.", 41, "唯当澄怀观道，卧以游之", "史书文句", "《宋书·宗炳传》", "李敖讲“卧游”来历时引用。"),
  q("112.", 41, "凡所游履，皆图之于世", "史书文句", "《宋书·宗炳传》", "李敖讲宗炳把所游山水绘图时引用。"),
  q("112.", 41, "抚琴动操，欲令众山皆响", "史书文句", "《宋书·宗炳传》", "李敖讲宗炳以琴声回忆山水时引用。"),
  q("112.", 41, "丹青影里放扁舟，山水都从枕上游", "清诗", "张船山诗句", "李敖讲卧游意趣时引用。"),
  q("112.", 41, "岸草沿流绿无缝，远村点染露红楼", "清诗", "张船山诗句", "李敖讲卧游诗意时引用。"),
  q("112.", 41, "泉石从所好，文章如有神", "题字/联句", "于右任题字", "李敖展示于右任字时引用。"),
  q("112.", 43, "嘉陵栖泊几淹秋，岩下汤泉小竹楼。旧梦兵戈无处觅，画图为作卧时游。", "近现代诗", "彭醇士诗", "李敖讲卧游诗文时引用。"),
  q("112.", 45, "高檐白日不到地，深夜黠鼠时登床。", "明诗", "王阳明诗", "李敖讲牢狱经验与王阳明诗时引用。"),
  q("112.", 47, "舍弟江南殁，家兄塞北亡", "诗句", "传统夸饰诗句", "李敖讲文学想象与加工时引用。"),

  q("113.", 3, "不出户，知天下", "老子文句", "《老子》", "李敖讲卧游和间接知识时引用。"),

  q("003.", 15, "天机不可泄露，你附耳上来。", "京剧文句", "京剧《空城计》逸事", "李敖讲高庆奎临场应对时引出的舞台名句。", 15, proofreadAddNote),
  q("004.", 7, "谈笑之间，强虏（曹操）灰飞烟灭", "宋词", "苏轼《念奴娇·赤壁怀古》，源文插注“曹操”", "李敖讲诸葛亮与赤壁想象时引用苏轼词句。", 7, proofreadAddNote),
  q("005.", 19, "此我之不幸，而汝曹之幸也", "史书文句", "《三国志》曹操语", "李敖讲曹冲早死与曹丕继承时引用。", 19, proofreadAddNote),
  q("005.", 19, "本是同根生，相煎何太急", "古诗名句", "曹植《七步诗》", "李敖讲曹丕、曹植兄弟关系时引用。", 19, proofreadAddNote),
  q("005.", 19, "合葬，非礼也", "礼法文句", "邴原拒曹操冥婚语", "李敖讲曹冲冥婚与经典礼法冲突时引用。", 19, proofreadAddNote),
  q("008.", 31, "有真身示现，有妙相庄严，有床上俯仰，有笔下波澜，有布偶能语，有双头佛尊，有奇情高论，有道大通神。", "李敖文句", "李敖《从生离到死别》", "李敖以四字排比介绍《上山·上山·爱》的小说内容。", 31, proofreadAddNote),
  q("008.", 31, "有山谷依然，有夕阳空好，有美人寄迹，有造化入诗，有灵塔出树，有蜻蜓邀盟，有幽冥同路，有墓里前身", "李敖文句", "李敖《从生离到死别》", "李敖以四字排比介绍《上山·上山·爱》后段情节。", 31, proofreadAddNote),
  q("032.", 11, "满堂花醉三千客，一剑霜寒十四州", "五代诗句", "吴越国王请僧题句原文", "李敖辨析孙中山、于右任误写“四十州”时引原句。", 11, proofreadAddNote),
  q("103.", 13, "最是仓皇辞庙日", "五代词句", "李煜词", "李敖讲李后主辞庙时补足引用词句上半。", 13, proofreadAddNote),
  q("104.", 11, "没有见到江冬秀，没有见到胡适的夫人，不会了解胡适的伟大", "现代人物评语", "林语堂语意", "李敖讲胡适婚姻时引用林语堂的评价。", 11, proofreadAddNote),
  q("107.", 11, "屡游相须，曾经御览", "宋人谐句", "王安石胡须逸事", "李敖讲王安石逸事时引用。", 11, proofreadAddNote),
  q("110.", 5, "妻不贤，子不孝，麻将不上张，谁都没有办法", "俗语", "中国俗语", "李敖讲居浩然麻将守则时引用俗语。", 5, proofreadAddNote),
];

const rows = rawRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const modernPoliticalTerms = [
  "总统",
  "国民党",
  "共产党",
  "民进党",
  "台独",
  "台湾独立",
  "选举",
  "选票",
  "候选人",
  "立法院",
  "行政院",
  "军购",
  "国防",
  "中华民国",
  "中华人民共和国",
  "反攻大陆",
  "两岸",
  "中共",
  "政党",
  "蒋介石",
  "毛泽东",
  "陈水扁",
  "马英九",
  "李登辉",
  "美国人",
  "台北市长",
];

function sourceSlice(row) {
  const source = sourceCache.get(row.source_file);
  if (!source) return "";
  return source.lines.slice(row.line_start - 1, row.line_end).join("\n");
}

const seen = new Set();
const auditRows = rows.map((row) => {
  const normalizedQuote = normalizeForSourceCheck(row.quote_text);
  const normalizedSource = normalizeForSourceCheck(sourceSlice(row));
  const foundInSource = normalizedSource.includes(normalizedQuote);
  const normalizedKey = normalizeText(row.quote_text);
  const duplicate = seen.has(normalizedKey);
  seen.add(normalizedKey);
  const politicalHits = modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
  return {
    id: row.id,
    book: row.book,
    source_file: row.source_file,
    line_start: row.line_start,
    line_end: row.line_end,
    quote_text: row.quote_text,
    category: row.category,
    source_or_origin: row.source_or_origin,
    found_in_source: foundInSource ? "yes" : "NO",
    duplicate_text: duplicate ? "yes" : "",
    political_hits: politicalHits.join("|"),
    notes: row.notes,
  };
});

const missing = auditRows.filter((row) => row.found_in_source !== "yes");
const politicalFlagged = auditRows.filter((row) => row.political_hits);
const duplicateRows = auditRows.filter((row) => row.duplicate_text);

if (missing.length) {
  console.warn(`WARNING: ${missing.length} rows were not found verbatim in source slices.`);
}

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

const csvEscape = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function writeCsv(filePath, dataRows, dataColumns = columns) {
  const csv = [
    dataColumns.join(","),
    ...dataRows.map((row) => dataColumns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
  fs.writeFileSync(filePath, `${csv}\n`, "utf8");
}

function writeTsv(filePath, dataRows, dataColumns) {
  const tsv = [
    dataColumns.join("\t"),
    ...dataRows.map((row) => dataColumns.map((column) => String(row[column] ?? "").replace(/\r?\n/g, "\\n")).join("\t")),
  ].join("\n");
  fs.writeFileSync(filePath, `${tsv}\n`, "utf8");
}

function writeTxt(filePath, dataRows) {
  const lines = [
    `《${book}》诗文格言歌谣引用`,
    `生成日期：${generatedDate}`,
    `条目数：${dataRows.length}`,
    "",
  ];

  for (const row of dataRows) {
    lines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
    lines.push(row.quote_text);
    lines.push(`出处/来源：${row.source_or_origin}`);
    lines.push(`说明：${row.summary}`);
    if (row.notes) lines.push(`备注：${row.notes}`);
    lines.push("");
  }

  fs.writeFileSync(filePath, `${lines.join("\n").trimEnd()}\n`, "utf8");
}

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(candidatesJson), { recursive: true });

writeCsv(outCsv, rows);
writeTxt(outTxt, rows);
fs.writeFileSync(candidatesJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
writeTsv(auditTsv, auditRows, [
  "id",
  "book",
  "source_file",
  "line_start",
  "line_end",
  "quote_text",
  "category",
  "source_or_origin",
  "found_in_source",
  "duplicate_text",
  "political_hits",
  "notes",
]);

const categoryCounts = new Map();
const byFileCounts = new Map();
for (const row of rows) {
  categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1);
  byFileCounts.set(row.source_file, (byFileCounts.get(row.source_file) || 0) + 1);
}

const report = [
  `《${book}》诗文格言歌谣引用首轮/校对后报告`,
  `生成日期：${generatedDate}`,
  "",
  `源目录：${sourceDir}`,
  `源文件数：${files.length}`,
  `归因候选命中：870`,
  `引号候选命中：1032`,
  `关键词候选命中：934`,
  `复核候选TSV入选：787`,
  `首轮原始收入：${proofreadBeforeRows}`,
  `校对删除：${proofreadRemovedRows.length}`,
  `校对补入：${rows.length - proofreadBeforeRows + proofreadRemovedRows.length}`,
  `校对后写出：${rows.length}`,
  `ID范围：${rows[0].id} - ${rows[rows.length - 1].id}`,
  `源文命中异常：${missing.length}`,
  `重复文本：${duplicateRows.length}`,
  `quote_text现代政治词命中：${politicalFlagged.length}`,
  "",
  "分类统计：",
  ...[...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `- ${category}：${count}`),
  "",
  "筛选原则：",
  "- 现代选举、党派、两岸、军政新闻判断、节目串场和直接现代政治人物语录不收。",
  "- 古典诗文、小说文句、史书文句、成语俗谚、歌词和李敖自作文句，若句子本体可脱离现代政治语境独立成立，则保留。",
  "- 《上山·上山·爱》相关段落只收抒情、哲理或诗性强的文句，不收剧情转述和政治说明。",
  "- 112 与 113 后半内容重复处，只取 112 的较早出处；113 仅补入《老子》“不出户，知天下”。",
  "",
  "按文件分布：",
  ...Array.from(byFileCounts.entries()).map(([file, count]) => `- ${file}: ${count}`),
  "",
  `CSV：${outCsv}`,
  `TXT：${outTxt}`,
  `候选JSON：${candidatesJson}`,
  `复核候选TSV：${reviewTsv}`,
  `归因行TSV：${attributedTsv}`,
  `审计TSV：${auditTsv}`,
].join("\n");

fs.writeFileSync(reportTxt, `${report}\n`, "utf8");

const proofreadAddedRows = rows.slice(proofreadBeforeRows);
const proofreadAuditRows = [
  { action: "before", id: "", quote_text: "", source_or_origin: "", reason: `校对前条目数：${proofreadBeforeRows}` },
  ...proofreadRemovedRows.map(([id, quoteText, reason]) => ({
    action: "remove",
    id,
    quote_text: quoteText,
    source_or_origin: "",
    reason,
  })),
  ...proofreadAddedRows.map((row) => ({
    action: "add",
    id: row.id,
    quote_text: row.quote_text,
    source_or_origin: row.source_or_origin,
    reason: row.summary,
  })),
  ...proofreadChangedRows.map(([id, quoteText, reason]) => ({
    action: "change",
    id,
    quote_text: quoteText,
    source_or_origin: "",
    reason,
  })),
  { action: "after", id: "", quote_text: "", source_or_origin: "", reason: `校对后条目数：${rows.length}` },
];
writeTsv(proofreadAuditTsv, proofreadAuditRows, ["action", "id", "quote_text", "source_or_origin", "reason"]);

const proofreadReport = [
  `《${book}》校对轮报告`,
  `生成日期：${generatedDate}`,
  "",
  `校对前条目数：${proofreadBeforeRows}`,
  `删除条目数：${proofreadRemovedRows.length}`,
  `补入条目数：${proofreadAddedRows.length}`,
  `修改条目数：${proofreadChangedRows.length}`,
  `校对后条目数：${rows.length}`,
  "",
  "校对处理：",
  "- 首轮 123 条未发现需要删除的直接现代政治语录；古典诗文、史书文句、歌词和李敖自作文句继续保留。",
  "- 回扫复核候选后补入 12 条漏收项，集中在京剧逸句、宋词、三国史书文句、李敖小说介绍文句、李煜词和俗语。",
  "- 继续排除现代选举、党派、两岸、军政新闻判断、现代政治人物语录和节目串场口语。",
  "",
  "补入条目：",
  ...proofreadAddedRows.map((row) => `- ${row.id}｜${row.quote_text}｜${row.source_or_origin}｜${row.source_file}:${row.line_start}-${row.line_end}`),
  "",
  `校对审计TSV：${proofreadAuditTsv}`,
].join("\n");
fs.writeFileSync(proofreadReportTxt, `${proofreadReport}\n`, "utf8");

console.log(JSON.stringify({
  book,
  rows: rows.length,
  proofreadBeforeRows,
  proofreadAdded: proofreadAddedRows.length,
  proofreadRemoved: proofreadRemovedRows.length,
  outCsv,
  outTxt,
  reportTxt,
  auditTsv,
  proofreadReportTxt,
  proofreadAuditTsv,
  missing: missing.length,
  duplicateRows: duplicateRows.length,
  politicalFlagged: politicalFlagged.length,
}, null, 2));
