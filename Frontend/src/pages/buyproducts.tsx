import React, { useState } from "react";
import Header from "@/components/layout/header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Product = {
  id: number;
  name: string;
  image: string;
  price: string;
  quality: string;
  location: string;
  description: string;
  rating: number;
  stock: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Seed Paper Cover Notebook",
    image: "/src/assets/seed.jpg",
    price: "₹2,500",
    quality: "Good",
    location: "Bangalore",
    rating: 4.5,
    stock: 6,
    description:
      "Handcrafted eco-friendly notebook with a seed paper cover that can be planted after use. Made using 100% recycled paper — perfect for sustainable journaling."
  },
  {
    id: 2,
    name: "Boho Coco Shells",
    image: "/src/assets/shell.jpg",
    price: "₹1,200",
    quality: "Excellent",
    location: "Mumbai",
    rating: 4.8,
    stock: 6,
    description:
      "A set of elegant handcrafted bowls made from upcycled coconut shells. Polished and decorated in boho style, ideal for home décor or eco-serving."
  },
  {
    id: 3,
    name: "Layer Pallet Bed",
    image: "/src/assets/table.jpg",
    price: "₹3,000",
    quality: "Good",
    location: "Delhi",
    rating: 4.7,
    stock: 6,
    description:
      "A stylish, sturdy bed frame built entirely from reclaimed wooden pallets. Each layer is sanded and coated for a smooth, rustic look that complements any modern interior."
  },
  {
    id: 4,
    name: "Paper Storage Basket",
    image: "/src/assets/paper.jpg",
    price: "₹1,800",
    quality: "Very Good",
    location: "Hyderabad",
    rating: 4.6,
    stock: 6,
    description:
      "Eco-conscious basket woven from recycled paper ropes. Lightweight yet durable — ideal for storing stationery, craft supplies, or small household items."
  },
  {
    id: 5,
    name: "Fabric Wall Hangings",
    image: "/src/assets/hang.jpg",
    price: "₹2,000",
    quality: "Excellent",
    location: "Chennai",
    rating: 4.9,
    stock: 6,
    description:
      "Beautiful handmade wall décor crafted using upcycled textile scraps. Each hanging piece adds color and sustainability to your living space."
  },
  {
    id: 6,
    name: "Coconut Shell Pen Stand",
    image: "/src/assets/coconut.jpg",
    price: "₹2,200",
    quality: "Good",
    location: "Pune",
    rating: 4.4,
    stock: 6,
    description:
      "Unique pen stand made from natural coconut shells. A sustainable desk accessory combining eco-friendliness with traditional craftsmanship."
  }
];

const BuyProducts: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selected = selectedIndex !== null ? products[selectedIndex] : null;

  const nextProduct = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % products.length);
    }
  };

  const prevProduct = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        (selectedIndex - 1 + products.length) % products.length
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header showActions={true} />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10 py-6">
        {products.map((product, index) => (
          <Card
            key={product.id}
            className="cursor-pointer bg-white shadow-md hover:shadow-lg transition rounded-xl overflow-hidden"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.location}</p>
              <p className="text-emerald-700 font-semibold mt-1">{product.price}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-5xl flex relative">
            {/* Left Arrow */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700 hover:text-emerald-700 z-10"
              onClick={prevProduct}
            >
              <FaChevronLeft size={24} />
            </button>

            {/* Right Arrow */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 hover:text-emerald-700 z-10"
              onClick={nextProduct}
            >
              <FaChevronRight size={24} />
            </button>

            {/* Left: Image */}
            <div className="w-1/2 bg-gray-100 flex justify-center items-center p-6">
              <img
                src={selected.image}
                alt={selected.name}
                className="rounded-xl w-full h-[400px] object-cover shadow"
              />
            </div>

            {/* Right: Info */}
            <div className="w-1/2 p-6 flex flex-col justify-center relative">
              {/* Wishlist Heart */}
              <div className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-emerald-700">
                <FaHeart size={24} />
              </div>

              <h2 className="text-2xl font-bold text-emerald-800 mb-2">{selected.name}</h2>

              {/* Rating */}
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.floor(selected.rating)
                        ? "text-yellow-500"
                        : i < selected.rating
                        ? "text-yellow-300"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-gray-600 ml-2">{selected.rating.toFixed(1)}</span>
              </div>

              <p className="text-gray-600 mb-2">{selected.description}</p>
              <p className="text-gray-700 mb-1"><strong>Location:</strong> {selected.location}</p>
              <p className="text-gray-700 mb-1"><strong>Quality:</strong> {selected.quality}</p>
              <p className="text-gray-700 mb-1"><strong>Stock:</strong> {selected.stock} left</p>
              <p className="text-xl font-semibold text-emerald-700 mt-3">{selected.price}</p>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg transition">
                  Add to Cart
                </button>
                <button className="flex-1 border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white py-2 rounded-lg transition">
                  Buy Now
                </button>
              </div>

              {/* Close Button */}
              <button
                className="mt-5 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition"
                onClick={() => setSelectedIndex(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyProducts;
