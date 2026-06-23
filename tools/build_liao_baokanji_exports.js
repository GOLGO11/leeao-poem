const fs = require("fs");
const path = require("path");

const generatedDate = "2026-06-21";
const book = "李敖报刊集";
const idPrefix = "LABKJ";
const sourceRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "007.采访序跋类",
  "001.李敖报刊集",
);
const outDir = path.join(process.cwd(), "exports");
const analysisDir = path.join(process.cwd(), "analysis");
const sourceDecoder = new TextDecoder("gb18030");

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

function chapterFromFile(file) {
  return file.replace(/\.txt$/, "").replace(/^\d+\./, "");
}

function row(sourceFile, lineStart, lineEnd, quoteText, category, sourceOrOrigin, summary, notes = "") {
  return {
    id: "",
    book,
    chapter: chapterFromFile(sourceFile),
    source_file: sourceFile,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: sourceOrOrigin,
    summary,
    notes,
  };
}

const data = [
  row(
    "001.李敖与“编辑室报告”.txt",
    9,
    9,
    "顺你自己的性，做你自己的人",
    "外国艺术格言",
    "邓肯相关格言，文中作译语引用",
    "以顺从自我本性、成为自己来概括艺术家反传统的生命姿态。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    25,
    25,
    "告朔饩羊",
    "论语典故成语",
    "《论语·八佾》“告朔之饩羊”典故",
    "用只存形式而失其实质的古典成语形容貌似怀念。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    65,
    65,
    "以天下与人易，为天下得人难。",
    "孟子名句",
    "《孟子·滕文公上》语",
    "以让天下给人容易、为天下求得人才困难说明知人善任之难。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    147,
    147,
    "有所不为，尔后可以有为",
    "孟子成句",
    "《孟子·离娄下》语",
    "以先能有所不做，才能有所作为概括狂狷之士的取舍。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    231,
    231,
    "附庸风雅",
    "传统成语",
    "传统成语",
    "形容缺乏真学问而装作文雅。",
    "只收成语本体，不收同段苏俄、政治与学术争论语境。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    231,
    231,
    "焚琴煮鹤",
    "传统成语",
    "传统成语",
    "比喻糟蹋美好而高雅的事物。",
    "只收成语本体，不收同段苏俄、政治与学术争论语境。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    235,
    235,
    "妇人之仁",
    "传统成语",
    "传统成语，常见于《史记·淮阴侯列传》等",
    "指出于浅近怜悯而缺乏通盘判断的仁慈。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    235,
    235,
    "大慈大悲",
    "佛教成语",
    "佛教语汇",
    "以广大慈悲概括对生死痛苦的体恤。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    275,
    275,
    "饮食男女，人之大欲存焉。",
    "礼记名句",
    "《礼记·礼运》语",
    "以饮食与男女之欲说明性欲为人的自然大欲。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    315,
    315,
    "盲人领瞎马",
    "世说新语典故变体",
    "《世说新语》“盲人骑瞎马，夜半临深池”变体",
    "以盲者带瞎马比喻缺乏方法训练后可能陷入危险。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    355,
    355,
    "什么叫国故？与我们现今的世界有什么相关？它不过是世界一种古董。",
    "现代文化格言",
    "吴稚晖《箴洋八股化之理学》引语",
    "以反问说明旧学若不能与当下世界相连，只会成为古董。",
  ),
  row(
    "001.李敖与“编辑室报告”.txt",
    393,
    393,
    "不辞其志，不辱其身",
    "论语成句变体",
    "疑《论语·微子》“不降其志，不辱其身”变体，原文作“不辞”",
    "以不放弃志向、不辱没自身概括严肃持守。",
    "校对补入：按原文“不辞”保留，作为《论语》成句变体处理。",
  ),
  row(
    "002.《文星杂志选集》导言.txt",
    15,
    15,
    "秋坟鬼唱",
    "唐诗典故",
    "李贺诗意典故，常见“秋坟鬼唱鲍家诗”",
    "以秋坟鬼唱写被掩埋后的幽冷不平。",
  ),
  row(
    "002.《文星杂志选集》导言.txt",
    21,
    21,
    "慎终追远",
    "论语成语",
    "《论语·学而》“慎终追远”",
    "以谨慎追念过往来形容保存旧刊选集的苦心。",
  ),
  row(
    "004.“只要寻一个不受人惑的人”.txt",
    13,
    13,
    "菩提达摩东来，只要寻一个不受人惑的人。",
    "禅宗语录",
    "禅宗和尚语，李敖转述",
    "以达摩东来寻找不受迷惑者，说明独立思想的旨趣。",
  ),
  row(
    "005.被封杀的《千秋评论》.txt",
    3,
    9,
    "自古功名亦苦辛，行藏终欲付何人？\n\n当时黯黯犹承误，末俗纷纷更乱真。\n\n糟粕所传非粹美，丹青难写是精神。\n\n区区岂尽高贤意，独守千秋纸上尘。",
    "王安石诗",
    "王安石《读史》",
    "以史传难尽人物精神、后世纷乱真伪写读史感慨。",
  ),
  row(
    "005.被封杀的《千秋评论》.txt",
    49,
    49,
    "自古以来，凡在哲学上和神学上之争论，十分之九都是名词之争。",
    "外国思想格言",
    "艾博特自传所记其父语",
    "以多数哲学和神学争论归结为名词之争。",
  ),
  row(
    "005.被封杀的《千秋评论》.txt",
    49,
    49,
    "剩下的那十分之一，其实也还是名词之争。",
    "外国思想格言",
    "艾博特承接其父语的评论",
    "进一步把余下争论也归为名词之争，带出对概念争执的讽刺。",
  ),
  row(
    "005.被封杀的《千秋评论》.txt",
    81,
    81,
    "有一分证据说一分话，有九分证据不能说十分话",
    "胡适方法论格言",
    "胡适语，秦怀冰文中转引",
    "以证据分量限制论断分量，强调著文立说的谨严。",
    "校对补入：只收方法论格言本体，不收同篇办刊争辩。",
  ),
  row(
    "005.被封杀的《千秋评论》.txt",
    87,
    87,
    "尽己之谓忠，推己及人之谓恕",
    "儒家忠恕释义",
    "《论语》忠恕传统释义，秦怀冰文中转引",
    "以尽己说明忠、以推己及人说明恕，概括儒家道德自反。",
    "校对补入：只收忠恕释义本体，不收附录中现代道德裁判争辩。",
  ),
  row(
    "005.被封杀的《千秋评论》.txt",
    87,
    87,
    "东圣西圣，心同理同",
    "中西会通格言",
    "如生语，秦怀冰文中转引",
    "以东西方圣贤在核心道理上相通来说明道德自反的共性。",
    "校对补入：只收会通格言本体，不收附录中现代道德裁判争辩。",
  ),
  row(
    "006.《万岁评论》缘起.txt",
    61,
    61,
    "预伏锦囊计",
    "三国典故",
    "诸葛亮锦囊妙计故事",
    "以预先留下锦囊计策比喻预作安排、届时启用。",
    "校对补入：只收典故本体，不收政治犯入狱和出版法语境。",
  ),
  row(
    "006.《万岁评论》缘起.txt",
    61,
    61,
    "拆开锦囊视之",
    "三国典故文句",
    "诸葛亮锦囊妙计故事",
    "以拆开锦囊查看计策写按预留方案行事。",
    "校对补入：只收典故文句，不收政治犯入狱和出版法语境。",
  ),
  row(
    "006.《万岁评论》缘起.txt",
    67,
    67,
    "以文会友",
    "论语成语",
    "《论语·颜渊》“君子以文会友”",
    "以文章聚合朋友，说明共同写作与互相呼应。",
  ),
  row(
    "006.《万岁评论》缘起.txt",
    67,
    67,
    "历观世人，多有不好欢乐，乃仰眠床上，看屋梁而著书，千秋万岁，谁传此者？",
    "古代文人语",
    "萧恭语，李敖转引",
    "以仰卧看梁著书而问谁能流传千秋万岁，写著述传世的自疑。",
  ),
  row(
    "006.《万岁评论》缘起.txt",
    67,
    67,
    "知其不可而为之",
    "论语成句",
    "《论语·宪问》“是知其不可而为之者与”",
    "以明知困难仍去做，概括理想主义者的坚持。",
  ),
  row(
    "006.《万岁评论》缘起.txt",
    67,
    67,
    "朝闻道，夕死可矣",
    "论语名句",
    "《论语·里仁》",
    "以早晨得闻大道、晚上死也可以，写求道与献身的迫切。",
  ),
  row(
    "006.《万岁评论》缘起.txt",
    69,
    69,
    "Study as if you were to live forever. Live as if you were to die tomorrow.",
    "外国格言",
    "伊西多尔语，李敖引英文原句",
    "以仿佛永生般学习、仿佛明日即死般生活，鼓励发愤与行动。",
  ),
  row(
    "007.挂“千秋”羊头，卖“万岁”狗肉.txt",
    1,
    1,
    "挂“千秋”羊头，卖“万岁”狗肉",
    "传统俗语化用",
    "传统俗语“挂羊头卖狗肉”的标题化用",
    "借羊头狗肉的名实关系，说明刊物名目与内容合并的调侃。",
  ),
  row(
    "008.《千秋评论》一百期期期期期期.txt",
    7,
    7,
    "臣口不能言，然臣期期知其不可！陛下虽欲废太子，臣期期不奉诏！",
    "史记引文",
    "《史记·张丞相列传》周昌语",
    "以周昌口吃仍坚决反对来说明“期期”中坚忍直言的意味。",
    "只收史传文句，不收同篇报刊查禁语境。",
  ),
  row(
    "008.《千秋评论》一百期期期期期期.txt",
    7,
    7,
    "期，极也。古人用期字，多做极字。周昌云：心期期知其不可。言极知其不可。口吃，故重一字也。",
    "朱子语类引文",
    "《朱子语类》训释",
    "解释古人以期为极、周昌因口吃重字而成“期期”的语义。",
  ),
  row(
    "008.《千秋评论》一百期期期期期期.txt",
    11,
    11,
    "心之所善、九死无悔",
    "楚辞化用",
    "屈原《离骚》“亦余心之所善兮，虽九死其犹未悔”化用",
    "以心中认定的善即使九死也不悔，写坚持初心。",
    "只收楚辞化用本体，不收同句查禁叙述。",
  ),
  row(
    "008.《千秋评论》一百期期期期期期.txt",
    13,
    13,
    "君子于役，不知其期。",
    "诗经名句",
    "《诗经·王风·君子于役》",
    "以君子服役不知归期，借“期”字收束刊物百期题意。",
  ),
  row(
    "009.《千秋评论》停刊告白.txt",
    13,
    15,
    "字字看来皆是血，\n\n十年辛苦不寻常。",
    "红楼梦诗句",
    "《红楼梦》开篇诗",
    "以字字皆血、十年辛苦写成书之艰难。",
  ),
  row(
    "010.乌鸦的心愿.txt",
    7,
    7,
    "苦难当前，我们正置身废墟之中。在废墟中，我们开始盖一些小建筑，寄一些小希望。这当然是一件困难的工作，但已没有更好的路通向未来了。我们要迂回前进，要爬过层层障碍，不管天翻也好、地覆也罢，我们还是要活。",
    "外国文学引文",
    "劳伦斯《查泰莱夫人的情人》引文，李敖引中文译句",
    "以废墟中仍要建立小希望、绕行障碍继续生活，写困厄中的生存意志。",
  ),
  row(
    "010.乌鸦的心愿.txt",
    9,
    9,
    "我手写我口",
    "近代诗文成句",
    "黄遵宪诗句“我手写我口”",
    "以自己的手写自己的口，概括直抒己见的写作气魄。",
  ),
  row(
    "010.乌鸦的心愿.txt",
    9,
    9,
    "白骨剥露，凄风永拂。",
    "英国古歌译句",
    "英国古歌《两只乌鸦》译句",
    "以白骨暴露、寒风永吹写乌鸦食尽死尸后的荒凉画面。",
  ),
  row(
    "010.乌鸦的心愿.txt",
    9,
    9,
    "O'er his white banes, when they are bare,The wind sall blaw for evermair.",
    "英国古歌原文",
    "英国古歌《两只乌鸦》原文",
    "以白骨暴露后寒风永吹的古英语诗句写荒凉画面。",
    "校对补入：与前一条中文译句对照保留。",
  ),
  row(
    "012.《求是报》1991年2月27日创刊.txt",
    11,
    11,
    "东方是东方、西方是西方，两者永不交会",
    "外国诗句译语",
    "吉卜龄诗句译语",
    "以东西永不交会概括东西方隔阂，文中作为被打破的断言。",
  ),
  row(
    "012.《求是报》1991年2月27日创刊.txt",
    11,
    11,
    "Oh，East is East，and West is West，and never the twain shall meet",
    "外国诗句原文",
    "吉卜龄诗句英文原文",
    "以东西各为东西、二者永不相会概括东西方隔阂。",
    "校对补入：与前一条中文译语对照保留。",
  ),
  row(
    "013.一张报，打倒你！.txt",
    27,
    33,
    "悬瓠城南陂水深，\n\n春泥满眼路岖嵚，\n\n独骑瘦马冲残雨，\n\n前伴茫茫不可寻。",
    "王安石诗",
    "王安石诗，文中未标诗题",
    "以陂水深、春泥满眼、残雨独行写追寻前伴的艰难。",
    "只收诗句本体，不收同篇报刊抱负与政治口号。",
  ),
  row(
    "014.生公说法鬼神听.txt",
    5,
    7,
    "生公说法鬼神听，身后空堂夜不扃。\n\n高坐寂寥尘漠漠，一方明月可中庭。",
    "刘禹锡诗",
    "刘禹锡《生公讲堂》",
    "写生公讲法感通鬼神、身后讲堂空寂而明月在庭。",
  ),
  row(
    "014.生公说法鬼神听.txt",
    9,
    9,
    "生公说法，顽石点头",
    "佛教典故",
    "竺道生讲经传说",
    "以生公说法使顽石点头，形容讲说感化力极强。",
  ),
  row(
    "016.李敖谈《李敖的报纸》.txt",
    15,
    15,
    "不温故，又何以知新？",
    "论语化用",
    "《论语·为政》“温故而知新”化用",
    "以不温习旧事便不能了解新事，说明由往事认识当下。",
  ),
  row(
    "016.李敖谈《李敖的报纸》.txt",
    15,
    15,
    "青出于蓝",
    "荀子成语",
    "《荀子·劝学》语意形成的成语",
    "用后来超过先前来形容变化延续且更加严重。",
  ),
  row(
    "016.李敖谈《李敖的报纸》.txt",
    15,
    15,
    "黄河之水天上来",
    "李白诗句",
    "李白《将进酒》句",
    "借黄河水从天上来的夸张意象，指追溯事情源头。",
  ),
  row(
    "016.李敖谈《李敖的报纸》.txt",
    27,
    27,
    "一个真理未广为人知之时，我们要不断重复这一真理",
    "外国思想格言",
    "约翰·穆勒语，李敖转述",
    "说明真理尚未普遍被知道时，应持续反复说明。",
  ),
  row(
    "016.李敖谈《李敖的报纸》.txt",
    41,
    41,
    "班门弄斧",
    "传统成语",
    "传统成语，鲁班门前弄斧之意",
    "以在行家面前卖弄本领形容不自量力。",
  ),
  row(
    "018.《李敖求是评论杂志》发刊词.txt",
    7,
    7,
    "成一家之言",
    "史记成句",
    "司马迁《报任安书》“成一家之言”",
    "以形成自成体系的言论说明杂志汇聚思想的使命。",
  ),
  row(
    "018.《李敖求是评论杂志》发刊词.txt",
    7,
    7,
    "虽千万人，吾往矣",
    "孟子名句",
    "《孟子·公孙丑上》“虽千万人，吾往矣”",
    "以即使面对千万人也仍前往，概括独立承担的勇气。",
  ),
  row(
    "018.《李敖求是评论杂志》发刊词.txt",
    7,
    7,
    "有眼识泰山",
    "传统俗语",
    "传统俗语",
    "形容真正有眼力、能识别重要人物或事实。",
  ),
];

