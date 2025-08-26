import { getActiveRoute, parseActivePathname } from "./url-parser";
import Home from "../pages/home/home";
import CalculatorPage from "../pages/calculator/calculator";

const app = document.querySelector("#app") as HTMLElement;

export function router() {
  const activeRoute = getActiveRoute();
  const segments = parseActivePathname();

  switch (activeRoute) {
    case "/":
      const homePage = new Home();
      app.innerHTML = homePage.render();

      // Tambahkan event listener button
      const g0Btn = app.querySelector("#btn-g0") as HTMLButtonElement;
      const g2Btn = app.querySelector("#btn-g2") as HTMLButtonElement;
      const g3Btn = app.querySelector("#btn-g3") as HTMLButtonElement;

      g0Btn?.addEventListener("click", () => {
        location.hash = "/calculator/g0";
      });
      g2Btn?.addEventListener("click", () => {
        location.hash = "/calculator/g2";
      });
      g3Btn?.addEventListener("click", () => {
        location.hash = "/calculator/g3";
      });
      break;

    case "/calculator/:id":
      if (!segments.id) {
        location.hash = "/";
        return;
      }

      const gen = segments.id.toUpperCase() as "G0" | "G2" | "G3";
      const calculatorPage = new CalculatorPage(gen);
      app.innerHTML = calculatorPage.render();

      // event tombol kembali
      const backBtn = app.querySelector("#btn-back") as HTMLButtonElement;
      backBtn?.addEventListener("click", () => {
        location.hash = "/";
      });
      break;

    default:
      app.innerHTML = `<div class="p-6 text-center">404 - Halaman tidak ditemukan</div>`;
      break;
  }
}
