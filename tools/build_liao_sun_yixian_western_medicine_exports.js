const fs = require("fs");
const path = require("path");

const book = "孙逸仙和中国西化医学";
const idPrefix = "LASYXWM";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "004.孙逸仙和中国西化医学");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_sun_yixian_western_medicine_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_sun_yixian_western_medicine_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_sun_yixian_western_medicine_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_sun_yixian_western_medicine_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_sun_yixian_western_medicine_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_sun_yixian_western_medicine_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_sun_yixian_western_medicine_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_sun_yixian_western_medicine_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_sun_yixian_western_medicine_proofread_report.txt");
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
      "校对轮保守收入：本书大量涉及孙逸仙的革命活动、政体、党部与出版审查争议；本轮排除现代政治、革命宣传、党派、宪法、政府和出版审查语录，只保留科学、医学、教育、格物、养生、宗教及非政治的古典格言或引文。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "001.",
    131,
    "天下事穷则变，变则通。",
    "变通格言",
    "李鸿章致奕訢、文祥信",
    "李敖引李鸿章论事穷而变、变而通的判断。",
  ),
  q(
    "001.",
    131,
    "所用非所学，所学非所用。",
    "实学格言",
    "李鸿章致奕訢、文祥信",
    "李敖引李鸿章批评学用脱节。",
  ),
  q(
    "001.",
    683,
    "十人养一人肥，若一人养千百人，则虽尧舜犹病也。",
    "自立格言",
    "孙中山秘书代答语所引俗语",
    "李敖引孙中山反对依赖祖宗吃饭时转述的俗语。",
  ),
  q(
    "001.",
    687,
    "代答欲知此种新理，须从物理化学用功，不得从古说附会！",
    "科学格言",
    "孙中山秘书代答语",
    "李敖引孙中山答复中医附会问题时强调物理化学训练。",
  ),
  q(
    "001.",
    691,
    "此等实用之书，当以内容之切实为贵，不当以品题文藻为贵。",
    "实用书话",
    "孙中山秘书代答语",
    "李敖引孙中山拒绝题字时重内容、轻品题文藻的判断。",
  ),
  q(
    "002.",
    37,
    "有而不有，不有而有",
    "禅语",
    "孙逸仙在博济医院所学禅话",
    "李敖以这句禅话概括孙逸仙学医又离医的命运转折。",
  ),
  q(
    "003.",
    3,
    "始见轮舟之奇，沧海之阔",
    "游学文句",
    "孙中山早年经历记述",
    "李敖引孙中山早年初见轮船和大海的文句，写其慕西学的开端。",
  ),
  q(
    "003.",
    61,
    "以为传道而外，唯行医最能为功于社会。",
    "医学志业格言",
    "罗香林记孙中山学医动机",
    "李敖引罗香林说明孙中山由传道转向行医的济世理由。",
  ),
  q(
    "003.",
    73,
    "不为良相，当为良医",
    "医学俗语",
    "范仲淹相关俗语，孙中山轶事转述",
    "李敖引传统学医俗语。",
  ),
  q(
    "003.",
    81,
    "欲借行医以行道",
    "医学志业格言",
    "罗香林《孙中山先生受洗前后》",
    "李敖引罗香林说明孙中山以行医实践行道。",
  ),
  q(
    "004.",
    15,
    "为中国及远东各国西医西药之祖。",
    "医学史语",
    "《总理开始学医与革命运动五十周纪念史略》",
    "李敖引史略评价博济医院在西医西药传播史上的地位。",
  ),
  q(
    "004.",
    39,
    "皆确实有据，无模糊影响之谈。",
    "医学书话",
    "丁福保《卫生学问答》相关书目评语",
    "李敖引丁福保对西医书籍确实有据的判断。",
  ),
  q(
    "004.",
    45,
    "中国医学不明解剖、不讲生理、不识物理化学，其治疗法亦纯恃药物，并无割治之术，恒置可治之疾于死或残废之中。",
    "医学批评",
    "陈邦贤《中国医学史》转述",
    "李敖引陈邦贤批评旧医学缺少科学基础与手术治疗。",
  ),
  q(
    "005.",
    35,
    "吾志在天下，而天下本于国，国本于家，家本于身。身之质体血气，物也，宜格：身之心性灵明，事也，理也，亦物也，宜格。",
    "格物格言",
    "何启语，文裕堂跋转引",
    "李敖引何启求学时以身心为格物根本的志向。",
  ),
  q(
    "005.",
    39,
    "以医道可济世，律学能治心，乃先考医学，列高等。",
    "医学志业格言",
    "文裕堂跋述何启",
    "李敖引何启以医道济世、律学治心的求学路径。",
  ),
  q(
    "005.",
    39,
    "善歌者使人继其声，善教者使人继其志，诸生学吾学者，志吾志，则利济必多。",
    "教育格言",
    "何启语，文裕堂跋转引",
    "李敖引何启说明教师传志与医学利济。",
  ),
  q(
    "005.",
    51,
    "吾人教育学生，不受金钱酬报或其他补助，只不过自愿献礼物于科学未昌明的中国而已。",
    "科学教育格言",
    "康德黎演讲",
    "李敖引康德黎说明西医书院的科学教育理想。",
  ),
  q(
    "005.",
    53,
    "他要求先给我们以科学，有了科学，则其他一切都会跟着来了。",
    "科学格言",
    "康德黎演讲转述李鸿章来信",
    "李敖引康德黎演讲中的科学优先论。",
  ),
  q(
    "005.",
    59,
    "各位同学所获的专门知识，自非短期训练的学习所能企及。",
    "专业教育格言",
    "康德黎演讲",
    "李敖引康德黎说明五年训练获得的专门知识不是短期训练可比。",
  ),
  q(
    "006.",
    9,
    "讲求树艺、农桑、养蚕、畜牧、机器耕种，化瘠为腴",
    "农学格言",
    "《农功》文句，罗香林引述",
    "李敖引孙逸仙早年农学文字中的技术改良方向。",
  ),
  q(
    "006.",
    9,
    "使地无遗利，人有蓄藏",
    "农学格言",
    "《农功》文句，罗香林引述",
    "李敖引《农功》概括土地利用与民生储蓄的目标。",
  ),
  q(
    "006.",
    87,
    "达尔文的学说是“演化”的，并没有中国译名中“进化”的意味。旧译《进化论》是不通的，也是以词害意的。",
    "科学名词格言",
    "李敖论达尔文译名",
    "李敖辨析达尔文学说在中文译名中被误解为进化的歧义。",
  ),
  q(
    "007.",
    99,
    "不论贫富，一邀即至，其济人利物，岂今所谓自号名医而昂其诊金者所能及耶？",
    "医德格言",
    "《总理开始学医与革命运动五十周年纪念史略》",
    "李敖引史略称孙逸仙行医不论贫富、一邀即至。",
  ),
  q(
    "007.",
    105,
    "凡病人之经诊治者，无不著手成春，活人无算",
    "医德文句",
    "胡去非《总理事略》",
    "李敖引胡去非记孙逸仙在镜湖医院行医声誉。",
  ),
  q(
    "007.",
    109,
    "以医亦救人之术也。然继思医术救人，所济有限，其他慈善事业亦然。",
    "医学志业格言",
    "孙中山《非学问无以建设》",
    "李敖引孙中山自述医术救人但所济有限。",
  ),
  q(
    "007.",
    133,
    "此盗汗症也。君心弱，幸早治，否则殆矣。",
    "医学诊断语",
    "《孙中山轶事集》",
    "李敖引轶事中孙逸仙对徐翁的诊断。",
  ),
  q(
    "008.",
    19,
    "何尝无法，要戒之在怒，不再耗精，不过作劳，破除烦恼。",
    "养生格言",
    "陈存仁《孙中山先生病逝经过》所录葛廉夫答语",
    "李敖引孙中山病后中医问答中的节制养生语。",
  ),
  q(
    "008.",
    19,
    "节之可也，再用药物以滋助，已耗者虽未必能复，未耗者尚可保存。",
    "养生格言",
    "陈存仁《孙中山先生病逝经过》所录葛廉夫答语",
    "李敖引葛廉夫说明以节制和药物保存未耗之精气。",
  ),
  q(
    "008.",
    23,
    "今用三甲复脉汤，如知柏枣仁以滋水养肝，安其家室，潜其阳用，引汤子以归家，所以去姜之辛，用肉桂而引火归元，犀角羚羊石斛，清肃心肺，俾君火以宁，而精灵之气得令，则烦悸不眠皆蠲矣。",
    "方药文句",
    "陈存仁《孙中山先生病逝经过》所录葛廉夫答语",
    "李敖引葛廉夫解释药方机理的一段中医方药文。",
  ),
  q(
    "008.",
    25,
    "余生平未服过中药，恐不能受，欲以君之药方，转示西医使师君之法，改用西药，以为如何？",
    "医学问答",
    "陈存仁《孙中山先生病逝经过》所录孙中山问语",
    "李敖引孙中山在病中仍以西医为参照的问语。",
  ),
  q(
    "008.",
    29,
    "适之！你知道我是学西医的人。",
    "医学自述",
    "《国父年谱初稿》记孙中山语",
    "李敖引孙中山病中对胡适说自己学西医。",
  ),
  q(
    "008.",
    41,
    "我本基督徒，与魔鬼奋斗四十余年，尔等亦当如是奋斗，更当信上帝",
    "宗教遗言",
    "卢太夫人答中山商会书所记",
    "李敖引孙中山临终前一日的基督徒自证。",
  ),
  q(
    "008.",
    53,
    "此时唯有痛心忏悔，恳切祈祷而已。一连六七日，日夜不绝祈祷，愈祈愈切，至第七日，心中忽然安慰，全无忧色，不期然而然。自云，祈祷有应，蒙神施恩矣！",
    "宗教文句",
    "钱公来《国父信奉基督教之经过》引孙中山书信",
    "李敖引孙中山以祈祷得安慰的宗教文字。",
  ),
  q(
    "008.",
    61,
    "必须用功一年，始敢问世云。",
    "医学自警",
    "冯自由《孙总理之医术》记孙中山答语",
    "李敖引孙中山说若再行医必须先补习一年。",
  ),
  q(
    "008.",
    65,
    "这人只是初期的精神分裂，赶快请医生给他服用镇定剂，好好休息就会痊愈的。",
    "医学诊断语",
    "丁怀瑾《追侍国父琐忆》",
    "李敖引孙中山对精神分裂初期症状的判断。",
  ),
  q(
    "008.",
    67,
    "他胃部消化力弱，所以才有此现象，明天叫人买点药给他吃。",
    "医学诊断语",
    "丁怀瑾《追侍国父琐忆》",
    "李敖引孙中山从梦呓鼾声判断胃部消化弱。",
  ),
  q(
    "008.",
    87,
    "翁，日本九州人，幼学汉法医术，后研究西洋医学，窥破药料万能说之大误；乃苦心殚虑，考求适当于人体之食品，以助胃肠之蠕动。",
    "养生文句",
    "孙文《介绍日本名医高野太吉翁启》",
    "李敖引孙文介绍高野太吉由医药转向饮食与胃肠蠕动法。",
  ),
  q(
    "008.",
    95,
    "譬如一人医病，与其医于已发，不如防于未然。吾人眼光不可不放远大一点，当看至数十年数百年以后，顾及全世界情形方可。",
    "医学譬喻格言",
    "孙中山演说《民生主义与社会革命》",
    "李敖引孙中山用治病比喻预防和长远眼光。",
  ),
  q(
    "008.",
    99,
    "人间之疾病，多半从饮食不节而来。",
    "饮食养生格言",
    "孙中山《孙文学说》第一章《以饮食为证》",
    "李敖引孙中山说明饮食不节是疾病来源。",
  ),
  q(
    "008.",
    99,
    "手术者，乃一时之治法，若欲病根断绝长享康健，非遵我抵抗养生之法不可。",
    "饮食养生格言",
    "高野太吉语，孙中山《以饮食为证》转引",
    "李敖引高野太吉关于手术与抵抗养生法的判断。",
  ),
  q(
    "008.",
    103,
    "学者至此，想当了然于行之易而知之难矣。",
    "知行格言",
    "孙中山《孙文学说》第五章《知行总论》",
    "李敖引孙中山说明行易知难。",
  ),
  q(
    "008.",
    103,
    "故天下事唯患于不能知耳，倘能由科学之理则，以求得其真知，则行之绝无所难",
    "知行格言",
    "孙中山《孙文学说》第五章《知行总论》",
    "李敖引孙中山以科学真知说明知行关系。",
  ),
  q(
    "008.",
    103,
    "其一、先知先觉者，即发明家也；其二、后知后觉者，即鼓吹家也；其三、不知不觉者，即实行家也。",
    "知行格言",
    "孙中山《孙文学说》第五章《知行总论》",
    "李敖引孙中山区分发明家、鼓吹家、实行家。",
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

const proofreadExclusions = new Map([
  ["为中国及远东各国西医西药之祖。", "机构史地位说明，像历史资料摘句，不像可独立使用的诗文格言。"],
  [
    "吾志在天下，而天下本于国，国本于家，家本于身。身之质体血气，物也，宜格：身之心性灵明，事也，理也，亦物也，宜格。",
    "句首以天下、国、家铺陈，政治意味偏重；校对轮改收后半段身心格物核心。",
  ],
  [
    "以医亦救人之术也。然继思医术救人，所济有限，其他慈善事业亦然。",
    "弃医从政演说中的过渡句，语义导向政治事业，校对轮剔除。",
  ],
  ["适之！你知道我是学西医的人。", "病榻场景对话残句，独立格言性不足。"],
  [
    "翁，日本九州人，幼学汉法医术，后研究西洋医学，窥破药料万能说之大误；乃苦心殚虑，考求适当于人体之食品，以助胃肠之蠕动。",
    "人物介绍式长句，校对轮改收养生方法核心，去掉传记开头。",
  ],
  [
    "譬如一人医病，与其医于已发，不如防于未然。吾人眼光不可不放远大一点，当看至数十年数百年以后，顾及全世界情形方可。",
    "政治演说中的治病譬喻，虽有格言性，但语境属于政治主张。",
  ],
  [
    "故天下事唯患于不能知耳，倘能由科学之理则，以求得其真知，则行之绝无所难",
    "校对轮与上一句合并成完整知行句，避免拆分残句。",
  ],
  [
    "其一、先知先觉者，即发明家也；其二、后知后觉者，即鼓吹家也；其三、不知不觉者，即实行家也。",
    "孙文学说中的思想分类语，政治思想语境偏重，校对轮剔除。",
  ],
  ["学者至此，想当了然于行之易而知之难矣。", "拆分残句，校对轮合并到完整知行句。"],
]);

const proofreadAdditions = [
  q(
    "005.",
    35,
    "身之质体血气，物也，宜格：身之心性灵明，事也，理也，亦物也，宜格。",
    "格物格言",
    "何启语，文裕堂跋转引",
    "校对轮去掉天下、国、家铺陈，只收何启以身心为格物对象的核心句。",
    35,
    "校对补入：替换第一轮政治意味偏重的整句。",
  ),
  q(
    "008.",
    87,
    "窥破药料万能说之大误；乃苦心殚虑，考求适当于人体之食品，以助胃肠之蠕动。",
    "养生文句",
    "孙文《介绍日本名医高野太吉翁启》",
    "校对轮去掉传记式开头，只收高野太吉由药料万能转向饮食养生的核心句。",
    87,
    "校对补入：替换第一轮人物介绍式长句。",
  ),
  q(
    "008.",
    103,
    "学者至此，想当了然于行之易而知之难矣。故天下事唯患于不能知耳，倘能由科学之理则，以求得其真知，则行之绝无所难",
    "知行格言",
    "孙中山《孙文学说》第五章《知行总论》",
    "校对轮合并第一轮拆开的知行句，保留科学真知与行易知难的完整意思。",
    103,
    "校对补入：合并第一轮两条拆分残句。",
  ),
];

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
  "中央党部",
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
  "selectionNotes=校对轮在第一轮基础上删去机构史说明、政治演说中的治病譬喻、弃医从政过渡句、病榻对话残句、人物介绍式长句和政治思想分类语；保留医学、科学、格物、教育、养生和宗教文句，并把两条拆句合并为一条完整知行格言。",
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
      selectedJson,
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