const excludedHighlights = [
  "001 海耶克关于中共、马克思主义、集权政权的引语，属于现代政治意识形态语录，未收。",
  "001 司法、人权、监察委员弹劾法官等段落中的法治口号、法律术语和公共事件引语，未收。",
  "001 “权利之行使不得以损害他人为主要目的”：现代民法权利语境，校对轮仍不收。",
  "001 林则徐“若犹泄泄视之，中原几无可以御敌之兵”虽为名句，但原义涉及军政御敌，且此处用于教育评论，首轮不收。",
  "001 《孟子》《后汉书》“不召之臣”两句是君臣政治语境，未收。",
  "004-006 《文星》《千秋评论》《万岁评论》被封杀、出版法、报禁、政党和查禁语录，均不收。",
  "010 “朝言论，夕入狱可矣”是李敖自拟政治处境句，未收；只收劳伦斯和英国古歌等外部文学句。",
  "013 “一张报，打倒你！”及《新华日报》、国民党、共产党相关口号，属于政治报刊语境，未收；只收王安石诗句。",
  "014 李敖自祝三首小诗包含打倒政客、仇敌丧胆等政治自作内容，未收；只收刘禹锡诗和生公典故。",
  "016 陈嘉宗原文、张建邦/蒋纬国等公共人物争辩和报业批评语录，未收；只收古典诗文成句和穆勒格言。",
  "017 《求是报》停刊告白中的报禁、财阀、停刊和订户说明，未见独立诗文格言，未收。",
  "005 附录中胡适《容忍与自由》长段虽有格言性，但涉及现代民主自由与政治思想讨论，校对轮不收。",
];

