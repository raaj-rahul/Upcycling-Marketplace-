
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";


import recraftLogo from "@/assets/recraft-logo.png";            
import heroIllustration from "@/assets/hero-illustration.png";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* HEADER */}
      <header className="border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-1 ring-emerald-300 bg-emerald-100">
              <img src={recraftLogo} alt="ReCraft" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-xl font-semibold text-emerald-900">ReCraft</span>
          </div>

          {/* Nav */}
          <nav className="hidden items-center gap-6 text-[15px] text-emerald-900 sm:flex">
            <a className="hover:text-emerald-700" href="#">Home</a>
            <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
            <a className="hover:text-emerald-700" href="#about">About</a>
            <Separator orientation="vertical" className="h-5 bg-emerald-900/20" />
            <a className="hover:text-emerald-700" href="#products">Products</a>
          </nav>

          {/* Actions */}
          <div className="hidden items-center gap-3 sm:flex">
            <Button variant="ghost" className="text-emerald-900 hover:bg-emerald-100">Sign In</Button>
            <Button className="rounded-full bg-emerald-700 hover:bg-emerald-800">Get Started</Button>
          </div>

          {/* Mobile CTA (optional small) */}
          <div className="sm:hidden">
            <Button size="sm" className="rounded-full bg-emerald-700 hover:bg-emerald-800">Start</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mt-8 rounded-2xl border-emerald-100 bg-white shadow-sm">
            <CardContent className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12">
              {/* Copy */}
              <div className="order-2 max-w-prose lg:order-1 lg:col-span-6">
                <h1 className="font-serif text-3xl font-extrabold leading-tight text-emerald-900 sm:text-4xl lg:text-5xl">
                  Waste Less. Create More.
                </h1>

                <p className="mt-4 italic text-emerald-900/90">
                  Every piece has a story. Every material has a second life.
                </p>

                <p className="mt-3 text-[15px] leading-7 text-emerald-900/90">
                  At ReCraft, we bridge creativity and sustainability, connecting
                  people who care about the planet with artisans who bring new life to old things.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button className="bg-emerald-700 hover:bg-emerald-800">Explore Products</Button>
                  <Button variant="outline" className="border-emerald-700 text-emerald-900 hover:bg-emerald-50">
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Illustration */}
              <div className="order-1 lg:order-2 lg:col-span-6">
                <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60 shadow-sm">
                  {/* Keeps image clean and never stretched */}
                  <img
                    src={heroIllustration}
                    alt="Sustainable crafting illustration"
                    className="block h-auto w-full object-contain"
                  />
                  {/* Subtle corner glow */}
                  <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-tr from-transparent via-transparent to-emerald-100/40"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* TRUST / FEATURES STRIP (adds breathing room + structure) */}
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

// Small presentational helper
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
