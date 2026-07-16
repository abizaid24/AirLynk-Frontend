"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, KeyRound, Lock } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: searchParams.get("email") ?? "",
    otp_code: "",
    new_password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.resetPassword(form);
      toast.success(res.message);
      router.push("/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Enter the OTP code from your email and choose a new password."
      footer={
        <>
          Didn&apos;t get a code?{" "}
          <Link href="/forgot-password" className="text-aurora hover:underline">
            Resend
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
              className="pl-10"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="otp">OTP code</Label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chrome-dim" />
            <Input
              id="otp"
              required
              className="pl-10 tracking-[0.3em]"
              value={form.otp_code}
              onChange={(e) => setForm({ ...form, otp_code: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="new_password">New password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chrome-dim" />
            <Input
              id="new_password"
              type="password"
              required
              minLength={8}
              className="pl-10"
              value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading && <Loader2 className="size-4 animate-spin" />}
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
