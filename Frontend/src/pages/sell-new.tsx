// src/pages/sell-new.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/header";

// shadcn/ui + form libs
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Sonner toast (shadcn/use-toast is deprecated)
import { toast } from "sonner";

// types + product helpers
import type { Product } from "@/lib/shop";
import { addUserProduct } from "@/lib/products";

// ---------- schema ----------
const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const schema = z.object({
  productName: z.string().min(2, "Name is too short"),
  shopName: z.string().min(2, "Shop name is too short"),
  location: z.string().min(2, "Please enter a location"),
  category: z.string().min(1, "Select a category"),
  price: z
    .string()
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, "Enter a valid price"),
  quantity: z
    .string()
    .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 1, "Enter a valid quantity"),
  materials: z.string().min(2, "Tell buyers what it’s made of"),
  description: z.string().min(10, "Add a brief description"),
  productPhoto: z
    .instanceof(FileList, { message: "Please add a product photo" })
    .refine((files) => files.length > 0, "Please add a product photo")
    .refine((files) => ACCEPTED_TYPES.has(files[0]?.type ?? ""), "Supported formats: PNG, JPG, WEBP")
    .refine((files) => (files[0]?.size ?? 0) <= MAX_IMAGE_SIZE, "Max size 3MB"),
  allowReturns: z.boolean().default(false),
});

// Align RHF with zodResolver (input vs output)
type SellFormInput = z.input<typeof schema>;
type SellFormOutput = z.output<typeof schema>;

// ---------- helpers ----------
// INR currency formatter for preview
const fmt = (n: string) => {
  const v = Number(n);
  if (Number.isNaN(v)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(v);
};

// read file -> data URL (so Buy page can show it instantly)
async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

const SellNew: React.FC = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = React.useState<string | null>(null);

  // Lock RHF generics with input/output to match zodResolver
  const form = useForm<SellFormInput, any, SellFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      productName: "",
      shopName: "",
      location: "",
      category: "",
      price: "",
      quantity: "1",
      materials: "",
      description: "",
      allowReturns: true,
    },
    mode: "onChange",
  });

  // Live preview when a file is selected
  const watchPhoto = form.watch("productPhoto");
  React.useEffect(() => {
    const file = watchPhoto?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [watchPhoto]);

  const onSubmit = async (values: SellFormOutput) => {
    try {
      const file = values.productPhoto?.[0];
      const dataUrl = file ? await fileToDataURL(file) : "";

      // Build a Product for the frontend-only listing
      const newProduct: Product = {
        id: Date.now(), // simple unique id
        name: values.productName,
        image: dataUrl, // data URL lets it render instantly on Buy page
        price: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(Number(values.price || 0)),
        quality: "Good", // you can map from category if you like
        location: values.location,
        description: values.description,
        rating: 4.7,
        stock: Number(values.quantity || "1"),
      };

      addUserProduct(newProduct);

      toast.success("Product listed!", {
        description: "Your upcycled creation is now visible in Buy Products.",
      });

      navigate("/buy");
    } catch (err) {
      toast.error("Upload failed", {
        description: "We couldn’t save your listing image. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_60%_at_50%_0%,#E8F7EF_0%,#ffffff_60%)]">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl py-8 sm:py-12">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
              Add a new product
            </h1>
            <p className="mt-1 text-emerald-900/80">
              Share your upcycled creation — clear photos and honest details help buyers fall in love. 💚
            </p>
          </div>

          {/* content grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* left: form */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Product details</CardTitle>
              </CardHeader>
              <Separator className="mb-2" />

              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Product photo (full width) */}
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="productPhoto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product photo</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-4">
                                <label
                                  htmlFor="product-photo"
                                  className="inline-flex cursor-pointer items-center justify-center rounded-md border border-dashed border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50"
                                >
                                  Upload image
                                </label>
                                <input
                                  id="product-photo"
                                  type="file"
                                  accept={Array.from(ACCEPTED_TYPES).join(",")}
                                  className="hidden"
                                  onChange={(e) => {
                                    const files = e.target.files as FileList | null;
                                    if (files) field.onChange(files);
                                  }}
                                />
                                <FormDescription className="text-emerald-900/70">
                                  PNG, JPG, or WEBP up to 3MB.
                                </FormDescription>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {preview && (
                        <div className="mt-3 rounded-lg border border-emerald-100 bg-white p-2">
                          <img src={preview} alt="Preview" className="mx-auto block h-48 w-auto object-contain" />
                        </div>
                      )}
                    </div>

                    {/* Product name */}
                    <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product name</FormLabel>
                          <FormControl>
                            <Input placeholder="Upcycled tote bag" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Shop name */}
                    <FormField
                      control={form.control}
                      name="shopName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop name</FormLabel>
                          <FormControl>
                            <Input placeholder="Green Thread Studio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Location */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Bengaluru, India" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bags">Bags & Accessories</SelectItem>
                                <SelectItem value="decor">Home Decor</SelectItem>
                                <SelectItem value="jewelry">Jewelry</SelectItem>
                                <SelectItem value="art">Art & Crafts</SelectItem>
                                <SelectItem value="furniture">Furniture</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price */}
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 1000" inputMode="decimal" {...field} />
                          </FormControl>
                          <FormDescription className="text-emerald-900/70">
                            {field.value ? `Shown to buyers as ${fmt(field.value)}` : "Enter amount in INR"}
                          </FormDescription>
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
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 10" inputMode="numeric" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Materials */}
                    <FormField
                      control={form.control}
                      name="materials"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Materials used</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Denim offcuts, cotton lining, recycled buttons…"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-emerald-900/70">
                            Tell buyers what the item is made from.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share the story, dimensions, care, and anything that makes it special…"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Returns switch */}
                    <FormField
                      control={form.control}
                      name="allowReturns"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border bg-white px-3 py-2 md:col-span-2">
                          <div>
                            <FormLabel className="mb-0">Allow returns</FormLabel>
                            <FormDescription className="mt-0">
                              Buyers can request a return according to your policy.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <div className="md:col-span-2 flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => navigate("/sell")}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
                        Submit product
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* right: live preview */}
            <Card className="self-start sticky top-4">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="overflow-hidden rounded-lg border border-emerald-100 bg-white">
                  <div className="aspect-[4/3] w-full bg-emerald-50/50 flex items-center justify-center">
                    {preview ? (
                      <img src={preview} className="h-full w-full object-contain" alt="Preview" />
                    ) : (
                      <span className="text-sm text-emerald-900/60">Product photo preview</span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-[15px] font-semibold text-emerald-900">
                      {form.watch("productName") || "Product name"}
                    </div>
                    <div className="mt-1 text-sm text-emerald-900/70">
                      {form.watch("shopName") || "Shop name"} • {form.watch("location") || "Location"}
                    </div>
                    <div className="mt-2 text-emerald-900 font-semibold">
                      {form.watch("price") ? fmt(form.watch("price")) : "₹0.00"}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-emerald-900/60">
                This is a quick visual preview of the listing card.
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellNew;
