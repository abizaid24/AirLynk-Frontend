"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import type { OrderResponse } from "@/types/order";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-client";
import { AdminGuard } from "@/components/admin/admin-guard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["all", "draft", "pending_payment", "confirmed", "cancelled", "refunded", "completed"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminService
      .listOrders({ page: 1, page_size: 50, status: status === "all" ? undefined : status })
      .then((res) => setOrders(res.items))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <AdminGuard>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-chrome">Filter by status</span>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-aurora" />
          </div>
        )}

        {!loading && error && (
          <div className="glass-panel rounded-2xl p-8 text-center text-chrome">{error}</div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="glass-panel rounded-2xl p-10 text-center text-chrome">
            No orders found.
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="glass-panel overflow-hidden rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-chrome">
                  <th className="px-5 py-3 font-medium">Reference</th>
                  <th className="px-5 py-3 font-medium">Route</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const booking = o.bookings[0];
                  return (
                    <tr key={o.id} className="border-b border-border/60 last:border-0">
                      <td className="px-5 py-3">
                        <Link href={`/orders/${o.id}`} className="text-aurora hover:underline">
                          {o.order_reference}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-pearl">
                        {booking ? `${booking.origin_code} → ${booking.destination_code}` : "—"}
                      </td>
                      <td className="px-5 py-3 text-chrome">
                        {booking?.departure_time ? formatDate(booking.departure_time) : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full border border-aurora/30 bg-aurora/10 px-2.5 py-0.5 text-xs uppercase text-aurora">
                          {o.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-aurora">
                        {formatCurrency(o.total_amount, o.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
