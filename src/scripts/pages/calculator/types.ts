export type Gen = "G0" | "G2" | "G3";
export type Season = "Hujan" | "Kemarau";

export interface CalcRequest {
  gen: Gen;
  season: Season;
  panjang: number;
  lebar: number;
  guludan: number;
  gerandul: number;
  jarakTanam: number;
  hargaBibit: number;
}

export interface CalcResponse {
  ringkasan: {
    lebarUnitM: number;
    jumlahGuludan: number;
    panjangPerGuludanM: number;
  };
  kebutuhanTanam: {
    tanamanPerGuludan: number;
    totalPopulasi: number;
  };
  kebutuhanBibit: {
    label: string;
    estimasiKg?: number;
    estimasiBiji?: number; 
  };
  estimasiBiaya: {
    totalModal: number;          
  };
}
