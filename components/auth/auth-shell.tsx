import type { ReactNode } from "react";
import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-16">
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="group mb-8 flex items-center justify-center gap-2"
        >
          <span className="glow-sky size-2 rounded-full bg-aurora transition-transform duration-300 group-hover:scale-125" />
          <span className="font-display text-base tracking-[0.25em] text-pearl uppercase">
            AirLynk
          </span>
        </Link>

        <div className="gradient-border-glow rounded-3xl">
          <div className="glass-panel-elevated rounded-3xl p-8">
            <h1 className="font-display text-2xl text-pearl">{title}</h1>
            <p className="mt-1.5 text-sm text-chrome">{subtitle}</p>

            <div className="mt-7">{children}</div>
          </div>
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-chrome">{footer}</p>
        )}
      </div>
    </div>
  );
}
