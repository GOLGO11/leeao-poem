const fs = require("fs");
const path = require("path");

const book = "红色11";
const idPrefix = "LAHS11";
const generatedDate = "2026-06-19";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "004.小说剧本类",
  "003.红色11",
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

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
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

const firstAct = "002.第一幕——夏至.txt";
const secondAct = "003.第二幕——秋分.txt";
const thirdAct = "004.第三幕——冬至.txt";

const data = [
  row(firstAct, 293, 293, "白虎临身日，临身必有灾。", "小说引文", "《警世通言》", "解释白虎凶神时转引古小说中的俗信句。"),
  row(firstAct, 293, 293, "前朱鸟而后玄武，左青龙而右白虎。", "古书引文", "《礼记》", "解释四象方位时引《礼记》古句。"),
  row(firstAct, 297, 297, "见者主有喜庆", "古书引文", "《岭南异物志》，李时珍《本草纲目》转引", "说明变色龙吉兆时引古书评价。"),
  row(firstAct, 297, 297, "啮人不可疗", "古书引文", "李时珍《本草纲目》", "说明变色龙危险时引古书警语。"),
  row(firstAct, 315, 315, "此何遽不为福乎？", "寓言引文", "《淮南子》塞翁失马故事", "讲塞翁失马寓言时引塞翁语。"),
  row(firstAct, 315, 315, "此何遽不能为祸乎？", "寓言引文", "《淮南子》塞翁失马故事", "讲塞翁失马寓言时引塞翁语。"),
  row(firstAct, 315, 315, "塞翁失马，焉知非福", "成语典故", "《淮南子》塞翁失马故事", "概括祸福相倚的传统寓言。"),
  row(firstAct, 315, 315, "福之为祸，祸之为福，化不可极，深不可测", "古书引文", "《淮南子》", "说明祸福变化难测时引《淮南子》。"),
  row(firstAct, 315, 315, "其为政也，善因祸而为福，转败而为功", "史书引文", "司马迁《史记》评管仲", "比较管仲哲学时引《史记》评语。"),
  row(firstAct, 315, 315, "祸兮福之所倚，福兮祸之所伏", "古书引文", "《老子》", "说明祸福倚伏时引老子名句。"),
  row(firstAct, 315, 315, "祸福无不自己求之者", "儒家引文", "《孟子》", "讨论人对祸福的主动性时引孟子。"),
  row(firstAct, 315, 315, "祸之来也，人自生之；福之来也，人自成之。祸与福同门，利与害为邻", "古书引文", "《淮南子》", "从祸福一体谈人生处境时引《淮南子》。"),
  row(firstAct, 315, 315, "管仲之器小哉！", "论语成句", "《论语》", "由管仲哲学推及人生时引孔子评管仲成句。"),
  row(firstAct, 315, 315, "天下不如意，恒十居七八", "古人格言", "晋代贤者语", "说明人生不如意之多时引古人格言。"),
  row(firstAct, 315, 315, "如果在马路上跌倒了，不要立刻爬起来，先东张西望找找看，说不定会捡到什么宝贝，这一跤也不算白跌。", "民间格言", "友人父亲语", "以跌倒找宝的口头格言说明因祸为福。"),
  row(firstAct, 389, 389, "从不曾想到我是给关起来了，高墙实在等于浪费材料……他们根本不知道如何对付我……他们总以为我唯一的目的是想站到墙外面。每在我沉思的时候，看守那种紧张样子，真教人好笑。他们哪里知道才一转身，我就毫无阻挡的跟着出去了……", "外国文学引文", "梭罗《湖滨散记》相关语", "讲狱中精神自由时转引梭罗坐牢语。"),
  row(firstAct, 389, 389, "肉体虽给关起来，灵魂并没关起来", "外国名言", "甘地语", "承接梭罗狱中自由观时引甘地语。"),
  row(firstAct, 389, 389, "问题的关键，还在一个人自己和他所持的心理状态", "外国名言", "甘地语意", "说明自由感受取决于心理状态时引甘地说法。"),
  row(firstAct, 389, 389, "他们抓了我，却给了我自由。", "外国名言", "甘地语", "说明不自由中的精神自由时引甘地语。"),
  row(firstAct, 397, 397, "没有人能完全自由，除非所有人完全自由；没有人能完全道德，除非所有人完全道德；没有人能完全快乐，除非所有人完全快乐。", "外国哲学格言", "斯宾塞语", "讨论自由与共同命运时引斯宾塞格言。"),
  row(firstAct, 397, 397, "有谁软弱，我不软弱呢？有谁跌倒，我不焦急呢？", "宗教经典", "《新约·哥林多后书》第十一章", "说明民胞物与心境时引新约句。"),
  row(firstAct, 415, 415, "仁者不忧", "论语成句", "《论语》", "讨论仁者是否忧心时引孔子语。"),
  row(firstAct, 415, 415, "先天下之忧而忧", "宋文名句", "范仲淹《岳阳楼记》", "反驳仁者不忧时引范仲淹名句。"),
  row(firstAct, 415, 415, "悠悠我心忧", "诗文名句", "文天祥相关诗句", "说明仁者忧思时引文天祥句。"),
  row(firstAct, 415, 415, "生年不满百，常怀千岁忧", "古诗名句", "《古诗十九首》", "说明仁者常忧时引古诗句。"),
  row(firstAct, 415, 415, "后天下之乐而乐", "宋文名句", "范仲淹《岳阳楼记》", "讨论范仲淹忧乐观时引名句。"),
  row(firstAct, 431, 431, "世界上三样最可靠的东西是老妻、老狗和现金", "外国格言", "富兰克林语意", "谈务实人生观时引富兰克林格言。"),
  row(firstAct, 435, 435, "我从不伤害一个女人，或是与女人为伍的一个男人。", "文学引文", "罗宾汉传说", "讲罗宾汉临终故事时转述其原则。"),
  row(firstAct, 435, 435, "Nay, I cannot grant that boon, for never have I injured a woman or a man in woman's company.", "英文文学引文", "罗宾汉传说", "同一罗宾汉临终故事中的英文原句。"),
  row(firstAct, 435, 435, "埋我在箭落的地方。", "文学引文", "罗宾汉传说", "讲罗宾汉临终射箭选墓地的传说。"),
  row(firstAct, 435, 435, "Lay me where the arrow drops.", "英文文学引文", "罗宾汉传说", "罗宾汉临终语的英文原句。"),
  row(firstAct, 435, 435, "盗亦有道", "庄子成语", "《庄子·胠箧》语意", "讲罗宾汉劫富济贫时借用传统成语。", "校对补入。"),
  row(firstAct, 525, 525, "放下屠刀，立地成佛", "佛教成语", "佛教俗语", "讨论信佛与忏悔时引佛教俗语。"),
  row(firstAct, 559, 559, "鼎镬甘如饴", "诗文引文", "文天祥《正气歌》", "谈文天祥受刑不惧时引《正气歌》。"),
  row(firstAct, 587, 587, "旧时处长堂前狗，牵入调查局长家。", "改写诗句", "李敖改写刘禹锡《乌衣巷》句", "以改写唐诗调侃处长旧犬被带走。"),
  row(firstAct, 591, 591, "有施必有报、有感必有应", "佛教成语", "佛教因果说", "说明报应思想时引佛教因果语。"),
  row(firstAct, 591, 591, "善有善报、恶有恶报", "民间俗语", "传统因果俗语", "说明善恶报应时引民间俗语。"),
  row(firstAct, 591, 591, "种瓜得瓜、种豆得豆", "民间俗语", "传统因果俗语", "说明因果对应时引民间俗语。"),
  row(firstAct, 603, 603, "欲加之罪，其无辞乎？", "左传引文", "《左传》里克语", "说明罗织罪名时引《左传》。"),
  row(firstAct, 603, 603, "欲加之罪，何患无辞", "传统谚语", "由《左传》句演变的中国谚语", "说明罗织罪名不愁无辞。"),
  row(firstAct, 603, 603, "给狗一条罪名，就可吊死它", "西方谚语", "英语谚语", "与中国谚语并列说明罗织罪名。"),
  row(firstAct, 603, 603, "Give a dog a bad name and hang him", "英文谚语", "英语谚语", "同一谚语的英文原文。"),
  row(firstAct, 603, 603, "给我六行贵人之言，我就能找到理由吊死他", "外国格言", "利希留语", "说明权力寻找罪名时引利希留名言。"),
  row(firstAct, 603, 603, "莫须有", "历史成语", "秦桧构陷岳飞典故", "举岳飞案时提及传统冤狱成语。"),
  row(firstAct, 603, 603, "皇天后土，可以表明我的心", "史传引文", "岳飞语", "讲岳飞被捕时引其表白之语。"),
  row(firstAct, 639, 639, "鸟之将死，其鸣也哀；人之将死，其言也善", "论语成句", "《论语·泰伯》", "判死刑后的自省处境中引孔子门人语。"),
  row(firstAct, 731, 731, "韩信点兵，多多益善。", "历史成语", "韩信典故", "以韩信点兵说明囚房人多。"),
  row(firstAct, 731, 731, "天下之刖者多矣！", "古书引文", "和氏璧故事相关语", "讲刖刑普遍时引古书句。"),
  row(firstAct, 731, 731, "踊贵而履贱", "古书成语", "古书关于刖刑与鞋价之语", "解释踊跃一词时引古书成语。"),
  row(firstAct, 825, 825, "千万别同警察交朋友，因为你不晓得他什么时候公事公办。", "外国谚语", "美国黑社会谚语", "谈警察翻脸无情时引美国黑社会谚语。"),
  row(firstAct, 831, 831, "替天行道", "传统成语", "传统侠义语", "流氓自辩时借用侠义成语。"),
  row(firstAct, 883, 883, "不识庐山真面目，只缘身在此山中。", "宋诗名句", "苏轼《题西林壁》", "王九胆套用苏轼诗句调侃处境。"),
  row(firstAct, 885, 885, "何其太雅！", "小说引文", "《红楼梦》贾宝玉语", "称赞粗俗语境中背苏轼诗时引《红楼梦》。"),
  row(firstAct, 899, 899, "为屄生，为屄死，为屄辛苦为屄忙", "戏谑对联", "民间粗俗对联", "欧卡曾口中转述的粗俗对联上联。"),
  row(firstAct, 899, 899, "吃屄亏，上屄当，最后死在屄床上", "戏谑对联", "民间粗俗对联", "欧卡曾口中转述的粗俗对联下联。"),
  row(firstAct, 899, 899, "不能没屄", "戏谑对联", "民间粗俗对联", "欧卡曾口中转述的粗俗对联横批。"),
  row(firstAct, 995, 995, "情到多时情转薄", "词句", "古人词句", "谈友情用情淡薄时引古人词句。"),
  row(firstAct, 999, 999, "时光一逝永不回……", "歌词", "流行歌曲歌词", "欧卡曾唱歌时引出的一句歌词。", "校对补入。"),
  row(firstAct, 1015, 1015, "狗咬吕洞宾，不识好人心", "民间俗语", "传统俗语", "欧卡曾用俗语为自己唱歌辩解。", "校对补入。"),
  row(secondAct, 357, 357, "力恶其不出于身也，不必为己", "礼记引文", "《礼记·礼运》", "比较理想社会时引《礼记》大同篇语。"),
  row(secondAct, 357, 357, "货恶其弃于地也，不必藏于己", "礼记引文", "《礼记·礼运》", "比较理想社会时引《礼记》大同篇语。"),
  row(secondAct, 569, 569, "……大祭司就撕开衣服说：他说了僭妄的话，我们何必再用见证人呢？这僭妄的话，现在你们都听见了。你们的意见如何？他们回答说：他是该死的。他们就吐唾沫在他脸上，用拳头打他，也有用手掌打他的。说：基督啊！你是先知，告诉我们打你的是谁？", "宗教经典", "《马太福音》第二十六章", "反驳宗教和谐论时引耶稣受审经文。"),
  row(secondAct, 569, 569, "……大祭司就撕开衣服，说：我们何必再用见证人呢？你们已经听见他这僭妄的话了，你们的意见如何？他们都定他该死的罪。就有人吐唾沫在他脸上，又蒙着他的脸，用拳头打他，对他说：你说预言罢！差役接过他来，用手掌打他。", "宗教经典", "《马可福音》第十四章", "继续引耶稣受审受辱的经文。"),
  row(secondAct, 569, 569, "巡抚的兵就把耶稣带进衙门，叫全营的兵都聚集在他那里。他们给他脱了衣服，穿了一件朱红色袍子。用荆棘编作冠冕，戴在他头上。拿一根苇子放在他右手里，跪在他面前，戏弄他说：恭喜犹太人的王啊！又吐唾沫在他脸上，拿苇子打他的头。戏弄完了，就给他脱了袍子，仍穿上他自己的衣服，带他出去，要钉十字架。", "宗教经典", "《马太福音》第二十七章", "引耶稣被兵丁戏弄的经文。"),
  row(secondAct, 569, 569, "兵丁把耶稣带进衙门院里，叫齐了全营的兵。他们给他穿上紫袍，又用荆棘编作冠冕给他戴上。就庆贺他说：恭喜犹太人的王啊！又拿一根苇子打他的头，吐唾沫在他脸上，屈膝拜他。戏弄完了，就给他脱了紫袍，仍穿上他自己的衣服，带他出去，要钉十字架。", "宗教经典", "《马可福音》第十五章", "引《马可福音》中耶稣受辱经文。"),
  row(secondAct, 583, 583, "人在屋檐下，不得不低头。", "民间俗语", "传统俗语", "胡牧师自嘲处境时引俗语。"),
  lineRow(secondAct, 589, 601, "宗教经典", "《哥林多后书》第六章第八至十节", "胡牧师引保罗书信鼓励龙头。"),
  lineRow(secondAct, 607, 613, "宗教经典", "《哥林多后书》第四章第八至九节", "龙头回应胡牧师时背诵保罗书信。"),
  row(secondAct, 621, 621, "唯独亵渎圣灵的总不得赦免。", "宗教经典", "《路加福音》相关经文", "讨论宽恕与恶时引福音书句。"),
  row(thirdAct, 13, 13, "鸡虚憍而恃气", "庄子引文", "《庄子》斗鸡故事", "讲临危修养时引纪渻子养斗鸡故事。"),
  row(thirdAct, 13, 13, "呆若木鸡", "庄子成语", "《庄子》斗鸡故事", "讲修养境界时引成语。"),
  row(thirdAct, 13, 13, "真人不露相", "传统俗语", "传统俗语", "说明深藏不露时引俗语。"),
  row(thirdAct, 21, 21, "菩萨低眉，金刚怒目", "佛教成语", "佛教形象成语", "说明仁心与狠心并存时引佛教成语。"),
  row(thirdAct, 21, 21, "霹雳手段，菩萨心肠", "传统格言", "传统处世格言", "说明强硬手段与慈悲心肠并存。"),
  row(thirdAct, 73, 73, "火里来，水里去", "传统俗语", "传统俗语", "写火烧老鼠入海时借用俗语。", "校对补入。"),
  row(thirdAct, 213, 213, "大伪若真，大邪若正，大私若公，大害若利。", "古话格言", "古话", "讲真假善恶易混时引古话。"),
  row(thirdAct, 221, 221, "独善其身", "孟子成语", "《孟子》语意", "批评消极好人时反复引用成语。"),
  row(thirdAct, 221, 221, "普渡众生", "佛教成语", "佛教语", "与独善其身相对，说明向外行善。"),
  row(thirdAct, 225, 225, "乃若其情，则可以为善矣，乃所谓善也。", "孟子引文", "《孟子》", "批评动机论时引孟子语。"),
  row(thirdAct, 225, 225, "事之实为", "清儒引文", "俞正燮语", "解释孟子所谓情时引俞正燮说法。"),
  row(thirdAct, 225, 225, "至善只是此心纯乎天理之极便是。", "理学引文", "王阳明语", "批评心学式善心论时引王阳明。"),
  row(thirdAct, 225, 225, "善意铺成了到地狱之路。", "西方格言", "西方谚语", "说明善意无行动仍会导致坏结果。"),
  row(thirdAct, 225, 225, "Hell is paved with good intentions.", "英文谚语", "西方谚语", "同一格言的英文原文。"),
  row(thirdAct, 271, 271, "当然他会宽恕，他是干那行的啊。", "外国文学轶语", "海涅临终轶语", "胡牧师转述余三共引用海涅临终答牧师语。"),
  row(thirdAct, 271, 271, "人造罗马，也不能一天造成啊！", "西方谚语", "罗马非一日建成", "胡牧师劝人慢慢来时转述西方谚语。", "校对补入。"),
  row(thirdAct, 321, 321, "真金不怕火炼", "传统俗语", "传统俗语", "以火炼比喻优秀分子的考验。"),
  row(thirdAct, 415, 415, "特立独行", "传统成语", "传统人格成语", "胡牧师称龙头有中国知识分子缺乏的独立人格。"),
  row(thirdAct, 415, 415, "“立德”、“立言”、“立功”三不朽", "左传典故", "《左传》三不朽说", "评价龙头人格与文章时引三不朽。"),
  row(thirdAct, 415, 415, "一言而为天下法", "古文名句", "传统士人评价语", "评价龙头文章影响时引名句。"),
  row(thirdAct, 415, 415, "匹夫而为百世师", "古文名句", "传统士人评价语", "评价龙头人格榜样时引名句。"),
  row(thirdAct, 415, 415, "知其不可而为之", "论语成句", "《论语》相关语", "比较唐吉诃德式行为时引传统成句。"),
  row(thirdAct, 415, 415, "不知其不可而为之", "化用成句", "李敖化用“知其不可而为之”", "用反向化用批评唐吉诃德不识现实。"),
  row(thirdAct, 415, 415, "天视自我民视，天听自我民听", "尚书引文", "《尚书》语意", "讨论传统个人价值时引天民关系古语。"),
  row(thirdAct, 415, 415, "善与人同", "孟子成语", "《孟子》语意", "评论理想转向平庸时借用成语。"),
  row(thirdAct, 415, 415, "太平犬", "传统成语", "传统俗语", "形容只求安稳终老的姿态。"),
  row(thirdAct, 441, 441, "临财毋苟得，临难毋苟免。", "礼记引文", "《礼记》", "以笑话引出古书中利害关头的行为准则。"),
  row(thirdAct, 441, 441, "碰到金钱，不要随便拿；遇到危难，不要随便躲。", "古文白话译文", "《礼记》句白话解释", "解释临财毋苟得、临难毋苟免。"),
  row(thirdAct, 441, 441, "成功不必在我", "传统格言", "传统志业格言", "讲志士仁人播种未必亲见成果时引格言。"),
  row(thirdAct, 441, 441, "一点点生活的不舒适，不要看作是苦刑。我们都是自愿选择受苦的斗士，几个月的监狱生活，算不了什么。", "外国名言", "甘地语", "说明狱中牺牲与苦行精神时引甘地。"),
  row(thirdAct, 441, 441, "……朋友们不需要惦挂着我，我觉得自己像一只快乐的小鸟，在这儿所能做的并不比外间少。我留居在此，对我有如进学校。", "外国书信引文", "甘地狱中书信", "讲甘地在狱中的从容心境。"),
  lineRow(thirdAct, 601, 607, "诗歌", "汪精卫狱中诗", "引用汪精卫被判死刑时所写的四句诗。"),
  lineRow(thirdAct, 611, 617, "改写诗歌", "李敖改写汪精卫狱中诗", "李敖将汪精卫诗改成现代狱中处境的反讽版本。"),
  row(thirdAct, 619, 619, "二十年后还是一条好汉", "民间俗语", "传统好汉俗语", "讲旧式临刑英雄姿态时引俗语。"),
  row(thirdAct, 619, 619, "千古艰难唯一死", "传统格言", "传统生死格言", "说明旧时代好汉以死明志的心理。"),
  row(thirdAct, 619, 619, "人之将死，其言也善。", "论语成句", "《论语·泰伯》", "评克兰玛临刑语时引论语成句。"),
  row(thirdAct, 631, 631, "死当为厉鬼以杀贼", "史传名句", "张巡临死语", "谈死后为厉鬼杀贼的传统说法。"),
  row(thirdAct, 641, 641, "生年不满百，长怀千岁忧", "古诗名句", "《古诗十九首》异文", "余三共感慨高人忧患时引古诗异文。"),
  row(thirdAct, 755, 755, "放之四海而皆准", "中庸成语", "《礼记·中庸》语意", "谈对敌人道德的普遍性时引用成语。"),
  row(thirdAct, 755, 755, "俟诸百世而不惑", "中庸成语", "《礼记·中庸》语意", "谈道德不能永远通行时引用成语。"),
  row(thirdAct, 893, 893, "贼咬一口烂三分", "民间俗语", "传统俗语", "解释被牵连者难以脱身时引俗话。"),
  row(thirdAct, 965, 965, "见有一匹灰色马，骑在马上的，名字叫作死。", "宗教经典", "《新约·启示录》第六章第八节", "解释电影英文名典故时引启示录中文句。"),
  row(thirdAct, 965, 965, "So I looked and behold a pale horse. And the name of him who sat on it was Death.", "英文圣经引文", "《新约·启示录》第六章第八节", "同一启示录典故的英文原文。"),
  row(thirdAct, 1001, 1001, "老僧为百万生灵，何惜如来一戒！", "佛教故事引文", "破山和尚故事", "说明破执与开戒时引破山和尚语。"),
  row(thirdAct, 1013, 1013, "水清无大鱼", "传统俗语", "传统俗语", "谈不能排除小人物时引俗语。"),
  row(thirdAct, 1023, 1023, "三生有幸", "传统成语", "传统成语", "余三共感谢龙头开导时引俗话。"),
];

