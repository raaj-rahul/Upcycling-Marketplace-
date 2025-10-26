// src/pages/home.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import heroIllustration from "@/assets/hero-illustration.png";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate(); // ✅ for redirect

  return (
    <div className="min-h-screen bg-emerald-50">
      <Header />

      {/* HERO */}
      <main>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mt-8 rounded-2xl border-emerald-100 bg-white shadow-sm">
            <CardContent className="grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12">
              {/* Copy */}
              <div className="order-2 max-w-prose lg:order-1 lg:col-span-6">
                <h1 className="font-serif text-3xl font-extrabold leading-tight text-emerald-900 sm:text-4xl lg:text-5xl">
                  Waste Less. Create More.
                </h1>

                <p className="mt-4 italic text-emerald-900/90">
                  Every piece has a story. Every material has a second life.
                </p>

                <p className="mt-3 text-[15px] leading-7 text-emerald-900/90">
                  At ReCraft, we bridge creativity and sustainability, connecting people who care about the
                  planet with artisans who bring new life to old things.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {/* ✅ Buy Route */}
                  <Button
                    className="bg-emerald-700 hover:bg-emerald-800"
                    onClick={() => navigate("/buy")}
                  >
                    Explore Products
                  </Button>

                  {/* ✅ Sell Route */}
                  <Button
                    variant="outline"
                    className="border-emerald-700 text-emerald-900 hover:bg-emerald-50"
                    onClick={() => navigate("/sell")}
                  >
                    Sell Products
                  </Button>
                </div>
              </div>

              {/* Illustration */}
              <div className="order-1 lg:order-2 lg:col-span-6">
                <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60 shadow-sm">
                  <img
                    src={heroIllustration}
                    alt="Sustainable crafting illustration"
                    className="block h-auto w-full object-contain"
                  />
                  <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-tr from-transparent via-transparent to-emerald-100/40" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FEATURES */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-12 grid gap-4 rounded-xl border border-emerald-100 bg-white/70 p-4 sm:grid-cols-3 sm:p-6">
            <Feature icon="♻️" title="Upcycled Only" desc="Every product is reborn from pre-loved materials." />
            <Feature icon="🤝" title="Fair to Artisans" desc="Direct partnerships with local makers." />
            <Feature icon="🌱" title="Planet-Positive" desc="Low-impact processes and packaging." />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-16 border-t bg-white">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-sm text-emerald-900/70">© {new Date().getFullYear()} ReCraft</p>
            <div className="flex items-center gap-6 text-sm text-emerald-900/80">
              <a className="hover:text-emerald-900" href="#">Privacy</a>
              <a className="hover:text-emerald-900" href="#">Terms</a>
              <a className="hover:text-emerald-900" href="#">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg p-2">
      <div className="text-xl">{icon}</div>
      <div>
        <div className="text-[15px] font-semibold text-emerald-900">{title}</div>
        <div className="text-sm text-emerald-900/80">{desc}</div>
      </div>
    </div>
  );
}

export default Home;
