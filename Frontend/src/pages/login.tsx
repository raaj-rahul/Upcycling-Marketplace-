// src/pages/login.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/recraft-logo.png";

const DUMMY_EMAIL = "demo@recraft.io";
const DUMMY_PASSWORD = "demo123";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    // Fake auth check
    setTimeout(() => {
      if (email.trim().toLowerCase() === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
        localStorage.setItem("rc_auth", "1"); // mark as logged in
        setLoading(false);
        navigate("/"); // go to Home
      } else {
        setLoading(false);
        setError("Invalid credentials. Try demo@recraft.io / demo123");
      }
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-lg shadow-lg">
        {/* Left Panel */}
        <div className="relative flex flex-1 flex-col items-center justify-center bg-white p-12">
          {/* Logo and Brand Top-Left */}
          <div className="absolute left-8 top-6 flex items-center space-x-3">
            <img src={logo} alt="ReCraft Logo" className="h-14 w-14" />
            <span className="text-3xl font-bold text-black">ReCraft</span>
          </div>

          {/* Content Center */}
          <h2 className="mb-10 mt-20 text-2xl font-semibold">Welcome back,</h2>
          <Button
            variant="outline"
            className="rounded-md bg-black px-10 py-2 text-base text-white hover:bg-gray-800"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </div>

        {/* Right Panel */}
        <div className="relative flex flex-1 flex-col justify-center bg-emerald-200 p-12">
          <h2 className="mb-10 mt-20 text-2xl font-bold text-black">Login to your account</h2>

          <form className="flex flex-col gap-6" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="mt-1 bg-white placeholder:text-emerald-900/70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <p className="mt-1 text-xs text-emerald-900/70">
                Use <span className="font-semibold">{DUMMY_EMAIL}</span>
              </p>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-black">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1 bg-white placeholder:text-emerald-900/70"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <p className="mt-1 text-xs text-emerald-900/70">
                Use <span className="font-semibold">{DUMMY_PASSWORD}</span>
              </p>
            </div>

            {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

            <div className="mt-2 flex justify-between text-sm">
              <span className="cursor-pointer text-emerald-900/80 hover:underline">
                Forgot Password?
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-md border border-gray-300 bg-white py-2 text-base text-black hover:bg-gray-100"
            >
              {loading ? "Logging in…" : "LOGIN"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
