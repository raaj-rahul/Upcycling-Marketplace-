// src/pages/my-listings.tsx
import React from "react";
import Header from "@/components/layout/header";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  IndianRupee,
  PackagePlus,
  ArrowLeft,
} from "lucide-react";

// NEW: import to remove Buy items when a listing is deleted
import { removeUserProductsByListingId } from "@/lib/products";

/* ----------------------------- Types & Storage ----------------------------- */

type Listing = {
  id: string;
  title: string;
  price: number;
  stock: number;
  active: boolean;
  category?: string;
  createdAt: string;
};

const LS_KEY = "rc_listings";

function loadListings(): Listing[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Listing[]) : [];
  } catch {
    return [];
  }
}

function saveListings(listings: Listing[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(listings));
}

/* --------------------------------- Helpers -------------------------------- */

// function formatRs(v: number) {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(v);
// }
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

/* ---------------------------------- Page ---------------------------------- */

const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [q, setQ] = React.useState("");
  const [tab, setTab] = React.useState<"all" | "active" | "inactive">("all");
  const [toDelete, setToDelete] = React.useState<Listing | null>(null);

  React.useEffect(() => {
    setListings(loadListings());
  }, []);

  const filtered = listings.filter((l) => {
    const matchQ =
      !q ||
      l.title.toLowerCase().includes(q.toLowerCase()) ||
      l.id.toLowerCase().includes(q.toLowerCase());
    const matchTab = tab === "all" ? true : tab === "active" ? l.active : !l.active;
    return matchQ && matchTab;
  });

  const toggleActive = (id: string, active: boolean) => {
    setListings((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, active } : l));
      saveListings(next);
      return next;
    });
    toast.message(active ? "Listing activated" : "Listing paused");
  };

  const deleteListing = (l: Listing) => {
    setListings((prev) => {
      const next = prev.filter((x) => x.id !== l.id);
      saveListings(next);
      return next;
    });

    // NEW: also remove the Buy product(s) linked to this listing
    removeUserProductsByListingId(l.id);

    toast.success("Listing deleted", { description: `${l.title} removed.` });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-3">
          <Button variant="outline" onClick={() => navigate("/account")} type="button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Account
          </Button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-emerald-900">My Listings</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/sell")} type="button">
              <PackagePlus className="mr-2 h-4 w-4" /> Sell Center
            </Button>
            <Button onClick={() => navigate("/sell/new")} type="button">
              <Plus className="mr-2 h-4 w-4" /> Add Listing
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <Card>
          <CardHeader>
            <CardTitle>Manage Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/50" />
                  <Input
                    placeholder="Search by title or ID…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Listing</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-sm text-muted-foreground">
                        No listings yet — click "Add Listing" to begin.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((l) => (
                      <TableRow key={l.id} className="hover:bg-gray-50">
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => navigate(`/product/${l.id}`)}
                            className="font-medium hover:underline text-left"
                          >
                            {l.title}
                          </button>
                          <div className="text-xs text-muted-foreground">{l.id}</div>
                        </TableCell>
                        <TableCell>{l.category || "—"}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <IndianRupee className="h-3.5 w-3.5" />
                            {l.price.toLocaleString("en-IN")}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{l.stock}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={l.active ? "default" : "secondary"}>
                              {l.active ? "Active" : "Inactive"}
                            </Badge>
                            <Switch
                              checked={l.active}
                              onCheckedChange={(v) => toggleActive(l.id, v)}
                              aria-label={l.active ? "Deactivate listing" : "Activate listing"}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(l.createdAt)}</TableCell>

                        {/* Inline action buttons */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigate(`/sell/new?edit=${encodeURIComponent(l.id)}`)}
                              aria-label="Edit listing"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => setToDelete(l)}
                              aria-label="Delete listing"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirm */}
      <Dialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
          </DialogHeader>
          {toDelete && (
            <p className="text-sm">
              Are you sure you want to delete <b>{toDelete.title}</b>? This action cannot be undone.
            </p>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setToDelete(null)} type="button">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (toDelete) deleteListing(toDelete);
                setToDelete(null);
              }}
              type="button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListingsPage;
