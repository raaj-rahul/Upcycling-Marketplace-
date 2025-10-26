// src/App.tsx
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import About from "@/pages/about"; // <-- the page we created

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* optional: 404 */}
        {/* <Route path="*" element={<div className="p-6">Not Found</div>} /> */}
      </Routes>
    </HashRouter>
  );
};

export default App;