const auditExcludes = [
  ["exclude", "", "001.李敖与“编辑室报告”.txt", "103-107", "中共政权是不会长久的，因为人们不需要很长的时间就会发觉，马克思主义是错误的，集权政权是无效果的。", "现代政治意识形态语录，未收"],
  ["exclude", "", "001.李敖与“编辑室报告”.txt", "191-217", "诛及疑似 / 知法犯法，罪加一等 / 人权 / 为国家整纲纪，为法界挽声誉", "司法、人权和公共事件语境，未收"],
  ["exclude", "", "001.李敖与“编辑室报告”.txt", "261-261", "权利之行使不得以损害他人为主要目的", "校对复核：现代民法权利语境，未收"],
  ["exclude", "", "001.李敖与“编辑室报告”.txt", "247-247", "若犹泄泄视之，中原几无可以御敌之兵。", "林则徐军政御敌语境，未收"],
  ["exclude", "", "001.李敖与“编辑室报告”.txt", "361-361", "故将大有为之君，必有所不召之臣 / 夫明主之世，必有不召之臣", "古代君臣政治语境，未收"],
  ["exclude", "", "004.“只要寻一个不受人惑的人”.txt", "5-11", "政治挂帅 / 思想领导政治 / 权力使人腐化", "现代政治论述语境，未收"],
  ["exclude", "", "005.被封杀的《千秋评论》.txt", "55-63", "技术击倒 / 防民之口，甚于防川", "出版法、查禁和政治讽刺语境，未收"],
  ["exclude", "", "006.《万岁评论》缘起.txt", "3-65", "出版法条文 / 政治问题，法律解决 / 技术击倒", "法律、报禁和政治犯叙述语境，未收"],
  ["exclude", "", "010.乌鸦的心愿.txt", "5-5", "朝言论，夕入狱可矣！", "李敖自拟政治处境句，未收"],
  ["exclude", "", "013.一张报，打倒你！.txt", "9-23", "《新华日报》推动民主运动 / 一张报，打倒你", "政治报刊口号和党史语境，未收"],
  ["exclude", "", "014.生公说法鬼神听.txt", "13-23", "李敖办报三首自祝小诗", "李敖自作且含政治打倒语境，未收"],
  ["exclude", "", "016.李敖谈《李敖的报纸》.txt", "7-41", "陈嘉宗评论《求是报》及李敖回应", "现代报业争辩、公共人物和个人恩怨语境，未收"],
  ["exclude", "", "017.《求是报》停刊告白.txt", "5-23", "报禁 / 看你横行到几时 / 十年有成 / 半年有败", "停刊说明和政治报禁语境，未收"],
  ["exclude", "", "005.被封杀的《千秋评论》.txt", "91-91", "容忍是一切自由的根本，没有容忍‘异己’的雅量，就不会承认‘异己’的宗教信仰可以享受自由。", "校对复核：现代民主自由和政治思想讨论，未收"],
];

