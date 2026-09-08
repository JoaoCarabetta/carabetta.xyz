(() => {
"use strict";

const { UI, TIMELINE } = window.SITE_HOME;
const TYPE_ORDER = ["role", "launch", "project", "tool", "dataviz", "publication", "writing", "award", "talk", "education"];

let lang = "en";
try {
  const saved = localStorage.getItem("lang");
  if (saved === "en" || saved === "pt") lang = saved;
  else if ((navigator.language || "").toLowerCase().startsWith("pt")) lang = "pt";
} catch (_) {}

function t(obj) {
  if (!obj) return "";
  return obj[lang] || obj.en || "";
}

function applyChrome() {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = UI[key];
    if (!val) return;
    el.innerHTML = t(val);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    const key = el.getAttribute("data-i18n-aria");
    const val = UI[key];
    if (val) el.setAttribute("aria-label", t(val));
  });
  document.querySelectorAll(".lang button").forEach(btn => {
    btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
  });
  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    desc.setAttribute("content", lang === "pt"
      ? "físico de formação. constrói infraestrutura pública de dados no Brasil — bases abertas, plataformas de cidade e as ferramentas entre elas."
      : "physicist by training; builds public data infrastructure in Brazil — open datasets, city platforms, and the tools between them.");
  }
}

const listEl = document.getElementById("timeline-list");
const filtersEl = document.getElementById("timeline-filters");
let activeFilter = "all";

function sortedEntries() {
  return TIMELINE
    .filter(e => !e.archived)
    .sort((a, b) => (a.sort < b.sort ? 1 : a.sort > b.sort ? -1 : 0));
}

function usedTypes() {
  const present = new Set(TIMELINE.filter(e => !e.archived).map(e => e.type));
  return TYPE_ORDER.filter(type => present.has(type));
}

function renderFilters() {
  filtersEl.innerHTML = "";
  const types = ["all", ...usedTypes()];
  for (const type of types) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn";
    btn.dataset.filter = type;
    btn.setAttribute("aria-pressed", type === activeFilter ? "true" : "false");
    btn.textContent = type === "all" ? t(UI.filterAll) : t(UI.types[type]);
    btn.addEventListener("click", () => setFilter(type));
    filtersEl.appendChild(btn);
  }
}

function applyListFilter() {
  listEl.querySelectorAll(".entry").forEach(el => {
    el.hidden = activeFilter !== "all" && el.dataset.type !== activeFilter;
  });
  filtersEl.querySelectorAll(".filter-btn").forEach(btn => {
    btn.setAttribute("aria-pressed", btn.dataset.filter === activeFilter ? "true" : "false");
  });
}

function setFilter(type) {
  activeFilter = type;
  applyListFilter();
}

function appendLinks(parent, item) {
  if (!item.links || !item.links.length) return;
  const ul = document.createElement("ul");
  ul.className = "entry-links";
  for (const link of item.links) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link.href;
    a.target = link.href.startsWith("/") ? "_self" : "_blank";
    if (!link.href.startsWith("/")) a.rel = "noopener";
    a.textContent = t(link.label);
    li.appendChild(a);
    if (link.what) {
      const what = document.createElement("span");
      what.className = "what";
      what.textContent = t(link.what);
      li.appendChild(what);
    }
    ul.appendChild(li);
  }
  parent.appendChild(ul);
}

function bindDetail(btn, detail, span) {
  btn.addEventListener("click", () => {
    const open = detail.hidden;
    detail.hidden = !open;
    detail.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    span.textContent = open ? t(UI.less) : t(UI.more);
  });
}

function renderList() {
  const entries = sortedEntries();
  listEl.innerHTML = "";
  for (const item of entries) {
    const article = document.createElement("article");
    article.className = "entry";
    article.id = item.id;
    article.dataset.type = item.type;

    const date = document.createElement("div");
    date.className = "entry-date";
    date.textContent = item.date;
    article.appendChild(date);

    const body = document.createElement("div");
    body.className = "entry-body";

    const meta = document.createElement("div");
    meta.className = "entry-meta";
    const type = document.createElement("span");
    type.className = "type";
    type.textContent = t(UI.types[item.type] || { en: item.type, pt: item.type });
    meta.appendChild(type);
    body.appendChild(meta);

    const title = document.createElement("h3");
    title.className = "entry-title";
    title.textContent = t(item.title);
    body.appendChild(title);

    const blurb = document.createElement("p");
    blurb.className = "entry-blurb";
    blurb.innerHTML = t(item.blurb);
    body.appendChild(blurb);

    appendLinks(body, item);

    if (item.detail) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "more-btn";
      btn.setAttribute("aria-expanded", "false");
      const span = document.createElement("span");
      span.textContent = t(UI.more);
      btn.appendChild(span);

      const detail = document.createElement("div");
      detail.className = "entry-detail";
      detail.id = `detail-${item.id}`;
      detail.hidden = true;
      btn.setAttribute("aria-controls", detail.id);

      const sections = item.detail[lang] || item.detail.en;
      for (const [h, p] of sections) {
        const h4 = document.createElement("h4");
        h4.textContent = h;
        const para = document.createElement("p");
        para.innerHTML = p;
        detail.appendChild(h4);
        detail.appendChild(para);
      }

      bindDetail(btn, detail, span);
      body.appendChild(btn);
      body.appendChild(detail);
    }

    article.appendChild(body);
    listEl.appendChild(article);
  }
  renderFilters();
  applyListFilter();
}

function hydrateExisting() {
  listEl.querySelectorAll(".more-btn").forEach(btn => {
    const detail = document.getElementById(btn.getAttribute("aria-controls"));
    const span = btn.querySelector("span");
    if (detail && span) bindDetail(btn, detail, span);
  });
  renderFilters();
  applyListFilter();
}

function setLang(next) {
  lang = next;
  try { localStorage.setItem("lang", lang); } catch (_) {}
  applyChrome();
  renderList();
}

document.querySelectorAll(".lang button").forEach(btn => {
  btn.addEventListener("click", () => setLang(btn.dataset.lang));
});

const topbar = document.querySelector(".topbar");
addEventListener("scroll", () => {
  topbar.classList.toggle("scrolled", scrollY > 8);
}, { passive: true });

applyChrome();
if (lang === "en" && listEl.querySelector(".entry")) hydrateExisting();
else renderList();
})();
