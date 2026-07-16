"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword({ email });
      toast.success(res.message);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll send a one-time code to your email if an account exists."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-aurora hover:underline">
            Back to log in
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading && <Loader2 className="size-4 animate-spin" />}
          Send reset code
        </Button>
      </form>
    </AuthShell>
  );
}
