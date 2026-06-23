const fs = require("fs");
const path = require("path");

const generatedDate = "2026-06-21";
const book = "李敖书序集";
const idPrefix = "LASHXJ";
const sourceRoot = path.join(
  process.cwd(),
  "《大李敖全集6.0》分章节",
  "007.采访序跋类",
  "002.李敖书序集",
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
    "001.写在居浩然《十论》的前面.txt",
    45,
    45,
    "前人种树，后人夺树而纳凉",
    "俗语变体",
    "传统俗语“前人种树，后人乘凉”的反讽变体",
    "以树荫被后来者夺取，概括遗业被侵占的讽刺意味。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    73,
    73,
    "求仁得仁",
    "论语成句",
    "《论语·述而》“求仁而得仁”成句",
    "用以表示所求之道已经得到，因而无怨。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    105,
    105,
    "天网恢恢，疏而不漏",
    "道家格言",
    "《老子》成句",
    "以恢恢天网比喻终有公道与报应。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    105,
    105,
    "魂兮归来",
    "楚辞成句",
    "《楚辞·招魂》名句",
    "以招魂语寄托遥祭与哀悼。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    137,
    137,
    "数天涯，依然骨肉，几家能够？",
    "古典词句",
    "古典词句化用，文中作乱离亲情之叹",
    "以天涯骨肉相隔，写乱离中亲人难全。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    157,
    157,
    "乘桴浮于海",
    "论语成句",
    "《论语·公冶长》成句",
    "借孔子浮海之叹，比喻离去与远行。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    161,
    175,
    "傲骨本天生\n\n非能口舌争\n\n有才君佯狂\n\n无势我真怜\n\n击鼓敢骂曹\n\n任性终误萧\n\n浮云遮白日\n\n狱中作长啸",
    "友人题诗",
    "居浩然《天涯怀李敖》",
    "以傲骨、佯狂、击鼓骂曹等意象写友人身世与狱中气概。",
    "收录为李敖文中引用的友人诗，不作李敖自作处理。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    177,
    177,
    "情见乎辞",
    "易传成句",
    "《周易·系辞》相关成句",
    "用以说明真情自然显露于文字。",
  ),
  row(
    "004.介绍《紫禁城的黄昏》.txt",
    29,
    35,
    "咬不开、捶不碎的核儿，\n\n关不住核儿里的一点生意；\n\n百尺的宫墙，千年的礼教；\n\n锁不住一个少年的心！",
    "现代诗",
    "胡适《有感》",
    "以核儿和宫墙意象写少年生命力不可禁锢。",
  ),
  row(
    "004.介绍《紫禁城的黄昏》.txt",
    39,
    39,
    "嗟夫！丧乱之余，得此目击身经之实录，信乎其可贵也！",
    "序文摘句",
    "溥仪为庄士敦《紫禁城的黄昏》所作序",
    "称许亲历实录在乱离之后的可贵。",
  ),
  row(
    "004.介绍《紫禁城的黄昏》.txt",
    39,
    39,
    "庄士敦雄文高行，为中国儒者所不及",
    "序文摘句",
    "溥仪为庄士敦《紫禁城的黄昏》所作序",
    "称赞庄士敦文章与品行兼具。",
  ),
  row(
    "004.介绍《紫禁城的黄昏》.txt",
    45,
    45,
    "我的责任要紧，我的责任要紧。",
    "人物格言",
    "庄士敦书中梁鼎芬故事",
    "以重复短句凸显尽责与守职。",
  ),
  row(
    "005.推荐《海国男儿》.txt",
    3,
    3,
    "赫克脱·马洛是一个例外，他在英国比在本国获得更多的桂冠。",
    "外国文学评论",
    "英国《泰晤士报》评赫克脱·马洛语",
    "指出马洛在异国获得的文学声誉更高。",
  ),
  row(
    "005.推荐《海国男儿》.txt",
    5,
    5,
    "Nowhere else are more clearly shown the directness of narrative，the simplicity of style, the clearness of sight of a writer who is rather an observer than a poet, and whose pictures “ are rather photographs than paintings”.",
    "外国文学评论",
    "I. H. B. S.为《苦儿努力记》所作序",
    "称许马洛叙事直接、文风简洁、观察清明。",
  ),
  row(
    "005.推荐《海国男儿》.txt",
    7,
    7,
    "为了使我留下永远恶感的一个过去的回忆，我努力的要使跟我同样烦恼的人得到欢乐；我要使他们发生读书的兴趣，要使他们的兴趣不受到挫折而受到磨炼。我要刺激他们的兴趣，诉诸他们的心情，引动他们、把握他们，要他们到书本中去找求喜悦、找求安慰。",
    "作家自述",
    "赫克脱·马洛自述《海国男儿》写作抱负",
    "说明文学应引人读书，并在书中寻找喜悦与安慰。",
  ),
  row(
    "005.推荐《海国男儿》.txt",
    11,
    11,
    "漂泊东南天际间",
    "杜甫诗句变体",
    "杜甫《咏怀古迹》“漂泊西南天地间”化用",
    "借漂泊天涯意象写异地重逢旧书的身世感。",
  ),
  row(
    "006.介绍《满宫残照记》.txt",
    39,
    39,
    "太阿倒持",
    "传统成语",
    "传统成语，见《汉书》等典籍用法",
    "比喻权柄倒置，反受其害。",
  ),
  row(
    "006.介绍《满宫残照记》.txt",
    47,
    47,
    "我五游满宫，都在下午三时左右。其地在市廛之外，积雪笼罩了一切，车马之迹几绝、鸡犬之声无闻，固已寂寥如墟墓。其时又值冬天晷短，西边黯淡的斜日，格外映出一片凄凉景色。这些都正是象征了满洲国的末日，所以这书也就叫做《满宫残照记》了。",
    "序文摘句",
    "秦翰才说明《满宫残照记》书名由来",
    "以积雪、斜日和残照写故宫末景。",
  ),
  row(
    "006.介绍《满宫残照记》.txt",
    49,
    49,
    "城廓崩毁，宫室倾覆……墙被蒿艾，巷罗荆棘。野兽穴于荒阶，山鸟巢于庭树",
    "古文名句",
    "杨衒之《洛阳伽蓝记》",
    "写城阙倾毁、荒草禽兽占据故地的兴亡之感。",
  ),
  row(
    "007.《调查局研究》序.txt",
    57,
    57,
    "得赵孟所贵于先，又遭赵孟所贱于后",
    "孟子典故变体",
    "《孟子》赵孟贵贱典故化用",
    "以先贵后贱的转折写人生际遇翻覆。",
  ),
  row(
    "007.《调查局研究》序.txt",
    57,
    57,
    "就极刑而无愠色",
    "史传典故",
    "司马迁《报任安书》相关典故",
    "写司马迁受刑后仍忍辱完成著述。",
  ),
  row(
    "007.《调查局研究》序.txt",
    57,
    57,
    "藏之名山",
    "史传成句",
    "司马迁《报任安书》成句",
    "用以指著作完成后留存后世。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    5,
    5,
    "国破山河在",
    "杜甫诗句",
    "杜甫《春望》",
    "以山河犹在写离乱余景。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    5,
    5,
    "恨别鸟惊心",
    "杜甫诗句",
    "杜甫《春望》",
    "以惊心之鸟写别离之恨。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    29,
    29,
    "衣带渐宽终不悔",
    "宋词名句",
    "柳永《蝶恋花》",
    "用以表示虽受困扰仍不后悔的坚持。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    75,
    75,
    "德胜才，谓之君子；才胜德，谓之小人。",
    "资治通鉴格言",
    "司马光《资治通鉴·周纪一》",
    "以德才关系区分君子与小人。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    95,
    95,
    "为人意忌，外宽内深",
    "史记人物评语",
    "司马迁《史记·平津侯主父列传》评公孙弘语",
    "以外表宽厚而内心深隐概括人物性格。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    97,
    97,
    "浑浑而有机心",
    "人物评语",
    "胡汉民《自传》评黎元洪语",
    "以浑厚外貌与机心并存描写人物。",
  ),
  row(
    "010.新版《军统内幕》缘起.txt",
    3,
    3,
    "苦海无边，回头是岸",
    "佛家俗语",
    "佛家劝善俗语",
    "以苦海与彼岸比喻悔悟归正。",
    "只收原俗语，不收文中随后出现的地名化变体。",
  ),
  row(
    "010.新版《军统内幕》缘起.txt",
    5,
    5,
    "一与之齐，终身不改",
    "孟子成句",
    "《孟子》成句",
    "写一旦同化便终身不再改变。",
  ),
  row(
    "010.新版《军统内幕》缘起.txt",
    5,
    5,
    "此度见花枝，白头誓不归",
    "古典诗句",
    "古典诗句，文中借以写老年不返之誓",
    "以白头与花枝对照，写去志已决。",
  ),
  row(
    "010.新版《军统内幕》缘起.txt",
    5,
    5,
    "前事不忘，后事之师",
    "古训格言",
    "《战国策·赵策一》相关成句",
    "以往事作为后来人的鉴戒。",
  ),
  row(
    "010.新版《军统内幕》缘起.txt",
    5,
    5,
    "三纲实系命",
    "近代伦理格言",
    "近代伦理格言，文中并置引用",
    "以三纲系命概括旧伦理的约束力。",
  ),
  row(
    "010.新版《军统内幕》缘起.txt",
    5,
    5,
    "道义为之根",
    "近代伦理格言",
    "近代伦理格言，文中并置引用",
    "以道义为根概括新伦理的根基。",
  ),
  row(
    "010.新版《军统内幕》缘起.txt",
    5,
    5,
    "当仁不让",
    "论语成句",
    "《论语·卫灵公》成句",
    "表示面对仁义之事应主动承担。",
  ),
  row(
    "010.新版《军统内幕》缘起.txt",
    5,
    5,
    "内省不疚",
    "论语成句",
    "《论语·颜渊》成句",
    "指自我反省而无愧怍。",
  ),
  row(
    "010.新版《军统内幕》缘起.txt",
    5,
    5,
    "闻义不能徙，不善不能改",
    "论语成句",
    "《论语·述而》成句",
    "以闻义不行、见过不改为圣人所忧。",
  ),
  row(
    "010.新版《军统内幕》缘起.txt",
    7,
    7,
    "天生此怪杰，可惜在台湾",
    "友人题诗",
    "沈醉题赠李敖诗句",
    "以怪杰称许李敖，带有隔海相惜之意。",
  ),
  row(
    "011.新印《厚黑教主传》述源.txt",
    3,
    3,
    "我只能看中国书，但可惜都看完了，现已无书可看了。",
    "读书格言",
    "俞大维转述夏曾佑语",
    "以夸张口吻说传统书籍核心有限。",
  ),
  row(
    "011.新印《厚黑教主传》述源.txt",
    3,
    3,
    "中国书虽多，不过基本几十种而已，其他不过翻来覆去，东抄西抄。",
    "读书格言",
    "俞大维转述陈寅恪语",
    "指出群书浩繁而核心见解常相互转抄。",
  ),
  row(
    "011.新印《厚黑教主传》述源.txt",
    7,
    7,
    "其正若反",
    "老子式成句变体",
    "疑由《老子》“正言若反”化出",
    "以反面笔锋表达正面意思。",
  ),
  row(
    "011.新印《厚黑教主传》述源.txt",
    7,
    7,
    "谏有五，吾从其讽。",
    "古代谏诤语",
    "古代谏诤语，文中称孔丘语",
    "强调讽谏在多种谏法中的可取。",
  ),
  row(
    "013.《新官场现形记》序.txt",
    3,
    3,
    "谴责小说之出特盛……揭发伏藏，显其弊恶，而于时政，严加纠弹。或更扩充，并及风俗。",
    "现代文学评论",
    "鲁迅《中国小说史略》论晚清谴责小说",
    "概括谴责小说兴盛及揭发弊恶的范围。",
    "只收文学史判断，不收同段具体现实指涉。",
  ),
  row(
    "013.《新官场现形记》序.txt",
    5,
    5,
    "又熟知夫官之龌龊卑鄙之要凡、昏愦糊涂之大旨",
    "小说序文",
    "李伯元《官场现形记》序",
    "说明作者熟悉官场龌龊与昏愦大旨。",
  ),
  row(
    "013.《新官场现形记》序.txt",
    5,
    5,
    "以含蓄蕴酿，存其忠厚；以酣畅淋漓，阐其隐微",
    "小说序文",
    "李伯元《官场现形记》序",
    "概括以含蓄与酣畅并用的写作方法。",
  ),
  row(
    "016.《侍卫长谈毛泽东》题记.txt",
    3,
    3,
    "子治世之能臣，乱世之奸雄。",
    "世说典故",
    "许劭品评曹操典故",
    "以治世与乱世两面概括人物才性。",
    "只收许劭评语本体，不收李敖随后对现代人物的评断。",
  ),
  row(
    "016.《侍卫长谈毛泽东》题记.txt",
    5,
    5,
    "侍从眼中无英雄（No man is a hero to his valet.）",
    "外国格言",
    "科尔诺夫人语",
    "以近身侍从视角消解英雄光环。",
  ),
  row(
    "016.《侍卫长谈毛泽东》题记.txt",
    5,
    5,
    "每个英雄终成厌物（Every hero becomes a bore at last.）",
    "外国格言",
    "爱默生语",
    "指出英雄形象久而久之也会令人厌倦。",
  ),
  row(
    "017.《侍卫官谈蒋介石》题记.txt",
    5,
    5,
    "人为其仆从所敬者，鲜矣。",
    "外国格言",
    "蒙田随笔相关语，文中作中文译语",
    "说明朝夕近观之下，主人难长期被仆从敬仰。",
  ),
  row(
    "017.《侍卫官谈蒋介石》题记.txt",
    5,
    5,
    "Peu d'hommes ont este admirez parleurs domestiques.",
    "外国格言",
    "蒙田法文原句",
    "表达少有人能被家中仆从敬仰。",
  ),
  row(
    "017.《侍卫官谈蒋介石》题记.txt",
    5,
    5,
    "Few men have been admired by their servants.",
    "外国格言",
    "蒙田语英译",
    "表达少有人能被身边仆从敬仰。",
  ),
  row(
    "019.汪荣祖《章太炎研究》序.txt",
    7,
    7,
    "这五十年是中国古文学的结束时期。做这个大结束的人物，很不容易得。恰好有一个章炳麟，真可算是古文学很光荣的结局了。",
    "现代学术评语",
    "胡适论章太炎",
    "称章太炎为中国古文学结束时期的光荣结局。",
  ),
  row(
    "019.汪荣祖《章太炎研究》序.txt",
    9,
    9,
    "章炳麟是清代学术史的压阵大将",
    "现代学术评语",
    "胡适论章太炎",
    "以压阵大将称章太炎的学术地位。",
  ),
  row(
    "019.汪荣祖《章太炎研究》序.txt",
    9,
    9,
    "这两千年中只有七八部精心结构，可以称做“著作”的书",
    "现代学术评语",
    "胡适论章太炎著作",
    "强调真正精心结构的著作极少。",
  ),
  row(
    "019.汪荣祖《章太炎研究》序.txt",
    11,
    11,
    "虽千万人，吾往矣",
    "孟子成句",
    "《孟子·公孙丑上》成句",
    "以独往无畏表现道义勇气。",
  ),
  row(
    "019.汪荣祖《章太炎研究》序.txt",
    17,
    17,
    "一肚皮不合时宜",
    "苏轼典故",
    "苏轼相关典故",
    "用以形容知识分子与世俗潮流不合。",
  ),
];

