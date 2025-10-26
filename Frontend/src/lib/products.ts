// src/lib/products.ts
import type { Product } from "./shop";

export const USER_PRODUCTS_KEY = "rc_user_products";

export function getUserProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem(USER_PRODUCTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setUserProducts(list: Product[]) {
  localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(list));
  // notify listeners (Buy page listens to this)
  window.dispatchEvent(new StorageEvent("storage", { key: USER_PRODUCTS_KEY }));
}

export function addUserProduct(p: Product) {
  const list = getUserProducts();
  list.push(p);
  setUserProducts(list);
}

export function removeUserProductById(id: number) {
  setUserProducts(getUserProducts().filter((p) => p.id !== id));
}

/** Remove all Buy-page products tied to a given My Listings ID */
export function removeUserProductsByListingId(listingId: string) {
  setUserProducts(getUserProducts().filter((p) => p.listingId !== listingId));
}

/** Update the first Buy-page product that belongs to a given listing */
export function updateUserProductByListingId(
  listingId: string,
  patch: Partial<Pick<Product, "name" | "price" | "stock" | "image">>
) {
  const list = getUserProducts();
  const idx = list.findIndex((p) => p.listingId === listingId);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...patch };
    setUserProducts(list);
  }
}