for (const [index, item] of data.entries()) {
  item.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
}

const initialRecordCount = 43;
const proofreadAddedRows = data.filter((item) => item.notes.includes("校对补入"));
const proofreadUpdatedRows = [];
const proofreadDeletedRows = [];
const proofreadExcludeRows = auditExcludes.filter((rowItem) => rowItem[5].startsWith("校对复核"));

const sourceCache = new Map();
function sourceLines(sourceFile) {
  if (!sourceCache.has(sourceFile)) {
    const fullPath = path.join(sourceRoot, sourceFile);
    sourceCache.set(
      sourceFile,
      sourceDecoder.decode(fs.readFileSync(fullPath)).replace(/\r\n/g, "\n").split("\n"),
    );
  }
  return sourceCache.get(sourceFile);
}

function compact(text) {
  return String(text).replace(/\s+/g, "");
}

for (const item of data) {
  const lines = sourceLines(item.source_file)
    .slice(item.line_start - 1, item.line_end)
    .join("\n");
  if (!lines.includes(item.quote_text) && !compact(lines).includes(compact(item.quote_text))) {
    throw new Error(`Quote not found: ${item.id} ${item.source_file}:${item.line_start}-${item.line_end}`);
  }
}

function sourceFiles() {
  return fs
    .readdirSync(sourceRoot)
    .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

const reviewPatterns = [
  "“",
  "”",
  "‘",
  "’",
  "曰",
  "说",
  "云",
  "所谓",
  "古人",
  "俗话",
  "谚",
  "格言",
  "典故",
  "成语",
  "诗",
  "词",
  "孟子",
  "论语",
  "礼记",
  "史记",
  "诗经",
  "红楼梦",
  "不受人惑",
  "生公",
  "乌鸦",
  "期期",
  "羊头",
  "狗肉",
];
const attributedPatterns = ["说：", "说“", "曰：", "云：", "古人说", "俗话", "谚语", "所谓", "《", "》"];
const reviewCandidates = [];
const attributedLines = [];
const quoteCandidates = [];
const quoteRegexes = [
  { type: "quoted", regex: /[“‘]([^”’]{1,220})[”’]/g },
  { type: "book_title", regex: /《([^》]{1,80})》/g },
];

for (const file of sourceFiles()) {
  const lines = sourceLines(file);
  for (const [index, rawLine] of lines.entries()) {
    const line = rawLine.trim();
    if (!line) continue;
    const lineNumber = index + 1;
    if (reviewPatterns.some((pattern) => line.includes(pattern)) || lineNumber === 1) {
      reviewCandidates.push({ file, line: lineNumber, text: line });
    }
    if (attributedPatterns.some((pattern) => line.includes(pattern))) {
      attributedLines.push({ file, line: lineNumber, text: line });
    }
    for (const { type, regex } of quoteRegexes) {
      let match;
      while ((match = regex.exec(line)) !== null) {
        quoteCandidates.push({ type, file, line: lineNumber, text: match[1] });
      }
    }
  }
}

const csvEscape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const tsvEscape = (value) => String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " / ");

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_baokanji_initial_report.txt");
const auditPath = path.join(analysisDir, "liao_baokanji_initial_audit.tsv");
const proofreadReportPath = path.join(analysisDir, "liao_baokanji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_baokanji_proofread_audit.tsv");
const quoteCandidatesPath = path.join(analysisDir, "liao_baokanji_quote_candidates.json");
const reviewCandidatesPath = path.join(analysisDir, "liao_baokanji_review_candidates.tsv");
const attributedLinesPath = path.join(analysisDir, "liao_baokanji_attributed_lines.tsv");

