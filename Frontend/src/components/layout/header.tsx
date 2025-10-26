import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import recraftLogo from "@/assets/recraft-logo.png";
import { User, Heart, ShoppingCart } from "lucide-react";

type HeaderProps = {
  showActions?: boolean;
  className?: string;
};

const Header: React.FC<HeaderProps> = ({ showActions = true, className = "" }) => {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = React.useState(
    typeof window !== "undefined" && localStorage.getItem("rc_auth") === "1"
  );

  React.useEffect(() => {
    const sync = () => setIsAuthed(localStorage.getItem("rc_auth") === "1");
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("rc_auth");
    setIsAuthed(false);
    navigate("/");
  };

  return (
    <header className={`border-b bg-white/80 backdrop-blur ${className}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* ✅ Brand */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90">
          <img
            src={recraftLogo}
            alt="ReCraft"
            className="h-10 w-10 rounded-full ring-2 ring-emerald-300"
          />
          <span className="text-xl font-semibold text-emerald-900">ReCraft</span>
        </Link>

        {/* ✅ Navbar */}
        <nav className="hidden items-center gap-4 text-[15px] sm:flex">
          <NavItem to="/" label="Home" />
          <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
          <NavItem to="/about" label="About" />
          <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
          <NavItem to="/buy" label="Buy Products" /> {/* ✅ Working route */}
          <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
          <NavItem to="/sell" label="Sell Products" />
        </nav>

        {/* ✅ Right side */}
        <div className="hidden items-center gap-4 sm:flex">
          {!isAuthed && showActions ? (
            <>
              <Button
                variant="outline"
                className="text-emerald-900 hover:bg-emerald-100"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
              <Button
                className="rounded-full bg-emerald-700 hover:bg-emerald-800"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-5 text-emerald-900">
              <HeaderIcon onClick={() => navigate("/account")}><User /></HeaderIcon>
              <HeaderIcon onClick={() => navigate("/wishlist")}><Heart /></HeaderIcon>
              <HeaderIcon onClick={() => navigate("/cart")}><ShoppingCart /></HeaderIcon>
              <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

/* ✅ Sub components */
const NavItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `hover:text-emerald-700 ${
        isActive
          ? "font-semibold text-emerald-900 border-b-2 border-emerald-700 pb-1"
          : "text-emerald-900"
      }`
    }
  >
    {label}
  </NavLink>
);

const HeaderIcon = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="p-1 text-emerald-900 hover:text-emerald-700 transition-colors"
  >
    {children}
  </button>
);
