import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/recraft-logo.png";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden">
        {/* Left Panel */}
        <div className="relative flex flex-1 flex-col justify-center bg-emerald-200 p-12">
          <h2 className="text-2xl font-bold mb-10 text-black mt-20">
            Create your account
          </h2>
          <form className="flex flex-col gap-6">
            <div>
              <Label className="text-sm font-semibold text-black">Name</Label>
              <Input
                type="text"
                placeholder="Enter your name"
                className="mt-1 bg-white placeholder:text-emerald-900/70"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-black">Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="mt-1 bg-white placeholder:text-emerald-900/70"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-black">Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="mt-1 bg-white placeholder:text-emerald-900/70"
              />
            </div>

            <Button
              type="submit"
              className="mt-4 bg-white text-black border border-gray-300 hover:bg-gray-100 py-2 text-base rounded-md"
            >
              SIGNUP
            </Button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="relative flex flex-1 flex-col items-center justify-center bg-white p-12">
          {/* Logo and Brand Top-Right */}
          <div className="absolute top-6 right-8 flex items-center space-x-3">
            <span className="text-3xl font-bold text-black">ReCraft</span>
            <img src={logo} alt="ReCraft Logo" className="h-14 w-14" />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-10 mt-20">
            Hello, <br />
            Start your journey with us!
          </h2>
          <Button
            variant="outline"
            className="bg-black text-white hover:bg-gray-800 px-10 py-2 text-base rounded-md"
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