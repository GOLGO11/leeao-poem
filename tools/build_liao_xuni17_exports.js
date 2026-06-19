const fs = require("fs");
const path = require("path");

const book = "虚拟的十七岁";
const idPrefix = "LAXN17";
const generatedDate = "2026-06-19";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "004.小说剧本类",
  "004.虚拟的十七岁",
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

const data = [
  row("002.与阴茎对话.txt", 97, 97, "其中我非常异议可怪之论。", "古文引文", "何休《公羊传序》", "借何休语说明“非常异议”的古典来历。"),

  row("003.道在屎溺.txt", 9, 9, "无所不在", "庄子引文", "《庄子·知北游》语意", "讲东郭子问道时摘出庄子答语。"),
  row("003.道在屎溺.txt", 9, 9, "在蝼蚁", "庄子引文", "《庄子·知北游》", "说明道在卑微物中时引用庄子语。"),
  row("003.道在屎溺.txt", 9, 9, "在屎溺", "庄子引文", "《庄子·知北游》", "说明道无所不在时引用庄子名句。"),
  row("003.道在屎溺.txt", 9, 9, "故处处有之", "庄子引文", "《庄子·知北游》", "解释道在屎溺的理由时引用原句。"),
  row("003.道在屎溺.txt", 25, 25, "我是一头驴。", "禅宗公案", "赵州从稔与文远禅师故事", "赵州禅师下贱譬喻公案中的第一句。"),
  row("003.道在屎溺.txt", 25, 25, "我是驴屁股。", "禅宗公案", "赵州从稔与文远禅师故事", "文远承接赵州语的公案答句。"),
  row("003.道在屎溺.txt", 25, 25, "我是屁股中的大便。", "禅宗公案", "赵州从稔与文远禅师故事", "赵州继续下转譬喻的答句。"),
  row("003.道在屎溺.txt", 25, 25, "我是大便里的蛆。", "禅宗公案", "赵州从稔与文远禅师故事", "文远进一步接话的禅门机锋。"),
  row("003.道在屎溺.txt", 25, 25, "你在大便里干什么？", "禅宗公案", "赵州从稔与文远禅师故事", "赵州追问文远的机锋。"),
  row("003.道在屎溺.txt", 25, 25, "我在避暑乘凉啊！", "禅宗公案", "赵州从稔与文远禅师故事", "文远以自得语收束公案。"),
  row("003.道在屎溺.txt", 25, 25, "怎样参禅，才能悟道？", "禅宗公案", "赵州从稔禅师故事", "引出赵州小便故事的问题。"),
  row("003.道在屎溺.txt", 25, 25, "我要去厕所小便。", "禅宗公案", "赵州从稔禅师故事", "赵州以日常行动答参禅悟道。"),
  row("003.道在屎溺.txt", 25, 25, "你看这么一点小事，也得我自己去。", "禅宗公案", "赵州从稔禅师故事", "赵州说明求法不能代办的公案语。"),

  row("004.王主任.txt", 41, 41, "钱塘苏小是乡亲。", "诗句引文", "古人诗句", "王主任用古人写苏小小的诗句贺邻美女。"),
  row("004.王主任.txt", 41, 41, "振兴美女是比邻。", "改写诗句", "李敖化用“钱塘苏小是乡亲”", "接古句戏拟出医院邻居情境。"),

  row("005.魏院长.txt", 3, 3, "水不在清，有我则灵", "化用古文", "刘禹锡《陋室铭》语意", "以“山不在高，有仙则名；水不在深，有龙则灵”句式自嘲磺溪。"),
  row("005.魏院长.txt", 3, 3, "武帝下我！", "古书引文", "古书女巫降神语", "讲古书女巫大神附体时转述。"),
  row("005.魏院长.txt", 9, 9, "维摩虽病有神通", "宋诗引文", "王安石诗句", "医院读《维摩诘所说经》时引王安石句。"),
  row("005.魏院长.txt", 9, 9, "游戏神通", "佛经成语", "《维摩诘所说经》", "从维摩经中拈出“游戏神通”四字。"),
  row("005.魏院长.txt", 49, 49, "但求灵药换凡骨", "宋诗引文", "陆游诗句", "谈现代换骨换心科技时引陆游愿望。"),
  row("005.魏院长.txt", 59, 59, "Where my heart lies, let my brain lie also.", "英文诗句", "Browning诗句", "魏院长谈心脑关系时引勃朗宁句。"),
  row("005.魏院长.txt", 61, 61, "吾心所在，吾脑随之。", "译文", "李敖译Browning句", "给勃朗宁句所作的文气译法。"),

  row("007.神医自杀了.txt", 143, 143, "云何化生？谓有情类生无所讬，是名化生。", "佛典引文", "《俱舍论》", "解释“化生”时引用佛典定义。"),
  row("008.梦里猎巫.txt", 161, 161, "虽有智慧，不如乘势；虽有镃基，不如待时。", "孟子引文", "《孟子》", "谈技术时机成熟时引孟子语。"),

  row("009.出院日.txt", 13, 13, "人死作鬼，鬼死作魙。", "古书引文", "《五音集韵》", "解释鬼死为魙时引古书释义。"),
  row("009.出院日.txt", 17, 17, "白日见鬼", "传统成语", "传统成语", "承接古人白日梦与鬼的讨论。"),
  row("010.楼在磺溪之畔.txt", 15, 15, "天涯若比邻", "唐诗成句", "王勃《送杜少府之任蜀州》", "谈邻居距离时引用王勃名句。"),
  row("010.楼在磺溪之畔.txt", 15, 15, "比邻若天涯", "改写诗句", "李敖反用“天涯若比邻”", "用反向句式写现实邻里关系。"),

  lineRow("011.蜚蠊之夜.txt", 289, 311, "英文诗歌翻译", "James Legge译《诗经·蜉蝣》", "朱仑背诵理雅各英译《蜉蝣》。"),
  lineRow("011.蜚蠊之夜.txt", 327, 331, "诗经引文", "《诗经·蜉蝣》", "李敖与朱仑一同写下《蜉蝣》原诗。"),
  row("011.蜚蠊之夜.txt", 341, 341, "朝生暮死", "传统成语", "蜉蝣典故", "由蜉蝣成年短命引出成语。"),
  row("011.蜚蠊之夜.txt", 341, 341, "寄蜉蝣于天地", "宋文名句", "苏轼《前赤壁赋》", "朱仑把苏轼名句改说成“寄十七于天地”。"),
  row("011.蜚蠊之夜.txt", 357, 357, "方生方死", "庄子成句", "《庄子》", "以庄子死生无常语解释蜉蝣。"),
  row("012.蜚蠊后夜.txt", 97, 97, "殷勤就是不殷勤、不殷勤就是殷勤。", "佛门笑话", "和尚与穷书生故事", "用和尚诡辩说明吊诡境界。"),
  row("012.蜚蠊后夜.txt", 97, 97, "打人就是不打人、不打人就是打人。", "佛门笑话", "和尚与穷书生故事", "书生反用和尚说法的机锋。"),
  row("012.蜚蠊后夜.txt", 165, 165, "爱你的邻居，把那张纸给他。", "圣经化用", "爱邻如己语意", "把圣经式邻人伦理戏用到诗纸归属上。"),
  row("012.蜚蠊后夜.txt", 173, 173, "悲欣交集", "传统成语", "传统成语", "称朱仑诗兼有悲怆与幽默。"),
  row("012.蜚蠊后夜.txt", 173, 173, "smiling through her tears", "英文成语", "英语成语", "说明含泪而笑的悲欣并存。"),
  row("013.模特儿约定.txt", 35, 35, "因为它荒谬，所以我相信。", "拉丁谚语", "Credo quia absurdum语意", "以拉丁谚语说明荒谬反而可信。"),

  row("014.模特儿第一次.txt", 47, 47, "有解脱，名不可思议。", "佛经引文", "《维摩诘所说经》", "解释两人关系时引用维摩经。"),
  row("014.模特儿第一次.txt", 49, 49, "解脱真德，妙出情妄", "佛教注疏", "慧远《维摩诘所说经义记》", "以慧远注解释“不可思议”。"),
  lineRow("015.智者的虚拟.txt", 105, 117, "乐府民歌", "《乐府诗集·江南》", "借《江南》写鱼戏莲叶四方的细腻。"),
  lineRow("015.智者的虚拟.txt", 123, 135, "印第安诗歌", "Navajo Night Chant", "朱仑背诵纳瓦霍夜吟诗。"),
  row("020.烛浴.txt", 139, 139, "五色令人目盲、五音令人耳聋。", "老子引文", "《老子》", "批评现代感官诱惑时引《老子》。"),

  lineRow("021.为什么要强暴她？.txt", 7, 9, "宋词引文", "辛弃疾词句", "以青山妩媚两句形容窗前赤裸的十七岁。"),
  row("021.为什么要强暴她？.txt", 29, 29, "登泰山而小天下", "孟子成句", "《孟子·尽心上》", "谈泰山时引孔子登泰山典故。"),
  row("021.为什么要强暴她？.txt", 39, 39, "泰山压顶", "传统成语", "传统成语", "戏称只听过泰山压顶不听过泰山洗澡。"),
  row("022.模特儿规则.txt", 23, 23, "杀君马者道旁儿", "古话格言", "传统古话", "说明赞美也能间接造成损害。"),
  row("022.模特儿规则.txt", 45, 45, "When those who found this skeleton attempted to disengage it from that which it held in its grasp, it crumbled to dust.", "英文文学引文", "《巴黎圣母院》相关英译句", "朱仑背出钟楼怪人与女子骸骨相拥的句子。"),
  row("022.模特儿规则.txt", 45, 45, "骷髅相拥，触之成尘。", "译文", "《巴黎圣母院》相关句李敖译意", "给同一英文句所配的简洁中文译意。"),
  row("023.模特儿第三次.txt", 37, 37, "远在天边，近在眼前。", "传统俗语", "传统俗语", "谈科技魅影逼近时引用俗语。"),
  row("023.模特儿第三次.txt", 39, 39, "瞻之在后，忽焉在前。", "古话格言", "传统古话", "描述看似在后却忽然在前的变化。"),
  row("023.模特儿第三次.txt", 17, 17, "钓鱼的时间，上帝不算", "外国人物轶语", "Herbert Hoover钓鱼语", "李敖借胡佛钓鱼语反衬坐牢时间不算。", "校对补入：只收胡佛钓鱼语，不收同句的政治犯坐牢引申。"),
  row("023.模特儿第三次.txt", 151, 151, "Time flies like an arrow", "英文谚语", "英语谚语", "用“光阴如箭”例子说明电脑语义歧义。"),
  row("023.模特儿第三次.txt", 151, 151, "光阴如箭", "中文成语", "传统成语", "解释 Time flies like an arrow 的俗译。"),
  row("023.模特儿第三次.txt", 151, 151, "岁月如矢", "中文成语", "传统成语", "解释 Time flies like an arrow 的另一中文对应。"),
  row("023.模特儿第三次.txt", 175, 175, "I shall use the phrase “time's arrow” to express this one-way property of time which has no analogue in space.", "科学格言", "Sir Arthur Eddington", "朱仑背艾丁顿关于时间之箭的说明。"),

  row("024.相对胡言.txt", 219, 219, "I love thee so, dear, that I only can love thee.", "英文诗句", "Elizabeth Barrett Browning相关诗句", "谈爱到只能爱时引用勃朗宁夫人诗句。"),
  row("024.相对胡言.txt", 219, 219, "I love thee so, dear, that I only can leave thee.", "英文诗句", "Elizabeth Barrett Browning相关诗句", "同一语境下引用“只能离开你”的句子。"),
  row("024.相对胡言.txt", 219, 219, "Love may return but never lover.", "英文诗句", "Richard Fanshawe", "说明爱可回归而情人不可回归。"),
  lineRow("024.相对胡言.txt", 235, 269, "莎士比亚引文", "Shakespeare《仲夏夜之梦》", "朱仑背诵爱情仙浆一段并附中译。"),
  row("024.相对胡言.txt", 289, 289, "I lov'd Ophelia: forty thousand brothers/Could not, with all their quantity of love,/Make up my sum. What wilt thou do for her?", "莎士比亚引文", "Shakespeare《哈姆雷特》", "朱仑背哈姆雷特悼奥菲莉亚句。"),
  row("024.相对胡言.txt", 293, 293, "How beauteous mandind is! O brave new world/That has such people in't!", "莎士比亚引文", "Shakespeare《暴风雨》", "解释 Brave New World 题名本义时引莎士比亚。", "源文 mandind 疑为 mankind 的OCR误字，按底本保留。"),
  row("024.相对胡言.txt", 297, 297, "Art any more than a steward? Dost thou think because thou art virtuous there shall be no more cakes and ale?", "莎士比亚引文", "Shakespeare《第十二夜》", "解释 Cakes and Ale 书名出处时引原句。"),
  row("024.相对胡言.txt", 297, 297, "你不过一管家耳，有什么好神气的？你自以为道德高尚，人家就不能吃喝玩乐了吗？", "译文", "李敖译Shakespeare《第十二夜》句", "同一莎士比亚句的中文译意。"),
  lineRow("024.相对胡言.txt", 305, 339, "英文诗歌", "毛姆《在中国屏风上》所收辜鸿铭诗", "李敖转述毛姆笔下辜鸿铭留给他的英文诗。"),
  lineRow("024.相对胡言.txt", 341, 373, "译诗", "李敖译辜鸿铭英文诗", "同一首诗的中文译文。"),
  row("024.相对胡言.txt", 375, 375, "come let us kiss and part", "英文诗句", "Michael Drayton", "谈爱情应主动提前结束时引德雷顿句。"),

  row("026.白鲸.txt", 17, 17, "Oh！Ahab,” cried Starbuck, “not too late is it, even now, the third day, to desist. See！Moby Dick seeks thee not. It is thou, thou, that madly seekest him！", "英文文学引文", "Herman Melville《Moby-Dick》", "朱仑背星巴克劝亚哈船长的一段。"),
  row("026.白鲸.txt", 17, 17, "啊！亚哈，还不算太迟，就是现在，在这第三天，断了念吧。你看！Moby Dick不是要找你，是你，你发疯在找它啊！", "译文", "李敖译《白鲸记》引文", "同一《白鲸记》引文的中文译意。"),
  row("027.从忘情到坐姿.txt", 15, 15, "圣人忘情，最下不及于情。然则情之所钟，正在我辈。", "晋书引文", "《晋书·王戎传》王衍论情", "谈太上忘情时引用王衍语。"),
  row("027.从忘情到坐姿.txt", 15, 15, "不觉临风而陨涕者，有愧乎太上之忘情", "宋文引文", "欧阳修《祭石曼卿文》", "说明忘情包含不动情不流泪时引欧阳修。"),
  row("027.从忘情到坐姿.txt", 31, 31, "堕身体，黜聪明，离形去知", "庄子引文", "《庄子》坐忘语", "说明庄子坐忘定义。"),
  row("030.智者的虚拟第六号.txt", 5, 5, "写怀送抱，如弦之有音。所怀既往，则弦停音寂。", "清人语录", "王与敕语", "谈诗文时空性时引清人论诗语。"),
  row("030.智者的虚拟第六号.txt", 5, 5, "辄抚弄以寄其意", "陶渊明典故", "陶渊明无弦琴故事", "说明无声琴中有趣时引陶渊明事。"),
  row("030.智者的虚拟第六号.txt", 5, 5, "琴中趣", "陶渊明典故", "陶渊明无弦琴故事", "用“琴中趣”概括无弦之乐。"),

  row("033.智者的虚拟第九号.txt", 19, 19, "夜有一千只眼睛", "译文", "F. W. Bourdillon诗句", "由诗人布尔狄龙句引入镜像视野。"),
  row("033.智者的虚拟第九号.txt", 19, 19, "The night has a thousand eyes.", "英文诗句", "F. W. Bourdillon", "同一布尔狄龙诗句英文原文。"),
  row("033.智者的虚拟第九号.txt", 19, 19, "The mind has a thousand eyes.", "英文诗句", "F. W. Bourdillon", "同一诗中“头脑有一千只眼睛”句。"),
  row("033.智者的虚拟第九号.txt", 19, 19, "通身是眼，不见自己，欲见自己，频掣驴耳。", "佛教文献引文", "佛教文献", "借佛教文献说明看不见自己。"),
  row("033.智者的虚拟第九号.txt", 19, 19, "The ass is know by his ears.", "拉丁谚语译文", "Ex auribus cognoscitur asinus", "以驴耳谚语接续看己问题。", "源文 know 疑为 known 的OCR误字，按底本保留。"),
  row("033.智者的虚拟第九号.txt", 19, 19, "I am an ass, indeed; you may prove it by my long ears.", "莎士比亚引文", "Shakespeare剧本", "用莎士比亚驴耳句收束譬喻。"),
  row("034.模特儿第N次.txt", 57, 57, "my second favorite", "英文诗句", "James Tate诗句", "谈左右脚偏爱时引用塔特诗句。"),
  row("034.模特儿第N次.txt", 89, 89, "Nobody ever died with their feet warm", "英文轶事引文", "John Holmes临终轶事", "朱仑转述霍姆斯临终纠正护士的话。"),
  row("034.模特儿第N次.txt", 89, 89, "John Rogers did.", "英文轶事引文", "John Holmes临终轶事", "霍姆斯临终答话。"),
  row("034.模特儿第N次.txt", 109, 109, "It was only when Joan found herself once more alone, in the shame of her shorn hair and the dress that could not but remind her of her cowardice, that she understood the full meaning of what she had done that morning.", "英文传记引文", "Frances Winwar《Joan of Arc》", "朱仑背文卧尔写贞德悔过后的心理。"),
  row("034.模特儿第N次.txt", 125, 125, "One of the oldest known literary renderings of the theme is a Chinese version of the 9th century AD.", "百科引文", "《大英百科全书》", "说明灰姑娘故事早期中国版本时引用百科句。"),

  row("037.智者的虚拟第十一号.txt", 5, 5, "色即是空，空即是色。", "佛经引文", "《般若波罗蜜多心经》", "讨论色空关系时引用心经。"),
  row("037.智者的虚拟第十一号.txt", 7, 7, "无色界中，都无有处；以无色法，无有方所……但异熟生，差别有四：一、空无边处，二、识无边处，三、无所有处，四、非想非非想处。如是四种，名无色界。", "佛典引文", "《俱舍论》", "解释无色界时引用佛典。"),
  row("037.智者的虚拟第十一号.txt", 11, 11, "虚空有相汝不知，故言无。", "佛典引文", "《大智度论》", "由空无问题引《大智度论》。"),
  row("037.智者的虚拟第十一号.txt", 11, 11, "当其无，有器之用", "老子引文", "《老子》", "将佛理与老子“无”的功用相接。"),

  row("039.阿基米得式“支点”.txt", 3, 3, "给我一个‘支点’，我将举起地球。", "外国格言", "Archimedes", "开篇引用阿基米德支点名言。"),
  row("039.阿基米得式“支点”.txt", 3, 3, "Give me a firm spot to stand, and I will move the earth.", "英文格言", "Archimedes", "同一阿基米德名言英译。"),
  row("039.阿基米得式“支点”.txt", 3, 3, "我发现了！", "外国格言译文", "Archimedes", "引用阿基米德浴缸故事中的发现语。"),
  row("039.阿基米得式“支点”.txt", 3, 3, "Eureka! I've found it!", "英文格言", "Archimedes", "同一发现语英译。"),
  row("039.阿基米得式“支点”.txt", 29, 29, "Eureka! Eureka!", "英文格言", "Archimedes", "后文再次以阿基米德式裸奔喊出 Eureka。"),
  row("040.名牌.txt", 31, 31, "Silently, invisibly:/He took her with a lie.", "改写诗句", "李敖改写William Blake《Love's Secret》", "把 Blake 原句 with a sigh 改成 with a lie。"),
  row("040.名牌.txt", 49, 49, "Silently, invisibly:/O, was no deny.", "英文诗句", "William Blake《Love's Secret》异文", "指出 Blake 诗的另一版本。"),
  row("040.名牌.txt", 55, 55, "与君今世为兄弟，更结来生未了因", "宋诗引文", "苏轼诗句", "考证苏东坡诗句版本时引古本原文。"),
  lineRow("040.名牌.txt", 81, 83, "宋词引文", "苏轼悼朝云词句", "引用苏轼怀念小妾的词句。"),
  row("040.名牌.txt", 117, 117, "花解语", "红楼梦典故", "《红楼梦》花袭人语意", "以“花解语”称朱仑理解语言。"),
  row("040.名牌.txt", 157, 157, "Then come kiss me, sweet and twenty,/Youth's a stuff will not endure.", "莎士比亚引文", "Shakespeare《第十二夜》", "谈青春时引用《第十二夜》歌词。"),
  row("041.十七在兹.txt", 117, 117, "SEVENTEEN never die, she simply fade away.", "改写英文歌词", "化用老军歌/麦克阿瑟引用句", "朱仑把老军歌句式改写到十七岁。"),
  row("041.十七在兹.txt", 123, 123, "never die…just fade away…", "英文歌词", "老军歌，Douglas MacArthur引用", "李敖指出原句出处。"),

  row("042.王羲之.txt", 45, 45, "晤言一室之内", "古文引文", "王羲之《兰亭集序》", "评《兰亭集序》人与人关系时拈出。"),
  row("042.王羲之.txt", 45, 45, "放浪形骸之外", "古文引文", "王羲之《兰亭集序》", "同一段对照室内晤言与形骸之外。"),
  row("042.王羲之.txt", 45, 45, "欣于所遇，快然自足", "古文引文", "王羲之《兰亭集序》", "评王羲之达者心怀时引用。"),
  row("042.王羲之.txt", 45, 45, "情随事迁", "古文引文", "王羲之《兰亭集序》", "说明欣然随事迁化时引用。"),
  row("042.王羲之.txt", 45, 45, "所过者化，所存者神", "传统格言", "传统哲学语", "反驳王羲之伤逝时提出更高境界。"),
  row("043.科技观.txt", 5, 5, "应是诸天观下界，一微尘内斗英雄。", "唐诗引文", "白居易诗句", "谈奈米世界时引白居易佛理诗句。"),
  row("043.科技观.txt", 7, 7, "余音绕梁", "传统成语", "传统音乐典故", "李敖列举古人关于音乐与科技想象的成语。", "校对补入：只收古典成语本体，不收同段现代战争议论。"),
  row("043.科技观.txt", 7, 7, "不出户，知天下", "老子名句", "《老子》", "李敖列举古人远知天下的经典成句。", "校对补入：总表已有同句先例，本处按独立出处保留。"),
  lineRow("044.沙漏颂.txt", 55, 69, "英文诗歌", "Sara Teasdale《On the Dunes》", "引替滋代尔《沙丘忆》英文原诗。"),
  lineRow("044.沙漏颂.txt", 71, 79, "译诗", "李敖译Sara Teasdale《On the Dunes》", "同一诗的中文译文。"),
  row("044.沙漏颂.txt", 83, 83, "复，尽爱之道也。", "古经引文", "古经招魂语", "以招魂之“复”谈爱尽后的呼名。"),
  row("044.沙漏颂.txt", 87, 87, "Now is the Future.", "英文格言", "时间空间小故事", "从时间空间故事中拈出现时即未来。"),
  row("044.沙漏颂.txt", 87, 87, "Today Is My Future.", "英文格言", "李敖引申语", "由 Now is the Future 引申今天就是未来。"),

  row("046.速写朱仑.txt", 45, 45, "法王自在，变化无穷。置世界于微尘，纳须弥于黍米。", "古书引文", "《北齐书·樊逊传》", "谈纳米时引用古人微尘纳须弥句。"),
  row("046.速写朱仑.txt", 77, 77, "Every picture tells a story", "英文格言", "英语俗语", "讨论画面与语文时引用。"),
  row("046.速写朱仑.txt", 77, 77, "Every picture tells a different story", "改写英文格言", "李敖改写英语俗语", "把画面说故事改为画面说另一回事。"),
  row("046.速写朱仑.txt", 89, 89, "Be sure you're right, then go ahead.", "英文名言", "Davy Crockett", "谈龟策篇时引用美国边疆人物名言。"),
  row("046.速写朱仑.txt", 91, 91, "It's not enough to say the right thing at the right time, it must be said to the right people.", "英文格言", "英语格言", "补充 right 的条件时引用。"),
  row("046.速写朱仑.txt", 97, 97, "从不曾想到我是给关起来了，高墙实在等于浪费材料……他们根本不知道如何对付我……他们总以为我唯一目的是想站到墙外面。每在我沉思的时候，看守那种紧张样子，真教人好笑。他们哪里知道才一转身，我就毫无阻挡的跟着出去了……", "外国文学引文", "Thoreau坐牢语", "以梭罗坐牢观念说明心转境界。"),
  row("046.速写朱仑.txt", 161, 161, "为亚当和他妻子用皮子做衣服，给他们穿。", "圣经引文", "《创世记》", "谈服装设计时引用上帝给亚当夏娃衣服。"),
  row("046.速写朱仑.txt", 217, 217, "fell into a trance", "圣经引文", "《使徒行传》第十章第十节", "用使徒行传语说明魂游象外。"),
  row("046.速写朱仑.txt", 259, 259, "Here lies one whose name was writ in water.", "英文墓志铭", "Keats墓志铭", "引用英国诗人名字写在水上的墓志铭。"),
  row("046.速写朱仑.txt", 259, 259, "我太丑了，你鲁班先生又会速写人像，我不能浮出来。", "古书故事", "郦道元《水经注》忖留神故事", "转述《水经注》中水神怕鲁班画像的话。"),

  row("047.模拟随笔.txt", 31, 31, "却嫌脂粉污颜色。", "唐诗句", "古诗句", "用一句唐诗搭配朱仑素颜。"),
  row("047.模拟随笔.txt", 35, 35, "只是朱颜改", "词句引文", "李煜词句", "由李后主词句改写“朱颜在”。"),
  row("047.模拟随笔.txt", 35, 35, "只是朱颜在", "改写词句", "李敖改写李煜“只是朱颜改”", "设想李后主见朱仑后的改写。"),
  row("047.模拟随笔.txt", 97, 97, "山色有无中", "唐诗句", "王维诗句", "称第一流诗人描写自然。"),
  row("047.模拟随笔.txt", 121, 121, "山常欲舞雪飞也；花不能言鸟代之。", "诗句引文", "古诗句", "给朱仑的两句诗。"),
  row("047.模拟随笔.txt", 191, 191, "让我死，就能忘掉爱的含义。", "译诗", "Elizabeth I诗句", "谈伊丽莎白女王处理情人时转述。"),
  row("047.模拟随笔.txt", 191, 191, "Or die and so forget what love are meant.", "英文诗句", "Elizabeth I诗句", "同一女王诗句英文。", "源文 are 疑为李敖引文底本如此，按源保留。"),
  row("047.模拟随笔.txt", 201, 201, "相忘于江湖", "庄子成语", "《庄子》语意", "说明人与人时隐时现的生活方式。"),
  row("047.模拟随笔.txt", 201, 201, "独与天地精神往来", "庄子引文", "《庄子》", "以庄子独往境界写孤独愉悦。"),
  row("047.模拟随笔.txt", 201, 201, "a solitary being", "英文短语", "Einstein相关语", "以爱因斯坦独处观念相对照。"),

  row("048.避免阴茎在窃听.txt", 65, 65, "至大无外", "庄子成句", "《庄子》", "批评古人科技局限时引用庄子。"),
  row("048.避免阴茎在窃听.txt", 65, 65, "至小无内", "庄子成句", "《庄子》", "同一语境中引用庄子小大之说。"),
  row("048.避免阴茎在窃听.txt", 65, 65, "排空驭气奔如电，升天入地求之遍，上穷碧落下黄泉，两处茫茫皆不见。", "唐诗引文", "白居易《长恨歌》", "用《长恨歌》句挖苦古人格物致知不足。"),
  row("048.避免阴茎在窃听.txt", 77, 77, "近之则不逊，远之则怨", "论语引文", "《论语·阳货》", "谈女性性格判断时引孔子语。"),
  row("048.避免阴茎在窃听.txt", 87, 87, "随他人说短长而已", "清诗引文", "赵翼诗句", "朱仑说李敖骂人要靠学问时引用。"),
  row("048.避免阴茎在窃听.txt", 125, 125, "野合而生孔子", "史记引文", "《史记·孔子世家》", "谈孔子出身时引用《史记》语。"),
  row("048.避免阴茎在窃听.txt", 125, 125, "吾闻圣人之后，虽不当世，必有达者。今孔丘年少好礼，其达者欤？吾即没，若必师之。", "史记引文", "《史记·孔子世家》", "引鲁国大夫临终命子从师孔子的话。"),
  row("049.模特儿第N+1次.txt", 115, 115, "her loosening thighs", "英文诗句", "Yeats《Leda and the Swan》", "分析叶慈描写丽达与天鹅时的主动分词。"),
  row("049.模特儿第N+1次.txt", 153, 153, "安时而处顺", "庄子成句", "《庄子》语意", "谈反伤逝论时引用安时处顺。"),
  row("049.模特儿第N+1次.txt", 153, 153, "哀乐不能入也", "庄子成句", "《庄子》语意", "说明哲人对死生来去的态度。"),
  row("049.模特儿第N+1次.txt", 155, 155, "She was dead. No sleep so beautiful and calm, so free from trace of pain, so fair to look upon.", "英文文学引文", "Dickens《The Old Curiosity Shop》小纳尔之死", "朱仑背狄更斯写小纳尔死亡的句子。"),
  row("049.模特儿第N+1次.txt", 159, 159, "And now the bell—the bell she had so often heard by night and day, and listened to with solemn pleasure, almost as to a living voice-rung its remorseless toll for her, so young, so beautiful, so good.", "英文文学引文", "Dickens《The Old Curiosity Shop》小纳尔之死", "朱仑再背小纳尔钟声一段。"),
  row("049.模特儿第N+1次.txt", 161, 161, "那个钟——那个钟声，她生时常常听到、日日夜夜听到的、庄严而喜欢听到的，余音犹在。如今，却无情的离开了她，那年华如斯的她、那出色如斯的她、那美好如斯的她。", "译文", "李敖译Dickens小纳尔句", "李敖对钟声一段的同步译文。"),
  row("051.“免于资讯的自由”.txt", 27, 27, "to smite under the fifth rib", "英文成语", "英语成语/圣经语源", "李敖拈出英文成语说明刺中要害。", "校对补入：只收成语本体，不收四大自由/第五自由政治戏拟。"),

  row("052.真相边缘.txt", 27, 27, "Well then, go you into hell?No; but to the gate; and there will the devil meet me, like an old cuckold, with horns on his head, and say, “Get you to heaven, Beatrice, get you to heaven; here's no place for you maids:”", "莎士比亚引文", "Shakespeare《Much Ado About Nothing》", "朱仑背 Beatrice 道白。"),
  row("052.真相边缘.txt", 27, 27, "回到天堂去，贝特丽丝，回到天堂去；这可不是你们处女来的地方。", "译文", "李敖译Shakespeare《Much Ado About Nothing》句", "同一 Beatrice 道白的中文译意。"),
  row("052.真相边缘.txt", 71, 71, "有脚书橱", "古书成语", "中国古书词语", "称朱仑比 walking encyclopedia 更具体。"),
  row("052.真相边缘.txt", 85, 85, "She shall be buried with her face upwards.", "莎士比亚引文", "Shakespeare《Much Ado About Nothing》", "解释脸朝上埋葬语义时引用。"),
  row("052.真相边缘.txt", 115, 115, "不学而能，不虑而知。", "古话引文", "传统古话", "谈神童式知识时引用。"),
  row("052.真相边缘.txt", 115, 115, "汗牛充栋", "传统成语", "传统成语", "说明古人书量有限时引用。"),
  row("052.真相边缘.txt", 207, 207, "岂知灌顶有醍醐", "唐诗引文", "顾况《行路难》", "用顾况诗句引出灌顶醍醐。"),
  row("052.真相边缘.txt", 207, 207, "从牛出乳、从乳出酪、从酪出生酥、从生酥出熟酥、熟酥出醍醐", "佛经引文", "《涅磐经》语意", "解释醍醐灌顶时引用佛经推论。"),

  row("055.朱仑十七帖.txt", 51, 51, "立德、立功、立言", "左传典故", "三不朽语意", "朱仑十七帖中改添“立色”时先引三不朽。"),
  lineRow("055.朱仑十七帖.txt", 75, 101, "莎士比亚诗歌", "Shakespeare Sonnet 47", "朱仑抄出莎士比亚十四行诗第四十七首。"),
  lineRow("055.朱仑十七帖.txt", 105, 109, "莎士比亚诗句", "Shakespeare Sonnets 28/46", "朱仑找出李敖用于补成十七行诗的三行。"),
  lineRow("055.朱仑十七帖.txt", 179, 185, "英文诗歌", "William Blake《Love's Secret》", "朱仑记录 Blake 诗末四句一版。"),
  lineRow("055.朱仑十七帖.txt", 191, 197, "英文诗歌", "William Blake《Love's Secret》异文", "朱仑背出 Blake 诗末四句异文。"),
  row("055.朱仑十七帖.txt", 211, 211, "奈何烧杀我宝玉！", "红楼梦故事", "红楼梦读者逸事", "讲红楼梦女读者迷书故事时转述。"),
  row("055.朱仑十七帖.txt", 255, 255, "吾丧我", "庄子成句", "《庄子·齐物论》", "朱仑谈自我逃逸时提及。"),
  row("055.朱仑十七帖.txt", 267, 267, "Suddenly it snapped up, and there was only one thing left to do. I arrested myself.", "英文影视台词", "Edward G. Robinson戏中道白", "朱仑借电影台词谈捉到自己。"),
  lineRow("055.朱仑十七帖.txt", 391, 399, "语言游戏诗文", "赵元任《施氏食狮史》及拼音", "朱仑十七帖中抄写同音文《施氏食狮史》。"),
  row("055.朱仑十七帖.txt", 413, 413, "天下才共一石", "古人语录", "谢灵运才气语", "比较古今才气表达时引用。"),
  row("055.朱仑十七帖.txt", 413, 413, "曹子建（曹植）独得八斗，我得一斗，古及今共同一斗。", "古人语录", "谢灵运才气语", "完整展开“天下才共一石”的八斗一斗说。"),
  row("055.朱仑十七帖.txt", 413, 413, "Dante and Shakespeare divide, the world between them; there is no third.", "英文文学格言", "T. S. Eliot", "与谢灵运才气语并举的艾略特句。"),
  row("055.朱仑十七帖.txt", 475, 475, "群籁虽参差，适我无非新。", "王羲之诗句", "王羲之诗", "谈以俗作雅时引用王羲之。"),
  row("055.朱仑十七帖.txt", 475, 475, "和尚，你看我坐的样子怎样？", "佛印苏轼故事", "苏东坡与佛印故事", "转述苏东坡问佛印打坐故事。"),
  row("055.朱仑十七帖.txt", 475, 475, "像一堆牛屎。", "佛印苏轼故事", "苏东坡与佛印故事", "故事中苏东坡对佛印的答语。"),
  row("055.朱仑十七帖.txt", 475, 475, "佛印和尚的心中如菩萨，所以他看你如菩萨；而你的心中像牛屎，所以你看他才像牛屎。你输了。", "佛印苏轼故事", "苏小妹故事", "故事中苏小妹裁判语。"),
  row("055.朱仑十七帖.txt", 487, 487, "Quiet, the Unicorn, /In contemplation stilled, /With acceptance filled; /Quiet, save for his horn; /Alive in his horn; /Horizontally, /In captivity; /Perpendicularly, /Free.", "英文诗歌", "Anne Morrow Lindbergh《The Unicorn in Captivity》", "引安妮·林白《柙中独角兽》。"),
  lineRow("055.朱仑十七帖.txt", 497, 499, "英文歌词", "佚名歌曲《Because of Rain》", "朱仑十七帖中提及佚名歌末两句。"),

  lineRow("056.从昏迷中醒来.txt", 325, 339, "英文诗歌", "Thomas Chatterton诗句及中译", "朱仑背出查特顿自述清欢悲情的诗句。"),
  row("056.从昏迷中醒来.txt", 407, 407, "Live young, die sudden and leave a good looking corpse.", "英文格言", "青春死亡格言", "朱仑谈愿望时引用活得年轻死得突然的句子。"),
  row("056.从昏迷中醒来.txt", 407, 407, "活得年轻、死得突然、留下一具美丽的尸体。", "译文", "李敖译英文格言", "同一格言的中文译文。"),
  row("056.从昏迷中醒来.txt", 413, 413, "未知生，焉知死？", "论语引文", "《论语·先进》", "讨论死亡模样时引孔子语。"),
  row("056.从昏迷中醒来.txt", 495, 495, "我泥中有你，你泥中有我。", "词曲典故", "管夫人《我侬词》语意", "谈管夫人现象时引用泥我泥你之意。"),
  row("056.从昏迷中醒来.txt", 497, 497, "I am but clay in thy hands", "英文诗句", "Christopher Pearse Cranch《I in Thee, and Thou in Me》", "把管夫人泥喻与克兰池诗相接。"),
  row("056.从昏迷中醒来.txt", 525, 525, "蒙神爱者早死、神爱者夭。", "外国格言译文", "Menander", "李敖译米南德早死格言。"),
  row("056.从昏迷中醒来.txt", 527, 527, "Whom the gods love dies young.", "英文格言", "Menander", "朱仑补出米南德格言英文。"),
  row("059.又见朱仑.txt", 7, 7, "泯然众人矣！", "宋文引文", "王安石《伤仲永》", "晚年看落日时想到王安石伤仲永。"),
  row("059.又见朱仑.txt", 17, 17, "水是眼波之橫、山是眉峰之聚", "词句化用", "王观《卜算子》语意", "看观音山时化用“水是眼波横，山是眉峰聚”。"),
  row("060.我写《虚拟的十七岁》.txt", 5, 5, "so young a body with so old a head", "莎士比亚引文", "Shakespeare《威尼斯商人》", "后记中说明本书人设梦源。"),
  row("060.我写《虚拟的十七岁》.txt", 5, 5, "He is young, but take it from me, a very staid head.", "英文历史引文", "Thomas Wentworth推荐Earl of Ormond语", "说明莎士比亚之后同类表达的发酵。"),
  row("060.我写《虚拟的十七岁》.txt", 5, 5, "身体，年轻的；头脑，年深的。", "译文", "李敖译“so young a body with so old a head”", "李敖反对用“少年老成”翻译该句。"),
];

