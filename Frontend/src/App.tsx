import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import About from "@/pages/about";
import Sell from "./pages/sell";
import SellNew from "./pages/sell-new";
import WasteDonationPage from "./pages/waste-donation";
import WasteSubmitPage from "./pages/waste-submit";

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
        <Route path="/waste-donation" element={<WasteDonationPage />} />
        <Route path="/waste-donation/submit" element={<WasteSubmitPage />} />

        {/* optional: 404 */}
        {/* <Route path="*" element={<div className="p-6">Not Found</div>} /> */}
      </Routes>
    </HashRouter>
  );
};

export default App;