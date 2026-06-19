const fs = require("fs");
const path = require("path");

const book = "爱情的秘密";
const idPrefix = "LAAQMM";
const generatedDate = "2026-06-19";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "005.诗集语录类",
  "001.爱情的秘密",
);

const sourceDecoder = new TextDecoder("gb18030");
const lineCache = new Map();

function readLines(file) {
  if (!lineCache.has(file)) {
    const sourcePath = path.join(process.cwd(), sourceDir, file);
    lineCache.set(file, sourceDecoder.decode(fs.readFileSync(sourcePath)).split(/\r?\n/));
  }
  return lineCache.get(file);
}

function chapterFromFile(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
}

function quoteFromLines(file, lineStart, lineEnd) {
  return readLines(file)
    .slice(lineStart - 1, lineEnd)
    .map((line) => line.replace(/^[\s　]+/, "").replace(/\s+$/, ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function row(file, lineStart, lineEnd, quoteText, category, sourceOrigin, summary, notes = "") {
  return {
    id: "",
    book,
    chapter: chapterFromFile(file),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrigin,
    summary,
    notes,
  };
}

function lineRow(file, lineStart, lineEnd, category, sourceOrigin, summary, notes = "") {
  return row(
    file,
    lineStart,
    lineEnd,
    quoteFromLines(file, lineStart, lineEnd),
    category,
    sourceOrigin,
    summary,
    notes,
  );
}

const data = [
  row(
    "001.爱情的秘密.txt",
    7,
    7,
    "齐心同所愿，含意俱未伸",
    "古诗句",
    "朱光潜《无言之美》转引古典情诗句",
    "朱光潜论无言之美时举出的爱情含蓄诗句。",
  ),
  row(
    "001.爱情的秘密.txt",
    7,
    7,
    "但无言语空相骂",
    "古诗句",
    "朱光潜《无言之美》转引古典情诗句",
    "与前句并举，说明无言爱情的甜蜜。",
  ),
  lineRow(
    "001.爱情的秘密.txt",
    9,
    13,
    "西方诗歌译文",
    "朱光潜译布莱克《爱情之秘》",
    "朱光潜在《无言之美》中转译布莱克《Love's Secret》。",
  ),
  row(
    "001.爱情的秘密.txt",
    19,
    19,
    "不着一字，尽得风流",
    "诗论成句",
    "司空图《诗品》语意",
    "李敖评布莱克短诗时借用《诗品》成句。",
  ),
  lineRow(
    "001.爱情的秘密.txt",
    21,
    45,
    "西方诗歌",
    "布莱克《Love's Secret》原诗",
    "李敖列出布莱克《爱情之秘》的英文原诗。",
  ),
  lineRow(
    "001.爱情的秘密.txt",
    51,
    79,
    "西方诗歌译文",
    "李敖译布莱克《Love's Secret》",
    "李敖用古体诗重译布莱克短诗。",
    "保留外部诗的李敖译文，不收后文李敖自造讽刺语。",
  ),
  row(
    "002.沙丘忆.txt",
    11,
    11,
    "生活充满了节奏；语言文字也该有节奏。不过你得先训练耳朵。听听静夜的涛声，可以体会其中的韵律；看看海风在干沙上的痕迹，可以体会句子里应有的抑扬顿挫。你懂我意思吗？",
    "文学格言",
    "阿瑟·戈登《奇人述异》人物语",
    "小说人物讲述生活与语言节奏的文学训练格言。",
  ),
  row(
    "002.沙丘忆.txt",
    13,
    13,
    "And the great horse grimly neighed",
    "西方古典文句",
    "马洛礼《亚瑟王之死》",
    "李敖转述小说中用来训练节奏感的马洛礼文句。",
  ),
  lineRow(
    "002.沙丘忆.txt",
    27,
    35,
    "西方诗歌译文",
    "李敖译萨拉·蒂斯代尔《On the Dunes》",
    "李敖译蒂斯代尔《沙丘忆》的中文诗。",
  ),
  lineRow(
    "002.沙丘忆.txt",
    37,
    51,
    "西方诗歌",
    "萨拉·蒂斯代尔《On the Dunes》原诗",
    "《火焰与阴影》中《沙丘忆》的英文原诗。",
  ),
  lineRow(
    "003.除却一寒冬.txt",
    5,
    19,
    "西方诗歌",
    "莎士比亚《As You Like It》第五幕歌诗之一",
    "李敖引用莎士比亚剧中的第一首歌诗。",
  ),
  lineRow(
    "003.除却一寒冬.txt",
    23,
    37,
    "西方诗歌",
    "莎士比亚《As You Like It》第五幕歌诗之二",
    "李敖引用莎士比亚剧中的第二首歌诗。",
  ),
  lineRow(
    "003.除却一寒冬.txt",
    43,
    53,
    "西方诗歌译文",
    "李敖意译莎士比亚歌诗之一",
    "李敖将第一首歌诗译作六行中文。",
  ),
  lineRow(
    "003.除却一寒冬.txt",
    57,
    67,
    "西方诗歌译文",
    "李敖意译莎士比亚歌诗之二",
    "李敖将第二首歌诗译作六行中文。",
  ),
  row(
    "004.一首诗几件事.txt",
    5,
    5,
    "No man is an Iland，intire of itselfe; every man is a peece of the Continent ，a part of the maine ； if a Clod bee washed away by the Sea，Europe is the lesse，as well as if Promontorie were，as well as if a Manor of thy friends or of thine owne were. Any mans death diminishes me，because I am involved in Mankinde. And therefore never send to know for whom the bell tolls. It tolls for thee.",
    "西方诗文",
    "约翰·邓恩《Meditation XVII》",
    "李敖引用邓恩著名段落的英文原文。",
  ),
  lineRow(
    "004.一首诗几件事.txt",
    19,
    53,
    "西方诗文译文",
    "李敖译约翰·邓恩诗文",
    "李敖将邓恩段落译成押韵中文。",
  ),
  row(
    "005.评改余光中的一首译诗.txt",
    7,
    7,
    "译诗一如钓鱼，钓上一条算一条，要指定译者非钓上海中那一条鱼不可，是很难的",
    "译诗格言",
    "余光中《英诗译注》说明语",
    "李敖引余光中关于选译英诗的比喻。",
    "非政治语录，作为译诗论格言保留。",
  ),
  lineRow(
    "005.评改余光中的一首译诗.txt",
    23,
    49,
    "西方诗歌",
    "桑塔亚纳《To W. P.》第二首原诗",
    "李敖列出桑塔亚纳《给W. P.》第二首英文原诗。",
  ),
  lineRow(
    "005.评改余光中的一首译诗.txt",
    53,
    79,
    "西方诗歌译文",
    "余光中译桑塔亚纳《To W. P.》第二首",
    "李敖引用余光中的中译本以供评改。",
  ),
  lineRow(
    "005.评改余光中的一首译诗.txt",
    83,
    107,
    "西方诗歌译文",
    "李敖改译桑塔亚纳《To W. P.》第二首",
    "李敖改译桑塔亚纳悼友诗。",
  ),
  row(
    "008.如影随形.txt",
    9,
    9,
    "对影成三人！",
    "唐诗名句",
    "李白《月下独酌》",
    "李敖自作短诗中化用李白名句。",
  ),
  lineRow(
    "018.墓中人语.txt",
    7,
    33,
    "民歌歌词",
    "爱尔兰民歌《Danny Boy》原词",
    "李敖引用《Danny Boy》英文歌词。",
  ),
  lineRow(
    "018.墓中人语.txt",
    37,
    71,
    "民歌歌词译文",
    "李敖译爱尔兰民歌《Danny Boy》",
    "李敖译《Danny Boy》的中文歌词。",
  ),
  row(
    "019.情律.txt",
    21,
    21,
    "弱水三千，我只取一瓢饮。",
    "传统成句",
    "传统爱情成句",
    "李敖为自作诗注释时引用的爱情成句。",
  ),
  lineRow(
    "020.菩萨写诗.txt",
    5,
    7,
    "友人题诗",
    "李筱峰《叙近况致敖之先生》",
    "李敖转录李筱峰贺年片七绝。",
    "仅保留友人原诗；后续李敖答诗含政治讽刺，不收。",
  ),
  row(
    "024.自赞五首.txt",
    45,
    45,
    "梓匠轮舆，能与人规矩，不能使人巧。",
    "孟子名句",
    "《孟子》",
    "李敖注释自赞诗时引用孟子名句。",
  ),
  row(
    "028.“于人曰浩然，沛乎塞苍冥”.txt",
    1,
    1,
    "于人曰浩然，沛乎塞苍冥",
    "古典成句",
    "孟子浩然之气语意",
    "篇题化用浩然之气典故。",
  ),
  lineRow(
    "028.“于人曰浩然，沛乎塞苍冥”.txt",
    17,
    33,
    "友人诗",
    "居浩然《天涯怀李敖》",
    "李敖转录居浩然遗诗。",
  ),
  lineRow(
    "028.“于人曰浩然，沛乎塞苍冥”.txt",
    57,
    57,
    "古文传记引文",
    "《明史》徐渭传相关文字",
    "李敖谈徐文长时引用《明史》文字。",
  ),
  lineRow(
    "028.“于人曰浩然，沛乎塞苍冥”.txt",
    61,
    61,
    "古文传记引文",
    "袁宏道《徐文长传》",
    "李敖谈徐文长时引用袁宏道传文。",
  ),
  row(
    "035.万古风骚一羽毛.txt",
    3,
    3,
    "三分割据纡筹策，万古云霄一羽毛。",
    "唐诗名句",
    "杜甫《咏怀古迹》",
    "李敖说明篇题来源时引用杜甫诗句。",
  ),
  row(
    "035.万古风骚一羽毛.txt",
    3,
    3,
    "江山代有才人出，各领风骚数百年。",
    "清诗名句",
    "赵翼《论诗》",
    "李敖说明篇题来源时引用赵翼诗句。",
  ),
  row(
    "035.万古风骚一羽毛.txt",
    5,
    5,
    "羽扇纶巾，谈笑间，强虏灰飞烟灭",
    "宋词名句",
    "苏轼《念奴娇·赤壁怀古》",
    "李敖借苏轼词句说明从容气度。",
  ),
  row(
    "035.万古风骚一羽毛.txt",
    9,
    9,
    "虽世殊事异，所以兴怀，其致一也！",
    "古文名句",
    "王羲之《兰亭集序》",
    "李敖谈照片兴怀时化用《兰亭集序》。",
  ),
  row(
    "036.两亿年在你手里.txt",
    55,
    55,
    "所过者化，所存者神",
    "古典成句",
    "中国古人语",
    "李敖以古人成句说明化石带来的余味。",
  ),
  lineRow(
    "041.一片欢喜心，对夜坐着笑.txt",
    3,
    17,
    "西方诗歌译文",
    "李敖译布莱克《Night》前二节",
    "李敖先列出布莱克《子夜歌》的中文意译。",
  ),
  lineRow(
    "041.一片欢喜心，对夜坐着笑.txt",
    19,
    33,
    "西方诗歌",
    "布莱克《Night》原诗前二节",
    "李敖列出布莱克《Night》的英文原诗前二节。",
  ),
  row(
    "041.一片欢喜心，对夜坐着笑.txt",
    37,
    37,
    "强说愁",
    "宋词成句",
    "辛弃疾《丑奴儿》语意",
    "李敖谈少年情绪时引用辛弃疾词语。",
  ),
  row(
    "041.一片欢喜心，对夜坐着笑.txt",
    39,
    39,
    "识尽愁滋味",
    "宋词成句",
    "辛弃疾《丑奴儿》语意",
    "李敖谈看月心境时引用辛弃疾词语。",
  ),
  row(
    "041.一片欢喜心，对夜坐着笑.txt",
    39,
    39,
    "月可使人愁，定不能愁我",
    "古诗句",
    "古诗成句，李敖转引",
    "李敖以诗句表达不再因月色生愁。",
  ),
  row(
    "042.不让她做大牌.txt",
    19,
    19,
    "女人是我们的财产，而我们却不是她的财产。……她是他的财产，一如果树是园丁的财产一样。",
    "历史人物引语",
    "拿破仑圣赫勒拿日记",
    "李敖引用拿破仑关于女性从属观念的日记语。",
    "性别观念史料，不作政治语录处理。",
  ),
  row(
    "042.不让她做大牌.txt",
    19,
    19,
    "丈夫有权向他的女人说：‘太太，你不得出门！太太，你不得到戏院去！太太，你不得见某人、某人！’这个就是说：‘太太，你的身体、你的灵魂，都是属于我的。’",
    "历史人物引语",
    "拿破仑制订法典会议发言",
    "李敖引用拿破仑会议发言说明其性别观念。",
    "性别观念史料，不作政治语录处理。",
  ),
  row(
    "048.脱脱脱脱脱.txt",
    3,
    3,
    "饥餐胡虏肉",
    "宋词名句",
    "岳飞《满江红》",
    "李敖自作诗中明引岳飞词句。",
  ),
  row(
    "048.脱脱脱脱脱.txt",
    7,
    7,
    "渴饮匈奴血",
    "宋词名句",
    "岳飞《满江红》",
    "李敖自作诗中明引岳飞词句。",
  ),
  row(
    "048.脱脱脱脱脱.txt",
    11,
    11,
    "采菊东篱下",
    "古诗名句",
    "陶渊明《饮酒》",
    "李敖自作诗中明引陶渊明诗句。",
  ),
  row(
    "048.脱脱脱脱脱.txt",
    19,
    19,
    "放浪形骸",
    "古文成句",
    "王羲之《兰亭集序》语意",
    "李敖自作诗中化用《兰亭集序》成句。",
  ),
  lineRow(
    "049.“一个文法学家的葬礼”.txt",
    5,
    29,
    "西方诗歌译文",
    "李敖译勃朗宁《A Grammarian's Funeral》节录",
    "李敖译出勃朗宁长诗结尾的学生高歌。",
  ),
  lineRow(
    "049.“一个文法学家的葬礼”.txt",
    31,
    49,
    "西方诗歌",
    "勃朗宁《A Grammarian's Funeral》节录",
    "李敖列出勃朗宁长诗结尾英文原文。",
  ),
  row(
    "050.老虎歌.txt",
    3,
    3,
    "虎落平阳被犬欺",
    "俗语",
    "传统俗话",
    "李敖自作打油诗前引用俗话。",
  ),
  row(
    "050.老虎歌.txt",
    33,
    33,
    "烈士肝肠名士胆",
    "诗化成句",
    "传统诗文成句",
    "李敖自作诗中引用的诗化成句。",
  ),
  lineRow(
    "051.《我们七个》.txt",
    9,
    151,
    "西方诗歌译文",
    "华兹华斯《We Are Seven》，胡虚一、李敖译",
    "李敖全文列出《我们七个》的中英对照译诗。",
  ),
  row(
    "051.《我们七个》.txt",
    155,
    155,
    "所过者化，所存者神",
    "古典成句",
    "中国古人语",
    "李敖解释《我们七个》境界时再引古人成句。",
  ),
  row(
    "051.《我们七个》.txt",
    155,
    155,
    "哀乐不能入",
    "庄子成句",
    "《庄子》语意",
    "李敖谈高人境界时引用庄子式成句。",
  ),
  row(
    "051.《我们七个》.txt",
    155,
    155,
    "举重若轻",
    "成语",
    "传统成语",
    "李敖称华兹华斯诗中小女孩一派天真而举重若轻。",
  ),
  lineRow(
    "057.旧词新改.txt",
    3,
    5,
    "古词",
    "温庭筠《更漏子》",
    "李敖旧词新改前列出的温庭筠原词。",
  ),
  lineRow(
    "057.旧词新改.txt",
    11,
    13,
    "古词",
    "韦庄《菩萨蛮》",
    "李敖旧词新改前列出的韦庄原词。",
  ),
  lineRow(
    "057.旧词新改.txt",
    19,
    21,
    "古词",
    "冯延巳《蝶恋花》",
    "李敖旧词新改前列出的冯延巳原词。",
  ),
  lineRow(
    "057.旧词新改.txt",
    27,
    29,
    "古词",
    "冯延巳《长命女》",
    "李敖旧词新改前列出的冯延巳原词。",
  ),
  lineRow(
    "057.旧词新改.txt",
    35,
    37,
    "古词",
    "宋祁《玉楼春》",
    "李敖旧词新改前列出的宋祁原词。",
  ),
  lineRow(
    "057.旧词新改.txt",
    43,
    45,
    "古词",
    "欧阳修《蝶恋花》",
    "李敖旧词新改前列出的欧阳修原词。",
  ),
  lineRow(
    "057.旧词新改.txt",
    51,
    53,
    "古词",
    "陈与义《临江仙》",
    "李敖旧词新改前列出的陈与义原词。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    3,
    3,
    "邪思之尤者",
    "诗评引文",
    "张戒《岁寒堂诗话》评黄庭坚诗",
    "李敖介绍黄庭坚诗名时引用前人批评。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    3,
    3,
    "剽窃之黠者",
    "诗评引文",
    "王若虚《滹南诗话》评黄庭坚诗",
    "李敖介绍黄庭坚诗名时引用前人批评。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    3,
    3,
    "狞面目恶气象",
    "诗评引文",
    "冯班《钝吟杂录》评黄庭坚诗",
    "李敖介绍黄庭坚诗名时引用前人批评。",
  ),
  lineRow(
    "059.以山谷之道，还治其身.txt",
    5,
    5,
    "宋诗",
    "黄庭坚《武昌松风阁》",
    "李敖全文引用黄庭坚《武昌松风阁》。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    7,
    7,
    "不易其意而造其语",
    "诗论术语",
    "黄庭坚换骨法",
    "李敖说明黄庭坚的换骨法。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    7,
    7,
    "规模其意而形容之",
    "诗论术语",
    "黄庭坚脱胎法",
    "李敖说明黄庭坚的脱胎法。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    7,
    7,
    "人烟寒橘柚，秋色老梧桐",
    "唐诗名句",
    "李白诗句",
    "李敖举李白诗句说明黄庭坚脱胎换骨。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    7,
    7,
    "人家围橘柚，秋色老梧桐",
    "宋诗句",
    "黄庭坚诗句",
    "李敖举黄庭坚由李白句变化而来的诗句。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    7,
    7,
    "百年夜分半，一岁春无多",
    "唐诗句",
    "白居易诗句",
    "李敖举白居易诗句说明黄庭坚脱胎换骨。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    7,
    7,
    "百年中去夜分半，一岁无多春再来",
    "宋诗句",
    "黄庭坚诗句",
    "李敖举黄庭坚由白居易句变化而来的诗句。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    7,
    7,
    "只向贫家促机杼，几家能有一钩丝",
    "宋诗句",
    "王安石诗句",
    "李敖举王安石诗句说明黄庭坚脱胎换骨。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    7,
    7,
    "莫作秋虫促机杼，贫家能有几钩丝",
    "宋诗句",
    "黄庭坚诗句",
    "李敖举黄庭坚由王安石句变化而来的诗句。",
  ),
  row(
    "059.以山谷之道，还治其身.txt",
    13,
    13,
    "得江山之助",
    "诗人自述",
    "黄庭坚自言",
    "李敖转述黄庭坚自言成就得江山之助。",
    "仅保留黄庭坚原语，不收李敖的政治仿语。",
  ),
  lineRow(
    "060.关于《丽达与天鹅》.txt",
    5,
    33,
    "西方诗歌",
    "叶慈《Leda and the Swan》原诗",
    "李敖全文引用叶慈《丽达与天鹅》英文原诗。",
  ),
  lineRow(
    "060.关于《丽达与天鹅》.txt",
    39,
    67,
    "西方诗歌译文",
    "余光中译叶慈《Leda and the Swan》",
    "李敖引用余光中《英美现代诗选》中的译文。",
  ),
  lineRow(
    "060.关于《丽达与天鹅》.txt",
    103,
    131,
    "西方诗歌译文",
    "胡虚一译叶慈《Leda and the Swan》",
    "李敖转录胡虚一试译。",
  ),
  lineRow(
    "060.关于《丽达与天鹅》.txt",
    137,
    165,
    "西方诗歌译文",
    "周英雄译叶慈《Leda and the Swan》",
    "李敖转录远景版《诺贝尔文学奖全集》译文。",
  ),
  lineRow(
    "060.关于《丽达与天鹅》.txt",
    169,
    197,
    "西方诗歌译文",
    "《诺贝尔文学奖全集》另一中译本",
    "李敖转录另一种《丽达与天鹅》译文。",
  ),
  row(
    "060.关于《丽达与天鹅》.txt",
    205,
    205,
    "诗的难译，非身历其境者不知其苦、非真正行家不知其难。现代诗原以晦涩见称，译之尤难。真正了解英文诗的人都知道，有的诗天造地设，宜于翻译，有的诗难译，有的诗简直不可能译。普通的情形是：抽象名词难译（A thing of beauty和A beautiful thing是不完全一样的；中文宜于表达后者，但拙于表达前者）；过去式难译（To the glory that was Greece/And the grandeur that was Rome.）；关系子句难译；有关音律方面的文字特色，例如头韵、谐母音、谐子音、阴韵、阳韵、邻韵等，则根本无能为力。",
    "译诗理论引文",
    "余光中《英美现代诗选》序",
    "李敖引用余光中关于诗歌难译的说明。",
    "非政治语录，作为译诗理论保留。",
  ),
  row(
    "060.关于《丽达与天鹅》.txt",
    209,
    209,
    "我国当代诗人受西洋现代诗的影响至深。理论上说来，一个诗人是可以从译文去学习外国诗的，但是通常的情形是，他所学到的往往是主题和意象，而不是节奏和韵律，因为后者与原文语言的关系更为密切，简直是不可翻译。举个例子，李清照词中“只恐双溪舴艋舟，载不动，许多愁”的意象，译成英文并不太难，但是像“寻寻觅觅，冷冷清清，凄凄惨惨戚戚”一类的音调，即使勉强译成英文，也必然大打折扣了。因此以意象取胜的诗，像斯蒂芬克瑞因的作品，在译文中并不比在原文中逊色太多，但是以音调、语气或句法取胜的诗，像弗罗斯特的作品，在译文中就面目全非了。",
    "译诗理论引文",
    "余光中《英美现代诗选》序",
    "李敖引用余光中关于现代诗翻译与韵律的说明。",
    "非政治语录，作为译诗理论保留。",
  ),
  lineRow(
    "060.关于《丽达与天鹅》.txt",
    219,
    245,
    "西方诗歌译文",
    "李敖译叶慈《Leda and the Swan》",
    "李敖示范翻译叶慈《丽达与天鹅》。",
  ),
  row(
    "060.关于《丽达与天鹅》.txt",
    247,
    247,
    "天行有常",
    "荀子名句",
    "《荀子》",
    "李敖解释译词“天常”时引用荀子语。",
  ),
  row(
    "060.关于《丽达与天鹅》.txt",
    247,
    247,
    "帅彼天常",
    "古文成句",
    "《左传》",
    "李敖解释译词“天常”时引用《左传》语。",
  ),
  row(
    "060.关于《丽达与天鹅》.txt",
    247,
    247,
    "董卓乱天常",
    "古文成句",
    "《后汉书》",
    "李敖解释译词“天常”时引用《后汉书》语。",
  ),
  row(
    "060.关于《丽达与天鹅》.txt",
    261,
    261,
    "见玄鸟堕其卵，简狄取吞之，因孕生契。",
    "史记引文",
    "《史记·殷本纪》",
    "李敖比较中西神话时引用《史记》简狄吞卵故事。",
  ),
  lineRow(
    "061.向沧海凝神.txt",
    5,
    11,
    "西方诗歌译文",
    "弗罗斯特《Neither Out Far Nor in Deep》末节",
    "李敖引用弗罗斯特诗末节的中英对照。",
  ),
  lineRow(
    "062.诗句的实验者.txt",
    5,
    11,
    "西方诗歌",
    "卡莱尔英译歌德《Harfenspieler》",
    "李敖引用卡莱尔英译歌德诗。",
  ),
  lineRow(
    "062.诗句的实验者.txt",
    13,
    19,
    "西方诗歌译文",
    "李敖译歌德《Harfenspieler》相关诗句",
    "李敖给出歌德诗的中文译文。",
  ),
  lineRow(
    "064.弗罗斯特的《雪花纷飞》.txt",
    5,
    21,
    "西方诗歌译文",
    "李敖、小屯合译弗罗斯特《Dust of Snow》",
    "李敖与小屯合译弗罗斯特《雪花纷飞》。",
  ),
  lineRow(
    "064.弗罗斯特的《雪花纷飞》.txt",
    29,
    43,
    "西方诗歌",
    "弗罗斯特《Dust of Snow》原诗",
    "李敖列出弗罗斯特《Dust of Snow》的英文原诗。",
  ),
];

data.forEach((record, index) => {
  record.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

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

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvLines = [
  columns.join(","),
  ...data.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
];

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`总计：${data.length} 条`);
txt.push("");
txt.push("口径说明：");
txt.push("- 诗集语录类从本书开始出现大量李敖自作诗，本轮不把李敖自作诗整首收入。");
txt.push("- 保留外部诗文、古典成句、民歌歌词、李敖翻译的外部诗、友人来诗，以及非政治性的文学/译诗格言。");
txt.push("- 明显政治讽刺、党派/政权/政策语录、李敖政治改写诗，以及目录/标题/短词碎片均已排除。");
txt.push("");

let currentChapter = "";
for (const record of data) {
  if (record.chapter !== currentChapter) {
    currentChapter = record.chapter;
    txt.push(`## ${currentChapter}`);
  }
  txt.push(`${record.id}｜${record.category}｜${record.source_file}:${record.line_start}-${record.line_end}`);
  txt.push(`引用：${record.quote_text}`);
  txt.push(`出处线索：${record.source_or_origin}`);
  txt.push(`摘要：${record.summary}`);
  if (record.notes) txt.push(`备注：${record.notes}`);
  txt.push("");
}

const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
fs.writeFileSync(txtPath, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");

const excludedExamples = [
  "《爱情的秘密》前置词：宣传性前置词与“‘诗’内瘴”等李敖自造讽刺语未收。",
  "001.爱情的秘密.txt:81：“诗无能者”等骂译坛语未收。",
  "021.剪他三分头！.txt：教育部长与发禁讽刺，属政策/政治讽刺，未收。",
  "037-040：爱情短诗多为李敖自作，仅无明确外部引文者未收。",
  "044.不复春归燕，却似如来佛.txt：整篇为政治讽刺诗，未收。",
  "055.袭唐诗七绝四首有序.txt：政治改写唐诗，不收改写诗。",
  "058.《千秋评论》满五年了！.txt：出版法、国民党封杀等政治/法律语录未收。",
  "063.猫狗诗和非猫狗诗.txt：台独、党派讽刺与政治题诗未收。",
];

const report = [];
report.push(`《${book}》首轮抽取报告`);
report.push(`生成日期：${generatedDate}`);
report.push(`输出：${csvPath}`);
report.push(`输出：${txtPath}`);
report.push(`记录数：${data.length}`);
report.push("");
report.push("分类统计：");
const categoryCounts = new Map();
for (const record of data) {
  categoryCounts.set(record.category, (categoryCounts.get(record.category) ?? 0) + 1);
}
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])) {
  report.push(`- ${category}: ${count}`);
}
report.push("");
report.push("本轮特别排除：");
for (const item of excludedExamples) report.push(`- ${item}`);
report.push("");
report.push("后续校对重点：");
report.push("- 长篇中英对照诗可在校对轮再决定是否拆分为原诗/译诗两条或保持整条。");
report.push("- 拿破仑性别观念引语目前按历史人物引语保留，若总口径要减少人物语录可在校对轮删除。");
report.push("- 《旧词新改》只保留古词原文，政治改写均未收入。");

const reportPath = path.join(analysisDir, "liao_love_secret_initial_report.txt");
fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      records: data.length,
      csvPath,
      txtPath,
      reportPath,
    },
    null,
    2,
  ),
);