const excluded = [
  {
    file: "005.魏院长.txt",
    line: 57,
    text: "If God Himself was sitting in that chair we would make him say what we wanted him to say.",
    reason: "布达佩斯问案/洗脑语境，近现代政治审讯语录，按“不要政治语录”排除。",
  },
  {
    file: "025.昭陵六骏.txt",
    line: 11,
    text: "《白种人的重担》/ The White Man's Burden",
    reason: "出现在文物返还和反美政治文化批判段落中，本轮不收政治语境诗名。",
  },
  {
    file: "026.白鲸.txt",
    line: 23,
    text: "Moby Dick seeks thee not. It is thou, thou, that madly seekest him！",
    reason: "同一《白鲸记》句已在第17行收入；第23行复现处紧接反美政治结论，排除重复和政治语境。",
  },
  {
    file: "046.速写朱仑.txt",
    line: 223,
    text: "你这与奴才做奴才的奴才！",
    reason: "虽出《水浒传》，但被用作当代政党骂语，保守排除。",
  },
  {
    file: "051.“免于资讯的自由”.txt",
    line: 13,
    text: "FOUR FREEDOMS / freedom of speech / freedom from want / freedom from fear",
    reason: "美国总统政治演说“四大自由”语录，按规则排除。",
  },
  {
    file: "051.“免于资讯的自由”.txt",
    line: 25,
    text: "免于资讯的自由 / 免于垃圾的自由",
    reason: "由“四大自由”政治演说戏拟而来，本轮不收入正文。",
  },
  {
    file: "012.蜚蠊后夜.txt",
    line: 135,
    text: "朱仑诗《全部忘掉》",
    reason: "校对剔除：小说内角色原创成段诗，不属于外部诗文格言引用。",
  },
  {
    file: "049.模特儿第N+1次.txt",
    line: 175,
    text: "李敖诗《珍惜》",
    reason: "校对剔除：李敖在小说内自作成段诗，不属于外部引用。",
  },
  {
    file: "055.朱仑十七帖.txt",
    line: 503,
    text: "朱仑十七帖中诗《雨》",
    reason: "校对剔除：小说内角色原创成段诗，不属于外部诗文格言引用。",
  },
  {
    file: "056.从昏迷中醒来.txt",
    line: 437,
    text: "朱仑诗《还魂》",
    reason: "校对剔除：小说内角色原创成段诗，不属于外部诗文格言引用。",
  },
  {
    file: "056.从昏迷中醒来.txt",
    line: 477,
    text: "李敖续写朱仑《还魂》",
    reason: "校对剔除：李敖续写小说内角色诗，不属于外部诗文格言引用。",
  },
];

