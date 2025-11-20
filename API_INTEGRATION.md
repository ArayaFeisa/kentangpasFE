# API Integration Guide

Dokumentasi integrasi backend API untuk frontend BibitKu.

## Backend API Information

### Production URL
```
http://api-bibitku.filkom.ub.ac.id
```

### Development URL (Local)
```
http://localhost:4000
```

## Environment Setup

Project ini menggunakan environment variables untuk konfigurasi API endpoint. File environment sudah disediakan:

- `.env.development` - untuk development
- `.env.production` - untuk production
- `.env.example` - template untuk environment variables

### Environment Variables

```bash
# API Base URL
API_BASE_URL=http://localhost:4000  # development
API_BASE_URL=http://api-bibitku.filkom.ub.ac.id  # production
```

Environment variables akan otomatis di-load sesuai dengan mode build:
- `npm run start-dev` akan menggunakan `.env.development`
- `npm run build` akan menggunakan `.env.production`

## API Configuration

File konfigurasi API terletak di [src/config/api.ts](src/config/api.ts).

### Available Endpoints

```typescript
import { API_BASE_URL, API_ENDPOINTS } from './config/api';

// Health check
API_ENDPOINTS.HEALTH
// => http://api-bibitku.filkom.ub.ac.id/health

// Calculator endpoints
API_ENDPOINTS.CALCULATOR.GENERATE
// => http://api-bibitku.filkom.ub.ac.id/api/calculator/generate

API_ENDPOINTS.CALCULATOR.REVERSE
// => http://api-bibitku.filkom.ub.ac.id/api/calculator/reverse

// Articles endpoints
API_ENDPOINTS.ARTICLES.LIST
// => http://api-bibitku.filkom.ub.ac.id/api/articles

API_ENDPOINTS.ARTICLES.DETAIL('123')
// => http://api-bibitku.filkom.ub.ac.id/api/articles/123
```

## API Helper Functions

Project ini menyediakan helper functions untuk melakukan API requests dengan error handling yang proper. File helper terletak di [src/utils/api-helper.ts](src/utils/api-helper.ts).

### Usage Examples

#### GET Request

```typescript
import { apiGet } from './utils/api-helper';
import { API_ENDPOINTS } from './config/api';

// Get articles list
const response = await apiGet(API_ENDPOINTS.ARTICLES.LIST);

if (response.success) {
  console.log('Data:', response.data);
} else {
  console.error('Error:', response.error);
}
```

#### POST Request

```typescript
import { apiPost } from './utils/api-helper';
import { API_ENDPOINTS } from './config/api';

// Calculate reverse
const payload = {
  generasiBibit: 'G2',
  jumlahBibit: 1000,
  jarakTanam: 30,
  lebarGuludan: 80,
  lebarParit: 40,
};

const response = await apiPost(
  API_ENDPOINTS.CALCULATOR.REVERSE,
  payload
);

if (response.success) {
  console.log('Result:', response.data);
} else {
  console.error('Error:', response.error);
}
```

#### Custom Request

```typescript
import { apiRequest } from './utils/api-helper';
import { API_ENDPOINTS } from './config/api';

const response = await apiRequest(API_ENDPOINTS.HEALTH, {
  method: 'GET',
  headers: {
    'Custom-Header': 'value',
  },
});
```

### Response Format

Semua API helper functions mengembalikan `ApiResponse<T>`:

```typescript
interface ApiResponse<T> {
  success: boolean;    // Apakah request berhasil
  data?: T;           // Data response jika berhasil
  error?: string;     // Error message jika gagal
  message?: string;   // Optional message dari server
}
```

## CORS Configuration

Backend sudah dikonfigurasi untuk menerima request dari:
- `http://bibitku.filkom.ub.ac.id` (production)
- `https://bibitku.filkom.ub.ac.id` (production dengan HTTPS)
- `http://localhost:3000` (development - webpack-dev-server)
- `http://localhost:5173` (development - vite)

Jika frontend berjalan di port lain, koordinasikan dengan backend untuk menambahkan ke CORS whitelist.

## Testing API Integration

### 1. Test Health Endpoint

Untuk memastikan koneksi ke backend berhasil:

```typescript
import { apiGet } from './utils/api-helper';
import { API_ENDPOINTS } from './config/api';

const testHealth = async () => {
  const response = await apiGet(API_ENDPOINTS.HEALTH);
  console.log('Health check:', response);
};

testHealth();
```

### 2. Development Testing

```bash
# Start development server
npm run start-dev

# Server akan berjalan di http://localhost:3000
# Dan akan menggunakan API_BASE_URL dari .env.development
```

### 3. Production Build Testing

```bash
# Build production
npm run build

# Serve production build
npm run serve:dist

# Server akan berjalan di http://localhost:5173
# Dan akan menggunakan API_BASE_URL dari .env.production
```

## Example Implementation

Contoh implementasi bisa dilihat di [src/scripts/pages/calculator/calculator-reverse-presenter.ts](src/scripts/pages/calculator/calculator-reverse-presenter.ts):

```typescript
import { API_ENDPOINTS } from "../../../config/api";
import { apiPost } from "../../../utils/api-helper";

// ... di dalam method
const response = await apiPost<ResponseType>(
  API_ENDPOINTS.CALCULATOR.REVERSE,
  payload
);

if (!response.success || !response.data) {
  throw new Error(response.error || "Gagal menghitung estimasi.");
}

// Use response.data
console.log(response.data);
```

## Troubleshooting

### Issue: CORS Error

Jika mendapat CORS error:
1. Pastikan backend sudah running
2. Cek apakah origin frontend sudah ditambahkan ke CORS whitelist backend
3. Koordinasikan dengan backend untuk menambahkan origin yang diperlukan

### Issue: API_BASE_URL undefined

Jika `process.env.API_BASE_URL` undefined:
1. Pastikan file `.env.development` atau `.env.production` sudah dibuat
2. Restart development server setelah membuat/mengubah file .env
3. Check webpack config sudah menggunakan `dotenv-webpack` plugin

### Issue: Network Error / Connection Refused

Jika mendapat network error:
1. Pastikan backend sudah running (development: `localhost:4000`)
2. Test manual dengan curl atau browser: `http://localhost:4000/health`
3. Untuk production, pastikan DNS sudah ready: `http://api-bibitku.filkom.ub.ac.id/health`

## Next Steps

1. Test health endpoint setelah DNS ready
2. Integrate calculator API calls ke semua calculator pages (G0, G2, G3)
3. Integrate articles API jika diperlukan
4. Add loading states dan error handling di UI
5. Test semua endpoints dengan data yang beragam

## Contact Backend Team

Jika ada issue atau perlu koordinasi:
- Endpoint tidak berfungsi sesuai ekspektasi
- CORS error
- Response format tidak sesuai
- Perlu menambahkan endpoint baru

Langsung koordinasi dengan Tim Backend BibitKu.
