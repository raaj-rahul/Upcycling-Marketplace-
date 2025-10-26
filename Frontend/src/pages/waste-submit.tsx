// src/pages/waste-submit.tsx
import React from "react";
import Header from "@/components/layout/header";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Illustration
import wasteHero from "@/assets/waste-hero.png";

/* =========================================
   ZOD SCHEMA
   ========================================= */
const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const PIN_REGEX = /^[1-9][0-9]{5}$/; // India 6-digit pincode

const formSchema = z
  .object({
    materialType: z.string().min(2, "Please enter the material type."),
    quantity: z.string().min(1, "Please specify quantity or approx. weight."),
    condition: z.enum(["clean", "good", "broken", "mixed"], {
      message: "Select a condition",
    }),
    images: z
      .array(
        z
          .custom<File>((f) => f instanceof File, "Invalid file")
          .refine((f) => f.size <= MAX_IMAGE_SIZE, "Each image must be ≤ 5MB")
      )
      .max(MAX_IMAGES, `Max ${MAX_IMAGES} images`)
      .optional()
      .default([]),
    notes: z.string().max(500, "Keep it short (≤ 500 chars)").optional().default(""),
    pickup: z.boolean().default(false),
    address: z.string().optional(),
    pincode: z.string().optional(),
    consent: z.boolean().refine((v) => v === true, {
      message: "Please confirm you’re donating responsibly.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.pickup) {
      if (!data.address || data.address.trim().length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "Pickup address is required.",
        });
      }
      if (!data.pincode || !PIN_REGEX.test(data.pincode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pincode"],
          message: "Enter a valid 6-digit pincode.",
        });
      }
    }
  });

// Align RHF with zodResolver (input vs output)
type DonationFormInput = z.input<typeof formSchema>;
type DonationFormOutput = z.output<typeof formSchema>;

/* =========================================
   PAGE
   ========================================= */
