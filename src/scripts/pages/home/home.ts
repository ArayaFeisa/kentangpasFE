import "../../../styles/tailwind.css";

class Home {
  render(): string {
    return `
      <div class="w-full min-h-screen bg-gray-50 px-6 py-8">
        
        <!-- Section Judul -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Halo</h1>
          <p class="text-xl font-semibold mt-1">
            Selamat Datang di 
            <span class="text-green-600">KENTANG<span class="text-yellow-500">PAS!</span></span>
          </p>
        </div>

        <!-- Section Pilih Kategori -->
        <div class="mb-10">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Pilih Kategori</h2>
          <div class="flex flex-col gap-4">
            <button 
              id="btn-g0"
              class="w-full px-4 py-3 rounded-2xl border border-green-500 text-left font-medium text-gray-800 hover:bg-green-50 transition">
              🌱 Generasi Bibit: G0 Untuk Tahap Awal
            </button>
            <button 
              id="btn-g2"
              class="w-full px-4 py-3 rounded-2xl border border-green-500 text-left font-medium text-gray-800 hover:bg-green-50 transition">
              🪴 Generasi Bibit: G2 Untuk Pembesaran
            </button>
            <button 
              id="btn-g3"
              class="w-full px-4 py-3 rounded-2xl border border-green-500 text-left font-medium text-gray-800 hover:bg-green-50 transition">
              🥔 Generasi Bibit: G3 Untuk Konsumsi
            </button>
          </div>
        </div>

        <!-- Section Artikel (sementara placeholder) -->
        <div id="articles">
          <h2 class="text-lg font-bold text-gray-800 mb-4">
            Panduan Pertanian & Teknologi
          </h2>
          <p class="text-gray-500">Artikel akan ditampilkan di sini...</p>
        </div>
      </div>
    `;
  }
}

export default Home;
