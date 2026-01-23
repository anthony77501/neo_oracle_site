// app/static/i18n.js
const SUPPORTED = ["fr","en","ja"];
let LANG = null;
let DICT = {};

function pickLang() {
  const urlLang = new URLSearchParams(location.search).get("lang");
  const stored  = localStorage.getItem("lang");
  const nav     = (navigator.language || "en").slice(0,2).toLowerCase();
  const cand = urlLang || stored || nav || "en";
  return SUPPORTED.includes(cand) ? cand : "en";
}

async function loadLang(lang) {
  const res = await fetch(`/static/locales/${lang}.json`);
  DICT = await res.json();
  LANG = lang;
  localStorage.setItem("lang", lang);
  applyI18n();
}

function t(key) { return DICT[key] ?? key; }
window.t = t; // accessible dans d'autres scripts

function applyI18n() {
  // Remplacer tout élément qui a data-i18n="clé"
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  // Mettre à jour le <title> de l’onglet
  document.title = t("title");
  // Mettre la valeur du select
  const sel = document.getElementById("lang");
  if (sel) sel.value = LANG;
}

document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("lang");
  if (sel) sel.addEventListener("change", e => loadLang(e.target.value));
  loadLang(pickLang());
});
