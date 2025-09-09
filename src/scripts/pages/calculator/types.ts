export type Gen = "G0" | "G2" | "G3";
export type Season = "Hujan" | "Kemarau";

export interface CalcRequest {
  gen: Gen;
  season: Season;
  panjang: number;      // meter
  lebar: number;        // meter
  guludan: number;      // cm
  gerandul: number;     // cm
  jarakTanam: number;   // cm
  hargaBibit: number;   // rupiah (G2/G3 per kg, G0 per biji)
}

export interface CalcResponse {
  ringkasan: {
    lebarUnitM: number;            // ex: 1.2
    jumlahGuludan: number;         // ex: 41
    panjangPerGuludanM: number;    // ex: 80
  };
  kebutuhanTanam: {
    tanamanPerGuludan: number;     // ex: 200
    totalPopulasi: number;         // ex: 8200
  };
  kebutuhanBibit: {
    label: string;                 // ex: "Kebutuhan Bibit (G2)"
    estimasiKg?: number;           // ex: 547 (untuk G2/G3)
    estimasiBiji?: number;         // ex: … (untuk G0)
  };
  estimasiBiaya: {
    totalModal: number;            // ex: 15042500
  };
}
