// src/pages/signup.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/recraft-logo.png";
import { toast } from "sonner";
import { registerUser } from "@/lib/auth";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const res = registerUser({ name, email, password });
      setLoading(false);
      if (!res.ok) {
        toast.error("Signup failed", { description: res.error });
        return;
      }
      toast.success("Account created", { description: "Welcome to ReCraft!" });
      navigate("/");
    }, 300);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden sm:flex-row flex-col">
        {/* Left Panel */}
        <div className="relative flex flex-1 flex-col justify-center bg-emerald-200 p-8 sm:p-12">
          <h2 className="text-2xl font-bold mb-8 text-black mt-10 sm:mt-20">
            Create your account
          </h2>
          <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <div>
              <Label className="text-sm font-semibold text-black">Name</Label>
              <Input
                type="text"
                placeholder="Enter your name"
                className="mt-1 bg-white placeholder:text-emerald-900/70"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-black">Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="mt-1 bg-white placeholder:text-emerald-900/70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-black">Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="mt-1 bg-white placeholder:text-emerald-900/70"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 bg-white text-black border border-gray-300 hover:bg-gray-100 py-2 text-base rounded-md"
            >
              {loading ? "Creating..." : "SIGNUP"}
            </Button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="relative flex flex-1 flex-col items-center justify-center bg-white p-8 sm:p-12">
          {/* Logo and Brand Top-Right on desktop, top on mobile */}
          <div className="absolute top-6 right-8 sm:flex items-center space-x-3 hidden">
            <span className="text-3xl font-bold text-black">ReCraft</span>
            <img src={logo} alt="ReCraft Logo" className="h-14 w-14" />
          </div>

          <div className="flex sm:hidden items-center gap-3 absolute top-6 left-6">
            <img src={logo} alt="ReCraft Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-black">ReCraft</span>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-8 mt-16 sm:mt-20">
            Hello, <br className="hidden sm:block" />
            Start your journey with us!
          </h2>
          <Button
            variant="outline"
            className="bg-black text-white hover:bg-gray-800 px-8 py-2 text-base rounded-md"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
