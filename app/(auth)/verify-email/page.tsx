"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, KeyRound } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { toast } from "sonner";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.verifyEmail({ email, otp_code: otp });
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
      title="Verify your email"
      subtitle="Enter the OTP code we sent to your inbox to activate your account."
      footer={
        <>
          Wrong email?{" "}
          <Link href="/register" className="text-aurora hover:underline">
            Go back
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              minLength={4}
              placeholder="6-digit code"
              className="pl-10 tracking-[0.3em]"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading && <Loader2 className="size-4 animate-spin" />}
          Verify email
        </Button>
      </form>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
