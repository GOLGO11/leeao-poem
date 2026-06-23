const fs = require("fs");
const path = require("path");

const book = "给马戈的五十封信";
const idPrefix = "LAGMG";
const generatedDate = "2026-06-23";
const outDir = "exports";
const analysisDir = "analysis";
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "008.书信函件类",
  "011.给马戈的五十封信",
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

function sourceFiles() {
  return fs.readdirSync(path.join(process.cwd(), sourceDir))
    .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
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

function compact(text) {
  return String(text).replace(/[\s　]+/g, "");
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
  row(
    "001.无闻之美.txt",
    5,
    5,
    "无闻之美",
    "李敖处世短语",
    "李敖致马戈信",
    "以不问结果的态度概括洒脱之美。",
  ),
  row(
    "001.无闻之美.txt",
    5,
    5,
    "不可为的事不可悬念它，不再过问它最好。",
    "李敖处世格言",
    "李敖致马戈信",
    "劝朋友摆脱不可为之事的悬念。",
  ),
  lineRow(
    "002.“我自成佛不读经”.txt",
    7,
    13,
    "友人诗",
    "景新汉与马戈诗",
    "信中录出新汉和马戈的送别诗。",
  ),
  lineRow(
    "002.“我自成佛不读经”.txt",
    19,
    21,
    "李敖英文墓志铭",
    "李敖课堂作文自拟",
    "李敖自拟英文墓志铭。",
  ),
  row(
    "006.活页日记.txt",
    15,
    15,
    "第一手的，最原始的，也是最好的“活页日记”",
    "李敖写作短语",
    "李敖致马戈信",
    "把往来书信称作最原始的一手活页日记。",
  ),
  lineRow(
    "006.活页日记.txt",
    39,
    41,
    "李敖对联",
    "李敖脱口对联",
    "以秦琼、苏武典故写成的鼓励对联。",
  ),
  row(
    "006.活页日记.txt",
    47,
    47,
    "微之微之，知我心哉！",
    "古文名句",
    "元稹相关文句",
    "孤寂中诵元九文句。",
  ),
  row(
    "006.活页日记.txt",
    49,
    49,
    "光阴如箭，日月如梭",
    "俗谚",
    "传统俗语",
    "感叹时间流逝的成语化俗语。",
  ),
  row(
    "008.提倡狠心肠.txt",
    5,
    5,
    "坚强比什么都重要",
    "李敖人生格言",
    "李敖致马戈信",
    "以坚强压过感情负担的断语。",
  ),
  row(
    "009.爱情牢骚.txt",
    15,
    15,
    "吾与其富贵而诎于人，宁贫贱而轻世肆志焉！",
    "古典名句",
    "鲁仲连语",
    "信中引用鲁仲连不屈于人的名句。",
  ),
  row(
    "009.爱情牢骚.txt",
    17,
    17,
    "吾与其恋爱而诎于人，宁光杆而轻世肆志焉！",
    "李敖改写格言",
    "李敖改写鲁仲连语",
    "把鲁仲连名句改写为爱情尊严断语。",
  ),
  lineRow(
    "009.爱情牢骚.txt",
    31,
    33,
    "李敖爱情格言",
    "李敖致马戈信",
    "以浪漫的容许度概括自己的恋爱观。",
  ),
  row(
    "010.有耳无膜.txt",
    5,
    5,
    "他样子像神父，行为却不像。",
    "电影台词译句",
    "电影台词",
    "信中套用电影里的俏皮话。",
  ),
  lineRow(
    "010.有耳无膜.txt",
    9,
    11,
    "唐诗句",
    "贾岛诗句",
    "信中引用贾岛诗句自嘲无人赏识歌声。",
  ),
  row(
    "010.有耳无膜.txt",
    15,
    15,
    "我们才是真人，他们只是影子。",
    "电影台词译句",
    "《啼笑泪痕》台词",
    "信中称赞电影中的影子双关句。",
  ),
  row(
    "011.赫本欠资.txt",
    11,
    11,
    "弱女虽非男，慰情聊胜无。",
    "古典诗句",
    "陶渊明诗句",
    "信中借陶渊明诗句调侃赫本照片。",
  ),
  row(
    "012.十字街头筑隐居.txt",
    13,
    13,
    "夫唯不争，故天下莫能与之争。",
    "老子名句",
    "《老子》",
    "信中以老子名句说明不争风度。",
  ),
  row(
    "012.十字街头筑隐居.txt",
    17,
    17,
    "I strove with none, for none was worth my strife.",
    "西方诗句",
    "W. S. Landor",
    "信中引用 Landor 诗句表达不与人争。",
  ),
  lineRow(
    "012.十字街头筑隐居.txt",
    27,
    29,
    "李敖自作诗",
    "李敖致马戈信",
    "十字街头筑隐居的自作诗之一。",
  ),
  lineRow(
    "012.十字街头筑隐居.txt",
    33,
    35,
    "李敖自作诗",
    "李敖致马戈信",
    "十字街头筑隐居的自作诗之二。",
  ),
  lineRow(
    "012.十字街头筑隐居.txt",
    39,
    45,
    "签诗",
    "木栅抽签签诗",
    "信中转录抽得的签诗。",
  ),
  lineRow(
    "012.十字街头筑隐居.txt",
    61,
    67,
    "佛教偈句",
    "佛书引语",
    "信中引用因地果还生的佛书偈句。",
  ),
  row(
    "013.所谓“黄色”.txt",
    11,
    11,
    "不该以成败及效果衡量哪件事该做哪件事不该做。",
    "李敖处世格言",
    "李敖致马戈信",
    "反对只用成败效果衡量行为。",
  ),
  lineRow(
    "014.明归何处.txt",
    13,
    15,
    "英文电影台词",
    "《惹祸女郎》台词",
    "信中引用电影台词写及时行乐感。",
  ),
  row(
    "014.明归何处.txt",
    23,
    23,
    "不论在任何情形下，我永远赞成幽默和穷开心，莞尔一笑，庸何伤乎？",
    "李敖人生格言",
    "李敖致马戈信",
    "赞成幽默与穷开心的生活态度。",
  ),
  lineRow(
    "015.小舟之逝，从此始矣！.txt",
    21,
    23,
    "诗句",
    "原书未注出处",
    "信中引用知音不存何所悲的诗句。",
    "出处待校对轮细化。",
  ),
  lineRow(
    "015.小舟之逝，从此始矣！.txt",
    31,
    33,
    "传统联语",
    "古人语",
    "信中引用英雄本色、名士风流的联语。",
  ),
  row(
    "015.小舟之逝，从此始矣！.txt",
    37,
    37,
    "合则留，不合则去，光明磊落，难进而易退，绝不为女人而折腰",
    "李敖处世格言",
    "李敖致马戈信",
    "以不折腰概括取舍态度。",
  ),
  row(
    "017.过渡时期的爱情观.txt",
    17,
    17,
    "睁开眼睛去看女人于恋爱之前，也睁开眼睛于恋爱之时，更睁开眼睛于恋爱（垮台）之后。",
    "李敖爱情格言",
    "李敖致马戈信",
    "强调恋爱前中后都要保持清醒。",
  ),
  row(
    "017.过渡时期的爱情观.txt",
    31,
    31,
    "“恨”是力量，有时比“爱”还大",
    "李敖情感格言",
    "李敖致马戈信",
    "以恨的力量对照爱的力量。",
  ),
  row(
    "018.譬如赤子.txt",
    11,
    11,
    "不失其赤子之心",
    "孟子成句",
    "《孟子》",
    "信中借孟子语谈成人仍保赤子之心。",
  ),
  row(
    "020.真正的自由恋爱者.txt",
    11,
    11,
    "三号而出",
    "古典典故",
    "秦失吊老聃典故",
    "信中以秦失三号而出说明超世俗反应。",
  ),
  row(
    "020.真正的自由恋爱者.txt",
    11,
    11,
    "鼓盆而歌",
    "庄子典故",
    "庄周典故",
    "信中以庄周鼓盆而歌说明超世俗反应。",
  ),
  row(
    "020.真正的自由恋爱者.txt",
    11,
    11,
    "太上忘情",
    "传统成语",
    "传统情感成语",
    "信中用来形容达观的爱情境界。",
  ),
  row(
    "020.真正的自由恋爱者.txt",
    19,
    19,
    "不能实行的理论是站不住的",
    "李敖思想格言",
    "李敖致马戈信",
    "反对不能实行的空理论。",
  ),
  row(
    "020.真正的自由恋爱者.txt",
    21,
    21,
    "刚亦不吐，柔亦不茹",
    "古典成句",
    "《诗经》语意",
    "信中用来形容不欺弱不畏强的英雄气。",
  ),
  row(
    "021.只消捡起一块石头.txt",
    5,
    5,
    "何物传统，胆敢阻老子一意孤行!",
    "李敖人生格言",
    "李敖致马戈信",
    "以戏谑句表达对传统拘束的反抗。",
  ),
  row(
    "021.只消捡起一块石头.txt",
    9,
    9,
    "与不能“交通”者，夫复何言哉！",
    "李敖处世格言",
    "李敖致马戈信",
    "把不可沟通者不必多言推成文言句。",
  ),
  row(
    "021.只消捡起一块石头.txt",
    11,
    11,
    "视其人如不见，听其言如不闻",
    "李敖处世格言",
    "李敖致马戈信",
    "以无言方式应对凡俗攻击。",
  ),
  row(
    "021.只消捡起一块石头.txt",
    15,
    15,
    "群籁虽参差 适我无非新",
    "古典诗句",
    "王右军诗",
    "信中引用王羲之诗句。",
  ),
  lineRow(
    "021.只消捡起一块石头.txt",
    35,
    35,
    "思想超人化，行为俗人化",
    "李敖人生格言",
    "李敖致马戈信",
    "以双句概括思想与行为的双重策略。",
  ),
  row(
    "021.只消捡起一块石头.txt",
    45,
    45,
    "Be ready to die tomorrow, but live as if you live forever!",
    "英文格言",
    "原书未注出处",
    "信中宣传及时生活的英文格言。",
    "出处待校对轮细化。",
  ),
  lineRow(
    "022.桃花路上.txt",
    5,
    7,
    "电影台词译句",
    "电影《桃花运》台词",
    "信中引用电影中的桃花路句。",
  ),
  row(
    "022.桃花路上.txt",
    13,
    13,
    "人生可纪念之日愈多愈好",
    "电影台词译句",
    "电影《彩凤伴金龙》台词",
    "信中转述电影中的人生纪念日句。",
  ),
  row(
    "022.桃花路上.txt",
    17,
    17,
    "一码事是一码事，不可代换也不可转移",
    "李敖思想格言",
    "李敖致马戈信",
    "反对把不同情绪与观念相互代换。",
  ),
  lineRow(
    "023.寡情如此.txt",
    7,
    13,
    "李敖打油诗",
    "李敖致马戈信",
    "写不能交通者不必多言的打油诗之一。",
  ),
  lineRow(
    "023.寡情如此.txt",
    15,
    21,
    "李敖打油诗",
    "李敖致马戈信",
    "写不与俗人多言的打油诗之二。",
  ),
  row(
    "023.寡情如此.txt",
    25,
    25,
    "如优昙钵华，时一现耳",
    "佛教典故",
    "佛经语",
    "信中借佛言写昙花一现。",
  ),
  row(
    "023.寡情如此.txt",
    25,
    25,
    "昙花一现",
    "成语典故",
    "佛教典故",
    "由佛经优昙钵华引出的成语。",
  ),
  lineRow(
    "023.寡情如此.txt",
    27,
    29,
    "宋词句",
    "张孝祥词",
    "信中引用张孝祥词句写肝胆冰雪。",
  ),
  row(
    "023.寡情如此.txt",
    31,
    31,
    "用心霜雪间，不必条蔓绿",
    "古典诗句",
    "原书未注出处",
    "信中引用或化用霜雪间句写硬汉气。",
    "出处待校对轮细化。",
  ),
  row(
    "023.寡情如此.txt",
    35,
    35,
    "昙花哲学",
    "李敖人生短语",
    "李敖致马戈信",
    "以昙花只开一次概括一种人生姿态。",
  ),
  row(
    "023.寡情如此.txt",
    39,
    39,
    "礼失求诸野",
    "儒家成句",
    "孔丘语",
    "信中借孔子语说明旧友保存往事。",
  ),
  row(
    "023.寡情如此.txt",
    39,
    39,
    "己失求诸故",
    "李敖套语",
    "李敖套孔子语",
    "由礼失求诸野套出的自嘲句。",
  ),
  row(
    "023.寡情如此.txt",
    39,
    39,
    "后之视今，犹今之视昔",
    "古文名句",
    "王羲之《兰亭集序》",
    "信中以《兰亭集序》句说明后来人看今日。",
  ),
  lineRow(
    "025.笑尽世间可笑人.txt",
    3,
    9,
    "李敖自作诗",
    "李敖致马戈信",
    "教师节醒后写给马戈的小诗。",
  ),
  row(
    "027.为前信进一解.txt",
    15,
    15,
    "不见可欲，其心不乱",
    "老子名句",
    "《老子》",
    "信中借老子句说明减少刺激。",
  ),
  row(
    "027.为前信进一解.txt",
    15,
    15,
    "善战者不战",
    "传统兵法格言",
    "兵法语意",
    "信中用来说明最坚强者不轻用坚强。",
  ),
  lineRow(
    "028.“捐书谢俗议”.txt",
    5,
    7,
    "古典诗句",
    "刘敞《今是集·陈亢龙》",
    "信中引用刘敞诗中四句的后半。",
  ),
  row(
    "028.“捐书谢俗议”.txt",
    9,
    9,
    "非常之谤，不动于心，过人之侮，不形于色",
    "处世格言",
    "李敖引述语",
    "以不理俗议说明傲岸自洁。",
  ),
  lineRow(
    "030.口占打油诗.txt",
    3,
    9,
    "李敖打油诗",
    "李敖口占",
    "送行朋友归去时口占的打油诗。",
  ),
  lineRow(
    "033.多变反复.txt",
    7,
    9,
    "李敖改写诗",
    "李敖改写李白诗",
    "信中改写马戈寄来的李白诗意。",
  ),
  lineRow(
    "035.女人如牙刷.txt",
    15,
    21,
    "李敖自作诗",
    "李敖致马戈信",
    "写冲决烦恼网后的乐天派。",
  ),
  lineRow(
    "036.“成佛安可不读经？”.txt",
    5,
    5,
    "李敖自作诗",
    "李敖驳老景诗",
    "逻辑课上写给马戈的三诗之一。",
  ),
  lineRow(
    "036.“成佛安可不读经？”.txt",
    9,
    9,
    "李敖自作诗",
    "李敖驳老马诗",
    "逻辑课上写给马戈的三诗之二。",
  ),
  lineRow(
    "036.“成佛安可不读经？”.txt",
    13,
    13,
    "李敖自作诗",
    "李敖奉二老诗",
    "逻辑课上写给马戈的三诗之三。",
  ),
  lineRow(
    "042.成诗数首.txt",
    5,
    19,
    "李敖自作诗",
    "李敖《乌来观瀑诗》",
    "成诗数首之一。",
  ),
  lineRow(
    "042.成诗数首.txt",
    23,
    25,
    "李敖自作诗",
    "李敖戏耀祖诗",
    "成诗数首之二。",
  ),
  lineRow(
    "042.成诗数首.txt",
    35,
    41,
    "李敖自作诗",
    "李敖致马戈信",
    "成诗数首之四。",
  ),
  lineRow(
    "042.成诗数首.txt",
    45,
    51,
    "李敖自作诗",
    "李敖致马戈信",
    "成诗数首之五。",
  ),
  lineRow(
    "042.成诗数首.txt",
    55,
    61,
    "李敖自作诗",
    "李敖致马戈信",
    "成诗数首之六。",
  ),
  lineRow(
    "043.非“痴”.txt",
    7,
    11,
    "马戈诗句",
    "马戈来诗",
    "信中评论马戈来诗的几句。",
  ),
  row(
    "043.非“痴”.txt",
    21,
    21,
    "智伯以国士待我，故以国士报之！",
    "古典人物语",
    "豫让典故",
    "信中借豫让说明知己相待。",
  ),
  row(
    "043.非“痴”.txt",
    21,
    21,
    "士为知己者死",
    "古典成句",
    "豫让典故",
    "信中由豫让故事引出知己者死。",
  ),
  lineRow(
    "043.非“痴”.txt",
    25,
    31,
    "诗经句",
    "《诗经·卫风·木瓜》",
    "信中引用投我以木桃、报之以琼瑶三章。",
  ),
  row(
    "043.非“痴”.txt",
    37,
    37,
    "以德报怨",
    "儒家成句",
    "《论语》相关语",
    "信中提到孔子反对以德报怨。",
  ),
  row(
    "043.非“痴”.txt",
    37,
    37,
    "报以“直”",
    "儒家成句",
    "《论语》相关语",
    "信中提到孔子主张以直报怨。",
  ),
  row(
    "043.非“痴”.txt",
    45,
    45,
    "你对我的念头只不过是狂想，是你发明的！",
    "电影台词译句",
    "《断肠飘香不了情》台词",
    "信中引用电影台词批评爱情狂想。",
  ),
  row(
    "045.非“痴”又一章.txt",
    19,
    19,
    "与其长期闹头痛，还不如干脆昏倒一次。",
    "现代人物妙语",
    "林语堂演说语",
    "信中引用林语堂在南洋大学的妙语。",
  ),
  row(
    "045.非“痴”又一章.txt",
    21,
    21,
    "能够认识一切价值都是肯定了假定之后，你才能透视许多问题，达到高度的客观。",
    "马戈默思录语",
    "马戈《默思录》",
    "信中引用马戈默思录中的价值判断句。",
  ),
  lineRow(
    "045.非“痴”又一章.txt",
    45,
    45,
    "人生快乐的条件之一在“时时有个自己感兴趣的问题想研究”。",
    "李敖人生格言",
    "李敖致马戈信",
    "以持续研究兴趣作为人生快乐条件。",
  ),
  lineRow(
    "046.蛋炒饭.txt",
    41,
    41,
    "南亩耕，东山卧，世态人情经历多，闲将往事思量过，贤的是他，愚的是我，争甚么？",
    "元曲名句",
    "关汉卿《四块玉》",
    "信中引用关汉卿《四块玉》。",
  ),
  lineRow(
    "047.又是诗.txt",
    5,
    11,
    "李敖自作诗",
    "李敖致马戈信",
    "《又是诗》中李敖所作。",
  ),
  lineRow(
    "048.女孩子哪里有这么大的抗酵素？.txt",
    19,
    21,
    "李敖词",
    "李敖《好事近》",
    "写给胡适六十八岁生日的词。",
  ),
  row(
    "050.一封没写完的信.txt",
    7,
    7,
    "行有余力则以学文",
    "儒家成句",
    "《论语》",
    "信中引《论语》句谈学文与谋生。",
  ),
  row(
    "050.一封没写完的信.txt",
    7,
    7,
    "文化商人",
    "李敖文化短语",
    "李敖致马戈信",
    "以文化商人概括经营与文化事业结合。",
  ),
  row(
    "050.一封没写完的信.txt",
    17,
    17,
    "取之不伤廉",
    "传统成句",
    "传统处世语",
    "信中用于说明赚钱行业须不伤廉。",
  ),
  lineRow(
    "051.跋《给马戈的五十封信》.txt",
    3,
    5,
    "近代诗句",
    "梁启超诗",
    "跋文开头所引梁启超诗。",
  ),
  row(
    "051.跋《给马戈的五十封信》.txt",
    17,
    17,
    "十年的友情像一颗逐渐暗淡的小星，我们只有靠可怜的“心灵感应”，去维持它的余光了。",
    "李敖友情语录",
    "李敖跋文",
    "跋文中写与马戈友情渐淡的比喻句。",
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

const candidatePattern =
  /[“”‘’《》]|诗曰|诗云|诗言|古人说|佛书上说|佛言|老氏说|孔丘说|王右军诗|张孝祥词|关汉卿|梁启超|鲁仲连|陶渊明|贾岛|孟夫子|王羲之|刘敞|林语堂|Landor|Here today|Where tomorrow|Be ready|格言|谚|所谓|成一诗|成此小诗|口占|打油诗|好事近|诗经|论语|老子|庄子|苏武|秦琼|元九|马戈默思录/i;
const riskPattern =
  /(政治|政府|总统|政党|国民党|共产党|民主|选举|操纵选举|总干事|副总干事|自由主义|国家|国运|法院|警察|警察干涉|竞选|代联会|党|统治|特务|坐牢|军官|教官|军|官|中共|革命|司法|法律|警备|国防|外交|出版法|查禁|报禁|民族|主权|人权|总统|政客|KMT)/i;

function validateRows(rows) {
  const ids = new Set();
  const errors = [];
  for (const record of rows) {
    if (ids.has(record.id)) errors.push(`Duplicate id: ${record.id}`);
    ids.add(record.id);
    const sourceText = readLines(record.source_file)
      .slice(record.line_start - 1, record.line_end)
      .join("\n");
    if (
      !sourceText.includes(record.quote_text) &&
      !compact(sourceText).includes(compact(record.quote_text))
    ) {
      errors.push(`Quote not found: ${record.id} ${record.source_file}:${record.line_start}-${record.line_end}`);
    }
  }
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

function collectCandidates(rows) {
  const selectedLineKeys = new Set();
  for (const record of rows) {
    for (let line = record.line_start; line <= record.line_end; line += 1) {
      selectedLineKeys.add(`${record.source_file}:${line}`);
    }
  }

  const candidates = [];
  let totalLines = 0;
  let riskLines = 0;
  for (const file of sourceFiles()) {
    const lines = readLines(file);
    totalLines += lines.length;
    lines.forEach((text, index) => {
      const clean = text.trim();
      if (!clean || /李敖影音|李敖数字博物馆|资源下载站|油管|抖音|小红书|哔哩哔哩/.test(clean)) return;
      const risky = riskPattern.test(clean);
      if (risky) riskLines += 1;
      if (candidatePattern.test(clean) || risky) {
        candidates.push({
          source_file: file,
          line: index + 1,
          selected: selectedLineKeys.has(`${file}:${index + 1}`),
          risky,
          text: clean,
        });
      }
    });
  }
  return { candidates, totalLines, riskLines };
}

function writeCsv(rows, csvPath) {
  const csvLines = [
    columns.join(","),
    ...rows.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
  ];
  fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");
}

function writeTxt(rows, txtPath) {
  const txt = [];
  txt.push(`《${book}》诗文格言歌谣引用`);
  txt.push(`生成日期：${generatedDate}`);
  txt.push(`记录数：${rows.length}`);
  txt.push("");
  txt.push("口径说明：");
  txt.push("- 本书为早年朋友书信，首轮收录外部诗文典故、电影/现代人物妙语、李敖及友人的自作诗、可独立成立的处世与爱情格言。");
  txt.push("- 普通寒暄、私人安排、书目往来、私人攻击和仅靠语气取胜的聊天句不收。");
  txt.push("- 学生选举、伪自由主义争论、大学机构叙述、公共人物政治化评价等段落从严排除；仅保留其中能独立成立且非政治的诗文材料。");
  txt.push("");

  let currentChapter = "";
  for (const record of rows) {
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

  fs.writeFileSync(txtPath, `\uFEFF${txt.join("\r\n")}\r\n`, "utf8");
}

function writeAnalysis(rows, candidatesInfo) {
  const candidateJsonPath = path.join(analysisDir, "liao_mage_quote_candidates.json");
  fs.writeFileSync(candidateJsonPath, `${JSON.stringify(candidatesInfo.candidates, null, 2)}\n`, "utf8");

  const reviewTsvPath = path.join(analysisDir, "liao_mage_review_candidates.tsv");
  const reviewCandidates = candidatesInfo.candidates.filter((candidate) => !candidate.selected);
  const reviewLines = [
    "source_file\tline\trisky\ttext",
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

  const attributedTsvPath = path.join(analysisDir, "liao_mage_attributed_lines.tsv");
  const attributedLines = [
    "source_file\tline\tstatus\ttext",
    ...candidatesInfo.candidates
      .filter((candidate) =>
        /诗曰|诗云|诗言|古人说|佛书上说|佛言|老氏说|孔丘说|王右军诗|张孝祥词|关汉卿|梁启超|鲁仲连|陶渊明|贾岛|孟夫子|王羲之|刘敞|林语堂|Landor|诗经|论语|老子|庄子/i.test(candidate.text),
      )
      .map((candidate) =>
        [
          candidate.source_file,
          candidate.line,
          candidate.selected ? "selected" : "pending",
          tsvEscape(candidate.text),
        ].join("\t"),
      ),
  ];
  fs.writeFileSync(attributedTsvPath, `\uFEFF${attributedLines.join("\r\n")}\r\n`, "utf8");

  const auditPath = path.join(analysisDir, "liao_mage_initial_audit.tsv");
  const auditLines = [
    "decision\tid\tsource_file\tline_range\tcategory\trisk_in_quote\tquote_text\treason",
    ...rows.map((record) =>
      [
        "keep",
        record.id,
        record.source_file,
        `${record.line_start}-${record.line_end}`,
        record.category,
        riskPattern.test(record.quote_text) ? "yes" : "no",
        tsvEscape(record.quote_text),
        tsvEscape(record.summary),
      ].join("\t"),
    ),
  ];
  fs.writeFileSync(auditPath, `\uFEFF${auditLines.join("\r\n")}\r\n`, "utf8");

  const categoryCounts = new Map();
  for (const record of rows) {
    categoryCounts.set(record.category, (categoryCounts.get(record.category) ?? 0) + 1);
  }
  const riskyRows = rows.filter((record) => riskPattern.test(record.quote_text));
  const explicitlyExcluded = [
    "031.操纵选举.txt：学生选举和操纵总干事语境，未收。",
    "032.历史系总干事.txt：总干事、副总干事等组织职务语境，未收。",
    "040.伪自由主义者林瘟生.txt：文件名和正文紧贴自由主义攻击、竞选代联会主席和人身攻击诗，整章未收。",
    "041.迎胡适.txt：机场迎胡适与记者问答属现代公共人物轶事，本轮未收。",
    "048.女孩子哪里有这么大的抗酵素？.txt：广告图受警察干涉等公共管制语境未收，只保留《好事近》词。",
    "051.跋《给马戈的五十封信》.txt：钱思亮统治下的台湾大学等公共/教育史评论未收。",
  ];

  const report = [];
  report.push(`《${book}》首轮抽取报告`);
  report.push(`生成日期：${generatedDate}`);
  report.push(`源目录：${path.join(process.cwd(), sourceDir)}`);
  report.push(`源文件数：${sourceFiles().length}`);
  report.push(`源总行数：${candidatesInfo.totalLines}`);
  report.push(`候选行数：${candidatesInfo.candidates.length}`);
  report.push(`风险词行数：${candidatesInfo.riskLines}`);
  report.push("");
  report.push(`首轮收录条目：${rows.length}`);
  report.push(`CSV：${path.join(process.cwd(), outDir, `${book}_诗文格言歌谣引用.csv`)}`);
  report.push(`TXT：${path.join(process.cwd(), outDir, `${book}_诗文格言歌谣引用.txt`)}`);
  report.push(`审计：${path.join(process.cwd(), auditPath)}`);
  report.push("");
  report.push("类别分布：");
  for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    report.push(`- ${category}: ${count}`);
  }
  report.push("");
  report.push(`核心政治风险命中：${riskyRows.length}`);
  for (const record of riskyRows) {
    report.push(`- ${record.id}\t${record.source_file}:${record.line_start}\t${record.quote_text}`);
  }
  report.push("");
  report.push("本轮特别排除：");
  for (const item of explicitlyExcluded) report.push(`- ${item}`);
  report.push("");
  report.push("首轮取舍说明：");
  report.push("- 本书首轮偏宽收录可独立成立的诗文、格言和自作诗，后续校对轮可继续删去私人化、粗糙或重复的李敖短句。");
  report.push("- 对出现学生组织、选举、伪自由主义、公共人物或大学体制评论的章节，先从严排除政治/公共议题句。");
  report.push("- 若同章含外部古典诗文或可独立成立的非政治文学材料，则单独保留。");

  const reportPath = path.join(analysisDir, "liao_mage_initial_report.txt");
  fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(analysisDir, { recursive: true });
  for (const file of sourceFiles()) readLines(file);

  validateRows(data);

  const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
  const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
  writeCsv(data, csvPath);
  writeTxt(data, txtPath);
  writeAnalysis(data, collectCandidates(data));

  console.log(JSON.stringify({
    book,
    records: data.length,
    csvPath,
    txtPath,
    reportPath: path.join(analysisDir, "liao_mage_initial_report.txt"),
    auditPath: path.join(analysisDir, "liao_mage_initial_audit.tsv"),
    candidatePath: path.join(analysisDir, "liao_mage_quote_candidates.json"),
    reviewPath: path.join(analysisDir, "liao_mage_review_candidates.tsv"),
    attributedPath: path.join(analysisDir, "liao_mage_attributed_lines.tsv"),
  }, null, 2));
}

main();
