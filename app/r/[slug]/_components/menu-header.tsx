import type { Restaurant } from "@/lib/database.types";
import { MapPin, Phone, Clock, Share2, Wifi } from "lucide-react";

interface MenuHeaderProps {
  restaurant: Restaurant;
  tableNumber?: string | null;
  themeColor?: string;
  template?: string;
  onShare?: () => void;
}

export function MenuHeader({
  restaurant,
  tableNumber,
  themeColor: propThemeColor,
  template,
  onShare,
}: MenuHeaderProps) {
  const themeColor = propThemeColor || restaurant.theme_color || "#f59e0b";
  const isDark = template === "modern";

  const openingHoursString =
    typeof restaurant.opening_hours === "string"
      ? restaurant.opening_hours
      : restaurant.opening_hours
      ? JSON.stringify(restaurant.opening_hours)
      : null;

  return (
    <header
      className={`relative border-b ${
        isDark
          ? "bg-slate-900 border-slate-800"
          : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"
      }`}
    >
      {/* Cover Banner */}
      <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-slate-900">
        {restaurant.cover_image_url ||
        restaurant.banner_url ||
        restaurant.cover_url ? (
          <img
            src={
              restaurant.cover_image_url ||
              restaurant.banner_url ||
              restaurant.cover_url ||
              ""
            }
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${themeColor} 0%, #1e293b 100%)`,
            }}
          >
            {/* Decorative pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Top-right actions */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Table Number Pill */}
          {tableNumber && (
            <div className="px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white font-bold text-xs shadow-lg flex items-center gap-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Table #{tableNumber}</span>
            </div>
          )}

          {/* Share button */}
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20 text-slate-700 dark:text-white hover:bg-white transition-colors cursor-pointer"
              title="Share menu"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Restaurant Info Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-5 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
          {/* Logo & Name */}
          <div className="flex items-end gap-4">
            {/* Logo */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 shadow-xl shrink-0 overflow-hidden border-2 ${
                isDark
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white dark:bg-slate-800 border-white dark:border-slate-800"
              }`}
            >
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div
                  className="w-full h-full rounded-xl flex items-center justify-center text-white font-black text-2xl"
                  style={{ backgroundColor: themeColor }}
                >
                  {restaurant.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name + tagline */}
            <div className="space-y-1 mb-1">
              <h1
                className={`text-xl sm:text-2xl font-black tracking-tight ${
                  isDark ? "text-white" : "text-slate-900 dark:text-white"
                }`}
              >
                {restaurant.name}
              </h1>
              {restaurant.tagline && (
                <p
                  className={`text-xs sm:text-sm font-medium line-clamp-1 ${
                    isDark ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {restaurant.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Phone / Call Waiter */}
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all shrink-0"
              style={{ backgroundColor: themeColor }}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Waiter</span>
            </a>
          )}
        </div>

        {/* Info Strip */}
        {((restaurant.address || restaurant.city) || openingHoursString) && (
          <div
            className={`flex flex-wrap items-center gap-y-2 gap-x-5 text-xs pt-3 border-t ${
              isDark
                ? "border-slate-800 text-slate-500"
                : "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400"
            }`}
          >
            {(restaurant.address || restaurant.city) && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {[restaurant.address, restaurant.city]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
            {openingHoursString && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{openingHoursString}</span>
              </div>
            )}
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Live Menu
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