data.forEach((record, index) => {
  record.id = `${idPrefix}${String(index + 1).padStart(3, "0")}`;
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
  ...data.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
].join("\n");

const txt = data
  .map(
    (record) =>
      [
        `${record.id}｜${record.book}｜${record.chapter}`,
        `出处：${record.source_file}:${record.line_start}-${record.line_end}`,
        `类别：${record.category}`,
        `来源：${record.source_or_origin}`,
        `引文：${record.quote_text}`,
        `说明：${record.summary}${record.notes ? `（${record.notes}）` : ""}`,
      ].join("\n"),
  )
  .join("\n\n");

const categoryStats = data.reduce((stats, record) => {
  stats[record.category] = (stats[record.category] || 0) + 1;
  return stats;
}, {});

const proofreadAddedRows = data.filter((record) => record.notes.includes("校对补入"));
const proofreadExcludedRows = excluded.filter((item) => item.reason.includes("校对剔除"));

const exclusionAuditColumns = ["file", "line", "text", "reason"];
const exclusionAudit = [
  exclusionAuditColumns.join("\t"),
  ...excluded.map((item) =>
    exclusionAuditColumns.map((column) => tsvEscape(item[column])).join("\t"),
  ),
].join("\n");

const proofreadAuditColumns = [
  "action",
  "id",
  "file",
  "line_start",
  "line_end",
  "quote_text",
  "category",
  "source_or_origin",
  "summary",
  "notes",
];
const proofreadAudit = [
  proofreadAuditColumns.join("\t"),
  ...data.map((record) =>
    [
      record.notes.includes("校对补入") ? "add" : "keep",
      record.id,
      record.source_file,
      record.line_start,
      record.line_end,
      record.quote_text,
      record.category,
      record.source_or_origin,
      record.summary,
      record.notes,
    ]
      .map(tsvEscape)
      .join("\t"),
  ),
  ...excluded.map((item) =>
    [
      "exclude",
      "",
      item.file,
      item.line,
      item.line,
      item.text,
      "",
      "",
      item.reason,
      item.reason.includes("校对剔除") ? "校对排除" : "首轮风险排除",
    ]
      .map(tsvEscape)
      .join("\t"),
  ),
].join("\n");

const report = [
  `《${book}》诗文格言歌谣引用校对轮报告`,
  `生成日期：${generatedDate}`,
  `来源目录：${sourceDir}`,
  `校对后保留条目：${data.length}`,
  `校对补入：${proofreadAddedRows.length}`,
  `校对剔除：${proofreadExcludedRows.length}`,
  `排除/风险记录合计：${excluded.length}`,
  "",
  "分类统计：",
  ...Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `- ${category}: ${count}`),
  "",
  "校对说明：",
  "- 保留外部诗文、古文、成语、格言、歌谣、宗教典籍、明确来源译文和化用句。",
  "- 继续排除现代政治演说、审讯/洗脑语境、政党骂语、反美政治文化批判段落。",
  "- 本轮剔除小说内角色原创成段诗和李敖自作/续写成段诗；这类不作为“引用”入表。",
  "- 本轮补入胡佛钓鱼轶语、“余音绕梁”、“不出户，知天下”和 fifth rib 英文成语；只收成句本体，不收周边政治戏拟。",
].join("\n");

