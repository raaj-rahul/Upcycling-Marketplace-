import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/header";
import wasteHero from "@/assets/waste-hero.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

/* -------------------- FAQ data -------------------- */
const FAQS = [
  {
    q: "Do I need to wash items?",
    a: "Yes—please submit items clean and dry. This prevents mold and reduces prep time for artisans.",
  },
  {
    q: "Can you pick up from my location?",
    a: "Pickup is available in select areas. You can check serviceability during “Submit Materials”.",
  },
  {
    q: "What if my item isn’t listed?",
    a: "Tell us about it in the form—we’ll confirm if an artisan can reuse it safely.",
  },
];

/* -------------------- Page -------------------- */
const WasteDonationPage: React.FC = () => {
  return (
    <>
      <Header />

      {/* Soft background gradient */}
      <main className="bg-[radial-gradient(60%_60%_at_50%_0%,#E8F7EF_0%,#ffffff_60%)]">
        {/* Hero */}
        <section className="container mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:py-10 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <h1 className="text-[28px] sm:text-4xl lg:text-[40px] font-semibold text-emerald-900 leading-tight">
              DON'T THROW IT AWAY—
              <span className=" decoration-emerald-400 underline-offset-8">
                {" "}GIVE IT A NEW STORY.
              </span>
            </h1>
            <p className="mt-4 text-emerald-900/80 text-lg">
              Instead of ending up in a landfill, your waste can start a new
              journey in the hands of an upcycling artisan.
            </p>

            <div className="mt-6">
              <Button
                asChild
                className="h-11 rounded-full px-6 text-base bg-emerald-700 hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <Link to="/waste-donation/submit">Submit Materials</Link>
              </Button>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 h-28 w-28 rounded-full bg-emerald-200/50 blur-2xl" />
            <div className="absolute bottom-0 -left-4 h-20 w-20 rounded-full bg-emerald-300/40 blur-2xl" />
            <Card className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-emerald-100">
              <CardContent className="p-0">
                <img
                  src={wasteHero}
                  alt="Waste donation illustration"
                  className="block h-full w-full object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="container mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-900">How it works</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { step: "1", title: "Check what we accept", desc: "See accepted materials and prepare them clean and dry." },
              { step: "2", title: "Submit materials", desc: "Share basic details and schedule a pickup or drop-off." },
              { step: "3", title: "Get updates", desc: "We match your materials with artisans and keep you posted." },
            ].map((c) => (
              <Card key={c.step} className="ring-1 ring-emerald-100 hover:shadow-sm transition-shadow">
                <CardHeader className="pb-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white text-sm">
                      {c.step}
                    </span>
                    {/* ↑ increased size */}
                    <CardTitle className="text-lg font-semibold text-emerald-900">
                      {c.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                {/* ↑ increased size */}
                <CardContent className="pt-1 pb-4">
                  <p className="text-sm text-emerald-900/80">{c.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Accepted materials */}
        <section id="accepted" className="container mx-auto max-w-6xl px-4 pb-8 sm:pb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-900">Accepted materials</h2>
          {/* ↑ increased size */}
          <p className="mt-2 text-emerald-900/80 text-base">
            Clean and sorted materials help artisans reuse faster. When in doubt, ask us in the form.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Cotton & denim fabric",
              "Old T-shirts (clean)",
              "Glass jars (with lids)",
              "Sturdy cardboard",
              "Plastic bottles (PET, clean)",
              "Aluminium cans",
              "Wood offcuts",
              "Leather scraps",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border bg-white px-3 py-1 text-sm text-emerald-900 ring-1 ring-emerald-100 hover:bg-emerald-50 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Why donate */}
        <section className="container mx-auto max-w-6xl px-4 pb-8 sm:pb-10">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { title: "Less landfill", desc: "Keep useful materials out of landfills and oceans." },
              { title: "Support artisans", desc: "Your waste becomes raw material for local creators." },
              { title: "Close the loop", desc: "Build a culture of repair, reuse, and circular design." },
            ].map((b, i) => (
              <Card key={i} className="ring-1 ring-emerald-100 hover:shadow-sm transition-shadow">
                <CardHeader className="pb-1">
                  {/* ↑ increased size */}
                  <CardTitle className="text-xl font-semibold text-emerald-900">
                    {b.title}
                  </CardTitle>
                </CardHeader>
                {/* ↑ increased size */}
                <CardContent className="pt-1 pb-4">
                  <p className="text-base text-emerald-900/80">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ – Soft highlight (Option B) */}
        <section id="faq" className="container mx-auto max-w-4xl px-4 pb-14">
          <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-900">FAQ</h2>

          <div className="mt-4 space-y-3">
            {FAQS.map((item, idx) => (
              <SoftFaq key={idx} q={item.q} a={item.a} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              asChild
              className="h-11 rounded-full px-6 text-base bg-emerald-700 hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <Link to="/waste-donation/submit">Submit Materials</Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default WasteDonationPage;

/* -------------------- Local components -------------------- */
const SoftFaq: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = React.useState(false);
  const id = idify(q);

  return (
    <div className="rounded-xl border border-emerald-100 bg-white/70 shadow-[0_1px_0_rgba(16,185,129,0.05)] transition-colors hover:bg-emerald-50/40">
      <button
        id={id}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 rounded-xl"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {/* ↑ increased size */}
        <span className="text-emerald-900 font-semibold text-lg">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-emerald-800 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {/* Divider line when open */}
      <div className={`transition-opacity ${open ? "opacity-100" : "opacity-0"}`}>
        {open && <div className="mx-4 mb-2 h-px bg-emerald-100" />}
      </div>

      {/* Animated content (compact) */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          {/* ↑ increased size */}
          <p className="px-4 pb-3 text-base text-emerald-900/85">{a}</p>
        </div>
      </div>
    </div>
  );
};

function idify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
