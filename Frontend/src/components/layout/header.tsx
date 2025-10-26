// src/components/layout/header.tsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import recraftLogo from "@/assets/recraft-logo.png";

type HeaderProps = {
  /** If you want to hide the right-side buttons on some pages */
  showActions?: boolean;
  /** Extra classes for the header root */
  className?: string;
};

const Header: React.FC<HeaderProps> = ({ showActions = true, className = "" }) => {
  return (
    <header
      className={
        "border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 " +
        className
      }
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-1 ring-emerald-300 bg-emerald-100">
            <img src={recraftLogo} alt="ReCraft" className="h-8 w-8 object-contain" />
          </div>
          <span className="text-xl font-semibold text-emerald-900">ReCraft</span>
        </Link>

        {/* Nav */}
        <nav aria-label="Main" className="hidden items-center gap-6 text-[15px] sm:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded px-1 outline-none hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                isActive ? "font-semibold text-emerald-900" : "text-emerald-900"
              }`
            }
          >
            Home
          </NavLink>

          <span className="h-5 w-px bg-emerald-900/20" />

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `rounded px-1 outline-none hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                isActive ? "font-semibold text-emerald-900" : "text-emerald-900"
              }`
            }
          >
            About
          </NavLink>

          <span className="h-5 w-px bg-emerald-900/20" />

          {/* point this to your products route when ready */}
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `rounded px-1 outline-none hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                isActive ? "font-semibold text-emerald-900" : "text-emerald-900"
              }`
            }
          >
            Products
          </NavLink>
        </nav>

        {/* Actions (optional) */}
        {showActions ? (
          <div className="hidden items-center gap-3 sm:flex">
            <Button variant="ghost" className="text-emerald-900 hover:bg-emerald-100">
              Sign In
            </Button>
            <Button className="rounded-full bg-emerald-700 hover:bg-emerald-800">Login</Button>
          </div>
        ) : (
          <div className="sm:block" />
        )}

        {/* Mobile CTA (simple) */}
        <div className="sm:hidden">
          <Button size="sm" className="rounded-full bg-emerald-700 hover:bg-emerald-800">
            Start
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