fs.writeFileSync(path.join(outDir, `${book}_诗文格言歌谣引用.csv`), `\uFEFF${csv}`, "utf8");
fs.writeFileSync(path.join(outDir, `${book}_诗文格言歌谣引用.txt`), txt, "utf8");
fs.writeFileSync(path.join(analysisDir, "liao_xuni17_initial_audit.tsv"), exclusionAudit, "utf8");
fs.writeFileSync(path.join(analysisDir, "liao_xuni17_initial_report.txt"), report, "utf8");
fs.writeFileSync(path.join(analysisDir, "liao_xuni17_proofread_audit.tsv"), `${proofreadAudit}\n`, "utf8");
fs.writeFileSync(path.join(analysisDir, "liao_xuni17_proofread_report.txt"), `${report}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rows: data.length,
      excluded: excluded.length,
      csv: path.join(outDir, `${book}_诗文格言歌谣引用.csv`),
      txt: path.join(outDir, `${book}_诗文格言歌谣引用.txt`),
      audit: path.join(analysisDir, "liao_xuni17_initial_audit.tsv"),
      report: path.join(analysisDir, "liao_xuni17_initial_report.txt"),
      proofreadAudit: path.join(analysisDir, "liao_xuni17_proofread_audit.tsv"),
      proofreadReport: path.join(analysisDir, "liao_xuni17_proofread_report.txt"),
    },
    null,
    2,
  ),
);
