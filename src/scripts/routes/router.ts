import { getActivePathname, getActiveRoute } from "./url-parser";
import Home from "../pages/home/home";
import CalculatorG0 from "../pages/calculator/calculatorg0";
import CalculatorG2 from "../pages/calculator/calculatorg2";
import CalculatorG3 from "../pages/calculator/calculatorg3";
import ResultPage from "../pages/result/result";
import HistoryPage from "../pages/history/history";
import SplashPage from "../pages/splash/splash"; 

type Gen = "G0" | "G2" | "G3";
type Season = "Hujan" | "Kemarau";

const API_URL = "https://apikentangpas.cloud/api/calculate";
const app = document.querySelector("#app") as HTMLElement;

let overlayEl: HTMLElement | null = null;
let escHandler: ((e: KeyboardEvent) => void) | null = null;

function ensureOverlay(): HTMLElement {
  if (!overlayEl) {
    overlayEl = document.createElement("div");
    overlayEl.id = "overlay";
    overlayEl.className = "fixed inset-0 flex items-center justify-center bg-black/40 z-50";
    overlayEl.addEventListener("click", (e) => { if (e.target === overlayEl) removeOverlay(); });
    document.body.appendChild(overlayEl);
  }
  return overlayEl;
}
function removeOverlay() {
  if (escHandler) { document.removeEventListener("keydown", escHandler); escHandler = null; }
  overlayEl?.remove(); overlayEl = null;
}
function enableEscToClose() {
  escHandler = (e: KeyboardEvent) => { if (e.key === "Escape") removeOverlay(); };
  document.addEventListener("keydown", escHandler);
}

function resolveCalculatorPage(gen: Gen, season: Season, reset = false) {
  switch (gen) {
    case "G0": return new CalculatorG0(season, reset);
    case "G2": return new CalculatorG2(season, reset);
    case "G3": return new CalculatorG3(season, reset);
  }
}

function renderSeasonPopup(gen: Gen) {
  const o = ensureOverlay();
  o.innerHTML = `
    <div class="bg-white rounded-2xl p-6 shadow-lg w-80 text-center relative animate-scale-in">
      <button id="close-popup" class="absolute top-2 right-3 text-gray-500 hover:text-gray-800">✕</button>
      <h2 class="text-lg font-bold mb-4">Musim Tanam? 🌤️</h2>
      <div class="flex gap-3 justify-center">
        <button id="btn-kemarau" class="flex-1 bg-yellow-400 text-white font-bold py-2 rounded-lg">Musim Kemarau</button>
        <button id="btn-hujan" class="flex-1 bg-blue-500 text-white font-bold py-2 rounded-lg">Musim Hujan</button>
      </div>
    </div>
  `;
  o.querySelector("#close-popup")?.addEventListener("click", removeOverlay);
  o.querySelector("#btn-kemarau")?.addEventListener("click", () => { removeOverlay(); renderSpacingPopup(gen,"Kemarau"); });
  o.querySelector("#btn-hujan")?.addEventListener("click", () => { removeOverlay(); renderSpacingPopup(gen,"Hujan"); });
  enableEscToClose();
}
function renderSpacingPopup(gen: Gen, season: Season) {
  const o = ensureOverlay();
  const spacing = season === "Hujan" ? "40 cm x 40 cm" : "30 cm x 30 cm";
  o.innerHTML = `
    <div class="bg-white rounded-2xl p-6 shadow-lg w-80 text-center relative animate-scale-in border-2 border-green-500">
      <p class="text-black font-bold mb-6">
        <span class="inline-block text-yellow-500 mr-2">⚠️</span>
        Jarak Tanam menjadi ${spacing}.
      </p>
      <div class="flex gap-3 justify-center">
        <button id="btn-setuju" class="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg">Setuju</button>
        <button id="btn-batal" class="flex-1 bg-gray-300 text-gray-700 font-bold py-2 rounded-lg">Batalkan</button>
      </div>
    </div>
  `;
  o.querySelector("#btn-setuju")?.addEventListener("click", () => { removeOverlay(); renderCalculator(gen, season); });
  o.querySelector("#btn-batal")?.addEventListener("click", () => { removeOverlay(); location.hash = "/home"; });
  enableEscToClose();
}

