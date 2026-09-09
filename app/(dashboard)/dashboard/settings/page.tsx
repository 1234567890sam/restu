import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Globe, ShieldCheck, CreditCard, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/dashboard");
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/r/${restaurant.slug}`;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account & Menu Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your subscription, custom slug, and menu availability status.
        </p>
      </div>

      <div className="space-y-6">
        {/* URL Slug Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              Restaurant Slug & Permanent URL
            </CardTitle>
            <CardDescription>
              This is the unique web address where customers access your live QR menu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-800 dark:text-slate-200 truncate">
                {publicUrl}
              </div>
              <Link href={publicUrl} target="_blank">
                <Button variant="outline" size="sm">
                  Visit
                </Button>
              </Link>
            </div>
            <p className="text-xs text-slate-400">
              Unique identifier: <span className="font-mono font-semibold">{restaurant.slug}</span>
            </p>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="border-amber-200/60 dark:border-amber-900/40 bg-linear-to-r from-amber-50/30 to-white dark:from-amber-950/10 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-500" />
                Subscription Plan
              </CardTitle>
              <Badge variant="brand" className="uppercase font-bold text-xs">
                {restaurant.subscription_plan || "Standard"} Tier
              </Badge>
            </div>
            <CardDescription>
              Everything you need to run high-speed QR menus for your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <span className="text-xs text-slate-500">Monthly Scans</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Unlimited</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <span className="text-xs text-slate-500">Menu Items</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Unlimited</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <span className="text-xs text-slate-500">Status</span>
                <p className="text-lg font-bold text-emerald-600">Active</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Verified Account — Complete platform access enabled by administrator.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Localization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Currency</span>
              <span className="font-semibold">INR (₹) Indian Rupee</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Default Region</span>
              <span className="font-semibold">Solapur, Maharashtra, India</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Dietary System</span>
              <span className="font-semibold">FSSAI Green (Veg) & Red (Non-Veg)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
