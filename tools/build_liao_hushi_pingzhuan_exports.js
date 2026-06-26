const fs = require("fs");
const path = require("path");

const book = "胡适评传";
const idPrefix = "LAHSPZ";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "002.胡适评传");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_hushi_pingzhuan_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_hushi_pingzhuan_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_hushi_pingzhuan_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_hushi_pingzhuan_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_hushi_pingzhuan_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_hushi_pingzhuan_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_hushi_pingzhuan_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_hushi_pingzhuan_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_hushi_pingzhuan_proofread_report.txt");
const sourceDecoder = new TextDecoder("gb18030");

const files = fs
  .readdirSync(sourceDir)
  .filter((name) => name.endsWith(".txt") && !name.includes("目录"))
  .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

const sourceCache = new Map();
for (const file of files) {
  const text = sourceDecoder.decode(fs.readFileSync(path.join(sourceDir, file)));
  sourceCache.set(file, { text, lines: text.split(/\r?\n/) });
}

function sourceFile(prefix) {
  const found = files.find((file) => file.startsWith(prefix));
  if (!found) throw new Error(`Source file not found for prefix: ${prefix}`);
  return found;
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"'「」『』]/g, "")
    .replace(/\s+/g, "");
}

function q(filePrefix, lineStart, quoteText, category, attributedTo, summary, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(filePrefix);
  return {
    id: "",
    book,
    chapter: file.replace(/^\d+\./, "").replace(/\.txt$/, ""),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: attributedTo,
    summary,
    notes: [
      "校对轮保守收入：本书兼具评传、史料脚注和早年诗文，现代党派、革命、选举、国家治理、时事新闻、电讯和现代政治人物评议不收；删除碎片化题字、过度场景化人物评语和政治边缘表达，只取句子本体可独立成立的诗文、治学方法、古典名句、宗教哲理、亲情婚恋诗文和非政治生活格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    7,
    "我已是死掉的人了，死人还能说些什么呢？",
    "人生感喟",
    "胡适语",
    "李敖在序文中转引胡适自嘲已被批评者判为死人的感喟，句子有独立的生命无常意味。",
  ),
  q(
    "001.",
    15,
    "画我须是我。",
    "传记格言",
    "克伦威尔语",
    "李敖借克伦威尔要求写真相的名句说明传记写作必须面对真实人物。",
  ),
  q(
    "001.",
    29,
    "正文轻快，脚注详细",
    "传记写作格言",
    "李敖写作原则",
    "李敖概括《胡适评传》的写法，正文保持可读，脚注承担史料考订。",
  ),
  q(
    "003.",
    141,
    "将军慷慨来渡辽，飞鞭跃马夸人豪。平时搜集得汉印，今作将印悬在腰。",
    "近代讽刺诗",
    "黄遵宪《渡辽将军歌》",
    "李敖引用黄遵宪诗句讽刺吴大澂以金石嗜好入军事场景。",
  ),
  q(
    "003.",
    141,
    "两军相接战甫交，纷纷鸟兽空营逃。弃官脱剑无人惜，只幸腰间印未失。",
    "近代讽刺诗",
    "黄遵宪《渡辽将军歌》",
    "李敖续引同诗写败逃与护印的反差。",
  ),
  q(
    "003.",
    141,
    "将军终是察吏材，湘中一官复归来，八千子弟空摧折，白衣迎拜悲风哀。幕下部卒皆云散，将军归来犹善饭。平章古玉图鼎钟，搜箧价犹值千万。",
    "近代讽刺诗",
    "黄遵宪《渡辽将军歌》",
    "李敖引用较长一段，呈现讽刺人物失败后仍归于金石古玩的一面。",
  ),
  q(
    "003.",
    233,
    "夜夜澄心学坐禅，更残漏尽未成眠，忽然一阵风吹到，几处笙歌管杂弦。云影迢迢月影孤，山中习静要功夫，僧房寂寞蒲团冷，未悉禅心入定无？晓色迷离睡转浓，三杯乍夜醉黄封，非常最是邯郸梦，莫遣沙弥乱打钟。",
    "幽默打油诗",
    "胡传调侃诗",
    "李敖转录胡传调侃同乡读书坐禅的诗，保留其诙谐诗趣。",
  ),
  q(
    "003.",
    283,
    "吾家世业茶，然此儿慧，勿以服贾废读。",
    "教育格言",
    "胡铁花家传",
    "胡传家传中长辈劝不以经商废读的话，体现旧家教育取向。",
  ),
  q(
    "003.",
    295,
    "多其取之方，少其取之数，则人易为力而乐从。",
    "处事格言",
    "胡铁花家传",
    "胡传议修宗祠筹款时提出的取财有方、负担从轻原则。",
  ),
  q(
    "003.",
    307,
    "神君也，不可欺。",
    "民间评语",
    "胡铁花家传",
    "民众称胡传治讼清明，不可欺瞒。",
  ),
  q(
    "003.",
    307,
    "良师也，不可失。",
    "教育评语",
    "胡铁花家传",
    "士子称胡传亲自课士，是不该失去的好老师。",
  ),
  q(
    "003.",
    327,
    "习之熟则猝遇非常，不致张皇矣。",
    "训练格言",
    "胡铁花语",
    "胡传督练步伐打靶时说明熟练训练可防临事慌乱。",
  ),
  q(
    "003.",
    329,
    "吾死，尔归吾骨，不幸则父子同死，毋令全家俱殉也。",
    "家书遗语",
    "胡铁花语",
    "胡传临危安排家人内渡时留下的沉痛家族遗语。",
  ),
  q(
    "004.",
    117,
    "生未能养，病未能侍，毕世劬劳未能丝毫分任，生死永诀乃亦未能一面。平生惨痛，何以如此！",
    "悼母文句",
    "胡适《先母行述》",
    "胡适哀悼母亲时写下的愧痛文字。",
  ),
  q(
    "004.",
    121,
    "往日归来，才望见竹竿尖，才望见吾村，便心头乱跳，遥知前面，老亲望我，含泪相迎。“来了？好呀，——更无别话，说尽心头欢喜悲酸无限情。\n偷回首，揩干泪眼，招呼茶饭，款待归人。\n今朝——\n依旧竹竿尖，依旧溪桥，——\n只少了我的心头狂跳！——\n何消说一世的深恩未报！\n何消说十年来的家庭梦想，都一一云散烟消！——\n只今日到家时，更何处能寻她那一声“好呀，来了！”",
    "悼母诗",
    "胡适《十二月一日奔丧到家》",
    "李敖引用胡适奔丧到家诗，写归家时再也听不到母亲迎声的悲痛。",
    135,
  ),
  q(
    "004.",
    145,
    "先母内持家政，外应门户，凡十余年。以少年做后母，周旋诸子诸妇之间，其困苦艰难有非外人所能喻者。先母一一处之至诚至公，子妇间有过失，皆容忍曲喻之；至不能忍，则闭户饮泣自责；子妇奉茶引过，始已。",
    "母德文句",
    "胡适《先母行述》",
    "胡适记母亲持家待人的公正与容忍。",
  ),
  q(
    "004.",
    151,
    "世间最可厌恶的事莫如一张生气的脸；世间最下流的事莫如把生气的脸摆给旁人看。这比打骂还难受。",
    "处世格言",
    "胡适《九年的家乡教育》",
    "胡适从家庭经验中得出的待人警句，反感把怒气摆给旁人看。",
  ),
  q(
    "004.",
    161,
    "如果我学得了一丝一毫的好脾气，如果我学得了一点点待人接物的和气，如果我能宽恕人、体谅人，——我都得感谢我的慈母。",
    "感恩文句",
    "胡适《九年的家乡教育》",
    "胡适把自己的好脾气、和气与宽恕能力归功于母亲教养。",
  ),
  q(
    "004.",
    165,
    "先母自奉极菲薄，而待人接物必求丰厚",
    "母德文句",
    "胡适《先母行述》",
    "胡适概括母亲自奉薄而待人厚的品格。",
  ),
  q(
    "004.",
    171,
    "吾病若不起，慎勿告吾儿；当仍请人按月作家书，如吾在时。俟吾儿学成归国，乃以此影与之。吾儿见此影，如见我矣。",
    "亲情遗语",
    "胡适《先母行述》",
    "胡适记母亲病重仍不愿影响儿子学业的嘱咐。",
  ),
  q(
    "005.",
    249,
    "维桑与梓，必恭敬止",
    "古典题字",
    "《诗经·小雅》",
    "胡适回台南访旧时题写《诗经》语，表达桑梓敬意。",
  ),
  q(
    "005.",
    249,
    "游子归来",
    "题字",
    "胡适题字",
    "胡适访童年旧居时题下的归来短语。",
  ),
  q(
    "005.",
    301,
    "埋骨何须桑梓地；\n人间无处不青山！",
    "传统诗句",
    "传统诗句",
    "李敖以此句收束胡适与台湾的土地缘分。",
    303,
  ),
  q(
    "005.",
    381,
    "一个人的最大责任是把自己这块材料铸造成器",
    "人格格言",
    "胡适题字",
    "胡适在台东为学校题字，强调个人修养成器。",
  ),
  q(
    "006.",
    19,
    "为人之道，在率其性",
    "修身格言",
    "胡传编《学为人诗》",
    "胡适幼年读父亲编抄四言韵文中的做人原则。",
  ),
  q(
    "006.",
    19,
    "以学为人，以期作圣",
    "修身格言",
    "胡传编《学为人诗》",
    "胡适幼年读父亲编抄韵文中的求学做人目标。",
  ),
  q(
    "006.",
    55,
    "天地玄黄，宇宙洪荒",
    "蒙学名句",
    "《千字文》",
    "李敖引胡适回忆旧式教育中儿童死背《千字文》的句子。",
  ),
  q(
    "006.",
    69,
    "揭谛揭谛，波罗揭谛",
    "佛经文句",
    "《般若心经》",
    "胡适用佛经音译句比喻只念古文不讲解的无用。",
  ),
  q(
    "006.",
    163,
    "形既朽灭，神亦飘散，虽有剉烧舂磨，亦无所施。",
    "宗教哲理",
    "司马光家训/朱子《小学》所引",
    "胡适读到反地狱论后受震动，成为其无鬼神思想的起点。",
  ),
  q(
    "006.",
    169,
    "形者神之质，神者形之用也。神之于形，犹利之于刀。未闻刀没而利存，岂容形亡而神在哉？",
    "宗教哲理",
    "范缜《神灭论》",
    "李敖引用范缜形神譬喻，说明胡适由此走向无神论。",
  ),
  q(
    "006.",
    179,
    "人生如树花同发，随风而散，或拂帘幌，坠茵席之上；或关篱墙，落粪溷之中。坠茵席者，殿下是也，落粪溷者，下官是也。贵贱虽复殊途，因果竟在何处？",
    "宗教哲理",
    "范缜答萧子良语",
    "范缜以树花随风譬喻偶然，破佛教因果贵贱说。",
  ),
  q(
    "006.",
    273,
    "此亦人子也，可善遇之。",
    "待人格言",
    "朱子《小学》记陶渊明家书",
    "胡适记童年读《小学》后受陶渊明善待仆役一句影响。",
  ),
  q(
    "006.",
    307,
    "我只读了这三十五个字，就换了一个人。",
    "读书感悟",
    "胡适《从拜神到无神》",
    "胡适回顾范缜文字对少年思想造成的巨大转变。",
  ),
  q(
    "007.",
    107,
    "千年之冢，不动一抔；千丁之家，未尝散处；千载之谱，丝毫不紊。",
    "宗族评语",
    "旧人形容徽州宗族语",
    "李敖引用旧语说明绩溪胡氏宗谱与宗族结构的稳定。",
  ),
  q(
    "007.",
    219,
    "而绩溪诸胡之后有胡适者，亦用清儒方法治学，有正统派遗风",
    "学术评语",
    "梁启超评胡适语",
    "梁启超将胡适治学方法接到清儒正统遗风上。",
  ),
  q(
    "007.",
    233,
    "左相日兴费万钱，饮如长鲸吸百川，衔杯乐圣称避贤",
    "唐诗句",
    "杜甫《饮中八仙歌》",
    "李敖引杜甫诗说明胡适所用崔宗之典故。",
  ),
  q(
    "008.",
    37,
    "二人同心，其利断金。同心之言，其臭如兰",
    "易经名句",
    "《易经·系辞传》",
    "胡适在课堂上指出老师误把《系辞传》当《左传》，句子即所讲经文。",
  ),
  q(
    "008.",
    51,
    "暴得大名，不祥",
    "处世格言",
    "传统说法",
    "李敖形容胡适跳班后立刻遇到作文难题，用此句提醒骤得名声未必全吉。",
  ),
  q(
    "008.",
    81,
    "独创体裁，不随流俗",
    "报业评语",
    "《时报》特色评语",
    "李敖转述《时报》的文体特色，只取其写作与报业创新层面。",
  ),
  q(
    "008.",
    111,
    "物竞天择，适者生存",
    "进化论名句",
    "严复译《天演论》流行语",
    "胡适名字与表字的由来，取自《天演论》时代流行语。",
  ),
  q(
    "008.",
    113,
    "瑰辞达奥旨，风行海内",
    "文章评语",
    "陈宝琛《严又陵先生墓志》",
    "李敖用墓志语说明《天演论》译文风行一时。",
  ),
  q(
    "008.",
    115,
    "优胜劣败，适者生存",
    "进化论名句",
    "严复译《天演论》流行语",
    "李敖说明《天演论》在当时形成的流行公式。",
  ),
  q(
    "008.",
    117,
    "春鸟秋虫，听其自鸣自止可耳",
    "文学评语",
    "严复评文学革命语",
    "严复以自然声响譬喻白话文学风潮，李敖用来说明严复晚年态度。",
  ),
  q(
    "008.",
    153,
    "第一次用历史眼光来整理中国旧学术思想，第一次给我们一个‘学术史’的见解",
    "学术史评语",
    "胡适评梁启超《中国学术思想变迁之大势》",
    "胡适说明梁启超文章给他打开学术史眼光。",
  ),
  q(
    "008.",
    163,
    "无善无恶，可善可恶",
    "哲学命题",
    "王阳明性论",
    "胡适少年演说论性时采用王阳明性论。",
  ),
  q(
    "008.",
    255,
    "天之于民厚矣！置五谷，生鱼鸟，以为之用。",
    "自然哲理",
    "《列子·说符》",
    "李敖引用《列子》中田氏的目的论说法，作为鲍氏之子的反驳对象。",
  ),
  q(
    "008.",
    255,
    "天地万物，与我竝生类也；类无贵贱，徒以小大智力而相制，迭相食，非相为而生之。人取可食者而食之。岂天本为人生之？且蚊蚋唱肤，虎狼食肉，非天本为蚊蚋生人，虎狼生肉者哉！",
    "自然哲理",
    "《列子·说符》鲍氏之子语",
    "鲍氏之子以自然主义反驳万物为人而生的说法，李敖说明其契合胡适口味。",
  ),
  q(
    "008.",
    273,
    "知之为知之，不知为不知，是知也。",
    "儒家名句",
    "《论语》",
    "胡适以孔子语解释赫胥黎存疑主义。",
  ),
  q(
    "008.",
    273,
    "怎样的知，才可以算是无疑的知？",
    "治学问题",
    "胡适述赫胥黎存疑主义",
    "胡适进一步提出证据充分的知识才可称无疑。",
  ),
  q(
    "008.",
    273,
    "只有那证据充分的知识，方才可以信仰，凡没有充分证据的，只可存疑，不当信仰。",
    "治学格言",
    "胡适述赫胥黎存疑主义",
    "胡适概括存疑主义的核心，即知识应由证据支撑。",
  ),
  q(
    "008.",
    277,
    "拿证据来",
    "治学格言",
    "胡适述科学方法",
    "胡适把证据视为思想解放与方法革命的核心武器。",
  ),
  q(
    "009.",
    69,
    "做文字必须要教人懂得",
    "文章格言",
    "胡适自述",
    "胡适回顾少年写白话文时确立的明白清洁原则。",
  ),
  q(
    "009.",
    69,
    "从来不怕人笑我的文字浅显",
    "文章格言",
    "胡适自述",
    "胡适说明自己坚持浅显可懂，不怕被讥为浅。",
  ),
  q(
    "009.",
    105,
    "学原于思",
    "治学格言",
    "程伊川语",
    "胡适少年时重视思想方法，特别注意程伊川此句。",
  ),
  q(
    "009.",
    113,
    "耕田欲雨刈欲晴，去得顺风来者怨。若使人人祷辄遂，造物应须日千变",
    "宋诗句",
    "苏轼诗句",
    "胡适《无鬼丛话》引用苏轼诗，讽刺祈祷愿望彼此冲突。",
  ),
  q(
    "009.",
    343,
    "只须拜热为先祖，直到成冰是善终",
    "近代诗句",
    "马君武诗句",
    "胡适读马君武诗稿时称此断句稍可诵。",
  ),
  q(
    "009.",
    345,
    "群山现天际，人说是澎湖。感怆乘桴意，模糊属国图。缘波迎去舰，红日照前途。数点渔舟影，微茫忽有无。",
    "近代诗",
    "马君武《澎湖》",
    "胡适在日记中称最爱马君武这首五律。",
  ),
  q(
    "009.",
    467,
    "君看取落花飞絮，也有吹来穿绣幌，有因风飘堕随尘土。人世事，总无据。",
    "宋词句",
    "季南金《贺新郎》",
    "李敖引用宋人词句，写人世际遇无常。",
  ),
  q(
    "009.",
    499,
    "不孝有三，无后为大。",
    "传统名句",
    "《孟子》",
    "胡适谈无后思想时引用传统家族观念中的名句。",
  ),
  q(
    "009.",
    517,
    "子孙贤而多财，则损其志；愚而多财，则益其过。",
    "家训格言",
    "疏广语",
    "胡适谈遗产不传子孙时引用疏广名言。",
  ),
  q(
    "009.",
    521,
    "有妻子者，其命定矣（绝无大成就矣）。盖妻子者，大事业之障碍也，不可以为大恶，亦不足以为大善矣。天下最大事功为公众而作者，必皆出于不婚或无子之人，其人虽不婚无后，然实已以社会为妻为子矣。",
    "西方格言",
    "培根《婚娶与独处论》",
    "胡适谈无后主义时转引培根关于婚娶与事业的议论。",
  ),
  q(
    "009.",
    525,
    "吾人行见最伟大之事功皆出于无子之人耳。其人虽不能以形体传后，然其心思精神则已传矣。故唯无后者，乃最能传后者也。",
    "西方格言",
    "培根《父子论》",
    "胡适续引培根语，说明精神与事业可以替代血缘传后。",
  ),
  q(
    "009.",
    533,
    "死而不朽",
    "古典名句",
    "《左传》",
    "胡适在日记中记《左传》三不朽一段时所引发问。",
  ),
  q(
    "009.",
    533,
    "太上有立德。其次有立功，其次有立言，虽久不废，此之谓不朽。",
    "古典名句",
    "《左传·襄公二十四年》",
    "胡适以《左传》三不朽回应无后与传后问题。",
  ),
  q(
    "009.",
    557,
    "我实在不要儿子，儿子自己来了。“无后主义”的招牌，于今挂不起来了。\n譬如树上开花，花落偶然结果。那果便是你，那树便是我。树本无心结子，我也无恩于你。\n但是你既来了，我不能不养你教你，那是我对人道的义务，并不是待你的恩谊。\n将来你长大时，莫忘了我怎样教训儿子：我要你做一个堂堂的人，不要你做我的孝顺儿子。",
    "亲子诗",
    "胡适《我的儿子》",
    "李敖引用胡适《我的儿子》，呈现其无后主义与父子责任的调和。",
    563,
  ),
  q(
    "010.",
    11,
    "我以何因缘，得交傅君剑",
    "少年诗句",
    "胡适送别诗残句",
    "胡适回忆少年写给傅君剑的送别诗开端。",
  ),
  q(
    "010.",
    11,
    "天下英雄君与我，文章知己友兼师",
    "赠别诗句",
    "傅君剑赠胡适诗",
    "傅君剑赠胡适诗中鼓励少年胡适的名句。",
  ),
  q(
    "010.",
    21,
    "牺牲诗的意思来迁就诗的韵脚",
    "诗论格言",
    "胡适自述",
    "胡适回忆初学旧诗时对押韵束缚的痛感。",
  ),
  q(
    "010.",
    35,
    "富易交，贵易妻",
    "古典化诗句",
    "胡适《弃父行》",
    "胡适少年《弃父行》开头句，以富贵易变写人情。",
  ),
  q(
    "010.",
    35,
    "自古男儿贵自立，阿翁恃子宁非辱？",
    "古典化诗句",
    "胡适《弃父行》",
    "胡适少年诗中借子妇之语反写弃父之痛。",
  ),
  q(
    "010.",
    35,
    "慈乌尚有反哺恩，不如禽兽胡为人！",
    "古典化诗句",
    "胡适《弃父行》原删句",
    "李敖附录胡适《弃父行》原有而后删的痛切诗句。",
  ),
  q(
    "010.",
    73,
    "秋高风怒号，客子中怀乱。抚枕一太息，悠悠归里闬。入门拜慈母，母方抚孙玩。齐儿见叔来，牙牙似相唤。拜母复入室，诸嫂同炊爨。问答乃未已，举头日已旰。方期长聚首，岂复疑梦幻？年来历世故，遭际多忧患。耿耿苦思家，听人讥斥鷃",
    "少年诗",
    "胡适《秋日梦返故居》",
    "胡适少年诗写客中梦回故居与思家之情。",
  ),
  q(
    "010.",
    91,
    "酒能销万虑，已分醉如泥。烛泪流干后，更声断续时。醒来还苦忆，起坐一沉思。窗外东风峭，星光淡欲垂",
    "少年诗",
    "胡适《酒醒》",
    "胡适少年诗写醉醒后的苦忆沉思。",
  ),
  q(
    "010.",
    95,
    "永夜亲机抒，悠悠念远人。朱弦纤指弄，一曲翠眉颦。满座天涯客，无端旅思新。未应儿女语，争奈不胜春",
    "少年诗",
    "胡适《女优陆菊演纺花》",
    "胡适少年诗写看女优表演引起的旅思。",
  ),
  q(
    "010.",
    111,
    "笳声销歇暮云沉，耿耿天河灿列星。战士疮痍横满地，倦者酣眠创者逝。枕戈藉草亦蘧然，时见刍灵影摇曳。长夜沉沉夜未央，陶然入梦已三次。梦中忽自顾，身已离行伍，秋风佛襟袖，独行殊踽踽。唯见日东出，迎我归乡土。纵横阡陌间，尽是钓游迹，时闻老农刈稻歌，又听牛羊嗥山脊。归来戚友咸燕集，誓言不复相离别。娇儿数数亲吾额，少妇情深自呜咽。举室争言君已倦，幸得归休免征战。惊回好梦日熹微，梦魂渺渺成虚愿",
    "译诗",
    "胡适译坎贝尔《军人梦》",
    "李敖称赞十七岁胡适文言译诗工巧，收入其译《军人梦》。",
  ),
  q(
    "010.",
    173,
    "从来桀纣多材武，未必汤武真圣贤。那得中国生仲马，一笔翻案三千年！",
    "少年诗",
    "胡适改旧诗《读大仲马侠隐记》",
    "胡适改旧诗借大仲马翻案笔法表现疑古色彩。",
  ),
  q(
    "010.",
    203,
    "但见萧飕万木摧，尚余垂柳拂人来。词人漫说柔条弱，也向西风舞一回。",
    "少年诗",
    "胡适《秋柳》改句",
    "胡适旧作《秋柳》后来的改写，借柔柳迎风写韧性。",
  ),
  q(
    "010.",
    195,
    "夫舌之存也，岂非以其柔耶？齿之亡也，岂非以其刚耶？",
    "道家寓言",
    "《说苑》常摐示老子语",
    "胡适《秋柳》附记中引用柔舌刚齿寓言。",
  ),
  q(
    "011.",
    81,
    "应有天涯感，无忘城下盟",
    "赠别诗句",
    "胡适赠别诗句",
    "胡适以同窗情谊作诗句，题中化用城下盟。",
  ),
  q(
    "011.",
    153,
    "记得那年，你家办了嫁妆，我家备了新房，只不曾捉到我这个新郎；这十年来，换了几朝帝王，看了多少世态炎凉！锈了你嫁奁中的刀剪，改了你多少嫁衣新样；——更老了你和我人儿一双！只有那十年陈的爆竹，愈陈偏愈响！",
    "新婚诗文",
    "胡适《新婚杂诗》",
    "李敖引用胡适新婚杂诗，说明当年逃婚并非单纯无钱办婚事。",
  ),
  q(
    "011.",
    167,
    "既鸟语所不能媚，亦不为风易高致",
    "诗句",
    "胡适《老树行》句",
    "胡适旧作《老树行》句，被同辈传诵并引出杨杏佛戏和。",
  ),
  q(
    "011.",
    167,
    "既柳眼所不能媚，岂大作能燃死灰？",
    "戏和诗句",
    "杨杏佛戏和胡适句",
    "杨杏佛戏和胡适老树句，李敖用以写师友唱和趣味。",
  ),
  q(
    "011.",
    167,
    "青出于蓝而胜于蓝",
    "传统成语",
    "传统成语",
    "胡适笑称学生杨杏佛戏和句胜过自己。",
  ),
  q(
    "011.",
    183,
    "余作文字不畏人反对，唯畏作不关痛痒之文字，人阅之与未阅之前同一无影响，则真覆瓿之文字矣，今日作文字，须言之有物，至少亦须值得一驳，愈驳则真理愈出，吾唯恐人之不驳耳。",
    "文章格言",
    "胡适语",
    "胡适对严庄说写文章不怕反对，只怕不关痛痒。",
  ),
  q(
    "012.",
    333,
    "日淡霜浓可奈何！",
    "诗句",
    "胡适旧句",
    "胡适回忆上海悲观时期所作日霜句。",
  ),
  q(
    "012.",
    333,
    "霜浓欺日薄",
    "诗句",
    "胡适改旧句",
    "胡适把原句改为霜浓欺日薄，呈现当时悲观意象。",
  ),
  q(
    "012.",
    335,
    "三年之前尝悲歌：“日淡霜浓可奈何！”年来渐知此念非，“海枯石烂终有时！”一哀一乐非偶尔，三年进德只此耳。",
    "乐观诗句",
    "胡适《乐观主义》日记诗句",
    "胡适以旧悲观句与新乐观句对照，说明三年心境转变。",
  ),
  q(
    "012.",
    337,
    "要使枯树生花，死灰生火，始为豪耳。况未必为枯树死灰乎！",
    "励志格言",
    "觐庄语",
    "胡适极喜欢的朋友语，强调能令枯树死灰复生才算豪气。",
  ),
  q(
    "012.",
    379,
    "六年你我不相见，见时在赫贞江边；握手一笑不须说，你我如今更少年。回头你我年老时，粉条黑板做讲师；更有暮气大可笑，喜作丧气颓唐诗。那时我更不长进，往往喝酒不顾命；有时镇日醉不醒，明朝醒来害酒病。一日大醉几乎死，醒来忽然怪自己；父母生我该有用，似此真不成事体。从此不敢大糊涂，六年海外来读书……",
    "赠友诗",
    "胡适《赠朱经农》",
    "胡适追忆旧日颓唐和后来振作读书的赠友诗。",
  ),
  q(
    "012.",
    383,
    "粗饭尚可饱，破衣未为丑。人生无好友，如身无足手。吾生所交游，益我皆最厚。少年恨污俗，反与污俗偶。自视六尺躯，不值一杯酒。倘非良友力，吾醉死已久。从此谢诸友，立身重抖擞……",
    "友情诗",
    "胡适《朋友篇 寄怡荪经农》",
    "胡适写好友扶持使自己摆脱颓唐的诗句。",
  ),
  q(
    "012.",
    391,
    "莫笑劳劳作‘考据’，且论臭味到岑苔！",
    "考据诗句",
    "李敖引诗句",
    "李敖用诗句形容胡适与评卷老夫子的考据趣味相投。",
  ),
  q(
    "012.",
    429,
    "理未易察",
    "哲学短句",
    "吕祖谦语",
    "胡适敬写吕祖谦语赠清华大学，表达道理不易明察。",
  ),
  q(
    "012.",
    467,
    "自胜者彊",
    "老子名句",
    "《老子》",
    "李敖说明胡适早年字与别号取自《老子》自胜者强。",
  ),
  q(
    "012.",
    483,
    "至人贵藏晖",
    "唐诗句",
    "李白诗句",
    "李敖说明胡适藏晖室主人别号取自李白诗。",
  ),
];

const proofreadExclusions = new Map([
  ["正文轻快，脚注详细", "李敖自己的写作原则，非引用材料；校对轮从本书引用集移出。"],
  ["良师也，不可失。", "民众场景评语，过短且依赖胡传任官语境。"],
  ["神君也，不可欺。", "民众场景评语，过短且依赖胡传任官语境。"],
  ["游子归来", "题字短语过碎，独立诗文格言性不足。"],
  ["我只读了这三十五个字，就换了一个人。", "胡适回忆阅读影响的场景句，非独立诗文格言。"],
  ["而绩溪诸胡之后有胡适者，亦用清儒方法治学，有正统派遗风", "对胡适家学源流的具体学术评语，独立格言性不足。"],
  ["独创体裁，不随流俗", "报纸特色评语，脱离《时报》语境后过碎。"],
  ["优胜劣败，适者生存", "社会达尔文公式在原文中连接国际竞争语境，校对轮保守剔除。"],
  ["怎样的知，才可以算是无疑的知？", "问句依赖后文解释，保留后文完整证据格言即可。"],
  [
    "群山现天际，人说是澎湖。感怆乘桴意，模糊属国图。缘波迎去舰，红日照前途。数点渔舟影，微茫忽有无。",
    "虽是诗句，但含属国图、舰只等政治地理色彩，校对轮保守剔除。",
  ],
  ["死而不朽", "短片语已包含在后面的《左传》三不朽完整句中。"],
  ["我以何因缘，得交傅君剑", "残存开端句，诗意不完整。"],
  ["日淡霜浓可奈何！", "短句已包含在后面的完整乐观主义诗句中。"],
]);

const proofreadAdditions = [
  q(
    "003.",
    359,
    "水必出山无可疑",
    "治学方法格言",
    "胡传诗句/胡适实验主义说明",
    "胡适一再引用父亲诗句说明实验主义中的问题解决方法：循水即可出山。",
    359,
    "校对补入：胡适多次引用的治学方法句，非政治语录。",
  ),
  q(
    "006.",
    257,
    "天即理也鬼神者，二气（阴阳）之良能也。",
    "理学命题",
    "程朱理学语",
    "胡适说明父亲所受程朱理学影响时引用的宇宙观命题。",
    257,
    "校对补入：哲理文句，保留其思想史价值。",
  ),
];

const sourceOrder = new Map(files.map((file, index) => [file, index]));
function rowCompare(a, b) {
  return (
    (sourceOrder.get(a.source_file) ?? 9999) - (sourceOrder.get(b.source_file) ?? 9999) ||
    Number(a.line_start) - Number(b.line_start) ||
    Number(a.line_end) - Number(b.line_end) ||
    a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN")
  );
}

const initialRows = [...rawRows].sort(rowCompare);
const proofreadRemovedRows = initialRows
  .map((row, index) => ({
    original_id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
    ...row,
    reason: proofreadExclusions.get(row.quote_text),
  }))
  .filter((row) => row.reason);
const proofreadRows = [
  ...initialRows.filter((row) => !proofreadExclusions.has(row.quote_text)),
  ...proofreadAdditions,
].sort(rowCompare);
const rows = proofreadRows.map((row, index) => ({
  ...row,
  id: `${idPrefix}-${String(index + 1).padStart(3, "0")}`,
}));

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

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\r?\n/g, "\\n").replace(/\t/g, " ");
}

