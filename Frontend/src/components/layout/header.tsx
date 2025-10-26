import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import recraftLogo from "@/assets/recraft-logo.png";
import { User, Heart, ShoppingCart, Menu } from "lucide-react";

type HeaderProps = {
  showActions?: boolean;
  className?: string;
};

const Header: React.FC<HeaderProps> = ({ showActions = true, className = "" }) => {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = React.useState(
    typeof window !== "undefined" && localStorage.getItem("rc_auth") === "1"
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const sync = () => setIsAuthed(localStorage.getItem("rc_auth") === "1");
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("rc_auth");
    setIsAuthed(false);
    setOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 ${className}`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
        >
          <img
            src={recraftLogo}
            alt="ReCraft"
            className="h-10 w-10 rounded-full ring-2 ring-emerald-300"
          />
          <span className="text-xl font-semibold text-emerald-900">ReCraft</span>
        </Link>

        {/* Desktop navbar */}
        <nav className="hidden items-center gap-4 text-[15px] sm:flex">
          <NavItem to="/" label="Home" />
          <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
          <NavItem to="/about" label="About" />
          <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
          <NavItem to="/buy" label="Buy Products" />
          <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
          <NavItem to="/sell" label="Sell Products" />
          <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
          <NavItem to="/waste-donation" label="Waste Donation" />
        </nav>

        {/* Desktop right actions */}
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
              <HeaderIcon ariaLabel="Account" onClick={() => navigate("/account")}>
                <User />
              </HeaderIcon>
              <HeaderIcon ariaLabel="Wishlist" onClick={() => navigate("/wishlist")}>
                <Heart />
              </HeaderIcon>
              <HeaderIcon ariaLabel="Cart" onClick={() => navigate("/cart")}>
                <ShoppingCart />
              </HeaderIcon>
              <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile: right side icons + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          {isAuthed ? (
            <>
              <HeaderIcon ariaLabel="Wishlist" onClick={() => navigate("/wishlist")}>
                <Heart />
              </HeaderIcon>
              <HeaderIcon ariaLabel="Cart" onClick={() => navigate("/cart")}>
                <ShoppingCart />
              </HeaderIcon>
            </>
          ) : null}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-900/10 bg-white/60 hover:bg-emerald-50 active:bg-emerald-100 text-emerald-900"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
              <SheetHeader className="px-4 pb-2 pt-4">
                <SheetTitle className="flex items-center gap-2">
                  <img
                    src={recraftLogo}
                    alt="ReCraft"
                    className="h-9 w-9 rounded-full ring-2 ring-emerald-300"
                  />
                  <span className="text-lg font-semibold text-emerald-900">ReCraft</span>
                </SheetTitle>
              </SheetHeader>
              <MobileNav onItemClick={() => setOpen(false)} isAuthed={isAuthed} />

              {/* Auth section (mobile) */}
              <div className="mt-2 border-t p-4">
                {!isAuthed && showActions ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="w-full text-emerald-900"
                      onClick={() => {
                        setOpen(false);
                        navigate("/signup");
                      }}
                    >
                      Sign Up
                    </Button>
                    <Button
                      className="w-full rounded-full bg-emerald-700 hover:bg-emerald-800"
                      onClick={() => {
                        setOpen(false);
                        navigate("/login");
                      }}
                    >
                      Login
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <HeaderIcon ariaLabel="Account" onClick={() => { setOpen(false); navigate("/account"); }}>
                        <User />
                      </HeaderIcon>
                      <HeaderIcon ariaLabel="Wishlist" onClick={() => { setOpen(false); navigate("/wishlist"); }}>
                        <Heart />
                      </HeaderIcon>
                      <HeaderIcon ariaLabel="Cart" onClick={() => { setOpen(false); navigate("/cart"); }}>
                        <ShoppingCart />
                      </HeaderIcon>
                    </div>
                    <Button variant="ghost" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

/* ---------- Subcomponents ---------- */

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `rounded-md px-1.5 py-1 outline-none transition-colors hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        isActive
          ? "border-b-2 border-emerald-700 pb-1 font-semibold text-emerald-900"
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
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
}) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-emerald-900 transition-colors hover:bg-emerald-50 hover:text-emerald-700 active:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
  >
    {children}
  </button>
);

/** Mobile nav list inside the Sheet */
const MobileNav = ({
  onItemClick,
  isAuthed,
}: {
  onItemClick: () => void;
  isAuthed: boolean;
}) => {
  const Item = ({ to, label }: { to: string; label: string }) => (
    <NavLink
      to={to}
      end
      onClick={onItemClick}
      className={({ isActive }) =>
        `block rounded-xl px-4 py-3 text-base transition-colors ${
          isActive
            ? "bg-emerald-50 font-semibold text-emerald-900"
            : "text-emerald-900 hover:bg-emerald-50"
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="space-y-1">
      <Item to="/" label="Home" />
      <Item to="/about" label="About" />
      <Item to="/buy" label="Buy Products" />
      <Item to="/sell" label="Sell Products" />
      <Item to="/waste-donation" label="Waste Donation" />
      {isAuthed ? (
        <>
          <Separator className="my-2" />
          <div className="px-4 pb-1 pt-2 text-xs font-medium uppercase text-emerald-900/60">
            My Stuff
          </div>
          <Item to="/account" label="Account" />
          <Item to="/wishlist" label="Wishlist" />
          <Item to="/cart" label="Cart" />
        </>
      ) : null}
    </div>
  );
};
