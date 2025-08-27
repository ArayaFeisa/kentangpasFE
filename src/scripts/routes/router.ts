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
    renderCalculator(gen, "Kemarau");
  });

  hujanBtn.addEventListener("click", () => {
    removeOverlay();
    renderCalculator(gen, "Hujan");
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      removeOverlay();
      document.removeEventListener("keydown", onKey);
    }
  };
  document.addEventListener("keydown", onKey);
}

function renderCalculator(gen: "G0" | "G2" | "G3", season: "Hujan" | "Kemarau") {
  // simpan ke hash url
  location.hash = `/calculator/${gen}/${season}`;

  const calculatorPage = new CalculatorPage(gen, season);
  app.replaceChildren();
  app.innerHTML = calculatorPage.render();

  const formEl = app.querySelector("form");
  if (formEl) {
    formEl.addEventListener("submit", (e) => e.preventDefault());

    const savedData = JSON.parse(localStorage.getItem("formData") || "{}");
    formEl.querySelectorAll("input, select").forEach((el: any) => {
      if (savedData[el.name]) el.value = savedData[el.name];
    });

    formEl.addEventListener("input", () => {
      const data: Record<string, string> = {};
      formEl.querySelectorAll("input, select").forEach((el: any) => {
        if (el.name) data[el.name] = el.value;
      });
      localStorage.setItem("formData", JSON.stringify(data));
    });
  }

  bindBackBtn();
}


function bindBackBtn() {
  const backBtn = app.querySelector("#btn-back") as HTMLButtonElement | null;
  if (backBtn) {
    backBtn.onclick = () => {
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