const csvLines = [columns.join(","), ...data.map((item) => columns.map((column) => csvEscape(item[column])).join(","))];
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txtLines = [];
txtLines.push(`《${book}》诗文格言歌谣引用`);
txtLines.push(`生成日期：${generatedDate}`);
txtLines.push(`条目数：${data.length}`);
txtLines.push("");
for (const item of data) {
  txtLines.push(`${item.id}｜${item.chapter}｜${item.source_file}:${item.line_start}-${item.line_end}`);
  txtLines.push(`【类别】${item.category}`);
  txtLines.push(`【出处】${item.source_or_origin}`);
  txtLines.push(`【引文】${item.quote_text}`);
  txtLines.push(`【说明】${item.summary}`);
  if (item.notes) txtLines.push(`【备注】${item.notes}`);
  txtLines.push("");
}
fs.writeFileSync(txtPath, `\uFEFF${txtLines.join("\r\n")}\r\n`, "utf8");

fs.writeFileSync(
  quoteCandidatesPath,
  `${JSON.stringify(
    {
      book,
      generatedDate,
      sourceRoot,
      count: quoteCandidates.length,
      candidates: quoteCandidates,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
fs.writeFileSync(
  reviewCandidatesPath,
  `\uFEFFfile\tline\ttext\r\n${reviewCandidates
    .map((item) => [item.file, item.line, item.text].map(tsvEscape).join("\t"))
    .join("\r\n")}\r\n`,
  "utf8",
);
fs.writeFileSync(
  attributedLinesPath,
  `\uFEFFfile\tline\ttext\r\n${attributedLines
    .map((item) => [item.file, item.line, item.text].map(tsvEscape).join("\t"))
    .join("\r\n")}\r\n`,
  "utf8",
);

const categoryCounts = new Map();
for (const item of data) {
  categoryCounts.set(item.category, (categoryCounts.get(item.category) ?? 0) + 1);
}

const uniqueQuoteTexts = new Set(quoteCandidates.map((item) => item.text));
const reportLines = [];
reportLines.push(`《${book}》首轮抽取报告`);
reportLines.push(`生成日期：${generatedDate}`);
reportLines.push(`源目录：${sourceRoot}`);
reportLines.push(`原始候选：${quoteCandidatesPath}`);
reportLines.push(`复筛候选：${reviewCandidatesPath}`);
reportLines.push(`归因线索：${attributedLinesPath}`);
reportLines.push(`输出 CSV：${csvPath}`);
reportLines.push(`输出 TXT：${txtPath}`);
reportLines.push(`首轮收录条数：${initialRecordCount}`);
reportLines.push(`校对补入条数：${proofreadAddedRows.length}`);
reportLines.push(`校对修订条数：${proofreadUpdatedRows.length}`);
reportLines.push(`校对删除条数：${proofreadDeletedRows.length}`);
reportLines.push(`当前收录条数：${data.length}`);
reportLines.push("");
reportLines.push("候选概况：");
reportLines.push(`- sourceFiles=${sourceFiles().length}`);
reportLines.push(`- quoteCandidates=${quoteCandidates.length}`);
reportLines.push(`- uniqueQuoteTexts=${uniqueQuoteTexts.size}`);
reportLines.push(`- attributedLines=${attributedLines.length}`);
reportLines.push(`- reviewCandidates=${reviewCandidates.length}`);
reportLines.push("");
reportLines.push("分类统计：");
for (const [category, count] of [...categoryCounts.entries()].sort((a, b) =>
  a[0].localeCompare(b[0], "zh-Hans-CN"),
)) {
  reportLines.push(`- ${category}: ${count}`);
}
reportLines.push("");
reportLines.push("本轮排除：");
for (const item of excludedHighlights) {
  reportLines.push(`- ${item}`);
}
reportLines.push("");
reportLines.push("明细：");
reportLines.push(
  [
    "id",
    "source_file",
    "line_start",
    "line_end",
    "category",
    "source_or_origin",
    "quote_text",
    "summary",
    "notes",
  ].join("\t"),
);
for (const item of data) {
  reportLines.push(
    [
      item.id,
      item.source_file,
      item.line_start,
      item.line_end,
      item.category,
      item.source_or_origin,
      item.quote_text,
      item.summary,
      item.notes,
    ]
      .map(tsvEscape)
      .join("\t"),
  );
}
fs.writeFileSync(reportPath, `\uFEFF${reportLines.join("\r\n")}\r\n`, "utf8");

const auditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ...data.map((item) => [
    "keep",
    item.id,
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.summary,
  ]),
  ...auditExcludes,
];
fs.writeFileSync(
  auditPath,
  `\uFEFF${auditRows.map((auditRow) => auditRow.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

const proofreadReportLines = [];
proofreadReportLines.push(`《${book}》校对轮报告`);
proofreadReportLines.push(`生成日期：${generatedDate}`);
proofreadReportLines.push(`源目录：${sourceRoot}`);
proofreadReportLines.push(`输出 CSV：${csvPath}`);
proofreadReportLines.push(`输出 TXT：${txtPath}`);
proofreadReportLines.push(`首轮收录条数：${initialRecordCount}`);
proofreadReportLines.push(`校对补入条数：${proofreadAddedRows.length}`);
proofreadReportLines.push(`校对修订条数：${proofreadUpdatedRows.length}`);
proofreadReportLines.push(`校对删除条数：${proofreadDeletedRows.length}`);
proofreadReportLines.push(`当前收录条数：${data.length}`);
proofreadReportLines.push("");
proofreadReportLines.push("校对结论：");
proofreadReportLines.push("- 首轮 43 条未发现需要删除的政治语录。");
proofreadReportLines.push("- 补入《论语》变体、胡适方法论格言、忠恕释义、锦囊典故，以及英国古歌/吉卜龄原文对照。");
proofreadReportLines.push("- 继续排除现代政治意识形态、司法/人权/民主自由长段、报禁查禁口号、报业争辩和李敖自作政治诗。");
proofreadReportLines.push("");
proofreadReportLines.push("校对补入：");
for (const item of proofreadAddedRows) {
  proofreadReportLines.push(
    `- ${item.id}\t${item.source_file}:${item.line_start}-${item.line_end}\t${item.category}\t${item.quote_text}`,
  );
}
proofreadReportLines.push("");
proofreadReportLines.push("校对复核排除：");
for (const rowItem of proofreadExcludeRows) {
  proofreadReportLines.push(`- ${rowItem[2]}:${rowItem[3]}\t${rowItem[4]}\t${rowItem[5]}`);
}
fs.writeFileSync(proofreadReportPath, `\uFEFF${proofreadReportLines.join("\r\n")}\r\n`, "utf8");

const proofreadAuditRows = [
  ["action", "target", "source_file", "line_range", "quote_or_candidate", "reason"],
  ...proofreadAddedRows.map((item) => [
    "add",
    item.id,
    item.source_file,
    `${item.line_start}-${item.line_end}`,
    item.quote_text,
    item.notes,
  ]),
  ...proofreadExcludeRows,
];
fs.writeFileSync(
  proofreadAuditPath,
  `\uFEFF${proofreadAuditRows.map((auditRow) => auditRow.map(tsvEscape).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      book,
      initialRecords: initialRecordCount,
      records: data.length,
      proofreadAdded: proofreadAddedRows.length,
      proofreadUpdated: proofreadUpdatedRows.length,
      proofreadDeleted: proofreadDeletedRows.length,
      csvPath,
      txtPath,
      reportPath,
      auditPath,
      proofreadReportPath,
      proofreadAuditPath,
      quoteCandidatesPath,
      reviewCandidatesPath,
      attributedLinesPath,
      sourceFiles: sourceFiles().length,
      quoteCandidates: quoteCandidates.length,
      uniqueQuoteTexts: uniqueQuoteTexts.size,
      attributedLines: attributedLines.length,
      reviewCandidates: reviewCandidates.length,
    },
    null,
    2,
  ),
);