function sourceSlice(row) {
  const source = sourceCache.get(row.source_file);
  if (!source) return "";
  return source.lines.slice(Number(row.line_start) - 1, Number(row.line_end)).join("\n");
}

function quoteFound(row) {
  const sourceText = sourceSlice(row);
  return sourceText.includes(row.quote_text) || normalizeText(sourceText).includes(normalizeText(row.quote_text));
}

const auditRows = rows.map((row) => ({
  ...row,
  quote_found_at_declared_range: quoteFound(row) ? "yes" : "no",
  source_excerpt: sourceSlice(row),
}));

const missingAtDeclaredRange = auditRows.filter((row) => row.quote_found_at_declared_range !== "yes");
const duplicateQuoteTexts = [...rows.reduce((map, row) => map.set(row.quote_text, (map.get(row.quote_text) || 0) + 1), new Map())]
  .filter(([, count]) => count > 1)
  .map(([quoteText, count]) => ({ quoteText, count }));

const politicalTerms = [
  "共产党",
  "国民党",
  "苏俄",
  "苏维埃",
  "马克思",
  "列宁",
  "斯大林",
  "独裁",
  "专制",
  "革命",
  "宪法",
  "民主",
  "政党",
  "政府",
  "国家治理",
  "政治口号",
  "领袖",
  "统治阶级",
  "人民的敌人",
];
const politicalHits = rows
  .map((row) => ({
    id: row.id,
    hits: politicalTerms.filter((term) =>
      [row.quote_text, row.category].some((value) => String(value).includes(term)),
    ),
  }))
  .filter((item) => item.hits.length > 0);

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(selectedJson), { recursive: true });

