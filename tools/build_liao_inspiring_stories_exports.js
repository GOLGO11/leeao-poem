const fs = require('fs');
const path = require('path');
const { TextDecoder } = require('util');

const ROOT = path.resolve(__dirname, '..');
const BOOK = '启发你的小故事';
const SOURCE_DIR = path.join(ROOT, '《大李敖全集6.0》分章节', '016.李敖祸台五十年庆祝十书', `005.${BOOK}`);
const OUT_CSV = path.join(ROOT, 'exports', `${BOOK}_诗文格言歌谣引用.csv`);
const OUT_TXT = path.join(ROOT, 'exports', `${BOOK}_诗文格言歌谣引用.txt`);
const OUT_JSON = path.join(ROOT, 'analysis', 'liao_inspiring_stories_selected_rows.json');
const REPORT_JSON = path.join(ROOT, 'analysis', 'liao_inspiring_stories_proofread_build_report.json');
const REJECTS_JSON = path.join(ROOT, 'analysis', 'liao_inspiring_stories_proofread_rejects.json');
const ID_PREFIX = 'INSP';
const decoder = new TextDecoder('gb18030');

const POLITICAL_PATTERN = /(国家|中国|台湾|中华|台独|统一|民主|自由|政府|政权|政治|政党|国民党|民进党|共产党|共匪|匪谍|选举|候选|总统|宪法|革命|主义|意识形态|行政院|立法院|国会|党国|人权|司法|法院|中共|大陆|祖国|爱国)/i;

