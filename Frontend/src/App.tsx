import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import About from "@/pages/about";
import Sell from "@/pages/sell";
import SellNew from "@/pages/sell-new";
import BuyProducts from "@/pages/buyproducts"; 
import WasteDonationPage from "./pages/waste-donation";
import WasteSubmitPage from "./pages/waste-submit"
import WishlistPage from "./pages/wishlist"
import CartPage from "./pages/cart"
import CheckoutPage from "./pages/checkout"
import AccountPage from "./pages/account";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/sell/new" element={<SellNew />} />
        <Route path="/buy" element={<BuyProducts />} /> {/* ✅ new route */}
        <Route path="/waste-donation" element={<WasteDonationPage />} /> 
        <Route path="/waste-donation/submit" element={<WasteSubmitPage />} />
        <Route path="/wishlist" element={<WishlistPage />} /> 
        <Route path="/cart" element={<CartPage />} /> 
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />  
        {/* optional: 404 page */}
        {/* <Route path="*" element={<div className="p-6">Page Not Found</div>} /> */}
      </Routes>
    </HashRouter>
  );
};

export default App;
