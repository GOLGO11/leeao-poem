const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(
  root,
  "《大李敖全集6.0》分章节",
  "008.书信函件类",
  "004.李敖书简集"
);
const exportsDir = path.join(root, "exports");
const analysisDir = path.join(root, "analysis");
const bookName = "李敖书简集";
const generatedDate = "2026-06-22";
const sourceBase = "《大李敖全集6.0》分章节/008.书信函件类/004.李敖书简集";

const outputCsv = path.join(exportsDir, `${bookName}_诗文格言歌谣引用.csv`);
const outputTxt = path.join(exportsDir, `${bookName}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_shujianji_initial_report.txt");
const auditPath = path.join(analysisDir, "liao_shujianji_initial_audit.tsv");
const proofreadReportPath = path.join(analysisDir, "liao_shujianji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_shujianji_proofread_audit.tsv");
const candidatesPath = path.join(analysisDir, "liao_shujianji_quote_candidates.json");
const reviewPath = path.join(analysisDir, "liao_shujianji_review_candidates.tsv");
const attributedPath = path.join(analysisDir, "liao_shujianji_attributed_lines.tsv");

const decoder = new TextDecoder("gb18030");
const quotePattern = /[“”‘’『』「」《》]|(?:[A-Z][A-Za-z]+(?:[,，；;:：'’!?\- ]+[A-Za-z]+){3,})/;
const attributionPattern =
  /(曰|云|说|诗|词|谚|古话|俚语|格言|motto|Bible|Shakespeare|Homer|Santayana|陶渊明|苏轼|白居易|王安石|王阳明|梁启超|顾亭林|庄子|老子|论语|圣经|莎士比亚|爱因斯坦|余光中|杜甫|元稹|加缪|尼采|歌德|叔本华|罗素|萧伯纳|胡适|鲁迅|司马迁|柏拉图|亚里士多德|孟子|孔子|郦道元|丘吉尔)/i;
const politicalPattern =
  /(政治|国会|总统|总裁|政府|政党|国民党|共产党|民主|选举|外交|主权|人权|二二八|西藏|雷震案|司法|法院|军政|民族国家|革命|党国|中共|马克思主义|集权政权|出版法|报禁|查禁)/;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readText(filePath) {
  return decoder.decode(fs.readFileSync(filePath));
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

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function getSourceFiles() {
  return fs
    .readdirSync(sourceDir)
    .filter((name) => name.endsWith(".txt"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
    .map((name) => ({
      name,
      absolutePath: path.join(sourceDir, name),
      text: readText(path.join(sourceDir, name)),
    }));
}

const rawEntries = [
  ["001.怎样修理财阀.txt", 29, 29, "土地是建厂的根本，土地问题不先解决，一切都将无法推动。", "经营格言", "李敖", "以建厂论事，强调先解决根本条件。"],
  ["001.怎样修理财阀.txt", 33, 33, "这算不上是企业管理，这是常识。", "常识格言", "李敖", "把复杂事务拉回常识判断。"],
  ["001.怎样修理财阀.txt", 37, 37, "比算命乱猜还不准", "讽刺短语", "李敖", "讽刺估算荒唐失准。"],
  ["001.怎样修理财阀.txt", 79, 79, "照着葫芦画瓢", "俗语", "俗语", "比喻照样仿作即可。"],
  ["001.怎样修理财阀.txt", 79, 79, "头疼医头脚疼医脚", "俗语", "俗语", "比喻只治表面症状。"],
  ["001.怎样修理财阀.txt", 121, 121, "引狼入室", "成语", "成语", "比喻把祸患引进门。"],
  ["001.怎样修理财阀.txt", 121, 121, "叹为观止", "成语", "成语", "形容令人惊叹到极点。"],
  ["001.怎样修理财阀.txt", 125, 125, "我要研究的是怎样把先生赚来的钱花掉！", "现代引语", "叶青青《珍珠集》转述", "以幽默口吻写花钱之道。"],
  ["001.怎样修理财阀.txt", 357, 357, "利令智昏", "成语", "成语", "利益驱动会使人昏乱。"],
  ["001.怎样修理财阀.txt", 393, 393, "“狮子之份”（the lion's share）", "西方习语", "英语习语", "指占去最大、最有利的一份。"],
  ["002.党报的狂妄.txt", 31, 31, "世情如斯、人情如斯", "世情短语", "李敖", "概括世态与人情的冷暖。"],
  ["002.党报的狂妄.txt", 69, 69, "盖棺论定", "成语", "成语", "人死之后方可作定评。"],
  ["002.党报的狂妄.txt", 73, 73, "不忍卒读", "成语", "成语", "形容文字令人难以读完。"],
  ["002.党报的狂妄.txt", 73, 73, "士林之耻", "文人短语", "李敖引文", "以士林之耻概括文人圈的羞愧。"],
  ["004.胡茵梦是夹心饼干吗？.txt", 11, 11, "父为子隐，子为父隐", "古语引用", "《论语》", "亲属之间互相隐护的古语。"],
  ["004.胡茵梦是夹心饼干吗？.txt", 11, 11, "其父攘羊，而子证之", "古语引用", "《论语》", "父亲偷羊而儿子作证的典故。"],
  ["004.胡茵梦是夹心饼干吗？.txt", 33, 33, "法律只是六十分的道德", "法律格言", "李敖", "把法律视为道德的最低及格线。"],
  ["004.胡茵梦是夹心饼干吗？.txt", 35, 35, "众口铄金", "成语", "成语", "众人之言可以混淆真相。"],
  ["004.胡茵梦是夹心饼干吗？.txt", 35, 35, "不义灭夫", "改写短语", "李敖", "反用大义灭亲，写婚姻中的不义。"],
  ["004.胡茵梦是夹心饼干吗？.txt", 37, 37, "只有“大男人主义”的大丈夫，才能容忍她这一串的“大女人主义”", "爱情格言", "李敖", "以反讽写大丈夫的容忍。"],
  ["004.胡茵梦是夹心饼干吗？.txt", 39, 39, "君子之爱人也，以德；细人之爱人也，以姑息。", "古语引用", "古话", "君子以德爱人，小人以姑息爱人。"],
  ["004.胡茵梦是夹心饼干吗？.txt", 41, 41, "博学、审问、慎思、明辨以后，勇于笃行", "古语化用", "《中庸》化用", "把求知与行动连为一体。"],
  ["004.胡茵梦是夹心饼干吗？.txt", 43, 43, "当夕阳的黄昏里、当风霜的烟雨下、当春残、当梦断、当谄媚已退、当掌声已歇、当红颜已老，她会，呵，她会，她会听到“丹尼少年”的哀歌，从她耳边响起，她会带着孤独、凄艳和正义，来上我坟。", "抒情文句", "李敖", "以黄昏、风霜、梦断写迟来的哀歌与墓前相见。"],
  ["005.给黄少谷先生的公开信.txt", 5, 5, "能任怨任劳、忍耐、慎言，尤其是他有举轻若重、不忽小节的美德。", "人物评语", "吴相湘《黄少谷山谷风范》", "概括人物任劳、忍耐与重视小节的品格。"],
  ["005.给黄少谷先生的公开信.txt", 11, 11, "徒法不足以自行！", "古语引用", "古话", "法律条文本身不能自动实行。"],
  ["005.给黄少谷先生的公开信.txt", 13, 13, "听者藐藐", "古语短语", "古语", "听者轻忽不以为意。"],
  ["005.给黄少谷先生的公开信.txt", 13, 13, "行不得也", "古语短语", "古语", "虽有良法美意，仍可能无法实行。"],
  ["005.给黄少谷先生的公开信.txt", 17, 17, "少了“目击”，却多了“耳福”", "幽默短语", "李敖", "把代读说成失去目击却增添耳福。"],
  ["005.给黄少谷先生的公开信.txt", 39, 39, "断章取账", "改写短语", "李敖", "由断章取义改出，讽刺只取账目一半。"],
  ["005.给黄少谷先生的公开信.txt", 45, 45, "天下奇闻", "成语化短语", "李敖", "形容荒唐到罕见。"],
  ["005.给黄少谷先生的公开信.txt", 193, 193, "石破天惊的高论", "讽刺短语", "李敖", "以夸张语气讽刺离奇论断。"],
  ["006.殷海光·呆·鸟.txt", 21, 21, "你看，是真的人在唱歌呢！", "轶事引语", "夏道平", "书呆轶事中的天真惊叹。"],
  ["007.环游·还原·抢.txt", 9, 9, "一点也不赞成人哭得太凶，看看月亮，流两滴泪，也就够了。", "爱情引语", "来信引语", "把哭泣节制到看月亮时的两滴泪。"],
  ["007.环游·还原·抢.txt", 13, 13, "白头偕老后又可青梅竹马", "爱情格言", "李敖", "想象时间循环中老后复少的爱情趣味。"],
  ["007.环游·还原·抢.txt", 17, 17, "A person when we know well enough to borrow from, but not well enough to lend to", "英文幽默", "英文谐语", "讽刺只适合借钱、不适合借钱给他的人。"],
  ["007.环游·还原·抢.txt", 19, 19, "天无三日晴，地无三里平，人无三两银", "俗谚", "云贵俗谚", "以三无概括地方艰苦。"],
  ["007.环游·还原·抢.txt", 19, 19, "不要在云贵地区作案，也不要做狼。", "幽默格言", "李敖", "从强盗和狼的故事引出的反讽结论。"],
  ["010.论看看也好.txt", 5, 5, "看看也好", "人生短语", "于右任", "老来仍愿欣赏美色的幽默境界。"],
  ["010.论看看也好.txt", 9, 9, "亦知美之为美", "古语化短语", "左舜生转述", "人老仍知道美之为美。"],
  ["010.论看看也好.txt", 9, 9, "“看看也好”，是多么有趣味的境界！又是多么潇洒的境界、纯真的境界、婉而虐兮的境界！", "人生格言", "李敖", "把看看也好解释成潇洒纯真的人生趣味。"],
  ["011.介绍《我爱李敖》.txt", 15, 15, "李敖是台湾文化界的一颗“星”、一个“现象”、一个“奇观”", "人物评语", "金延湘《我爱李敖》", "把李敖写成文化现象和奇观。"],
  ["011.介绍《我爱李敖》.txt", 17, 17, "李敖就是李敖，你不能把他划为某一类，不能把他归为哪一格", "人物评语", "金延湘《我爱李敖》", "强调李敖难以被常规定性。"],
  ["011.介绍《我爱李敖》.txt", 21, 21, "没有这些做硬里子，所有的“表演”又何所依附呢？", "文论格言", "李敖", "认为表演须有学问、见解和人格作底。"],
  ["011.介绍《我爱李敖》.txt", 29, 29, "天不生仲尼，都万古如长夜，何况不生李敖呢？", "古语改写", "李敖", "借天不生仲尼自嘲式夸饰自己。"],
  ["011.介绍《我爱李敖》.txt", 31, 31, "今天我就不骂人——我只捧自己。哈哈哈。", "幽默短语", "李敖", "以自捧代替骂人的玩笑。"],
  ["012.寄林永丰论跟谁吃饭.txt", 9, 9, "痛苦的美食", "生活短语", "李敖", "把不愿同席的饭局称作痛苦的美食。"],
  ["012.寄林永丰论跟谁吃饭.txt", 11, 11, "矫情与狂狷岂不也正是我的性格吗？", "自述短语", "李敖", "自承矫情与狂狷是性格的一部分。"],
  ["013.为什么活一百岁？.txt", 7, 7, "要清白，请长寿！", "人生格言", "李敖", "把长寿视为等待清白的方式。"],
  ["013.为什么活一百岁？.txt", 7, 7, "没有当时反击能力的人，他必须设法长寿，练得比他的‘敌人’活得更长久。", "人生格言", "李敖", "无力即时反击时，要以长寿等待反转。"],
  ["013.为什么活一百岁？.txt", 7, 7, "“长寿”也是一种武器", "人生格言", "李敖", "把长寿视为反击和见证的武器。"],
  ["016.保证相互毁灭.txt", 7, 7, "相见争如不见", "古诗文引用", "古语", "相见不如不见的反向感慨。"],
  ["016.保证相互毁灭.txt", 7, 7, "相濡以沫", "成语", "《庄子》", "困境中以微力互相救助。"],
  ["016.保证相互毁灭.txt", 7, 7, "相忘于江湖", "成语", "《庄子》", "不如在广阔天地中彼此相忘。"],
  ["016.保证相互毁灭.txt", 25, 25, "礼贤下士", "成语", "成语", "礼待贤者、谦逊待人。"],
  ["016.保证相互毁灭.txt", 63, 63, "一言千鼎，字字珠玑", "来信评语", "蔡金铿来信", "赞文字分量极重、字字精美。"],
  ["016.保证相互毁灭.txt", 63, 63, "一个人的生命力，决于其对人类所做之贡献多寡", "人生格言", "蔡金铿来信", "以贡献衡量人的生命力。"],
  ["018.李敖冤狱平反·尤清冤狱在望.txt", 15, 15, "大恸，踣地，更不进食……奄忽而逝！", "古文引用", "全祖望《节愍赵先生传纠谬》", "写听闻真相后的悲恸绝食而逝。"],
  ["019.漫谈“大姑娘洗澡心理”.txt", 5, 5, "给光明做基础", "祝贺短语", "李敖", "以烛台寓意给光明做基础。"],
  ["019.漫谈“大姑娘洗澡心理”.txt", 7, 7, "大姑娘洗澡心理", "讽刺短语", "李敖", "用怕人偷看的心理作讽刺比喻。"],
  ["019.漫谈“大姑娘洗澡心理”.txt", 9, 9, "用肉眼是看不见，但我是用望远镜看的。", "笑话引语", "笑话", "老处女笑话中的望远镜式偷看。"],
  ["019.漫谈“大姑娘洗澡心理”.txt", 23, 23, "我宁愿再送一次礼。", "幽默短语", "李敖", "对重新结婚日期的玩笑式祝贺。"],
  ["019.漫谈“大姑娘洗澡心理”.txt", 25, 25, "自打手心十下", "俗语化短语", "李敖", "以打手心表示自罚。"],
  ["019.漫谈“大姑娘洗澡心理”.txt", 25, 25, "毋忘在莒", "古语引用", "历史典故", "表示不忘旧困与复兴之志。"],
  ["019.漫谈“大姑娘洗澡心理”.txt", 25, 25, "毋忘举债", "改写短语", "李敖", "把毋忘在莒改为举债的自嘲。"],
  ["020.致小金.txt", 5, 5, "饱更忧患", "成语化短语", "李敖", "经历忧患甚多。"],
  ["020.致小金.txt", 7, 7, "“拟似演绎”（pseudo-deductive）", "逻辑短语", "李敖", "批评貌似演绎的错误方法。"],
  ["020.致小金.txt", 13, 13, "学而不化", "成语化短语", "李敖", "学了却不能化为真正理解。"],
  ["020.致小金.txt", 23, 23, "在文章中，给某一些字眼下定义，往往是很必要的。", "写作格言", "刘福增引文", "指出文章中界定关键字眼的必要。"],
  ["020.致小金.txt", 25, 25, "在一个辩论中，一个人有意无意把对方的说话或论点加以曲解，然后把曲解了的话当做对方的话加以攻击，这个人便犯了稻草人的谬误。", "逻辑格言", "刘福增引文", "定义稻草人谬误。"],
  ["020.致小金.txt", 25, 25, "当我们错解、曲解或断章取义别人的意见，而攻击别人时，我们便犯了这个谬误。", "逻辑格言", "刘福增引文", "补充说明稻草人谬误。"],
  ["020.致小金.txt", 27, 27, "“稻草人的谬误”（the fallacy of straw man）", "逻辑术语", "逻辑学", "指出曲解对方再攻击的谬误。"],
  ["020.致小金.txt", 29, 29, "正确的描述", "逻辑短语", "李敖", "强调描述须保持正确性。"],
  ["020.致小金.txt", 39, 39, "这一阵子的丢人现眼，证明了刘福增非但“整体的学问”不足，甚至“本行的学问”也捉襟见肘了。", "治学评语", "李敖", "批评整体学问与本行学问都不足。"],
  ["020.致小金.txt", 41, 41, "太岁头上动土", "俗语", "俗语", "比喻冒犯厉害人物。"],
  ["020.致小金.txt", 43, 43, "江水有灵将惊知己于千古", "古文引用", "郦道元《水经注》", "写江水若有灵，将惊动千古知己。"],
  ["020.致小金.txt", 43, 43, "夜深黠鼠忽登床", "古诗引用", "王阳明诗", "写夜深狡鼠登床的荒寒情景。"],
  ["021.论两面人.txt", 5, 5, "不为五斗米折腰", "古语引用", "陶渊明典故", "不为小利屈身。"],
  ["021.论两面人.txt", 5, 5, "渴不饮盗泉水", "古语引用", "古语", "宁渴也不饮不义之水。"],
  ["021.论两面人.txt", 13, 13, "我们要论定一个人是两面人，一定要就某一段时间中，他时而做一面的人，时而做另一面的人。", "处世格言", "刘福增引文", "以同一时段的反复来判断两面人。"],
  ["021.论两面人.txt", 15, 15, "是不是两面人，要看事实，不是咬文嚼字。", "处世格言", "李敖", "判断人格要看事实而非玩弄词义。"],
  ["021.论两面人.txt", 17, 17, "左右逢源的蝙蝠性格", "讽刺短语", "李敖", "以蝙蝠比喻两面讨好的性格。"],
  ["021.论两面人.txt", 25, 25, "乡愿，德之贼也。", "古语引用", "孔子", "乡愿是德行的贼害。"],
  ["021.论两面人.txt", 25, 25, "“不能假装对颜色不偏不倚”（I cannot pretend to feel impartial about colors）", "西方引语", "丘吉尔", "用不能对颜色不偏不倚表达价值立场。"],
  ["021.论两面人.txt", 31, 31, "八面玲珑的人可以到处受到欢迎，那么真正正直、有勇气的人便被孤立，便被认为是偏激分子。", "处世格言", "邓维桢引文", "指出圆滑者受欢迎而正直者易被孤立。"],
  ["021.论两面人.txt", 55, 55, "儒林内史", "书名化短语", "李敖", "以儒林内史戏称文人圈众生相。"],
  ["021.论两面人.txt", 59, 59, "言犹在耳", "成语", "成语", "说过的话还像在耳边。"],
  ["022.论红色变节者.txt", 7, 7, "大丈夫敢作敢当，凡是下笔的，就不怕人发表。", "书信格言", "李敖", "敢写就不怕公开。"],
  ["022.论红色变节者.txt", 7, 7, "庸德之行，庸言之谨", "古语引用", "《中庸》", "平常德行要实践，平常言语要谨慎。"],
  ["022.论红色变节者.txt", 7, 7, "第一等人写下来的东西，又何在乎被人发表或自己发表呢？", "书信格言", "李敖", "第一等人的文字不怕公开。"],
  ["022.论红色变节者.txt", 9, 9, "借刀杀人之计", "成语化短语", "李敖", "借他人之手害人的计谋。"],
  ["022.论红色变节者.txt", 21, 21, "此马来头大", "俗语化短语", "李敖", "调侃某人背景深厚。"],
  ["022.论红色变节者.txt", 23, 23, "害之反足以成之", "古语化短语", "李敖", "伤害反倒成全对方。"],
  ["022.论红色变节者.txt", 35, 35, "才气纵横，下笔千言", "人物评语", "来信引语", "称赞才气充沛、下笔成文。"],
  ["022.论红色变节者.txt", 35, 35, "第一把能手", "人物评语", "来信引语", "称赞为此时此地的第一能手。"],
  ["022.论红色变节者.txt", 35, 35, "只有你能为此时此地留点传世的东西，千万保重爱惜", "劝勉语", "来信引语", "劝李敖保重并完成传世之作。"],
  ["022.论红色变节者.txt", 41, 41, "坐不更名，立不改姓", "俗语", "俗语", "形容行事坦荡、不隐姓改名。"],
];

const entries = rawEntries.map((entry, index) => {
  const [file, lineStart, lineEnd, quote, category, origin, summary, notes = ""] = entry;
  return {
    id: `LASHJJ-${String(index + 1).padStart(4, "0")}`,
    book: bookName,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: compact(quote),
    category,
    source_or_origin: origin,
    summary,
    notes,
  };
});

const proofreadRemoved = [
  { id: "LASHJJ-0024", reason: "现代政治人物评语，偏公开信起手铺陈，不作为诗文格言保留。" },
  { id: "LASHJJ-0030", reason: "法律攻防中的短碎讽刺标签，独立诗文格言价值不足。" },
  { id: "LASHJJ-0031", reason: "司法案情攻防中的短碎讽刺语，校对轮删除。" },
  { id: "LASHJJ-0057", reason: "古文句被直接用于现代党派人物讽刺，按政治相关语境删除。" },
  { id: "LASHJJ-0059", reason: "直接指向国民党中山楼场景的政治讽刺语，删除。" },
  { id: "LASHJJ-0062", reason: "党外基金与陈文成语境中的短句，偏现代公共议题，删除。" },
  { id: "LASHJJ-0063", reason: "虽为历史典故，但在党外财务与政治语境中使用，校对轮删除。" },
  { id: "LASHJJ-0064", reason: "依附党外财务语境的改写短语，独立检索价值不足。" },
  { id: "LASHJJ-0065", reason: "言论自由与军方改版语境中的短碎成语化标签，删除。" },
  { id: "LASHJJ-0072", reason: "只是历史表述争辩中的短标签，非独立诗文格言。" },
  { id: "LASHJJ-0073", reason: "针对现代人物的贴身攻击性评语，并牵连政治与逻辑论争，删除。" },
  { id: "LASHJJ-0081", reason: "直接服务国民党/党外两面人批评的政治讽刺短语，删除。" },
  { id: "LASHJJ-0082", reason: "《论语》句被用于现代党派人物与乡愿风批判，按政治语境删除。" },
  { id: "LASHJJ-0083", reason: "丘吉尔颜色引语嵌在党派人物批判链条中，按政治语境删除。" },
  { id: "LASHJJ-0084", reason: "邓维桢引文谈人民权力与政治拉拢，属于现代政治语录。" },
  { id: "LASHJJ-0090", reason: "警总、叛逆分子与政治迫害叙事中的成语化短语，删除。" },
  { id: "LASHJJ-0091", reason: "政治人物背景评断中的短标签，独立诗文格言价值不足。" },
  { id: "LASHJJ-0092", reason: "查禁、官方封杀语境中的政治攻防短句，删除。" },
  { id: "LASHJJ-0094", reason: "匿名来信中的短碎人物标签，且原文贴近政治遇害警告，删除。" },
  { id: "LASHJJ-0095", reason: "匿名来信中含陈文成政治遇害语境的劝勉句，删除。" },
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
    lines.forEach((line, index) => {
      const text = line.trim();
      if (!text) return;
      const quoteSignal = quotePattern.test(text);
      const attributionSignal = attributionPattern.test(text);
      if (!quoteSignal && !attributionSignal) return;
      const item = {
        file: file.name,
        line: index + 1,
        text,
        risk: politicalPattern.test(text),
        quoteSignal,
        attributionSignal,
      };
      candidates.push(item);
      if (attributionSignal) attributed.push(item);
    });
  }

  return { candidates, attributed };
}

function validateEntries(rows, sourceFiles) {
  const fileMap = new Map(sourceFiles.map((file) => [file.name, file]));
  const errors = [];
  const seenIds = new Set();

  for (const row of rows) {
    if (seenIds.has(row.id)) errors.push(`Duplicate id: ${row.id}`);
    seenIds.add(row.id);

    const file = fileMap.get(row.source_file);
    if (!file) {
      errors.push(`${row.id}: missing source file ${row.source_file}`);
      continue;
    }

    const lines = file.text.replace(/\r/g, "").split("\n");
    const slice = lines.slice(row.line_start - 1, row.line_end).join("\n");
    if (!normalizeForMatch(slice).includes(normalizeForMatch(row.quote_text))) {
      errors.push(`${row.id}: quote not found at ${row.source_file}:${row.line_start}-${row.line_end}`);
    }
  }

  return errors;
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
  const lines = [headers.join(","), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(","))];
  fs.writeFileSync(outputCsv, `${lines.join("\n")}\n`, "utf8");
}

function writeTxt(rows) {
  const lines = [`${bookName} 诗文格言歌谣引用`, `生成日期：${generatedDate}`, `条目数：${rows.length}`, ""];
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
  const tsv = (items) =>
    `${headers.join("\t")}\n${items.map((item) => headers.map((key) => tsvEscape(item[key])).join("\t")).join("\n")}\n`;
  fs.writeFileSync(reviewPath, tsv(candidates), "utf8");
  fs.writeFileSync(attributedPath, tsv(attributed), "utf8");
}

function writeAudit(rows, candidates, sourceFiles, errors, removedRows = []) {
  const stats = new Map(sourceFiles.map((file) => [file.name, { rows: 0, candidates: 0, riskCandidates: 0 }]));
  for (const row of rows) {
    const stat = stats.get(row.source_file);
    if (stat) stat.rows += 1;
  }
  for (const item of candidates) {
    const stat = stats.get(item.file);
    if (!stat) continue;
    stat.candidates += 1;
    if (item.risk) stat.riskCandidates += 1;
  }
  const auditRows = [
    ["file", "rows", "candidate_lines", "risk_candidate_lines"].join("\t"),
    ...[...stats.entries()].map(([file, stat]) => [file, stat.rows, stat.candidates, stat.riskCandidates].join("\t")),
    "",
    ["validation_errors", errors.length].join("\t"),
    ...errors.map((error) => ["error", error].join("\t")),
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
  lines.push("- 保留：古语成语、文学化抒情句、逻辑/写作/人生格言、幽默性私人书信短句。");
  lines.push("- 剔除：公开控诉、公司与法律案情、现代党派人物攻防、监所与时事评论整句。");
  lines.push("- 对高风险章节只截取能脱离语境独立检索的诗文格言。");
  lines.push("");
  lines.push("分类统计");
  for (const [category, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))) {
    lines.push(`- ${category}: ${count}`);
  }
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
  riskRows.forEach((row) => lines.push(`  - ${row.id}: ${row.quote_text}`));
  lines.push("");
  lines.push("校验");
  lines.push(`- 源文定位错误：${errors.length}`);
  errors.forEach((error) => lines.push(`  - ${error}`));
  lines.push("");
  lines.push("输出");
  lines.push(`- CSV：exports/${bookName}_诗文格言歌谣引用.csv`);
  lines.push(`- TXT：exports/${bookName}_诗文格言歌谣引用.txt`);
  lines.push(`- 审计：analysis/liao_shujianji_initial_audit.tsv`);
  lines.push(`- 校对报告：analysis/liao_shujianji_proofread_report.txt`);
  lines.push(`- 校对审计：analysis/liao_shujianji_proofread_audit.tsv`);
  lines.push(`- 候选：analysis/liao_shujianji_quote_candidates.json`);

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

  if (errors.length) process.exitCode = 1;
}

main();
