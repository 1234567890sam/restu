import { createClient } from "@/lib/supabase/server";
import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { getCategories } from "@/app/actions/categories";
import { getMenuItems } from "@/app/actions/items";
import Link from "next/link";
import {
  UtensilsCrossed,
  FolderTree,
  QrCode,
  Sparkles,
  ExternalLink,
  Plus,
  ArrowUpRight,
  Store,
  CheckCircle2,
  Eye,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import { generateQRDataURL, getMenuUrl } from "@/lib/qr";
import { SeedMenuButton } from "./_components/seed-menu-button";

export default async function DashboardPage() {
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    return (
      <div className="text-center py-16">
        <Store className="w-12 h-12 mx-auto text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold">No Restaurant Found</h2>
        <p className="text-slate-500 mt-2">
          Please complete your profile or register your restaurant.
        </p>
        <Link href="/dashboard/profile" className="mt-4 inline-block">
          <Button variant="primary">Set Up Restaurant Profile</Button>
        </Link>
      </div>
    );
  }

  // Show pending approval state
  if ((restaurant as any).status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border-2 border-dashed border-amber-500/40 flex items-center justify-center mb-6 mx-auto animate-pulse">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Approval Pending
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-md text-sm leading-relaxed">
          Your restaurant <strong className="text-amber-600 dark:text-amber-400">{restaurant.name}</strong> is
          currently under review. Our team will verify and activate your
          account shortly.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-w-sm w-full">
          <div className="flex items-center gap-3 text-left w-full">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300">Account created successfully</span>
          </div>
          <div className="flex items-center gap-3 text-left w-full">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300">Restaurant profile submitted</span>
          </div>
          <div className="flex items-center gap-3 text-left w-full">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center shrink-0 animate-pulse">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Waiting for admin approval</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-6">
          This usually takes less than 24 hours. Contact support if you have questions.
        </p>
      </div>
    );
  }

  // Show suspended state
  if ((restaurant as any).status === "suspended") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-red-600 dark:text-red-400">
          Account Suspended
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-md text-sm">
          Your restaurant has been suspended by the platform administrator.
          Please contact support for more information.
        </p>
      </div>
    );
  }

  const [categories, items] = await Promise.all([
    getCategories(restaurant.id),
    getMenuItems(restaurant.id),
  ]);

  const activeItems = items.filter((i) => i.is_available);
  const vegItems = items.filter((i) => i.food_type === "veg");
  const nonVegItems = items.filter((i) => i.food_type === "non-veg");

  const publicMenuUrl = getMenuUrl(restaurant.slug);
  const qrDataUrl = await generateQRDataURL(publicMenuUrl, {
    width: 256,
    color: { dark: restaurant.theme_color || "#f59e0b", light: "#ffffff" },
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-600 via-amber-700 to-stone-900 p-6 sm:p-8 text-white shadow-xl shadow-amber-950/10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Menu is Live & Accessible</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-amber-100/80 text-sm max-w-xl">
              {restaurant.tagline || "Manage your digital dishes, categories, live pricing, and QR codes seamlessly."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/r/${restaurant.slug}`} target="_blank">
              <Button
                variant="secondary"
                size="md"
                className="bg-white text-slate-900 hover:bg-amber-50 font-semibold shadow-md"
              >
                <Eye className="w-4 h-4 mr-1.5" />
                View Customer Menu
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/dashboard/items/new">
              <Button
                variant="primary"
                size="md"
                className="bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold shadow-md"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add New Dish
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Start for Fresh / Empty Restaurants */}
      {items.length === 0 && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-dashed border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                Quick Start
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Your menu is currently empty
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Load our pre-configured Indian restaurant menu (Solapur specialties, tandoor starters, thalis, and beverages) in 1 click, or start adding categories from scratch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SeedMenuButton restaurantId={restaurant.id} />
            <Link href="/dashboard/categories">
              <Button variant="outline" size="md">
                <FolderTree className="w-4 h-4 mr-1.5" />
                Add Category
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Dishes
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{items.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              {activeItems.length} currently available
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Categories
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FolderTree className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{categories.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              Sections on your menu
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dietary Types
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="veg">{vegItems.length} Veg</Badge>
              <Badge variant="non-veg">{nonVegItems.length} Non-Veg</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Indian FSSAI dietary tags
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Template & Theme
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold capitalize">
              {restaurant.template || "Classic"}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full border border-black/20"
                style={{ backgroundColor: restaurant.theme_color || "#f59e0b" }}
              />
              <span className="text-xs font-mono text-slate-500 uppercase">
                {restaurant.theme_color || "#f59e0b"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: QR Quick Card + Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Quick Access Card */}
        <Card className="lg:col-span-1 border-amber-200/80 dark:border-amber-900/60 bg-linear-to-b from-amber-50/50 to-white dark:from-amber-950/10 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-600" />
              Table QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700">
              <img
                src={qrDataUrl}
                alt={`${restaurant.name} QR Code`}
                className="w-44 h-44 object-contain rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500">
                Direct customer menu link:
              </p>
              <p className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 break-all">
                {publicMenuUrl}
              </p>
            </div>

            <div className="flex gap-2 w-full pt-2">
              <Link href="/dashboard/qr" className="w-full">
                <Button variant="primary" size="sm" className="w-full">
                  Customize & Print QR
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Menu Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-amber-500" />
              Recent Dishes
            </CardTitle>
            <Link
              href="/dashboard/items"
              className="text-xs font-semibold text-amber-600 hover:text-amber-500 flex items-center gap-1"
            >
              View all ({items.length})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-10">
                <UtensilsCrossed className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No dishes added yet
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Start building your menu by adding your popular specialties, appetizers, and main courses.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <SeedMenuButton restaurantId={restaurant.id} size="sm" />
                  <Link href="/dashboard/items/new">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add Dish Manually
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                          <UtensilsCrossed className="w-5 h-5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.food_type === "veg"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          {item.badge && (
                            <Badge variant="brand" className="text-[10px] py-0 px-1.5 uppercase">
                              {item.badge.replace("_", " ")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {item.description || "No description provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          ₹{item.price}
                        </p>
                        {item.offer_price && (
                          <p className="text-xs text-slate-400 line-through">
                            ₹{item.offer_price}
                          </p>
                        )}
                      </div>

                      <Badge
                        variant={item.is_available ? "success" : "error"}
                        className="text-xs"
                      >
                        {item.is_available ? "In Stock" : "Sold Out"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
