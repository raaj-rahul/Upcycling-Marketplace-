// src/pages/sell.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import sellIllustration from "@/assets/sell-illustration.png";

const Sell: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_0%,#E8F7EF_0%,#ffffff_60%)]">

      <Header />

      <main>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl py-10 sm:py-14">
            {/* Headline */}
            <h1 className="text-center text-3xl font-extrabold tracking-tight text-emerald-900 sm:text-4xl">
              Art that gives new life to the old.
            </h1>

            {/* Supporting copy */}
            <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-8 text-emerald-900/90 sm:text-xl">
              Meet the creative minds turning waste into wonder.
              <br className="hidden sm:block" />
              Every ReCraft artisan has a story of passion, purpose, and
              planet-friendly innovation.
            </p>

            {/* Illustration as background with button overlay */}
            <div className="relative mx-auto mt-10 flex w-full max-w-4xl items-center justify-center">
              {/* Background Image */}
              <img
                src={sellIllustration}
                alt="Sustainable design background"
                className="w-full max-h-[350px] object-contain opacity-95"
              />

              {/* Overlay Button */}
              <div className="absolute bottom-6 flex justify-center">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-base sm:text-lg bg-emerald-700 hover:bg-emerald-800 shadow-lg"
                  onClick={() => navigate("/sell/new")}
                >
                  Add new product
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Sell;
