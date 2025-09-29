"use strict";

const BASE_API = "https://ihatov08.github.io/kimetsu_api/api";
const BASE_IMG = "https://ihatov08.github.io";

const endpoints = {
  all: "all.json",
  kisatsutai: "kisatsutai.json",
  hashira: "hashira.json",
  oni: "oni.json",
};

const grid = document.getElementById("grid");
const loading = document.getElementById("loading");
const radios = document.querySelectorAll('input[name="kind"]');

function setLoading(on) {
  loading.classList.toggle("hidden", !on);
  grid.setAttribute("aria-busy", String(on));
}

function imgUrl(relative) {
  if (!relative) return "";
  return BASE_IMG + relative;
}

function cardHTML(item) {
  const name = item.name || "不明";
  const category = item.category || "";
  const image = imgUrl(item.image);
  return `
  <article class="card">
    <img class="thumb" alt="${name}" src="${image}" loading="lazy">
    <div class="meta">
      <h2 class="name">${name}</h2>
      <p class="category">${category}</p>
    </div>
  </article>`;
}

function render(list) {
  grid.innerHTML = list.map(cardHTML).join("");
}

async function fetchList(kind) {
  const endpoint = endpoints[kind] || endpoints.all;
  const url = `${BASE_API}/${endpoint}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function fetchAndRender(kind) {
  try {
    setLoading(true);
    const list = await fetchList(kind);
    render(list);
  } catch (err) {
    console.error(err);
    render([{ name: "取得に失敗しました", category: "エラー", image: "" }]);
  } finally {
    setLoading(false);
  }
}

radios.forEach((r) =>
  r.addEventListener("change", (e) => fetchAndRender(e.target.value))
);

document.addEventListener("DOMContentLoaded", () => fetchAndRender("all"));
