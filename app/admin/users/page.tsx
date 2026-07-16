"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, UserX, UserCheck } from "lucide-react";
import { adminService } from "@/services/admin.service";
import type { UserResponse } from "@/types/user";
import { formatDate } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-client";
import { AdminGuard } from "@/components/admin/admin-guard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load(query?: string) {
    setLoading(true);
    adminService
      .listUsers({ page: 1, page_size: 50, q: query || undefined })
      .then((res) => setUsers(res.items))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStatus(user: UserResponse) {
    try {
      const updated = await adminService.setUserStatus(user.id, {
        is_active: !user.is_active,
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(updated.is_active ? "User reactivated" : "User deactivated");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <AdminGuard>
      <div className="flex flex-col gap-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(q);
          }}
          className="flex max-w-sm gap-2"
        >
          <Input
            placeholder="Search name or email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button type="submit" size="icon" variant="outline">
            <Search className="size-4" />
          </Button>
        </form>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-aurora" />
          </div>
        )}

        {!loading && error && (
          <div className="glass-panel rounded-2xl p-8 text-center text-chrome">{error}</div>
        )}

        {!loading && !error && (
          <div className="glass-panel overflow-hidden rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-chrome">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Tier</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-3 text-pearl">{u.full_name}</td>
                    <td className="px-5 py-3 text-chrome">{u.email}</td>
                    <td className="px-5 py-3 text-lavender">{u.loyalty_tier}</td>
                    <td className="px-5 py-3 text-chrome">{formatDate(u.created_at)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs uppercase ${
                          u.is_active
                            ? "border-aurora/30 bg-aurora/10 text-aurora"
                            : "border-destructive/30 bg-destructive/10 text-destructive"
                        }`}
                      >
                        {u.is_active ? "active" : "suspended"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button size="icon" variant="ghost" onClick={() => toggleStatus(u)}>
                        {u.is_active ? (
                          <UserX className="size-4 text-destructive" />
                        ) : (
                          <UserCheck className="size-4 text-aurora" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
