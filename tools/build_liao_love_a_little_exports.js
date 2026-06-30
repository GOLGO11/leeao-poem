const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const ROOT = path.resolve(__dirname, "..");
const BOOK = "只爱一点点";
const SOURCE_DIR = path.join(
  ROOT,
  "《大李敖全集6.0》分章节",
  "016.李敖祸台五十年庆祝十书",
  `007.${BOOK}`,
);
const OUT_CSV = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.csv`);
const OUT_TXT = path.join(ROOT, "exports", `${BOOK}_诗文格言歌谣引用.txt`);
const OUT_JSON = path.join(ROOT, "analysis", "liao_love_a_little_selected_rows.json");
const REPORT_JSON = path.join(ROOT, "analysis", "liao_love_a_little_proofread_build_report.json");
const REJECTS_JSON = path.join(ROOT, "analysis", "liao_love_a_little_proofread_rejects.json");
const QUOTE_LINES_TSV = path.join(ROOT, "analysis", "liao_love_a_little_quote_lines.tsv");
const QUOTED_PHRASES_TSV = path.join(ROOT, "analysis", "liao_love_a_little_quoted_phrases.tsv");
const ID_PREFIX = "LITTLE";
const decoder = new TextDecoder("gb18030");

const POLITICAL_PATTERN =
  /(国家|中国|台湾|中华|台独|统一|民主|自由|政府|政权|政治|政党|国民党|民进党|共产党|共匪|选举|候选|总统|宪法|革命|主义|意识形态|行政院|立法院|国会|党国|人权|司法|法院|中共|大陆|祖国|爱国|反攻|政治犯|帝国主义|军中乐园)/u;

function normalizeText(value) {
  return String(value || "")
    .replace(/[\uFEFF\r]/g, "")
    .replace(/[“”‘’「」『』]/g, "")
    .replace(/\s+/g, "");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function readText(filePath) {
  return decoder.decode(fs.readFileSync(filePath)).replace(/^\uFEFF/, "");
}

function sourceFiles() {
  return fs
    .readdirSync(SOURCE_DIR)
    .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function fileByPrefix(prefix) {
  const file = sourceFiles().find((name) => name.startsWith(prefix));
  if (!file) throw new Error(`Missing source file for prefix ${prefix}`);
  return file;
}

function locate(row) {
  const file = row.filePrefix === "preface"
    ? sourceFiles().find((name) => name.includes("题辞"))
    : fileByPrefix(row.filePrefix);
  if (!file) throw new Error(`Missing source file for prefix ${row.filePrefix}`);
  const filePath = path.join(SOURCE_DIR, file);
  const text = readText(filePath);
  const lines = text.split(/\n/);
  const needle = normalizeText(row.locate_text || row.quote_text);
  let best = null;

  for (let index = 0; index < lines.length; index += 1) {
    const normalizedLine = normalizeText(lines[index]);
    if (normalizedLine.includes(needle)) {
      best = { line_start: index + 1, line_end: index + 1, context: lines[index].trim() };
      break;
    }
  }

  if (!best) {
    let windowMatch = null;
    for (let start = 0; start < lines.length; start += 1) {
      let combined = "";
      for (let end = start; end < Math.min(lines.length, start + 60); end += 1) {
        combined += lines[end];
        if (normalizeText(combined).includes(needle)) {
          const candidate = {
            line_start: start + 1,
            line_end: end + 1,
            context: lines.slice(start, end + 1).map((line) => line.trim()).filter(Boolean).join(" "),
          };
          if (!windowMatch || (candidate.line_end - candidate.line_start) < (windowMatch.line_end - windowMatch.line_start)) {
            windowMatch = candidate;
          }
          break;
        }
      }
    }
    best = windowMatch;
  }

  if (!best) {
    throw new Error(`Unable to locate quote in ${file}: ${row.quote_text}`);
  }

  return { file, ...best };
}

function row(filePrefix, quote_text, source_attribution, category, notes = "", locate_text = quote_text) {
  return { filePrefix, quote_text, source_attribution, category, notes, locate_text };
}

const rows = [
  row("001", "太上忘情，最下不及于情，情之所钟，正在我辈。", "古人语", "古典情论"),
  row("001", "爱情的代价是痛苦，\n爱情的方法是忍受痛苦。", "中国哲人扇面", "爱情格言"),
  row("001", "啊！“爱情”！他们大大的误解了你！\n他们说你的甜蜜是痛苦，\n当你丰富的果实\n比任何果实都甜蜜。", "外国诗人", "外国爱情诗译句"),
  row("001", "Oh! Love! They wrong thee much!\nThat say thy sweet is bitter,\nWhen thy rich fruit is such\nAs nothing can be sweeter.", "外国诗人", "外国爱情诗原文"),
  row("001", "且喜无情成解脱", "旧语", "古典情语"),
  row("001", "得固欣然，失亦可喜", "李敖论爱情", "爱情格言"),
  row("001", "不爱那么多，\n只爱一点点。\n别人的爱情像海深，\n我的爱情浅。\n不爱那么多，\n只爱一点点。\n别人的爱情像天长，\n我的爱情短。\n不爱那么多，\n只爱一点点。\n别人眉来又眼去，\n我只偷看你一眼。", "李敖《只爱一点点》", "李敖诗"),
  row("001", "智者乐水", "古人语", "古典格言"),
  row("002", "三月换一把，爱情如牙刷，但寻风头草，不觅解语花。", "李敖旧诗", "李敖诗句"),
  row("002", "花开可要欣赏，\n然后就去远行。\n唯有不等花谢，\n才能记得花红。\n有酒可要满饮，\n然后就去远行。\n唯有不等大醉，\n才能觉得微酲。\n有情可要恋爱，\n然后就去远行。\n唯有恋得短暂，\n才能爱得永恒。", "李敖《然后就去远行》", "李敖诗"),
  row("002", "唯有恋得短暂，才能爱得永恒。", "李敖《然后就去远行》", "爱情格言", "", "唯有恋得短暂，\n才能爱得永恒。"),
  row("003", "窈兮冥兮，其中有精，其精甚真", "《老子》", "古典哲学名句"),
  row("003", "守而勿失，是谓反其真", "《庄子》", "古典哲学名句"),
  row("003", "因形移易者，谓之化、谓之幻。……知幻化之不异生死也，始可与学幻矣！", "《列子》", "古典哲学名句"),
  row("003", "清歌雅舞，暂同于梦寐；广厦高堂，俄成于幻化。", "梁简文帝《七召》", "古典文学名句"),
  row("003", "勿谓虚幻，故说为实，理非妄倒，故名真如。", "《成唯识论》", "佛学引文"),
  row("003", "看不见的都是真，看得见的都是妄。", "李敖论真幻", "哲学格言"),
  row("003", "人说幻是幻，我说幻是真。\n若幻原是假，真应与幻分。\n但真不分幻，幻是真之根。\n真里失其幻，岂能现肉身？\n肉身如不现，何来两相亲？\n真若不是幻，也不成其真。\n真幻原一体，絮果即兰因。", "李敖《真与幻》", "李敖诗"),
  row("003", "我思想，所以我存在", "西方哲学名句", "西方哲学格言"),
  row("003", "假作真时真亦假，无为有处有还无。", "《红楼梦》", "古典文学名句"),
  row("004", "当我想看一本书，我就自己写它一本。", "狄士累利", "西方人物格言"),
  row("004", "When I want to read a book I write one.", "Benjamin Disraeli", "西方人物格言原文"),
  row("004", "人生短得不够扯鸡毛蒜皮。", "狄士累利", "西方人物格言"),
  row("004", "Life is too short to be little.", "Benjamin Disraeli", "西方人物格言原文"),
  row("004", "如果再来一次，他会为爱情同我结婚。", "爱雯丝", "爱情格言"),
  row("004", "But if he had the chance again he would marry me for love.", "Mary Anne Evans", "爱情格言原文"),
  row("005", "纸上罗曼斯", "萧伯纳", "爱情文学短语"),
  row("005", "可爱的废话。", "李敖论情书", "情书格言"),
  row("005", "不打话", "李敖论霸王与公鸭", "俗语短语"),
  row("005", "硬上弓", "李敖论霸王与公鸭", "俗语短语"),
  row("005", "时光是一位和蔼的朋友，\n它会使你我变成老年。", "女诗人", "外国诗句译文"),
  row("005", "真正的恋爱时节", "歌德", "外国文学短语"),
  row("005", "好像一个Gordian Knot，\n割是割断了，\n但是痛苦的。", "李敖情书", "李敖诗文"),
  row("005", "千言万语从何说起？只愿你快乐、健康的，永远的。", "李敖情书", "情书格言"),
  row("005", "你是我唯一眷恋的小女人，但是这种眷恋却是一条溪水，没有浪花，只有长远的怀念与余韵！", "李敖情书", "情书格言"),
  row("006", "理论是另一回事，可不要伤害女孩子。", "聂华苓信语", "爱情劝语"),
  row("007", "今日诸君得无效刘玉川乎！", "《宋稗类钞》", "古典轶事语"),
  row("008", "彼有酒器", "简雍故事", "古典轶事语"),
  row("008", "彼有淫具", "简雍故事", "古典轶事语"),
  row("008", "饮食、男女，人之大欲存焉。", "《礼记》", "古典名句"),
  row("008", "吾未见好德如好色者也！", "孔子语", "古典名句"),
  row("008", "夫妇之乐，有甚于画眉者！", "张敞", "古典轶事语"),
  row("008", "昨夜与老妻敦伦一次", "李塨日记", "古人日记语"),
  row("008", "淫者见之以为淫", "古话", "俗语"),
  row("008", "眼中有色，心中无色。", "佛家语", "佛学格言"),
  row("009", "有的。站开一点，别挡了我的阳光。", "狄阿杰尼斯", "西方哲人轶事"),
  row("009", "如果我不是亚历山大，我愿我是狄阿杰尼斯。", "亚历山大", "西方人物轶事"),
  row("009", "如果我不是拿破仑，我愿我是亚历山大。", "拿破仑", "西方人物轶事"),
  row("010", "妇人之言，即使你做一千回的定性分析，内容也不外这两种元素：一种是废话；一种是坏话。", "李敖《杂谈女人》", "李敖格言"),
  row("010", "我佩服那些能够在表面上恭听女人花言巧语，但是在他心里却丝毫不为所动的男士们。", "李敖《杂谈女人》", "李敖格言"),
  row("010", "我的名誉被两种人所破坏：一种是邮政总监；一种是情敌。", "李敖《杂谈女人》", "李敖格言"),
  row("010", "女人不单是属于女性或阴性，停经期过后，她是半阴半阳的东西，是一种“雌雄同体”。", "李敖《杂谈女人》", "李敖格言"),
  row("010", "女人停经期能变成中性，男人中性却只变成“人妖”。", "李敖《杂谈女人》", "李敖格言"),
  row("010", "女人永远把“感觉”当做“证据”，因为她从来没研究过什么是“证据”。", "李敖《杂谈女人》", "李敖格言"),
  row("010", "女人一见面，就互相夸对方漂亮，如果实在连千分之一的漂亮可能性都没有，那么她就改夸对方的大衣；如果大衣实在又丑得可以，那么她就庆幸对方买得很划算：——“你真会买东西！在哪里买的？我也去买一件！”", "李敖《杂谈女人》", "李敖格言"),
  row("010", "女人相信女人的，只有一句话，可惜这句话又是谎话，这句谎话是：“你好漂亮啊！”", "李敖《杂谈女人》", "李敖格言"),
  row("010", "我看不出女人眼泪与自来水的分别。", "李敖《杂谈女人》", "李敖格言"),
  row("010", "你只能看，不能摸了！", "李敖《杂谈女人》", "婚恋谐语"),
  row("010", "天主教禁止离婚，为了他们深知“货物出门，概不退换”的好处！", "李敖《杂谈女人》", "婚恋谐语"),
  row("010", "女人与警察中的坏的是一类动物：神经过敏、喜怒无常、欺善怕恶、每月红包（月经？）……", "李敖《杂谈女人》", "李敖格言"),
  row("010", "女人只有两种：一种是爱光屁股的，一种是不爱光屁股的。", "李敖《杂谈女人》", "李敖格言"),
  row("010", "熨斗是女人最划得来的朋友，它的用处随着年纪成正比增加。", "李敖《杂谈女人》", "李敖格言"),
  row("010", "女人重衣饰，百分之十是为了吸引男人，百分之九十是为了跟别的女人争奇斗艳。", "李敖《杂谈女人》", "李敖格言"),
  row("010", "女人最后的衣饰品，实在该是一根人人挂在胸前的用过的火柴。", "李敖《杂谈女人》", "李敖格言"),
  row("011", "你们看，我赢了！我的最大。", "《比大小》笑话", "笑话语录"),
  row("011", "我的比你的大。", "驴笑话", "笑话语录"),
  row("011", "三个女人没好话，三个男人比屌大。", "俗话", "俗语"),
  row("012", "盲人骑瞎马，夜半临深池", "古典成语", "古典警语"),
  row("014", "古人守身如玉；胡茵梦守玉如身。", "李敖论胡茵梦", "李敖谐语"),
  row("014", "做新女性就该经济独立，不能花男人的钱。一边花男人的钱，一边做新女性、以新女性自豪，是矛盾的、是可耻的。", "胡茵梦", "女性独立语"),
  row("014", "绿草如茵，人生如梦。", "李敖谐语", "文学谐语"),
  row("014", "婚姻如梦，不亦宜乎？", "孟绝子", "文学谐语"),
  row("015", "上帝给你一张脸，你自己另造一张。", "十七世纪西方语", "西方格言"),
  row("015", "God has given you one face, and you make yourselves another.", "西方格言原文", "西方格言原文"),
  row("015", "我们要照我们的形象、按我们的样式造人。", "《创世纪》", "圣经引文"),
  row("016", "我赞成为真理而牺牲任何人，但必须所执著的是真理。", "李敖证词", "李敖格言"),
  row("016", "毁掉我一个人算了！少毁一个吧！", "李敖证词", "李敖语录"),
  row("016", "清者自清、浊者自浊", "传统成语", "传统格言"),
  row("018", "你不能用事实证明你说话算话，再说好听的，也没有用了！", "李敖书信", "李敖格言"),
  row("019", "我是个处女，可是对它并不‘执迷’。", "《骑士》杂志漫画", "外国漫画台词"),
  row("019", "I'm a virgin, but I'm not fanatic about it.", "Cavalier漫画", "外国漫画台词原文"),
  row("019", "坦白说，我才不是无聊地为了做处女才是处女，只是因为基督徒的信仰，让我更珍惜、更尊重自己的身体。", "寇乃馨", "人物语录"),
  row("019", "欲望的满足会降低爱情的强度", "寇乃馨信念", "爱情格言"),
  row("019", "爱她，就是为她憋着", "寇乃馨信念", "爱情格言"),
  row("019", "没有肉，哪有灵？没有欲，哪有情？", "李敖论灵肉", "李敖格言"),
  row("021", "以貌取人，失之子羽", "古典成语", "古典警语"),
  row("022", "人们和他见面，如果对他的“丑腿”比对他的“美腿”更为注意，他就不交这种朋友了。反过来说，这种朋友才可交。", "富兰克林《美腿与丑腿》", "西方寓言格言"),
  row("022", "在真伪上面，要去假存真；在善恶上面，要扬善抑恶", "李敖论真善", "哲学格言"),
  row("023", "丝袜引人大动、情嗜随之", "约翰逊", "西方文学引文"),
  row("023", "The silk stockings and white bosoms of actresses excite my amorous propensities.", "Samuel Johnson", "西方文学引文原文"),
  row("023", "深情哪比旧时浓", "旧句", "文学短语"),
  row("024", "上帝岂是真不许你们喫园中所有树上的果子么？", "《创世纪》", "圣经引文"),
  row("024", "你们不一定死，因为上帝知道，你们吃的日子眼睛就明亮了，你们便如上帝能知道善恶。", "《创世纪》", "圣经引文"),
  row("024", "你本是尘土，仍要归于尘土。", "《创世纪》", "圣经引文"),
  row("024", "耶和华上帝为亚当和他妻子用皮子作衣服给他们穿。", "《创世纪》", "圣经引文"),
  row("024", "人类众恶天性的标记", "海莱《圣经手册》", "宗教评论语"),
  row("024", "所造的生物中，只有人类，才穿着衣服", "海莱《圣经手册》", "宗教评论语"),
  row("024", "以天地为衣服", "刘伶典故", "古典典故"),
  row("025", "“沧浪之水清”的时候，他们要“濯我缨”（洗帽子）；“沧浪之水浊”的时候，他们却要“濯我足”（洗脚）", "《孺子歌》", "古典歌谣"),
  row("026", "且作神仙舞，愿为流俗惊，曲终人又见，江上一峯青。", "李敖题诗", "李敖诗"),
  row("030", "《诗经》有“与子偕行”、“与子偕作”、“与子偕臧”、“与子偕老”的话", "《诗经》", "古典诗句"),
  row("030", "我的官职比前更大了。", "《笑林广记》笑话", "古典笑话语"),
  row("030", "官大，不知此物亦大否？", "《笑林广记》笑话", "古典笑话语"),
  row("030", "难道老爷升了官职，奶奶还是照旧不成？少不得我的大，你的也大。", "《笑林广记》笑话", "古典笑话语"),
  row("030", "绕岸车鸣水欲干，鱼儿相逐尚相欢。无人挈入沧江去，汝死哪知世界宽。", "王安石《鱼儿》", "古典诗"),
  row("031", "不避俗字俗语", "胡适文学革命八不", "现代文学主张"),
  row("032", "有鳏在下", "孔子语", "古典引文"),
  row("032", "非法出精", "佛说", "佛学术语"),
  row("032", "一而已矣，岂可再乎？", "古语", "古典引文"),
  row("032", "老大惹祸，老二遭殃", "李敖自嘲语", "李敖谐语"),
  row("032", "大头惹祸，小头遭殃", "李敖自嘲语", "李敖谐语"),
  row("032", "老二惹祸，老大遭殃", "李敖自嘲语", "李敖谐语"),
  row("033", "采葑采菲，无以下体", "《诗经》", "古典诗句"),
  row("034", "我做了这么大的官，竟赶不上一根鸡巴！", "古笑话", "笑话语录"),
  row("034", "谁知北海吞毡日，不爱江山爱美人。", "旧诗句", "古典诗句"),
  row("034", "冲冠一怒为红颜", "吴三桂典故", "古典成语"),
  row("034", "赤身露体骂奸曹", "祢衡典故", "古典典故"),
  row("036", "光屁股坐凳子——有板有眼", "歇后语", "俗语"),
  row("036", "金玉其中，虽败絮其外，又何伤哉？", "李敖化用", "文学谐语"),
  row("038", "好汉做事好汉当", "俗语", "俗语"),
  row("038", "谁不爱自己的父母妻子呢？可是他们都因为我谋刺而活不成了！我若说是赵王张敖首谋，我的父母妻子都可以减罪。我爱我父母妻子当然胜过爱赵王，可是我不能为了自私的缘故而诬攀好人，我要好汉做事好汉当。", "贯高故事", "历史人物语"),
  row("039", "仗义多在屠狗之辈", "古人语", "古典格言"),
  row("044", "酒色财气，不碍菩提路", "禅宗语", "佛门格言"),
  row("044", "直指本心", "禅宗语", "佛门格言"),
  row("044", "非礼勿视、非礼勿听", "儒家语", "古典格言"),
  row("044", "割不正，不食！", "孔子语", "古典格言"),
  row("044", "一箪食、一瓢饮", "颜回典故", "古典短语"),
  row("044", "莫如半日静坐，半日读书", "朱子语", "古典读书语"),
  row("044", "圣贤的话并不值得轻信。", "李敖论娱乐", "李敖格言"),
  row("044", "人性之善也，犹水之就下也。", "孟子", "古典哲学名句"),
  row("044", "人性之‘恶’也，犹水之就下也。", "李敖反诘孟子", "哲学谐语"),
  row("044", "杨朱、墨翟之言盈天下。……杨氏为我，是无君也；墨氏兼爱，是无父也。无君无父，是禽兽也！", "孟子", "古典哲学引文"),
  row("044", "损一毫利天下，不与也", "杨朱思想", "古典哲学引文"),
  row("044", "悉天下奉一身，不取也", "杨朱思想", "古典哲学引文"),
  row("044", "人人不损一毫，人人不利天下，天下治矣！", "李敖释杨朱", "哲学格言"),
  row("044", "尊礼义以夸人，矫性情以招名", "杨朱思想", "古典哲学引文"),
  row("044", "忠不足以安君，适足以危身；义不足以利物，适足以害生", "杨朱思想", "古典哲学引文"),
  row("044", "太古之人，知生之暂来，知死之暂往，故从心而动，不违自然所好。当身之娱（娱乐），非所去也，故不为名所劝；从性而游，不逆万物所好。死后之名，非所取也，故不为刑所及。", "杨朱", "古典哲学引文"),
  row("044", "多有智慧，就多有愁烦；加增知识的，就加增忧伤。", "所罗门王", "圣经引文"),
  row("044", "我心里说：来吧，我以喜乐试试你，你好享福。谁知，这也是虚空。我指嬉笑说：这是狂妄；论喜乐说，有何功效呢？", "所罗门王", "圣经引文"),
  row("044", "我所以恨恶生命，因为在日光之下所行的事，我都以为烦恼，都是虚空、都是捕风。", "所罗门王", "圣经引文"),
  row("044", "智慧愈多，烦恼愈多", "李敖概括所罗门思想", "哲学短语"),
  row("044", "娱乐无用", "李敖概括所罗门思想", "哲学短语"),
  row("044", "人生乏味", "李敖概括所罗门思想", "哲学短语"),
  row("044", "“烦恼愈多”的原因乃在于智慧的不足与不真，并不在于智慧之多", "李敖论智慧与烦恼", "哲学格言"),
  row("044", "一只断了尾巴的壁虎，都会赶紧设法长出另外一条尾巴，并不以断了尾巴自傲。", "李敖论不乐", "李敖格言"),
  row("044", "目中有色，心中无色", "佛教语", "佛学格言"),
  row("044", "……灵之对肉，并不多于肉之对灵。", "勃朗宁", "外国诗句译文"),
  row("044", "……Nor soul helps flesh more, now than flesh helps soul.", "Robert Browning", "外国诗句原文"),
  row("044", "肉乃是“愉快”（pleasant）的象征，是可以给灵来做漂亮的“玫瑰网眼”（rose-mesh）的", "勃朗宁论灵肉", "外国诗论"),
  row("044", "他的灵魂，就在他的手上。", "李敖论灵肉", "李敖格言"),
  row("044", "心凝形释", "《列子》", "古典哲学短语"),
  row("044", "教君恣意怜", "旧艺诗语", "古典诗句"),
  row("044", "世风日下，人心不古，人身亦不古", "李敖论灵肉", "李敖谐语"),
  row("044", "为寻欢献身，又何足怪？", "李敖论寻乐", "李敖格言"),
];

const REJECTS = new Map([
  ["纸上罗曼斯", "文学术语短语，单列引用价值弱。"],
  ["不打话", "短碎片，依赖霸王/公鸭上下文。"],
  ["硬上弓", "普通俗语且与前书已排除同类，校对轮不单列。"],
  ["真正的恋爱时节", "文学片语过短，离开歌德语境后引用价值弱。"],
  ["彼有酒器", "简雍故事中的设置短句，单列价值弱。"],
  ["彼有淫具", "简雍故事中的笑话包袱，单列价值弱。"],
  ["你们看，我赢了！我的最大。", "黄色笑话包袱，非诗文格言。"],
  ["我的比你的大。", "黄色笑话包袱，非诗文格言。"],
  ["毁掉我一个人算了！少毁一个吧！", "私人司法证词中的即时表态，非稳定诗文格言。"],
  ["我的官职比前更大了。", "古笑话设置短句，单列价值弱。"],
  ["官大，不知此物亦大否？", "古笑话设置短句，单列价值弱。"],
  ["难道老爷升了官职，奶奶还是照旧不成？少不得我的大，你的也大。", "古笑话包袱，黄色语境较强，校对轮不单列。"],
  ["有鳏在下", "短碎片，且处于政治犯坐牢自嘲语境中。"],
  ["非法出精", "佛教术语碎片，且处于政治犯坐牢自嘲语境中。"],
  ["老大惹祸，老二遭殃", "政治犯坐牢自嘲语，语境依赖强。"],
  ["大头惹祸，小头遭殃", "政治犯坐牢自嘲语，语境依赖强。"],
  ["老二惹祸，老大遭殃", "政治犯坐牢自嘲语，语境依赖强。"],
  ["我做了这么大的官，竟赶不上一根鸡巴！", "古笑话包袱，黄色语境较强，校对轮不单列。"],
  ["光屁股坐凳子——有板有眼", "普通歇后语，许晓丹政治/司法话题中出现，校对轮不单列。"],
  ["金玉其中，虽败絮其外，又何伤哉？", "临场化用句，依赖许晓丹政治/司法语境。"],
  ["智慧愈多，烦恼愈多", "已保留所罗门原文，此处是概括短语，重复且单列价值弱。"],
  ["娱乐无用", "已保留所罗门原文，此处是概括短语，重复且单列价值弱。"],
  ["人生乏味", "已保留所罗门原文，此处是概括短语，重复且单列价值弱。"],
]);

function buildQuoteAids() {
  const phraseRows = [["file", "line", "phrase", "context"]];
  const lineRows = [["file", "line", "text"]];
  const quotePattern = /[“‘]([^”’]{2,120})[”’]/g;
  const keywordPattern = /(说|所谓|古人|俗话|谚语|格言|名言|诗|词|曰|云|《|》|圣经|佛|禅|所罗门|杨朱|勃朗宁|富兰克林|狄士累利)/u;

  for (const file of sourceFiles()) {
    const lines = readText(path.join(SOURCE_DIR, file)).split(/\n/);
    lines.forEach((line, index) => {
      const text = line.trim();
      if (!text) return;
      if (/[“”‘’《》]/u.test(text) || keywordPattern.test(text)) {
        lineRows.push([file, index + 1, text]);
      }
      let match;
      quotePattern.lastIndex = 0;
      while ((match = quotePattern.exec(text))) {
        phraseRows.push([file, index + 1, match[1], text]);
      }
    });
  }

  fs.mkdirSync(path.dirname(QUOTE_LINES_TSV), { recursive: true });
  fs.writeFileSync(QUOTE_LINES_TSV, lineRows.map((items) => items.map((item) => String(item).replace(/\t/g, " ")).join("\t")).join("\n") + "\n", "utf8");
  fs.writeFileSync(QUOTED_PHRASES_TSV, phraseRows.map((items) => items.map((item) => String(item).replace(/\t/g, " ")).join("\t")).join("\n") + "\n", "utf8");
  return { quoteLines: lineRows.length - 1, quotedPhrases: phraseRows.length - 1 };
}

const aidStats = buildQuoteAids();

const seen = new Set();
const rejectedRows = rows
  .filter((item) => REJECTS.has(item.quote_text))
  .map((item) => ({
    quote_text: item.quote_text,
    reason: REJECTS.get(item.quote_text),
    filePrefix: item.filePrefix,
    category: item.category,
    source_attribution: item.source_attribution,
  }));
const selectedRows = rows.filter((item) => !REJECTS.has(item.quote_text));

const builtRows = selectedRows.map((item, index) => {
  if (seen.has(item.quote_text)) throw new Error(`Duplicate quote_text: ${item.quote_text}`);
  seen.add(item.quote_text);
  const located = locate(item);
  const politicalHit = POLITICAL_PATTERN.test(item.quote_text);
  return {
    id: `${ID_PREFIX}-${String(index + 1).padStart(3, "0")}`,
    book: BOOK,
    chapter: located.file.replace(/\.txt$/u, ""),
    source_file: path.relative(ROOT, path.join(SOURCE_DIR, located.file)).replace(/\\/g, "/"),
    line_start: located.line_start,
    line_end: located.line_end,
    quote_text: item.quote_text,
    category: item.category,
    source_or_origin: item.source_attribution,
    summary: located.context || item.quote_text,
    notes: item.notes || "",
    politicalQuoteTextHit: politicalHit,
  };
});

const politicalHits = builtRows.filter((item) => item.politicalQuoteTextHit);
if (politicalHits.length) {
  throw new Error(
    `Political keyword hits in quote_text:\n${politicalHits.map((item) => `${item.id}\t${item.quote_text}`).join("\n")}`,
  );
}

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

const csv = [
  headers.join(","),
  ...builtRows.map((item) => headers.map((header) => csvEscape(item[header])).join(",")),
].join("\n") + "\n";
fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });
fs.writeFileSync(OUT_CSV, csv, "utf8");

const txt = builtRows.map((item) => [
  `${item.id} ${item.quote_text}`,
  `出处：${item.source_or_origin}｜类别：${item.category}`,
  `位置：${item.chapter}:${item.line_start}${item.line_end !== item.line_start ? `-${item.line_end}` : ""}`,
  `语境：${item.summary}`,
  item.notes ? `备注：${item.notes}` : "",
].filter(Boolean).join("\n")).join("\n\n") + "\n";
fs.writeFileSync(OUT_TXT, txt, "utf8");

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(builtRows, null, 2), "utf8");
fs.writeFileSync(REJECTS_JSON, JSON.stringify(rejectedRows, null, 2), "utf8");

const report = {
  book: BOOK,
  sourceDir: path.relative(ROOT, SOURCE_DIR).replace(/\\/g, "/"),
  sourceFileCount: sourceFiles().length,
  rawRows: rows.length,
  removedRows: rejectedRows.length,
  rows: builtRows.length,
  firstId: builtRows[0]?.id || null,
  lastId: builtRows.at(-1)?.id || null,
  politicalQuoteTextHits: politicalHits,
  quoteAidStats: aidStats,
  outputCsv: path.relative(ROOT, OUT_CSV).replace(/\\/g, "/"),
  outputTxt: path.relative(ROOT, OUT_TXT).replace(/\\/g, "/"),
  outputJson: path.relative(ROOT, OUT_JSON).replace(/\\/g, "/"),
  rejectsJson: path.relative(ROOT, REJECTS_JSON).replace(/\\/g, "/"),
  quoteLinesTsv: path.relative(ROOT, QUOTE_LINES_TSV).replace(/\\/g, "/"),
  quotedPhrasesTsv: path.relative(ROOT, QUOTED_PHRASES_TSV).replace(/\\/g, "/"),
};
fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), "utf8");

console.log(JSON.stringify(report, null, 2));
