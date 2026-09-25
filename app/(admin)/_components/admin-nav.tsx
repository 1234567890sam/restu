"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Store,
  CreditCard,
  ArrowLeft,
} from "lucide-react";

const ADMIN_NAV = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Restaurants",
    href: "/admin/restaurants",
    icon: Store,
    exact: false,
  },
  {
    name: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
    exact: false,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {ADMIN_NAV.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            )}
          >
            <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-slate-950" : "text-slate-400")} />
            <span>{item.name}</span>
          </Link>
        );
      })}

      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-950/40 transition-colors pt-4 border-t border-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Owner Dashboard</span>
      </Link>
    </nav>
  );
}
