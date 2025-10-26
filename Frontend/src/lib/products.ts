// src/lib/products.ts
import type { Product } from "../lib/shop";

export const USER_PRODUCTS_KEY = "rc_user_products";

/** Get all products users created via the Sell form. */
export function getUserProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem(USER_PRODUCTS_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Save one new product and notify listeners. */
export function addUserProduct(p: Product) {
  const list = getUserProducts();
  list.push(p);
  localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(list));
  // notify other tabs/pages
  window.dispatchEvent(new StorageEvent("storage", { key: USER_PRODUCTS_KEY }));
}
