const fs = require("fs");
const path = require("path");

const book = "李敖情书集";
const idPrefix = "LAQSJ";
const generatedDate = "2026-06-21";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "008.书信函件类",
  "001.李敖情书集",
);

const sourceDecoder = new TextDecoder("gb18030");
const lineCache = new Map();

const sourceFiles = [
  "001.《李敖情书集》新序.txt",
  "002.《李敖情书集》原序.txt",
  "003.给咪咪.txt",
  "004.给Bonnie.txt",
  "005.给LW.txt",
  "006.给G的九十四封信.txt",
  "007.给尚勤的两封信.txt",
  "008.给谷莺.txt",
  "009.给H的十三封信.txt",
  "010.给阿贞.txt",
  "011.给Y的四十八封信.txt",
  "012.给汝清的五封信.txt",
  "013.寄会云.txt",
];

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

function compact(text) {
  return String(text).replace(/\s+/g, "");
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
    "001.《李敖情书集》新序.txt",
    5,
    5,
    "可爱的废话",
    "李敖情书格言",
    "李敖新序",
    "以戏谑短语概括情书的本质。",
  ),
  row(
    "001.《李敖情书集》新序.txt",
    5,
    5,
    "纸上罗曼斯",
    "西方人物语",
    "萧伯纳语意",
    "新序转述萧伯纳关于情书的说法。",
  ),
  row(
    "001.《李敖情书集》新序.txt",
    5,
    5,
    "聪明人绝不骂别人情书肉麻",
    "李敖情书格言",
    "李敖新序",
    "谈读他人情书时应有的宽容。",
  ),
  row(
    "001.《李敖情书集》新序.txt",
    7,
    7,
    "情海余韵，亦堪“快然自足”",
    "李敖情书格言",
    "李敖新序",
    "以《兰亭集序》成语说明旧情书的余味。",
  ),
  row(
    "001.《李敖情书集》新序.txt",
    9,
    9,
    "快然自足",
    "古文名句",
    "王羲之《兰亭集序》",
    "新序借《兰亭集序》写情感满足。",
  ),
  row(
    "001.《李敖情书集》新序.txt",
    9,
    9,
    "情随事迁，感慨系之矣！",
    "古文名句",
    "王羲之《兰亭集序》",
    "新序引用《兰亭集序》中情随事迁的感叹。",
  ),
  row(
    "001.《李敖情书集》新序.txt",
    9,
    9,
    "俯仰之间，已为陈迹",
    "古文名句",
    "王羲之《兰亭集序》",
    "新序用作情书成为旧迹的说明。",
  ),
  row(
    "001.《李敖情书集》新序.txt",
    9,
    9,
    "不能不以之兴怀",
    "古文名句",
    "王羲之《兰亭集序》",
    "新序以此说明重读旧情书的兴怀。",
  ),
  row(
    "001.《李敖情书集》新序.txt",
    11,
    11,
    "我只见甜甜的回忆，不见淡淡的哀愁",
    "李敖情书格言",
    "李敖新序",
    "以甜蜜回忆取代滥情哀愁的爱情态度。",
  ),
  row(
    "001.《李敖情书集》新序.txt",
    11,
    11,
    "太上忘情",
    "传统成语",
    "传统情感成语",
    "新序用来形容一种洒脱的爱情风度。",
  ),

  row(
    "002.《李敖情书集》原序.txt",
    17,
    17,
    "用现代化的水准与情调，开展现代化的爱情",
    "李敖爱情格言",
    "李敖原序",
    "原序提出爱情也要走向现代化。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    17,
    17,
    "迷恋秋雨梧桐，何如春江水暖？感叹难乎为继，何如独起楼台？",
    "李敖爱情格言",
    "李敖原序",
    "用对仗句式批评旧式感伤爱情。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    21,
    21,
    "爱情是不盲目的",
    "李敖爱情格言",
    "李敖原序",
    "原序概括李敖反盲目爱情的主张。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    23,
    23,
    "爱情是盲目的",
    "西方爱情俗语",
    "Love is blind",
    "原序先引西方爱情俗语再加以反驳。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    23,
    23,
    "爱情该像《三国演义》中张飞的眼睛，一天二十四小时，除了眨眼，连睡觉都是睁着的。",
    "李敖爱情格言",
    "李敖原序",
    "以张飞眼睛比喻清醒的恋爱。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    25,
    25,
    "睁着眼睛的恋爱才是真的恋爱",
    "李敖爱情格言",
    "李敖原序",
    "原序强调恋爱应保持清醒判断。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    25,
    25,
    "西施不该只出在情人眼里",
    "李敖爱情格言",
    "李敖原序",
    "改写俗语，反对只靠情人眼光制造美。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    25,
    25,
    "爱情应该知道对方的优点与缺点",
    "李敖爱情格言",
    "李敖原序",
    "强调爱情应认识对方全貌。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    27,
    27,
    "爱情是不痛苦的——它是纯快乐",
    "李敖爱情格言",
    "李敖原序",
    "原序主张爱情本质是纯快乐。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    29,
    29,
    "男欢女爱是人类最大的快乐，这种快乐，是纯快乐，不该掺进别的，尤其不该掺进痛苦。",
    "李敖爱情格言",
    "李敖原序",
    "阐述爱情不应与痛苦混同。",
  ),
  lineRow(
    "002.《李敖情书集》原序.txt",
    31,
    33,
    "现代人物题句",
    "胡适题扇语",
    "原序引胡适关于爱情代价与方法的题句。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    35,
    35,
    "真正的第一流的人，是不为爱情痛苦的",
    "李敖爱情格言",
    "李敖原序",
    "原序以第一流人的标准排除爱情痛苦。",
  ),
  lineRow(
    "002.《李敖情书集》原序.txt",
    37,
    43,
    "西方诗歌译文",
    "未详外国爱情诗译句",
    "原序引用外国诗句说明爱情之甜不应被说成痛苦。",
  ),
  lineRow(
    "002.《李敖情书集》原序.txt",
    45,
    51,
    "西方诗歌",
    "未详外国爱情诗原句",
    "与前条中文译句对应的英文原诗。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    55,
    55,
    "爱情是灵肉一致的——肉一样重要",
    "李敖爱情格言",
    "李敖原序",
    "原序概括灵与肉并重的爱情观。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    61,
    61,
    "……灵之对肉，并不多于肉之对灵。",
    "西方诗歌译句",
    "勃朗宁《Rabbi Ben Ezra》语意",
    "原序引诗句说明灵肉相助。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    63,
    63,
    "……Nor soul helps flesh more，now than flesh helps soul．",
    "西方诗歌",
    "勃朗宁《Rabbi Ben Ezra》诗句",
    "与前条中文译句对应的英文诗句。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    65,
    65,
    "懂得爱情的人，绝不忽略灵肉任何一方面。",
    "李敖爱情格言",
    "李敖原序",
    "原序强调爱情的身心完整。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    67,
    67,
    "爱情是会变的——接吻来分离",
    "李敖爱情格言",
    "李敖原序",
    "原序以分离技巧谈感情变化。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    69,
    69,
    "不承认感情在变的人，是不了解爱情的。",
    "李敖爱情格言",
    "李敖原序",
    "原序指出感情变化是爱情中的事实。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    69,
    69,
    "第一流人的态度是潇洒的、洒脱的、来去自如的",
    "李敖爱情格言",
    "李敖原序",
    "原序称赞来去自如的情感态度。",
  ),
  lineRow(
    "002.《李敖情书集》原序.txt",
    71,
    73,
    "西方诗歌译文",
    "迈克尔·德雷顿《Idea》第61首译句",
    "原序用外国诗句说明洒脱分手。",
  ),
  lineRow(
    "002.《李敖情书集》原序.txt",
    75,
    77,
    "西方诗歌",
    "迈克尔·德雷顿《Idea》第61首原句",
    "与前条中文译句对应的英文原句。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    81,
    81,
    "爱情是要技巧的——不一起下山",
    "李敖爱情格言",
    "李敖原序",
    "原序提出爱情关系中的分寸技巧。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    83,
    83,
    "小就是技巧，就是细心体贴，不发生技术错误。",
    "李敖爱情格言",
    "李敖原序",
    "借《水浒传》王婆说法阐释爱情技巧。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    83,
    83,
    "结婚要送玫瑰花，离婚也要送玫瑰花。",
    "李敖爱情格言",
    "李敖原序",
    "用玫瑰花比喻分合都要有风度。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    85,
    85,
    "男女关系好像一起上一座山",
    "李敖爱情格言",
    "李敖原序",
    "以上山比喻关系的进程。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    85,
    85,
    "男女之间最高的技巧是不一起走下坡路",
    "李敖爱情格言",
    "李敖原序",
    "原序以不一起下山概括分手时机。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    85,
    85,
    "应该在感情有余味的时候，先把关系结束。",
    "李敖爱情格言",
    "李敖原序",
    "强调关系应在仍有余味时结束。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    87,
    87,
    "爱情是唯美的——不涉真和善",
    "李敖爱情格言",
    "李敖原序",
    "原序提出唯美爱情观。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    91,
    91,
    "男女之间的一切关系，都是唯美的关系",
    "李敖爱情格言",
    "李敖原序",
    "原序把男女关系归结为美感关系。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    91,
    91,
    "男女之间除了美以外，没有别的，也不该有别的。",
    "李敖爱情格言",
    "李敖原序",
    "原序以美作为男女关系的核心。",
  ),
  row(
    "002.《李敖情书集》原序.txt",
    93,
    93,
    "少年哀艳杂雄奇",
    "李敖自评语",
    "李敖原序",
    "原序用来概括早年情书风格。",
  ),

  row(
    "003.给咪咪.txt",
    11,
    11,
    "给我一个奇迹好吗？让别人忽略你的存在而你却比以往更健全更有力的生存吧！",
    "李敖情书语录",
    "李敖致咪咪信",
    "信中以愿望句表达对对方生存力量的期许。",
  ),
  row(
    "003.给咪咪.txt",
    17,
    17,
    "大千世界里再也没有别人，只有你和我；你我眼中再也没有别人，只有我和你",
    "李敖情书语录",
    "李敖致咪咪信",
    "信中写两人世界的封闭与专注。",
  ),
  row(
    "003.给咪咪.txt",
    17,
    17,
    "带我们驰向那广漠的无何有之乡",
    "庄子语意化用",
    "《庄子》无何有之乡语意",
    "信中借庄子式意象写爱情幻境。",
  ),

  row(
    "004.给Bonnie.txt",
    9,
    9,
    "老僧不闻不问",
    "传统语汇",
    "禅宗语汇",
    "信中借禅宗口吻写不理臧否的姿态。",
  ),
  row(
    "004.给Bonnie.txt",
    11,
    11,
    "当其得意，忽忘形骸",
    "古典人物语",
    "阮籍相关典故",
    "信中以阮籍狂态形容放浪形骸。",
  ),
  lineRow(
    "004.给Bonnie.txt",
    15,
    17,
    "西方诗歌",
    "莎拉·蒂斯黛尔诗句",
    "信中引用女诗人诗句说明包容对方缺点。",
  ),
  row(
    "004.给Bonnie.txt",
    21,
    21,
    "一个早已被时光消磨了色彩的人，他却深愿你的未来是绚烂多彩的。",
    "李敖情书语录",
    "李敖致Bonnie信",
    "以对照句写祝福。",
  ),

  row(
    "005.给LW.txt",
    5,
    5,
    "我从不“永远”爱我所爱的女人",
    "李敖情书语录",
    "李敖致LW信",
    "信中表达不许诺永远的爱情态度。",
  ),
  row(
    "005.给LW.txt",
    9,
    9,
    "这些漂亮的条件会衰老、会凋谢、会被意外的事件所摧毁，会被另一代的女孩子所代替",
    "李敖情书语录",
    "李敖致LW信",
    "指出外在漂亮条件的易逝。",
  ),
  row(
    "005.给LW.txt",
    11,
    11,
    "美丽太多，性灵太少",
    "李敖情书语录",
    "李敖致LW信",
    "用八字概括美与性灵的不均衡。",
  ),
  row(
    "005.给LW.txt",
    13,
    13,
    "我喜欢你，为了你有一种少有的气质，这种气质我无法表达，我只能感受。",
    "李敖情书语录",
    "李敖致LW信",
    "写气质不可言说而只能感受。",
  ),
  row(
    "005.给LW.txt",
    15,
    15,
    "与其说我每一次看到你，不如说我每一次都感受到你。",
    "李敖情书语录",
    "李敖致LW信",
    "把看见转化为感受的情书句。",
  ),
  row(
    "005.给LW.txt",
    15,
    15,
    "我什么都没失去——只除了我的心。",
    "李敖情书语录",
    "李敖致LW信",
    "以反转句写动心。",
  ),
  row(
    "005.给LW.txt",
    19,
    19,
    "我不属于任何人，你也不会属于我",
    "李敖情书语录",
    "李敖致LW信",
    "信中写互不占有的爱情态度。",
  ),
  row(
    "005.给LW.txt",
    19,
    19,
    "唯一不忘的大概只是曾有那么一封信",
    "李敖情书语录",
    "李敖致LW信",
    "以一封信作为记忆的留存。",
  ),

  lineRow(
    "006.给G的九十四封信.txt",
    63,
    69,
    "李敖自作诗",
    "李敖致G信中旧作",
    "信中录出题为断肠时的四句诗。",
  ),
  row(
    "006.给G的九十四封信.txt",
    101,
    101,
    "我进入你的生命里，如果能跟别的男人有一点点不同，那就是我当你四年大学的尾声时候，在你身上打下了烙印。",
    "李敖情书语录",
    "李敖致G信",
    "写自己在对方青春尾声留下的影响。",
  ),
  row(
    "006.给G的九十四封信.txt",
    105,
    105,
    "这种影响，像一个小守护神，深深的支配着你，没有别的男人可以替代。",
    "李敖情书语录",
    "李敖致G信",
    "以守护神比喻情感影响。",
  ),
  row(
    "006.给G的九十四封信.txt",
    879,
    879,
    "他的生活丰富得像一杯醇酒",
    "纪念册题语",
    "G中学张老师题语",
    "信中回忆纪念册上老师的题语。",
  ),
  row(
    "006.给G的九十四封信.txt",
    881,
    881,
    "往事的回忆，已成为生命王冠上一朵美丽的花，为着明天，去采集更多的鲜花吧！",
    "纪念册题语",
    "G中学张老师题语",
    "信中转录纪念册题语。",
  ),
  row(
    "006.给G的九十四封信.txt",
    1796,
    1796,
    "荒谬即是正常，即是人生。",
    "李敖人生格言",
    "李敖致G信",
    "以荒谬感概括人生常态。",
  ),
  row(
    "006.给G的九十四封信.txt",
    1800,
    1800,
    "努力爱春华，莫忘欢乐时，生当复来归，死当长相忆。",
    "古典诗句",
    "苏武诗",
    "信中引用苏武写给妻子的诗句。",
  ),
  row(
    "006.给G的九十四封信.txt",
    1804,
    1804,
    "努力爱春华，可忘欢乐时，生当不来归，死当无所忆。",
    "李敖改写诗句",
    "李敖改写苏武诗",
    "信中将苏武诗改写为反向句式。",
  ),
  lineRow(
    "006.给G的九十四封信.txt",
    1950,
    1954,
    "现代诗句",
    "朱自清《仅存的》",
    "信中引用朱自清小诗《仅存的》数句。",
  ),
  row(
    "006.给G的九十四封信.txt",
    1956,
    1956,
    "人生能有几个“三十”？",
    "李敖人生格言",
    "李敖致G信",
    "以年龄节点发出人生追问。",
  ),
  row(
    "006.给G的九十四封信.txt",
    2112,
    2112,
    "我的“大眼光”是从根上扎刀，一刀见血，剖出骨髓所在，而不从枝枝节节上去费精神。",
    "李敖文学格言",
    "李敖致G信",
    "谈自己的文学观察方法。",
  ),
  row(
    "006.给G的九十四封信.txt",
    2112,
    2112,
    "一篮烂苹果，还有什么好挑的？",
    "李敖文学格言",
    "李敖致G信",
    "用烂苹果比喻整体判断。",
  ),

  row(
    "007.给尚勤的两封信.txt",
    29,
    29,
    "悲剧本是人生的一部分，就像死是人生的一部分。",
    "李敖人生格言",
    "李敖致尚勤信",
    "信中谈悲剧与死亡同属人生。",
  ),
  row(
    "007.给尚勤的两封信.txt",
    31,
    31,
    "悲剧，像死一样，总是跟着人的",
    "李敖人生格言",
    "李敖致尚勤信",
    "信中指出悲剧不可完全摆脱。",
  ),
  row(
    "007.给尚勤的两封信.txt",
    33,
    33,
    "悲剧的认定，往往不在悲剧的本身，而在你的观点。",
    "李敖人生格言",
    "李敖致尚勤信",
    "以观点转变重新解释悲剧。",
  ),
  row(
    "007.给尚勤的两封信.txt",
    33,
    33,
    "Every cloud has a silver lining",
    "英语格言",
    "英语谚语",
    "信中以黑云白边格言说明悲剧中的转机。",
  ),
  row(
    "007.给尚勤的两封信.txt",
    33,
    33,
    "会演悲剧的人不在会哭，而在会笑。",
    "李敖人生格言",
    "李敖致尚勤信",
    "以笑面对悲剧作为能力标准。",
  ),

  row(
    "008.给谷莺.txt",
    15,
    15,
    "别人只会从你身上取去食物或给你食物，但是他们不能取去或给你“生命的意义”。",
    "李敖人生格言",
    "李敖致谷莺信",
    "区分物质供取与生命意义。",
  ),
  row(
    "008.给谷莺.txt",
    19,
    19,
    "眼泪不是应付它们的最好标记。",
    "李敖人生格言",
    "李敖致谷莺信",
    "劝对方不用眼泪回应人生苦痛。",
  ),
  row(
    "008.给谷莺.txt",
    23,
    23,
    "有一个肉体暂时离开你的人，他的心灵却在你身边，他随时等你叫他为你做点事。",
    "李敖情书语录",
    "李敖致谷莺信",
    "以身离心近表达陪伴。",
  ),

  row(
    "009.给H的十三封信.txt",
    81,
    81,
    "生命是这么短，短得整天寻欢作乐都来不及，秉烛夜游都不够用，为什么还浪费生命来钩心斗角？",
    "李敖人生格言",
    "李敖致H信",
    "以生命短促反对钩心斗角。",
  ),
  row(
    "009.给H的十三封信.txt",
    187,
    187,
    "short absence quicken love； long absence kill it。",
    "西方爱情格言",
    "Mirabeau语",
    "信中引用短别与久别对爱情影响的格言。",
  ),
  row(
    "009.给H的十三封信.txt",
    261,
    261,
    "你们都是梦一般的女人，也都是要男人命的。男人无法对付你们，除非他是dream-reader。",
    "李敖情书语录",
    "李敖致H信",
    "以梦与解梦者比喻难以捉摸的女人。",
  ),
  row(
    "009.给H的十三封信.txt",
    263,
    263,
    "作为一个实际的男人，我喜欢梦一般女人。",
    "李敖情书语录",
    "李敖致H信",
    "以实际男人与梦一般女人形成对照。",
  ),

  row(
    "010.给阿贞.txt",
    11,
    11,
    "活在今天",
    "李敖人生格言",
    "李敖致阿贞信",
    "信中提出把握当下的生活方式。",
  ),
  row(
    "010.给阿贞.txt",
    11,
    11,
    "活在今天晚上",
    "李敖人生格言",
    "李敖致阿贞信",
    "把活在今天进一步推到眼前时刻。",
  ),
  row(
    "010.给阿贞.txt",
    15,
    15,
    "人生就像你昨天晚上送我的那支Salem香烟，它一定要经过不断的燃烧，才能有意义",
    "李敖人生格言",
    "李敖致阿贞信",
    "以燃烧的香烟比喻人生意义。",
  ),
  row(
    "010.给阿贞.txt",
    15,
    15,
    "正因为一切都要成灰丝尽，所以把握眼前、争取现在，才是真正有意义的事。",
    "李敖人生格言",
    "李敖致阿贞信",
    "由成灰丝尽推出把握眼前。",
  ),
  row(
    "010.给阿贞.txt",
    15,
    15,
    "“活在今天”对于我们，才显得比其他生活方式更值得选择。",
    "李敖人生格言",
    "李敖致阿贞信",
    "再次确认活在今天的选择。",
  ),
  row(
    "010.给阿贞.txt",
    17,
    17,
    "你从这个梦里走出来，变得更真实、更美、更楚楚动人",
    "李敖情书语录",
    "李敖致阿贞信",
    "写对方从梦境转为真实的动人。",
  ),

  row(
    "011.给Y的四十八封信.txt",
    53,
    53,
    "Et tu，Brutus？",
    "西方文学名句",
    "莎士比亚《裘力斯·凯撒》",
    "信中引用凯撒遇刺前的名句。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    53,
    53,
    "还有你，布鲁特斯",
    "西方文学译句",
    "李敖译莎士比亚名句",
    "李敖给出更生动的译法。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    117,
    117,
    "用“深”来爱人",
    "李敖爱情格言",
    "李敖致Y信",
    "信中提出以深度来理解爱。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    117,
    117,
    "真正“深”的地步是一种淳化",
    "李敖爱情格言",
    "李敖致Y信",
    "把爱的深度解释为淳化。",
  ),
  lineRow(
    "011.给Y的四十八封信.txt",
    121,
    123,
    "宋诗名句",
    "王安石《登飞来峰》",
    "信中引用王安石诗句。",
  ),
  lineRow(
    "011.给Y的四十八封信.txt",
    151,
    153,
    "李敖情书格言",
    "李敖致Y信",
    "以两联概括多情不牵恋与友善淡然。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    155,
    155,
    "分寸之间，说得好，是艺术；说得不好，就是“工于心计”了。",
    "李敖相处格言",
    "李敖致Y信",
    "信中说明相处分寸与心计的边界。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    155,
    155,
    "真正“工于心计”的高手，绝不把美丽的事情搅得很狼狈",
    "李敖相处格言",
    "李敖致Y信",
    "信中把高明心计解释为不破坏美好。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    155,
    155,
    "以保持距离和永恒",
    "李敖相处格言",
    "李敖致Y信",
    "以距离维持关系的永恒感。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    259,
    259,
    "纯爱keep down the base in man",
    "西方诗人语",
    "丁尼生语",
    "信中引用丁尼生关于纯爱压低卑劣性的说法。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    263,
    263,
    "我从泥土里来，又要归于泥土。",
    "李敖人生格言",
    "李敖致Y信",
    "用尘土意象写生命来去。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    263,
    263,
    "不要忘记那执灯的人。",
    "泰戈尔语",
    "泰戈尔语",
    "信中引用泰戈尔叮咛。",
  ),
  lineRow(
    "011.给Y的四十八封信.txt",
    345,
    349,
    "西方诗歌",
    "勃朗宁诗句",
    "信中引用勃朗宁关于肉体与灵魂的诗句。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    351,
    351,
    "灵魂唯有在愉快的肉体中间——那“玫瑰网眼中间”——，才能倾向大地，热望休息。",
    "西方诗歌译句",
    "李敖译勃朗宁诗意",
    "信中给出勃朗宁诗句的中文解释。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    427,
    427,
    "一星期有七个白天、七个晚上、七个孤寂的日夜、一百六十八个空虚的小时、一万零八十个“没有小Y”的分钟。",
    "李敖情书语录",
    "李敖致Y信",
    "以连续换算写等待的漫长。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    441,
    441,
    "眼泪，“只不过是刹那的真实”",
    "李敖情书语录",
    "Y信中语",
    "信中转述对方关于眼泪的说法。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    441,
    441,
    "只希望刹那刹那又刹那，不停的刹那起来",
    "李敖情书语录",
    "李敖致Y信",
    "把刹那真实延展成连续情绪。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    449,
    449,
    "明天，我们不会再在纸上“因情生怨”；明天，我们不用文字来溶化一切。",
    "李敖情书语录",
    "李敖致Y信",
    "表达从文字情书转向相见。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    591,
    591,
    "我不对女人太好！",
    "李敖情书语录",
    "李敖致Y信",
    "信中自述待人方式。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    591,
    591,
    "如果我不能厚颜，那么就让我小气吧！",
    "李敖情书语录",
    "李敖致Y信",
    "以小气反衬不愿厚颜。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    591,
    591,
    "我宁愿小气，不愿厚颜。",
    "李敖情书语录",
    "李敖致Y信",
    "信中以短句表明取舍。",
  ),
  row(
    "011.给Y的四十八封信.txt",
    612,
    612,
    "不恤人言",
    "传统成语",
    "传统成语",
    "信中用来说明不怕流言的本领。",
  ),
  lineRow(
    "011.给Y的四十八封信.txt",
    616,
    618,
    "西方诗歌",
    "威廉·布莱克《A Poison Tree》",
    "信中引用布莱克《毒药树》末两行。",
  ),
  lineRow(
    "011.给Y的四十八封信.txt",
    654,
    656,
    "李敖仿古格言",
    "李敖仿《老子》句式",
    "以天网恢恢句式改写为情网恢恢。",
  ),

  row(
    "012.给汝清的五封信.txt",
    9,
    9,
    "天下莫弱于水，而攻坚强者，莫之能胜。",
    "老子名句",
    "《老子》",
    "信中谈水时引用《老子》。",
  ),
  row(
    "012.给汝清的五封信.txt",
    9,
    9,
    "水是很好的仆人，却是残忍的主人。",
    "西方格言",
    "John Bullein语",
    "信中转述John Bullein关于水的格言。",
  ),
  row(
    "012.给汝清的五封信.txt",
    9,
    9,
    "Water Is a very good servent，but It Is a cruel master．",
    "西方格言",
    "John Bullein语",
    "与前条中文转述对应的英文原句。",
  ),
  lineRow(
    "012.给汝清的五封信.txt",
    37,
    43,
    "宗教经典译文",
    "《哥林多后书》第四章八至九节",
    "信中列出《哥林多后书》中文译句。",
  ),
  lineRow(
    "012.给汝清的五封信.txt",
    45,
    51,
    "宗教经典",
    "《哥林多后书》第四章八至九节英文",
    "与前条中文译句对应的英文经文。",
  ),
  lineRow(
    "012.给汝清的五封信.txt",
    55,
    65,
    "宗教经典译文",
    "《哥林多后书》第六章八至十节",
    "信中列出《哥林多后书》另一段中文译句。",
  ),
  row(
    "012.给汝清的五封信.txt",
    179,
    179,
    "埏埴以为器，当其无，有器之用。",
    "老子名句",
    "《老子》",
    "信中谈陶艺时引用《老子》。",
  ),
  row(
    "012.给汝清的五封信.txt",
    179,
    179,
    "人生的许多真理与愉悦，由陶瓷可象征得之。",
    "李敖艺术格言",
    "李敖致汝清信",
    "由陶器空无之用引出人生象征。",
  ),
  row(
    "012.给汝清的五封信.txt",
    189,
    189,
    "一碗饭，养恩人；一斗米，养仇人。",
    "民间谚语",
    "湖南谚语",
    "信中引用湖南谚语说明恩与怨的转化。",
  ),
];