const initialRecordCount = data.length;

const proofreadAddedRows = [
  row(
    "001.写在居浩然《十论》的前面.txt",
    7,
    7,
    "破釜沉舟",
    "传统成语",
    "《史记·项羽本纪》相关成语",
    "比喻下定决心，不留退路。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    27,
    27,
    "克己为人",
    "传统成语",
    "传统伦理成语",
    "以克制私欲、成全他人概括德行。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    45,
    45,
    "创业维艰",
    "传统成语",
    "传统成语",
    "指出开创事业尤其艰难。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    65,
    65,
    "生花妙舌",
    "传统成语",
    "由“生花妙笔”等语变出",
    "形容口才灵动而有感染力。",
  ),
  row(
    "001.写在居浩然《十论》的前面.txt",
    73,
    73,
    "夙夜匪懈",
    "诗经成语",
    "《诗经》相关成句",
    "形容早晚勤勉，不敢懈怠。",
  ),
  row(
    "004.介绍《紫禁城的黄昏》.txt",
    5,
    5,
    "好学不倦",
    "传统成语",
    "传统成语",
    "形容勤于学习而不知疲倦。",
  ),
  row(
    "004.介绍《紫禁城的黄昏》.txt",
    45,
    45,
    "置死生于度外",
    "传统成语",
    "传统成语",
    "表示把生死置于考虑之外，专注尽责。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    27,
    27,
    "聊备鸿爪",
    "苏轼典故变体",
    "苏轼“雪泥鸿爪”典故化用",
    "以鸿爪比喻生命或写作过程中留下的片段痕迹。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    27,
    27,
    "发愤之作",
    "史记文学观念",
    "司马迁发愤著书传统",
    "指因困厄激发而完成的著作。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    51,
    51,
    "言人人殊",
    "传统成语",
    "传统成语",
    "形容各人说法彼此不同。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    67,
    67,
    "覆巢之下，终无完卵",
    "世说典故成语",
    "《世说新语》相关典故",
    "以鸟巢倾覆比喻整体覆亡下个体难以幸免。",
  ),
  row(
    "008.推荐《李宗仁回忆录》.txt",
    87,
    87,
    "天降大任",
    "孟子成句",
    "《孟子·告子下》成句",
    "用以指重大使命降临于人。",
  ),
  row(
    "009.我看《汪精卫传》.txt",
    9,
    9,
    "义愤毕竟不能推进科学。",
    "现代学术格言",
    "丁守和序言语",
    "提醒研究不能只凭愤激情绪。",
  ),
  row(
    "009.我看《汪精卫传》.txt",
    11,
    11,
    "伊尹五就汤、五就桀，正在安人而已。",
    "王安石人物评语",
    "王安石答唐质肃语",
    "借伊尹事迹说明屈身出处以安人为本。",
  ),
  row(
    "009.我看《汪精卫传》.txt",
    11,
    11,
    "其能屈身以安人，如诸佛菩萨之行。",
    "王安石人物评语",
    "王安石答唐质肃语",
    "以菩萨行比喻屈身安人的胸怀。",
  ),
  row(
    "011.新印《厚黑教主传》述源.txt",
    3,
    3,
    "年轻时看书看不懂，我认为脑筋有毛病。现在看书看不懂，我认为书有毛病。",
    "读书格言",
    "俞大维讲读书经验语",
    "以年龄变化反转读书责任归因，带出读书眼光的成熟。",
  ),
  row(
    "011.新印《厚黑教主传》述源.txt",
    7,
    7,
    "发中国人所未发",
    "学术评语",
    "李敖评李宗吾语",
    "称其议论能提出前人未曾道出的见解。",
  ),
  row(
    "013.《新官场现形记》序.txt",
    5,
    5,
    "有东方朔的谐谑、有淳于髡的滑稽",
    "小说序文",
    "李伯元《官场现形记》序",
    "以东方朔、淳于髡概括谐谑滑稽的笔法。",
  ),
  row(
    "019.汪荣祖《章太炎研究》序.txt",
    9,
    9,
    "成一家言",
    "史记成句",
    "司马迁《报任安书》相关成句",
    "指著述能自成体系和见解。",
  ),
  row(
    "019.汪荣祖《章太炎研究》序.txt",
    17,
    17,
    "众口铄金",
    "传统成语",
    "传统成语",
    "比喻众人之言足以混淆视听、积毁成真。",
  ),
];