function renderCalculator(gen: Gen, season: Season, resetSpacing = false) {
  const desired = `/calculator/${gen}/${season}`;
  if (getActivePathname() !== desired) { location.hash = desired; return; }

  const storageKey = `formData_${gen}_${season}`;
  const page = resolveCalculatorPage(gen, season, resetSpacing)!;

  app.replaceChildren();
  app.innerHTML = page.render();

  const formEl = app.querySelector<HTMLFormElement>("#calculator-form");
  if (!formEl) return;

  const savedData: Record<string,string> =
    (() => { try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { return {}; } })();

  const inputs = Array.from(formEl.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[name]"));
  inputs.forEach((el) => {
    const name = el.name;
    if (!name) return;
    if (resetSpacing && (name === "guludan" || name === "gerandul")) { el.value = ""; return; }
    const v = savedData[name];
    if (v === undefined) return;
    if ((el as HTMLInputElement).type === "checkbox") (el as HTMLInputElement).checked = v === "true";
    else el.value = v;
  });

  const save = () => {
    const obj: Record<string,string> = {};
    inputs.forEach((el) => {
      if (!el.name) return;
      obj[el.name] = (el as HTMLInputElement).type === "checkbox"
        ? ((el as HTMLInputElement).checked ? "true" : "false")
        : el.value || "";
    });
    localStorage.setItem(storageKey, JSON.stringify(obj));
  };
  formEl.addEventListener("input", save);
  formEl.addEventListener("change", save);
      formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
  const priceSel = gen === "G0" ? "#harga_bibit" : "#harga_perkg";
  const requiredSel = ["#panjang", "#lebar", "#guludan", "#gerandul", "#jarak_tanam", priceSel];

  const getRaw = (sel: string) =>
    (formEl.querySelector<HTMLInputElement>(sel)?.value ?? "").toString().trim();

  const firstEmptySel = requiredSel.find(sel => getRaw(sel) === "");
  if (firstEmptySel) {
    const o = ensureOverlay();
    o.innerHTML = `
      <div class="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md animate-scale-in">
        <h3 class="text-lg font-semibold text-red-600">Gagal</h3>
        <p class="mt-2 text-sm text-gray-700">Semua kolom wajib diisi.</p>
        <div class="mt-6 text-right">
          <button id="btn-close-error" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Tutup</button>
        </div>
      </div>`;
    o.querySelector("#btn-close-error")?.addEventListener("click", () => {
      removeOverlay();
      formEl.querySelector<HTMLInputElement>(firstEmptySel)?.focus(); // opsional: fokus ke yang kosong
    });
    enableEscToClose();
    return;
  }

    const readNum = (sel: string) =>
      Number((formEl.querySelector<HTMLInputElement>(sel)?.value || "0")
        .toString()
        .replace(",", "."));
    const base = {
      panjangLahan: readNum("#panjang"),
      lebarLahan: readNum("#lebar"),
      lebarGuludan: readNum("#guludan"),
      lebarParit: readNum("#gerandul"),
      jarakTanam: readNum("#jarak_tanam"),
    };

    const payload =
      gen === "G0" ? { generasiBibit: "G0" as const, ...base, estimasiHarga: readNum("#harga_bibit") }
    : gen === "G2" ? { generasiBibit: "G2" as const, ...base, estimasiHarga: readNum("#harga_perkg") }
    : { generasiBibit: "G3" as const, ...base, estimasiHarga: readNum("#harga_perkg") };

    if (!payload.panjangLahan || !payload.lebarLahan) {
      const o = ensureOverlay();
      o.innerHTML = `
        <div class="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md animate-scale-in">
          <h3 class="text-lg font-semibold text-red-600">Gagal</h3>
          <p class="mt-2 text-sm text-gray-700">Mohon isi Panjang & Lebar Lahan.</p>
          <div class="mt-6 text-right">
            <button id="btn-close-error" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Tutup</button>
          </div>
        </div>`;
      o.querySelector("#btn-close-error")?.addEventListener("click", removeOverlay);
      enableEscToClose();
      return;
    }

    const o = ensureOverlay();
    o.innerHTML = `
      <div class="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md text-center animate-scale-in">
        <div class="mx-auto h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <p class="mt-4 text-sm text-gray-600">Menghitung...</p>
      </div>`;
    enableEscToClose();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { const err = await res.json(); if (err?.message) msg = err.message; } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      sessionStorage.setItem("last_result", JSON.stringify({ gen, season, result: data }));

      const parseIDR = (s: any) => Number(String(s ?? "0").replace(/[^0-9]/g, "")) || 0;
      const amount = parseIDR(data?.data?.estimasiBiaya?.total);
      const { addHistory } = await import("../pages/history/history");
      addHistory({
        id: (crypto.randomUUID?.() || Date.now().toString()) + Math.random().toString(36).slice(2, 6),
        gen,
        season,
        amount,
        dateISO: new Date().toISOString().slice(0, 10),
        resultPayload: data,
      });
      sessionStorage.setItem("result_from", "calculator");
      sessionStorage.setItem("result_prev_hash", location.hash || `#/calculator/${gen}/${season}`);
      location.hash = `/result/${gen}/${season}`;
    } catch (err: any) {
      const oo = ensureOverlay();
      oo.innerHTML = `
        <div class="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md animate-scale-in">
          <h3 class="text-lg font-semibold text-red-600">Gagal</h3>
          <p class="mt-2 text-sm text-gray-700">${err?.message || "Tidak bisa memuat hasil perhitungan. Coba lagi."}</p>
          <div class="mt-6 text-right">
            <button id="btn-close-error" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Tutup</button>
          </div>
        </div>`;
      oo.querySelector("#btn-close-error")?.addEventListener("click", removeOverlay);
      enableEscToClose();
    }
  });

  bindBackBtn(storageKey);
}