const excluded = [
  {
    file: firstAct,
    line: 133,
    text: "左倾幼稚病",
    reason: "列宁政治术语，按不要政治语录排除。",
  },
  {
    file: secondAct,
    line: 357,
    text: "各尽所能 / 各取所需",
    reason: "现代政治口号化表达，虽有古典对照，本身不收。",
  },
  {
    file: thirdAct,
    line: 265,
    text: "星星之火，可以燎原",
    reason: "政治口号/领袖语境，排除。",
  },
  {
    file: thirdAct,
    line: 89,
    text: "上有政策下有对策",
    reason: "政策语境中的现代套语，按不要政治语录排除。",
  },
  {
    file: thirdAct,
    line: 225,
    text: "虽恶不罚 / 虽善不赏",
    reason: "校对剔除：作者概括动机论后果，缺少明确外部出处。",
  },
  {
    file: thirdAct,
    line: 271,
    text: "大破才能大立",
    reason: "革命语境中的现代口号化表达，排除。",
  },
  {
    file: thirdAct,
    line: 397,
    text: "While there is a lower class I am in it. / 只要狱底有游魂，我就不自由。",
    reason: "戴布兹现代劳工政治语录，首轮从严排除。",
  },
  {
    file: thirdAct,
    line: 221,
    text: "This country will not be a really good place for any of us to live in if it is not a really good place for all of us to live in.",
    reason: "老罗斯福现代公共政治格言，首轮从严排除。",
  },
  {
    file: thirdAct,
    line: 1005,
    text: "我已经成为一个共产党员……",
    reason: "毕加索政治声明，排除。",
  },
  {
    file: thirdAct,
    line: 1009,
    text: "War is much too important a matter to be left to the generals.",
    reason: "现代政治军事格言，本轮从严排除。",
  },
  {
    file: thirdAct,
    line: 1013,
    text: "偶尔叛点小乱，亦佳事也。 / A little rebellion now and then is a good thing.",
    reason: "杰斐逊政治语录，排除。",
  },
];

