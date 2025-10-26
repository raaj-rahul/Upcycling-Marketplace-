import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import About from "@/pages/about";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* optional: 404 */}
        {/* <Route path="*" element={<div className="p-6">Not Found</div>} /> */}
      </Routes>
    </HashRouter>
  );
};

export default App;