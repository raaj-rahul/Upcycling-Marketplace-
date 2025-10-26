// src/pages/about.tsx
import React from "react";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import backgroundImg from "@/assets/background.jpg";
import recraftLogo from "@/assets/recraft-logo.png";

const About: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-emerald-50">
      {/* BACKDROP */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: "cover" }}
      />
      <div className="absolute inset-0 bg-white/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/90" />

      {/* PAGE CONTENT */}
      <div className="relative flex flex-col">
        <Header />

        <section className="mx-auto max-w-screen-xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          {/* TITLE SECTION */}
          <div className="flex items-center gap-3 mb-10 justify-center">
            <div className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-emerald-100 ring-2 ring-emerald-600/40">
              <img src={recraftLogo} alt="ReCraft logo" className="h-14 w-14 object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-emerald-900 tracking-tight">About ReCraft</h1>
          </div>

          {/* INTRO PARAGRAPH */}
          <p className="text-center max-w-3xl mx-auto text-[16px] leading-7 text-emerald-900/80 mb-10">
            ReCraft is a sustainability-driven platform that bridges creativity and eco-awareness.
            We empower artisans to transform discarded materials into meaningful products while
            inspiring people everywhere to choose thoughtfully and live sustainably.
          </p>

          {/* CARDS GRID */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
            <InfoCard
              emoji="🌿"
              title="Our Story"
              text="ReCraft began as a student-led initiative with one simple mission — to give waste a second life. What started as a small sustainability project grew into a movement of conscious creation and ethical design."
            />
            <InfoCard
              emoji="💡"
              title="Our Mission"
              text="We aim to empower local artisans and creative crafters by offering them a digital space to showcase handmade, upcycled products while promoting sustainability."
            />
            <InfoCard
              emoji="🛍️"
              title="What We Offer"
              text="A marketplace where buyers discover eco-friendly crafts, artisans earn fairly, and wasted materials find new purpose through creative transformation."
            />
            <InfoCard
              emoji="🌍"
              title="Our Vision"
              text="We envision a global community that values reuse over waste, creation over consumption, and sustainability over convenience."
            />
            <InfoCard
              emoji="🎓"
              title="A Student Initiative"
              text="Built by engineering students who believe innovation should solve real problems, ReCraft is a platform with purpose — designed to inspire and educate along the way."
            />
            <InfoCard
              emoji="🌱"
              title="Sustainability Impact"
              text="Through reuse and circular design, ReCraft encourages conscious living and proves that even small eco-friendly choices can make a big difference."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

/* ---------- Card Component ---------- */
function InfoCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <Card className="w-full max-w-sm rounded-xl border border-emerald-200/40 bg-white/85 shadow-sm backdrop-blur-sm transition hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{emoji}</span>
          <h3 className="text-[17px] font-semibold text-emerald-900">{title}</h3>
        </div>
        <p className="text-[14px] text-emerald-900/80 leading-6">{text}</p>
      </CardContent>
    </Card>
  );
}
