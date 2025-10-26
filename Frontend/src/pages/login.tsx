// src/pages/login.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/recraft-logo.png";
import { toast } from "sonner";
import { loginUser } from "@/lib/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const res = loginUser(email.trim().toLowerCase(), password);
      setLoading(false);
      if (!res.ok) {
        toast.error("Login failed", { description: res.error });
        return;
      }
      toast.success("Welcome back", { description: res.user.name || res.user.email });
      navigate("/");
    }, 300);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-lg shadow-lg sm:flex-row flex-col">
        {/* Left Panel */}
        <div className="relative flex flex-1 flex-col items-center justify-center bg-white p-8 sm:p-12">
          {/* Logo + Brand */}
          <div className="absolute left-6 top-6 hidden sm:flex items-center space-x-3">
            <img src={logo} alt="ReCraft Logo" className="h-14 w-14" />
            <span className="text-3xl font-bold text-black">ReCraft</span>
          </div>
          <div className="flex sm:hidden items-center gap-3 absolute top-6 left-6">
            <img src={logo} alt="ReCraft Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-black">ReCraft</span>
          </div>

          <h2 className="mb-8 mt-16 sm:mt-20 text-2xl font-semibold">New here?</h2>
          <Button
            variant="outline"
            className="rounded-md bg-black px-8 py-2 text-base text-white hover:bg-gray-800"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>
        </div>

        {/* Right Panel */}
        <div className="relative flex flex-1 flex-col justify-center bg-emerald-200 p-8 sm:p-12">
          <h2 className="mb-8 mt-16 sm:mt-20 text-2xl font-bold text-black">Login to your account</h2>

          <form className="flex flex-col gap-5" onSubmit={onSubmit}>
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
                required
              />
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
                required
              />
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span className="cursor-pointer text-emerald-900/80 hover:underline">
                Forgot Password?
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-md border border-gray-300 bg-white py-2 text-base text-black hover:bg-gray-100"
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
