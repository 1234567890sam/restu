import { getAllRestaurantsAdmin } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import Link from "next/link";
import { Store, CheckCircle, Clock, ShieldAlert, ArrowRight, ExternalLink } from "lucide-react";

export default async function AdminOverviewPage() {
  const restaurants = await getAllRestaurantsAdmin();

  const pendingCount = restaurants.filter(
    (r) => (r as any).status === "pending" || (!r.is_active && (r as any).status !== "suspended" && (r as any).status !== "rejected")
  ).length;
  const activeCount = restaurants.filter((r) => r.is_active).length;
  const proCount = restaurants.filter((r) => r.subscription_plan === "pro").length;
  const freeCount = restaurants.filter((r) => r.subscription_plan === "free").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          System Overview
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Digital QR Menu Multi-Tenant Platform Administration
        </p>
      </div>

      {/* Pending Approvals Notice Banner */}
      {pendingCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-300">
                {pendingCount} Restaurant Registration{pendingCount > 1 ? "s" : ""} Awaiting Approval
              </h3>
              <p className="text-xs text-amber-300/80 mt-0.5">
                New tenant signups are on hold until you approve them.
              </p>
            </div>
          </div>
          <Link
            href="/admin/restaurants"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
          >
            Review & Approve Now
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Tenants</span>
            <Store className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{restaurants.length}</div>
          <p className="text-xs text-slate-400">Registered restaurants</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{pendingCount}</div>
          <p className="text-xs text-slate-400">Needs review</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Active Menus</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{activeCount}</div>
          <p className="text-xs text-slate-400">Live for diners</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Pro Subscriptions</span>
            <span className="text-xs font-bold text-purple-400">PRO</span>
          </div>
          <div className="text-3xl font-black text-purple-400">{proCount}</div>
          <p className="text-xs text-slate-400">Paid tier restaurants</p>
        </div>
      </div>

      {/* Recent Restaurants */}
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700/80 overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-slate-700">
          <div>
            <h3 className="text-base font-bold text-white">Registered Restaurants</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest restaurants onboarded to the SaaS platform</p>
          </div>
          <Link
            href="/admin/restaurants"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Manage all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-700/60">
          {restaurants.slice(0, 8).map((rest) => (
            <div
              key={rest.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-amber-400 shrink-0">
                  {rest.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">
                      {rest.name}
                    </span>
                    {(rest as any).status === "pending" || (!rest.is_active && (rest as any).status !== "suspended") ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Pending
                      </span>
                    ) : (
                      <Badge
                        variant={rest.is_active ? "success" : "default"}
                        className="text-[10px]"
                      >
                        {rest.is_active ? "Active" : "Suspended"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {rest.city || "Solapur"} • slug: /r/{rest.slug}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge variant="brand" className="text-xs uppercase">
                  {rest.subscription_plan}
                </Badge>
                <Link
                  href={`/r/${rest.slug}`}
                  target="_blank"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  title="View live menu"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