function bindBackBtn(clearKey?: string) {
  const prev = (app as any)._backHandler as ((e: MouseEvent) => void) | undefined;
  if (prev) app.removeEventListener("click", prev);

  const handler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest("#btn-back")) {
      e.preventDefault();
      if (clearKey) localStorage.removeItem(clearKey);
      location.hash = "/";
    }
  };

  (app as any)._backHandler = handler;
  app.addEventListener("click", handler);
}

function highlightBottomNav(root: HTMLElement = app) {
  const current = (location.hash || "#/").replace(/^#/, "");
  root.querySelectorAll<HTMLAnchorElement>('nav [data-nav]').forEach((a) => {
    const href = (a.getAttribute("href") || "#/").replace(/^#/, "");
    const isActive =
      current === href ||
      ((current === "/home" || current === "/") && (href === "/" || href === "/home")) ||
      (current.startsWith("/history") && href === "/history");
      
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");

    a.classList.toggle("text-emerald-700", isActive);
    a.classList.toggle("text-gray-600", !isActive);
  });
}

function handleRoute() {
  removeOverlay();

  const path = getActivePathname();
  const seg = path.split("/").filter(Boolean);

if (seg[0] === "result" && seg[1] && seg[2]) {
  const prevBack = (app as any)._backHandler as ((e: MouseEvent) => void) | undefined;
  if (prevBack) {
    app.removeEventListener("click", prevBack);
    (app as any)._backHandler = undefined;
  }
  const page = new ResultPage(seg[1] as Gen, seg[2] as Season);
  app.replaceChildren();
  app.innerHTML = page.render();
  page.mount(app);
  const backBtn = app.querySelector<HTMLButtonElement>("#btn-back");
  backBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const prevHash = sessionStorage.getItem("result_prev_hash");
    const from     = sessionStorage.getItem("result_from");

    sessionStorage.removeItem("result_prev_hash");
    sessionStorage.removeItem("result_from");

    if (prevHash) {
      location.hash = prevHash.replace(/^#/, "");
      return;
    }

    if (from === "history") {
      location.hash = "/history";
    } else if (from === "calculator") {
      location.hash = `/calculator/${seg[1]}/${seg[2]}`;
    } else if (history.length > 1) {
      history.back();
    } else {
      location.hash = "/home";
    }
  });

  highlightBottomNav(app);
  return;
}


  if (seg[0] === "calculator" && seg[1] && seg[2]) {
    renderCalculator(seg[1] as Gen, seg[2] as Season);
    highlightBottomNav(app);
    return;
  }

  if (seg[0] === "history") {
    const page = new HistoryPage();
    app.replaceChildren();
    app.innerHTML = page.render();
    page.mount(app);
    highlightBottomNav(app);
    return;
  }

if (getActiveRoute() === "/") {
  if (!sessionStorage.getItem("splashShown")) {
    sessionStorage.setItem("splashShown", "true");
    const splash = new SplashPage();
    app.replaceChildren();
    app.innerHTML = splash.render();
    splash.mount();
    return;
  } else {
    location.hash = "/home";
    return;
  }
}
  if (seg[0] === "home") {
    const homePage = new Home();
    app.replaceChildren();
    app.innerHTML = homePage.render();

    const byId = (id: string) => app.querySelector<HTMLButtonElement>(id);
    byId("#btn-g0")?.addEventListener("click", () => renderSeasonPopup("G0"));
    byId("#btn-g2")?.addEventListener("click", () => renderSeasonPopup("G2"));
    byId("#btn-g3")?.addEventListener("click", () => renderSeasonPopup("G3"));
    highlightBottomNav(app);
    return;
  }

  app.innerHTML = `<div class="p-6 text-center">404 - Halaman tidak ditemukan</div>`;
  highlightBottomNav(app);
}


export function startRouter() {
  window.removeEventListener("hashchange", handleRoute);
  window.removeEventListener("load", handleRoute);
  window.addEventListener("hashchange", handleRoute);
  window.addEventListener("load", handleRoute);
}

export const router = handleRoute;
