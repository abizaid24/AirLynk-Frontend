"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useConciergeStore } from "@/store/concierge-store";
import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/lib/token-storage";
import { toast } from "sonner";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/#globe", label: "Explore" },
  { href: "/orders", label: "Bookings" },
  { href: "/price-alerts", label: "Price Alerts" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, clearSession } = useAuthStore();
  const setConciergeOpen = useConciergeStore((s) => s.setOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  async function handleLogout() {
    const refresh = tokenStorage.getRefreshToken();
    try {
      if (refresh) await authService.logout({ refresh_token: refresh });
    } catch {
      // token may already be invalid — clear locally regardless
    } finally {
      clearSession();
      toast.success("Logged out successfully");
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-panel border-b" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="group flex items-center gap-2.5">
          <img
            src="/images/airlynk-icon.png"
            alt="AirLynk"
            className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-display text-lg tracking-[0.25em] text-pearl uppercase">
            AirLynk
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-chrome transition-colors hover:text-aurora"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setConciergeOpen(true)} aria-label="Open AI Concierge">
            <Headset className="size-4 text-aurora" />
          </Button>
          <NotificationBell />
          {isAuthenticated && user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  {user.full_name.split(" ")[0]}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="text-pearl md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="glass-panel border-t px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-chrome">
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-chrome-dim">
                Day / Night
              </span>
              <ThemeToggle />
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={() => setConciergeOpen(true)}>
                <Headset className="size-4 text-aurora" /> AI Concierge
              </Button>
              {isAuthenticated && user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="w-full">
                      {user.full_name.split(" ")[0]}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="w-full">
                      Get started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
