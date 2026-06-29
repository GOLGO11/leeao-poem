const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(
  root,
  "《大李敖全集6.0》分章节",
  "016.李敖祸台五十年庆祝十书",
  "002.第一流人的境界"
);

const book = "第一流人的境界";
const idPrefix = "LAFCR";
const decoder = new TextDecoder("gb18030");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readSource(fileName) {
  const fullPath = path.join(sourceDir, fileName);
  const text = decoder.decode(fs.readFileSync(fullPath));
  return text.replace(/^\uFEFF/, "").split(/\r?\n/);
}

const sourceFiles = new Map(
  fs
    .readdirSync(sourceDir)
    .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
    .map((name) => [name, readSource(name)])
);

function sourceFile(selector) {
  if (selector === "preface") return `《${book}》题辞.txt`;
  const found = [...sourceFiles.keys()].find((name) => name.startsWith(selector));
  if (!found) throw new Error(`Cannot find source file selector: ${selector}`);
  return found;
}

function normalizeText(text) {
  return String(text || "")
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(/[\u3000\s]/g, "")
    .replace(/[，。、《》〈〉“”‘’：；！？（）()［］\[\]【】—…·,.!?:;"'`~\-]/g, "")
    .toLowerCase();
}

function sourceSnippet(fileName, lineStart, lineEnd = lineStart) {
  const lines = sourceFiles.get(fileName);
  if (!lines) throw new Error(`Source not loaded: ${fileName}`);
  return lines.slice(lineStart - 1, lineEnd).join("\n");
}

function q(selector, lineStart, quoteText, category, sourceWork, lineEnd = lineStart, note = "") {
  const fileName = sourceFile(selector);
  return {
    fileName,
    lineStart,
    lineEnd,
    quoteText,
    category,
    sourceWork,
    note,
  };
}

const rawRows = [
  q("preface", 3, "朝菌不知晦朔，蟪蛄不知春秋", "古籍成句", "庄子"),
  q("preface", 3, "井底之蛙不知天多大", "俗语", "题辞"),
  q("preface", 3, "急流勇进", "成语", "题辞"),
  q("preface", 3, "逆流而上", "成语", "题辞"),
  q("001.", 3, "百兽之王", "成语", "题辞"),
  q("001.", 3, "恍然大悟", "成语", "题辞"),
  q("001.", 5, "美中不足", "成语", "题辞"),
  q("001.", 5, "何足道哉", "成语", "题辞"),
  q("002.", 9, "卒然临之而不惊，无故加之而不怒", "古文名句", "苏轼"),
  q("002.", 9, "所挟持者甚大，而其志甚远也", "古文名句", "苏轼"),
  q("002.", 11, "Life is too short to be little.", "外国格言", "Disraeli"),
  q("002.", 11, "人生短得不够扯鸡毛蒜皮", "外国格言译文", "Disraeli"),
  q("002.", 11, "鸡毛蒜皮", "成语", "题辞"),
  q("003.", 9, "弱水三千", "成语", "题辞"),
  q("003.", 5, "不拘一格", "成语", "题辞"),
  q("003.", 5, "书剑飘零", "成语", "题辞"),
  q("003.", 5, "老僧入定", "成语", "题辞"),
  q("003.", 5, "温柔乡", "成语", "题辞"),
  q("003.", 5, "离群索居", "成语", "题辞"),
  q("003.", 13, "神机莫测", "成语", "题辞"),
  q("004.", 11, "I was ever a fighter, so-one fight more. the best and the last! I would hate that death bundaged my eyes, and forbore. And bade me past.", "外国诗句", "Robert Browning", 17),
  q("004.", 19, "我永远是一个战士，所以——再打这最好的最后的一仗！我厌恶死亡蒙住我的两眼，叫我领教他的死相。", "外国诗句译文", "Robert Browning", 25),
  q("004.", 27, "老骥伏枥，志在千里。烈士暮年，壮心不已", "古诗名句", "曹操"),
  q("004.", 29, "Though much is taken, much abides; and though We are not now that strength which in old days Moved earth and heaven, that which we are, we are, One equal temper of heroic hearts, Made weak by time and fate, but strong in will To strive, to seek, to find, and not to yield.", "外国诗句", "Tennyson", 39),
  q("004.", 41, "虽然用掉很多了，但剩下的也还不少；虽然不像从前那样掀天动地了，但我们毕竟还是我们。光阴和命运削弱了几分壮志，但止不住那不老的雄心。去努力，去追求，去寻找，永不退却，不屈服。", "外国诗句译文", "Tennyson", 55),
  q("004.", 57, "子魂魄兮为鬼雄", "古诗名句", "屈原"),
  q("005.", 3, "通身是眼，不见自己，欲见自己，频掣驴耳", "禅宗语录", "古尊宿语录"),
  q("005.", 9, "大悲千手眼，哪个是正眼？", "禅宗语录", "古尊宿语录"),
  q("005.", 11, "如人夜间背手摸枕子", "禅宗语录", "古尊宿语录"),
  q("005.", 17, "遍身是手眼", "禅宗语录", "古尊宿语录"),
  q("005.", 19, "道也太煞道，祇道得八成", "禅宗语录", "古尊宿语录"),
  q("005.", 23, "通身是手眼", "禅宗语录", "古尊宿语录"),
  q("005.", 25, "天马行空", "成语", "题辞"),
  q("005.", 25, "莫名其妙", "成语", "题辞"),
  q("005.", 27, "通身是眼，不见自己", "禅宗语录", "古尊宿语录"),
  q("005.", 27, "The ass is known by his ears.", "外国谚语", "拉丁谚语"),
  q("005.", 27, "I am an ass, indeed; you may prove it by my long ears.", "外国文学名句", "Shakespeare"),
  q("006.", 7, "真金不怕火炼", "俗语", "题辞"),
  q("006.", 13, "金玉其外", "成语", "题辞"),
  q("006.", 13, "弄假成真", "成语", "题辞"),
  q("006.", 17, "原形毕现", "成语", "题辞"),
  q("006.", 29, "大器晚成", "成语", "题辞"),
  q("006.", 37, "默默无闻", "成语", "题辞"),
  q("006.", 49, "时穷节乃见", "古诗名句", "文天祥"),
  q("006.", 49, "板荡识忠臣", "古诗名句", "李世民"),
  q("006.", 49, "患难见真情", "俗语", "题辞"),
  q("007.", 5, "同时而不同代", "警句", "题辞"),
  q("007.", 9, "正人君子", "成语", "题辞"),
  q("007.", 9, "公事公办", "成语", "题辞"),
  q("007.", 9, "趁人于危", "成语", "题辞"),
  q("007.", 17, "放之四海而皆准", "成语", "题辞"),
  q("007.", 17, "俟诸百世而不惑", "古文成句", "孟子"),
  q("007.", 17, "光明正大", "成语", "题辞"),
  q("007.", 21, "盗亦有道", "成语", "庄子"),
  q("007.", 37, "看破红尘", "成语", "题辞"),
  q("007.", 37, "福善祸淫", "古文成句", "尚书"),
  q("009.", 17, "矛盾不能成事，矛盾只有苦恼。该把你选出的放大，再把落选的缩小，人间的是非太多，你不能全盘通晓；为了说你选的对，你必须说落选的不好。", "现代诗句", "李敖", 33),
  q("010.", 13, "满腹经纶", "成语", "题辞"),
  q("010.", 13, "一身傲骨", "成语", "题辞"),
  q("010.", 13, "艺高人胆大", "俗语", "题辞"),
  q("010.", 13, "虎口捋须", "成语", "题辞"),
  q("010.", 13, "太岁头上动土", "俗语", "题辞"),
  q("010.", 13, "四面树敌", "成语", "题辞"),
  q("010.", 13, "八面威风", "成语", "题辞"),
  q("010.", 15, "单干户", "俗语", "题辞"),
  q("010.", 15, "别怕，我抓到你了。", "外国漫画妙语", "报刊漫画"),
  q("010.", 15, "Don't worry-I've got you.", "外国漫画妙语", "报刊漫画"),
  q("011.", 3, "终身一言以行之", "古文成句", "论语"),
  q("011.", 7, "用大丈夫的气象，去面对吧！", "座右铭", "李敖"),
  q("011.", 9, "所谓大丈夫者，谓智之大也", "古文成句", "题辞"),
  q("011.", 9, "诚于中而形于外", "古文成句", "大学"),
  q("011.", 9, "拖泥带水", "成语", "题辞"),
  q("011.", 9, "快刀斩乱麻", "成语", "题辞"),
  q("011.", 15, "大丈夫气象", "格言", "题辞"),
  q("011.", 17, "阳刚的美", "美学成句", "题辞"),
  q("011.", 17, "阳刚之美", "美学成句", "题辞"),
  q("011.", 21, "过眼烟云", "成语", "题辞"),
  q("012.", 19, "我还没开始打呢！", "外国历史名言", "John Paul Jones"),
  q("012.", 19, "I have not yet begun to fight！", "外国历史名言", "John Paul Jones"),
  q("012.", 29, "于无声处听惊雷", "现代诗句", "鲁迅"),
  q("012.", 29, "落花流水", "成语", "题辞"),
  q("013.", 11, "得不偿失", "成语", "题辞"),
  q("013.", 11, "事半功倍", "成语", "题辞"),
  q("014.", 7, "人生识字忧患始", "古诗名句", "苏轼"),
  q("014.", 7, "人生作文忧患始", "化用诗句", "题辞"),
  q("014.", 7, "文章辜负苍生多", "古诗名句", "题辞"),
  q("014.", 7, "苍生辜负文章多", "化用诗句", "题辞"),
  q("014.", 7, "不问苍生问鬼神", "古诗名句", "李商隐"),
  q("014.", 11, "逞口舌之利", "成语", "题辞"),
  q("014.", 11, "明白而立即", "格言", "题辞"),
  q("014.", 13, "口口声声", "成语", "题辞"),
  q("014.", 15, "忘恩负义", "成语", "题辞"),
  q("014.", 15, "隐恶护短", "成语", "题辞"),
  q("014.", 15, "士林之耻", "成语", "题辞"),
  q("015.", 7, "博学多闻", "成语", "题辞"),
  q("015.", 7, "特立独行", "成语", "题辞"),
  q("015.", 7, "经世致用", "成语", "题辞"),
  q("015.", 7, "好学深思", "成语", "题辞"),
  q("015.", 7, "五体投地", "成语", "题辞"),
  q("015.", 7, "中道崩殂", "古文成句", "诸葛亮"),
  q("015.", 7, "劳燕分飞", "成语", "题辞"),
  q("015.", 7, "炉火纯青", "成语", "题辞"),
  q("015.", 9, "读书得间", "成语", "题辞"),
  q("015.", 9, "心灰意懒", "成语", "题辞"),
  q("015.", 9, "怀忧丧志", "成语", "题辞"),
  q("015.", 9, "困学知变", "成语", "题辞"),
  q("015.", 13, "愈久愈不变，愈不可为愈为。", "格言", "题辞"),
  q("016.", 9, "两虎相与斗而驽犬受其弊", "古文成句", "史记"),
  q("016.", 19, "人生须做天地间第一等事、为天地间第一等人", "古文成句", "清党湛"),
  q("016.", 21, "与其誉尧而非桀也，不如两忘而化其道。", "古文成句", "庄子"),
  q("017.", 5, "宁与燕雀翔，不随黄鹄飞。", "古诗名句", "沈约"),
  q("017.", 7, "黄鹄游四海，中路将安归？", "古诗名句", "沈约"),
  q("017.", 9, "若斯人者，不念己之短翮，不随燕雀为侣，而欲与黄鹄比游。黄鹄一举冲天，翱翔四海，短翮追而不逮，将安归乎？为其计者，宜与燕雀相随，不宜与黄鹄齐举。", "古文名句", "沈约"),
  q("017.", 13, "IT'S DIFFICULT TO SOAR WITH EAGLES WHEN YOU WORK WITH TURKEYS", "外国格言", "英文格言", 21),
  q("017.", 23, "当你与火鸡搅在一起，你就难于老鹰一块儿高飞了。", "外国格言译文", "英文格言"),
  q("017.", 25, "燕雀安知鸿鹄之志", "古文成句", "史记"),
  q("017.", 25, "牧野鹰扬", "成语", "题辞"),
  q("018.", 7, "自欺欺人", "成语", "题辞"),
  q("018.", 7, "见诸行事", "成语", "题辞"),
  q("018.", 7, "行以求知", "成语", "题辞"),
  q("018.", 7, "徒托空言", "成语", "题辞"),
  q("018.", 11, "不学有术", "成语", "题辞"),
  q("018.", 11, "立竿见影", "成语", "题辞"),
  q("018.", 23, "怀才不遇", "成语", "题辞"),
  q("018.", 29, "一通百通", "成语", "题辞"),
  q("018.", 31, "牛溲马勃", "成语", "题辞"),
  q("018.", 31, "拈之即来", "成语", "题辞"),
  q("018.", 31, "得心应手", "成语", "题辞"),
  q("018.", 35, "无中生有", "成语", "题辞"),
  q("018.", 35, "化邪为正", "格言", "题辞"),
  q("018.", 35, "化专知为博学", "格言", "题辞"),
  q("018.", 35, "化乱法为执法", "格言", "题辞"),
  q("018.", 37, "实学所以震真知，虚名所以撼俗世。都不可废也。", "现代诗句", "李敖", 41),
  q("019.", 3, "朋友们不需要惦挂着我。我觉得自己像一只快乐的小鸟，在这儿所能做的并不比外间少。", "外国人物语录", "Gandhi"),
  q("019.", 7, "其实没有什么不同，只是给了我小的不方便而已。", "格言", "李敖"),
  q("019.", 17, "志士仁人", "成语", "论语"),
  q("019.", 17, "至大至刚", "成语", "孟子"),
  q("019.", 17, "快乐的小鸟在哪里都是快乐的小鸟", "格言", "李敖"),
  q("020.", 3, "单刀直入", "成语", "题辞"),
  q("020.", 13, "人的音乐", "格言", "题辞"),
  q("020.", 15, "耳有同嗜", "古文成句", "孟子"),
  q("020.", 15, "心有灵犀", "成语", "题辞"),
  q("022.", 5, "可怜虫！", "外国故事语录", "Robert Bruce故事"),
  q("022.", 5, "你，也知道失败是怎么一回事了吧。", "外国故事语录", "Robert Bruce故事"),
  q("022.", 9, "我也要试着去干第七次！", "外国故事语录", "Robert Bruce故事"),
  q("022.", 11, "我曾听人这样说，从此以后，没有一个人曾经用着布鲁斯的名义去伤害过一只蜘蛛。那只小动物带给国王的教训，也将永垂不朽。", "外国故事语录", "Robert Bruce故事"),
  q("022.", 15, "万事悠悠心自知，强颜於世转参差。移床独卧秋风里，静看蜘蛛结网丝。", "古诗名句", "王安石", 17),
  q("023.", 5, "万世师表", "成语", "题辞"),
  q("023.", 5, "作之师", "古文成句", "尚书"),
  q("023.", 7, "不耻下问", "成语", "论语"),
  q("023.", 7, "入太庙，每事问", "古文成句", "论语"),
  q("023.", 7, "三人行，必有我师", "古文成句", "论语"),
  q("023.", 9, "当仁不让于师", "古文成句", "论语"),
  q("023.", 11, "以德报怨", "成语", "论语"),
  q("023.", 11, "何以报德", "古文成句", "论语"),
  q("023.", 13, "吾爱吾师，吾尤爱真理", "外国格言", "Aristotle"),
  q("023.", 15, "义无反顾", "成语", "题辞"),
  q("023.", 17, "莫我知也夫！", "古文成句", "论语"),
  q("023.", 17, "知我者，其天乎！", "古文成句", "论语"),
  q("023.", 17, "曲高和寡", "成语", "题辞"),
  q("023.", 17, "万世生表", "格言", "李敖"),
  q("024.", 9, "先天不足", "成语", "题辞"),
  q("024.", 9, "俗不可耐", "成语", "题辞"),
  q("024.", 9, "爱之以道、导之以正谊", "格言", "题辞"),
  q("024.", 9, "不务正业", "成语", "题辞"),
  q("024.", 9, "抱残守缺", "成语", "题辞"),
  q("024.", 9, "不成体统", "成语", "题辞"),
  q("025.", 59, "生龙活虎", "成语", "题辞"),
  q("026.", 3, "我现在用西餐叉子来吃了。", "外国笑话妙语", "报刊笑话"),
  q("026.", 5, "西餐叉子吃人肉", "格言", "李敖"),
  q("026.", 5, "不伦不类", "成语", "题辞"),
  q("026.", 5, "非牛非马", "成语", "题辞"),
  q("026.", 9, "周而复始", "成语", "题辞"),
  q("026.", 11, "哭笑不得", "成语", "题辞"),
  q("026.", 15, "一日千里", "成语", "题辞"),
  q("026.", 17, "更胜一筹", "成语", "题辞"),
  q("026.", 19, "乌烟瘴气", "成语", "题辞"),
  q("026.", 21, "机车速度一百二十公里，神骑骏马速度仅六十，追到时车祸已生，神亦保佑不及矣！", "笑话妙语", "题辞"),
  q("027.", 3, "伤人乎？不问马。", "古文成句", "论语"),
  q("027.", 5, "堕甑不顾", "成语典故", "后汉书"),
  q("027.", 7, "打脱牙齿和血吞", "俗语", "题辞"),
  q("027.", 11, "借酒浇愁", "成语", "题辞"),
  q("027.", 15, "一败涂地", "成语", "题辞"),
  q("027.", 15, "A cheerful loser is winner.", "外国格言", "题辞"),
  q("027.", 15, "一个快乐的失败者，本人就是另一个胜利者。", "外国格言译文", "题辞"),
  q("027.", 15, "洵可如是观", "古文成句", "题辞"),
  q("029.", 5, "多事总比少事好，有为总比无为好", "现代格言", "胡适"),
  q("029.", 5, "种瓜总可以得瓜，种豆总可以得豆，但不下种必不会有收获。", "现代格言", "胡适"),
  q("029.", 5, "何苦乃尔！", "古文成句", "题辞"),
  q("029.", 9, "朋友凋丧", "成语", "题辞"),
  q("029.", 9, "任重而道远", "古文成句", "论语"),
  q("029.", 21, "知其不可而为之", "古文成句", "论语"),
  q("029.", 21, "但能一切舍，管取佛欢喜", "佛教诗句", "题辞"),
  q("029.", 21, "愿以其身为蓐荐，使人寝处其上，溲溺垢秽之，吾无间焉，有欲割舍吾耳鼻者，吾亦欢喜施与", "佛教典故", "佛典"),
  q("029.", 25, "收成是很多的，可惜工作的人太少了！", "宗教语录", "新约"),
  q("029.", 31, "无心插柳，也可成荫；有意栽花，岂能完全不活！", "格言", "胡适"),
  q("029.", 35, "交友以自大其身", "现代格言", "胡适"),
  q("029.", 35, "善做上卷书", "格言", "题辞"),
  q("030.", 9, "虽欲噬脐，亦无及矣！", "古文成句", "左传"),
  q("030.", 9, "噬脐莫及", "成语", "左传"),
  q("030.", 11, "宾孟适郊，见雄鸡自断其尾。", "古文成句", "左传"),
  q("030.", 11, "自惮其牺也！", "古文成句", "左传"),
  q("030.", 11, "鸡其惮其为人用乎！人异于是。牺者实用人也，人牺实难，已牺何害？", "古文成句", "左传"),
  q("030.", 13, "人牺实难", "古文成句", "左传"),
  q("030.", 13, "已牺何害？", "古文成句", "左传"),
  q("030.", 17, "余闻麝被逐则自抉其脐；猩猩被执则噬其肤；蚺蛇取胆者或不死，见人示其创处；翠碧人网得之，不急取则断其羽毛。凡物惮为世用者，其虑皆知出此，然不若雄鸡先患儿预图之。", "古文成句", "唐宋笔记"),
  q("034.", 3, "我没有别的理由，我只有女人的理由；我认为他最好，因为我认为他最好。", "外国文学名句", "Shakespeare"),
  q("034.", 15, "我认为他有罪，因为我认为他有罪", "格言", "题辞"),
  q("034.", 17, "莫须有", "成语典故", "宋史"),
  q("034.", 17, "莫须有三字，何以服天下？", "古文成句", "宋史"),
  q("034.", 27, "狼不愁没有罪名", "外国谚语", "题辞"),
  q("034.", 29, "只要快点杀掉，还怕没有理由吗？", "格言", "题辞"),
  q("034.", 31, "欲加之罪，其无辞乎？", "古文成句", "左传"),
  q("034.", 31, "欲加之罪，何患无辞", "成语", "左传"),
  q("034.", 31, "给狗一条罪名，就可吊死它", "外国格言", "题辞"),
  q("034.", 31, "给我六行贵人之言，我就能找到理由吊死他", "外国格言", "题辞"),
  q("034.", 33, "皇天后土，可以表明我的心", "古文成句", "题辞"),
  q("034.", 33, "一面之词", "成语", "题辞"),
  q("034.", 35, "不值一驳", "成语", "题辞"),
  q("034.", 37, "若合符节", "成语", "题辞"),
  q("034.", 39, "一辩就俗！", "格言", "题辞"),
  q("036.", 5, "临财毋苟得，临难毋苟免。", "古文成句", "礼记"),
  q("038.", 19, "语焉不详", "成语", "题辞"),
  q("038.", 23, "侠骨柔情", "成语", "题辞"),
  q("040.", 49, "有谁软弱，我不软弱呢？有谁跌倒，我不焦急呢？", "宗教语录", "新约"),
  q("042.", 9, "如果你不该打，他打你，他是妄人，你不必和妄人计较；如果你该打，他打你，你自己评判吧！", "人物语录", "蔡元培"),
  q("043.", 23, "任何傻瓜都能指挥，但指挥出来的是音乐，可就难了！", "外国艺术家语录", "Toscanini"),
  q("043.", 23, "你是个无知的蠢货！有音乐的地方，就是圣地！要脱帽的，笨蛋！", "外国艺术家语录", "Toscanini"),
  q("044.", 7, "岁月不待人。可是岁月为三十岁女人常驻。", "外国诗人妙语", "Robert Frost"),
  q("044.", 7, "外交家是这样一种人——记得女人的生日，却忘了她的年龄。", "外国诗人妙语", "Robert Frost"),
  q("044.", 9, "母亲花二十年的工夫使男孩变成男人，可是另个女人却花二十分钟使男人变成傻瓜。", "外国诗人妙语", "Robert Frost"),
  q("044.", 11, "银行是这样一个地方——他们在晴天借你雨伞，下雨又收了回去。", "外国诗人妙语", "Robert Frost"),
  q("045.", 3, "幸亏我趁早开溜，他已经反过来向我发问了！", "外国科学家语录", "Einstein"),
  q("045.", 5, "应以人类未来的幸福与安全着眼。", "外国科学家语录", "Einstein"),
  q("045.", 5, "物理学家已经知道罪恶，这是他们摆脱不掉的知识。", "外国科学家语录", "Oppenheimer"),
  q("045.", 9, "世界是不能对知识因噎废食的。", "外国科学家语录", "Oppenheimer"),
  q("046.", 7, "有益于狮子的健康", "外国笑话妙语", "报刊笑话"),
  q("047.", 3, "我花了四十三年才熬上通用公司董事长，如今只花四十三秒，就离开了。", "外国商业人物语录", "Charles Wilson"),
  q("049.", 3, "倡优畜之", "古文成句", "史记"),
  q("049.", 3, "毫不相干", "成语", "题辞"),
  q("049.", 7, "权力使人腐化，诗使人净化", "外国文学妙语", "Kennedy"),
  q("050.", 7, "除了天才，别无他物。", "外国艺术家语录", "Whistler"),
  q("050.", 11, "懦种用吻，勇士用剑。", "外国文学名句", "Whistler"),
  q("050.", 11, "挥利剑以斩情丝", "格言", "题辞"),
  q("051.", 17, "唾面自干", "成语典故", "新唐书"),
  q("051.", 13, "祭司长和全公会，寻找假见证，控告耶稣，要治死他。虽有好些人来做假见证，总得不着实据。末后有两个人前来说，这个人曾说：我能拆毁神的殿，三日内又建造起来。", "宗教语录", "新约"),
  q("051.", 13, "大祭司就撕开衣服，说：我们何必再用见证人呢？你们已经听见他这僭妄的话了，你们的意见如何？他们都定他该死的罪。就有人吐唾沫在他脸上，又蒙着他的脸，用拳头打他，对他说：你说预言吧！差役接过他来，用手掌打他。", "宗教语录", "新约"),
  q("051.", 17, "人辱我吐我，我并不掩面。主耶和华必帮助我，所以我不抱愧。我硬着脸面好像坚石，我也知道我必不致蒙羞。", "宗教语录", "旧约"),
];

const scopeNote =
  "校对轮收录：《第一流人的境界》中可独立检索的诗文、典故、成语、俗语、格言、宗教语录与少量李敖式成句；现代政论判断、政党/制度/统独/民主自由口号式语录不收；现代政治事件段中只作普通修辞的短成语从严剔除。";

function autoSummary(quoteText, category) {
  return `本书在相关章节引用或使用“${quoteText}”，校对轮保留其可独立检索的${category}性质。`;
}

const duplicateMap = new Map();
for (const row of rawRows) {
  const key = normalizeText(row.quoteText);
  duplicateMap.set(key, (duplicateMap.get(key) || 0) + 1);
}

const records = rawRows.map((row, index) => {
  const snippet = sourceSnippet(row.fileName, row.lineStart, row.lineEnd);
  const normalizedSnippet = normalizeText(snippet);
  const normalizedQuote = normalizeText(row.quoteText);
  if (!normalizedSnippet.includes(normalizedQuote)) {
    throw new Error(
      `Quote not found in source for ${row.fileName}:${row.lineStart}-${row.lineEnd}\n` +
        `quote=${row.quoteText}\nsource=${snippet}`
    );
  }
  if ((duplicateMap.get(normalizedQuote) || 0) > 1) {
    throw new Error(`Duplicate quote_text in rawRows: ${row.quoteText}`);
  }
  return {
    id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
    book,
    chapter: row.fileName.replace(/\.txt$/u, ""),
    source_file: row.fileName,
    line_start: row.lineStart,
    line_end: row.lineEnd,
    quote_text: row.quoteText,
    category: row.category,
    source_or_origin: row.sourceWork,
    summary: row.note || autoSummary(row.quoteText, row.category),
    notes: scopeNote,
  };
});

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(filePath, rows) {
  const headers = [
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
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(filePath, rows) {
  const lines = [];
  for (const row of rows) {
    lines.push(`${row.id} ${row.quote_text}`);
    lines.push(`  出处：${row.book} / ${row.chapter}:${row.line_start}-${row.line_end}`);
    lines.push(`  类型：${row.category}；来源：${row.source_or_origin}`);
    lines.push("");
  }
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

function audit(rows) {
  const problems = [];
  const seenIds = new Set();
  const seenQuotes = new Set();
  const politicalPattern =
    /(国民党|民进党|共产党|民主|自由|革命|政府|总统|选举|政权|宪法|立委|党外|统一|独立|台独|台湾|中国|中华民国|中华人民共和国|警备总部|白色恐怖|戒严|政治|政党|议会|立法院|行政院|司法院|总统府|法务部|监察院|外交部|军法|军队|两岸|大陆|敌人|斗争|阶级|民族主义|国家主义|爱国主义|主义)/u;
  for (const row of rows) {
    if (seenIds.has(row.id)) problems.push(`duplicate id: ${row.id}`);
    seenIds.add(row.id);
    const key = normalizeText(row.quote_text);
    if (seenQuotes.has(key)) problems.push(`duplicate quote: ${row.quote_text}`);
    seenQuotes.add(key);
    if (politicalPattern.test(row.quote_text)) {
      problems.push(`political-looking quote: ${row.id} ${row.quote_text}`);
    }
  }
  return problems;
}

const exportDir = path.join(root, "exports");
const analysisDir = path.join(root, "analysis");
ensureDir(exportDir);
ensureDir(analysisDir);

const csvPath = path.join(exportDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(exportDir, `${book}_诗文格言歌谣引用.txt`);
const jsonPath = path.join(analysisDir, "liao_first_class_realm_selected_rows.json");
const reportPath = path.join(analysisDir, "liao_first_class_realm_proofread_build_report.json");

writeCsv(csvPath, records);
writeTxt(txtPath, records);
fs.writeFileSync(jsonPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");

const problems = audit(records);
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      book,
      stage: "proofread",
      rows: records.length,
      firstId: records[0]?.id,
      lastId: records[records.length - 1]?.id,
      problems,
      csvPath,
      txtPath,
      jsonPath,
    },
    null,
    2
  )}\n`,
  "utf8"
);

console.log(`book: ${book}`);
console.log(`rows: ${records.length}`);
console.log(`csv: ${path.relative(root, csvPath)}`);
console.log(`txt: ${path.relative(root, txtPath)}`);
console.log(`json: ${path.relative(root, jsonPath)}`);
console.log(`auditProblems: ${problems.length}`);
if (problems.length) {
  for (const problem of problems) console.log(`- ${problem}`);
  process.exitCode = 1;
}
