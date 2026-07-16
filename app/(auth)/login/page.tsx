"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form);
      setSession(res.user, res.tokens.access_token, res.tokens.refresh_token);
      toast.success(`Welcome back, ${res.user.full_name.split(" ")[0]}`);
      router.push("/");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage bookings, seats, and your AI concierge."
      footer={
        <>
          New to AirLynk?{" "}
          <Link href="/register" className="text-aurora hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chrome-dim" />
            <Input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              className="pl-10"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-aurora hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chrome-dim" />
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              className="pl-10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading && <Loader2 className="size-4 animate-spin" />}
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}
