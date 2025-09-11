import { API_URL } from "../../../config/api";

type Season = "Hujan" | "Kemarau";

class CalculatorG3 {
  constructor(private season: Season, private resetSpacing = false) {}

  render(): string {
    const defaultJarak = this.season === "Hujan" ? 40 : 30;
    const rekomJarak =
    this.season === "Hujan"
        ? `Rekomendasi untuk Jarak Tanam untuk musim hujan ${defaultJarak} Cm`
        : `Rekomendasi untuk Jarak Tanam untuk musim Kemarau ${defaultJarak} Cm`;

    return `
    <div class="relative mx-auto max-w-md min-h-screen bg-white">

    <!-- App Bar -->
    <header class="sticky top-0 z-30 bg-[#F6F8FC] border-b border-gray-200">
      <div class="flex items-center gap-3 px-4 py-3">
                <button id="btn-back" type="button"
  class="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-200/60"
  aria-label="Kembali">
  <svg viewBox="0 0 24 24" class="h-5 w-5 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6"/>
  </svg>
</button>

        <h1 class="text-sm sm:text-base font-semibold text-gray-900">
          Kalkulator Tani Presisi Bromo (G3)
        </h1>
      </div>
    </header>

      <!-- Content -->
      <div class="relative overflow-hidden">
      <main class="relative z-10 px-5 pt-5 pb-28">
        <h2 class="text-base font-extrabold text-gray-900 mb-2 text-center">
        Ukuran Lahan
        </h2>


        <form id="calculator-form" class="mt-4 space-y-4">
          <!-- Panjang -->
          <div>
            <label for="panjang" class="block text-sm font-medium text-gray-800">Panjang Lahan (m) :</label>
            <input id="panjang" name="panjang" type="number" step="0.01" inputmode="decimal" min="0"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3] px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A46E2D]/30" />
          </div>

          <!-- Lebar -->
          <div>
            <label for="lebar" class="block text-sm font-medium text-gray-800">Lebar Lahan (m) :</label>
            <input id="lebar" name="lebar" type="number" step="0.01" inputmode="decimal" min="0"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3] px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A46E2D]/30" />
          </div>

          <!-- Lebar Guludan -->
          <div>
            <label for="guludan" class="block text-sm font-medium text-gray-800">Lebar Guludan (cm) :</label>
            <input id="guludan" name="guludan" type="number" inputmode="numeric" min="0" value="80"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3] px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A46E2D]/30" />
          </div>

          <!-- Lebar Gerandul/Parit -->
          <div>
            <label for="gerandul" class="block text-sm font-medium text-gray-800">Lebar Gerandul / Parit (cm) :</label>
            <input id="gerandul" name="gerandul" type="number" inputmode="numeric" min="0" value="40"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3] px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A46E2D]/30" />
          </div>

          <!-- Jarak Tanam -->
          <div>
        <label for="jarak_tanam" class="block text-sm font-medium text-gray-800">
          Jarak Tanam :
        </label>
        <input id="jarak_tanam" name="jarak_tanam" type="number" inputmode="numeric" min="0"
               value="${defaultJarak}"
               class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3] px-3 py-2 text-gray-900 placeholder-gray-400
                      focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A46E2D]/30" />
        <p class="text-xs text-gray-500 italic mt-2 leading-snug">
          ${rekomJarak}
        </p>
      </div>

          <!-- Harga bibit per kilo -->
          <div>
            <label for="harga_perkg" class="block text-sm font-medium text-gray-800">Harga bibit G3 per Kilo :</label>
            <input id="harga_perkg" name="harga_perkg" type="number" inputmode="decimal" min="0"
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-[#F6FBF3] px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A46E2D]/30" />
          </div>

          <!-- Calculate -->
        <div class="pt-1 mt-8">
        <button type="submit"
          class="w-auto mx-auto block rounded-xl bg-[#D08928] px-4 py-3 text-white font-semibold shadow-sm hover:brightness-105 active:brightness-110 focus:outline-none focus:ring-4 focus:ring-[#D08928]/30">
          Hitung Kebutuhan Saya
        </button>
      </div>
        </form>
      </main>

      <!-- Leaf -->
      <div aria-hidden="true"
     class="pointer-events-none select-none absolute right-[-8px] -bottom-30 w-[200px] z-0">
        <svg width="225" height="252" viewBox="0 0 225 252" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.384566 38.3999C77.5216 41.9583 106.706 57.2634 106.857 136.582C106.857 136.582 116.156 130.491 99.8755 144C83.5954 157.508 -6.59733 141.818 0.384566 38.3999Z" fill="#49A939"/>
          <path d="M224.347 0C158.565 3.02801 133.677 16.052 133.548 83.5482C133.548 83.5482 125.618 78.3655 139.502 89.8607C153.386 101.356 230.302 88.0041 224.347 0Z" fill="#49A939"/>
          <path d="M203.476 101.236C152.448 103.585 133.143 113.688 133.042 166.045C133.042 166.045 126.891 162.025 137.661 170.941C148.43 179.858 208.094 169.501 203.476 101.236Z" fill="#49A939"/>
          <path d="M20.1076 58.3676C21.9273 57.0938 24.3596 57.0474 26.233 58.2407C88.2086 97.7173 110.204 128.908 123.229 196.743C123.631 198.836 122.761 200.991 121.015 202.212V202.212C117.691 204.539 113.073 202.52 112.412 198.516C101.511 132.464 78.7462 102.52 20.5043 67.75C17.0315 65.6767 16.7942 60.6873 20.1076 58.3676V58.3676Z" fill="#2C6922"/>
          <path d="M112.908 183.894C110.918 182.907 109.713 180.794 109.863 178.578C114.842 105.266 131.692 71.0206 185.006 27.1026C186.651 25.748 188.959 25.4798 190.868 26.4269V26.4269C194.502 28.2306 194.94 33.2522 191.742 35.7492C138.976 76.9496 123.589 111.273 120.955 179.053C120.798 183.095 116.531 185.692 112.908 183.894V183.894Z" fill="#2C6922"/>
          <path d="M118.821 247.058C116.966 246.138 115.77 244.237 115.738 242.166C114.717 177.39 129.01 148.301 179.509 113.66C181.127 112.549 183.242 112.4 185 113.272V113.272C188.851 115.183 189.07 120.616 185.469 122.965C137.155 154.491 124.414 183.499 126.97 241.655C127.159 245.954 122.675 248.971 118.821 247.058V247.058Z" fill="#2C6922"/>
        </svg>
      </div>
    </div>
    `;
  }
}

export default CalculatorG3;

export interface G3RequestPayload {
  generasiBibit: "G3";
  panjangLahan: number;
  lebarLahan: number;
  lebarGuludan: number;
  lebarParit: number;
  jarakTanam: number;
  estimasiHarga: number;
}

export interface G3ResponsePayload {
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
      note: string;
    };
    estimasiBiaya: {
      total: string;
    };
  };
}