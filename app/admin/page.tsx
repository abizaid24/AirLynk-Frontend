"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Loader2, Users, PlaneTakeoff, PackageOpen, Wallet, BellRing, Gauge } from "lucide-react";
import { adminService } from "@/services/admin.service";
import type { DashboardStats, OccupancyAnalytics, RevenueAnalytics } from "@/types/admin";
import { formatCurrency } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-client";
import { AdminGuard } from "@/components/admin/admin-guard";
import { TiltCard } from "@/components/ui/tilt-card";

import type { LucideIcon } from "lucide-react";

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <TiltCard className="rounded-2xl p-5" strength={8}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-chrome">
        <Icon className="size-3.5 text-aurora" />
        {label}
      </div>
      <p className="font-display mt-2 text-2xl text-pearl">{value}</p>
    </TiltCard>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [occupancy, setOccupancy] = useState<OccupancyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      adminService.dashboardStats(),
      adminService.revenueAnalytics(),
      adminService.occupancyAnalytics(),
    ])
      .then(([s, r, o]) => {
        setStats(s);
        setRevenue(r);
        setOccupancy(o);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminGuard>
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="size-6 animate-spin text-aurora" />
        </div>
      )}

      {!loading && error && (
        <div className="glass-panel rounded-2xl p-8 text-center text-chrome">{error}</div>
      )}

      {!loading && !error && stats && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <StatTile icon={Users} label="Users" value={stats.total_users.toLocaleString()} />
            <StatTile
              icon={PlaneTakeoff}
              label="Active flights"
              value={stats.total_flights.toLocaleString()}
            />
            <StatTile
              icon={PackageOpen}
              label="Total orders"
              value={stats.total_orders.toLocaleString()}
            />
            <StatTile
              icon={Gauge}
              label="Confirmed orders"
              value={stats.confirmed_orders.toLocaleString()}
            />
            <StatTile
              icon={Wallet}
              label="Revenue"
              value={formatCurrency(stats.total_revenue)}
            />
            <StatTile
              icon={BellRing}
              label="Active price alerts"
              value={stats.active_price_alerts.toLocaleString()}
            />
          </div>

          {revenue && revenue.by_date.length > 0 && (
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-lg text-pearl">Revenue over time</h2>
                <span className="text-sm text-chrome">
                  Avg order {formatCurrency(revenue.average_order_value, revenue.currency)}
                </span>
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenue.by_date}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8a5a12" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#8a5a12" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(153,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="date" stroke="#99a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#99a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#14161a",
                        border: "1px solid rgba(153,163,184,0.2)",
                        borderRadius: 12,
                        color: "#f6efe3",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8a5a12"
                      fill="url(#rev)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {revenue && revenue.by_date.length === 0 && (
            <div className="glass-panel rounded-2xl p-8 text-center text-sm text-chrome">
              No completed payments yet — revenue chart will populate once
              orders are paid.
            </div>
          )}

          {occupancy && occupancy.items.length > 0 && (
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-lg text-pearl">Seat occupancy by flight</h2>
                <span className="text-sm text-chrome">
                  Overall {occupancy.overall_occupancy_rate}%
                </span>
              </div>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancy.items.slice(0, 12)}>
                    <CartesianGrid stroke="rgba(153,163,184,0.12)" vertical={false} />
                    <XAxis
                      dataKey="route"
                      stroke="#99a3b8"
                      fontSize={11}
                      tickLine={false}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#99a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#14161a",
                        border: "1px solid rgba(153,163,184,0.2)",
                        borderRadius: 12,
                        color: "#f6efe3",
                      }}
                    />
                    <Bar dataKey="occupancy_rate" fill="#ab8757" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminGuard>
  );
}
