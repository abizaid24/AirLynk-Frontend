"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, User } from "lucide-react";
import { authService } from "@/services/auth.service";
import type { UserUpdatePayload } from "@/types/user";
import { getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
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

const CURRENCIES = ["USD", "EUR", "GBP", "PKR", "AED"];

export default function ProfilePage() {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [form, setForm] = useState<UserUpdatePayload>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name,
        phone: user.phone ?? "",
        preferred_currency: user.preferred_currency,
        preferred_language: user.preferred_language,
        nationality: user.nationality ?? "",
        passport_number: user.passport_number ?? "",
        date_of_birth: user.date_of_birth ?? "",
      });
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-chrome">Log in to manage your profile.</p>
        <Link href="/login">
          <Button className="mt-6">Log in</Button>
        </Link>
      </div>
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await authService.updateMe(form);
      setUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-0">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-chrome hover:text-aurora"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <div className="glass-panel mt-6 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-aurora/12 text-aurora">
            <User className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-xl text-pearl">Profile settings</h1>
            <p className="text-xs text-chrome-dim">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              value={form.full_name ?? ""}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone ?? ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="currency">Preferred currency</Label>
            <Select
              value={form.preferred_currency ?? "USD"}
              onValueChange={(v) => setForm({ ...form, preferred_currency: v })}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="dob">Date of birth</Label>
            <Input
              id="dob"
              type="date"
              className="[color-scheme:dark]"
              value={form.date_of_birth?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              value={form.nationality ?? ""}
              onChange={(e) => setForm({ ...form, nationality: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="passport">Passport number</Label>
            <Input
              id="passport"
              value={form.passport_number ?? ""}
              onChange={(e) => setForm({ ...form, passport_number: e.target.value })}
            />
          </div>
        </div>

        <Button className="mt-6" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}
