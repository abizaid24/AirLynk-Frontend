"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlaneTakeoff, PackageOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/flights", label: "Flights", icon: PlaneTakeoff },
  { href: "/admin/orders", label: "Orders", icon: PackageOpen },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div>
      <span className="text-xs uppercase tracking-[0.3em] text-aurora">
        Admin
      </span>
      <h1 className="font-display mt-2 text-3xl text-pearl sm:text-4xl">
        Control center
      </h1>

      <nav className="glass-panel mt-6 flex w-fit flex-wrap gap-1 rounded-full p-1.5">
        {TABS.map((tab) => {
          const active =
            tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all duration-300",
                active
                  ? "glow-sky bg-aurora text-ink-fixed"
                  : "text-chrome hover:text-pearl"
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
