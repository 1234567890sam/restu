"use client";

import { useState } from "react";
import type { Restaurant } from "@/lib/database.types";
import { switchAdminActiveRestaurant, clearAdminActiveRestaurant } from "@/app/actions/admin";
import { ShieldAlert, ArrowLeft, Store, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface AdminRestaurantSwitcherProps {
  currentRestaurantId: string;
  allRestaurants: Restaurant[];
}

export function AdminRestaurantSwitcher({
  currentRestaurantId,
  allRestaurants,
}: AdminRestaurantSwitcherProps) {
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(currentRestaurantId);

  const currentRest = allRestaurants.find((r) => r.id === currentRestaurantId);

  const handleSwitch = async (restaurantId: string) => {
    if (restaurantId === currentRestaurantId) return;
    setLoading(true);
    try {
      const res = await switchAdminActiveRestaurant(restaurantId);
      if (res.error) {
        toast.error(res.error);
      } else {
        setSelectedId(restaurantId);
        const target = allRestaurants.find((r) => r.id === restaurantId);
        toast.success(`Switched active restaurant to "${target?.name}"!`);
        window.location.reload();
      }
    } catch {
      toast.error("Failed to switch restaurant");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await clearAdminActiveRestaurant();
      toast.success("Reset to default restaurant.");
      window.location.reload();
    } catch {
      toast.error("Failed to reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl bg-linear-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 p-3.5 sm:p-4 text-white shadow-xl shadow-amber-500/5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left Badge & Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Super Admin Console Mode
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
              <span>Managing:</span>
              <strong className="text-white font-semibold">{currentRest?.name || "Selected Restaurant"}</strong>
              {currentRest?.slug && (
                <Link
                  href={`/r/${currentRest.slug}`}
                  target="_blank"
                  className="text-amber-400 hover:text-amber-300 ml-1 inline-flex items-center gap-0.5"
                  title="Open live customer menu"
                >
                  <span className="font-mono text-[11px]">(/r/{currentRest.slug})</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </p>
          </div>
        </div>

        {/* Right Switcher Dropdown & Nav Links */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <select
              value={selectedId}
              disabled={loading}
              onChange={(e) => handleSwitch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
            >
              {allRestaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.city || "Solapur"})
                </option>
              ))}
            </select>
            <Store className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          <Link
            href="/admin/restaurants"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span> Console
          </Link>
        </div>
      </div>
    </div>
  );
}
