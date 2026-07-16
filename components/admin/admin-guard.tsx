"use client";

import Link from "next/link";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { AdminNav } from "./admin-nav";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <Loader2 className="mx-auto size-6 animate-spin text-aurora" />
        <p className="mt-4 text-sm text-chrome">Checking session…</p>
        <Link href="/login">
          <Button className="mt-6">Log in</Button>
        </Link>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <ShieldAlert className="mx-auto size-10 text-destructive" />
        <h1 className="font-display mt-4 text-2xl text-pearl">
          Admins only
        </h1>
        <p className="mt-2 text-sm text-chrome">
          Your account doesn't have admin access.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-6">
            Back to dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-0">
      <AdminNav />
      <div className="mt-8">{children}</div>
    </div>
  );
}
