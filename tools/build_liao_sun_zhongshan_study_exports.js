const fs = require("fs");
const path = require("path");

const book = "孙中山研究";
const idPrefix = "LASZSYJ";
const generatedDate = "2026-06-26";
const sourceDir = path.join("《大李敖全集6.0》分章节", "012.人物研究类", "005.孙中山研究");
const outCsv = path.join("exports", `${book}_诗文格言歌谣引用.csv`);
const outTxt = path.join("exports", `${book}_诗文格言歌谣引用.txt`);
const candidatesJson = path.join("analysis", "liao_sun_zhongshan_study_quote_candidates.json");
const reviewCandidatesTsv = path.join("analysis", "liao_sun_zhongshan_study_review_candidates.tsv");
const attributedTsv = path.join("analysis", "liao_sun_zhongshan_study_attributed_lines.tsv");
const selectedJson = path.join("analysis", "liao_sun_zhongshan_study_selected_rows.json");
const reviewTsv = path.join("analysis", "liao_sun_zhongshan_study_initial_review.tsv");
const auditTsv = path.join("analysis", "liao_sun_zhongshan_study_initial_audit.tsv");
const reportTxt = path.join("analysis", "liao_sun_zhongshan_study_initial_report.txt");
const proofreadAuditTsv = path.join("analysis", "liao_sun_zhongshan_study_proofread_audit.tsv");
const proofreadReportTxt = path.join("analysis", "liao_sun_zhongshan_study_proofread_report.txt");
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

function sourceFile(selector) {
  if (selector === "自序") return "《孙中山研究》自序.txt";
  const found = files.find((file) => file.startsWith(selector));
  if (!found) throw new Error(`Source file not found for selector: ${selector}`);
  return found;
}

function chapterName(file) {
  return file.replace(/^\d+\./, "").replace(/\.txt$/, "");
}

