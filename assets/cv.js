(() => {
"use strict";

const UI = window.SITE_CV;

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
  document.title = lang === "pt" ? "joão carabetta — currículo" : "joão carabetta — CV";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = UI[key];
    if (!val) return;
    el.innerHTML = t(val);
  });

  document.querySelectorAll("[data-i18n-list]").forEach(el => {
    const key = el.getAttribute("data-i18n-list");
    const val = UI[key];
    if (!val) return;
    const items = val[lang] || val.en || [];
    el.innerHTML = items.map(s => `<li>${s}</li>`).join("");
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
      ? "Currículo — João Carabetta. Infraestrutura pública de dados, plataformas de cidade, bases abertas."
      : "Curriculum vitae — João Carabetta. Public data infrastructure, city platforms, open datasets.");
  }
}

document.querySelectorAll(".lang button").forEach(btn => {
  btn.addEventListener("click", () => {
    lang = btn.dataset.lang;
    try { localStorage.setItem("lang", lang); } catch (_) {}
    applyChrome();
  });
});

applyChrome();
})();
