"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, BellRing } from "lucide-react";
import { priceAlertsService } from "@/services/price-alerts.service";
import type { PriceAlertResponse } from "@/types/price-alert";
import { getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { CreateAlertForm } from "@/components/price-alerts/create-alert-form";
import { PriceAlertCard } from "@/components/price-alerts/price-alert-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PriceAlertsPage() {
  const { isAuthenticated } = useAuthStore();
  const [alerts, setAlerts] = useState<PriceAlertResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    priceAlertsService
      .list()
      .then((res) => setAlerts(res.items))
      .catch((err) => toast.error(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await priceAlertsService.remove(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast.success("Alert removed");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <BellRing className="mx-auto size-10 text-chrome-dim" />
        <h1 className="font-display mt-4 text-2xl text-pearl">
          Log in to set price alerts
        </h1>
        <p className="mt-2 text-sm text-chrome">
          Watch a route and we'll flag it when the fare drops to your target.
        </p>
        <Link href="/login">
          <Button className="mt-6">Log in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-0">
      <span className="text-xs uppercase tracking-[0.3em] text-lavender">Watchlist</span>
      <h1 className="font-display mt-2 text-3xl text-pearl sm:text-4xl">Price alerts</h1>
      <p className="mt-1 text-sm text-chrome">
        Track a route and target price — see the lowest fare seen since you started watching.
      </p>

      <div className="mt-8">
        <CreateAlertForm onCreated={(a) => setAlerts((prev) => [a, ...prev])} />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-aurora" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center text-sm text-chrome">
            No price alerts yet — create one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <PriceAlertCard
                  alert={alert}
                  onDelete={() => handleDelete(alert.id)}
                  deleting={deletingId === alert.id}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
