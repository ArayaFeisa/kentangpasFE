// src/scripts/routes/router.ts
import { getActivePathname, getActiveRoute } from "./url-parser";
import Home from "../pages/home/home";
import CalculatorPage from "../pages/calculator/calculator";

/** Tipe yang dipakai berulang */
type Gen = "G0" | "G2" | "G3";
type Season = "Hujan" | "Kemarau";

/** Elemen root aplikasi */
const app = document.querySelector<HTMLElement>("#app");

/** ------- Overlay helpers ------- **/

let overlayEl: HTMLElement | null = null;
let escHandler: ((e: KeyboardEvent) => void) | null = null;

function ensureOverlay(): HTMLElement {
  if (!overlayEl) {
    overlayEl = document.createElement("div");
    overlayEl.id = "overlay";
    overlayEl.className =
      "fixed inset-0 flex items-center justify-center bg-black/40 z-50";
    overlayEl.addEventListener("click", (e) => {
      // klik di luar dialog untuk menutup
      if (e.target === overlayEl) removeOverlay();
    });
    document.body.appendChild(overlayEl);
  }
  return overlayEl;
}

function removeOverlay() {
  if (escHandler) {
    document.removeEventListener("keydown", escHandler);
    escHandler = null;
  }
  overlayEl?.remove();
  overlayEl = null;
}

/** Pasang ESC sekali untuk satu dialog */
function enableEscToClose() {
  escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") removeOverlay();
  };
  document.addEventListener("keydown", escHandler);
}

/** Fokuskan elemen pertama yang bisa fokus (aksesibilitas) */
function focusFirstFocusable(root: ParentNode) {
  const focusable = root.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusable?.focus();
}

/** ------- Render dialog ------- **/

function renderSeasonPopup(gen: Gen) {
  const overlay = ensureOverlay();
  overlay.innerHTML = `
    <div role="dialog" aria-modal="true" aria-label="Pilih Musim Tanam"
         class="bg-white rounded-2xl p-6 shadow-lg w-80 text-center relative animate-scale-in">
      <button id="close-popup" class="absolute top-2 right-3 text-gray-500 hover:text-gray-800" aria-label="Tutup">✕</button>
      <h2 class="text-lg font-bold mb-4">Musim Tanam? 🌤️</h2>
      <div class="flex gap-3 justify-center">
        <button id="btn-kemarau" class="flex-1 bg-yellow-400 text-white font-bold py-2 rounded-lg transition hover:brightness-110">
          Musim Kemarau
        </button>
        <button id="btn-hujan" class="flex-1 bg-blue-500 text-white font-bold py-2 rounded-lg transition hover:brightness-110">
          Musim Hujan
        </button>
      </div>
    </div>
  `;

  overlay.querySelector<HTMLButtonElement>("#close-popup")!
    .addEventListener("click", removeOverlay);

  overlay.querySelector<HTMLButtonElement>("#btn-kemarau")!
    .addEventListener("click", () => { removeOverlay(); renderSpacingPopup(gen, "Kemarau"); });

  overlay.querySelector<HTMLButtonElement>("#btn-hujan")!
    .addEventListener("click", () => { removeOverlay(); renderSpacingPopup(gen, "Hujan"); });

  enableEscToClose();
  focusFirstFocusable(overlay);
}

function renderSpacingPopup(gen: Gen, season: Season) {
  const overlay = ensureOverlay();
  const spacing = season === "Hujan" ? "40 cm x 40 cm" : "30 cm x 30 cm";

  overlay.innerHTML = `
    <div role="dialog" aria-modal="true" aria-live="polite"
         class="bg-white rounded-2xl p-6 shadow-lg w-80 text-center relative animate-scale-in border-2 border-green-500">
      <p class="text-black font-bold mb-6">
        <span class="inline-block text-yellow-500 mr-2">⚠️</span>
        Jarak Tanam menjadi ${spacing}.
      </p>
      <div class="flex gap-3 justify-center">
        <button id="btn-setuju" class="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition">Setuju</button>
        <button id="btn-batal" class="flex-1 bg-gray-300 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-400 transition">Batalkan</button>
      </div>
    </div>
  `;

  overlay.querySelector<HTMLButtonElement>("#btn-setuju")!
    .addEventListener("click", () => { removeOverlay(); renderCalculator(gen, season); });

  overlay.querySelector<HTMLButtonElement>("#btn-batal")!
    .addEventListener("click", () => { removeOverlay(); renderCalculator(gen, season, true); });

  enableEscToClose();
  focusFirstFocusable(overlay);
}