const proofreadUpdatedRows = [];
const proofreadDeletedRows = [];

data.push(...proofreadAddedRows);

data.forEach((item, index) => {
  item.id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
});

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\r?\n/g, "\\n").replace(/\t/g, " ");
}

function readSource(file) {
  return sourceDecoder.decode(fs.readFileSync(path.join(sourceRoot, file)));
}

function listSourceFiles() {
  return fs
    .readdirSync(sourceRoot)
    .filter((file) => file.endsWith(".txt") && !file.includes("目录"))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
}

function compact(text) {
  return String(text).replace(/\s+/g, "");
}

function validateAgainstSource(rows) {
  const errors = [];
  for (const item of rows) {
    const sourcePath = path.join(sourceRoot, item.source_file);
    if (!fs.existsSync(sourcePath)) {
      errors.push(`${item.id}: missing source file ${item.source_file}`);
      continue;
    }
    const lines = readSource(item.source_file).split(/\r?\n/);
    const sourceText = lines.slice(item.line_start - 1, item.line_end).join("\n");
    if (!sourceText.includes(item.quote_text) && !compact(sourceText).includes(compact(item.quote_text))) {
      errors.push(`${item.id}: quote not found at ${item.source_file}:${item.line_start}-${item.line_end}`);
    }
  }
  return errors;
}