data.forEach((record, index) => {
  record.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

const proofreadRemoved = [
  {
    id: "LAQSJ-037",
    source_file: "002.《李敖情书集》原序.txt",
    line_range: "85-85",
    quote_text: "男女关系好像一起上一座山",
    reason: "同句后两条已保留完整判断，本条只是比喻开端，校对轮删除以免重复碎片化。",
  },
  {
    id: "LAQSJ-083",
    source_file: "010.给阿贞.txt",
    line_range: "11-11",
    quote_text: "活在今天",
    reason: "短语过短，且后文已有完整句说明，校对轮删除碎片条。",
  },
  {
    id: "LAQSJ-084",
    source_file: "010.给阿贞.txt",
    line_range: "11-11",
    quote_text: "活在今天晚上",
    reason: "依附具体信件语境，独立性弱，且与保留的完整把握当下句重复。",
  },
  {
    id: "LAQSJ-089",
    source_file: "011.给Y的四十八封信.txt",
    line_range: "53-53",
    quote_text: "Et tu，Brutus？",
    reason: "虽为文学名句，但本处嵌在现代安全/身份语境中，按本项目口径从严删除。",
  },
  {
    id: "LAQSJ-090",
    source_file: "011.给Y的四十八封信.txt",
    line_range: "53-53",
    quote_text: "还有你，布鲁特斯",
    reason: "同上，译句依附现代安全/身份语境，校对轮删除。",
  },
  {
    id: "LAQSJ-103",
    source_file: "011.给Y的四十八封信.txt",
    line_range: "427-427",
    quote_text: "一星期有七个白天、七个晚上、七个孤寂的日夜、一百六十八个空虚的小时、一万零八十个“没有小Y”的分钟。",
    reason: "文字有情书色彩，但强依附具体对象小Y，不作为独立诗文格言保留。",
  },
  {
    id: "LAQSJ-104",
    source_file: "011.给Y的四十八封信.txt",
    line_range: "441-441",
    quote_text: "眼泪，“只不过是刹那的真实”",
    reason: "为信中对象语，出处与独立性都弱，校对轮删除。",
  },
  {
    id: "LAQSJ-105",
    source_file: "011.给Y的四十八封信.txt",
    line_range: "441-441",
    quote_text: "只希望刹那刹那又刹那，不停的刹那起来",
    reason: "依附前一条私人眼泪语境，校对轮删除。",
  },
];

const proofreadRemovedById = new Map(proofreadRemoved.map((record) => [record.id, record]));
const outputData = data.filter((record) => !proofreadRemovedById.has(record.id));

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

for (const file of sourceFiles) {
  readLines(file);
}

const validationErrors = [];
for (const record of outputData) {
  const sourceLines = readLines(record.source_file);
  const sourceText = sourceLines.slice(record.line_start - 1, record.line_end).join("\n");
  if (
    !sourceText.includes(record.quote_text) &&
    !compact(sourceText).includes(compact(record.quote_text))
  ) {
    validationErrors.push({
      id: record.id,
      source_file: record.source_file,
      line_start: record.line_start,
      line_end: record.line_end,
      quote_text: record.quote_text,
    });
  }
}

if (validationErrors.length > 0) {
  throw new Error(`Quote validation failed:\n${JSON.stringify(validationErrors, null, 2)}`);
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvLines = [
  columns.join(","),
  ...outputData.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
];

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txt = [];
txt.push(`《${book}》诗文格言歌谣引用`);
txt.push(`生成日期：${generatedDate}`);
txt.push(`记录数：${outputData.length}`);
txt.push("");
txt.push("口径说明：");
txt.push("- 本书为情书集，私人叙事极多；本轮只收能独立成立的诗文、格言、典故、外部引文与非公事化的李敖情书断语。");
txt.push("- 序文中的爱情观断语、外文诗句、古文成句单独保留；普通寒暄、约会安排、私人细节、攻讦性段落不收。");
txt.push("- 《寄会云》及涉及公案、组织、出版查禁、司法或现代公共事件的段落，本轮整体从严排除。");
txt.push("");

let currentChapter = "";
for (const record of outputData) {
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

const candidatePattern =
  /[“”‘’]|有道是|所谓|格言|谚语|诗|词|歌|Love|soul|life|Blake|Browning|Teasdale|Tagore|Shakespeare|王羲之|胡适|苏武|朱自清|王安石|老子|哥林多|泰戈尔|布莱克|勃朗宁|莎士比亚/i;
const riskPattern =
  /(政治|国会|总统|总裁|政府|政党|国民党|共产党|民主|选举|外交|主权|人权|二二八|西藏|雷震案|司法|法院|军政|民族国家|革命|党国|中共|马克思主义|集权政权|出版法|报禁|查禁|监狱|坐牢|判刑|告发|法庭|警备|KMT)/;

const selectedLineKeys = new Set();
for (const record of outputData) {
  for (let line = record.line_start; line <= record.line_end; line += 1) {
    selectedLineKeys.add(`${record.source_file}:${line}`);
  }
}

const candidates = [];
for (const file of sourceFiles) {
  readLines(file).forEach((lineText, index) => {
    if (candidatePattern.test(lineText)) {
      const line = index + 1;
      candidates.push({
        source_file: file,
        line,
        selected: selectedLineKeys.has(`${file}:${line}`),
        risky: riskPattern.test(lineText),
        text: lineText.trim(),
      });
    }
  });
}

const reviewCandidates = candidates.filter((candidate) => !candidate.selected);
const riskyCandidates = reviewCandidates.filter((candidate) => candidate.risky);
const candidateJsonPath = path.join(analysisDir, "liao_love_letters_candidates.json");
fs.writeFileSync(candidateJsonPath, `${JSON.stringify(candidates, null, 2)}\n`, "utf8");

const reviewTsvPath = path.join(analysisDir, "liao_love_letters_review_candidates.tsv");
const reviewLines = [
  ["source_file", "line", "risky", "text"].join("\t"),
  ...reviewCandidates.map((candidate) =>
    [
      candidate.source_file,
      candidate.line,
      candidate.risky ? "yes" : "no",
      tsvEscape(candidate.text),
    ].join("\t"),
  ),
];
fs.writeFileSync(reviewTsvPath, `\uFEFF${reviewLines.join("\r\n")}\r\n`, "utf8");

const attributedTsvPath = path.join(analysisDir, "liao_love_letters_attributed_lines.tsv");
const attributedLines = candidates
  .filter((candidate) =>
    /王羲之|胡适|苏武|朱自清|王安石|老子|哥林多|泰戈尔|布莱克|勃朗宁|莎士比亚|Teasdale|Browning|Blake|Tagore|Shakespeare/i.test(
      candidate.text,
    ),
  )
  .map((candidate) =>
    [candidate.source_file, candidate.line, candidate.selected ? "selected" : "pending", tsvEscape(candidate.text)].join(
      "\t",
    ),
  );
fs.writeFileSync(
  attributedTsvPath,
  `\uFEFF${["source_file\tline\tstatus\ttext", ...attributedLines].join("\r\n")}\r\n`,
  "utf8",
);

const excludedHighlights = [
  {
    source_file: "006.给G的九十四封信.txt",
    line_range: "519, 635, 973-993, 1421, 1666, 2008-2060",
    reason: "涉及出版、诉讼、监禁、书刊风波或公共议题，未入本轮表。",
  },
  {
    source_file: "011.给Y的四十八封信.txt",
    line_range: "742-807",
    reason: "十诫、行囚等语境含明显组织与公共议题，未入本轮表。",
  },
  {
    source_file: "012.给汝清的五封信.txt",
    line_range: "91-153",
    reason: "法律、监禁与机构讽刺语境过重，未入本轮表。",
  },
  {
    source_file: "013.寄会云.txt",
    line_range: "5-75",
    reason: "整篇主要围绕现代公共事件与法律往来，本轮从严不收。",
  },
  {
    source_file: "011.给Y的四十八封信.txt",
    line_range: "57",
    reason: "年轻国家比喻虽有机锋，但带公共比喻色彩，未收。",
  },
];

const report = [];
report.push(`《${book}》首轮抽取报告`);
report.push(`生成日期：${generatedDate}`);
report.push(`输出：${csvPath}`);
report.push(`输出：${txtPath}`);
report.push(`首轮记录数：${data.length}`);
report.push(`校对后记录数：${outputData.length}`);
report.push(`校对删除：${proofreadRemoved.length}`);
report.push(`候选行：${candidates.length}`);
report.push(`待复核候选行：${reviewCandidates.length}`);
report.push(`待复核高风险候选行：${riskyCandidates.length}`);
report.push("");
report.push("分类统计：");
const categoryCounts = new Map();
for (const record of outputData) {
  categoryCounts.set(record.category, (categoryCounts.get(record.category) ?? 0) + 1);
}
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
  report.push(`- ${category}: ${count}`);
}
report.push("");
report.push("校对轮删除：");
for (const item of proofreadRemoved) {
  report.push(`- ${item.id}｜${item.source_file}:${item.line_range}｜${item.quote_text}｜${item.reason}`);
}
report.push("");
report.push("本轮特别排除：");
for (const item of excludedHighlights) {
  report.push(`- ${item.source_file}:${item.line_range}｜${item.reason}`);
}
report.push("");
report.push("后续校对重点：");
report.push("- 本书李敖自写情书断语数量较多，校对轮可继续删去只适合私人语境、不够独立的句子。");
report.push("- 《给G的九十四封信》《给Y的四十八封信》仍有大量带引号候选行，已输出 review_candidates.tsv 供下一轮核查。");
report.push("- 中英文诗句的作者归属多依原书叙述，若后续需要可再做出处精校。");

const reportPath = path.join(analysisDir, "liao_love_letters_initial_report.txt");
fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

const proofreadReportPath = path.join(analysisDir, "liao_love_letters_proofread_report.txt");
fs.writeFileSync(proofreadReportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

const auditPath = path.join(analysisDir, "liao_love_letters_initial_audit.tsv");
const auditColumns = ["decision", "id", "source_file", "line_range", "category", "quote_text", "reason"];
const auditRows = [
  ...outputData.map((record) => ({
    decision: "keep",
    id: record.id,
    source_file: record.source_file,
    line_range: `${record.line_start}-${record.line_end}`,
    category: record.category,
    quote_text: record.quote_text,
    reason: record.summary,
  })),
  ...proofreadRemoved.map((item) => ({
    decision: "delete",
    id: item.id,
    source_file: item.source_file,
    line_range: item.line_range,
    category: "",
    quote_text: item.quote_text,
    reason: item.reason,
  })),
  ...excludedHighlights.map((item) => ({
    decision: "exclude",
    id: "",
    source_file: item.source_file,
    line_range: item.line_range,
    category: "",
    quote_text: "",
    reason: item.reason,
  })),
];
const auditLines = [
  auditColumns.join("\t"),
  ...auditRows.map((record) =>
    auditColumns.map((column) => tsvEscape(record[column])).join("\t"),
  ),
];
fs.writeFileSync(auditPath, `\uFEFF${auditLines.join("\r\n")}\r\n`, "utf8");

const proofreadAuditPath = path.join(analysisDir, "liao_love_letters_proofread_audit.tsv");
fs.writeFileSync(proofreadAuditPath, `\uFEFF${auditLines.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      firstRoundRecords: data.length,
      records: outputData.length,
      proofreadRemoved: proofreadRemoved.length,
      csvPath,
      txtPath,
      reportPath,
      proofreadReportPath,
      auditPath,
      proofreadAuditPath,
      candidateJsonPath,
      reviewTsvPath,
      attributedTsvPath,
      candidates: candidates.length,
      reviewCandidates: reviewCandidates.length,
      riskyReviewCandidates: riskyCandidates.length,
    },
    null,
    2,
  ),
);
