// src/pages/cart.tsx
import React from "react";
import Header from "../components/layout/header";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import {
  getCart, setCart, updateQty, removeFromCart,
  cartSubtotal, formatRupees, type CartItem
} from "../lib/shop";

const FREE_SHIPPING_THRESHOLD = 3000;
const FLAT_SHIP = 99;

const CartPage: React.FC = () => {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = React.useState<number>(0);
  const [coupon, setCoupon] = React.useState<string>("");
  const [discount, setDiscount] = React.useState<number>(0); // currency value
  const navigate = useNavigate();

  const recalc = React.useCallback(() => {
    setItems(getCart());
    setSubtotal(cartSubtotal());
  }, []);

  React.useEffect(() => {
    recalc();
    const onStorage = (e: StorageEvent) => { if (e.key === "rc_cart") recalc(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [recalc]);

  const handleQtyChange = (id: number, v: string) => {
    const q = parseInt(v || "1", 10);
    updateQty(id, isNaN(q) ? 1 : q);
    recalc();
  };

  const dec = (id: number) => {
    const it = getCart().find(c => c.product.id === id);
    if (!it) return;
    updateQty(id, Math.max(1, it.qty - 1));
    recalc();
  };

  const inc = (id: number) => {
    const it = getCart().find(c => c.product.id === id);
    if (!it) return;
    updateQty(id, Math.min(it.qty + 1, it.product.stock));
    recalc();
  };

  const remove = (id: number) => { removeFromCart(id); recalc(); };
  const clearAll = () => { setCart([]); setDiscount(0); setCoupon(""); recalc(); };

  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIP;
  const total = Math.max(0, subtotal - discount) + shipping;

  const applyCoupon = () => {
    // simple demo rules
    if (coupon.trim().toUpperCase() === "GREEN10") {
      setDiscount(Math.round(subtotal * 0.10));
    } else if (coupon.trim().toUpperCase() === "FREESHIP") {
      // emulate free shipping by setting discount equal to shipping if eligible
      setDiscount(0);
    } else {
      setDiscount(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-900">Your Cart</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/buy">Continue Shopping</Link>
            </Button>
            {items.length > 0 && (
              <Button variant="ghost" onClick={clearAll}>
                Clear Cart
              </Button>
            )}
          </div>
        </div>
        <Separator className="my-4" />

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.product.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full sm:w-40 h-48 object-cover"
                    />
                    <CardContent className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-emerald-900">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">{item.product.location}</p>
                          <p className="mt-1 font-semibold text-emerald-700">{item.product.price}</p>
                        </div>
                        <Button variant="outline" onClick={() => remove(item.product.id)}>Remove</Button>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" onClick={() => dec(item.product.id)}>−</Button>
                        <Input
                          className="w-16 text-center"
                          value={String(item.qty)}
                          inputMode="numeric"
                          onChange={(e) => handleQtyChange(item.product.id, e.target.value)}
                        />
                        <Button variant="outline" onClick={() => inc(item.product.id)}>+</Button>
                        <span className="ml-3 text-sm text-gray-600">In stock: {item.product.stock}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-emerald-900">Order Summary</h3>

                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder="Coupon (GREEN10 / FREESHIP)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyCoupon}>Apply</Button>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatRupees(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-emerald-700">− {formatRupees(discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : formatRupees(shipping)}</span>
                  </div>
                </div>

                <Separator className="my-3" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatRupees(total)}</span>
                </div>

                <Button
                  className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </Card>
              <p className="mt-2 text-xs text-gray-500">
                Free shipping on orders over {formatRupees(FREE_SHIPPING_THRESHOLD)}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

function EmptyState() {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-emerald-900">Your cart is empty</h3>
      <p className="text-gray-600 mt-1">Add sustainable products and they’ll show up here.</p>
      <Button className="mt-4 bg-emerald-700 hover:bg-emerald-800" asChild>
        <Link to="/buy">Browse Products</Link>
      </Button>
    </div>
  );
}
