import CalculatorReverse, {
  ReverseCalcRequestPayload,
  ReverseCalcResponsePayload,
} from "./calculator-reverse";
import { API_ENDPOINTS } from "../../../config/api";
import { apiPost } from "../../../utils/api-helper";

class CalculatorReversePresenter {
  private formEl: HTMLFormElement | null = null;
  private container: HTMLElement | null = null;
  private loadingOverlay: HTMLElement | null = null;

  constructor(private gen: "G0" | "G2" | "G3", private season: "Hujan" | "Kemarau") {}

  init() {
    const view = new CalculatorReverse(this.gen, this.season);
    const appRoot = document.getElementById("app");
    if (!appRoot) return;

    appRoot.innerHTML = view.render();

    this.container = appRoot;
    this.formEl = document.getElementById("reverse-calculator-form") as HTMLFormElement;
    const backBtn = document.getElementById("btn-back");

    this.formEl?.addEventListener("submit", (e) => this._handleSubmit(e));
    backBtn?.addEventListener("click", () => window.history.back());
  }

  private _showAlert(message: string, type: "error" | "warning" | "success" = "warning") {
    const color =
      type === "error" ? "#F87171" : type === "success" ? "#34D399" : "#FBBF24";

    const alertBox = document.createElement("div");
    alertBox.className =
      "fixed top-5 left-1/2 -translate-x-1/2 bg-white shadow-lg border rounded-lg px-4 py-2 text-sm font-medium z-50";
    alertBox.style.borderColor = color;
    alertBox.style.color = "#111827";
    alertBox.style.minWidth = "240px";
    alertBox.style.textAlign = "center";
    alertBox.innerText = message;

    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 2800);
  }

  private _showLoading() {
    this._hideLoading();

    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center z-50";
    overlay.innerHTML = `
      <div class="bg-white px-6 py-4 rounded-xl shadow-md text-center">
        <div class="animate-spin border-4 border-[#D08928] border-t-transparent rounded-full w-8 h-8 mx-auto mb-3"></div>
        <p class="text-sm text-gray-700 font-medium">Menghitung... Mohon tunggu</p>
      </div>
    `;

    document.body.appendChild(overlay);
    this.loadingOverlay = overlay;
  }

  private _hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.remove();
      this.loadingOverlay = null;
    }
  }

  private async _handleSubmit(event: Event) {
    event.preventDefault();
    if (!this.formEl) return;

    const formData = new FormData(this.formEl);
    const jumlahBibit = Number(formData.get("jumlah_bibit"));
    const jumlahPerKg = Number(formData.get("jumlah_perkg")) || undefined;
    const jarakTanam = Number(formData.get("jarak_tanam"));
    const lebarGuludan = Number(formData.get("guludan"));
    const lebarParit = Number(formData.get("gerandul"));

    if (!jumlahBibit || !jarakTanam || !lebarGuludan || !lebarParit) {
      this._showAlert("Harap isi semua kolom terlebih dahulu!", "warning");
      return;
    }

    const payload: ReverseCalcRequestPayload = {
      generasiBibit: this.gen,
      jumlahBibit,
      jumlahPerKg,
      jarakTanam,
      lebarGuludan,
      lebarParit,
    };

    try {
      this._showLoading();

      const response = await apiPost<ReverseCalcResponsePayload>(
        API_ENDPOINTS.CALCULATOR.REVERSE,
        payload
      );

      this._hideLoading();

      if (!response.success || !response.data) {
        throw new Error(response.error || "Gagal menghitung estimasi.");
      }

      this._showAlert("Perhitungan berhasil!", "success");
      this._renderResult(response.data.data);
    } catch (err) {
      this._hideLoading();
      this._showAlert((err as Error).message, "error");
    }
  }

  private _renderResult(data: ReverseCalcResponsePayload["data"]) {
    if (!this.container) return;

    const resultHTML = `
      <section class="mt-8 bg-[#F6FBF3] border border-gray-300 rounded-xl p-4">
        <h3 class="text-lg font-bold text-gray-900 mb-2 text-center">Hasil Perhitungan</h3>

        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-medium text-gray-700">Estimasi Luas Lahan:</span>
            <span class="text-gray-900 font-semibold">${data.ringkasan.estimasiLuasM2} m²</span>
          </div>

          <div class="flex justify-between text-sm">
            <span class="font-medium text-gray-700">Jumlah Guludan:</span>
            <span class="text-gray-900 font-semibold">${data.ringkasan.jumlahGuludan}</span>
          </div>

          <div class="flex justify-between text-sm">
            <span class="font-medium text-gray-700">Panjang per Guludan:</span>
            <span class="text-gray-900 font-semibold">${data.ringkasan.panjangPerGuludan} m</span>
          </div>

          <hr class="my-3">

          <div class="flex justify-between text-sm">
            <span class="font-medium text-gray-700">Total Populasi Tanaman:</span>
            <span class="text-gray-900 font-semibold">${data.estimasiPopulasi.totalTanaman} tanaman</span>
          </div>

          <p class="text-xs text-gray-500 italic mt-2">${data.estimasiPopulasi.note}</p>
        </div>
      </section>
    `;

    const oldResult = this.container.querySelector("section.mt-8");
    if (oldResult) oldResult.remove();

    this.container.querySelector("main")?.insertAdjacentHTML("beforeend", resultHTML);
  }
}

export default CalculatorReversePresenter;
