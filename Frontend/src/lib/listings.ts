// src/lib/listings.ts
export type Listing = {
  id: string;
  title: string;
  price: number;      // integer rupees
  stock: number;      // integer
  active: boolean;
  category?: string;
  createdAt: string;  // ISO string
};

export const LISTINGS_LS_KEY = "rc_listings";

export function loadListings(): Listing[] {
  try {
    const raw = localStorage.getItem(LISTINGS_LS_KEY);
    return raw ? (JSON.parse(raw) as Listing[]) : [];
  } catch {
    return [];
  }
}

export function saveListings(listings: Listing[]) {
  localStorage.setItem(LISTINGS_LS_KEY, JSON.stringify(listings));
  // 🔔 Notify same-window listeners (SPA) just like other libs do
  window.dispatchEvent(new StorageEvent("storage", { key: LISTINGS_LS_KEY }));
}

export function getListing(id: string): Listing | undefined {
  return loadListings().find((l) => l.id === id);
}

export function upsertListing(l: Listing) {
  const list = loadListings();
  const i = list.findIndex((x) => x.id === l.id);
  if (i >= 0) list[i] = l;
  else list.unshift(l);
  saveListings(list);
}

export function deleteListing(id: string) {
  const next = loadListings().filter((l) => l.id !== id);
  saveListings(next);
}

export function toggleListing(id: string, active: boolean) {
  const next = loadListings().map((l) => (l.id === id ? { ...l, active } : l));
  saveListings(next);
}
