type Gen = "G0" | "G2" | "G3";
type Season = "Hujan" | "Kemarau";

class ResultPage {
  constructor(private gen: Gen, private season: Season) {}
  render(): string {
    return `
      <div class="relative mx-auto max-w-md min-h-screen bg-[#F6F8FC]">
        <header class="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div class="flex items-center gap-3 px-4 py-3">
            <button id="btn-back" type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-200/60"
              aria-label="Kembali">←</button>
            <h1 class="text-sm sm:text-base font-semibold text-gray-900">
              Hasil Perhitungan (${this.gen})
            </h1>
          </div>
        </header>
        <main class="px-5 py-5">
          <div id="rs-container"
               class="rounded-2xl border-2 border-green-500 bg-white p-5 shadow-sm">
          </div>
          <div class="mt-6">
            <button id="btn-ok"
              class="w-full rounded-xl bg-green-600 px-4 py-3 text-white font-semibold shadow-sm
                     hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-green-600/30">
              Ok
            </button>
          </div>
        </main>
      </div>
    `;
  }

  mount(root: HTMLElement) {
    const raw = sessionStorage.getItem("last_result");
    if (!raw) {
      location.hash = `/calculator/${this.gen}/${this.season}`;
      return;
    }

    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { parsed = null; }
    const d = parsed?.result?.data;
    if (!d) {
      location.hash = `/calculator/${this.gen}/${this.season}`;
      return;
    }

    const box = root.querySelector<HTMLDivElement>("#rs-container")!;
    box.innerHTML = `
      <h2 class="text-xl font-bold mb-4">Hasil Perhitungan</h2>
      <section class="space-y-2 mb-4">
        <h3 class="text-lg font-extrabold">A. Ringkasan Lahan Anda</h3>
        <p>Lebar 1 Unit (Guludan + Gerandul):
           <span class="text-green-600 font-semibold">${d.ringkasanLahan.lebarUnitTanam}</span></p>
        <p>Jumlah Guludan / Baris Tanam:
           <span class="text-green-600 font-semibold">${d.ringkasanLahan.jumlahGuludan}</span></p>
        <p>Panjang Tanam per Guludan:
           <span class="text-green-600 font-semibold">${d.ringkasanLahan.panjangTanamPerGuludan}</span></p>
      </section>

      <section class="space-y-2 mb-4">
        <h3 class="text-lg font-extrabold">B. Kebutuhan Tanam</h3>
        <p>Jumlah Tanaman per Guludan:
           <span class="text-green-600 font-semibold">${d.kebutuhanTanam.jumlahTanamanPerGuludan}</span></p>
        <p>Total Populasi Tanaman:
           <span class="text-green-600 font-semibold">${d.kebutuhanTanam.totalPopulasiTanaman}</span></p>
      </section>

      <section class="space-y-2 mb-4">
        <h3 class="text-lg font-extrabold">C. Kebutuhan Bibit (${this.gen})</h3>
        <p>Estimasi Kebutuhan:
           <span class="text-green-600 font-semibold">${d.kebutuhanBibit.estimasi}</span></p>
        <p class="text-xs text-gray-500 italic">${d.kebutuhanBibit.note}</p>
      </section>

      <section class="space-y-2">
        <h3 class="text-lg font-extrabold">D. Estimasi Biaya Bibit</h3>
        <p>Total Perkiraan Modal yaitu :
           <span class="text-green-600 font-extrabold">${d.estimasiBiaya.total}</span></p>
      </section>
    `;
    const okBtn = root.querySelector<HTMLButtonElement>("#btn-ok")!;
    okBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const from = sessionStorage.getItem("result_from");
      sessionStorage.removeItem("result_from");
      sessionStorage.removeItem("last_result");

      if (from === "history") {
        location.replace("#/history");
      } else {
        location.replace("#/home");
      }
    });
  }
}

export default ResultPage;