function normalizeText(value) {
  return String(value || '')
    .replace(/[\uFEFF\r]/g, '')
    .replace(/[“”‘’「」『』]/g, '')
    .replace(/\s+/g, '');
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function readText(filePath) {
  return decoder.decode(fs.readFileSync(filePath)).replace(/^\uFEFF/, '');
}

function sourceFiles() {
  return fs.readdirSync(SOURCE_DIR)
    .filter((name) => name.endsWith('.txt') && !name.includes('目录'))
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
}

function fileByPrefix(prefix) {
  const file = sourceFiles().find((name) => name.startsWith(prefix));
  if (!file) throw new Error(`Missing source file for prefix ${prefix}`);
  return file;
}

function locate(row) {
  const file = row.filePrefix === 'preface' ? `《${BOOK}》题辞.txt` : fileByPrefix(row.filePrefix);
  const filePath = path.join(SOURCE_DIR, file);
  const text = readText(filePath);
  const lines = text.split(/\n/);
  const needle = normalizeText(row.quote_text);
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
      let combined = '';
      for (let end = start; end < Math.min(lines.length, start + 12); end += 1) {
        combined += lines[end];
        if (normalizeText(combined).includes(needle)) {
          const candidate = {
            line_start: start + 1,
            line_end: end + 1,
            context: lines.slice(start, end + 1).map((line) => line.trim()).filter(Boolean).join(' '),
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
    const normalizedText = normalizeText(text);
    if (!normalizedText.includes(needle)) throw new Error(`Quote not found in ${file}: ${row.quote_text}`);
    best = { line_start: '', line_end: '', context: '' };
  }
  return { file, ...best };
}

const rows = [
  { filePrefix: 'preface', quote_text: '喜欢借题发挥', category: '格言', source_attribution: '胡适', notes: '题辞中引胡适语，独立成句。' },
  { filePrefix: 'preface', quote_text: '言近旨远', category: '格言', source_attribution: '成语', notes: '题辞中概括“小故事”的文体旨趣。' },

  { filePrefix: '001.', quote_text: '画影图形', category: '格言', source_attribution: '成语', notes: '比喻依图索人。' },
  { filePrefix: '001.', quote_text: '验明正身', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '001.', quote_text: '一穷二白', category: '格言', source_attribution: '成语', notes: '生活贫乏的俗语化表达。' },
  { filePrefix: '001.', quote_text: '我们家早起刷牙，买不起牙粉，更买不起牙膏，只能用盐水刷牙，哪有余钱去日月潭呢？', category: '格言', source_attribution: '李敖父亲', notes: '家庭小故事中的机智答语。' },

  { filePrefix: '002.', quote_text: '无友不如己者', category: '格言', source_attribution: '《论语》', notes: '交友名句。' },
  { filePrefix: '002.', quote_text: '友直、友谅、友多闻', category: '格言', source_attribution: '《论语》', notes: '益友标准。' },
  { filePrefix: '002.', quote_text: '友天下之善士。', category: '格言', source_attribution: '《孟子》', notes: '交友层次。' },
  { filePrefix: '002.', quote_text: '友天下之善士为未足，又尚论古人。', category: '格言', source_attribution: '《孟子》', notes: '尚友古人之说。' },
  { filePrefix: '002.', quote_text: '既幸予得见王珣，又幸珣书不尽湮没，得见吾也！', category: '格言', source_attribution: '米芾', notes: '赏王珣书法语。' },
  { filePrefix: '002.', quote_text: '天下善士是可遇而不可求', category: '格言', source_attribution: '李敖', notes: '由交友古训引申出的断语。' },
  { filePrefix: '002.', quote_text: '醉卧沙场', category: '诗文', source_attribution: '王翰《凉州词》', notes: '诗句典故片语。' },

  { filePrefix: '003.', quote_text: '八仙过海、各有各的神通', category: '格言', source_attribution: '俗语', notes: '各显本领。' },
  { filePrefix: '003.', quote_text: '生财有道', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '003.', quote_text: '仰事俯蓄', category: '格言', source_attribution: '成语', notes: '养家糊口典故。' },
  { filePrefix: '003.', quote_text: '焉知非福', category: '格言', source_attribution: '成语', notes: '塞翁失马类成语。' },
  { filePrefix: '003.', quote_text: '有目共睹', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '003.', quote_text: '铁面无私', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '003.', quote_text: '板板六十四', category: '格言', source_attribution: '俗语', notes: '不通融的俗语。' },
  { filePrefix: '003.', quote_text: '涓滴归公', category: '格言', source_attribution: '成语', notes: '公私分明。' },

  { filePrefix: '004.', quote_text: '有善走者，家中被窃，遂逐之，行步如飞。', category: '诗文', source_attribution: '《哈哈笑》', notes: '旧笑话开端。' },
  { filePrefix: '004.', quote_text: '君何往？', category: '诗文', source_attribution: '《哈哈笑》', notes: '旧笑话问句。' },
  { filePrefix: '004.', quote_text: '逐贼耳！', category: '诗文', source_attribution: '《哈哈笑》', notes: '旧笑话答句。' },
  { filePrefix: '004.', quote_text: '贼在何处？', category: '诗文', source_attribution: '《哈哈笑》', notes: '旧笑话问句。' },
  { filePrefix: '004.', quote_text: '在后面，在后面。', category: '诗文', source_attribution: '《哈哈笑》', notes: '旧笑话妙处。' },
  { filePrefix: '004.', quote_text: '追过了头', category: '格言', source_attribution: '李敖', notes: '由旧笑话引出的警句。' },

  { filePrefix: '005.', quote_text: '霸王饭', category: '格言', source_attribution: '俗语', notes: '“请客”花样之一。' },
  { filePrefix: '005.', quote_text: '巴米塞得饭', category: '格言', source_attribution: 'Barmecide feast', notes: '西方典故译名。' },
  { filePrefix: '005.', quote_text: 'Barmecide feast', category: '格言', source_attribution: '英语典故', notes: '空请客之典。' },
  { filePrefix: '005.', quote_text: '我吃过了，我请你客，就是专门请你自己吃，我不吃，我还是吃我在班里不要钱的大锅饭。', category: '格言', source_attribution: '李敖同学', notes: '穷学生请客笑谈。' },
  { filePrefix: '005.', quote_text: '要小杯的！', category: '格言', source_attribution: '旧同学笑谈', notes: '请客故事中的反转。' },
  { filePrefix: '005.', quote_text: '请客花样多端，其为学也，大矣！', category: '格言', source_attribution: '李敖', notes: '由小故事抽出的俏皮断语。' },

  { filePrefix: '006.', quote_text: '这可不一定。一山比一山高。', category: '格言', source_attribution: '擦鞋者', notes: '小人物机锋。' },
  { filePrefix: '006.', quote_text: '一山比一山高', category: '格言', source_attribution: '俗语', notes: '常用俗语。' },
  { filePrefix: '006.', quote_text: '何世无奇才，遗之在草泽！', category: '格言', source_attribution: '李敖', notes: '感叹民间人才。' },
  { filePrefix: '006.', quote_text: '卖柑者言', category: '诗文', source_attribution: '刘基', notes: '借古文篇名作典。' },

  { filePrefix: '007.', quote_text: '孤陋寡闻', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '007.', quote_text: '谁是涂咪咪？', category: '格言', source_attribution: '小故事问句', notes: '以无知反成笑点。' },

  { filePrefix: '008.', quote_text: '太岁头上动土', category: '格言', source_attribution: '俗语', notes: '常用俗语。' },
  { filePrefix: '008.', quote_text: '本末的倒置', category: '格言', source_attribution: '李敖', notes: '仿“本末倒置”的评论语。' },
  { filePrefix: '008.', quote_text: '滑稽', category: '格言', source_attribution: '常用语', notes: '文本中用作评语。' },
  { filePrefix: '008.', quote_text: '誉满士林、荣于华衮', category: '格言', source_attribution: '成语化赞语', notes: '赞誉文字。' },

  { filePrefix: '009.', quote_text: '画屋充住', category: '格言', source_attribution: '李敖', notes: '仿“画饼充饥”的自造警句。' },

  { filePrefix: '010.', quote_text: '吞云吐雾', category: '格言', source_attribution: '成语', notes: '吸烟俗称。' },
  { filePrefix: '010.', quote_text: '舍本逐末', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '010.', quote_text: '我有意志力，他们没有！', category: '格言', source_attribution: '戒烟者', notes: '戒烟故事中的关键话。' },
  { filePrefix: '010.', quote_text: '一念之转', category: '格言', source_attribution: '成语', notes: '心念一转。' },
  { filePrefix: '010.', quote_text: '一个名人的戒烟故事，胜于三天的课程训练。', category: '格言', source_attribution: '李敖', notes: '故事启发式断语。' },

  { filePrefix: '011.', quote_text: '先天下之忧而忧', category: '诗文', source_attribution: '范仲淹《岳阳楼记》', notes: '经典名句。' },
  { filePrefix: '011.', quote_text: '苛政猛于虎', category: '格言', source_attribution: '《礼记》', notes: '古代名言。' },
  { filePrefix: '011.', quote_text: '大丈夫岂可火烧自己才讲话！', category: '格言', source_attribution: '李敖', notes: '题旨句，排除上下文政治段落后保留。' },

  { filePrefix: '012.', quote_text: '调十万天兵，天罗地网收伏', category: '诗文', source_attribution: '《西游记》', notes: '神魔小说语。' },
  { filePrefix: '012.', quote_text: '陛下宽心，贫僧举一神，可擒这猴。', category: '诗文', source_attribution: '《西游记》', notes: '神魔小说语。' },
  { filePrefix: '012.', quote_text: '乃陛下令甥显圣二郎真君。', category: '诗文', source_attribution: '《西游记》', notes: '神魔小说语。' },
  { filePrefix: '012.', quote_text: '斧劈桃山曾救母', category: '诗文', source_attribution: '《西游记》', notes: '二郎神典故。' },
  { filePrefix: '012.', quote_text: '自有兄弟扶持', category: '格言', source_attribution: '《西游记》', notes: '文本中引申作帮手。' },
  { filePrefix: '012.', quote_text: '自有兄弟动手', category: '格言', source_attribution: '李敖', notes: '仿《西游记》句式。' },
  { filePrefix: '012.', quote_text: '又一个爷爷来了。', category: '诗文', source_attribution: '《西游记》', notes: '小说俏皮语。' },
  { filePrefix: '012.', quote_text: '有个什么齐天大圣，才来这里否？', category: '诗文', source_attribution: '《西游记》', notes: '小说问句。' },
  { filePrefix: '012.', quote_text: '不曾见什么大圣，只有一个爷爷在里面查点哩。', category: '诗文', source_attribution: '《西游记》', notes: '小说答句。' },
  { filePrefix: '012.', quote_text: '郎君不消嚷，庙宇已姓孙了。', category: '诗文', source_attribution: '《西游记》', notes: '小说妙语。' },
  { filePrefix: '012.', quote_text: '你到我家来，我到你家去', category: '格言', source_attribution: '李敖', notes: '互换处境的概括。' },
  { filePrefix: '012.', quote_text: '等我丢下去打他一下。', category: '诗文', source_attribution: '《西游记》', notes: '哮天犬故事语。' },
  { filePrefix: '012.', quote_text: '这个亡人！你不去妨家长，却来咬老孙！', category: '诗文', source_attribution: '《西游记》', notes: '小说骂语。' },
  { filePrefix: '012.', quote_text: '你这个霉星高照的死鬼！不去使你主人倒霉，来咬我老孙干什么！', category: '诗文', source_attribution: '李敖译述《西游记》语意', notes: '文本中的现代白话转述。' },
  { filePrefix: '012.', quote_text: '譬之畜狗，本取其吠', category: '格言', source_attribution: '古语', notes: '看家犬譬喻。' },
  { filePrefix: '012.', quote_text: '作一看家恶犬', category: '格言', source_attribution: '古语', notes: '承接“畜狗”之譬。' },
  { filePrefix: '012.', quote_text: '我是神仙、老虎、狗。', category: '格言', source_attribution: '监狱看守故事', notes: '身份转换的笑谈。' },
  { filePrefix: '012.', quote_text: '我一看到老婆，就是神仙；我一看到囚犯，就是老虎；我一看到长官，就是狗。', category: '格言', source_attribution: '监狱看守故事', notes: '小故事完整笑点。' },
  { filePrefix: '012.', quote_text: '犯而不校', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '012.', quote_text: '小人无忌惮', category: '格言', source_attribution: '古语', notes: '比照“君子有戒惧”。' },
  { filePrefix: '012.', quote_text: '投鼠忌器', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '012.', quote_text: '兵来将挡，水来土掩', category: '格言', source_attribution: '俗语', notes: '常用俗语。' },
  { filePrefix: '012.', quote_text: '割肉度群魔', category: '诗文', source_attribution: '佛教故事', notes: '舍身饲虎类典故。' },
  { filePrefix: '012.', quote_text: '金刚怒目', category: '格言', source_attribution: '佛教成语', notes: '慈悲之外的威怒。' },

  { filePrefix: '013.', quote_text: '柳下惠为士师，三黜。', category: '诗文', source_attribution: '《孟子》', notes: '柳下惠典故。' },
  { filePrefix: '013.', quote_text: '俗藉惠以解免耳！是即晋世王敦、王导之事也。惠去，则跖必入鲁。鲁之君相无以御之。', category: '诗文', source_attribution: '古人评柳下惠', notes: '对柳下惠不去的解释。' },
  { filePrefix: '013.', quote_text: '数黜而复起', category: '格言', source_attribution: '成语化表述', notes: '屡挫屡起。' },
  { filePrefix: '013.', quote_text: '空城计', category: '格言', source_attribution: '三国典故', notes: '常用典故。' },
  { filePrefix: '013.', quote_text: '将计就计', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '013.', quote_text: '优哉游哉', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '013.', quote_text: '衣食父母', category: '格言', source_attribution: '俗语', notes: '常用俗语。' },
  { filePrefix: '013.', quote_text: '共生', category: '格言', source_attribution: 'symbiosis', notes: '生物学譬喻。' },

  { filePrefix: '014.', quote_text: '官逼民反', category: '格言', source_attribution: '成语', notes: '古今通用成语。' },
  { filePrefix: '014.', quote_text: '上帝不准缴白卷！', category: '格言', source_attribution: '李敖', notes: '人生责任式断语。' },
  { filePrefix: '014.', quote_text: '人我两便', category: '格言', source_attribution: '成语', notes: '两方便利。' },
  { filePrefix: '014.', quote_text: '东张西望', category: '格言', source_attribution: '成语', notes: '常用成语。' },

  { filePrefix: '015.', quote_text: '力，恶其不出于身也，不必为己', category: '格言', source_attribution: '《礼记·礼运》', notes: '大同篇语。' },
  { filePrefix: '015.', quote_text: '货，恶其弃于地也，不必藏于己', category: '格言', source_attribution: '《礼记·礼运》', notes: '大同篇语。' },

  { filePrefix: '016.', quote_text: '怀忧丧志', category: '格言', source_attribution: '成语', notes: '题旨词。' },
  { filePrefix: '016.', quote_text: '造次必于是、颠沛必于是', category: '格言', source_attribution: '《论语》', notes: '君子守仁。' },
  { filePrefix: '016.', quote_text: '吴公差强人意，隐若一敌国矣！', category: '格言', source_attribution: '《后汉书》', notes: '差强人意原典相关。' },
  { filePrefix: '016.', quote_text: '失其常度', category: '格言', source_attribution: '成语', notes: '遇事失常。' },
  { filePrefix: '016.', quote_text: '意气自若', category: '格言', source_attribution: '成语', notes: '遇变从容。' },
  { filePrefix: '016.', quote_text: '方整厉器械，激扬士吏', category: '格言', source_attribution: '《后汉书》', notes: '吴汉从容备战语。' },
  { filePrefix: '016.', quote_text: '奸雄有一个大特色，就是永不泄气，永远战斗个没完。', category: '格言', source_attribution: '李敖', notes: '人性观察，非政治口号。' },
  { filePrefix: '016.', quote_text: '好人在家里叹气，恶人在台上唱戏。', category: '格言', source_attribution: '李敖', notes: '强弱反差的警句。' },
  { filePrefix: '016.', quote_text: '坚忍不拔', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '016.', quote_text: '越挫越奋', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '016.', quote_text: '差强人意', category: '格言', source_attribution: '成语', notes: '常用成语。' },

  { filePrefix: '017.', quote_text: '贪多务得，细大不捐', category: '格言', source_attribution: '韩愈', notes: '资料搜集的古文譬喻。' },
  { filePrefix: '017.', quote_text: '俱收并蓄，待用无遗者', category: '格言', source_attribution: '韩愈', notes: '资料搜集的古文譬喻。' },
  { filePrefix: '017.', quote_text: '言之无物', category: '格言', source_attribution: '成语', notes: '文章病。' },
  { filePrefix: '017.', quote_text: "You can't beat something with nothing", category: '格言', source_attribution: '英语格言', notes: '不能以空无击败有物。' },
  { filePrefix: '017.', quote_text: '没有东西', category: '格言', source_attribution: '李敖译述', notes: '承接英语格言。' },
  { filePrefix: '017.', quote_text: '有些东西', category: '格言', source_attribution: '李敖译述', notes: '承接英语格言。' },
  { filePrefix: '017.', quote_text: '根本无兄，何来盗嫂？丈人成鬼，何处施拳？', category: '格言', source_attribution: '李敖', notes: '以资料反驳传闻的俏皮断语。' },
  { filePrefix: '017.', quote_text: '不攻自破', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '017.', quote_text: '宁肯失之过滥，不肯失之交臂。', category: '格言', source_attribution: '李敖', notes: '资料搜集原则。' },

  { filePrefix: '019.', quote_text: '一年之计，莫如树谷；十年之计，莫如树木；终身之计，莫如树人。', category: '格言', source_attribution: '《管子》', notes: '树人名句。' },
  { filePrefix: '019.', quote_text: '终身之计，莫如树“敌”', category: '格言', source_attribution: '李敖', notes: '仿“树人”自造警句。' },
  { filePrefix: '019.', quote_text: '不交忘恩负义、还倒打一耙之人', category: '格言', source_attribution: '李敖', notes: '交友警句。' },
  { filePrefix: '019.', quote_text: '息交以绝游', category: '诗文', source_attribution: '陶渊明《归去来兮辞》', notes: '古文名句。' },
  { filePrefix: '019.', quote_text: '一个不可靠的朋友，就是一个敌人', category: '格言', source_attribution: '列宁', notes: '人际关系警句；内容不作政治口号。' },
  { filePrefix: '019.', quote_text: '他有求于你，十件事，你答应了九件，一件没答应他，你那十分之九的辛苦，就丢给狗吃了', category: '格言', source_attribution: '李敖', notes: '人情经验警句。' },
  { filePrefix: '019.', quote_text: '以交友为苦，以树敌为荣', category: '格言', source_attribution: '李敖', notes: '反常识式格言。' },
  { filePrefix: '019.', quote_text: '六亲不认', category: '格言', source_attribution: '成语', notes: '常用成语。' },

  { filePrefix: '020.', quote_text: '单面的道德', category: '格言', source_attribution: '李敖', notes: '题旨概念。' },
  { filePrefix: '020.', quote_text: '我打你，不许你还手；骂你，不许你还口；杀你，不许你流血。', category: '格言', source_attribution: '李敖', notes: '概括单向道德。' },
  { filePrefix: '020.', quote_text: '单面的道德，说破了，其实就是伪君子的道德。', category: '格言', source_attribution: '李敖', notes: '题旨断语。' },
  { filePrefix: '020.', quote_text: '你不是清教徒呀！你怎么不上去打，上去保护我们呀！', category: '格言', source_attribution: '牛津笑话', notes: '清教徒故事笑点。' },
  { filePrefix: '020.', quote_text: '从我这一边看来，羊的这一面是白的。', category: '格言', source_attribution: '英国故事', notes: '视角限定的警句。' },

  { filePrefix: '022.', quote_text: '出淤泥而不染', category: '诗文', source_attribution: '周敦颐《爱莲说》', notes: '经典名句。' },
  { filePrefix: '022.', quote_text: '人在江湖', category: '格言', source_attribution: '俗语', notes: '处境俗语。' },

  { filePrefix: '023.', quote_text: '前途光明，没有出路', category: '格言', source_attribution: '李敖', notes: '悖论式警句。' },
  { filePrefix: '023.', quote_text: '我们是最有勇气的人！', category: '格言', source_attribution: '小故事语', notes: '自嘲式勇气。' },

  { filePrefix: '024.', quote_text: '虽千万人，吾往矣', category: '格言', source_attribution: '《孟子》', notes: '经典名句。' },
  { filePrefix: '024.', quote_text: '盗亦有道', category: '格言', source_attribution: '《庄子》', notes: '经典成语。' },
  { filePrefix: '024.', quote_text: '侠盗罗宾汉', category: '格言', source_attribution: 'Robin Hood', notes: '文学典型。' },
  { filePrefix: '024.', quote_text: '侠骨柔情', category: '格言', source_attribution: '成语化表述', notes: '侠义人物特质。' },
  { filePrefix: '024.', quote_text: '埋我在箭落的地方。', category: '格言', source_attribution: 'Robin Hood', notes: '罗宾汉传说遗言。' },
  { filePrefix: '024.', quote_text: 'Lay me where the arrow drops.', category: '格言', source_attribution: 'Robin Hood', notes: '罗宾汉传说英文句。' },

  { filePrefix: '025.', quote_text: '不团结就是力量', category: '格言', source_attribution: '李敖', notes: '反讽式格言。' },
  { filePrefix: '025.', quote_text: '大德不拘细谨，大礼不辞小让', category: '格言', source_attribution: '《史记》', notes: '古文名句。' },
  { filePrefix: '025.', quote_text: '盲人骑瞎马，夜半临深池', category: '格言', source_attribution: '《世说新语》', notes: '危险处境名句。' },
  { filePrefix: '025.', quote_text: '先有一些失败的磨练未尝不是好事。', category: '格言', source_attribution: '李敖', notes: '经验警句。' },

  { filePrefix: '028.', quote_text: '我愿你私下在厕所骂我，公开在街上向我道歉。', category: '格言', source_attribution: '李敖', notes: '公开道歉的妙语。' },
  { filePrefix: '028.', quote_text: '前倨后恭', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '028.', quote_text: '死不瞑目', category: '格言', source_attribution: '成语', notes: '常用成语。' },

  { filePrefix: '029.', quote_text: '祈战死', category: '诗文', source_attribution: '旧题辞', notes: '旧时代题辞语。' },
  { filePrefix: '029.', quote_text: '车辚辚，马萧萧，行人弓箭各在腰。爷娘妻子走相送，尘埃不见咸阳桥；牵衣顿足拦道哭，哭声直上干云霄。', category: '诗文', source_attribution: '杜甫《兵车行》', notes: '诗句长引。' },
  { filePrefix: '029.', quote_text: '一点点生活的不舒适，不要看作是苦刑。', category: '格言', source_attribution: '甘地', notes: '忍受不适的格言；未收政治段落。' },

  { filePrefix: '030.', quote_text: '这年头，不好过，没法子！', category: '格言', source_attribution: '鹦鹉故事', notes: '小故事对白。' },
  { filePrefix: '030.', quote_text: '心怀归而勿果，徒怨毒于一隅。', category: '诗文', source_attribution: '祢衡《鹦鹉赋》', notes: '赋文句。' },
  { filePrefix: '030.', quote_text: '讬轻鄙之微命，委陋贱之薄躯。', category: '诗文', source_attribution: '祢衡《鹦鹉赋》', notes: '赋文句。' },
  { filePrefix: '030.', quote_text: '期守死以报德，甘尽辞以效愚。', category: '诗文', source_attribution: '祢衡《鹦鹉赋》', notes: '赋文句。' },
  { filePrefix: '030.', quote_text: '恃隆恩于既往，庶弥久而不渝。', category: '诗文', source_attribution: '祢衡《鹦鹉赋》', notes: '赋文句。' },
  { filePrefix: '030.', quote_text: '赋成鹦鹉忽忧生，语做啾啾燕雀声。辜负大儿孔文举，枉将一鹗与题评。', category: '诗文', source_attribution: '古人题祢衡', notes: '咏祢衡诗。' },
  { filePrefix: '030.', quote_text: '赋中多求哀乞怜语。', category: '格言', source_attribution: '古人评《鹦鹉赋》', notes: '评语。' },
  { filePrefix: '030.', quote_text: '含情去说牢中事，鹦鹉前头也敢言', category: '诗文', source_attribution: '题诗', notes: '鹦鹉故事诗句。' },
  { filePrefix: '030.', quote_text: '鸟语人言', category: '格言', source_attribution: '成语化表述', notes: '借鹦鹉故事成语化。' },

  { filePrefix: '032.', quote_text: '忠孝仁爱信义和平', category: '格言', source_attribution: '传统德目', notes: '德目排列。' },
  { filePrefix: '032.', quote_text: '所恶有甚于死者，故患有所不辟也', category: '格言', source_attribution: '《孟子》', notes: '舍生取义相关名句。' },
  { filePrefix: '032.', quote_text: '患有所不辟', category: '格言', source_attribution: '《孟子》', notes: '名句片语。' },
  { filePrefix: '032.', quote_text: '跳出油锅，又入火坑', category: '格言', source_attribution: '俗语', notes: '处境俗语。' },

  { filePrefix: '033.', quote_text: '见怪不怪', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '033.', quote_text: '吾从众', category: '格言', source_attribution: '《论语》', notes: '从众名句片语。' },
  { filePrefix: '033.', quote_text: '宰相归田，囊底无钱，宁肯为盗，不肯伤廉。', category: '诗文', source_attribution: '陶谷', notes: '诗句。' },
  { filePrefix: '033.', quote_text: '不亦宜乎', category: '格言', source_attribution: '古文句式', notes: '反诘式古语。' },
  { filePrefix: '033.', quote_text: '取不伤廉', category: '格言', source_attribution: '成语化表述', notes: '取财而不伤廉。' },

  { filePrefix: '034.', quote_text: '无毒不丈夫', category: '格言', source_attribution: '俗语', notes: '常用俗语。' },
  { filePrefix: '034.', quote_text: '问道于盲', category: '格言', source_attribution: '成语', notes: '常用成语。' },

  { filePrefix: '035.', quote_text: '蓦然回首', category: '诗文', source_attribution: '辛弃疾《青玉案》', notes: '词句片语。' },
  { filePrefix: '035.', quote_text: '远路不须愁日暮', category: '诗文', source_attribution: '诗句', notes: '文中引诗。' },
  { filePrefix: '035.', quote_text: '落红原非无情物，化为春泥又护花', category: '诗文', source_attribution: '龚自珍句改字', notes: '文中误引“落红不是无情物”。' },
  { filePrefix: '035.', quote_text: '阴魂不散', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '035.', quote_text: '良非易事', category: '格言', source_attribution: '古文句式', notes: '不容易之意。' },

  { filePrefix: '036.', quote_text: '小国寡民', category: '格言', source_attribution: '《老子》', notes: '老子名句。' },
  { filePrefix: '036.', quote_text: '摄乎大国之间', category: '格言', source_attribution: '《孟子》', notes: '夹在强势之间的古语。' },
  { filePrefix: '036.', quote_text: '置之死地而后生', category: '格言', source_attribution: '《孙子》', notes: '经典兵法语。' },
  { filePrefix: '036.', quote_text: '以寡击众、以少胜多', category: '格言', source_attribution: '成语', notes: '战例概括。' },
  { filePrefix: '036.', quote_text: '以一当百、以一当千、以一当万', category: '格言', source_attribution: '成语', notes: '夸张形容勇力。' },

  { filePrefix: '037.', quote_text: '以德报怨', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '037.', quote_text: '不念旧恶', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '037.', quote_text: '瞒天过海', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '037.', quote_text: '曲学阿世', category: '格言', source_attribution: '成语', notes: '学术迎合世俗。' },
  { filePrefix: '037.', quote_text: '胡说八道', category: '格言', source_attribution: '俗语', notes: '常用俗语。' },
  { filePrefix: '037.', quote_text: '披学术外衣', category: '格言', source_attribution: '李敖', notes: '批评话术的成语化表达。' },

  { filePrefix: '038.', quote_text: '青山当户、白眼看人', category: '诗文', source_attribution: '旧联语', notes: '文中引作境界。' },
  { filePrefix: '038.', quote_text: '居天下之广居、立天下之正位、行天下之大道。得志与民由之，不得志独行其道。', category: '格言', source_attribution: '《孟子》', notes: '大丈夫章名句。' },
  { filePrefix: '038.', quote_text: '举世誉之而不加劝、举世非之而不加沮', category: '格言', source_attribution: '《庄子》', notes: '不随毁誉动心。' },
  { filePrefix: '038.', quote_text: '不论得不得志，我都不怕孤立。', category: '格言', source_attribution: '李敖', notes: '独立人格断语。' },
  { filePrefix: '038.', quote_text: '我绝对不怕孤立', category: '格言', source_attribution: '李敖', notes: '独立人格断语。' },
  { filePrefix: '038.', quote_text: '孤立者强', category: '格言', source_attribution: '易卜生', notes: '文中译句。' },
  { filePrefix: '038.', quote_text: 'When is man strong until he feels alone', category: '格言', source_attribution: 'Ibsen', notes: '文中英文句。' },
  { filePrefix: '038.', quote_text: 'The strongest man on earth is he who stands most alone.', category: '格言', source_attribution: 'Ibsen', notes: '易卜生名句。' },
  { filePrefix: '038.', quote_text: '吾道必孤，不亦强乎？', category: '格言', source_attribution: '李敖', notes: '仿古文自造警句。' },
  { filePrefix: '038.', quote_text: '不怕孤立，才有独立', category: '格言', source_attribution: '李敖', notes: '人格独立警句，非政治口号。' },

  { filePrefix: '039.', quote_text: '宁肯让犯人逃掉。不然的话，犯人抓到了，可是法律却逃掉了。', category: '格言', source_attribution: '李敖', notes: '法律精神警句，排除具体时政。' },
  { filePrefix: '039.', quote_text: '奇字活现', category: '格言', source_attribution: '李敖', notes: '仿“跃然纸上”的题旨词。' },

  { filePrefix: '044.', quote_text: '以君子之心度人', category: '格言', source_attribution: '成语化表述', notes: '反用“以小人之心度君子之腹”。' },

  { filePrefix: '045.', quote_text: '于有声处听惊雷', category: '诗文', source_attribution: '鲁迅句意', notes: '题名式文学化表达。' },

  { filePrefix: '046.', quote_text: '生平未了事，留于后人补。', category: '诗文', source_attribution: '旧诗句', notes: '文中引句。' },
  { filePrefix: '046.', quote_text: '生平未了事，留于自己补', category: '格言', source_attribution: '李敖', notes: '反用旧句。' },
  { filePrefix: '046.', quote_text: '见狱吏则头抢地，视徒隶则正惕息。何者？积威约之势也！', category: '诗文', source_attribution: '司马迁《报任少卿书》', notes: '古文名句。' },
  { filePrefix: '046.', quote_text: '积威约之势也！', category: '格言', source_attribution: '司马迁《报任少卿书》', notes: '名句片语。' },
  { filePrefix: '046.', quote_text: '留有用之身，做来日辩冤的准备', category: '格言', source_attribution: '李敖', notes: '忍耐与自救的格言。' },
  { filePrefix: '046.', quote_text: '有用之身', category: '格言', source_attribution: '成语', notes: '常用语。' },

  { filePrefix: '047.', quote_text: '官家食素多时，甚觉清瘦，汝辈可自作商量。', category: '诗文', source_attribution: '宋人故事', notes: '人情物情故事。' },
  { filePrefix: '047.', quote_text: '人情', category: '格言', source_attribution: '常用语', notes: '人情世故。' },
  { filePrefix: '047.', quote_text: '物情', category: '格言', source_attribution: '常用语', notes: '事物情理。' },
  { filePrefix: '047.', quote_text: '人情与物情都不通', category: '格言', source_attribution: '李敖', notes: '处世批评语。' },
  { filePrefix: '047.', quote_text: '你倒清闲得很！我希望你的头脑别像你的桌面那么空。', category: '格言', source_attribution: '办公室故事', notes: '办公桌笑话。' },
  { filePrefix: '047.', quote_text: '这证明你的工作效率太低了！', category: '格言', source_attribution: '办公室故事', notes: '办公桌笑话反转。' },
  { filePrefix: '047.', quote_text: '一汤虽小，可以喻大矣！', category: '格言', source_attribution: '李敖', notes: '由小见大的题旨句。' },

  { filePrefix: '049.', quote_text: '长安居，大不易', category: '格言', source_attribution: '顾况', notes: '白居易典故。' },
  { filePrefix: '049.', quote_text: '学我自己吧！', category: '格言', source_attribution: '李敖', notes: '自立风格断语。' },
  { filePrefix: '049.', quote_text: '眼空四海', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '049.', quote_text: '手下无情', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '049.', quote_text: '愤世嫉俗', category: '格言', source_attribution: '成语', notes: '常用成语。' },
  { filePrefix: '049.', quote_text: '人人骂我，我骂人人。', category: '格言', source_attribution: '李敖', notes: '自我风格口号式妙语，非政治。' },

  { filePrefix: '050.', quote_text: '真是一针见血，字字击中要害', category: '格言', source_attribution: '李敖', notes: '评论文字。' },
  { filePrefix: '050.', quote_text: '当你要杀一个人的时候，不妨客气一点', category: '格言', source_attribution: '英国法庭故事', notes: '语言机锋。' },
  { filePrefix: '050.', quote_text: '要杀他，不妨客气一点', category: '格言', source_attribution: '李敖转述', notes: '压缩后的机锋句。' },
  { filePrefix: '050.', quote_text: '字斟句酌', category: '格言', source_attribution: '成语', notes: '常用成语。' },

  { filePrefix: '051.', quote_text: '识其大者', category: '格言', source_attribution: '古语', notes: '把握大端。' },
  { filePrefix: '051.', quote_text: '没吃过猪肉，竟也没看过猪走路', category: '格言', source_attribution: '俗语变体', notes: '经验不足的俏皮说法。' },
  { filePrefix: '051.', quote_text: '己所不欲勿施于人', category: '格言', source_attribution: '《论语》', notes: '经典名句。' },
  { filePrefix: '051.', quote_text: '水太清无鱼', category: '格言', source_attribution: '俗语', notes: '常用俗语。' },
  { filePrefix: '051.', quote_text: '不言之教', category: '格言', source_attribution: '《老子》', notes: '老子名句。' },
  { filePrefix: '051.', quote_text: '秀才不出门，能知天下事', category: '格言', source_attribution: '俗语', notes: '常用俗语。' },
  { filePrefix: '051.', quote_text: '读了万卷书，不行点路', category: '格言', source_attribution: '李敖', notes: '反用“读万卷书，行万里路”。' },
  { filePrefix: '051.', quote_text: '不够简捷、不够锋利、不够一针见血', category: '格言', source_attribution: '李敖', notes: '谈对谈文体的标准。' },

  { filePrefix: '052.', quote_text: '但见萧飒万木催，尚余垂柳拂人来。西风莫笑长条弱，也向西风舞一回。', category: '诗文', source_attribution: '李敖诗', notes: '文中自引诗。' },
  { filePrefix: '052.', quote_text: '下马威', category: '格言', source_attribution: '俗语', notes: '常用俗语。' },

  { filePrefix: '053.', quote_text: '与子偕小', category: '格言', source_attribution: '李敖', notes: '仿“与子偕老”的双关。' },

  { filePrefix: '054.', quote_text: '可以托六尺之孤、可以寄百里之命，临大节而不可夺也。君子人与？君子人也！', category: '格言', source_attribution: '《论语》', notes: '曾子论君子名句。' },
  { filePrefix: '054.', quote_text: '临大节而不可夺', category: '格言', source_attribution: '《论语》', notes: '名句片语。' },
  { filePrefix: '054.', quote_text: '曲终人不见，江上一峯青', category: '诗文', source_attribution: '钱起《省试湘灵鼓瑟》', notes: '唐诗名句片语。' },
];

const REJECTS = new Map([
  ['验明正身', '普通叙事词，格言/诗文检索价值弱。'],
  ['一穷二白', '普通成语，未形成独立引用价值。'],
  ['有目共睹', '普通成语，未形成独立引用价值。'],
  ['孤陋寡闻', '普通成语，未形成独立引用价值。'],
  ['谁是涂咪咪？', '故事标题式问句，离开上下文价值弱。'],
  ['本末的倒置', '现代评论语，且处在政治人物/情治语境中。'],
  ['滑稽', '单词式评语，引用价值弱。'],
  ['大丈夫岂可火烧自己才讲话！', '自焚抗议语境中的现代政治断语，校对轮从严排除。'],
  ['自有兄弟扶持', '《西游记》故事片段，单独保留价值弱。'],
  ['自有兄弟动手', '仿拟故事片段，单独保留价值弱。'],
  ['又一个爷爷来了。', '小说对白碎片，单独检索价值弱。'],
  ['有个什么齐天大圣，才来这里否？', '小说对白碎片，单独检索价值弱。'],
  ['不曾见什么大圣，只有一个爷爷在里面查点哩。', '小说对白碎片，单独检索价值弱。'],
  ['郎君不消嚷，庙宇已姓孙了。', '小说对白碎片，单独检索价值弱。'],
  ['你到我家来，我到你家去', '上下文依赖强，非稳定格言。'],
  ['等我丢下去打他一下。', '小说对白碎片，单独检索价值弱。'],
  ['这个亡人！你不去妨家长，却来咬老孙！', '小说骂语碎片，校对轮从严排除。'],
  ['你这个霉星高照的死鬼！不去使你主人倒霉，来咬我老孙干什么！', '转述式骂语，校对轮从严排除。'],
  ['譬之畜狗，本取其吠', '犬臣譬喻处在政治攻击语境中，校对轮从严排除。'],
  ['作一看家恶犬', '犬臣譬喻处在政治攻击语境中，校对轮从严排除。'],
  ['共生', '单词式概念，非诗文格言。'],
  ['官逼民反', '政治反抗类俗语，校对轮按政治语境排除。'],
  ['人我两便', '普通成语，未形成独立引用价值。'],
  ['东张西望', '普通成语，未形成独立引用价值。'],
  ['失其常度', '普通成语化短语，已保留更完整出处。'],
  ['坚忍不拔', '普通成语，未形成独立引用价值。'],
  ['越挫越奋', '普通成语，未形成独立引用价值。'],
  ['没有东西', '英语格言译述碎片，保留完整英文句即可。'],
  ['有些东西', '英语格言译述碎片，保留完整英文句即可。'],
  ['一个不可靠的朋友，就是一个敌人', '现代政治人物语录，校对轮从严排除。'],
  ['人在江湖', '普通俗语，未形成独立引用价值。'],
  ['侠盗罗宾汉', '人物称谓，非诗文格言。'],
  ['不团结就是力量', '仿政治口号的现代断语，校对轮从严排除。'],
  ['祈战死', '军事/战死题辞，校对轮从严排除。'],
  ['鸟语人言', '普通成语化短语，引用价值弱。'],
  ['忠孝仁爱信义和平', '德目口号式排列，校对轮从严排除。'],
  ['患有所不辟', '已保留《孟子》完整句，短片语重复。'],
  ['见怪不怪', '普通成语，未形成独立引用价值。'],
  ['不亦宜乎', '古文句式碎片，单独价值弱。'],
  ['良非易事', '古文句式碎片，单独价值弱。'],
  ['胡说八道', '普通俗语，未形成独立引用价值。'],
  ['披学术外衣', '现代批评语，引用价值弱。'],
  ['奇字活现', '临时造词，离开上下文价值弱。'],
  ['以君子之心度人', '上下文依赖强，非稳定引用。'],
  ['积威约之势也！', '已保留《报任少卿书》完整句，短片语重复。'],
  ['有用之身', '普通成语，未形成独立引用价值。'],
  ['人情', '单词式概念，非诗文格言。'],
  ['物情', '单词式概念，非诗文格言。'],
  ['眼空四海', '普通成语，未形成独立引用价值。'],
  ['手下无情', '普通成语，未形成独立引用价值。'],
  ['愤世嫉俗', '普通成语，未形成独立引用价值。'],
  ['真是一针见血，字字击中要害', '即时评论语，非稳定格言。'],
  ['字斟句酌', '普通成语，未形成独立引用价值。'],
  ['下马威', '普通俗语，未形成独立引用价值。'],
  ['与子偕小', '直接依附台湾/政党大小语境，校对轮从严排除。'],
]);

const seen = new Set();
const rejectedRows = rows
  .filter((row) => REJECTS.has(row.quote_text))
  .map((row) => ({
    quote_text: row.quote_text,
    reason: REJECTS.get(row.quote_text),
    filePrefix: row.filePrefix,
    category: row.category,
    source_attribution: row.source_attribution,
  }));
const selectedRows = rows.filter((row) => !REJECTS.has(row.quote_text));

const builtRows = selectedRows.map((row, index) => {
  if (seen.has(row.quote_text)) throw new Error(`Duplicate quote_text: ${row.quote_text}`);
  seen.add(row.quote_text);
  const located = locate(row);
  const quoteText = row.quote_text;
  const politicalHit = POLITICAL_PATTERN.test(quoteText);
  return {
    id: `${ID_PREFIX}-${String(index + 1).padStart(3, '0')}`,
    book: BOOK,
    chapter: located.file.replace(/\.txt$/u, ''),
    source_file: path.relative(ROOT, path.join(SOURCE_DIR, located.file)).replace(/\\/g, '/'),
    line_start: located.line_start,
    line_end: located.line_end,
    quote_text: quoteText,
    category: row.category,
    source_or_origin: row.source_attribution,
    summary: located.context || quoteText,
    notes: row.notes || '',
    politicalQuoteTextHit: politicalHit,
  };
});

const headers = [
  'id',
  'book',
  'chapter',
  'source_file',
  'line_start',
  'line_end',
  'quote_text',
  'category',
  'source_or_origin',
  'summary',
  'notes',
];

const csv = [
  headers.join(','),
  ...builtRows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
].join('\n') + '\n';
fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });
fs.writeFileSync(OUT_CSV, csv, 'utf8');

const txt = builtRows.map((row) => [
  `${row.id} ${row.quote_text}`,
  `出处：${row.source_or_origin}｜类别：${row.category}`,
  `位置：${row.chapter}:${row.line_start}`,
  `语境：${row.summary}`,
  row.notes ? `备注：${row.notes}` : '',
].filter(Boolean).join('\n')).join('\n\n') + '\n';
fs.writeFileSync(OUT_TXT, txt, 'utf8');

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(builtRows, null, 2), 'utf8');
fs.writeFileSync(REJECTS_JSON, JSON.stringify(rejectedRows, null, 2), 'utf8');

const report = {
  book: BOOK,
  sourceDir: path.relative(ROOT, SOURCE_DIR).replace(/\\/g, '/'),
  sourceFileCount: sourceFiles().length,
  rawRows: rows.length,
  removedRows: rejectedRows.length,
  rows: builtRows.length,
  firstId: builtRows[0]?.id || null,
  lastId: builtRows.at(-1)?.id || null,
  politicalQuoteTextHits: builtRows.filter((row) => row.politicalQuoteTextHit).map((row) => ({ id: row.id, quote_text: row.quote_text })),
  outputCsv: path.relative(ROOT, OUT_CSV).replace(/\\/g, '/'),
  outputTxt: path.relative(ROOT, OUT_TXT).replace(/\\/g, '/'),
  outputJson: path.relative(ROOT, OUT_JSON).replace(/\\/g, '/'),
  rejectsJson: path.relative(ROOT, REJECTS_JSON).replace(/\\/g, '/'),
};
fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), 'utf8');

console.log(JSON.stringify(report, null, 2));
