// src/lib/shop.ts
export type Product = {
  id: number;
  name: string;
  image: string;
  price: string; // "₹2,500"
  quality: string;
  location: string;
  description: string;
  rating: number;
  stock: number;

  // Link to My Listings row so we can sync delete/edit
  listingId?: string;
};

export type CartItem = { product: Product; qty: number };

const CART_KEY = "rc_cart";
const WL_KEY = "rc_wishlist";

function rupeeToNumber(p: string): number {
  const digits = p.replace(/[^\d.]/g, "").replace(/,/g, "");
  const n = parseFloat(digits);
  return isNaN(n) ? 0 : n;
}

export function formatRupees(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/* ----------------- Cart ----------------- */
export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // notify listeners that cart changed
  window.dispatchEvent(new StorageEvent("storage", { key: CART_KEY }));
}

export function addToCart(product: Product, qty = 1) {
  const cart = getCart();
  const i = cart.findIndex((c) => c.product.id === product.id);
  if (i >= 0) {
    cart[i].qty = Math.min(cart[i].qty + qty, product.stock);
  } else {
    cart.push({ product, qty: Math.min(qty, product.stock) });
  }
  setCart(cart);
}

export function updateQty(productId: number, qty: number) {
  const cart = getCart();
  const i = cart.findIndex((c) => c.product.id === productId);
  if (i >= 0) {
    cart[i].qty = Math.max(1, Math.min(qty, cart[i].product.stock));
    setCart(cart);
  }
}

export function removeFromCart(productId: number) {
  setCart(getCart().filter((c) => c.product.id !== productId));
}

export function cartSubtotal(): number {
  return getCart().reduce(
    (sum, item) => sum + rupeeToNumber(item.product.price) * item.qty,
    0
  );
}

/* --------------- Wishlist --------------- */
export function getWishlist(): Product[] {
  try {
    return JSON.parse(localStorage.getItem(WL_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setWishlist(list: Product[]) {
  localStorage.setItem(WL_KEY, JSON.stringify(list));
  // notify listeners that wishlist changed
  window.dispatchEvent(new StorageEvent("storage", { key: WL_KEY }));
}

export function isWishlisted(id: number) {
  return getWishlist().some((p) => p.id === id);
}

export function addToWishlist(product: Product) {
  if (isWishlisted(product.id)) return;
  const list = getWishlist();
  list.push(product);
  setWishlist(list);
}

export function removeFromWishlist(productId: number) {
  setWishlist(getWishlist().filter((p) => p.id !== productId));
}
