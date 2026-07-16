"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { AIRPORTS } from "@/lib/airports";
import type { FlightListItem } from "@/types/flight";
import { FLIGHT_STATUS_OPTIONS } from "@/types/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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

function toLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function FlightFormDialog({
  open,
  onOpenChange,
  flight,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flight: FlightListItem | null;
  onSaved: () => void;
}) {
  const isEdit = !!flight;

  const [flightNumber, setFlightNumber] = useState(flight?.flight_number ?? "");
  const [origin, setOrigin] = useState(flight?.origin.iata_code ?? "");
  const [destination, setDestination] = useState(flight?.destination.iata_code ?? "");
  const [departure, setDeparture] = useState(toLocalInput(flight?.departure_time));
  const [arrival, setArrival] = useState(toLocalInput(flight?.arrival_time));
  const [basePrice, setBasePrice] = useState(flight?.base_price ?? "");
  const [aircraft, setAircraft] = useState(flight?.aircraft_type ?? "A320");
  const [status, setStatus] = useState(flight?.status ?? "scheduled");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit && flight) {
        await adminService.updateFlight(flight.id, {
          departure_time: new Date(departure).toISOString(),
          arrival_time: new Date(arrival).toISOString(),
          base_price: Number(basePrice),
          status,
          aircraft_type: aircraft,
        });
        toast.success("Flight updated");
      } else {
        await adminService.createFlight({
          flight_number: flightNumber,
          origin_iata: origin,
          destination_iata: destination,
          departure_time: new Date(departure).toISOString(),
          arrival_time: new Date(arrival).toISOString(),
          base_price: Number(basePrice),
          aircraft_type: aircraft,
          generate_seats: true,
        });
        toast.success("Flight created");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit flight" : "Create flight"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Updating ${flight?.flight_number}`
              : "Adds a new scheduled flight with a generated seat map."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Flight number</Label>
                <Input
                  required
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                  placeholder="AL204"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Aircraft type</Label>
                <Input value={aircraft} onChange={(e) => setAircraft(e.target.value)} />
              </div>
            </div>
          )}

          {!isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Origin</Label>
                <Select value={origin} onValueChange={setOrigin} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {AIRPORTS.map((a) => (
                      <SelectItem key={a.iata} value={a.iata}>
                        {a.iata} — {a.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Destination</Label>
                <Select value={destination} onValueChange={setDestination} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {AIRPORTS.map((a) => (
                      <SelectItem key={a.iata} value={a.iata}>
                        {a.iata} — {a.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Departure</Label>
              <Input
                type="datetime-local"
                required
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Arrival</Label>
              <Input
                type="datetime-local"
                required
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Base price (USD)</Label>
              <Input
                type="number"
                min={1}
                step="0.01"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
            </div>
            {isEdit && (
              <div className="flex flex-col gap-1.5">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FLIGHT_STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create flight"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
