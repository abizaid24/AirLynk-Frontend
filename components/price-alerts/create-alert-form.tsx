"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { priceAlertsService } from "@/services/price-alerts.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { AIRPORTS } from "@/lib/airports";
import { FLIGHT_CLASSES } from "@/types/flight";
import type { PriceAlertResponse } from "@/types/price-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function CreateAlertForm({
  onCreated,
}: {
  onCreated: (alert: PriceAlertResponse) => void;
}) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [classType, setClassType] = useState<string>("any");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!origin || !destination || !targetPrice) {
      toast.error("Fill in origin, destination, and target price");
      return;
    }
    setSubmitting(true);
    try {
      const alert = await priceAlertsService.create({
        origin_code: origin,
        destination_code: destination,
        target_price: parseFloat(targetPrice),
        class_type: classType === "any" ? null : classType,
        currency: "USD",
      });
      onCreated(alert);
      setOrigin("");
      setDestination("");
      setTargetPrice("");
      setClassType("any");
      toast.success("Price alert created");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel grid grid-cols-1 gap-4 rounded-2xl p-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="alert-origin">From</Label>
        <Select value={origin} onValueChange={setOrigin}>
          <SelectTrigger id="alert-origin">
            <SelectValue placeholder="Origin" />
          </SelectTrigger>
          <SelectContent>
            {AIRPORTS.map((a) => (
              <SelectItem key={a.iata} value={a.iata}>
                {a.city} ({a.iata})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="alert-destination">To</Label>
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger id="alert-destination">
            <SelectValue placeholder="Destination" />
          </SelectTrigger>
          <SelectContent>
            {AIRPORTS.map((a) => (
              <SelectItem key={a.iata} value={a.iata}>
                {a.city} ({a.iata})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="alert-price">Target price (USD)</Label>
        <Input
          id="alert-price"
          type="number"
          min={1}
          placeholder="e.g. 350"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="alert-class">Class</Label>
        <Select value={classType} onValueChange={setClassType}>
          <SelectTrigger id="alert-class">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any class</SelectItem>
            {FLIGHT_CLASSES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="sm:col-span-2 lg:col-span-4" disabled={submitting}>
        {submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
        Create price alert
      </Button>
    </form>
  );
}
