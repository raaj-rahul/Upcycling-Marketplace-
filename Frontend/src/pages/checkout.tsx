// src/pages/checkout.tsx
import React from "react";
import Header from "../components/layout/header";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Separator } from "../components/ui/separator";
import { useNavigate, Link } from "react-router-dom";
import { getCart, setCart, cartSubtotal, formatRupees } from "../lib/shop";

const FREE_SHIPPING_THRESHOLD = 3000;
const FLAT_SHIP = 99;

const CheckoutPage: React.FC = () => {
//   const navigate = useNavigate();
  const [cart] = React.useState(getCart());
  const [subtotal] = React.useState(cartSubtotal());
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIP;
  const total = subtotal + shipping;

  const [placing, setPlacing] = React.useState(false);
  const [placed, setPlaced] = React.useState(false);

  // Minimal form state (no extra libs)
  const [form, setForm] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
    paymentMethod: "cod", // "cod" | "upi" | "card"
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const valid =
    form.fullName.trim() &&
    form.phone.trim() &&
    form.address1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.pincode.trim();

  const placeOrder = async () => {
    if (!valid) return;
    setPlacing(true);
    // Simulate processing…
    await new Promise((r) => setTimeout(r, 900));
    setCart([]);
    setPlacing(false);
    setPlaced(true);
  };

  if (cart.length === 0 && !placed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showActions />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-emerald-900">Your cart is empty</h1>
            <p className="text-gray-600 mt-1">Add items before checking out.</p>
            <Button className="mt-4 bg-emerald-700 hover:bg-emerald-800" asChild>
              <Link to="/buy">Browse Products</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-emerald-900">Checkout</h1>
        <Separator className="my-4" />

        {placed ? (
          <Success total={total} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-emerald-900">Shipping Address</h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                    <Input name="fullName" value={form.fullName} onChange={onChange} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                    <Input name="phone" value={form.phone} onChange={onChange} placeholder="98765 43210" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Email (optional)</label>
                    <Input name="email" value={form.email} onChange={onChange} type="email" placeholder="you@example.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Address Line 1</label>
                    <Input name="address1" value={form.address1} onChange={onChange} placeholder="House/Flat, Street" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Address Line 2 (optional)</label>
                    <Input name="address2" value={form.address2} onChange={onChange} placeholder="Landmark, Area" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">City</label>
                    <Input name="city" value={form.city} onChange={onChange} placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">State</label>
                    <Input name="state" value={form.state} onChange={onChange} placeholder="State" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">PIN Code</label>
                    <Input name="pincode" value={form.pincode} onChange={onChange} placeholder="560001" />
                  </div>
                </div>
              </Card>

              {/* Delivery Notes */}
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-emerald-900">Delivery Notes</h2>
                <Textarea
                  className="mt-3"
                  rows={3}
                  name="notes"
                  value={form.notes}
                  onChange={onChange}
                  placeholder="Any special instructions (e.g., call on arrival)"
                />
              </Card>

              {/* Payment */}
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-emerald-900">Payment Method</h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, paymentMethod: "cod" }))}
                    className={`rounded-lg border p-3 text-sm ${
                      form.paymentMethod === "cod" ? "border-emerald-600 ring-2 ring-emerald-200" : "border-gray-200"
                    }`}
                  >
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, paymentMethod: "upi" }))}
                    className={`rounded-lg border p-3 text-sm ${
                      form.paymentMethod === "upi" ? "border-emerald-600 ring-2 ring-emerald-200" : "border-gray-200"
                    }`}
                  >
                    UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, paymentMethod: "card" }))}
                    className={`rounded-lg border p-3 text-sm ${
                      form.paymentMethod === "card" ? "border-emerald-600 ring-2 ring-emerald-200" : "border-gray-200"
                    }`}
                  >
                    Card
                  </button>
                </div>

                {form.paymentMethod === "upi" && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">UPI ID</label>
                      <Input placeholder="name@bank" />
                    </div>
                  </div>
                )}

                {form.paymentMethod === "card" && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                      <Input placeholder="4111 1111 1111 1111" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Expiry</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">CVV</label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <Card className="p-5">
                <h3 className="text-lg font-semibold text-emerald-900">Order Summary</h3>
                <div className="mt-3 space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded object-cover" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-emerald-900">{item.product.name}</div>
                        <div className="text-xs text-gray-500">Qty {item.qty}</div>
                      </div>
                      <div className="text-sm font-semibold">{item.product.price}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatRupees(subtotal)}</span>
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
                  className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60"
                  disabled={!valid || placing}
                  onClick={placeOrder}
                >
                  {placing ? "Placing order…" : "Place Order"}
                </Button>
                <p className="mt-2 text-xs text-gray-500">
                  By placing the order, you agree to our eco-friendly packaging and return policy.
                </p>
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

export default CheckoutPage;

function Success({ total }: { total: number }) {
  const navigate = useNavigate();
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
        <span className="text-2xl">✅</span>
      </div>
      <h2 className="mt-3 text-xl font-bold text-emerald-900">Order Confirmed!</h2>
      <p className="text-gray-600 mt-1">
        Thank you for choosing sustainable products. Your total was <span className="font-semibold">{formatRupees(total)}</span>.
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate("/buy")}>
          Continue Shopping
        </Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    </Card>
  );
}
