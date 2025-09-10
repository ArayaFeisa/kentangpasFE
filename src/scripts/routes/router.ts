import { getActivePathname, getActiveRoute } from "./url-parser";
import Home from "../pages/home/home";
import CalculatorG0 from "../pages/calculator/calculatorg0";
import CalculatorG2 from "../pages/calculator/calculatorg2";
import CalculatorG3 from "../pages/calculator/calculatorg3";
import ResultPage from "../pages/result/result";

type Gen = "G0" | "G2" | "G3";
type Season = "Hujan" | "Kemarau";

const app = document.querySelector("#app") as HTMLElement;

function resolveCalculatorPage(gen: Gen, season: Season, reset = false) {
  switch (gen) {
    case "G0": return new CalculatorG0(season, reset);
    case "G2": return new CalculatorG2(season, reset);
    case "G3": return new CalculatorG3(season, reset);
  }
}

let overlayEl: HTMLElement | null = null;
let escHandler: ((e: KeyboardEvent) => void) | null = null;

function ensureOverlay(): HTMLElement {
  if (!overlayEl) {
    overlayEl = document.createElement("div");
    overlayEl.id = "overlay";
    overlayEl.className =
      "fixed inset-0 flex items-center justify-center bg-black/40 z-50";
    overlayEl.addEventListener("click", (e) => {
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

function enableEscToClose() {
  escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") removeOverlay();
  };
  document.addEventListener("keydown", escHandler);
}

function focusFirstFocusable(root: ParentNode) {
  const focusable = root.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusable?.focus();
}

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

function renderCalculator(gen: Gen, season: Season, resetSpacing = false) {
  const desiredPath = `/calculator/${gen}/${season}`;
  if (getActivePathname() !== desiredPath) {
    location.hash = desiredPath;
    return;
  }

  const storageKey = `formData_${gen}_${season}`;
  const calculatorPage = resolveCalculatorPage(gen, season, resetSpacing)!;

  app.replaceChildren();
  app.innerHTML = calculatorPage.render();

  const formEl =
    app.querySelector<HTMLFormElement>("#calculator-form") ||
    app.querySelector<HTMLFormElement>("form");

  if (formEl) {
    // --- restore dari localStorage (tetap) ---
    const saved = localStorage.getItem(storageKey);
    const savedData: Record<string, string> = saved
      ? (() => {
          try {
            return JSON.parse(saved);
          } catch {
            return {};
          }
        })()
      : {};

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

    // --- SUBMIT HANDLER (baru) ---
    formEl.addEventListener("submit", async (e) => {
      e.preventDefault();

      // helper ambil number
      const num = (sel: string) =>
        Number(
          (formEl.querySelector<HTMLInputElement>(sel)?.value || "0")
            .toString()
            .replace(",", ".")
        );

      if (gen === "G2") {
        // payload sesuai backend (G2)
        const payload = {
          generasiBibit: "G2" as const,
          panjangLahan: num("#panjang"),
          lebarLahan: num("#lebar"),
          lebarGuludan: num("#guludan"),
          lebarParit: num("#gerandul"),
          jarakTanam: num("#jarak_tanam"),
          estimasiHarga: num("#harga_perkg"),
        };

        // validasi ringan
        if (!payload.panjangLahan || !payload.lebarLahan) {
          // pakai overlay umum kamu:
          const overlay = ensureOverlay();
          overlay.innerHTML = `
            <div role="dialog" aria-modal="true"
                 class="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md animate-scale-in">
              <h3 class="text-lg font-semibold text-red-600">Gagal</h3>
              <p class="mt-2 text-sm text-gray-700">Mohon isi Panjang & Lebar Lahan.</p>
              <div class="mt-6 text-right">
                <button id="btn-close-error" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Tutup</button>
              </div>
            </div>
          `;
          overlay.querySelector<HTMLButtonElement>("#btn-close-error")?.addEventListener("click", removeOverlay);
          enableEscToClose();
          return;
        }

        // loading overlay
        const overlay = ensureOverlay();
        overlay.innerHTML = `
          <div role="dialog" aria-modal="true" aria-busy="true"
               class="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md text-center animate-scale-in">
            <div class="mx-auto h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            <p class="mt-4 text-sm text-gray-600">Menghitung...</p>
          </div>
        `;
        enableEscToClose();

        try {
          const res = await fetch("https://apikentangpas.cloud/api/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            let msg = `HTTP ${res.status}`;
            try {
              const err = await res.json();
              if (err?.message) msg = err.message;
            } catch {}
            throw new Error(msg);
          }

          const data = (await res.json()) as {
            message: string;
            data: {
              ringkasanLahan: {
                lebarUnitTanam: string;
                jumlahGuludan: string;
                panjangTanamPerGuludan: string;
              };
              kebutuhanTanam: {
                jumlahTanamanPerGuludan: string;
                totalPopulasiTanaman: string;
              };
              kebutuhanBibit: {
                estimasi: string;
                unit: "kg";
                rangeKg?: { kg_min: number; kg_est: number; kg_max: number };
                note: string;
              };
              estimasiBiaya: { total: string };
            };
          };
          sessionStorage.setItem(
            "last_result",
            JSON.stringify({ gen, season, result: data })
          );
          location.hash = `/result/${gen}/${season}`;
        } catch (err: any) {
          const o = ensureOverlay();
          o.innerHTML = `
            <div role="dialog" aria-modal="true"
                 class="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md animate-scale-in">
              <h3 class="text-lg font-semibold text-red-600">Gagal</h3>
              <p class="mt-2 text-sm text-gray-700">${err?.message || "Tidak bisa memuat hasil perhitungan. Coba lagi."}</p>
              <div class="mt-6 text-right">
                <button id="btn-close-error" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Tutup</button>
              </div>
            </div>
          `;
          o.querySelector<HTMLButtonElement>("#btn-close-error")?.addEventListener("click", removeOverlay);
          enableEscToClose();
        }
      } else {
        // Other Gen
      }
    });
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

function handleRoute() {
  removeOverlay();

  const path = getActivePathname();
  const segments = path.split("/").filter(Boolean);

  if (segments[0] === "result" && segments[1] && segments[2]) {
    const gen = segments[1] as Gen;
    const season = segments[2] as Season;
    const page = new ResultPage(gen, season);
    if (!app) return;
    app.replaceChildren();
    app.innerHTML = page.render();
    page.mount(app);
    return;
  }

  if (segments[0] === "calculator" && segments[1] && segments[2]) {
  const gen = segments[1] as Gen;
  const season = segments[2] as Season;
  renderCalculator(gen, season);
  return;
  }

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

function showG2ResultOverlay(res: {
  message: string;
  data: {
    ringkasanLahan: { lebarUnitTanam: string; jumlahGuludan: string; panjangTanamPerGuludan: string; };
    kebutuhanTanam: { jumlahTanamanPerGuludan: string; totalPopulasiTanaman: string; };
    kebutuhanBibit: { estimasi: string; unit: "kg"; note: string; };
    estimasiBiaya: { total: string; };
  };
}) {
  const d = res.data;
  const o = ensureOverlay();
  o.innerHTML = `
    <div role="dialog" aria-modal="true"
         class="bg-white rounded-2xl shadow-lg w-[92%] max-w-md animate-scale-in border-2 border-primary/70">
      <div class="p-6 space-y-6">
        <h2 class="text-xl font-bold">Hasil Perhitungan</h2>

        <section class="space-y-3">
          <h3 class="text-lg font-extrabold">A. Ringkasan Lahan Anda</h3>
          <p>Lebar 1 Unit (Guludan + Gerandul): <span class="text-primary font-semibold">${d.ringkasanLahan.lebarUnitTanam}</span></p>
          <p>Jumlah Guludan / Baris Tanam: <span class="text-primary font-semibold">${d.ringkasanLahan.jumlahGuludan}</span></p>
          <p>Panjang Tanam per Guludan: <span class="text-primary font-semibold">${d.ringkasanLahan.panjangTanamPerGuludan}</span></p>
        </section>

        <section class="space-y-3">
          <h3 class="text-lg font-extrabold">B. Kebutuhan Tanam</h3>
          <p>Jumlah Tanaman per Guludan: <span class="text-primary font-semibold">${d.kebutuhanTanam.jumlahTanamanPerGuludan}</span></p>
          <p>Total Populasi Tanaman: <span class="text-primary font-semibold">${d.kebutuhanTanam.totalPopulasiTanaman}</span></p>
        </section>

        <section class="space-y-3">
          <h3 class="text-lg font-extrabold">C. Kebutuhan Bibit (G2)</h3>
          <p>Estimasi Kebutuhan: <span class="text-primary font-semibold">${d.kebutuhanBibit.estimasi}</span></p>
          <p class="text-xs text-gray-500 italic">${d.kebutuhanBibit.note}</p>
        </section>

        <section class="space-y-3">
          <h3 class="text-lg font-extrabold">D. Estimasi Biaya Bibit</h3>
          <p>Total Perkiraan Modal yaitu : <span class="text-primary font-extrabold">${d.estimasiBiaya.total}</span></p>
        </section>

        <div class="pt-2">
          <button id="btn-ok" class="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-primary/30">
            Ok
          </button>
        </div>
      </div>
    </div>
  `;
  o.querySelector<HTMLButtonElement>("#btn-ok")?.addEventListener("click", removeOverlay);
  enableEscToClose();
}

export function startRouter() {
  window.removeEventListener("hashchange", handleRoute);
  window.removeEventListener("load", handleRoute);

  window.addEventListener("hashchange", handleRoute);
  window.addEventListener("load", handleRoute);
}

export const router = handleRoute;