data.forEach((item, index) => {
  item.id = `${idPrefix}${String(index + 1).padStart(3, "0")}`;
});

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

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
  ...data.map((item) => columns.map((column) => csvEscape(item[column])).join(",")),
].join("\n");

const txt = data
  .map((item) => {
    return [
      `${item.id}｜${item.book}｜${item.chapter}`,
      `位置：${item.source_file}:${item.line_start}-${item.line_end}`,
      `类别：${item.category}`,
      `来源：${item.source_or_origin}`,
      `引文：${item.quote_text}`,
      `说明：${item.summary}`,
      item.notes ? `备注：${item.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  })
  .join("\n\n");

const auditRows = [
  ["decision", ...columns],
  ...data.map((item) => [
    item.notes.includes("校对补入") ? "add" : "keep",
    ...columns.map((column) => item[column]),
  ]),
  ...excluded.map((item) => [
    "exclude",
    "",
    book,
    chapterFromFile(item.file),
    item.file,
    item.line,
    item.line,
    item.text,
    "",
    item.reason,
    "校对排除。",
  ]),
];

const categoryCounts = data.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});

const report = [
  `《${book}》诗文格言歌谣引用校对轮报告`,
  `生成日期：${generatedDate}`,
  `校对后保留条目：${data.length}`,
  `校对补入：${data.filter((item) => item.notes.includes("校对补入")).length}`,
  `校对排除/风险记录：${excluded.length}`,
  "",
  "分类统计：",
  ...Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `- ${category}：${count}`),
  "",
  "筛选说明：",
  "- 保留典籍、古诗文、宗教经典、成语谚语、文学格言、戏谑对联等明确引用材料。",
  "- 剔除政治口号、党派声明、领袖语录、政策/军事格言等不符合本项目目标的材料。",
  "- 汪精卫诗与李敖改诗按诗歌材料保留；政治标签、口号化语句另行排除。",
  "- 本轮补入歌词、俗语、成语等漏项；剔除缺少外部来源的作者归纳短语。",
].join("\n");

fs.writeFileSync(path.join(outDir, "红色11_诗文格言歌谣引用.csv"), `${csv}\n`, "utf8");
fs.writeFileSync(path.join(outDir, "红色11_诗文格言歌谣引用.txt"), `${txt}\n`, "utf8");
fs.writeFileSync(
  path.join(analysisDir, "liao_hongse11_proofread_audit.tsv"),
  `${auditRows.map((row) => row.map(tsvEscape).join("\t")).join("\n")}\n`,
  "utf8",
);
fs.writeFileSync(path.join(analysisDir, "liao_hongse11_proofread_report.txt"), `${report}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      records: data.length,
      excluded: excluded.length,
      csv: path.join(outDir, "红色11_诗文格言歌谣引用.csv"),
      txt: path.join(outDir, "红色11_诗文格言歌谣引用.txt"),
      report: path.join(analysisDir, "liao_hongse11_proofread_report.txt"),
      audit: path.join(analysisDir, "liao_hongse11_proofread_audit.tsv"),
    },
    null,
    2,
  ),
);
