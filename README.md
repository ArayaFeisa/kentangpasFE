# Bibitku - Kalkulator Bibitku

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.12-38bdf8.svg)

**Bibitku** (Kalkulator Cerdas Berbasis Guludan) adalah aplikasi Progressive Web App (PWA) untuk menghitung kebutuhan bibit kentang berdasarkan ukuran lahan menggunakan metode guludan (ridge cultivation). Proyek ini dikembangkan oleh **Laboratorium Sistem Informasi** sebagai bagian dari upaya digitalisasi pertanian presisi.

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi dan Setup](#instalasi-dan-setup)
- [Penggunaan](#penggunaan)
- [Pengembangan](#pengembangan)
- [Integrasi API](#integrasi-api)
- [Kontak](#kontak)

---

## Tentang Proyek

**Bibitku** adalah solusi digital untuk membantu petani dan peneliti dalam menghitung kebutuhan bibit kentang secara presisi. Aplikasi ini mendukung perhitungan untuk berbagai generasi bibit (G0, G2, G3) dan menyesuaikan dengan kondisi musim tanam (Hujan dan Kemarau).

### Latar Belakang

Pertanian presisi memerlukan perhitungan akurat untuk optimalisasi penggunaan bibit dan lahan. Metode guludan (ridge cultivation) adalah teknik budidaya kentang yang umum digunakan di Indonesia, khususnya di daerah dataran tinggi seperti Bromo. Aplikasi ini dirancang untuk:

- Mengurangi kesalahan perhitungan manual
- Mengoptimalkan penggunaan bibit
- Menyediakan estimasi biaya produksi
- Mendukung perencanaan pertanian berbasis data

### Target Pengguna

- **Petani**: Perencanaan kebutuhan bibit dan estimasi biaya
- **Peneliti**: Analisis dan perencanaan eksperimen pertanian
- **Mahasiswa**: Pembelajaran metode pertanian presisi
- **Akademisi**: Riset dan pengembangan teknologi pertanian

---

## Fitur Utama

### 1. Kalkulator Bibit Multi-Generasi

Aplikasi mendukung perhitungan untuk tiga generasi bibit kentang:

- **G0 (Generasi 0)**: Bibit tahap awal dari kultur jaringan (seed potato)
- **G2 (Generasi 2)**: Bibit untuk pembesaran
- **G3 (Generasi 3)**: Bibit untuk konsumsi

### 2. Adaptasi Musim Tanam

Perhitungan disesuaikan dengan kondisi musim:

- **Musim Hujan**: Jarak tanam dan dimensi guludan optimal untuk kondisi basah
- **Musim Kemarau**: Pengaturan khusus untuk kondisi kering

### 3. Dua Mode Perhitungan

#### a. Mode Estimasi Jumlah Bibit

Input: Dimensi lahan (panjang, lebar, guludan, gerandul/parit)
Output: Jumlah bibit yang dibutuhkan, estimasi biaya

#### b. Mode Reverse (Estimasi Luas Lahan)

Input: Jumlah bibit yang tersedia
Output: Estimasi luas lahan yang dapat ditanami

### 4. Fitur Tambahan

- **History Tracking**: Menyimpan riwayat perhitungan untuk analisis
- **Offline Support**: PWA dengan Service Worker untuk akses offline
- **Responsive Design**: Optimal untuk mobile dan desktop
- **Persistent Form**: Data form tersimpan otomatis di localStorage
- **Estimasi Biaya**: Perhitungan estimasi biaya produksi

---

## Teknologi yang Digunakan

### Frontend Stack

| Teknologi       | Versi  | Fungsi                                      |
| --------------- | ------ | ------------------------------------------- |
| **TypeScript**  | 5.3.3  | Bahasa pemrograman utama dengan type safety |
| **TailwindCSS** | 4.1.12 | Framework CSS utility-first untuk styling   |
| **Webpack**     | 5.91.0 | Module bundler dan build tool               |
| **Workbox**     | 7.3.0  | Service Worker untuk PWA capabilities       |

### Development Tools

- **ts-loader**: TypeScript loader untuk Webpack
- **PostCSS**: Pemrosesan CSS dengan Autoprefixer
- **webpack-dev-server**: Development server dengan hot reload
- **dotenv-webpack**: Environment variable management
- **copy-webpack-plugin**: Asset management

### Browser Support

- Chrome/Edge (versi terbaru)
- Firefox (versi terbaru)
- Safari (versi terbaru)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Arsitektur Sistem

### Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │                 Bibitku Frontend                   │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────┐ │  │
│  │  │   Router    │  │  Calculator  │  │ History  │ │  │
│  │  │   System    │  │    Pages     │  │  Manager │ │  │
│  │  └─────────────┘  └──────────────┘  └──────────┘ │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │         Service Worker (Workbox)            │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend API Server                     │
│         (api-bibitku.filkom.ub.ac.id)                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │  POST /api/calculator/generate                      │ │
│  │  POST /api/calculator/reverse                       │ │
│  │  GET  /health                                       │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Pola Arsitektur

1. **Single Page Application (SPA)**: Routing client-side dengan hash routing
2. **Progressive Web App (PWA)**: Offline-first dengan Service Worker
3. **Component-Based**: Setiap halaman adalah class dengan method `render()`
4. **Stateless Components**: State management menggunakan localStorage dan sessionStorage
5. **API-First**: Semua kalkulasi kompleks dilakukan di backend

### Struktur Routing

```typescript
/                    → Splash Screen (first visit)
/home                → Halaman utama dengan pilihan generasi
/calculator/:gen/:season  → Form input lahan
/reverse/:gen/:season     → Form reverse calculation
/result/:gen/:season      → Hasil perhitungan
/history             → Riwayat perhitungan
```

---

## Struktur Proyek

```
kentangpasFE/
├── src/
│   ├── config/
│   │   └── api.ts                 # Konfigurasi endpoint API
│   ├── scripts/
│   │   ├── index.ts               # Entry point aplikasi
│   │   ├── sw-register.ts         # Service Worker registration
│   │   ├── data/
│   │   │   └── api.js             # API helper functions
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   └── home.ts        # Halaman utama
│   │   │   ├── calculator/
│   │   │   │   ├── calculator.ts           # Base calculator class
│   │   │   │   ├── calculatorg0.ts         # Calculator G0
│   │   │   │   ├── calculatorg2.ts         # Calculator G2
│   │   │   │   ├── calculatorg3.ts         # Calculator G3
│   │   │   │   ├── calculator-reverse.ts   # Reverse calculator view
│   │   │   │   ├── calculator-reverse-presenter.ts  # Presenter
│   │   │   │   └── types.ts                # Type definitions
│   │   │   ├── result/
│   │   │   │   └── result.ts      # Halaman hasil perhitungan
│   │   │   ├── history/
│   │   │   │   └── history.ts     # Halaman riwayat
│   │   │   └── splash/
│   │   │       └── splash.ts      # Splash screen
│   │   ├── routes/
│   │   │   ├── router.ts          # Main router logic
│   │   │   └── url-parser.ts      # URL parsing utilities
│   │   ├── UI/
│   │   │   └── result-overlay.ts  # Overlay components
│   │   └── utils/
│   │       └── format.ts          # Formatting utilities
│   ├── utils/
│   │   └── api-helper.ts          # API helper utilities
│   ├── styles/
│   │   └── tailwind.css           # TailwindCSS imports
│   ├── public/
│   │   ├── manifest.json          # PWA manifest
│   │   ├── icons/                 # App icons
│   │   └── assets/                # Static assets
│   ├── sw.js                      # Service Worker
│   └── index.html                 # HTML template
├── webpack.common.cjs              # Webpack common config
├── webpack.dev.cjs                 # Webpack dev config
├── webpack.prod.cjs                # Webpack production config
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # TailwindCSS configuration
├── package.json                    # Dependencies & scripts
├── .env.development                # Development environment variables
├── .env.production                 # Production environment variables
├── .env.example                    # Example environment variables
└── README.md                       # Dokumentasi proyek
```

### Penjelasan Direktori Utama

- **`src/config/`**: Konfigurasi aplikasi, terutama endpoint API
- **`src/scripts/pages/`**: Semua halaman aplikasi menggunakan class-based components
- **`src/scripts/routes/`**: Sistem routing SPA
- **`src/scripts/utils/`**: Utility functions dan helpers
- **`src/public/`**: Asset statis yang akan di-copy ke dist/

---

## Instalasi dan Setup

### Prasyarat

Pastikan sistem Anda telah menginstall:

- **Node.js** (versi 18.x atau lebih baru)
- **npm** atau **yarn**
- **Git** (untuk clone repository)

### Langkah-langkah Instalasi

#### 1. Clone Repository

```bash
git clone <repository-url>
cd kentangpasFE
```

#### 2. Install Dependencies

```bash
npm install
```

atau menggunakan yarn:

```bash
yarn install
```

#### 3. Konfigurasi Environment Variables

Copy file `.env.example` menjadi `.env.development` dan `.env.production`:

```bash
cp .env.example .env.development
cp .env.example .env.production
```

Edit file `.env.development`:

```env
# Development API
API_BASE_URL=http://localhost:4000
```

Edit file `.env.production`:

```env
# Production API
API_BASE_URL=http://api-bibitku.filkom.ub.ac.id
```

#### 4. Jalankan Development Server

```bash
npm run start-dev
```

Aplikasi akan berjalan di `http://localhost:8080` (atau port yang tersedia)

---

## Penggunaan

### Menjalankan Mode Development

```bash
npm run start-dev
```

Fitur development mode:

- Hot Module Replacement (HMR)
- Source maps untuk debugging
- Auto reload saat file berubah

### Build untuk Production

```bash
npm run build
```

Output akan tersimpan di folder `dist/` dengan optimasi:

- Minifikasi JavaScript
- Optimasi CSS dengan PurgeCSS
- Compression dan tree-shaking
- Service Worker generation

### Menjalankan Production Build Locally

```bash
npm run serve:dist
```

Server akan berjalan di `http://localhost:5173`

---

## Pengembangan

### Workflow Development

1. **Branching Strategy**

   ```bash
   git checkout -b feature/nama-fitur
   ```

2. **Development**

   - Edit code di folder `src/`
   - Test di browser dengan dev server
   - Pastikan TypeScript compile tanpa error

3. **Testing Manual**

   - Test semua generasi (G0, G2, G3)
   - Test kedua musim (Hujan, Kemarau)
   - Test di berbagai device/browser
   - Test mode offline (PWA)

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: deskripsi fitur"
   ```

5. **Push & Pull Request**
   ```bash
   git push origin feature/nama-fitur
   ```

### Konvensi Code

#### TypeScript

```typescript
// Gunakan interface untuk type definitions
interface CalculatorInput {
  panjangLahan: number;
  lebarLahan: number;
  lebarGuludan: number;
  lebarParit: number;
}

// Class-based components dengan type annotations
class CalculatorPage {
  private gen: Generation;

  constructor(gen: Generation) {
    this.gen = gen;
  }

  render(): string {
    return `...`;
  }
}
```

#### TailwindCSS

```html
<!-- Gunakan utility classes, hindari custom CSS -->
<button class="w-full bg-yellow-600 text-white font-semibold py-3 rounded-xl">
  Submit
</button>
```

### Debugging

#### Chrome DevTools

1. Buka DevTools (F12)
2. Tab **Sources** untuk debugging TypeScript
3. Tab **Application** untuk inspect:
   - Service Worker status
   - localStorage/sessionStorage
   - Cache Storage

#### Common Issues

**Issue**: Service Worker tidak update

```bash
# Solution: Hard reload
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

**Issue**: TypeScript errors

```bash
# Check tsconfig.json dan type definitions
npx tsc --noEmit
```

---

## Integrasi API

### Base Configuration

File: `src/config/api.ts`

```typescript
export const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  CALCULATOR: {
    GENERATE: `${API_BASE_URL}/api/calculator/generate`,
    REVERSE: `${API_BASE_URL}/api/calculator/reverse`,
    BASE: `${API_BASE_URL}/api/calculator`,
  },
};
```

### API Endpoints

#### 1. Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2025-11-27T10:00:00Z"
}
```

#### 2. Calculate Seed Requirements

```http
POST /api/calculator/generate
Content-Type: application/json
```

**Request Body:**

```json
{
  "generasiBibit": "G0" | "G2" | "G3",
  "panjangLahan": 100,
  "lebarLahan": 50,
  "lebarGuludan": 80,
  "lebarParit": 40,
  "jarakTanam": 40,
  "estimasiHarga": 5000
}
```

**Response:**

```json
{
  "message": "Perhitungan berhasil",
  "data": {
    "ringkasan": {
      "luasLahan": "5000 m²",
      "jumlahGuludan": "41",
      "panjangPerGuludan": "100 m"
    },
    "kebutuhanBibit": {
      "totalBibit": "10250 biji",
      "bibitPerGuludan": "250 biji"
    },
    "estimasiBiaya": {
      "total": "Rp 51.250.000",
      "perBibit": "Rp 5.000"
    }
  }
}
```

#### 3. Reverse Calculate (Land Area from Seeds)

```http
POST /api/calculator/reverse
Content-Type: application/json
```

**Request Body:**

```json
{
  "generasiBibit": "G2",
  "jumlahBibit": 1000,
  "jumlahPerKg": 15,
  "jarakTanam": 40,
  "lebarGuludan": 80,
  "lebarParit": 40
}
```

**Response:**

```json
{
  "message": "Perhitungan reverse berhasil",
  "data": {
    "ringkasan": {
      "estimasiLuasM2": "480 m²",
      "jumlahGuludan": "4",
      "panjangPerGuludan": "100 m"
    },
    "estimasiPopulasi": {
      "totalTanaman": "1000 tanaman",
      "note": "Berdasarkan 15 umbi per kg"
    }
  }
}
```

### Error Handling

```typescript
try {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  // Process data
} catch (error) {
  console.error("API Error:", error);
  // Show error to user
}
```

---

## Kontak

### Contact Person

Untuk pertanyaan :

- **WhatsApp**: [+62 822-7749-2956](https://wa.me/6282277492956)

### Social Media & Links

- **Instagram Lab**: [Instagram](https://www.instagram.com/labsifilkomub/)

---

## Acknowledgments

Terima kasih kepada:

- **Laboratorium Sistem Informasi** - Inisiator dan pengelola proyek
- **Petani Bromo** - User testing dan feedback

---

## FAQ

**Q: Apakah aplikasi bisa digunakan offline?**
A: Ya, aplikasi ini adalah PWA yang mendukung offline mode. Setelah pertama kali diakses, Service Worker akan meng-cache asset sehingga aplikasi bisa dibuka tanpa koneksi internet. Namun, perhitungan yang memerlukan API tetap memerlukan koneksi.

**Q: Bagaimana cara mengubah default nilai guludan dan gerandul?**
A: Nilai default dapat diubah di file `src/scripts/pages/calculator/calculator.ts` pada method `getDefaultSizes()`.

**Q: Apakah data perhitungan tersimpan di server?**
A: Tidak, semua data perhitungan tersimpan lokal di browser pengguna (localStorage). Hanya request perhitungan yang dikirim ke server API.

**Q: Bagaimana cara menambah generasi bibit baru (misal G1 atau G4)?**
A: Anda perlu:

1. Buat file calculator baru di `src/scripts/pages/calculator/`
2. Update type `Generation` di `types.ts`
3. Tambahkan route di `router.ts`
4. Update home page untuk menambah button generasi baru
5. Update API backend untuk mendukung generasi baru

**Q: Mengapa menggunakan hash routing (#/home) bukan path routing (/home)?**
A: Hash routing dipilih untuk compatibility dengan berbagai hosting provider tanpa memerlukan konfigurasi server khusus untuk SPA routing.

---

## Dokumentasi Teknis Tambahan

### TypeScript Configuration

Project ini menggunakan TypeScript dengan konfigurasi strict mode untuk type safety maksimal:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Webpack Configuration

Build process menggunakan 3 konfigurasi:

- **webpack.common.cjs**: Shared configuration
- **webpack.dev.cjs**: Development dengan HMR
- **webpack.prod.cjs**: Production dengan optimization

### Service Worker Strategy

Menggunakan Workbox dengan strategi:

- **Precaching**: Asset statis (JS, CSS, HTML)
- **Runtime caching**: API responses dengan Network First strategy
- **Cache First**: Images dan font files

---
