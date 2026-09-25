"use client";

import { useState } from "react";
import type { Restaurant } from "@/lib/database.types";
import { toggleRestaurantActive } from "@/app/actions/restaurant";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Switch } from "@/app/_components/ui/switch";
import { SeedMenuButton } from "@/app/(dashboard)/dashboard/_components/seed-menu-button";
import {
  Globe,
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  ExternalLink,
  Power,
  RotateCcw,
  Clock,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SettingsClientProps {
  restaurant: Restaurant;
  publicUrl: string;
}

export function SettingsClient({ restaurant, publicUrl }: SettingsClientProps) {
  const [isActive, setIsActive] = useState<boolean>(restaurant.is_active ?? true);
  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggle = async () => {
    const nextState = !isActive;
    setIsToggling(true);
    const res = await toggleRestaurantActive(restaurant.id, nextState);
    setIsToggling(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      setIsActive(nextState);
      toast.success(res.success || "Menu status updated!");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Menu URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isPending = (restaurant as any).status === "pending";
  const isSuspended = (restaurant as any).status === "suspended";

  return (
    <div className="space-y-6">
      {/* Menu Status Control Card */}
      <Card className="border-amber-200/80 dark:border-amber-900/60 bg-linear-to-r from-amber-50/40 via-white to-amber-50/20 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Power className="w-4 h-4 text-amber-500" />
              Menu Live Status
            </CardTitle>
            <Badge
              variant={
                isSuspended
                  ? "error"
                  : isPending
                  ? "warning"
                  : isActive
                  ? "success"
                  : "default"
              }
              className="text-xs uppercase font-bold"
            >
              {isSuspended
                ? "Suspended"
                : isPending
                ? "Pending Approval"
                : isActive
                ? "Live for Customers"
                : "Menu Paused"}
            </Badge>
          </div>
          <CardDescription>
            Temporarily pause your online digital menu during kitchen maintenance or private events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="space-y-0.5 pr-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {isActive ? "Digital Menu is Live" : "Digital Menu is Paused"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isActive
                  ? "Diners scanning table QR codes can immediately view your dishes and pricing."
                  : "Scanning the QR code shows a friendly temporary maintenance notice."}
              </p>
            </div>
            <Switch
              checked={isActive}
              disabled={isToggling || isSuspended}
              onChange={handleToggle}
            />
          </div>
        </CardContent>
      </Card>

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
            <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
              {publicUrl}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyUrl}
              title="Copy URL"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Link href={publicUrl} target="_blank">
              <Button variant="primary" size="sm">
                <span>Visit</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-slate-400">
            Unique slug identifier:{" "}
            <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">
              {restaurant.slug}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              Subscription Tier
            </CardTitle>
            <Badge variant="brand" className="uppercase font-bold text-xs">
              {restaurant.subscription_plan || "Pro"} Tier
            </Badge>
          </div>
          <CardDescription>
            Monetization status and hospitality service limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs text-slate-500">Monthly Scans</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white">Unlimited</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs text-slate-500">Menu Items</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white">Unlimited</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs text-slate-500">Account Status</span>
              <p
                className={`text-lg font-bold ${
                  isSuspended
                    ? "text-red-500"
                    : isPending
                    ? "text-amber-500"
                    : "text-emerald-600"
                }`}
              >
                {isSuspended ? "Suspended" : isPending ? "In Review" : "Active"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isPending
                ? "Your restaurant is currently in the fast-track review queue. You have full dashboard access."
                : "Full platform features enabled with priority Indian customer support."}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Localization Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Localization & Regional Standards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Currency</span>
            <span className="font-semibold">INR (₹) Indian Rupee</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Default Region</span>
            <span className="font-semibold">Solapur, Maharashtra, India</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Dietary Certification</span>
            <span className="font-semibold">FSSAI Green (Pure Veg) & Red (Non-Veg)</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Menu Actions / Reset */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Quick Data Helper
          </CardTitle>
          <CardDescription>
            Need pre-filled items for Solapur specialties, tandoor starters, and beverages?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500 max-w-md">
            Clicking this will populate 5 categories and 10 popular dishes into your menu without overwriting existing unique items.
          </p>
          <SeedMenuButton restaurantId={restaurant.id} />
        </CardContent>
      </Card>
    </div>
  );
}
