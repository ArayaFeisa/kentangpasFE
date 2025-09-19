export type Gen = "G0" | "G2" | "G3";
export type Season = "Hujan" | "Kemarau";
export type HistoryItem = {
  id: string;
  gen: Gen;
  season: Season;
  amount: number;
  dateISO: string;
  resultPayload: unknown;
};
const HISTORY_KEY = "calc_history_v1";

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function addHistory(item: HistoryItem) {
  const list = getHistory();
  list.unshift(item);

  const seen = new Set<string>();
  const dedup = list
    .filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)))
    .slice(0, 100);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(dedup));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function removeHistory(id: string) {
  const list = getHistory().filter((x) => x.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

export const toIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(n)
    .replace(/,00$/g, "");

export const toIndoDate = (iso: string) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default class HistoryPage {
  render(): string {
  const items = getHistory();

  return `
  <div class="relative mx-auto max-w-md min-h-screen bg-[#F6F8FC]">
    <header class="sticky top-0 z-30 bg-white/90 border-b border-gray-200 backdrop-blur">
      <div class="flex items-center gap-3 px-4 py-3">
        <div class="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50">
          <svg class="h-4 w-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-semibold text-gray-900">History</h1>
          <p class="text-[11px] text-gray-500">Hasil Perhitungan</p>
        </div>
      </div>
    </header>
    <main class="px-4 py-4 pb-28">
      <div class="space-y-3" id="history-list">
        ${
          items.length
            ? items.map((it) => `
              <div data-card="${it.id}"
                   role="button" tabindex="0"
                   class="relative w-full rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm hover:shadow-md cursor-pointer">
                <div class="text-sm text-gray-700">${it.gen}</div>
                <div class="mt-1 text-[13px] text-gray-600">
                  Estimasi Biaya <span class="font-semibold text-emerald-700">${toIDR(it.amount)}</span>
                </div>
                <div class="absolute bottom-3 right-4 text-[10px] text-emerald-700/70">${toIndoDate(it.dateISO)}</div>
               <div class="absolute right-3 top-3">
  <button type="button" data-del="${it.id}"
          class="grid h-8 w-8 place-items-center rounded-full bg-white/70 backdrop-blur hover:bg-white"
          aria-label="Hapus dari history">
    <svg class="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M8 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0v14m4-14v14m4-14v14"/>
    </svg>
  </button>
</div>
              </div>
            `).join("")
            : `<div class="text-center text-sm text-gray-500 py-10">Belum ada riwayat perhitungan.</div>`
        }
      </div>
    </main>
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200" aria-label="Navigasi bawah">
      <div class="flex justify-center gap-16 py-3">
        <a href="#/" data-nav class="flex flex-col items-center text-gray-600">
          <img src="./icons/beranda2.svg" alt="Beranda" class="w-6 h-6" />
          <span class="text-xs mt-1">Beranda</span>
        </a>
        <a href="#/history" data-nav aria-current="page" class="flex flex-col items-center text-emerald-700">
          <img src="./icons/history2.svg" alt="History" class="w-6 h-6" />
          <span class="text-xs mt-1">History</span>
        </a>
      </div>
    </nav>
  </div>`;
}
mount(root: HTMLElement) {
    const listEl = root.querySelector<HTMLElement>("#history-list");
    if (!listEl) return;
    listEl.addEventListener("click", (ev) => {
      const target = ev.target as HTMLElement;
      const delBtn = target.closest<HTMLElement>("[data-del]");
      if (delBtn) {
        ev.stopPropagation();
        const id = delBtn.getAttribute("data-del")!;
        if (!confirm("Hapus riwayat ini?")) return;
        removeHistory(id);
        delBtn.closest<HTMLElement>("[data-card]")?.remove();
        if (!listEl.querySelector("[data-card]")) {
          listEl.innerHTML = `<div class="text-center text-sm text-gray-500 py-10">Belum ada riwayat perhitungan.</div>`;
        }
        return;
      }
      const card = target.closest<HTMLElement>("[data-card]");
      if (card) {
        const id = card.getAttribute("data-card")!;
        const item = getHistory().find((x) => x.id === id);
        if (!item) return;
        sessionStorage.setItem("last_result", JSON.stringify({ gen: item.gen, season: item.season, result: item.resultPayload }));
        sessionStorage.setItem("result_from", "history");
        sessionStorage.setItem("result_prev_hash", location.hash || "#/history");
        location.hash = `/result/${item.gen}/${item.season}`;
      }
    });
    listEl.addEventListener("keydown", (ev) => {
      const e = ev as KeyboardEvent;
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = (ev.target as HTMLElement).closest<HTMLElement>("[data-card]");
      if (!card) return;
      const id = card.getAttribute("data-card")!;
      const item = getHistory().find((x) => x.id === id);
      if (!item) return;
      sessionStorage.setItem("last_result", JSON.stringify({ gen: item.gen, season: item.season, result: item.resultPayload }));
      sessionStorage.setItem("result_from", "history");
      location.hash = `/result/${item.gen}/${item.season}`;
    });
  }
}