function collectReviewAids() {
  const quoteTrigger =
    /[“”‘’]|曰|云|说|所谓|俗话|谚|格言|名言|题词|题记|成语|典故|诗|词|联|古人|孔子|孟子|论语|礼记|史记|左传|诗经|庄子|老子|荀子|韩非|司马迁|王安石|苏轼|杜甫|李白|鲁迅|林语堂|丘吉尔|莎士比亚|Montaigne|Emerson|No man|Every hero|Peu d'hommes|Nowhere else/;
  const attributedTrigger =
    /说|曰|云|写道|指出|认为|尝言|自谓|题诗|序中|其中是|有这样|引|转述|称道|论定/;
  const sourceFiles = listSourceFiles();
  const quoteCandidates = [];
  const reviewCandidates = [];
  const attributedLines = [];

  for (const file of sourceFiles) {
    const lines = readSource(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      const text = line.trim();
      if (!text) return;
      if (quoteTrigger.test(text)) {
        const item = { source_file: file, line: index + 1, text };
        quoteCandidates.push(item);
        if (/[“”‘’]|曰|云|所谓|题诗|自谓|尝言|其中是|写道|指出|论定|Montaigne|Emerson|No man|Every hero|Nowhere else/.test(text)) {
          reviewCandidates.push(item);
        }
      }
      if (attributedTrigger.test(text)) {
        attributedLines.push({ source_file: file, line: index + 1, text });
      }
    });
  }

  return { sourceFiles, quoteCandidates, reviewCandidates, attributedLines };
}

