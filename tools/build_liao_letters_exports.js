const fs = require("fs");
const path = require("path");

const book = "李敖书信集";
const idPrefix = "LALTRS";
const generatedDate = "2026-06-21";
const outDir = path.join(process.cwd(), "exports");
const analysisDir = path.join(process.cwd(), "analysis");
const sourceDir = path.join(
  "《大李敖全集6.0》分章节",
  "008.书信函件类",
  "002.李敖书信集",
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

const data = [
  row(
    "《李敖书信集》自序.txt",
    5,
    5,
    "吾心所是，却老而弥笃",
    "李敖自述格言",
    "李敖自序",
    "以老而弥笃概括心志不改。",
  ),
  row(
    "《李敖书信集》自序.txt",
    5,
    5,
    "异端性格与独立气概",
    "李敖自述短语",
    "李敖自序",
    "概括自我性格。",
  ),
  row(
    "《李敖书信集》自序.txt",
    7,
    7,
    "不诚之事，不可为之。",
    "古人格言",
    "司马光",
    "以诚为行事底线。",
  ),
  row(
    "《李敖书信集》自序.txt",
    7,
    7,
    "可以告人以诚",
    "李敖书信格言",
    "李敖自序",
    "以坦然存诚概括书信。",
  ),
  row(
    "003.才吏自扰.txt",
    11,
    13,
    "本来无事只畏扰，\n扰者才吏非庸人！",
    "古诗句",
    "陆游",
    "以才吏自扰写善意扰人。",
  ),
  row(
    "003.才吏自扰.txt",
    15,
    15,
    "恃清官而胆气粗",
    "引语短句",
    "李敖转述",
    "写自恃清白而过度用力的毛病。",
  ),
  row(
    "003.才吏自扰.txt",
    15,
    15,
    "道德的过失",
    "西方格言短语",
    "富兰克林",
    "提示私德骄傲也可能成为过失。",
  ),
  row(
    "003.才吏自扰.txt",
    15,
    15,
    "庸人自扰",
    "成语",
    "传统成语",
    "和才吏自扰对举。",
  ),
  row(
    "003.才吏自扰.txt",
    15,
    15,
    "才吏自扰",
    "李敖化用短语",
    "李敖化用陆游诗意",
    "指出能吏也会扰人。",
  ),
  row(
    "003.才吏自扰.txt",
    15,
    15,
    "真正俯仰无愧的人，才会为他们的善良和守“正”不阿（他们以为的“正”），而制造出悲剧！",
    "李敖警句",
    "李敖书信",
    "提醒善意和自信也可能造成悲剧。",
  ),
  row(
    "005.一个作家的反叛.txt",
    5,
    5,
    "不为酒饮，乃为醉饮",
    "古人格言",
    "古人之言",
    "写饮酒重在醉意。",
  ),
  row(
    "005.一个作家的反叛.txt",
    33,
    33,
    "受过良好思想方法训练的人，该先学会想得清楚、写得简单。",
    "李敖写作格言",
    "李敖书信",
    "强调思考清楚、表达简单。",
  ),
  row(
    "005.一个作家的反叛.txt",
    33,
    33,
    "过度地想和写，会使一个人糊涂而入迷津。",
    "李敖写作格言",
    "李敖书信",
    "提醒过度自我沉溺会伤害表达。",
  ),
  row(
    "007.论识货.txt",
    17,
    17,
    "这腔热血只要卖与识货的！",
    "小说名句",
    "《水浒传》阮小五、阮小七",
    "写知己识货时的热血相托。",
  ),
  row(
    "007.论识货.txt",
    17,
    17,
    "人家利用我，是看得起我。",
    "人物俗语",
    "杜月笙",
    "以自嘲姿态看待被利用。",
  ),
  row(
    "007.论识货.txt",
    29,
    29,
    "人生一世，草生一秋！",
    "小说俗语",
    "《水浒传》",
    "以草木一秋感叹人生短暂。",
  ),
  row(
    "007.论识货.txt",
    29,
    29,
    "水里水里去！火里火里去！",
    "小说豪语",
    "《水浒传》",
    "写为识己者赴汤蹈火。",
  ),
  row(
    "007.论识货.txt",
    29,
    29,
    "若能够见用得一日，便死了开眉展眼！",
    "小说豪语",
    "《水浒传》",
    "写一日见用也无憾。",
  ),
  row(
    "007.论识货.txt",
    31,
    31,
    "我弟兄三个真真实实地并没半点儿假！",
    "小说人物语",
    "《水浒传》",
    "写赤诚无伪。",
  ),
  row(
    "012.我为什么“战斗性隐居”？.txt",
    7,
    7,
    "战斗性隐居",
    "李敖自述短语",
    "李敖书信",
    "概括退居写作而保持进取。",
  ),
  row(
    "012.我为什么“战斗性隐居”？.txt",
    11,
    11,
    "诸葛亮写《出师表》，我们只看到他明谏之切，却没看到他隐痛之深。",
    "李敖读史短语",
    "李敖书信",
    "从《出师表》读出隐痛。",
  ),
  row(
    "012.我为什么“战斗性隐居”？.txt",
    13,
    13,
    "宁静致远",
    "古典成语",
    "诸葛亮语",
    "写孤独宁静的志趣。",
  ),
  row(
    "012.我为什么“战斗性隐居”？.txt",
    13,
    13,
    "一心想把自己的生命支付在最该我做的事情上。",
    "李敖自述格言",
    "李敖书信",
    "强调把余生投入要事。",
  ),
  row(
    "012.我为什么“战斗性隐居”？.txt",
    17,
    17,
    "只有这样“不近人情”，我才能好好把握住余生，做对自己最能尽其才、做对世人最有益的事。",
    "李敖人生格言",
    "李敖书信",
    "以自律换取余生的才用。",
  ),
  row(
    "017.兔唇与真理.txt",
    5,
    5,
    "一年不易又中秋",
    "李敖化用诗句",
    "李敖化用俗句",
    "把中秋易逝改写为艰难度日。",
  ),
  row(
    "017.兔唇与真理.txt",
    5,
    5,
    "受难的人有受难的人的活法",
    "李敖人生格言",
    "李敖书信",
    "写艰难处境中的活法。",
  ),
  row(
    "017.兔唇与真理.txt",
    5,
    5,
    "苦其心志",
    "古文成句",
    "《孟子》",
    "以磨练心志解释艰苦。",
  ),
  row(
    "017.兔唇与真理.txt",
    5,
    5,
    "人生的艰苦对他说来，绝对得可偿失、绝对值回票价。",
    "李敖人生格言",
    "李敖书信",
    "把艰苦视为值得的经验。",
  ),
  row(
    "017.兔唇与真理.txt",
    7,
    7,
    "我月亮是死而复生的，我同样的，也叫人类死而复生。",
    "民间神话语",
    "Hottentot传说",
    "月亮托兔传话中的复生之语。",
  ),
  row(
    "017.兔唇与真理.txt",
    7,
    7,
    "我月亮是死而不复生的，我同样的，也教人类死而不复生。",
    "民间神话语",
    "Hottentot传说",
    "兔子误传后的死亡之语。",
  ),
  row(
    "017.兔唇与真理.txt",
    9,
    9,
    "兔儿爷纵使错误，也该是对的。",
    "李敖人生格言",
    "李敖书信",
    "以传错真理的故事写错误与正确。",
  ),
  row(
    "017.兔唇与真理.txt",
    9,
    9,
    "小市民的人生是缺少真理的，男子汉的人生却为真理献身，即使嘴唇给打破，也在所不惜",
    "李敖人生格言",
    "李敖书信",
    "写为真理承受代价。",
  ),
  row(
    "018.自大者言.txt",
    5,
    5,
    "from the horse's mouth",
    "英语习语",
    "英语习语",
    "指从当事人口中取得消息。",
  ),
  row(
    "018.自大者言.txt",
    5,
    5,
    "to look a gift horse in the mouth",
    "英语习语",
    "英语习语",
    "指挑剔赠礼。",
  ),
  row(
    "018.自大者言.txt",
    5,
    5,
    "to mount the high horse",
    "英语习语",
    "英语习语",
    "指摆出傲慢姿态。",
  ),
  row(
    "018.自大者言.txt",
    7,
    7,
    "我从无“满脸骄气”，却总有“一身傲骨”。",
    "李敖自述格言",
    "李敖书信",
    "区分骄气与傲骨。",
  ),
  row(
    "018.自大者言.txt",
    7,
    7,
    "拒人千里之外，而不拒人于‘千秋’之外",
    "李敖自述短语",
    "李敖书信",
    "以幽默写隐居与发声。",
  ),
  row(
    "018.自大者言.txt",
    9,
    9,
    "自大如果变为一种施教或武器，自大是可贵的。",
    "李敖人格格言",
    "李敖书信",
    "把自大解释为方法。",
  ),
  row(
    "018.自大者言.txt",
    9,
    9,
    "不畏浮云遮望眼，自缘身在最高层",
    "古诗句",
    "王安石",
    "以高处视野写自许气魄。",
  ),
  row(
    "018.自大者言.txt",
    9,
    9,
    "诚于中，形于外",
    "古文成句",
    "传统成句",
    "写内在诚意自然外现。",
  ),
  row(
    "020.乱世中的一个感想.txt",
    11,
    11,
    "爱惜生命之道、充分发挥打击力之道、乱世中不失掉自我之道",
    "李敖人生格言",
    "李敖书信",
    "写保存自我和力量的方法。",
  ),
  row(
    "020.乱世中的一个感想.txt",
    11,
    11,
    "“看破红尘”仍要独力救世之道",
    "李敖人生格言",
    "李敖书信",
    "写看破而仍要有作为。",
  ),
  row(
    "020.乱世中的一个感想.txt",
    15,
    15,
    "我的自卫意识远落在求真精神之后。",
    "人生格言",
    "殷海光书信",
    "以求真压过自卫。",
  ),
  row(
    "020.乱世中的一个感想.txt",
    15,
    15,
    "一个理想主义者常常不免要为他的理想付出这类吃亏的代价的。",
    "人生格言",
    "殷海光书信",
    "写理想主义的代价。",
  ),
  row(
    "020.乱世中的一个感想.txt",
    15,
    15,
    "我们没有决定性的理由（decisive reason）来断言这个地球上没有真诚的人。",
    "人生格言",
    "殷海光书信",
    "保留对真诚的信念。",
  ),
  row(
    "020.乱世中的一个感想.txt",
    15,
    15,
    "我们还得在共同的工作里交友。",
    "交友格言",
    "殷海光书信",
    "以共同工作检验朋友。",
  ),
  row(
    "020.乱世中的一个感想.txt",
    17,
    17,
    "珍惜余生，反求诸自己，做千秋大业",
    "李敖人生格言",
    "李敖书信",
    "强调把余生转向自我完成。",
  ),
  row(
    "020.乱世中的一个感想.txt",
    17,
    17,
    "成品是检验真理的唯一标准",
    "李敖创作格言",
    "李敖书信",
    "以成品检验理念。",
  ),
  row(
    "020.乱世中的一个感想.txt",
    17,
    17,
    "共同创造出成品，才是朋友的最大意义",
    "交友格言",
    "李敖书信",
    "把共同创作视为友谊意义。",
  ),
  row(
    "023.做光明磊落的朋友·做光明磊落的敌人.txt",
    17,
    17,
    "使你过分痛苦的朋友，还是让他去做敌人吧！",
    "李敖交友格言",
    "李敖书信",
    "以痛苦程度区分友敌。",
  ),
  row(
    "023.做光明磊落的朋友·做光明磊落的敌人.txt",
    19,
    19,
    "凡夫俗子愈大愈没是非，我却愈大愈是非分明。",
    "李敖自述格言",
    "李敖书信",
    "写年岁增长后的判断。",
  ),
  row(
    "023.做光明磊落的朋友·做光明磊落的敌人.txt",
    21,
    21,
    "左右逢源，是一种道德上的软弱",
    "李敖道德格言",
    "李敖书信",
    "批评无原则圆滑。",
  ),
  row(
    "023.做光明磊落的朋友·做光明磊落的敌人.txt",
    23,
    23,
    "去像个朋友或去像个敌人，不要什么都不像！",
    "李敖交友格言",
    "李敖书信",
    "要求关系立场清楚。",
  ),
  row(
    "023.做光明磊落的朋友·做光明磊落的敌人.txt",
    23,
    23,
    "如果我不能训练朋友如何做朋友，我愿训练敌人如何做敌人。",
    "李敖交友格言",
    "李敖书信",
    "以锋利语气谈友敌。",
  ),
  row(
    "023.做光明磊落的朋友·做光明磊落的敌人.txt",
    23,
    23,
    "巨人总是很寂寞的，因为他连个入流的敌人都碰不到。",
    "李敖自述格言",
    "李敖书信",
    "写巨人与敌手的孤独。",
  ),
  row(
    "023.做光明磊落的朋友·做光明磊落的敌人.txt",
    23,
    23,
    "为什么唐吉诃德要同风车作战了——因为配称为他的敌人的朋友太少了！",
    "李敖文学化格言",
    "李敖化用《唐吉诃德》",
    "以唐吉诃德比喻难逢对手。",
  ),
  row(
    "024.别人捧得不够.txt",
    7,
    7,
    "泉洌而酒香",
    "文学炼字例",
    "欧阳修《醉翁亭记》改句",
    "文章炼字的旧稿。",
  ),
  row(
    "024.别人捧得不够.txt",
    7,
    7,
    "泉香而酒洌",
    "文学炼字例",
    "欧阳修《醉翁亭记》改句",
    "文章炼字的改稿。",
  ),
  row(
    "024.别人捧得不够.txt",
    7,
    7,
    "文章大家认真如此。",
    "李敖文论短语",
    "李敖书信",
    "赞文章大家认真。",
  ),
  row(
    "024.别人捧得不够.txt",
    9,
    9,
    "文章写出来，要能读，读得顺、读得有力、读得音色天成。",
    "李敖写作格言",
    "李敖书信",
    "强调文章朗读的节奏和力量。",
  ),
  row(
    "024.别人捧得不够.txt",
    13,
    13,
    "去努力、去追求、去寻找——永不退却，不屈服。",
    "西方诗句",
    "丁尼生",
    "写追求与不屈。",
  ),
  row(
    "024.别人捧得不够.txt",
    19,
    19,
    "每当别人捧他，他就不安，因为别人捧得不够",
    "作家轶语",
    "萧伯纳",
    "幽默写文豪自负。",
  ),
  row(
    "024.别人捧得不够.txt",
    23,
    29,
    "不是逢人苦誉君，\n亦狂亦侠亦温文，\n照人胆似秦时月，\n送我情如岭上云。",
    "古诗",
    "龚自珍《己亥杂诗》",
    "以亦狂亦侠亦温文赞人。",
  ),
  row(
    "025.永怀沈铭三先生.txt",
    11,
    11,
    "至德者寿",
    "古话",
    "古话",
    "以德高而寿赞长者。",
  ),
  row(
    "025.永怀沈铭三先生.txt",
    19,
    19,
    "《呻吟语》是中国正人君子的教科书",
    "读书评语",
    "李敖书信",
    "以《呻吟语》概括传统人格教材。",
  ),
  row(
    "025.永怀沈铭三先生.txt",
    19,
    19,
    "我变得喜欢交够朋友的朋友",
    "李敖交友格言",
    "李敖书信",
    "偏爱旧式厚道的朋友。",
  ),
  row(
    "025.永怀沈铭三先生.txt",
    19,
    19,
    "我对工业社会里的朋友之道一概不欣赏，我觉得那种友情现实、速成而易消",
    "李敖交友格言",
    "李敖书信",
    "批评速成易消的友情。",
  ),
  row(
    "025.永怀沈铭三先生.txt",
    19,
    19,
    "成为我的朋友的，我就忠心耿耿，他们对我也是一样。",
    "李敖交友格言",
    "李敖书信",
    "写互相忠心的友道。",
  ),
  row(
    "026.天下没有不散的筵席.txt",
    5,
    5,
    "天下没有不散的筵席",
    "俗语",
    "传统俗语",
    "写聚散无常。",
  ),
  row(
    "026.天下没有不散的筵席.txt",
    9,
    9,
    "久压公等，但恨不见替人！",
    "古人临终语",
    "杜审言",
    "自谦压住后进、无人接替。",
  ),
  row(
    "028.我为什么不鼓掌？.txt",
    11,
    11,
    "要维持“不说混话”的水平",
    "李敖文论格言",
    "李敖书信",
    "把不说混话作为文章水准。",
  ),
  row(
    "029.愈来愈像小偷了.txt",
    33,
    33,
    "不闻其声，不见其人，只感到他强大的影响力，由神秘而生到神秘而死，高人出没，当如是也！",
    "李敖隐居格言",
    "李敖书信",
    "写隐居者仍保有影响力。",
  ),
  row(
    "029.愈来愈像小偷了.txt",
    37,
    43,
    "I know that he exists;\nSomewhere, in silence,\nHe has hid his rare life\nFrom our gross eyes.",
    "西方诗句",
    "Emily Dickinson",
    "写稀有生命隐于粗俗目光之外。",
  ),
  row(
    "029.愈来愈像小偷了.txt",
    45,
    45,
    "我会在Somewhere存在，但绝不in silence，要说的话，一句也不会少说",
    "李敖自述格言",
    "李敖化用Emily Dickinson",
    "化用诗句写不沉默的存在。",
  ),
  row(
    "032.扳手与玫瑰.txt",
    7,
    7,
    "扳手与玫瑰",
    "广告标题",
    "西班牙航空广告",
    "以工具与花象征力量和优雅。",
  ),
  row(
    "032.扳手与玫瑰.txt",
    7,
    7,
    "The wrench and the rose",
    "广告标题",
    "Iberia Air Lines of Spain",
    "英文广告主题。",
  ),
  row(
    "032.扳手与玫瑰.txt",
    9,
    13,
    "On Iberia Air Lines of Spain the wrench comes first then the rose.\nThe wrench stands for the careful way all Iberia DC - 8 Fan Jets are serviced. It also stands for the skill of Iberia pilots with millions of miles of experience.\nNext in importance is the rose. It represents the gracious way all Iberia people delight inshowing their passengers what Spanish hospitality really means.",
    "广告文案",
    "Iberia Air Lines of Spain",
    "以扳手与玫瑰分别代表服务技术和待客优雅。",
  ),
  row(
    "032.扳手与玫瑰.txt",
    15,
    15,
    "这是“力”与“美”的联合作业。",
    "李敖化用格言",
    "李敖书信",
    "把广告意象转为力与美的并用。",
  ),
  row(
    "033.大丈夫不怕失败.txt",
    1,
    1,
    "大丈夫不怕失败",
    "李敖题名格言",
    "李敖书信题名",
    "以大丈夫气概面对失败。",
  ),
  row(
    "034.“我心里有老虎在闻玫瑰”.txt",
    25,
    25,
    "我心里有老虎在闻玫瑰。",
    "西方诗句",
    "萨松",
    "以老虎与玫瑰并置刚柔。",
  ),
  row(
    "034.“我心里有老虎在闻玫瑰”.txt",
    25,
    25,
    "In me the tiger sniffs the rose.",
    "西方诗句",
    "Siegfried Sassoon",
    "萨松名句英文原文。",
  ),
  row(
    "040.人见人怕鬼见愁.txt",
    15,
    15,
    "现在世界最缺乏的是善意与力量的结合，有善意者多无力量，有力量者多无善意",
    "思想格言",
    "爱因斯坦",
    "说明善意与力量常分离。",
  ),
  row(
    "041.佛头上与太岁头上.txt",
    7,
    7,
    "佛头着粪",
    "成语",
    "传统成语",
    "比喻污损美好事物。",
  ),
  row(
    "041.佛头上与太岁头上.txt",
    7,
    7,
    "太岁头上动土",
    "成语",
    "传统成语",
    "比喻触犯难惹对象。",
  ),
  row(
    "041.佛头上与太岁头上.txt",
    7,
    7,
    "每个人都有论断别人的自由，但是不能在错误的事实上加以论断",
    "李敖论断格言",
    "李敖书信",
    "强调判断必须依事实。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    7,
    7,
    "滂死则祸塞，何敢以罪累君，又令老母流离乎！",
    "古文名句",
    "《后汉书·范滂传》",
    "写不愿累及他人的担当。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    7,
    7,
    "既有令名，复求寿考，可兼得乎？",
    "古文名句",
    "《后汉书·范滂传》",
    "范母以令名与寿考不可兼得相勉。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    7,
    7,
    "吾欲使汝为恶，则恶不可为；使汝为善，则我不为恶！",
    "古文名句",
    "《后汉书·范滂传》",
    "范母临别语中关于善恶的两难。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    11,
    11,
    "见善如不及，见恶如探汤。",
    "古文成句",
    "《论语》",
    "写趋善避恶的急切。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    19,
    19,
    "相劝为恶，恶不可为；相劝为善，正见今日，如何？",
    "古文名句",
    "《南史·刘湛传》",
    "写劝善遭难时的感慨。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    19,
    19,
    "吾一生为善，未蒙善报；常不为恶，今为恶终。悠悠苍天，抱直无诉！",
    "古文名句",
    "《魏书·韦阆传》",
    "写持善而遭厄的悲叹。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    23,
    23,
    "为善本身是自足的，不宜要求善报来成全这一自足",
    "李敖道德格言",
    "李敖书信",
    "说明为善不应要求回报。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    23,
    23,
    "不宜因遭遇恶报而怀疑本身上的善。",
    "李敖道德格言",
    "李敖书信",
    "强调不因恶报否定善。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    27,
    27,
    "善有恶报又何妨！",
    "李敖道德格言",
    "李敖书信",
    "以反问坚持为善。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    27,
    27,
    "只要为善就是最乐了",
    "李敖道德格言",
    "李敖书信",
    "把为善本身视为快乐。",
  ),
  row(
    "048.善有恶报又何妨！.txt",
    27,
    27,
    "想在为善以外别有希冀的人，不但毁了善的本身，也将自寻烦恼。",
    "李敖道德格言",
    "李敖书信",
    "指出善外求报会自寻烦恼。",
  ),
  row(
    "054.迟来的“Ping”.txt",
    15,
    15,
    "人心常有公理在，只是大家要命地只把它摆在心里",
    "读者格言",
    "张大为来信",
    "写公理常藏在人心。",
  ),
  row(
    "054.迟来的“Ping”.txt",
    19,
    19,
    "我愿中国有不世之才，愿不世之才有不世之作。",
    "读者赠语",
    "张大为来信",
    "盼才与作品相配。",
  ),
  row(
    "054.迟来的“Ping”.txt",
    37,
    37,
    "稼轩是极有性情人，学稼轩者，胸中须先具一股真气奇气，否则虽纸上奔腾，其中俄空焉。",
    "词话评语",
    "谢章铤《赌棋山庄词话》",
    "论学辛弃疾须先有真气奇气。",
  ),
  row(
    "054.迟来的“Ping”.txt",
    37,
    37,
    "我打遍天下的一“Ping”其实非我之才，而是我之真。",
    "李敖自述格言",
    "李敖书信",
    "把锋芒归于真性情。",
  ),
  row(
    "056.寿星杂感.txt",
    7,
    7,
    "花瓶只是花瓶做得，人是不可做花瓶的",
    "李敖人生格言",
    "李敖书信",
    "以花瓶比喻人不可只作摆设。",
  ),
  row(
    "056.寿星杂感.txt",
    23,
    23,
    "你只要看一个人的书就好了，不必看他这个人",
    "西方格言",
    "罗斯金",
    "主张以作品认识作者。",
  ),
  row(
    "056.寿星杂感.txt",
    23,
    23,
    "我的乐趣就在孤独上面。",
    "李敖自述格言",
    "李敖书信",
    "把孤独视为乐趣。",
  ),
  row(
    "056.寿星杂感.txt",
    25,
    25,
    "英雄豪杰对世态人心，早就有苍茫与大度的了解。",
    "李敖英雄格言",
    "李敖书信",
    "写英雄看透人心仍有大度。",
  ),
  row(
    "056.寿星杂感.txt",
    25,
    25,
    "他们还是要在夹道欢呼中或路人啐骂里，走上前去。",
    "李敖英雄格言",
    "李敖书信",
    "写英雄不因褒贬停止前行。",
  ),
  row(
    "056.寿星杂感.txt",
    27,
    27,
    "盗亦有道",
    "成语",
    "传统成语",
    "写盗也有原则。",
  ),
  row(
    "056.寿星杂感.txt",
    27,
    27,
    "现代罗宾汉必然以孤独为“人生最大乐趣”了。",
    "李敖英雄格言",
    "李敖书信",
    "把现代侠者的孤独写成乐趣。",
  ),
  row(
    "056.寿星杂感.txt",
    29,
    29,
    "所有伟大生活都有无趣的阶段。",
    "西方格言",
    "罗素",
    "写伟大生活也有平淡阶段。",
  ),
  row(
    "056.寿星杂感.txt",
    29,
    29,
    "All great lives have contained uninteresting stretches.",
    "西方格言",
    "Bertrand Russell",
    "罗素英文原句。",
  ),
  row(
    "056.寿星杂感.txt",
    29,
    29,
    "伟人的生活除了少数伟大时期外，并无令人兴奋的地方。",
    "西方格言",
    "罗素",
    "写伟人生活多半安静平淡。",
  ),
  row(
    "056.寿星杂感.txt",
    29,
    29,
    "Nor have the lives of most great men been excitiing except at a few great moments.",
    "西方格言",
    "Bertrand Russell",
    "罗素英文原句。",
  ),
  row(
    "056.寿星杂感.txt",
    29,
    29,
    "从全体看来，安静的生活是伟人的特征，他们的喜乐并不是世俗心目中所认定的那一种。",
    "西方格言",
    "罗素",
    "论伟人的安静生活。",
  ),
  row(
    "056.寿星杂感.txt",
    29,
    29,
    "一切伟大的成绩必由于历久不懈的工作，其全神贯注与繁重程度，使人没有余力去从事狂热的娱乐。",
    "西方格言",
    "罗素",
    "强调伟大成绩来自持久专注。",
  ),
  row(
    "056.寿星杂感.txt",
    29,
    29,
    "形若槁木，心若死灰",
    "古文成句",
    "庄子成语",
    "写外形枯寂、内心淡定。",
  ),
  row(
    "057.可以怀古，不必怀乡.txt",
    15,
    15,
    "却恐他乡胜故乡",
    "古诗句",
    "古人诗句",
    "写他乡也可能胜故乡。",
  ),
  row(
    "057.可以怀古，不必怀乡.txt",
    15,
    15,
    "此心安处即为乡",
    "古诗句",
    "苏轼",
    "以心安定处为故乡。",
  ),
  row(
    "057.可以怀古，不必怀乡.txt",
    15,
    15,
    "埋骨何须桑梓地，人间何处不青山",
    "古诗句",
    "传统诗句",
    "写不必拘泥故乡归葬。",
  ),
  row(
    "057.可以怀古，不必怀乡.txt",
    21,
    21,
    "现代人可以怀古（我就最喜欢流连江山胜迹，我生平最大的愿望不是徐复观那样去孔林，而是去挖孔夫子的坟，看看里面有些什么有益于中华文化），但实在不必怀乡。",
    "李敖人生格言",
    "李敖书信",
    "区分怀古与怀乡。",
  ),
  row(
    "057.可以怀古，不必怀乡.txt",
    21,
    21,
    "怀古是一种博大的情操，怀乡却是一种渺小的滥情",
    "李敖人生格言",
    "李敖书信",
    "将怀古与怀乡作价值区分。",
  ),
  row(
    "057.可以怀古，不必怀乡.txt",
    23,
    23,
    "重要的是自己要真正有功德于苍生，长江美不美、黄河壮不壮、水塘臭不臭，都其余事也！",
    "李敖人生格言",
    "李敖书信",
    "强调功德重于乡土景物。",
  ),
  row(
    "059.左眼·右眼·青眼·白眼.txt",
    7,
    7,
    "伪善的执行人是伪君子",
    "李敖道德格言",
    "李敖书信",
    "界定伪善与伪君子。",
  ),
  row(
    "059.左眼·右眼·青眼·白眼.txt",
    17,
    17,
    "又能为青白眼，见礼俗之士，以白眼对之。及嵇喜来吊（吊阮籍母丧），籍作白眼，喜不怿而退。喜弟康闻之，乃赍酒挟琴造焉，籍大悦，乃见青眼。由是礼法之士，疾之若雠。",
    "古文名段",
    "《晋书·阮籍传》",
    "阮籍青白眼典故。",
  ),
  row(
    "059.左眼·右眼·青眼·白眼.txt",
    19,
    19,
    "青山当户，白眼看人。",
    "古诗联句",
    "传统联句",
    "以白眼看人写冷峻姿态。",
  ),
  row(
    "059.左眼·右眼·青眼·白眼.txt",
    19,
    19,
    "实无青眼可资垂注，故一律白眼对之。",
    "李敖化用短语",
    "李敖化用阮籍典故",
    "化用青白眼典故写态度。",
  ),
  row(
    "061.1958年9月20日致胡适信.txt",
    27,
    27,
    "未识想风采，别去令人思",
    "古诗句",
    "黄庭坚",
    "写未见时想见、别后思念。",
  ),
  row(
    "062.1968年生日给王尚勤.txt",
    27,
    27,
    "与其长期闹头疼，不如干脆昏倒一次",
    "俗话",
    "俗话",
    "以剧烈一次解决长期痛苦。",
  ),
  row(
    "062.1968年生日给王尚勤.txt",
    29,
    29,
    "小文属于她自己，并不属于任何人。",
    "李敖人生格言",
    "李敖家书",
    "强调孩子首先属于自己。",
  ),
  row(
    "063.1981年李敖家书.txt",
    5,
    5,
    "幸福的家庭都有同样的幸福，不幸的家庭却各有各的不幸。",
    "西方文学名句",
    "托尔斯泰《安娜·卡列尼娜》",
    "家庭幸福与不幸的名句。",
  ),
  row(
    "063.1981年李敖家书.txt",
    31,
    31,
    "不痴不聋，不做阿家翁",
    "古训",
    "传统古训",
    "劝长辈对子孙事装聋作哑。",
  ),
  row(
    "064.1971年9月30日致萧孟能信.txt",
    11,
    11,
    "口不言人过",
    "古典德目短语",
    "李敖书信",
    "列为朋友长处之一。",
  ),
  row(
    "064.1971年9月30日致萧孟能信.txt",
    11,
    11,
    "为善若升，为恶若崩",
    "古话",
    "古话",
    "善难恶易的古训。",
  ),
  row(
    "064.1971年9月30日致萧孟能信.txt",
    11,
    11,
    "十年相处的记录，不该为一时的小利所毁",
    "李敖交友格言",
    "李敖书信",
    "提醒友谊记录不可毁于小利。",
  ),
  row(
    "064.1971年9月30日致萧孟能信.txt",
    11,
    11,
    "是升是崩，敬盼你能做出永不后悔的选择。",
    "李敖劝诫语",
    "李敖书信",
    "以善恶升崩劝人选择。",
  ),
  row(
    "065.1973年3月5日致周渝信.txt",
    5,
    5,
    "在这年头，这类情谊，已算旧式的了。而你居然如此古典，你真该被侧目相看了！",
    "李敖友情语",
    "李敖书信",
    "赞旧式情谊。",
  ),
  row(
    "065.1973年3月5日致周渝信.txt",
    7,
    7,
    "生命已入化境，此丹炉之赐也！",
    "李敖自述格言",
    "李敖书信",
    "以丹炉比喻磨炼后的生命。",
  ),
  row(
    "065.1973年3月5日致周渝信.txt",
    9,
    9,
    "智慧成熟极早",
    "人物评语",
    "梁实秋",
    "梁实秋评李敖学识。",
  ),
  row(
    "065.1973年3月5日致周渝信.txt",
    9,
    9,
    "文人式的任才使气",
    "文人性格短语",
    "李敖自述",
    "概括早年文人习气。",
  ),
  row(
    "065.1973年3月5日致周渝信.txt",
    9,
    9,
    "从心所欲",
    "古典成语",
    "《论语》",
    "写性格修炼后的自在。",
  ),
  row(
    "071.1980年末李敖致高信疆.txt",
    5,
    5,
    "文化楚奴",
    "李敖文化短语",
    "李敖书信",
    "比喻受制的文化人。",
  ),
  row(
    "071.1980年末李敖致高信疆.txt",
    5,
    5,
    "文化自耕农",
    "李敖文化短语",
    "李敖书信",
    "比喻自立经营的文化人。",
  ),
  row(
    "071.1980年末李敖致高信疆.txt",
    5,
    5,
    "以有限退休之金，做无限出版之业，千乞小心。",
    "李敖出版格言",
    "李敖书信",
    "提醒出版事业量力而行。",
  ),
  row(
    "071.1980年末李敖致高信疆.txt",
    5,
    5,
    "阁下做人成功，彼等作文失败，杂志必将泯然而失个性",
    "李敖编辑格言",
    "李敖书信",
    "提醒迁就作者会损伤杂志个性。",
  ),
];

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

const firstRoundData = data.map((record, index) => ({
  ...record,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

const proofreadRemoved = [
  { id: "LALTRS-006", reason: "清官、官吏治理色彩较重，校对轮按公共治理语境删除。" },
  { id: "LALTRS-007", reason: "仅为短碎概念，独立格言价值不足。" },
  { id: "LALTRS-020", reason: "从杂志停办与外部压力语境中抽出的自述短语，公共斗争色彩较重。" },
  { id: "LALTRS-041", reason: "含乱世、打击、救世等公共斗争语气，校对轮从严删除。" },
  { id: "LALTRS-042", reason: "救世语境较重，不作为非政治性人生格言保留。" },
  { id: "LALTRS-079", reason: "题名直接出自落选安慰信，选务背景过重。" },
  { id: "LALTRS-086", reason: "范滂案具体情节句，古代案件与公权语境过重。" },
  { id: "LALTRS-087", reason: "范滂案临别语中的名寿取舍，仍依附案件语境，校对轮删除。" },
  { id: "LALTRS-088", reason: "范滂母子临别句，案件语境重于独立道德格言。" },
  { id: "LALTRS-090", reason: "《南史》案件感慨句，和古代狱事牵连过深。" },
  { id: "LALTRS-091", reason: "《魏书》案件感慨句，和古代刑难语境牵连过深。" },
  { id: "LALTRS-118", reason: "句子过长且夹有私人文化愿望，不宜作为独立格言。" },
  { id: "LALTRS-127", reason: "私人家书中的儿童归属判断，项目独立检索价值不足。" },
  { id: "LALTRS-133", reason: "私人合作纠纷中的劝诫语，脱离上下文后格言性不足。" },
  { id: "LALTRS-134", reason: "私人友情称许，独立诗文格言价值不足。" },
];

const firstRoundById = new Map(firstRoundData.map((record) => [record.id, record]));
const proofreadRemovedIds = new Set(proofreadRemoved.map((item) => item.id));
for (const item of proofreadRemoved) {
  const record = firstRoundById.get(item.id);
  if (!record) throw new Error(`Missing proofread removal id: ${item.id}`);
  item.source_file = record.source_file;
  item.line_range = `${record.line_start}-${record.line_end}`;
  item.category = record.category;
  item.quote_text = record.quote_text;
}

const outputData = firstRoundData.filter((record) => !proofreadRemovedIds.has(record.id));

const sourceFiles = fs
  .readdirSync(path.join(process.cwd(), sourceDir))
  .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const riskRegex =
  /(政治|国会|总统|总裁|政府|政党|国民党|共产党|民主|选举|外交|主权|人权|二二八|西藏|雷震案|司法|法院|军政|民族国家|革命|党国|中共|马克思主义|集权政权|出版法|报禁|查禁)/;
const quoteCandidateRegex =
  /[“‘「『《][^”’」』》]{2,}[”’」』》]|[A-Za-z][A-Za-z0-9 ,.';:!?()\-–—]{24,}/g;
const attributedRegex =
  /(说|曰|云|诗|词|名句|格言|俗话|古话|成语|谚|引|所谓|英文|原文|Russell|罗素|Dickinson|Tennyson|丁尼生|富兰克林|陆游|王安石|水浒传|论语|后汉书|晋书|苏轼|龚|萨松|罗斯金)/i;

function isCovered(file, lineNumber) {
  return outputData.some(
    (record) =>
      record.source_file === file &&
      Number(record.line_start) <= lineNumber &&
      lineNumber <= Number(record.line_end),
  );
}

const candidates = [];
const attributedLines = [];
for (const file of sourceFiles) {
  const lines = readLines(file);
  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const text = lines[index].trim();
    if (!text) continue;

    const matches = [...text.matchAll(quoteCandidateRegex)].map((match) => match[0]);
    if (matches.length > 0) {
      candidates.push({
        source_file: file,
        line_number: lineNumber,
        covered: isCovered(file, lineNumber),
        risky: riskRegex.test(text),
        matches,
        text,
      });
    }

    if (attributedRegex.test(text)) {
      attributedLines.push({
        source_file: file,
        line_number: lineNumber,
        covered: isCovered(file, lineNumber),
        risky: riskRegex.test(text),
        text,
      });
    }
  }
}

const reviewCandidates = candidates.filter((candidate) => !candidate.covered);
const riskyCandidates = reviewCandidates.filter((candidate) => candidate.risky);

const excludedHighlights = [
  {
    source_file: "004.谁来激烈？.txt",
    line_range: "15-51",
    reason: "近人公共争论语境中的旧诗包装，本轮不收。",
  },
  {
    source_file: "006.为“护照”而战.txt",
    line_range: "全文",
    reason: "以现代出入境与公权冲突为主，未收。",
  },
  {
    source_file: "011.公器、选举及其他.txt",
    line_range: "全文",
    reason: "以选务、公器与公共发言为主，未收。",
  },
  {
    source_file: "014.坐假牢与判假刑.txt",
    line_range: "全文",
    reason: "以诉讼和判刑语境为主，未收。",
  },
  {
    source_file: "030.选举期间的三封信.txt",
    line_range: "全文",
    reason: "现代选务语境过重，未收。",
  },
  {
    source_file: "036.回陈水扁的一封信.txt",
    line_range: "全文",
    reason: "现代公共人物书信，未收。",
  },
  {
    source_file: "037.给谢长廷的一封信.txt",
    line_range: "全文",
    reason: "现代公共人物书信，未收。",
  },
  {
    source_file: "042.给施启扬老兄的公开信.txt",
    line_range: "全文",
    reason: "法律与公共问责语境过重，未收。",
  },
  {
    source_file: "049.关于同志的质疑.txt",
    line_range: "全文",
    reason: "现代公共概念和论辩语境过重，未收。",
  },
  {
    source_file: "050.质问黄少谷先生.txt",
    line_range: "全文",
    reason: "现代公共人物质问，未收。",
  },
  {
    source_file: "052.封建主义是海峡两岸的共同敌人.txt",
    line_range: "全文",
    reason: "公共论述语境过重，未收。",
  },
  {
    source_file: "058.不要为扶住懦夫而让勇士倒下.txt",
    line_range: "全文",
    reason: "法律争议和公共事件语境过重，题名格言暂不收。",
  },
  {
    source_file: "060.论小的也要.txt",
    line_range: "全文",
    reason: "大段现代公共论辩和史论语境，未收。",
  },
  {
    source_file: "068.2010年致蔡武信残本.txt",
    line_range: "全文",
    reason: "现代文化行政语境，未收。",
  },
  {
    source_file: "070.李敖写给王敬羲的十封信.txt",
    line_range: "主要段落",
    reason: "多为出版事务和旧作题名列表，已在相关书内覆盖，本轮不重复扩收。",
  },
];

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const csvLines = [
  columns.join(","),
  ...outputData.map((record) => columns.map((column) => csvEscape(record[column])).join(",")),
];
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txtLines = [`《${book}》诗文格言歌谣引用`, `生成日期：${generatedDate}`, `记录数：${outputData.length}`, ""];
for (const record of outputData) {
  txtLines.push(`[${record.id}] ${record.quote_text}`);
  txtLines.push(`出处：${record.book} / ${record.chapter} / ${record.source_file}:${record.line_start}-${record.line_end}`);
  txtLines.push(`类别：${record.category}`);
  txtLines.push(`来源：${record.source_or_origin}`);
  txtLines.push(`说明：${record.summary}`);
  if (record.notes) txtLines.push(`备注：${record.notes}`);
  txtLines.push("");
}
fs.writeFileSync(txtPath, `\uFEFF${txtLines.join("\r\n")}\r\n`, "utf8");

const candidateJsonPath = path.join(analysisDir, "liao_letters_quote_candidates.json");
fs.writeFileSync(candidateJsonPath, `${JSON.stringify(candidates, null, 2)}\n`, "utf8");

const reviewTsvPath = path.join(analysisDir, "liao_letters_review_candidates.tsv");
const reviewColumns = ["source_file", "line_number", "risky", "matches", "text"];
const reviewLines = [
  reviewColumns.join("\t"),
  ...reviewCandidates.map((candidate) =>
    reviewColumns
      .map((column) =>
        tsvEscape(column === "matches" ? candidate.matches.join(" | ") : candidate[column]),
      )
      .join("\t"),
  ),
];
fs.writeFileSync(reviewTsvPath, `\uFEFF${reviewLines.join("\r\n")}\r\n`, "utf8");

const attributedTsvPath = path.join(analysisDir, "liao_letters_attributed_lines.tsv");
const attributedColumns = ["source_file", "line_number", "covered", "risky", "text"];
const attributedTsvLines = [
  attributedColumns.join("\t"),
  ...attributedLines.map((candidate) =>
    attributedColumns.map((column) => tsvEscape(candidate[column])).join("\t"),
  ),
];
fs.writeFileSync(attributedTsvPath, `\uFEFF${attributedTsvLines.join("\r\n")}\r\n`, "utf8");

const auditPath = path.join(analysisDir, "liao_letters_initial_audit.tsv");
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
    category: item.category,
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

const proofreadAuditPath = path.join(analysisDir, "liao_letters_proofread_audit.tsv");
fs.writeFileSync(proofreadAuditPath, `\uFEFF${auditLines.join("\r\n")}\r\n`, "utf8");

const reportPath = path.join(analysisDir, "liao_letters_initial_report.txt");
const categoryCounts = new Map();
for (const record of outputData) {
  categoryCounts.set(record.category, (categoryCounts.get(record.category) ?? 0) + 1);
}

const riskyOutputRows = outputData.filter((record) =>
  riskRegex.test(
    [record.quote_text, record.category, record.source_or_origin, record.summary].join("\n"),
  ),
);

const report = [];
report.push(`《${book}》校对报告`);
report.push(`生成日期：${generatedDate}`);
report.push(`输出：${csvPath}`);
report.push(`输出：${txtPath}`);
report.push(`首轮记录数：${firstRoundData.length}`);
report.push(`校对后记录数：${outputData.length}`);
report.push(`校对删除：${proofreadRemoved.length}`);
report.push(`候选行：${candidates.length}`);
report.push(`待复核候选行：${reviewCandidates.length}`);
report.push(`待复核高风险候选行：${riskyCandidates.length}`);
report.push(`当前输出高风险字段命中：${riskyOutputRows.length}`);
report.push("");
report.push("分类统计：");
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
  report.push(`- ${category}: ${count}`);
}
report.push("");
report.push("校对删除：");
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
report.push("- 本书现代公共事务、法律争议、选务语境密集，校对轮应继续优先检查题名格言是否被上下文污染。");
report.push("- 《善有恶报又何妨！》只保留短句和道德命题，未收整段古代案件叙述。");
report.push("- 《寿星杂感》《可以怀古，不必怀乡》收录较多人生格言，校对轮可再压缩私人语境较重的句子。");
fs.writeFileSync(reportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

const proofreadReportPath = path.join(analysisDir, "liao_letters_proofread_report.txt");
fs.writeFileSync(proofreadReportPath, `\uFEFF${report.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      firstRoundRecords: firstRoundData.length,
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
      riskyOutputRows: riskyOutputRows.map((record) => record.id),
    },
    null,
    2,
  ),
);