const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
].join("\r\n");
fs.writeFileSync(outCsv, `\uFEFF${csv}\r\n`, "utf8");

const txtLines = [
  `《${book}》诗文格言歌谣引用`,
  `生成日期：${generatedDate}`,
  `条目数：${rows.length}`,
  "",
];
for (const row of rows) {
  txtLines.push(`${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`);
  txtLines.push(`引用：${row.quote_text}`);
  txtLines.push(`出处线索：${row.source_or_origin}`);
  txtLines.push(`摘要：${row.summary}`);
  if (row.notes) txtLines.push(`备注：${row.notes}`);
  txtLines.push("");
}
fs.writeFileSync(outTxt, `\uFEFF${txtLines.join("\r\n")}\r\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

fs.writeFileSync(
  reviewTsv,
  `${columns.join("\t")}\r\n${rows.map((row) => columns.map((column) => tsvEscape(row[column])).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

const auditColumns = [...columns, "quote_found_at_declared_range", "source_excerpt"];
fs.writeFileSync(
  auditTsv,
  `${auditColumns.join("\t")}\r\n${auditRows.map((row) => auditColumns.map((column) => tsvEscape(row[column])).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);
fs.writeFileSync(
  proofreadAuditTsv,
  `${auditColumns.join("\t")}\r\n${auditRows.map((row) => auditColumns.map((column) => tsvEscape(row[column])).join("\t")).join("\r\n")}\r\n`,
  "utf8",
);

let extractedCandidateCount = "not available";
if (fs.existsSync(candidatesJson)) {
  const candidateData = JSON.parse(fs.readFileSync(candidatesJson, "utf8"));
  extractedCandidateCount = Array.isArray(candidateData.quoteCandidates)
    ? candidateData.quoteCandidates.length
    : Array.isArray(candidateData)
      ? candidateData.length
      : "unknown";
}
const reviewCandidateCount = fs.existsSync(reviewCandidatesTsv)
  ? Math.max(0, fs.readFileSync(reviewCandidatesTsv, "utf8").split(/\r?\n/).filter(Boolean).length - 1)
  : "not available";
const attributedLineCount = fs.existsSync(attributedTsv)
  ? Math.max(0, fs.readFileSync(attributedTsv, "utf8").split(/\r?\n/).filter(Boolean).length - 1)
  : "not available";

const categoryCounts = new Map();
const byFileCounts = new Map();
for (const row of rows) {
  categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1);
  byFileCounts.set(row.source_file, (byFileCounts.get(row.source_file) || 0) + 1);
}

const report = [
  `book=${book}`,
  `generatedDate=${generatedDate}`,
  `sourceDir=${sourceDir}`,
  `sourceFiles=${files.length}`,
  `extractedCandidates=${extractedCandidateCount}`,
  `reviewCandidates=${reviewCandidateCount}`,
  `attributedLines=${attributedLineCount}`,
  `rawRows=${rawRows.length}`,
  `proofreadRemovedRows=${proofreadRemovedRows.length}`,
  `proofreadAddedRows=${proofreadAdditions.length}`,
  `selectedRows=${rows.length}`,
  `missingAtDeclaredRange=${missingAtDeclaredRange.length}`,
  `duplicateQuoteTexts=${duplicateQuoteTexts.length}`,
  `politicalHits=${politicalHits.length}`,
  `csv=${outCsv}`,
  `txt=${outTxt}`,
  `selectedJson=${selectedJson}`,
  `reviewTsv=${reviewTsv}`,
  `auditTsv=${auditTsv}`,
  `proofreadAuditTsv=${proofreadAuditTsv}`,
  `proofreadReportTxt=${proofreadReportTxt}`,
  "",
  "selectionNotes=校对轮剔除李敖自述性写作原则、碎片化题字/残句、具体场景人物评语、社会达尔文公式和政治地理边缘诗句；继续排除现代党派、革命、选举、国家治理、时事新闻、电讯和现代政治人物评议；保留可独立成立的诗文、治学方法、古典名句、宗教哲理、亲情婚恋诗文和非政治生活格言。",
  "",
  "categoryCounts=",
  ...[...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([category, count]) => `${category}\t${count}`),
  "",
  "byFileCounts=",
  ...[...byFileCounts.entries()].map(([file, count]) => `${file}\t${count}`),
  "",
  "missingAtDeclaredRangeIds=",
  ...missingAtDeclaredRange.map((row) => `${row.id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`),
  "",
  "duplicateQuoteTexts=",
  ...duplicateQuoteTexts.map((item) => `${item.count}\t${item.quoteText}`),
  "",
  "politicalHits=",
  ...politicalHits.map((item) => `${item.id}\t${item.hits.join("|")}`),
  "",
  "proofreadRemovedRows=",
  ...proofreadRemovedRows.map(
    (row) => `${row.original_id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}\t${row.reason}`,
  ),
  "",
  "proofreadAddedRows=",
  ...proofreadAdditions.map((row) => `${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`),
];
fs.writeFileSync(reportTxt, `${report.join("\r\n")}\r\n`, "utf8");
fs.writeFileSync(proofreadReportTxt, `${report.join("\r\n")}\r\n`, "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rawRows: rawRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
      rows: rows.length,
      csv: outCsv,
      txt: outTxt,
      missingAtDeclaredRange: missingAtDeclaredRange.length,
      duplicateQuoteTexts: duplicateQuoteTexts.length,
      politicalHits: politicalHits.length,
    },
    null,
    2,
  ),
);

if (missingAtDeclaredRange.length > 0 || duplicateQuoteTexts.length > 0 || politicalHits.length > 0) {
  process.exitCode = 1;
}