function normalizeText(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[“”‘’"'\u300c\u300d\u300e\u300f]/g, "")
    .replace(/\s+/g, "");
}

function q(selector, lineStart, quoteText, category, attributedTo, summary, lineEnd = lineStart, extraNotes = "") {
  const file = sourceFile(selector);
  return {
    id: "",
    book,
    chapter: chapterName(file),
    source_file: file,
    line_start: lineStart,
    line_end: lineEnd,
    quote_text: quoteText,
    category,
    source_or_origin: attributedTo,
    summary,
    notes: [
      "校对轮保守收入：本书大量涉及党派史、革命史、国庆、统战、政体、战争与现代政治人物争议；本轮排除政治口号、党派论断、国家治理主张与时事攻击，只保留史学方法、演化与翻译辨析、山水游记、婚姻伦理、宗教伦理、修辞考证和可脱离政论语境的古典诗文格言。",
      extraNotes,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

const rawRows = [
  q(
    "自序",
    5,
    "优秀的历史家是真正的最后审判者",
    "史学格言",
    "李敖自序",
    "李敖以最后审判比喻优秀历史家的求真与论定能力。",
  ),
  q(
    "001.",
    45,
    "孙子曰知己知彼，百战百胜，此言虽小，可以喻大。",
    "兵家成语",
    "郑观应《盛世危言》自序转引《孙子》",
    "李敖转引郑观应以知己知彼说明洞见本原的重要。",
  ),
  q(
    "001.",
    73,
    "其志不可谓不高，其说亦颇切近，而非若狂士之大言欺世者比。",
    "人物评语",
    "郑观应致盛宣怀信",
    "郑观应评孙逸仙农桑游学设想志高而切近，非狂言欺世。",
  ),
  q(
    "001.",
    145,
    "旧译“进化论”是不通的，也是以词害意的。",
    "科学名词格言",
    "李敖论达尔文译名",
    "李敖辨析达尔文译名中进化一词造成的误解。",
  ),
  q(
    "001.",
    147,
    "中国人所能了解的，只是“物竞天择”“适者生存”那一套，并不是真正的“演化眼光”那一套。",
    "思想辨析",
    "李敖论演化眼光",
    "李敖区分通俗进化口号与较深层的演化眼光。",
  ),
  q(
    "001.",
    147,
    "欲速则反迟、想快却更慢",
    "处世格言",
    "李敖论演化眼光",
    "李敖以短句概括鲁莽求速常导致反效果。",
  ),
  q(
    "002.",
    155,
    "感情作用所支配，不免将真迹放大也！治史者明乎此义，处处打几分折头，庶无大过矣！",
    "治史格言",
    "梁启超《中国历史研究法》",
    "李敖转引梁启超说明史料受感情作用影响时，应折扣辨读。",
  ),
  q(
    "002.",
    213,
    "人当陷入深渊之时，苟有毫发可以凭借者，即不惜攀援以登",
    "处境格言",
    "孙逸仙《伦敦被难记》",
    "李敖转引孙逸仙自述困厄中求生的心理。",
  ),
  q(
    "002.",
    361,
    "穷则呼天，痛痒则呼父母，人之情也。",
    "人情格言",
    "孙逸仙致区凤墀信",
    "李敖注中转引孙逸仙信里对危急时祈祷与求助的解释。",
  ),
  q(
    "002.",
    363,
    "君试思救人于死与致人于死，其善恶之相去几何？又试思吾人尽职于上帝为重乎？抑尽职于雇主为重乎？",
    "宗教伦理",
    "孙逸仙《伦敦被难记》",
    "李敖注中转引孙逸仙对柯尔的伦理劝说。",
  ),
  q(
    "005.",
    5,
    "吾人必牺牲目前小利，以求将来之幸福",
    "建设格言",
    "孙逸仙太原商学界欢迎会演讲题旨",
    "李敖转引孙逸仙山西演讲中牺牲眼前小利以求长远幸福的句子。",
  ),
  q(
    "007.",
    49,
    "饮水思源，尤不容忘其本来",
    "感恩格言",
    "蔡元培、张相文致孙逸仙信",
    "李敖转引蔡元培、张相文以饮水思源说明历史写作不可忘本。",
  ),
  q(
    "008.",
    129,
    "知之则必能行之，知之则更易行之",
    "知行格言",
    "胡适《这一周》转述",
    "李敖转引胡适评议孙逸仙知行学说时赞成的短句。",
  ),
  q(
    "008.",
    231,
    "瞻之在前，忽焉在后",
    "古典成语",
    "《论语》成句",
    "李敖转引旧文借孔门成句形容行迹难测。",
  ),
  q(
    "008.",
    265,
    "薄暮，公在飞雪亭畔，倚崖侧乔松，鸟瞰千丈岩瀑布。会大雨，树杪重泉，溅珠喷玉，光色甚奇。",
    "山水文句",
    "刘成禺《世载堂杂忆》",
    "李敖转引刘成禺写飞雪亭畔观瀑的游记文句。",
  ),
  q(
    "008.",
    265,
    "唯见众山之小、诸流之细，亭下（村名）屋舍俨然。",
    "山水文句",
    "刘成禺《世载堂杂忆》",
    "李敖转引刘成禺登妙高台所见的远眺文句。",
  ),
  q(
    "008.",
    267,
    "第一潭黝暗，在峡谷，圆径不过丈余，而深度莫测。",
    "山水文句",
    "刘成禺《世载堂杂忆》",
    "李敖转引刘成禺探隐潭时对第一潭的描写。",
  ),
  q(
    "008.",
    267,
    "峭壁回合，前面騞开，高可百米突，右有澄湍冲泻。叹为观止。",
    "山水文句",
    "刘成禺《世载堂杂忆》",
    "李敖转引刘成禺写第三潭岩穴与澄湍冲泻的景观。",
  ),
  q(
    "011.",
    15,
    "I should be glad if I could flatter myself that I came as near to the central idea of the occasion in two hours as you did in two minutes.",
    "演说评语",
    "爱德华·埃弗里特致林肯信",
    "李敖转引埃弗里特肯定林肯两分钟演说切中主旨的英文句子。",
  ),
  q(
    "011.",
    125,
    "林肯演说中的名言，原来是其来有自的！",
    "考证格言",
    "李敖论林肯名言来源",
    "李敖指出名言常有来历与承袭脉络。",
  ),
  q(
    "011.",
    129,
    "以前人对一种言论的所有权，并不像后来那样认真，中国的古圣先贤如此；美国的古圣先贤亦复如此。",
    "学术史格言",
    "李敖论名言所有权",
    "李敖说明前人对言论所有权的观念与现代不同。",
  ),
  q(
    "011.",
    137,
    "短的好处是简明，但坏处也就在此。",
    "写作格言",
    "李敖论林肯演说",
    "李敖以林肯演说为例说明简短文字的利弊。",
  ),
  q(
    "011.",
    155,
    "这要循着林肯的“思”路之旅，才能判断出他的真正意义。",
    "诠释方法",
    "李敖论翻译判断",
    "李敖主张翻译名言时应追踪原作者的思路。",
  ),
  q(
    "011.",
    193,
    "简明有余、明确不足",
    "翻译评语",
    "李敖论林肯名言中译",
    "李敖概括某些简化翻译的长处与不足。",
  ),
  q(
    "011.",
    229,
    "无心雕做木居士，便有无穷求福人",
    "俗语",
    "中国俗话",
    "李敖借俗话形容林肯应景演说后来被反复阐发。",
  ),
  q(
    "012.",
    23,
    "世界的范畴和事物哪有这么简单！在白与黑之间有灰，在白与黑之外有红、橙、青、蓝、紫。",
    "思辨格言",
    "殷海光《我对于三民主义的看法和建议》",
    "李敖转引殷海光批评二分法思想，强调世界范畴复杂。",
  ),
  q(
    "012.",
    25,
    "对思想学说只可研究，以定其对错或是否行得通。",
    "治学格言",
    "殷海光《我对于三民主义的看法和建议》",
    "李敖转引殷海光说明对思想学说应研究而非恭维或轻蔑。",
  ),
  q(
    "014.",
    85,
    "她们都自我牺牲，一个个功成不居，把自己隐藏在年复一年的沉默里。",
    "女性评语",
    "李敖论陈粹芬与大月熏",
    "李敖概括被历史遮蔽的女性自我牺牲与沉默。",
  ),
  q(
    "015.",
    17,
    "妻嫁从夫，今君既娶，从妇乎？",
    "讽刺问句",
    "《乱党之真相》转述粤人陈某语",
    "李敖转引陈某以反问讽刺从妻姓的轶语。",
  ),
  q(
    "015.",
    23,
    "孙君如夫人何以至今不放足？知足之论，均系欺人之语耳！",
    "讽刺问句",
    "《乱党之真相》转述湖南某生语",
    "李敖转引湖南某生以缠足问题反讽言行不一。",
  ),
  q(
    "015.",
    25,
    "望门投宿宅能之，亡命何曾见细儿。只有香菱贤国妪，能飘白发说微时。",
    "诗",
    "刘成禺题冯自由《革命逸史》诗",
    "李敖转引刘成禺写陈粹芬香菱往事的诗句。",
  ),
  q(
    "015.",
    43,
    "你最好把那种欲望升华",
    "婚恋劝诫",
    "唐纳语，《宋家王朝》转述",
    "李敖转引唐纳对孙逸仙的劝诫。",
  ),
  q(
    "015.",
    47,
    "宋嘉树是你最好的朋友。没有他，你好多次都已经陷入进退维谷的困境。对于蔼龄和其他小孩来说，你是他们的父执辈，他们几乎就是你的孩子。",
    "友情伦理",
    "唐纳语，《宋家王朝》转述",
    "李敖转引唐纳从朋友与父执伦理劝阻婚恋请求。",
  ),
  q(
    "015.",
    55,
    "我把我的孩子养大，绝不让他们过那种你所提议的放荡生活。我无法接受那些把婚姻当儿戏的人。我们是一个基督教家庭，愿天主保佑我们，我们将一直往这条路走。",
    "婚姻伦理",
    "宋嘉树语，《宋家王朝》转述",
    "李敖转引宋嘉树以基督徒家庭伦理拒绝把婚姻当儿戏。",
  ),
  q(
    "015.",
    77,
    "老兄，我一生中还没被如此伤害过。我自己的女儿和我最要好的朋友。",
    "伤情文句",
    "宋嘉树语，《宋家王朝》转述",
    "李敖转引宋嘉树谈亲友伤害的痛苦。",
  ),
  q(
    "015.",
    85,
    "最后杀死他的，可能是一颗破碎的心。",
    "伤情文句",
    "史特林·席格雷夫《宋家王朝》",
    "李敖转引席格雷夫以破碎的心形容宋嘉树之死。",
  ),
];

const proofreadExclusions = new Map([
  ["知之则必能行之，知之则更易行之", "知行短句已在前册以更完整形态处理；本处来自政治冲突评论，校对轮删去碎片化重复。"],
  ["瞻之在前，忽焉在后", "过短古典碎片，且只是政治人物讽刺语境中的借用，不单独保留。"],
  ["这要循着林肯的“思”路之旅，才能判断出他的真正意义。", "现代论文式过渡句，离开上下文不够自然，校对轮删去。"],
  ["简明有余、明确不足", "四字式评语过短，像摘要标签而非独立诗文格言。"],
  [
    "世界的范畴和事物哪有这么简单！在白与黑之间有灰，在白与黑之外有红、橙、青、蓝、紫。",
    "来自三民主义统战文章的意识形态辨析段；虽可泛用，但校对轮按政治语境从严删去。",
  ],
  [
    "对思想学说只可研究，以定其对错或是否行得通。",
    "来自三民主义统战文章的思想学说判断，政治语境过重，校对轮删去。",
  ],
  ["你最好把那种欲望升华", "婚恋场景中的短对话残句，不够独立完整。"],
  ["老兄，我一生中还没被如此伤害过。我自己的女儿和我最要好的朋友。", "情节性对话，主要价值在传记场景而非格言或诗文。"],
]);

const proofreadAdditions = [
  q(
    "001.",
    45,
    "求其洞见本原、深明大略者，有几人哉？",
    "见识格言",
    "郑观应《盛世危言》自序",
    "李敖转引郑观应感叹能洞见本原、深明大略者难得。",
    45,
    "校对轮补入：同段较政治口号更干净，作为见识与治学方法句可独立引用。",
  ),
];

const modernPoliticalTerms = [
  "国民党",
  "共产党",
  "中共",
  "三民主义",
  "统战",
  "革命",
  "反共",
  "党国",
  "党部",
  "总统",
  "中华民国",
  "政府",
  "政体",
  "宪政",
  "选举",
  "国会",
  "国庆",
  "双十",
  "北伐",
  "军阀",
  "戒严",
  "蒋介石",
  "蒋中正",
  "陈炯明",
  "苏俄",
  "联俄",
  "容共",
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function rowToCsv(row) {
  return [
    row.id,
    row.book,
    row.chapter,
    row.source_file,
    row.line_start,
    row.line_end,
    row.quote_text,
    row.category,
    row.source_or_origin,
    row.summary,
    row.notes,
  ]
    .map(csvEscape)
    .join(",");
}

function quotePresent(row) {
  const source = sourceCache.get(row.source_file);
  const slice = source.lines.slice(row.line_start - 1, row.line_end).join("\n");
  return normalizeText(slice).includes(normalizeText(row.quote_text));
}

function hasPoliticalHit(row) {
  return modernPoliticalTerms.filter((term) => row.quote_text.includes(term));
}

const fileIndex = new Map(files.map((file, index) => [file, index]));
function rowCompare(a, b) {
  const fileDiff = fileIndex.get(a.source_file) - fileIndex.get(b.source_file);
  if (fileDiff) return fileDiff;
  if (a.line_start !== b.line_start) return a.line_start - b.line_start;
  return a.quote_text.localeCompare(b.quote_text, "zh-Hans-CN");
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

const auditRows = rows.map((row) => {
  const present = quotePresent(row);
  const politicalHits = hasPoliticalHit(row);
  return { row, present, politicalHits };
});

const missing = auditRows.filter((item) => !item.present);
const politicalHits = auditRows.filter((item) => item.politicalHits.length > 0);
const duplicateTexts = new Map();
for (const row of rows) {
  const key = normalizeText(row.quote_text);
  duplicateTexts.set(key, (duplicateTexts.get(key) || 0) + 1);
}
const duplicates = rows.filter((row) => duplicateTexts.get(normalizeText(row.quote_text)) > 1);

if (missing.length) {
  throw new Error(`Missing quote text in source: ${missing.map((item) => item.row.id).join(", ")}`);
}
if (duplicates.length) {
  throw new Error(`Duplicate quote text in ${book}: ${duplicates.map((row) => row.id).join(", ")}`);
}

fs.mkdirSync(path.dirname(outCsv), { recursive: true });
fs.mkdirSync(path.dirname(selectedJson), { recursive: true });

const header = [
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
].join(",");

fs.writeFileSync(outCsv, `${header}\n${rows.map(rowToCsv).join("\n")}\n`, "utf8");

const txt = rows
  .map((row) =>
    [
      `${row.id}｜${row.category}｜${row.source_file}:${row.line_start}-${row.line_end}`,
      `引用：${row.quote_text}`,
      `出处线索：${row.source_or_origin}`,
      `说明：${row.summary}`,
      row.notes ? `备注：${row.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n\n");
fs.writeFileSync(outTxt, `${book} 诗文格言歌谣引用\n生成日期：${generatedDate}\n条目数：${rows.length}\n\n${txt}\n`, "utf8");

fs.writeFileSync(selectedJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

fs.writeFileSync(
  reviewTsv,
  [
    "id\tsource_file\tline_start\tline_end\tcategory\tquote_text\tsource_or_origin\tsummary\tnotes",
    ...rows.map((row) =>
      [
        row.id,
        row.source_file,
        row.line_start,
        row.line_end,
        row.category,
        row.quote_text,
        row.source_or_origin,
        row.summary,
        row.notes,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

fs.writeFileSync(
  auditTsv,
  [
    "id\tsource_file\tline_start\tline_end\tpresent\tpolitical_hits\tquote_text",
    ...auditRows.map((item) =>
      [
        item.row.id,
        item.row.source_file,
        item.row.line_start,
        item.row.line_end,
        item.present ? "yes" : "no",
        item.politicalHits.join("|"),
        item.row.quote_text,
      ].join("\t"),
    ),
  ].join("\n") + "\n",
  "utf8",
);

function tsvCell(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

fs.writeFileSync(
  proofreadAuditTsv,
  [
    "action\tid_or_source\tquote_text\treason",
    `before\t\t\t${rawRows.length}`,
    ...proofreadRemovedRows.map((row) =>
      ["removed", row.original_id, row.quote_text, row.reason].map(tsvCell).join("\t"),
    ),
    ...proofreadAdditions.map((row) =>
      ["added", `${row.source_file}:${row.line_start}-${row.line_end}`, row.quote_text, row.notes].map(tsvCell).join("\t"),
    ),
    `after\t\t\t${rows.length}`,
  ].join("\n") + "\n",
  "utf8",
);

const candidatesData = fs.existsSync(candidatesJson) ? JSON.parse(fs.readFileSync(candidatesJson, "utf8")) : null;
const candidatesCount = Array.isArray(candidatesData)
  ? candidatesData.length
  : candidatesData?.quoteCandidates?.length ?? "missing";
const reviewCandidateLines = fs.existsSync(reviewCandidatesTsv)
  ? fs.readFileSync(reviewCandidatesTsv, "utf8").trim().split(/\r?\n/).length - 1
  : "missing";
const attributedLines = fs.existsSync(attributedTsv)
  ? fs.readFileSync(attributedTsv, "utf8").trim().split(/\r?\n/).length
  : "missing";

fs.writeFileSync(
  reportTxt,
  [
    `${book} proofread extraction report`,
    `generatedDate: ${generatedDate}`,
    `sourceDir: ${sourceDir}`,
    `sourceFiles: ${files.length}`,
    `quoteCandidates: ${candidatesCount}`,
    `reviewCandidates: ${reviewCandidateLines}`,
    `attributedLines: ${attributedLines}`,
    `rawRows: ${rawRows.length}`,
    `proofreadRemovedRows: ${proofreadRemovedRows.length}`,
    `proofreadAddedRows: ${proofreadAdditions.length}`,
    `selectedRows: ${rows.length}`,
    `missingQuotes: ${missing.length}`,
    `duplicateTexts: ${duplicates.length}`,
    `politicalHitRows: ${politicalHits.length}`,
    "policy: exclude political slogans, party/government claims, revolutionary doctrine, elections, national-day/flag rhetoric, and modern political attacks; keep only independently reusable literary, historical-method, translation, ethical, religious, scenic, and classical-proverb material.",
    "",
    "proofreadRemovedRows:",
    ...proofreadRemovedRows.map(
      (row) => `${row.original_id}\t${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}\t${row.reason}`,
    ),
    "",
    "proofreadAddedRows:",
    ...proofreadAdditions.map((row) => `${row.source_file}:${row.line_start}-${row.line_end}\t${row.quote_text}`),
  ].join("\n") + "\n",
  "utf8",
);
fs.writeFileSync(proofreadReportTxt, fs.readFileSync(reportTxt, "utf8"), "utf8");

console.log(
  JSON.stringify(
    {
      book,
      rawRows: rawRows.length,
      proofreadRemovedRows: proofreadRemovedRows.length,
      proofreadAddedRows: proofreadAdditions.length,
      rows: rows.length,
      missing: missing.length,
      duplicates: duplicates.length,
      politicalHitRows: politicalHits.length,
      outCsv,
      outTxt,
      selectedJson,
      reviewTsv,
      auditTsv,
      reportTxt,
      proofreadAuditTsv,
      proofreadReportTxt,
    },
    null,
    2,
  ),
);
