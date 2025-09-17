class Home {
  render(): string {
    return `
      <div class="mx-auto max-w-md min-h-screen bg-white relative pb-24">
        <header class="px-6 pt-4 pb-8">
          <h1 class="text-3xl font-bold text-black mb-2">Halo</h1>
          <p class="text-black font-bold mb-1">
            <span>Selamat Datang di</span>
            <span class="font-extrabold text-[#D18E27]">KENTANG</span>
            <span class="font-extrabold text-[#49A939]">PAS!</span>
          </p>
          <p class="text-black font-medium">Kalkulator Cerdas Berbasis Guludan</p>
          <p class="text-gray-600 text-sm mt-1">Pilih Kategori</p>
        </header>
      <main class="px-6">
        <div class="grid grid-cols-2 gap-x-5 gap-y-6">
            <button id="btn-g0" type="button" class="kp-card bg-g0 h-[230px]">
        <img src="/icons/eclipse1.svg" alt="" aria-hidden="true" class="kp-blob kp-blob-top" />
        <img src="/icons/eclipse2.svg" alt="" aria-hidden="true" class="kp-blob kp-blob-btm" />
        <div class="kp-card-content">
          <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
            <span class="text-[22px]">🌱</span>
          </div>
          <div class="text-center leading-tight max-w-[220px]">
            <p class="text-[18px] font-medium">Generasi Bibit</p>
            <p class="text-[22px] font-extrabold">G0</p>
            <p class="text-[14px] opacity-95">Untuk Tahap Awal</p>
          </div>
        </div>
      </button>
      <button id="btn-g2" type="button" class="kp-card bg-g2 h-[230px]">
        <img src="/icons/eclipse1.svg" alt="" aria-hidden="true" class="kp-blob kp-blob-top" />
        <img src="/icons/eclipse2.svg" alt="" aria-hidden="true" class="kp-blob kp-blob-btm" />
        <div class="kp-card-content">
          <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
            <span class="text-[22px]">🧺</span>
          </div>
          <div class="text-center leading-tight max-w-[220px]">
            <p class="text-[18px] font-medium">Generasi Bibit</p>
            <p class="text-[22px] font-extrabold">G2</p>
            <p class="text-[14px] opacity-95">Untuk Pembesaran</p>
          </div>
        </div>
      </button>
            <button id="btn-g3" type="button"
        class="kp-card kp-card-g3 bg-g3 h-[230px] col-span-2 max-w-[280px] mx-auto">
        <img src="/icons/eclipse1.svg" alt="" aria-hidden="true" class="kp-blob kp-blob-top" />
        <img src="/icons/eclipse2.svg" alt="" aria-hidden="true" class="kp-blob kp-blob-btm" />
        <div class="kp-card-content">
          <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
            <span class="text-[22px]">🥔</span>
          </div>
          <div class="text-center leading-tight max-w-[220px]">
            <p class="text-[18px] font-medium">Generasi Bibit</p>
            <p class="text-[22px] font-extrabold">G3</p>
            <p class="text-[14px] opacity-95">Untuk Konsumsi</p>
          </div>
        </div>
      </button>
        <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200" aria-label="Navigasi bawah">
          <div class="flex justify-center gap-16 py-3">
            <a href="#/home" data-nav="/home" class="flex flex-col items-center">
              <img src="/icons/beranda1.svg" alt="Beranda" class="w-6 h-6" />
              <span class="text-xs mt-1">Beranda</span>
            </a>
            <a href="#/history" data-nav="/history" class="flex flex-col items-center">
              <img src="/icons/history1.svg" alt="History" class="w-6 h-6" />
              <span class="text-xs mt-1">History</span>
            </a>
          </div>
        </nav>
    </div>
    `;
  }
}

export default Home;
