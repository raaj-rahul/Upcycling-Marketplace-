import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import About from "@/pages/about";
import Sell from "@/pages/sell";
import SellNew from "@/pages/sell-new";
import BuyProducts from "@/pages/buyproducts"; // ✅ new import

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
        
        {/* optional: 404 page */}
        {/* <Route path="*" element={<div className="p-6">Page Not Found</div>} /> */}
      </Routes>
    </HashRouter>
  );
};

export default App;
