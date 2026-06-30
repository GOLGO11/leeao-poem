(function () {
  const payload = window.LIAO_QUOTES_DATA || { columns: [], rows: [], stats: { books: {}, categories: {} } };
  const columns = payload.columns;
  const index = Object.fromEntries(columns.map((column, position) => [column, position]));
  function inferType(row) {
    const category = row[index.category] || "";
    const origin = row[index.source_or_origin] || "";
    const text = `${category} ${origin}`;
    if (/外国|英文|英诗|西方|莎士比亚|希腊|罗马|Bible|Sara|Virgil|Tagore/i.test(text)) return "外国引文";
    if (/诗|词|联|曲|赋|歌|韵|绝句/.test(text)) return "诗词联曲";
    if (/成语|俗语|熟语|谚|歇后|口语|俚语/.test(text)) return "成语俗语";
    if (/佛|禅|圣经|宗教|基督|哲学|道家|儒家/.test(text)) return "宗教哲思";
    if (/论语|孟子|庄子|老子|荀子|经典|古典|古文|史传|经句|文句|文言/.test(text)) return "古典文句";
    if (/格言|箴言|警句|妙语|名言|语录|治学/.test(text)) return "格言警句";
    if (/李敖/.test(text)) return "李敖文句";
    return "其他";
  }

  const rows = payload.rows.map((row, order) => {
    const record = {
      order,
      id: row[index.id] || "",
      book: row[index.book] || "",
      chapter: row[index.chapter] || "",
      source_file: row[index.source_file] || "",
      line_start: row[index.line_start] || "",
      line_end: row[index.line_end] || "",
      quote_text: row[index.quote_text] || "",
      category: row[index.category] || "",
      source_or_origin: row[index.source_or_origin] || "",
      summary: row[index.summary] || "",
      notes: row[index.notes] || "",
      type: inferType(row),
    };
    return record;
  });

  const state = {
    search: "",
    book: "",
    type: "",
    visible: 80,
  };

  const els = {
    totalCount: document.getElementById("totalCount"),
    bookCount: document.getElementById("bookCount"),
    categoryCount: document.getElementById("categoryCount"),
    searchInput: document.getElementById("searchInput"),
    bookSelect: document.getElementById("bookSelect"),
    typeSelect: document.getElementById("typeSelect"),
    resetButton: document.getElementById("resetButton"),
    resultCount: document.getElementById("resultCount"),
    exportButton: document.getElementById("exportButton"),
    quoteList: document.getElementById("quoteList"),
    showMoreButton: document.getElementById("showMoreButton"),
  };

  const collator = new Intl.Collator("zh-Hans-CN");
  const books = Object.entries(payload.stats.books || {}).sort((a, b) => collator.compare(a[0], b[0]));
  const types = Object.entries(
    rows.reduce((map, row) => {
      map[row.type] = (map[row.type] || 0) + 1;
      return map;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  function formatNumber(value) {
    return Number(value || 0).toLocaleString("zh-CN");
  }

  function option(label, value, count) {
    const item = document.createElement("option");
    item.value = value;
    item.textContent = count == null ? label : `${label} (${formatNumber(count)})`;
    return item;
  }

  function setupControls() {
    els.totalCount.textContent = formatNumber(rows.length);
    els.bookCount.textContent = formatNumber(books.length);
    els.categoryCount.textContent = formatNumber(types.length);

    els.bookSelect.append(option("全部书籍", ""));
    books.forEach(([book, count]) => els.bookSelect.append(option(book, book, count)));

    els.typeSelect.append(option("全部类型", ""));
    types.forEach(([type, count]) => els.typeSelect.append(option(type, type, count)));

  }

  function debounce(fn, wait) {
    let timer = 0;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  function normalize(value) {
    return String(value || "").toLocaleLowerCase("zh-CN").replace(/\s+/g, "");
  }

  function matches(row) {
    if (state.book && row.book !== state.book) return false;
    if (state.type && row.type !== state.type) return false;
    if (!state.search) return true;

    const haystack = normalize(
      [
        row.id,
        row.book,
        row.chapter,
        row.quote_text,
        row.type,
        row.category,
        row.source_or_origin,
        row.summary,
        row.notes,
      ].join(" "),
    );
    return haystack.includes(normalize(state.search));
  }

  function getFilteredRows() {
    return rows.filter(matches);
  }

  function addText(parent, className, text, tagName = "div") {
    const node = document.createElement(tagName);
    node.className = className;
    node.textContent = text;
    parent.append(node);
    return node;
  }

  function detail(label, value) {
    const node = document.createElement("div");
    const labelNode = document.createElement("span");
    labelNode.textContent = `${label}: `;
    node.append(labelNode, document.createTextNode(value || "未注明"));
    return node;
  }

  function sourceLine(row) {
    const end = row.line_end && row.line_end !== row.line_start ? `-${row.line_end}` : "";
    return `${row.source_file}:${row.line_start}${end}`;
  }

  async function copyQuote(row, button) {
    const text = `${row.quote_text}\n\n${row.book}｜${row.chapter}\n${row.source_or_origin}\n${sourceLine(row)}`;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "已复制";
      setTimeout(() => {
        button.textContent = "复制";
      }, 1200);
    } catch {
      button.textContent = "复制失败";
      setTimeout(() => {
        button.textContent = "复制";
      }, 1200);
    }
  }

  function renderCard(row) {
    const card = document.createElement("article");
    card.className = "quote-card";

    const meta = document.createElement("div");
    meta.className = "quote-meta";
    addText(meta, "quote-id", row.id);
    addText(meta, "quote-book", `${row.book} / ${row.chapter}`);
    card.append(meta);

    addText(card, "quote-text", row.quote_text, "p");

    const details = document.createElement("div");
    details.className = "quote-detail";
    details.append(
      detail("类型", row.type),
      detail("类别", row.category),
      detail("出处", row.source_or_origin),
      detail("位置", sourceLine(row)),
      detail("行号", row.line_end && row.line_end !== row.line_start ? `${row.line_start}-${row.line_end}` : row.line_start),
    );
    card.append(details);

    if (row.summary) addText(card, "quote-summary", row.summary, "p");
    if (row.notes) addText(card, "quote-notes", row.notes, "p");

    const actions = document.createElement("div");
    actions.className = "quote-actions";
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy-button";
    copy.textContent = "复制";
    copy.addEventListener("click", () => copyQuote(row, copy));
    actions.append(copy);
    card.append(actions);

    return card;
  }

  function render() {
    const filtered = getFilteredRows();
    const visibleRows = filtered.slice(0, state.visible);

    els.resultCount.textContent = formatNumber(filtered.length);
    els.quoteList.textContent = "";

    if (!visibleRows.length) {
      addText(els.quoteList, "empty", "没有匹配的条目。", "div");
    } else {
      const fragment = document.createDocumentFragment();
      visibleRows.forEach((row) => fragment.append(renderCard(row)));
      els.quoteList.append(fragment);
    }

    els.showMoreButton.hidden = state.visible >= filtered.length;
  }

  function toCsvValue(value) {
    const text = String(value ?? "");
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function exportCurrent() {
    const filtered = getFilteredRows();
    const csvRows = [
      columns.join(","),
      ...filtered.map((row) =>
        [
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
          .map(toCsvValue)
          .join(","),
      ),
    ];
    const blob = new Blob([`\ufeff${csvRows.join("\r\n")}\r\n`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "李敖引用诗文格言_当前结果.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  setupControls();

  els.searchInput.addEventListener(
    "input",
    debounce((event) => {
      state.search = event.target.value.trim();
      state.visible = 80;
      render();
    }, 120),
  );
  els.bookSelect.addEventListener("change", (event) => {
    state.book = event.target.value;
    state.visible = 80;
    render();
  });
  els.typeSelect.addEventListener("change", (event) => {
    state.type = event.target.value;
    state.visible = 80;
    render();
  });
  els.resetButton.addEventListener("click", () => {
    state.search = "";
    state.book = "";
    state.type = "";
    state.visible = 80;
    els.searchInput.value = "";
    els.bookSelect.value = "";
    els.typeSelect.value = "";
    render();
  });
  els.showMoreButton.addEventListener("click", () => {
    state.visible += 80;
    render();
  });
  els.exportButton.addEventListener("click", exportCurrent);

  render();
})();
