// src/pages/wishlist.tsx
import React from "react";
import Header from "../components/layout/header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist, addToCart } from "../lib/shop"
import type { Product } from "../lib/shop";;

const WishlistPage: React.FC = () => {
  const [items, setItems] = React.useState<Product[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const load = () => setItems(getWishlist());
    load();
    const onStorage = (e: StorageEvent) => { if (e.key === "rc_wishlist") load(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleRemove = (id: number) => {
    removeFromWishlist(id);
    setItems(getWishlist());
  };

  const moveToCart = (p: Product) => {
    addToCart(p, 1);
    removeFromWishlist(p.id);
    setItems(getWishlist());
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-900">Your Wishlist</h1>
          <Button variant="outline" asChild>
            <Link to="/buy">Continue Shopping</Link>
          </Button>
        </div>
        <Separator className="my-4" />

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <Card key={p.id} className="overflow-hidden hover:shadow-md transition">
                <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle className="text-emerald-900">{p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{p.location}</p>
                  <p className="mt-1 font-semibold text-emerald-700">{p.price}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1 bg-emerald-700 hover:bg-emerald-800" onClick={() => moveToCart(p)}>
                    Move to Cart
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => handleRemove(p.id)}>
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

function EmptyState() {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-emerald-900">No items in wishlist</h3>
      <p className="text-gray-600 mt-1">
        Save products you love and move them to your cart anytime.
      </p>
      <Button className="mt-4 bg-emerald-700 hover:bg-emerald-800" asChild>
        <Link to="/buy">Browse Products</Link>
      </Button>
    </div>
  );
}
