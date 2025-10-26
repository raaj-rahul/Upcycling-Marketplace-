// src/pages/orders.tsx
import React from "react";
import Header from "@/components/layout/header";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Truck, Package2, Search, ArrowLeft } from "lucide-react";

/* ----------------------------- Types & Storage ----------------------------- */

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

type OrderItem = {
  id: string;
  title: string;
  qty: number;
  price: number;
  image?: string;
};

type Order = {
  id: string;
  createdAt: string; // ISO
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingTo: {
    name: string;
    address: string;
    city: string;
    country: string;
    phone?: string;
  };
};

const LS_KEY = "rc_orders";

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(orders));
}

/** One-time cleanup: delete old demo orders like RC-1001, RC-1002… */
function purgeOldDemoOnce(orders: Order[]): Order[] {
  if (orders.length === 0) return orders;
  const allLookDemo = orders.every((o) => /^RC-100\d$/.test(o.id));
  if (allLookDemo) {
    saveOrders([]);
    return [];
  }
  return orders;
}

/* --------------------------------- Helpers -------------------------------- */

function statusBadge(s: OrderStatus) {
  const map: Record<
    OrderStatus,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
  > = {
    pending: { label: "Pending", variant: "secondary" },
    processing: { label: "Processing", variant: "outline" },
    shipped: { label: "Shipped", variant: "default" },
    delivered: { label: "Delivered", variant: "default" },
    cancelled: { label: "Cancelled", variant: "destructive" },
  };
  const cfg = map[s];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function formatRs(v: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
}

/* ---------------------------------- Page ---------------------------------- */

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<OrderStatus | "all">("all");

  React.useEffect(() => {
    const loaded = purgeOldDemoOnce(loadOrders());
    setOrders(loaded);
  }, []);

  const filtered = orders.filter((o) => {
    const matchQ =
      !q ||
      o.id.toLowerCase().includes(q.toLowerCase()) ||
      o.items.some((it) => it.title.toLowerCase().includes(q.toLowerCase()));
    const matchStatus = status === "all" ? true : o.status === status;
    return matchQ && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back to Account */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/account")} aria-label="Back to Account">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account
          </Button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-emerald-900">Your Orders</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/buy")}>
              <Package2 className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
            <Button onClick={() => navigate("/cart")}>
              <Truck className="mr-2 h-4 w-4" />
              View Cart
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="col-span-2">
                <div className="relative w-full">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/50" />
                  <Input
                    placeholder="Search by order ID or item…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table (no actions column, no 3-dots) */}
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead className="min-w-[140px]">Placed</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        No orders yet.{" "}
                        <Button variant="link" className="px-1" onClick={() => navigate("/buy")}>
                          Start shopping
                        </Button>
                        or{" "}
                        <Button variant="link" className="px-1" onClick={() => navigate("/account")}>
                          go back to account
                        </Button>
                        .
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((o) => (
                      <TableRow key={o.id} className="hover:bg-emerald-50/40">
                        <TableCell className="font-medium">{o.id}</TableCell>
                        <TableCell>{formatDate(o.createdAt)}</TableCell>
                        <TableCell className="max-w-[320px]">
                          <div className="truncate">
                            {o.items.map((it) => `${it.title} × ${it.qty}`).join(", ")}
                          </div>
                        </TableCell>
                        <TableCell>{statusBadge(o.status)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatRs(o.total)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersPage;
