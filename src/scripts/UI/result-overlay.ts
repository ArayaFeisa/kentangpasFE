import { CalcResponse } from "../pages/calculator/types";
import { fmtNumber, fmtMeter, fmtCurrency } from "../utils/format";

let overlayEl: HTMLElement | null = null;
let escHandler: ((e: KeyboardEvent) => void) | null = null;

function ensureOverlay(): HTMLElement {
  if (!overlayEl) {
    overlayEl = document.createElement("div");
    overlayEl.id = "overlay-result";
    overlayEl.className = "fixed inset-0 bg-black/40 z-50 flex items-center justify-center";
    overlayEl.addEventListener("click", (e) => {
      if (e.target === overlayEl) closeResultOverlay();
    });
    document.body.appendChild(overlayEl);
  }
  return overlayEl;
}

export function closeResultOverlay() {
  if (escHandler) {
    document.removeEventListener("keydown", escHandler);
    escHandler = null;
  }
  overlayEl?.remove();
  overlayEl = null;
}

function enableEscToClose() {
  escHandler = (e) => { if (e.key === "Escape") closeResultOverlay(); };
  document.addEventListener("keydown", escHandler);
}

function focusFirst(root: ParentNode) {
  root.querySelector<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])')?.focus();
}

export function showLoadingOverlay() {
  const o = ensureOverlay();
  o.innerHTML = `
    <div role="dialog" aria-modal="true" aria-busy="true"
         class="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md text-center animate-scale-in">
      <div class="mx-auto h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      <p class="mt-4 text-sm text-gray-600">Menghitung...</p>
    </div>
  `;
  enableEscToClose();
  focusFirst(o);
}

export function showErrorOverlay(msg = "Terjadi kesalahan. Coba lagi.") {
  const o = ensureOverlay();
  o.innerHTML = `
    <div role="dialog" aria-modal="true"
         class="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md animate-scale-in">
      <h3 class="text-lg font-semibold text-red-600">Gagal</h3>
      <p class="mt-2 text-sm text-gray-700">${msg}</p>
      <div class="mt-6 text-right">
        <button class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300" id="btn-close-error">Tutup</button>
      </div>
    </div>
  `;
  o.querySelector<HTMLButtonElement>("#btn-close-error")?.addEventListener("click", closeResultOverlay);
  enableEscToClose();
  focusFirst(o);
}

export function showResultOverlay(data: CalcResponse) {
  const o = ensureOverlay();

  const bibitValue =
    data.kebutuhanBibit.estimasiKg != null
      ? `<span class="text-primary font-semibold">${fmtNumber(data.kebutuhanBibit.estimasiKg)} kg</span>`
      : data.kebutuhanBibit.estimasiBiji != null
      ? `<span class="text-primary font-semibold">${fmtNumber(data.kebutuhanBibit.estimasiBiji)} biji</span>`
      : "-";

  o.innerHTML = `
    <div role="dialog" aria-modal="true"
         class="bg-white rounded-2xl shadow-lg w-[92%] max-w-md animate-scale-in
                border-2 border-primary/70">
      <div class="p-6 space-y-6">
        <h2 class="text-xl font-bold">Hasil Perhitungan</h2>

        <section class="space-y-3">
          <h3 class="text-lg font-extrabold">A. Ringkasan Lahan Anda</h3>
          <p>Lebar 1 Unit (Guludan + Gerandul): <span class="text-primary font-semibold">${fmtMeter(data.ringkasan.lebarUnitM)}</span></p>
          <p>Jumlah Guludan / Baris Tanam: <span class="text-primary font-semibold">${fmtNumber(data.ringkasan.jumlahGuludan)} baris</span></p>
          <p>Panjang Tanam per Guludan: <span class="text-primary font-semibold">${fmtMeter(data.ringkasan.panjangPerGuludanM)}</span></p>
        </section>

        <section class="space-y-3">
          <h3 class="text-lg font-extrabold">B. Kebutuhan Tanam</h3>
          <p>Jumlah Tanaman per Guludan: <span class="text-primary font-semibold">${fmtNumber(data.kebutuhanTanam.tanamanPerGuludan)} pohon</span></p>
          <p>Total Populasi Tanaman: <span class="text-primary font-semibold">${fmtNumber(data.kebutuhanTanam.totalPopulasi)} pohon</span></p>
        </section>

        <section class="space-y-3">
          <h3 class="text-lg font-extrabold">C. ${data.kebutuhanBibit.label}</h3>
          <p>Estimasi Kebutuhan: ${bibitValue}</p>
        </section>

        <section class="space-y-3">
          <h3 class="text-lg font-extrabold">D. Estimasi Biaya Bibit</h3>
          <p>Total Perkiraan Modal yaitu : <span class="text-primary font-extrabold">${fmtCurrency(data.estimasiBiaya.totalModal)}</span></p>
        </section>

        <div class="pt-2">
          <button id="btn-ok" class="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-primary/30">
            Ok
          </button>
        </div>
      </div>
    </div>
  `;

  o.querySelector<HTMLButtonElement>("#btn-ok")?.addEventListener("click", closeResultOverlay);
  enableEscToClose();
  focusFirst(o);
}
