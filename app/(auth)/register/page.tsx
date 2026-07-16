"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      toast.success(res.message);
      if (res.debug_otp) {
        toast.message(`Demo OTP: ${res.debug_otp}`, {
          description: "Shown only because the backend is in debug mode.",
          duration: 10000,
        });
      }
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Book faster, earn loyalty points, and unlock the AI concierge."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-aurora hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="full_name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chrome-dim" />
            <Input
              id="full_name"
              required
              minLength={2}
              placeholder="Aiman Khan"
              className="pl-10"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </div>
        </div>

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
          <Label htmlFor="phone">Phone (optional)</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chrome-dim" />
            <Input
              id="phone"
              placeholder="+92 300 1234567"
              className="pl-10"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chrome-dim" />
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters, 1 letter & 1 number"
              className="pl-10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading && <Loader2 className="size-4 animate-spin" />}
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
