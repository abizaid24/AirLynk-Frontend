"use client";

import { useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react";
import { flightsService } from "@/services/flights.service";
import { adminService } from "@/services/admin.service";
import type { FlightListItem } from "@/types/flight";
import { AIRPORTS } from "@/lib/airports";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-client";
import { AdminGuard } from "@/components/admin/admin-guard";
import { FlightFormDialog } from "@/components/admin/flight-form-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminFlightsPage() {
  const [origin, setOrigin] = useState("LHE");
  const [destination, setDestination] = useState("DXB");
  const [flights, setFlights] = useState<FlightListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<FlightListItem | null>(null);

  async function runSearch() {
    if (origin === destination) {
      toast.error("Origin and destination must differ");
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await flightsService.search({
        origin,
        destination,
        page_size: 50,
      });
      setFlights(res.items);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(flight: FlightListItem) {
    if (!confirm(`Deactivate flight ${flight.flight_number}?`)) return;
    try {
      await adminService.deleteFlight(flight.id);
      toast.success("Flight deactivated");
      setFlights((prev) => prev.filter((f) => f.id !== flight.id));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <AdminGuard>
      <div className="flex flex-col gap-6">
        <div className="glass-panel flex flex-wrap items-end gap-3 rounded-2xl p-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wider text-chrome">Origin</span>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {AIRPORTS.map((a) => (
                  <SelectItem key={a.iata} value={a.iata}>{a.iata} — {a.city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wider text-chrome">Destination</span>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {AIRPORTS.map((a) => (
                  <SelectItem key={a.iata} value={a.iata}>{a.iata} — {a.city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={runSearch} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Search route
          </Button>
          <Button
            variant="secondary"
            className="ml-auto"
            onClick={() => {
              setEditingFlight(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="size-4" /> New flight
          </Button>
        </div>

        <p className="text-xs text-chrome-dim">
          Flights are managed per-route since the backend only exposes
          route-based search (no "list all flights" endpoint) — pick an
          origin/destination above to find flights to edit or deactivate.
        </p>

        {searched && !loading && flights.length === 0 && (
          <div className="glass-panel rounded-2xl p-10 text-center text-chrome">
            No flights found on this route.
          </div>
        )}

        {flights.length > 0 && (
          <div className="glass-panel overflow-hidden rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-chrome">
                  <th className="px-5 py-3 font-medium">Flight</th>
                  <th className="px-5 py-3 font-medium">Departs</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">From</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {flights.map((f) => (
                  <tr key={f.id} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-3 text-pearl">{f.flight_number}</td>
                    <td className="px-5 py-3 text-chrome">
                      {formatDate(f.departure_time)} · {formatTime(f.departure_time)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full border border-aurora/30 bg-aurora/10 px-2.5 py-0.5 text-xs uppercase text-aurora">
                        {f.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-aurora">
                      {formatCurrency(f.lowest_price ?? f.base_price, f.currency)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingFlight(f);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(f)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FlightFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        flight={editingFlight}
        onSaved={runSearch}
      />
    </AdminGuard>
  );
}