const WasteSubmitPage: React.FC = () => {
  const [submitting, setSubmitting] = React.useState(false);
  const [submittedId, setSubmittedId] = React.useState<string | null>(null);

  // Pincode serviceability local state
  const [pinStatus, setPinStatus] = React.useState<"idle" | "checking" | "ok" | "fail" | "error">("idle");
  const [pinRegion, setPinRegion] = React.useState<string | null>(null);
  const [pinMessage, setPinMessage] = React.useState<string>("");

  // Lock RHF generics with input/output to match zodResolver
  const form = useForm<DonationFormInput, any, DonationFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialType: "",
      quantity: "",
      // Select until chosen; DeepPartial allows undefined in defaults
      condition: undefined as unknown as DonationFormInput["condition"],
      images: [],
      notes: "",
      pickup: false,
      address: "",
      pincode: "",
      consent: false,
    },
    mode: "onChange",
  });

  const pincode = form.watch("pincode");
  const pickup = form.watch("pickup");

  // Reset pin status if pincode changes
  React.useEffect(() => {
    setPinStatus("idle");
    setPinRegion(null);
    setPinMessage("");
  }, [pincode]);

  // -------- API-ready pincode checker --------
  const checkPincode = async () => {
    const code = pincode ?? "";
    if (!PIN_REGEX.test(code)) {
      form.setError("pincode", { message: "Enter a valid 6-digit pincode." });
      return;
    }

    try {
      setPinStatus("checking");
      setPinMessage("");
      setPinRegion(null);

      // ---- Call your backend here ----
      const res = await fetch(`/api/check-pincode?code=${encodeURIComponent(code)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: { serviceable: boolean; region?: string; eta_days?: number } = await res.json();

      if (json.serviceable) {
        setPinStatus("ok");
        setPinRegion(json.region ?? null);
        setPinMessage(
          json.eta_days
            ? `Serviceable${json.region ? ` – ${json.region}` : ""}. Pickup will be scheduled within ~${json.eta_days} day(s).`
            : `Serviceable${json.region ? ` – ${json.region}` : ""}. Pickup will be scheduled soon.`
        );
      } else {
        setPinStatus("fail");
        setPinMessage("Sorry, we don’t pick up in this area yet. You can still drop off.");
      }
    } catch {
      setPinStatus("error");
      setPinMessage("Couldn’t check serviceability. Please try again.");
    }
  };

  const onSubmit = async (values: DonationFormOutput) => {
    if (values.pickup && pinStatus !== "ok") {
      form.setError("pincode", {
        message:
          pinStatus === "fail"
            ? "This pincode is not serviceable for pickup."
            : "Please verify pincode serviceability before submitting.",
      });
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));

    const id = "DON-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setSubmittedId(id);

    const payload = {
      id,
      ...values,
      pickup_serviceable: values.pickup ? pinStatus === "ok" : false,
      region: pinRegion,
    };
    // await fetch("/api/donations", { method: "POST", body: JSON.stringify(payload) })
    localStorage.setItem("last_waste_donation", JSON.stringify(payload));

    const keepPickup = values.pickup;
    form.reset({
      materialType: "",
      quantity: "",
      condition: undefined as unknown as DonationFormInput["condition"],
      images: [],
      notes: "",
      pickup: keepPickup,
      address: "",
      pincode: "",
      consent: false,
    });

    setPinStatus("idle");
    setPinRegion(null);
    setPinMessage("");
    setSubmitting(false);
  };

  // Image helpers
  const images = form.watch("images");
  const onFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const existing = images ?? [];
    const list = Array.from(files);
    const next = [...existing, ...list].slice(0, MAX_IMAGES);
    form.setValue("images", next, { shouldValidate: true });
  };
  const removeImageAt = (idx: number) => {
    const next = [...(images ?? [])];
    next.splice(idx, 1);
    form.setValue("images", next, { shouldValidate: true });
  };

  return (
    <>
      <Header />

      <main className="bg-[radial-gradient(60%_60%_at_50%_0%,#E8F7EF_0%,#ffffff_60%)]">
        <section className="container mx-auto max-w-6xl px-4 py-6 sm:py-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-semibold text-emerald-900">Submit Materials</h1>
            <p className="mt-2 text-emerald-900/80">
              Tell us what you’re donating. We’ll match it with the right artisan or recycler.
            </p>
          </div>

          {submittedId && (
            <Card className="mb-6 border-emerald-200 bg-emerald-50">
              <CardContent className="py-3 text-emerald-900">
                <p className="font-medium">
                  🎉 Thanks! Your donation request <span className="font-semibold">{submittedId}</span> was recorded.
                </p>
                <p className="text-sm text-emerald-900/80">
                  For pickup requests in serviceable areas, our backend will allocate a time slot and notify you by email/SMS.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Form Card */}
            <Card className="ring-1 ring-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-emerald-900">Donation details</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Material Type */}
                    <FormField
                      control={form.control}
                      name="materialType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., plastic bottles, wood pieces, metal scraps, fabric" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quantity */}
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity / Approx. weight</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 4 bags (~8 kg)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Condition */}
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition of material</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="clean">Clean / Ready to reuse</SelectItem>
                                <SelectItem value="good">Good / Minor cleaning</SelectItem>
                                <SelectItem value="broken">Broken / For parts</SelectItem>
                                <SelectItem value="mixed">Mixed</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Images */}
                    <FormField
                      control={form.control}
                      name="images"
                      render={() => (
                        <FormItem>
                          <FormLabel>Upload image(s)</FormLabel>
                          <FormControl>
                            <div>
                              <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => onFilesSelected(e.target.files)}
                              />
                              {images && images.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-3">
                                  {images.map((file, idx) => {
                                    const url = URL.createObjectURL(file);
                                    return (
                                      <div key={idx} className="relative">
                                        <img
                                          src={url}
                                          className="h-24 w-full rounded-md object-cover ring-1 ring-emerald-100"
                                          onLoad={() => URL.revokeObjectURL(url)}
                                          alt=""
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeImageAt(idx)}
                                          className="absolute -right-2 -top-2 rounded-full bg-emerald-700 px-2 py-0.5 text-xs text-white shadow hover:bg-emerald-800"
                                          aria-label="Remove image"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <p className="text-xs text-emerald-900/60">Up to {MAX_IMAGES} images, each ≤ 5MB.</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional notes (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special instructions (e.g., fragile items, preferred packaging)…"
                              className="min-h-[90px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Pickup toggle */}
                    <FormField
                      control={form.control}
                      name="pickup"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 pr-4">
                          <div className="space-y-0.5">
                            <FormLabel>Pickup requested?</FormLabel>
                            <p className="text-xs text-emerald-900/70">
                              Turn on to request a pickup (serviceable areas only). If serviceable, our backend will
                              allocate a slot and notify you by email/SMS.
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Pickup details (conditional) */}
                    {pickup && (
                      <div className="grid gap-4">
                        {/* Address */}
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pickup address</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="House/Flat, Street, Area, City, Pincode"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Pincode + checker */}
                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pincode</FormLabel>
                              <div className="flex items-start gap-2">
                                <FormControl>
                                  <Input
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="6-digit pincode"
                                    {...field}
                                    className="max-w-[220px]"
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="shrink-0"
                                  onClick={checkPincode}
                                  disabled={pinStatus === "checking" || !PIN_REGEX.test(field.value || "")}
                                >
                                  {pinStatus === "checking" ? "Checking…" : "Check serviceability"}
                                </Button>
                              </div>

                              {/* Status line */}
                              <div className="mt-2 text-sm">
                                {pinStatus === "ok" && (
                                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-800 ring-1 ring-emerald-200">
                                    ✅ {pinMessage}
                                  </span>
                                )}
                                {pinStatus === "fail" && (
                                  <span className="rounded-full bg-red-50 px-2 py-1 text-red-700 ring-1 ring-red-200">
                                    ❌ {pinMessage}
                                  </span>
                                )}
                                {pinStatus === "error" && (
                                  <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-800 ring-1 ring-amber-200">
                                    ⚠️ {pinMessage}
                                  </span>
                                )}
                              </div>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {pinStatus === "ok" && (
                          <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-900">
                            Pickup is <span className="font-medium">serviceable{pinRegion ? ` in ${pinRegion}` : ""}</span>.
                            We’ll email/SMS your pickup slot once allocated by our backend.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Consent */}
                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex items-start gap-3 rounded-lg bg-emerald-50/50 p-3">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-0.5">
                            <FormLabel>I agree to donate responsibly</FormLabel>
                            <p className="text-xs text-emerald-900/70">
                              I confirm the materials are mine to donate and safe to handle.
                            </p>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="pt-1">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="h-11 w-full sm:w-auto rounded-full px-8 bg-emerald-700 hover:bg-emerald-800"
                      >
                        {submitting ? "Submitting…" : "Donate"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Right column visual / info */}
            <div className="hidden lg:block">
              <Card className="sticky top-20 overflow-hidden ring-1 ring-emerald-100">
                <CardContent className="p-0">
                  <img src={wasteHero} alt="Donate materials" className="block h-full w-full object-cover" />
                </CardContent>
              </Card>

              <Card className="mt-4 ring-1 ring-emerald-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-emerald-900">Tips for faster processing</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="list-disc pl-5 text-sm text-emerald-900/85 space-y-1.5">
                    <li>Send items clean & dry (no food residue, no mold).</li>
                    <li>Sort by type (textiles, metal, plastic, wood).</li>
                    <li>For fragile items, add a short note under “Additional notes”.</li>
                    <li>Upload clear photos—helps us match the right artisan.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default WasteSubmitPage;
