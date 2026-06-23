const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(
  root,
  "《大李敖全集6.0》分章节",
  "008.书信函件类",
  "003.李敖书翰集"
);
const exportsDir = path.join(root, "exports");
const analysisDir = path.join(root, "analysis");
const bookName = "李敖书翰集";
const generatedDate = "2026-06-22";
const sourceBase = "《大李敖全集6.0》分章节/008.书信函件类/003.李敖书翰集";

const outputCsv = path.join(exportsDir, `${bookName}_诗文格言歌谣引用.csv`);
const outputTxt = path.join(exportsDir, `${bookName}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_shuhanji_initial_report.txt");
const auditPath = path.join(analysisDir, "liao_shuhanji_initial_audit.tsv");
const proofreadReportPath = path.join(analysisDir, "liao_shuhanji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_shuhanji_proofread_audit.tsv");
const candidatesPath = path.join(analysisDir, "liao_shuhanji_quote_candidates.json");
const reviewPath = path.join(analysisDir, "liao_shuhanji_review_candidates.tsv");
const attributedPath = path.join(analysisDir, "liao_shuhanji_attributed_lines.tsv");

const decoder = new TextDecoder("gb18030");
const quotePattern = /[“”‘’『』「」《》]|(?:[A-Z][A-Za-z]+(?:[,，；;:：'’!?\- ]+[A-Za-z]+){3,})/;
const politicalPattern =
  /(政治|国会|总统|总裁|政府|政党|国民党|共产党|民主|选举|外交|主权|人权|二二八|西藏|雷震案|司法|法院|军政|民族国家|革命|党国|中共|马克思主义|集权政权|出版法|报禁|查禁)/;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readText(filePath) {
  return decoder.decode(fs.readFileSync(filePath));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function compact(text) {
  return String(text)
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeForMatch(text) {
  return compact(text).replace(/\s+/g, "");
}

function getSourceFiles() {
  return fs
    .readdirSync(sourceDir)
    .filter((name) => name.endsWith(".txt"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
    .map((name) => ({
      name,
      absolutePath: path.join(sourceDir, name),
      sourceFile: `${sourceBase}/${name}`,
      text: readText(path.join(sourceDir, name)),
    }));
}

const entries = [
  {
    file: "002.回信给中央研究院的一员.txt",
    lineStart: 27,
    lineEnd: 27,
    quote: "歧路上的亡羊",
    category: "成语典故",
    origin: "《列子》寓意",
    summary: "用歧路亡羊比喻方向纷乱、目标难寻。",
    notes: "保留成语本身，略去现代机构争论。",
  },
  {
    file: "003.旧信劫遗.txt",
    lineStart: 7,
    lineEnd: 7,
    quote: "圣人不空出，贤者不虚生",
    category: "古人格言",
    origin: "古话",
    summary: "贤圣出现必有时代意义。",
    notes: "",
  },
  {
    file: "003.旧信劫遗.txt",
    lineStart: 141,
    lineEnd: 141,
    quote: "死文字",
    category: "文字评论",
    origin: "李敖",
    summary: "批评脱离当代生命的文字形式。",
    notes: "",
  },
  {
    file: "003.旧信劫遗.txt",
    lineStart: 141,
    lineEnd: 141,
    quote: "我们是新时代的人，为什么不用新时代的文字？",
    category: "文论格言",
    origin: "李敖",
    summary: "主张写作应使用与时代相称的文字。",
    notes: "",
  },
  {
    file: "003.旧信劫遗.txt",
    lineStart: 161,
    lineEnd: 161,
    quote: "Physician，heal thyself.（医生，你治治自己吧！）",
    category: "西方格言",
    origin: "《圣经》路加福音",
    summary: "劝人先反求诸己。",
    notes: "按原文保留中文逗号。",
  },
  {
    file: "003.旧信劫遗.txt",
    lineStart: 331,
    lineEnd: 331,
    quote: "一寸远一个慌",
    category: "俚语俗谚",
    origin: "吾乡俚语",
    summary: "说传闻每远一寸便多一层失真。",
    notes: "",
  },
  {
    file: "003.旧信劫遗.txt",
    lineStart: 365,
    lineEnd: 365,
    quote: "此生恐将以写作终古",
    category: "写作格言",
    origin: "李敖",
    summary: "自述一生将以写作为归宿。",
    notes: "",
  },
  {
    file: "003.旧信劫遗.txt",
    lineStart: 365,
    lineEnd: 365,
    quote: "写作之计划，不可不“全套”也！",
    category: "写作格言",
    origin: "李敖",
    summary: "强调写作计划要有整体布局。",
    notes: "",
  },
  {
    file: "005.九头鸟之恋.txt",
    lineStart: 67,
    lineEnd: 67,
    quote: "奇文共欣赏",
    category: "古诗文引用",
    origin: "陶渊明",
    summary: "以共赏奇文形容可同读互赏的文字。",
    notes: "",
  },
  {
    file: "007.什么叫“理来情无存”？.txt",
    lineStart: 17,
    lineEnd: 17,
    quote: "望之俨然，即之也温",
    category: "古文引用",
    origin: "古语",
    summary: "形容人远看庄重、接近后温和。",
    notes: "",
  },
  {
    file: "007.什么叫“理来情无存”？.txt",
    lineStart: 17,
    lineEnd: 17,
    quote: "望之也温",
    category: "改写格言",
    origin: "李敖",
    summary: "以改写古语表达更直接的温厚感。",
    notes: "",
  },
  {
    file: "007.什么叫“理来情无存”？.txt",
    lineStart: 21,
    lineEnd: 21,
    quote: "理来情无存",
    category: "古诗文引用",
    origin: "沈约诗",
    summary: "理性一到，私情便应退场。",
    notes: "",
  },
  {
    file: "007.什么叫“理来情无存”？.txt",
    lineStart: 21,
    lineEnd: 21,
    quote: "行文公论之时，应当“理来情无存”",
    category: "文论格言",
    origin: "李敖",
    summary: "主张公开写作应以理胜情。",
    notes: "",
  },
  {
    file: "007.什么叫“理来情无存”？.txt",
    lineStart: 23,
    lineEnd: 23,
    quote: "往往因情断送了理，往往因理“得罪了人”（情）。",
    category: "处世格言",
    origin: "李敖",
    summary: "指出情理冲突中理性常被关系牵累。",
    notes: "",
  },
  {
    file: "008.给李声庭的四封信.txt",
    lineStart: 25,
    lineEnd: 25,
    quote: "忽忽已三十",
    category: "诗句引用",
    origin: "梁启超诗",
    summary: "借诗句感叹三十岁倏忽而至。",
    notes: "",
  },
  {
    file: "008.给李声庭的四封信.txt",
    lineStart: 57,
    lineEnd: 57,
    quote: "心照情交，流言靡惑",
    category: "古语引用",
    origin: "古语",
    summary: "心意相照、情谊相交，就不受流言迷惑。",
    notes: "",
  },
  {
    file: "008.给李声庭的四封信.txt",
    lineStart: 59,
    lineEnd: 59,
    quote: "恶人自有恶人磨",
    category: "俗谚",
    origin: "俗语",
    summary: "恶人会遇到能制伏他的人。",
    notes: "",
  },
  {
    file: "009.给殷海光的六封信.txt",
    lineStart: 21,
    lineEnd: 21,
    quote: "同是天涯沦落人",
    category: "古诗引用",
    origin: "白居易《琵琶行》",
    summary: "借白居易诗句写相同遭际中的共感。",
    notes: "",
  },
  {
    file: "009.给殷海光的六封信.txt",
    lineStart: 41,
    lineEnd: 41,
    quote: "昔何英勇今何怯",
    category: "诗句引用",
    origin: "黄遵宪诗",
    summary: "以诗句对照昔日勇气与今日怯弱。",
    notes: "只收诗句，不收所涉现代公共议题。",
  },
  {
    file: "009.给殷海光的六封信.txt",
    lineStart: 45,
    lineEnd: 45,
    quote: "不出户，知天下",
    category: "古籍引用",
    origin: "《老子》",
    summary: "不出门户而知天下之理。",
    notes: "",
  },
  {
    file: "009.给殷海光的六封信.txt",
    lineStart: 47,
    lineEnd: 47,
    quote: "与虎谋皮",
    category: "成语",
    origin: "成语",
    summary: "比喻向有利害冲突者求助，难以成功。",
    notes: "",
  },
  {
    file: "009.给殷海光的六封信.txt",
    lineStart: 85,
    lineEnd: 85,
    quote: "但愿人长久",
    category: "古词引用",
    origin: "苏轼《水调歌头》",
    summary: "以苏轼词句表达长久平安之愿。",
    notes: "",
  },
  {
    file: "009.给殷海光的六封信.txt",
    lineStart: 85,
    lineEnd: 85,
    quote: "留得青山在",
    category: "俗谚",
    origin: "俗语",
    summary: "只要根本尚存，就仍有来日。",
    notes: "",
  },
  {
    file: "009.给殷海光的六封信.txt",
    lineStart: 117,
    lineEnd: 117,
    quote: "难道我们不会被朋友蒙蔽吗？我们的判断和朋友都可靠吗？",
    category: "处世格言",
    origin: "李敖",
    summary: "提醒人也要警惕朋友与自身判断的局限。",
    notes: "",
  },
  {
    file: "009.给殷海光的六封信.txt",
    lineStart: 119,
    lineEnd: 119,
    quote: "不可不保持着一点警觉，警觉自己的心灵别像生活一般的被闭锁。",
    category: "人生格言",
    origin: "李敖",
    summary: "主张在困顿生活中保持心灵警醒。",
    notes: "",
  },
  {
    file: "010.一九六五年五月四日.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "才女薄命",
    category: "成语化短语",
    origin: "李敖",
    summary: "借传统说法慨叹才情与命运。",
    notes: "只取文学化短语。",
  },
  {
    file: "010.一九六五年五月四日.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "曾经沧海",
    category: "古诗引用",
    origin: "元稹诗",
    summary: "借元稹诗意写经历后的情感眼光。",
    notes: "",
  },
  {
    file: "010.一九六五年五月四日.txt",
    lineStart: 13,
    lineEnd: 13,
    quote: "故作小儿女之言",
    category: "文论短语",
    origin: "李敖",
    summary: "批评文字有意作小儿女腔。",
    notes: "",
  },
  {
    file: "011.我们要像清除恶人一样的清除烂好人.txt",
    lineStart: 11,
    lineEnd: 11,
    quote: "善意与力量相结合",
    category: "西方格言",
    origin: "爱因斯坦",
    summary: "主张善意需要与力量结合才有效。",
    notes: "",
  },
  {
    file: "011.我们要像清除恶人一样的清除烂好人.txt",
    lineStart: 11,
    lineEnd: 11,
    quote: "张其恶",
    category: "古语短语",
    origin: "古语",
    summary: "指出助长恶的一面。",
    notes: "",
  },
  {
    file: "011.我们要像清除恶人一样的清除烂好人.txt",
    lineStart: 11,
    lineEnd: 11,
    quote: "扶同为恶",
    category: "古语短语",
    origin: "古语",
    summary: "指附和、帮衬他人作恶。",
    notes: "",
  },
  {
    file: "011.我们要像清除恶人一样的清除烂好人.txt",
    lineStart: 11,
    lineEnd: 11,
    quote: "像清除恶人一样的清除烂好人",
    category: "处世格言",
    origin: "李敖",
    summary: "用激烈说法批评无能好意造成的伤害。",
    notes: "",
  },
  {
    file: "011.我们要像清除恶人一样的清除烂好人.txt",
    lineStart: 15,
    lineEnd: 17,
    quote: "切勿轻书生，\n上马能击贼。",
    category: "诗句引用",
    origin: "古诗句",
    summary: "提醒不可轻视书生的行动能力。",
    notes: "",
  },
  {
    file: "016.论好人做事与不做事.txt",
    lineStart: 13,
    lineEnd: 13,
    quote: "伸头一刀，缩头也挨一刀",
    category: "俗谚",
    origin: "俗语",
    summary: "形容无论进退都难免承受一击。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 15,
    lineEnd: 15,
    quote: "东飞伯劳西飞燕",
    category: "古诗引用",
    origin: "古诗句",
    summary: "以分飞意象写别离。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 37,
    lineEnd: 37,
    quote: "吾意久怀忿，汝岂得自由！",
    category: "古诗文引用",
    origin: "《孔雀东南飞》",
    summary: "引古诗写婆媳婚姻中的压迫语气。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 37,
    lineEnd: 37,
    quote: "久在樊笼里，不能返自然",
    category: "改写诗句",
    origin: "陶渊明诗意",
    summary: "改写陶诗，写久困樊笼后难以回归自然。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 57,
    lineEnd: 57,
    quote: "以前，我很在意别人对我的看法，现在我只关心我自己对我的看法。",
    category: "人生格言",
    origin: "来信引语",
    summary: "从他人评价转向自我评价。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 61,
    lineEnd: 61,
    quote: "参悟人生，本不是一件容易的事，分别人生真的部分和幻的部分，是困难的焦点。",
    category: "人生格言",
    origin: "李敖",
    summary: "把辨别人生真幻视为参悟人生的核心难处。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 61,
    lineEnd: 61,
    quote: "愈早发现真幻的分际，而能弃幻求真的人，将是最智慧的人。",
    category: "人生格言",
    origin: "李敖",
    summary: "认为早日弃幻求真是智慧。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 61,
    lineEnd: 61,
    quote: "朝闻‘道’，夕死可矣！",
    category: "古语引用",
    origin: "《论语》",
    summary: "借孔子语形容闻道后的满足。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 61,
    lineEnd: 61,
    quote: "觉今是而昨非",
    category: "古文引用",
    origin: "陶渊明《归去来兮辞》",
    summary: "发现今日所悟为是、昨日所为为非。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 61,
    lineEnd: 61,
    quote: "还不如糊里糊涂过一辈子吧！垂暮之年，再‘觉今是而昨非’，有时候是很残忍的。",
    category: "人生格言",
    origin: "李敖",
    summary: "写迟来醒悟的残忍。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 63,
    lineEnd: 63,
    quote: "饱更忧患",
    category: "成语化短语",
    origin: "李敖",
    summary: "形容经历忧患甚多。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 63,
    lineEnd: 63,
    quote: "智慧成熟过早",
    category: "人生短语",
    origin: "梁实秋转述",
    summary: "写过早成熟的智慧感。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 63,
    lineEnd: 63,
    quote: "无可无不可",
    category: "古语引用",
    origin: "古语",
    summary: "形容无执著、无定取舍的状态。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 63,
    lineEnd: 63,
    quote: "异乡人",
    category: "文学典故",
    origin: "加缪",
    summary: "用异乡人意象写疏离感。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 65,
    lineEnd: 65,
    quote: "“时光倒流”，对那些记忆力好的人说来，将是一种折磨，但也是一种美丽。",
    category: "人生格言",
    origin: "李敖",
    summary: "写回忆既折磨又美丽的双重性。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 79,
    lineEnd: 79,
    quote: "With you a part of me hath passed away!",
    category: "西方诗句",
    origin: "桑塔亚纳",
    summary: "失去对方也失去自我一部分。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 95,
    lineEnd: 121,
    quote:
      "With you a part of me hath passed away；\nFor in the peopled forest of my mind\nA tree made leafless by this wintry wind\nShall never don again its green array.\nChapel and fireside, country road and bay,\nHave something of their friendliness resigned；\nAnother，if I would，I could not find，\nAnd I am grown much older in a day.\nBut yet I treasure in my memory\nYour gift of charity, and young heart's ease,\nAnd the dear honor of your amity ；\nFor these once mine，my life is rich with these\nAnd I scarce know which part may greater be，\nWhat I keep of you, or you rob from me.",
    category: "西方诗",
    origin: "George Santayana",
    summary: "桑塔亚纳悼亡诗，写友谊逝去后自我生命的一部分失落。",
    notes: "保留李敖信中整段英文原诗。",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 123,
    lineEnd: 147,
    quote:
      "冬风扫叶时节，一树萧条如洗，\n绿装已卸，卸在我心里。\n我生命的一部分，已消亡\n随着你。\n教堂、炉边、郊路和港湾，\n情味都今非昔比。\n虽有余情，也难追寻。\n一日之间，我不知老了几许？\n你天性的善良、慈爱和轻快，\n曾属于我，跟我一起。\n我不知道哪一部分多——\n是你带走的我，\n还是我留下的你。",
    category: "译诗",
    origin: "李敖译桑塔亚纳诗",
    summary: "李敖翻译桑塔亚纳悼亡诗，重在失去与留存的互相缠绕。",
    notes: "",
  },
  {
    file: "020.又是情书.txt",
    lineStart: 151,
    lineEnd: 177,
    quote:
      "我生命的一部已随你而消亡，\n因为在我心里那人物的林中；\n一棵树飘零于冬日的寒风，\n再不能披上它嫩绿的春装。\n教堂、炉边、郊路和港湾，\n都丧失些许往日的温情；\n另一个，就如我愿意，也无法追寻，\n在一日之内我白发加长。\n但是我仍然在记忆里珍藏，\n你仁慈的天性，你轻松的童心，\n和你那可爱的、可敬的亲祥；\n这一些曾属于我，便充实了我的生命。\n我不能分辨哪一份较巨——\n是我保留住你的，还是你带走我的。",
    category: "译诗",
    origin: "余光中译桑塔亚纳诗",
    summary: "余光中译同诗，呈现另一种中文译法。",
    notes: "",
  },
  {
    file: "023.论正视.txt",
    lineStart: 11,
    lineEnd: 11,
    quote: "置四海穷困而不言，终日讲危微精一，我勿敢知也！",
    category: "古文引用",
    origin: "顾炎武",
    summary: "批评脱离人间疾苦而空谈心性的学问。",
    notes: "",
  },
  {
    file: "023.论正视.txt",
    lineStart: 11,
    lineEnd: 11,
    quote: "“正视”人间",
    category: "人生短语",
    origin: "李敖",
    summary: "强调写作和思想要直面人间现实。",
    notes: "",
  },
  {
    file: "023.论正视.txt",
    lineStart: 13,
    lineEnd: 13,
    quote: "重新努力去做一个小世界的写作者",
    category: "文论短语",
    origin: "来信引语",
    summary: "劝写作者回到小世界继续努力。",
    notes: "",
  },
  {
    file: "026.“特别座”和“普通座”.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "杜诗韩笔愁来读，似倩麻姑痒处抓。",
    category: "诗句引用",
    origin: "古诗句",
    summary: "写读杜诗韩文如搔到痒处。",
    notes: "",
  },
  {
    file: "026.“特别座”和“普通座”.txt",
    lineStart: 21,
    lineEnd: 23,
    quote:
      "Yond Cassius has a lean and hungry look；\nHe thinks too much：such men are “not” dangerous.",
    category: "文学改写",
    origin: "莎士比亚《凯撒大帝》改写",
    summary: "改写莎剧名句，反讽瘦削多思者并非危险。",
    notes: "",
  },
  {
    file: "026.“特别座”和“普通座”.txt",
    lineStart: 27,
    lineEnd: 27,
    quote: "文人者，戏子也！",
    category: "文人格言",
    origin: "李敖",
    summary: "以戏子比文人，强调表演性与受众关系。",
    notes: "",
  },
  {
    file: "026.“特别座”和“普通座”.txt",
    lineStart: 49,
    lineEnd: 49,
    quote: "明日黄花蝶也愁",
    category: "诗句引用",
    origin: "古诗句",
    summary: "借明日黄花写过时后的凋零感。",
    notes: "",
  },
  {
    file: "027.文化基金·别人·我们.txt",
    lineStart: 19,
    lineEnd: 19,
    quote: "雪中送炭式",
    category: "譬喻短语",
    origin: "李敖",
    summary: "比喻在艰困时给予实质帮助的做法。",
    notes: "",
  },
  {
    file: "027.文化基金·别人·我们.txt",
    lineStart: 21,
    lineEnd: 21,
    quote: "锦上添花式",
    category: "譬喻短语",
    origin: "李敖",
    summary: "比喻在已有光彩之上再加光彩。",
    notes: "",
  },
  {
    file: "027.文化基金·别人·我们.txt",
    lineStart: 27,
    lineEnd: 27,
    quote: "逾淮之枳",
    category: "成语典故",
    origin: "成语",
    summary: "比喻事物移地之后性质发生变化。",
    notes: "",
  },
  {
    file: "027.文化基金·别人·我们.txt",
    lineStart: 29,
    lineEnd: 29,
    quote: "私人的财力不该用来对学术界“普渡众生”",
    category: "治学格言",
    origin: "李敖",
    summary: "认为有限资源不宜泛泛施与，应有所选择。",
    notes: "",
  },
  {
    file: "027.文化基金·别人·我们.txt",
    lineStart: 29,
    lineEnd: 29,
    quote: "脱颖而出的出类拔萃人物",
    category: "成语化短语",
    origin: "李敖",
    summary: "指真正显露锋芒的杰出人物。",
    notes: "",
  },
  {
    file: "027.文化基金·别人·我们.txt",
    lineStart: 33,
    lineEnd: 33,
    quote: "精重于多、质重于量",
    category: "治学格言",
    origin: "李敖",
    summary: "强调精与质胜过数量。",
    notes: "",
  },
  {
    file: "027.文化基金·别人·我们.txt",
    lineStart: 35,
    lineEnd: 35,
    quote: "唯精是尚",
    category: "治学格言",
    origin: "李敖",
    summary: "以精为最高取向。",
    notes: "",
  },
  {
    file: "027.文化基金·别人·我们.txt",
    lineStart: 37,
    lineEnd: 37,
    quote: "真正成功的文化基金会，绝不是止于“奖金”或“讲座”就算了事，它一定要朝“更吃力的”方向发展。",
    category: "文化格言",
    origin: "李敖",
    summary: "主张文化资助应走向更费力也更深层的工作。",
    notes: "",
  },
  {
    file: "028.《烟锁重楼》之外.txt",
    lineStart: 15,
    lineEnd: 15,
    quote: "对邪恶势力的“报复”，是一个“真的人”的必要条件。",
    category: "人生格言",
    origin: "李敖",
    summary: "把对邪恶的反击视为真人格的一部分。",
    notes: "属文学人格评论，未收现代公共语境。",
  },
  {
    file: "028.《烟锁重楼》之外.txt",
    lineStart: 19,
    lineEnd: 19,
    quote: "书中有很多好句子，但也有坏句子；好句子是你造的，坏句子却是你不自觉或“偷懒”顺手用的成语",
    category: "文论格言",
    origin: "李敖",
    summary: "提醒写作者警惕顺手套用的成语损害文字。",
    notes: "",
  },
  {
    file: "028.《烟锁重楼》之外.txt",
    lineStart: 87,
    lineEnd: 87,
    quote: "人是蜡烛做的，倒宁愿尝这种痛痒兼备的友情哩！",
    category: "友情格言",
    origin: "李敖",
    summary: "以蜡烛喻人，写友情中的痛痒与温度。",
    notes: "",
  },
  {
    file: "029.致王兆民先生.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "本为卖文活，翻令石倒悬",
    category: "诗句引用",
    origin: "杜甫诗意",
    summary: "以诗句慨叹卖文为生反陷困境。",
    notes: "",
  },
  {
    file: "029.致王兆民先生.txt",
    lineStart: 37,
    lineEnd: 43,
    quote: "知世如梦无所求，\n无所求心普空寂。\n还似梦中随梦境，\n成就河沙梦功德！",
    category: "古诗引用",
    origin: "王安石诗",
    summary: "以梦与功德写无所求中的随缘成就。",
    notes: "",
  },
  {
    file: "029.致王兆民先生.txt",
    lineStart: 49,
    lineEnd: 51,
    quote: "公自平生怀直气，\n谁能晚节负初心？",
    category: "古诗引用",
    origin: "王阳明诗",
    summary: "以直气和初心相勉。",
    notes: "",
  },
  {
    file: "030.文学院黑暗的又一例.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "人生如美酒，易醒复易醉。微醉亦难醒，醒来都是泪。",
    category: "诗",
    origin: "小诗",
    summary: "以美酒喻人生的沉醉与清醒之泪。",
    notes: "",
  },
  {
    file: "032.论婚变答汪中磊.txt",
    lineStart: 5,
    lineEnd: 5,
    quote: "有朋〔有信〕自远方来，不亦说乎！",
    category: "改写古语",
    origin: "《论语》改写",
    summary: "把《论语》名句改作收到远方来信的喜悦。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 7,
    lineEnd: 7,
    quote: "时代确定了，就首先避免时间上的误窜。时间误窜，就会出笑话。",
    category: "创作格言",
    origin: "李敖",
    summary: "谈历史题材创作首先要守住时代时间。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 11,
    lineEnd: 11,
    quote: "时间一确定，其次就是按时间校正史实，不要发生史实前后不符的矛盾。",
    category: "创作格言",
    origin: "李敖",
    summary: "历史题材创作须按时间校正事实顺序。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 19,
    lineEnd: 19,
    quote: "风俗也是一个重要的过门，不可把后代的风俗错移前代。",
    category: "创作格言",
    origin: "李敖",
    summary: "提醒历史作品不可错置时代风俗。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 31,
    lineEnd: 31,
    quote: "除避免以后代风俗掺入前代外，还须避免以西方风俗掺入古代。",
    category: "创作格言",
    origin: "李敖",
    summary: "指出历史创作也要避免文化风俗错置。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 35,
    lineEnd: 35,
    quote: "以两性关系为主要题目的时候，须以婚姻史为根据，避免以特例当全体、以想象当事实。",
    category: "创作格言",
    origin: "李敖",
    summary: "主张写两性题材也应有历史根据。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 55,
    lineEnd: 55,
    quote: "一把剑的好坏，并不在它有没有名、锋不锋利，而是在什么人用它，怎么用它。",
    category: "文学台词",
    origin: "电影《剑》台词",
    summary: "剑的价值取决于使用者与用法。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 57,
    lineEnd: 57,
    quote: "它是天下间最好的！因为这二十年来，始终没有被用过！",
    category: "文学台词",
    origin: "电影《剑》台词",
    summary: "以未被使用反衬剑的完整与珍贵。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 59,
    lineEnd: 59,
    quote: "此其小试于敌邦，未见其大用于天下也！",
    category: "古籍引用",
    origin: "《越绝书》",
    summary: "说宝剑只是小试锋芒，尚未大用。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 59,
    lineEnd: 59,
    quote: "夫剑铁耳，固能有精神若此乎？",
    category: "古籍引用",
    origin: "《越绝书》",
    summary: "借古籍发问：剑只是铁，何以有如此精神。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 61,
    lineEnd: 61,
    quote: "夫有干（一作千）越之剑者，柙而藏之，不敢用也！",
    category: "古籍引用",
    origin: "《庄子》",
    summary: "以匣藏宝剑、不轻用来写最高的剑道。",
    notes: "",
  },
  {
    file: "033.中国电影，看剑！.txt",
    lineStart: 61,
    lineEnd: 61,
    quote: "真正的“剑道”，就在它“柙而藏之，不敢用”。",
    category: "文学格言",
    origin: "李敖",
    summary: "把最高剑道解释为有所藏而不妄用。",
    notes: "",
  },
  {
    file: "034.旧信一集.txt",
    lineStart: 85,
    lineEnd: 85,
    quote: "盗亦有道",
    category: "古语引用",
    origin: "《庄子》",
    summary: "即使盗者也有其道。",
    notes: "",
  },
  {
    file: "038.讽韦政通.txt",
    lineStart: 35,
    lineEnd: 35,
    quote: "我可以永不停顿地工作，没有朋友，也毫无寂寞之感。",
    category: "人生格言",
    origin: "李敖",
    summary: "写独立工作的强度与孤独免疫。",
    notes: "",
  },
  {
    file: "038.讽韦政通.txt",
    lineStart: 35,
    lineEnd: 35,
    quote: "处任何环境而不动心",
    category: "修身格言",
    origin: "李敖",
    summary: "强调在任何环境中保持心不动摇。",
    notes: "",
  },
  {
    file: "038.讽韦政通.txt",
    lineStart: 35,
    lineEnd: 35,
    quote: "在历史上，搞思想工作，很少不造孽的，不禁时时以此为戒。",
    category: "思想格言",
    origin: "李敖",
    summary: "警惕思想工作可能造成伤害。",
    notes: "",
  },
  {
    file: "038.讽韦政通.txt",
    lineStart: 35,
    lineEnd: 35,
    quote: "做学问如玩高尔夫球，要玩就要玩得精",
    category: "治学格言",
    origin: "李敖",
    summary: "治学要精，不可浅尝辄止。",
    notes: "",
  },
  {
    file: "038.讽韦政通.txt",
    lineStart: 37,
    lineEnd: 37,
    quote: "见面只能“谈话”，而无从“谈心”。",
    category: "友情格言",
    origin: "李敖",
    summary: "区分表层谈话与深层谈心。",
    notes: "",
  },
  {
    file: "038.讽韦政通.txt",
    lineStart: 39,
    lineEnd: 39,
    quote: "名利之心不必除，但亦不可为其所累，沉湎其中，人就很可怜。",
    category: "人生格言",
    origin: "李敖",
    summary: "名利心可以存在，但不可沉湎受累。",
    notes: "",
  },
  {
    file: "038.讽韦政通.txt",
    lineStart: 39,
    lineEnd: 39,
    quote: "名利双收，可谓人生一福，但非人生顶重要之事。",
    category: "人生格言",
    origin: "李敖",
    summary: "把名利视为人生福分之一而非最高目的。",
    notes: "",
  },
  {
    file: "038.讽韦政通.txt",
    lineStart: 39,
    lineEnd: 39,
    quote: "唯创造性的表现，才是真快乐真满足。",
    category: "人生格言",
    origin: "李敖",
    summary: "认为创造性表达才是真正快乐与满足。",
    notes: "",
  },
  {
    file: "041.致梁容若.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "奇士不可骂，骂之伤天神",
    category: "诗句引用",
    origin: "古诗句",
    summary: "劝人不可辱骂奇士。",
    notes: "",
  },
  {
    file: "041.致梁容若.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "上帝要毁灭谁，必先使他发疯",
    category: "西方格言",
    origin: "西方谚语",
    summary: "说毁灭之前常先有疯狂。",
    notes: "",
  },
  {
    file: "041.致梁容若.txt",
    lineStart: 13,
    lineEnd: 13,
    quote: "恶紫，以其乱朱也！",
    category: "古籍引用",
    origin: "《论语》",
    summary: "厌恶紫色，是因它扰乱正色朱红。",
    notes: "只收古籍句本身。",
  },
  {
    file: "042.回CY的信.txt",
    lineStart: 5,
    lineEnd: 5,
    quote: "一说就俗",
    category: "禅语",
    origin: "禅语",
    summary: "有些体会一经说出便落俗。",
    notes: "",
  },
  {
    file: "042.回CY的信.txt",
    lineStart: 17,
    lineEnd: 17,
    quote: "此时还恨薄情无？",
    category: "诗句引用",
    origin: "古诗句",
    summary: "以反问写情感是否仍怨薄情。",
    notes: "",
  },
  {
    file: "043.回LHH和CP的信.txt",
    lineStart: 5,
    lineEnd: 5,
    quote: "诺亚的方舟",
    category: "西方典故",
    origin: "《圣经》典故",
    summary: "用方舟比喻保存与避难之所。",
    notes: "",
  },
  {
    file: "043.回LHH和CP的信.txt",
    lineStart: 5,
    lineEnd: 5,
    quote: "在有债可借之日，不拟出版新书。不过债缘已越来越少，所以出新书的机会也就越来越多",
    category: "写作幽默",
    origin: "李敖",
    summary: "以债缘和出书机会的反比写幽默。",
    notes: "",
  },
  {
    file: "043.回LHH和CP的信.txt",
    lineStart: 5,
    lineEnd: 5,
    quote: "立此不存照",
    category: "幽默短语",
    origin: "李敖",
    summary: "反用立此存照成语，带自嘲意味。",
    notes: "",
  },
  {
    file: "043.回LHH和CP的信.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "躐等的时代",
    category: "时代短语",
    origin: "李敖",
    summary: "形容不按次序、跨越阶段的时代感。",
    notes: "",
  },
  {
    file: "044.回WJJ的信.txt",
    lineStart: 7,
    lineEnd: 7,
    quote: "她们不知道什么是“天才”，什么是“疯癫”。",
    category: "人生短语",
    origin: "李敖",
    summary: "把天才与疯癫并置，写外界难以分辨。",
    notes: "",
  },
  {
    file: "044.回WJJ的信.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "情圣",
    category: "爱情短语",
    origin: "李敖",
    summary: "自我戏称式的爱情身份。",
    notes: "",
  },
  {
    file: "044.回WJJ的信.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "情棍",
    category: "爱情短语",
    origin: "李敖",
    summary: "与情圣相对的自嘲式称谓。",
    notes: "",
  },
  {
    file: "044.回WJJ的信.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "而是一个在爱情上极洒脱的寻乐主义者。",
    category: "爱情格言",
    origin: "李敖",
    summary: "把爱情观概括为洒脱的寻乐主义。",
    notes: "",
  },
  {
    file: "044.回WJJ的信.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "在爱情上，除了快乐以外，实在没有别的，也不该有别的。",
    category: "爱情格言",
    origin: "李敖",
    summary: "强调爱情应以快乐为核心。",
    notes: "",
  },
  {
    file: "044.回WJJ的信.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "痛苦是心胸狭小的表示，是一个被自虐狂者夸张了的经验",
    category: "爱情格言",
    origin: "李敖",
    summary: "把爱情痛苦视为被夸张的狭窄经验。",
    notes: "",
  },
  {
    file: "044.回WJJ的信.txt",
    lineStart: 9,
    lineEnd: 9,
    quote: "真狗屁呀！真狗屁！",
    category: "爱情短语",
    origin: "李敖",
    summary: "以粗厉口吻否定沉溺痛苦的爱情姿态。",
    notes: "",
  },
].map((entry, index) => ({
  id: `LASHHJ-${String(index + 1).padStart(4, "0")}`,
  book: bookName,
  chapter: entry.file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
  source_file: entry.file,
  line_start: entry.lineStart,
  line_end: entry.lineEnd,
  quote_text: compact(entry.quote),
  category: entry.category,
  source_or_origin: entry.origin,
  summary: entry.summary,
  notes: entry.notes,
}));

const proofreadRemoved = [
  { id: "LASHHJ-0003", reason: "仅为“死文字”短标签，已由后一条完整文字观表达承载。" },
  { id: "LASHHJ-0019", reason: "诗句被用于现代公共人物与刊物语境的评价，校对轮按政治相关语境删除。" },
  { id: "LASHHJ-0047", reason: "仅为书名式文学 allusion，独立诗文格言价值不足。" },
  { id: "LASHHJ-0049", reason: "与后续桑塔亚纳整首英文诗首句重复，保留完整诗作即可。" },
  { id: "LASHHJ-0054", reason: "仅为短碎论点标签，且原文处在社会批评语境，独立格言价值不足。" },
  { id: "LASHHJ-0060", reason: "只是基金资助类型标签，非独立诗文格言。" },
  { id: "LASHHJ-0061", reason: "只是基金资助类型标签，非独立诗文格言。" },
  { id: "LASHHJ-0063", reason: "文化基金与学术资源分配论断，偏公共制度建议，校对轮删除。" },
  { id: "LASHHJ-0064", reason: "成语堆叠式短语，独立检索价值不足。" },
  { id: "LASHHJ-0067", reason: "文化基金运作建议，偏公共制度判断，不纳入诗文格言表。" },
  { id: "LASHHJ-0090", reason: "关于“思想工作”的历史判断，公共思想语录色彩较重，校对轮删除。" },
  { id: "LASHHJ-0098", reason: "《论语》句被直接用于党派人物攻击语境，按政治语录相关删除。" },
  { id: "LASHHJ-0104", reason: "短碎时代标签，独立诗文格言价值不足。" },
  { id: "LASHHJ-0106", reason: "仅为爱情称谓标签，非独立格言。" },
  { id: "LASHHJ-0107", reason: "仅为爱情称谓标签，非独立格言。" },
  { id: "LASHHJ-0111", reason: "粗口式短句，独立诗文格言价值不足。" },
];

function getProofreadRemovedRows(rows) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  return proofreadRemoved.map((item) => {
    const row = byId.get(item.id);
    if (!row) throw new Error(`Missing proofread removal id: ${item.id}`);
    return {
      ...item,
      source_file: row.source_file,
      line_range: `${row.line_start}-${row.line_end}`,
      quote_text: row.quote_text,
      category: row.category,
      source_or_origin: row.source_or_origin,
    };
  });
}

function makeCandidates(sourceFiles) {
  const candidates = [];
  const attributed = [];

  for (const file of sourceFiles) {
    const lines = file.text.replace(/\r/g, "").split("\n");
    lines.forEach((line, i) => {
      const lineNo = i + 1;
      const trimmed = line.trim();
      if (!trimmed) return;

      const hasQuoteSignal = quotePattern.test(trimmed);
      const hasAttribution =
        /(曰|云|说|诗|词|谚|古话|俚语|格言|motto|Bible|Shakespeare|Santayana|Homer|陶渊明|苏轼|白居易|王安石|王阳明|梁启超|顾亭林|庄子|老子|论语|圣经|莎士比亚|爱因斯坦|余光中|杜甫|元稹|加缪)/i.test(
          trimmed
        );
      if (hasQuoteSignal || hasAttribution) {
        const item = {
          file: file.name,
          line: lineNo,
          text: trimmed,
          risk: politicalPattern.test(trimmed),
          quoteSignal: hasQuoteSignal,
          attributionSignal: hasAttribution,
        };
        candidates.push(item);
        if (hasAttribution) attributed.push(item);
      }
    });
  }

  return { candidates, attributed };
}

function writeCsv(rows) {
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
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ];
  fs.writeFileSync(outputCsv, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(rows) {
  const lines = [];
  lines.push(`${bookName} 诗文格言歌谣引用`);
  lines.push(`生成日期：${generatedDate}`);
  lines.push(`条目数：${rows.length}`);
  lines.push("");

  for (const row of rows) {
    lines.push(`${row.id}｜${row.chapter}｜${row.category}`);
    lines.push(row.quote_text);
    lines.push(`出处/来源：${row.source_or_origin}`);
    lines.push(`位置：${row.source_file}:${row.line_start}-${row.line_end}`);
    lines.push(`说明：${row.summary}`);
    if (row.notes) lines.push(`备注：${row.notes}`);
    lines.push("");
  }

  fs.writeFileSync(outputTxt, `${lines.join("\n")}\n`, "utf8");
}

function writeReviewFiles(candidates, attributed) {
  fs.writeFileSync(candidatesPath, `${JSON.stringify(candidates, null, 2)}\n`, "utf8");
  const headers = ["risk", "quoteSignal", "attributionSignal", "file", "line", "text"];
  const toTsv = (items) =>
    [
      headers.join("\t"),
      ...items.map((item) =>
        headers
          .map((header) => String(item[header] ?? "").replace(/\r?\n/g, " ").replace(/\t/g, " "))
          .join("\t")
      ),
    ].join("\n") + "\n";
  fs.writeFileSync(reviewPath, toTsv(candidates), "utf8");
  fs.writeFileSync(attributedPath, toTsv(attributed), "utf8");
}

function validateEntries(rows, sourceFiles) {
  const fileMap = new Map(sourceFiles.map((file) => [file.name, file]));
  const errors = [];
  const seenIds = new Set();

  for (const row of rows) {
    if (seenIds.has(row.id)) {
      errors.push(`Duplicate id: ${row.id}`);
    }
    seenIds.add(row.id);

    const fileName = row.source_file.split("/").pop();
    const file = fileMap.get(fileName);
    if (!file) {
      errors.push(`${row.id}: missing source file ${fileName}`);
      continue;
    }
    const sourceLines = file.text.replace(/\r/g, "").split("\n");
    const slice = sourceLines.slice(row.line_start - 1, row.line_end).join("\n");
    if (!normalizeForMatch(slice).includes(normalizeForMatch(row.quote_text))) {
      errors.push(`${row.id}: quote not found at ${fileName}:${row.line_start}-${row.line_end}`);
    }
  }

  return errors;
}

function writeAudit(rows, candidates, sourceFiles, errors, removedRows = []) {
  const candidateKey = new Set(candidates.map((item) => `${item.file}:${item.line}`));
  const coveredKey = new Set();
  for (const row of rows) {
    const fileName = row.source_file.split("/").pop();
    for (let line = row.line_start; line <= row.line_end; line += 1) {
      coveredKey.add(`${fileName}:${line}`);
    }
  }

  const fileStats = new Map(sourceFiles.map((file) => [file.name, { rows: 0, candidates: 0, riskCandidates: 0 }]));
  rows.forEach((row) => {
    const fileName = row.source_file.split("/").pop();
    const stat = fileStats.get(fileName);
    if (stat) stat.rows += 1;
  });
  candidates.forEach((item) => {
    const stat = fileStats.get(item.file);
    if (stat) {
      stat.candidates += 1;
      if (item.risk) stat.riskCandidates += 1;
    }
  });

  const auditRows = [
    ["file", "rows", "candidate_lines", "risk_candidate_lines"].join("\t"),
    ...[...fileStats.entries()].map(([file, stat]) =>
      [file, stat.rows, stat.candidates, stat.riskCandidates].join("\t")
    ),
    "",
    ["validation_errors", errors.length].join("\t"),
    ...errors.map((error) => ["error", error].join("\t")),
    "",
    ["uncovered_candidate_lines", [...candidateKey].filter((key) => !coveredKey.has(key)).length].join("\t"),
  ];

  if (removedRows.length) {
    auditRows.push(
      "",
      ["proofread_removed", removedRows.length].join("\t"),
      ["id", "source_file", "line_range", "category", "quote_text", "reason"].join("\t"),
      ...removedRows.map((row) =>
        [row.id, row.source_file, row.line_range, row.category, row.quote_text, row.reason]
          .map((value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, "\\n"))
          .join("\t")
      )
    );
  }

  fs.writeFileSync(auditPath, `${auditRows.join("\n")}\n`, "utf8");
  fs.writeFileSync(proofreadAuditPath, `${auditRows.join("\n")}\n`, "utf8");
}

function writeReport(rows, candidates, attributed, sourceFiles, errors, removedRows = [], firstRoundCount = rows.length) {
  const excludedHighlights = [
    "出版法、禁书、办杂志、学运、演说等现代公共议题语句均未收。",
    "软禁通信、公函、诉讼、党派人物往还等章节只保留极少数脱离公共语境的文学格言。",
    "涉及现代人物褒贬、制度批判、法律案件的警句，即使有修辞性，也留待剔除而不入首轮表。",
  ];
  const categoryCounts = rows.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + 1;
    return acc;
  }, {});
  const riskRows = rows.filter((row) =>
    [row.quote_text, row.category, row.source_or_origin, row.summary, row.notes].some((value) =>
      politicalPattern.test(String(value ?? ""))
    )
  );

  const lines = [];
  lines.push(`${bookName} 首轮抽取报告`);
  lines.push(`生成日期：${generatedDate}`);
  lines.push("");
  lines.push("范围");
  lines.push(`- 来源目录：${sourceBase}`);
  lines.push(`- 源文件数：${sourceFiles.length}`);
  lines.push(`- 候选行：${candidates.length}`);
  lines.push(`- 带出处/作者信号候选：${attributed.length}`);
  lines.push(`- 首轮入表：${firstRoundCount}`);
  lines.push(`- 校对后入表：${rows.length}`);
  lines.push(`- 校对删除：${removedRows.length}`);
  lines.push("");
  lines.push("取舍口径");
  lines.push("- 保留：古诗文、成语俗谚、英文诗句、译诗、文论/人生/爱情类格言。");
  lines.push("- 剔除：现代公共议题、法律诉讼、党派人物、制度批判、软禁通信中的时事语录。");
  lines.push("- 对书信中的长段抒情，只截取可独立检索的诗句、格言或完整译诗。");
  lines.push("");
  lines.push("分类统计");
  for (const [category, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))) {
    lines.push(`- ${category}: ${count}`);
  }
  lines.push("");
  lines.push("重点剔除说明");
  excludedHighlights.forEach((item) => lines.push(`- ${item}`));
  lines.push("");
  lines.push("校对删除");
  if (removedRows.length) {
    removedRows.forEach((row) => {
      lines.push(`- ${row.id}｜${row.source_file}:${row.line_range}｜${row.quote_text}｜${row.reason}`);
    });
  } else {
    lines.push("- 无");
  }
  lines.push("");
  lines.push("风险词复扫");
  lines.push(`- 命中条目：${riskRows.length}`);
  if (riskRows.length) {
    riskRows.forEach((row) => lines.push(`  - ${row.id}: ${row.quote_text}`));
  }
  lines.push("");
  lines.push("校验");
  lines.push(`- 源文定位错误：${errors.length}`);
  errors.forEach((error) => lines.push(`  - ${error}`));
  lines.push("");
  lines.push("输出");
  lines.push(`- CSV：exports/${bookName}_诗文格言歌谣引用.csv`);
  lines.push(`- TXT：exports/${bookName}_诗文格言歌谣引用.txt`);
  lines.push(`- 审计：analysis/liao_shuhanji_initial_audit.tsv`);
  lines.push(`- 校对报告：analysis/liao_shuhanji_proofread_report.txt`);
  lines.push(`- 校对审计：analysis/liao_shuhanji_proofread_audit.tsv`);
  lines.push(`- 候选：analysis/liao_shuhanji_quote_candidates.json`);

  fs.writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");
  fs.writeFileSync(proofreadReportPath, `${lines.join("\n")}\n`, "utf8");
}

function main() {
  ensureDir(exportsDir);
  ensureDir(analysisDir);

  const sourceFiles = getSourceFiles();
  const { candidates, attributed } = makeCandidates(sourceFiles);
  const removedRows = getProofreadRemovedRows(entries);
  const removedIds = new Set(removedRows.map((row) => row.id));
  const outputEntries = entries.filter((entry) => !removedIds.has(entry.id));
  const errors = validateEntries(outputEntries, sourceFiles);

  writeCsv(outputEntries);
  writeTxt(outputEntries);
  writeReviewFiles(candidates, attributed);
  writeAudit(outputEntries, candidates, sourceFiles, errors, removedRows);
  writeReport(outputEntries, candidates, attributed, sourceFiles, errors, removedRows, entries.length);

  console.log(
    JSON.stringify(
      {
        book: bookName,
        firstRoundRows: entries.length,
        rows: outputEntries.length,
        proofreadRemoved: removedRows.length,
        sourceFiles: sourceFiles.length,
        candidates: candidates.length,
        attributed: attributed.length,
        validationErrors: errors.length,
        outputCsv: path.relative(root, outputCsv),
        outputTxt: path.relative(root, outputTxt),
        report: path.relative(root, reportPath),
        proofreadReport: path.relative(root, proofreadReportPath),
      },
      null,
      2
    )
  );

  if (errors.length) {
    process.exitCode = 1;
  }
}

main();