/** ------- Halaman kalkulator ------- **/

function renderCalculator(gen: Gen, season: Season, resetSpacing = false) {
  const desiredPath = `/calculator/${gen}/${season}`;
  if (getActivePathname() !== desiredPath) {
    location.hash = desiredPath; // akan memicu router lagi; return biar tidak double render
    return;
  }

  const storageKey = `formData_${gen}_${season}`;
  const calculatorPage = new CalculatorPage(gen, season, resetSpacing);

  if (!app) return;
  app.replaceChildren();
  app.innerHTML = calculatorPage.render();

  const formEl =
    app.querySelector<HTMLFormElement>("#calculator-form") ||
    app.querySelector<HTMLFormElement>("form");

  if (formEl) {
    formEl.addEventListener("submit", (e) => e.preventDefault());

    // restore
    const saved = localStorage.getItem(storageKey);
    const savedData: Record<string, string> = saved ? (() => { try { return JSON.parse(saved); } catch { return {}; } })() : {};

    const elements = Array.from(
      formEl.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[name]")
    );

    elements.forEach((el) => {
      const name = el.name;
      if (!name) return;

      if (resetSpacing && (name === "guludan" || name === "gerandul")) {
        el.value = "";
        return;
      }

      const v = savedData[name];
      if (v === undefined) return;

      if ((el as HTMLInputElement).type === "checkbox") {
        (el as HTMLInputElement).checked = v === "true";
      } else {
        el.value = v;
      }
    });

    const save = () => {
      const data: Record<string, string> = {};
      elements.forEach((el) => {
        if (!el.name) return;
        if ((el as HTMLInputElement).type === "checkbox") {
          data[el.name] = (el as HTMLInputElement).checked ? "true" : "false";
        } else {
          data[el.name] = el.value || "";
        }
      });
      localStorage.setItem(storageKey, JSON.stringify(data));
    };

    formEl.addEventListener("input", save);
    formEl.addEventListener("change", save);
  }

  bindBackBtn(storageKey);
}

function bindBackBtn(clearKey?: string) {
  if (!app) return;
  const backBtn = app.querySelector<HTMLButtonElement>("#btn-back");
  if (!backBtn) return;

  backBtn.classList.add("transition-transform", "duration-200", "hover:scale-105", "hover:bg-red-100");
  backBtn.onclick = () => {
    if (clearKey) localStorage.removeItem(clearKey);
    location.hash = "/";
  };
}

/** ------- Router ------- **/

function handleRoute() {
  removeOverlay();

  const path = getActivePathname();
  const segments = path.split("/").filter(Boolean);

  // /calculator/:gen/:season
  if (segments[0] === "calculator" && segments[1] && segments[2]) {
    return renderCalculator(segments[1] as Gen, segments[2] as Season);
  }

  // Home
  switch (getActiveRoute()) {
    case "/": {
      const homePage = new Home();
      if (!app) return;
      app.replaceChildren();
      app.innerHTML = homePage.render();

      const byId = (id: string) => app.querySelector<HTMLButtonElement>(id);
      byId("#btn-g0")?.addEventListener("click", () => renderSeasonPopup("G0"));
      byId("#btn-g2")?.addEventListener("click", () => renderSeasonPopup("G2"));
      byId("#btn-g3")?.addEventListener("click", () => renderSeasonPopup("G3"));
      return;
    }
    default: {
      if (app) app.innerHTML = `<div class="p-6 text-center">404 - Halaman tidak ditemukan</div>`;
    }
  }
}

/** Dipanggil dari index.ts */
export function startRouter() {
  // Hindari double binding
  window.removeEventListener("hashchange", handleRoute);
  window.removeEventListener("load", handleRoute);

  window.addEventListener("hashchange", handleRoute);
  window.addEventListener("load", handleRoute);
}

// (opsional) expose untuk test/e2e
export const router = handleRoute;
