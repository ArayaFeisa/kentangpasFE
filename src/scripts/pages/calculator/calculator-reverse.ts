import { API_URL } from "../../../config/api";
type Season = "Hujan" | "Kemarau";
type Gen = "G0" | "G2" | "G3";

class CalculatorReverse {
  constructor(private gen: Gen, private season: Season) {}

  render(): string {
    const rekomJarak =
      this.season === "Hujan"
        ? "Rekomendasi untuk Jarak Tanam musim hujan 40 cm"
        : "Rekomendasi untuk Jarak Tanam musim kemarau 30 cm";

    const isG0 = this.gen === "G0";
    const labelBibit = isG0 ? "Jumlah Bibit (biji)" : "Jumlah Bibit (kg)";

    return `
    <div class="relative mx-auto max-w-md min-h-screen bg-white">
      <header class="sticky top-0 z-30 bg-[#F6F8FC] border-b border-gray-200">
        <div class="flex items-center gap-3 px-4 py-3">
          <button id="btn-back" type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-200/60"
            aria-label="Kembali">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <h1 class="text-sm sm:text-base font-semibold text-gray-900">
            Kalkulator Reverse (${this.gen})
          </h1>
        </div>
      </header>

      <main class="relative z-10 px-5 pt-5 pb-28">
        <h2 class="text-base font-extrabold text-gray-900 mb-3 text-center">
          Estimasi Luas Berdasarkan Jumlah Bibit
        </h2>

        <form id="reverse-calculator-form" class="mt-4 space-y-4">
          <div>
            <label for="jumlah_bibit" class="block text-sm font-medium text-gray-800">${labelBibit} :</label>
            <input id="jumlah_bibit" name="jumlah_bibit" type="number" inputmode="numeric" min="1"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3]
              px-3 py-2 text-gray-900 focus:border-gray-400 focus:outline-none
              focus:ring-2 focus:ring-[#A46E2D]/30" />
          </div>

          ${
            isG0
              ? ""
              : `
          <div>
            <label for="jumlah_perkg" class="block text-sm font-medium text-gray-800">
              Jumlah Umbi per Kg (biji/kg) :
            </label>
            <input id="jumlah_perkg" name="jumlah_perkg" type="number" inputmode="numeric" min="1" value="15"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3]
              px-3 py-2 text-gray-900 focus:border-gray-400 focus:outline-none
              focus:ring-2 focus:ring-[#A46E2D]/30" />
            <p class="text-xs text-gray-500 italic mt-2 leading-snug">
              Rata-rata umbi per kilogram untuk G2 sekitar 15 biji, untuk G3 antara 12–18 biji.
            </p>
          </div>
              `
          }

          <div>
            <label for="jarak_tanam" class="block text-sm font-medium text-gray-800">Jarak Tanam (cm) :</label>
            <input id="jarak_tanam" name="jarak_tanam" type="number" inputmode="numeric" min="10"
              value="${this.season === "Hujan" ? 40 : 30}"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3]
              px-3 py-2 text-gray-900 focus:border-gray-400 focus:outline-none
              focus:ring-2 focus:ring-[#A46E2D]/30" />
            <p class="text-xs text-gray-500 italic mt-2 leading-snug">${rekomJarak}</p>
          </div>

          <div>
            <label for="guludan" class="block text-sm font-medium text-gray-800">Lebar Guludan (cm) :</label>
            <input id="guludan" name="guludan" type="number" inputmode="numeric" min="0" value="80"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3]
              px-3 py-2 text-gray-900 focus:border-gray-400 focus:outline-none
              focus:ring-2 focus:ring-[#A46E2D]/30" />
          </div>

          <div>
            <label for="gerandul" class="block text-sm font-medium text-gray-800">Lebar Gerandul / Parit (cm) :</label>
            <input id="gerandul" name="gerandul" type="number" inputmode="numeric" min="0" value="40"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3]
              px-3 py-2 text-gray-900 focus:border-gray-400 focus:outline-none
              focus:ring-2 focus:ring-[#A46E2D]/30" />
          </div>

          <div class="pt-1 mt-8">
            <button type="submit"
              class="w-auto mx-auto block rounded-xl bg-[#D08928] px-4 py-3 text-white font-semibold shadow-sm
              hover:brightness-105 active:brightness-110 focus:outline-none focus:ring-4 focus:ring-[#D08928]/30">
              Hitung Estimasi Lahan
            </button>
          </div>
        </form>
      </main>
    </div>
    `;
  }
}

export default CalculatorReverse;

export interface ReverseCalcRequestPayload {
  generasiBibit: "G0" | "G2" | "G3";
  jumlahBibit: number; // biji atau kg
  jumlahPerKg?: number; // jika gen G2/G3
  jarakTanam: number;
  lebarGuludan: number;
  lebarParit: number;
}

export interface ReverseCalcResponsePayload {
  message: string;
  data: {
    ringkasan: {
      estimasiLuasM2: string;
      jumlahGuludan: string;
      panjangPerGuludan: string;
    };
    estimasiPopulasi: {
      totalTanaman: string;
      note: string;
    };
  };
}
