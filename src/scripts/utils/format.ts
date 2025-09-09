export const fmtNumber = (n: number) =>
  new Intl.NumberFormat("id-ID").format(n);

export const fmtMeter = (n: number) => `${fmtNumber(n)} meter`;

export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
