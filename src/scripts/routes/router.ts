import { getActivePathname, getActiveRoute } from "./url-parser";
import Home from "../pages/home/home";
import CalculatorPage from "../pages/calculator/calculator";

const app = document.querySelector("#app") as HTMLElement;

function removeOverlay() {
  const ov = document.querySelector("#overlay");
  if (ov) ov.remove();
}

function renderSeasonPopup(gen: "G0" | "G2" | "G3") {
  let overlay = document.querySelector("#overlay") as HTMLElement | null;
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";

    overlay.className =
      "fixed inset-0 flex items-center justify-center bg-black/40 z-50";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="bg-white rounded-2xl p-6 shadow-lg w-80 text-center relative animate-scaleIn">
      <button id="close-popup" class="absolute top-2 right-3 text-gray-500 hover:text-gray-800">✕</button>
      <h2 class="text-lg font-bold mb-4">Musim Tanam? 🌤️</h2>
      <div class="flex gap-3 justify-center">
        <button 
          id="btn-kemarau" 
          class="flex-1 bg-yellow-400 text-white font-bold py-2 rounded-lg transition transform duration-200 hover:scale-105 hover:brightness-110">
          Musim Kemarau
        </button>
        <button 
          id="btn-hujan" 
          class="flex-1 bg-blue-400 text-white font-bold py-2 rounded-lg transition transform duration-200 hover:scale-105 hover:brightness-110">
          Musim Hujan
        </button>
      </div>
    </div>
  `;

  const closeBtn = overlay.querySelector("#close-popup") as HTMLButtonElement;
  closeBtn.addEventListener("click", () => removeOverlay());

  const kemarauBtn = overlay.querySelector("#btn-kemarau") as HTMLButtonElement;
  const hujanBtn = overlay.querySelector("#btn-hujan") as HTMLButtonElement;

  kemarauBtn.addEventListener("click", () => {
    removeOverlay();
    renderSpacingPopup(gen, "Kemarau");
  });

  hujanBtn.addEventListener("click", () => {
    removeOverlay();
    renderSpacingPopup(gen, "Hujan");
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      removeOverlay();
      document.removeEventListener("keydown", onKey);
    }
  };
  document.addEventListener("keydown", onKey);
}

function renderSpacingPopup(
  gen: "G0" | "G2" | "G3",
  season: "Hujan" | "Kemarau"
) {
  let overlay = document.querySelector("#overlay") as HTMLElement | null;
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.className =
      "fixed inset-0 flex items-center justify-center bg-black/40 z-50";
    document.body.appendChild(overlay);
  }

  const spacing = season === "Hujan" ? "40 cm x 40 cm" : "30 cm x 30 cm";

  overlay.innerHTML = `
    <div class="bg-white rounded-2xl p-6 shadow-lg w-80 text-center relative animate-scaleIn border-2 border-green-500">
      <p class="text-black font-bold mb-6">
        <span class="inline-block text-yellow-500 mr-2">⚠️</span>
        Jarak Tanam menjadi ${spacing}.
      </p>
      <div class="flex gap-3 justify-center">
        <button id="btn-setuju" class="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition">Setuju</button>
        <button id="btn-batal" class="flex-1 bg-gray-300 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-400 transition">Batalkan</button>
      </div>
    </div>
  `;

  const btnSetuju = overlay.querySelector("#btn-setuju") as HTMLButtonElement;
  const btnBatal = overlay.querySelector("#btn-batal") as HTMLButtonElement;

  btnSetuju.addEventListener("click", () => {
    removeOverlay();
    renderCalculator(gen, season);
  });

  btnBatal.addEventListener("click", () => {
    removeOverlay();
    renderCalculator(gen, season, true);
  });
}

function renderCalculator(
  gen: "G0" | "G2" | "G3",
  season: "Hujan" | "Kemarau",
  resetSpacing: boolean = false
) {
  const desiredPath = `/calculator/${gen}/${season}`;
  if (getActivePathname() !== desiredPath) {
    location.hash = desiredPath;
  }

  const storageKey = `formData_${gen}_${season}`;

  const calculatorPage = new CalculatorPage(gen, season, resetSpacing);
  app.replaceChildren();
  app.innerHTML = calculatorPage.render();

  const formEl =
    app.querySelector<HTMLFormElement>("#calculator-form") ||
    app.querySelector("form");
  if (formEl) {
    formEl.addEventListener("submit", (e) => e.preventDefault());

    const raw = localStorage.getItem(storageKey);
    let savedData: Record<string, string> = {};
    if (raw) {
      try {
        savedData = JSON.parse(raw) as Record<string, string>;
      } catch {
        savedData = {};
      }
    }

    const elements = Array.from(
      formEl.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("[name]")
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

    const saveFormData = () => {
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

    formEl.addEventListener("input", saveFormData);
    formEl.addEventListener("change", saveFormData);
  }

  bindBackBtn(storageKey);
}

function bindBackBtn(clearStorageKey?: string) {
  const backBtn = app.querySelector("#btn-back") as HTMLButtonElement | null;
  if (backBtn) {
    backBtn.classList.add(
      "transition-transform",
      "duration-200",
      "hover:scale-105",
      "hover:bg-red-100"
    );
    backBtn.onclick = () => {
      if (clearStorageKey) {
        localStorage.removeItem(clearStorageKey);
      }
      location.hash = "/";
    };
  }
}

export function router() {
  removeOverlay();

  const path = getActivePathname();
  const segments = path.split("/").filter(Boolean);

  if (segments[0] === "calculator" && segments[1] && segments[2]) {
    const gen = segments[1] as "G0" | "G2" | "G3";
    const season = segments[2] as "Hujan" | "Kemarau";
    renderCalculator(gen, season);
    return;
  }

  switch (getActiveRoute()) {
    case "/":
      const homePage = new Home();
      app.replaceChildren();
      app.innerHTML = homePage.render();

      const g0Btn = app.querySelector("#btn-g0") as HTMLButtonElement | null;
      const g2Btn = app.querySelector("#btn-g2") as HTMLButtonElement | null;
      const g3Btn = app.querySelector("#btn-g3") as HTMLButtonElement | null;

      g0Btn?.addEventListener("click", () => renderSeasonPopup("G0"));
      g2Btn?.addEventListener("click", () => renderSeasonPopup("G2"));
      g3Btn?.addEventListener("click", () => renderSeasonPopup("G3"));
      break;

    default:
      app.innerHTML = `<div class="p-6 text-center">404 - Halaman tidak ditemukan</div>`;
      break;
  }
}
