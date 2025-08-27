import "../../../styles/tailwind.css";

export type Generation = "G0" | "G2" | "G3";
export type Season = "HUJAN" | "KEMARAU";

class CalculatorPage {
  private gen: Generation;
  private season: Season;

  constructor(gen: Generation, season: Season) {
    this.gen = gen;
    this.season = season;
  }

  private getDefaultSizes() {
    if (this.season === "HUJAN") {
      return { guludan: 80, gerandul: 40 };
    } else {
      return { guludan: 60, gerandul: 30 };
    }
  }

  private renderFields(): string {
    const defaults = this.getDefaultSizes();
    let extraFields = "";

    if (this.gen === "G0" || this.gen === "G2") {
      extraFields += `
        <!-- Mulsa -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mulsa</label>
          <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500">
            <option>YA</option>
            <option>TIDAK</option>
          </select>
        </div>
      `;
    }

    return `
      <!-- Panjang Lahan -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Panjang Lahan (m)</label>
        <input type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"/>
      </div>

      <!-- Lebar Lahan -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Lebar Lahan (m)</label>
        <input type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"/>
      </div>

      <!-- Lebar Guludan -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Lebar Guludan (cm)</label>
        <input type="number" value="${defaults.guludan}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"/>
      </div>

      <!-- Lebar Gerandul / Parit -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Lebar Gerandul / Parit (cm)</label>
        <input type="number" value="${defaults.gerandul}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"/>
      </div>

      ${extraFields}
    `;
  }

  render(): string {
    return `
      <div class="w-full min-h-screen bg-gray-50 px-6 py-8 flex flex-col justify-between">
        
        <!-- Header -->
        <header class="mb-6">
          <button id="btn-back" class="text-gray-600 text-sm mb-4">← Kembali</button>
          <h1 class="text-lg font-bold">Kalkulator Tani Presisi Bromo (${this.gen})</h1>
          <h2 class="text-sm text-gray-600">Ukuran Lahan (Metode Guludan) - Musim ${this.season}</h2>
        </header>

        <!-- Form -->
        <form class="flex flex-col gap-4">
          ${this.renderFields()}

          <!-- Hitung Estimasi Biaya -->
          <div class="flex items-start gap-2">
            <input type="checkbox" checked class="mt-1"/>
            <div class="text-sm text-gray-700">
              Hitung Estimasi Biaya <br/>
              <span class="text-gray-500 text-xs">Harga default untuk ${this.gen} sebesar Rp XX.XXX/kg</span>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" 
            class="w-full bg-yellow-600 text-white font-semibold py-3 rounded-xl shadow hover:bg-yellow-700 transition">
            Hitung Kebutuhan Saya
          </button>
        </form>

        <!-- Dekorasi -->
        <div class="mt-8 flex justify-center">
          <img src="/assets/leaf.svg" alt="decor" class="w-16 h-16 opacity-80"/>
        </div>
      </div>
    `;
  }
}

export default CalculatorPage;