const validationErrors = validateAgainstSource(data);
if (validationErrors.length > 0) {
  console.error(validationErrors.join("\n"));
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

const csvPath = path.join(outDir, `${book}_诗文格言歌谣引用.csv`);
const txtPath = path.join(outDir, `${book}_诗文格言歌谣引用.txt`);
const reportPath = path.join(analysisDir, "liao_shuxuji_initial_report.txt");
const auditPath = path.join(analysisDir, "liao_shuxuji_initial_audit.tsv");
const proofreadReportPath = path.join(analysisDir, "liao_shuxuji_proofread_report.txt");
const proofreadAuditPath = path.join(analysisDir, "liao_shuxuji_proofread_audit.tsv");
const candidatesPath = path.join(analysisDir, "liao_shuxuji_quote_candidates.json");
const reviewCandidatesPath = path.join(analysisDir, "liao_shuxuji_review_candidates.tsv");
const attributedLinesPath = path.join(analysisDir, "liao_shuxuji_attributed_lines.tsv");

const csvLines = [columns.join(",")];
for (const item of data) {
  csvLines.push(columns.map((column) => csvEscape(item[column])).join(","));
}
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join("\r\n")}\r\n`, "utf8");

const txtLines = [];
for (const item of data) {
  txtLines.push(`${item.id}｜${item.category}｜${item.source_file}:${item.line_start}-${item.line_end}`);
  txtLines.push(`引用：${item.quote_text}`);
  txtLines.push(`出处线索：${item.source_or_origin}`);
  txtLines.push(`摘要：${item.summary}`);
  if (item.notes) txtLines.push(`备注：${item.notes}`);
  txtLines.push("");
}
fs.writeFileSync(txtPath, `\uFEFF${txtLines.join("\r\n")}\r\n`, "utf8");

const { sourceFiles, quoteCandidates, reviewCandidates, attributedLines } = collectReviewAids();
fs.writeFileSync(candidatesPath, `${JSON.stringify(quoteCandidates, null, 2)}\n`, "utf8");

const reviewHeader = ["source_file", "line", "text"];
fs.writeFileSync(
  reviewCandidatesPath,
  `\uFEFF${[
    reviewHeader.join("\t"),
    ...reviewCandidates.map((item) => [item.source_file, item.line, item.text].map(tsvEscape).join("\t")),
  ].join("\r\n")}\r\n`,
  "utf8",
);
fs.writeFileSync(
  attributedLinesPath,
  `\uFEFF${[
    reviewHeader.join("\t"),
    ...attributedLines.map((item) => [item.source_file, item.line, item.text].map(tsvEscape).join("\t")),
  ].join("\r\n")}\r\n`,
  "utf8",
);

const categoryCounts = new Map();
for (const item of data) categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1);

const excludedHighlights = [
  "002《汪政权的开场与收场》相关表白：属于现代政权史材料，未收。",
  "012《政海秘辛》开头毛泽东《蝶恋花》：革命悼亡词，未收。",
  "014《国共斗争的见闻》主要人物自白和园林叙述：现代党派史语境过重，未收。",
  "020《历年办理匪案汇编》序：军法、案件、社论材料集中，整篇未收。",
  "普通对话、校勘问答、书目说明、李敖自作判断句，除明确外部诗文格言外均未收。",
];

const auditExcludes = [
  ["exclude", "modern-political-material", "002.介绍《汪政权的开场与收场》.txt", "3-13", "汪政权相关原文与表白", "现代政权史材料，不收政治语录"],
  ["exclude", "modern-political-poem", "012.新版《政海秘辛》缘起.txt", "3-3", "毛泽东《蝶恋花》全文", "革命悼亡词，不收政治语录"],
  ["exclude", "modern-case-material", "020.安全局机密文件——《历年办理匪案汇编》序.txt", "3-117", "军法案件与社论材料", "现代政治法律材料，整篇排除"],
];

const proofreadExcludeRows = [
  ["exclude", "modern-political-quote", "001.写在居浩然《十论》的前面.txt", "11-11", "武汉为南北关键，一旦动摇，则四方瓦解。", "现代革命史序文引语，未收"],
  ["exclude", "modern-political-poem", "012.新版《政海秘辛》缘起.txt", "3-3", "毛泽东《蝶恋花》全文", "革命悼亡词，未收"],
  ["exclude", "classical-political-governance", "008.推荐《李宗仁回忆录》.txt", "65-65", "国家之败，由官邪也。", "古典治理语录，政治指向过强，未收"],
  ["exclude", "modern-political-history", "008.推荐《李宗仁回忆录》.txt", "43-69", "国共、北伐、政权、派系等历史判断", "现代政治史判断，未收"],
  ["exclude", "modern-political-material", "014.介绍《国共斗争的见闻》.txt", "7-11", "人物信札、自白与党派史叙述", "现代党派史语境过重，未收"],
  ["exclude", "modern-legal-editorial", "020.安全局机密文件——《历年办理匪案汇编》序.txt", "101-117", "《自由中国》军法社论", "现代军法与权利社论，未收"],
];

const reportLines = [];
reportLines.push(`《${book}》第一轮提取报告`);
reportLines.push(`生成日期：${generatedDate}`);
reportLines.push(`源目录：${sourceRoot}`);
reportLines.push(`输出 CSV：${csvPath}`);
reportLines.push(`输出 TXT：${txtPath}`);
reportLines.push(`收录条数：${data.length}`);
reportLines.push("");
reportLines.push("候选概况：");
reportLines.push(`- sourceFiles=${sourceFiles.length}`);
reportLines.push(`- quoteCandidates=${quoteCandidates.length}`);
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
for (const item of excludedHighlights) reportLines.push(`- ${item}`);
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
proofreadReportLines.push("- 首轮 56 条未发现必须删除的现代政治语录。");
proofreadReportLines.push("- 补入 20 条传统成语、诗经/孟子/史记典故、读书格言、文学史评语和小说序文。");
proofreadReportLines.push("- 继续排除毛泽东革命悼亡词、军法社论、现代政权史/党派史表白，以及政治治理指向过强的古典语录。");
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
      candidatesPath,
      reviewCandidatesPath,
      attributedLinesPath,
    },
    null,
    2,
  ),
);
