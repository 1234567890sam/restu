"use client";

import type { MenuItem } from "@/lib/database.types";
import { Clock, Flame, Star, ChefHat, Zap, Tag } from "lucide-react";

interface FoodCardProps {
  item: MenuItem;
  themeColor: string;
  secondaryColor?: string;
  fontFamily?: string;
  template?: "classic" | "modern" | "compact" | string;
  onImageClick?: (url: string, title: string) => void;
}

// Authentic Indian Veg / Non-Veg FSSAI Icon
export function FssaiIndicator({ type }: { type: string }) {
  if (type === "veg") {
    return (
      <div
        className="w-4 h-4 rounded-sm border-2 border-emerald-600 flex items-center justify-center p-0.5 shrink-0 bg-white"
        title="Pure Vegetarian"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-600" />
      </div>
    );
  }

  if (type === "non-veg") {
    return (
      <div
        className="w-4 h-4 rounded-sm border-2 border-red-600 flex items-center justify-center p-0.5 shrink-0 bg-white"
        title="Non-Vegetarian"
      >
        <div className="w-2 h-2 rounded-full bg-red-600" />
      </div>
    );
  }

  if (type === "egg") {
    return (
      <div
        className="w-4 h-4 rounded-sm border-2 border-amber-600 flex items-center justify-center p-0.5 shrink-0 bg-white"
        title="Contains Egg"
      >
        <div className="w-2 h-2 rounded-full bg-amber-600" />
      </div>
    );
  }

  return (
    <div
      className="w-4 h-4 rounded-sm border-2 border-green-600 flex items-center justify-center p-0.5 shrink-0 bg-white"
      title="Vegan"
    >
      <div className="w-2 h-2 rounded-full bg-green-600" />
    </div>
  );
}

function BadgeChip({
  badge,
  themeColor,
}: {
  badge: string;
  themeColor: string;
}) {
  const badgeLabel = badge.replace(/_/g, " ");
  const isBestseller = badge === "bestseller";
  const isNew = badge === "new";
  const isChef = badge === "chefs_special";

  if (isBestseller)
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-amber-500 text-white shadow-sm">
        <Star className="w-2.5 h-2.5 fill-white" />
        Best
      </span>
    );
  if (isChef)
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-violet-600 text-white shadow-sm">
        <ChefHat className="w-2.5 h-2.5" />
        Chef's
      </span>
    );
  if (isNew)
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-emerald-500 text-white shadow-sm">
        <Zap className="w-2.5 h-2.5" />
        New
      </span>
    );

  return (
    <span
      className="inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide text-white shadow-sm"
      style={{ backgroundColor: themeColor }}
    >
      {badgeLabel}
    </span>
  );
}

function DiscountBadge({
  price,
  offerPrice,
}: {
  price: number;
  offerPrice: number;
}) {
  const discount = Math.round(((offerPrice - price) / offerPrice) * 100);
  if (discount <= 0) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
      <Tag className="w-2.5 h-2.5" />
      {discount}% OFF
    </span>
  );
}

export function FoodCard({
  item,
  themeColor,
  secondaryColor,
  template = "classic",
  onImageClick,
}: FoodCardProps) {
  const isOutOfStock = !item.is_available;
  const hasDiscount = item.offer_price && item.offer_price > item.price;

  // ────────────────────────────────────────────────────────────────────────────
  // COMPACT TEMPLATE — ultra-slim row style
  // ────────────────────────────────────────────────────────────────────────────
  if (template === "compact") {
    return (
      <div
        className={`group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-all ${
          isOutOfStock
            ? "opacity-55 border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900"
            : "border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm cursor-pointer"
        }`}
      >
        {/* Left: Veg + Name + desc */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <FssaiIndicator type={item.food_type} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {item.name}
              </span>
              {item.badge && (
                <BadgeChip badge={item.badge} themeColor={themeColor} />
              )}
              {item.spice_level && item.spice_level !== "mild" && (
                <span className="inline-flex items-center text-[10px] text-red-500 font-medium">
                  <Flame className="w-3 h-3" />
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-xs">
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Price */}
        <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
          {isOutOfStock ? (
            <span className="text-xs font-bold text-red-500 uppercase tracking-wide">
              Sold Out
            </span>
          ) : (
            <>
              <span
                className="text-sm font-black tracking-tight"
                style={{ color: themeColor }}
              >
                ₹{item.price}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-slate-400 line-through">
                  ₹{item.offer_price}
                </span>
              )}
            </>
          )}
        </div>

        {/* Thumbnail */}
        {item.image_url && (
          <div
            className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 cursor-pointer"
            onClick={() => onImageClick?.(item.image_url!, item.name)}
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // MODERN TEMPLATE — dark glassmorphism, full-bleed image top
  // ────────────────────────────────────────────────────────────────────────────
  if (template === "modern") {
    return (
      <div
        className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
          isOutOfStock
            ? "opacity-55 border-slate-700/40"
            : "border-slate-700/60 hover:border-slate-500 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
        }`}
        style={{
          background: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Full-bleed top image */}
        {item.image_url ? (
          <div
            className="relative h-40 w-full overflow-hidden bg-slate-800 cursor-pointer"
            onClick={() => onImageClick?.(item.image_url!, item.name)}
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
            {/* Badges on image */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {item.badge && (
                <BadgeChip badge={item.badge} themeColor={themeColor} />
              )}
            </div>
            {isOutOfStock && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
                <span className="text-xs font-black text-white uppercase bg-red-600 px-3 py-1 rounded-full tracking-widest">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            className="h-2 w-full"
            style={{ backgroundColor: themeColor, opacity: 0.6 }}
          />
        )}

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <FssaiIndicator type={item.food_type} />
                {!item.image_url && item.badge && (
                  <BadgeChip badge={item.badge} themeColor={themeColor} />
                )}
                {item.spice_level && item.spice_level !== "mild" && (
                  <span className="inline-flex items-center text-[10px] text-red-400 font-semibold gap-0.5">
                    <Flame className="w-3 h-3 text-red-400" />
                    {item.spice_level === "extra_spicy" ? "Extra Hot" : "Spicy"}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                {item.name}
              </h3>
            </div>
          </div>

          {item.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-400">
            {item.preparation_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{item.preparation_time}</span>
              </div>
            )}
            {item.calories && (
              <span className="flex items-center gap-0.5 text-amber-400/90 font-medium">
                🔥 {item.calories} kcal
              </span>
            )}
          </div>

          {item.allergens && item.allergens.length > 0 && (
            <p className="text-[10px] text-amber-400/80 bg-amber-950/40 border border-amber-800/30 px-2 py-0.5 rounded-md inline-block">
              Contains: {item.allergens.join(", ")}
            </p>
          )}

          {/* Price Row */}
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span
                className="text-xl font-black tracking-tight"
                style={{ color: themeColor }}
              >
                ₹{item.price}
              </span>
              {hasDiscount && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 line-through">
                    ₹{item.offer_price}
                  </span>
                  <DiscountBadge
                    price={item.price}
                    offerPrice={item.offer_price!}
                  />
                </div>
              )}
            </div>
            {isOutOfStock && (
              <span className="text-xs font-bold text-red-400 bg-red-950/40 border border-red-800/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // CLASSIC TEMPLATE (default) — warm card, image right, premium typography
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`group relative rounded-2xl border bg-white dark:bg-slate-900 p-4 shadow-sm transition-all duration-200 flex flex-col justify-between ${
        isOutOfStock
          ? "opacity-60 border-slate-200/60 dark:border-slate-800/50"
          : "border-slate-200/70 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      }`}
    >
      {/* Top: Main content */}
      <div className="flex gap-4">
        {/* Left / Info */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <FssaiIndicator type={item.food_type} />
            {item.badge && (
              <BadgeChip badge={item.badge} themeColor={themeColor} />
            )}
            {hasDiscount && (
              <DiscountBadge
                price={item.price}
                offerPrice={item.offer_price!}
              />
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            {item.name}
          </h3>

          {item.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-3 pt-0.5 flex-wrap">
            {item.spice_level && item.spice_level !== "mild" && (
              <span className="inline-flex items-center text-[11px] text-red-500 font-medium gap-0.5">
                <Flame className="w-3 h-3 text-red-500" />
                {item.spice_level === "extra_spicy" ? "Extra Spicy" : "Spicy"}
              </span>
            )}
            {item.preparation_time && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{item.preparation_time}</span>
              </div>
            )}
            {item.calories && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                🔥 {item.calories} kcal
              </span>
            )}
          </div>
          {item.allergens && item.allergens.length > 0 && (
            <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/40 px-1.5 py-0.5 rounded inline-block mt-1">
              Contains: {item.allergens.join(", ")}
            </span>
          )}
        </div>

        {/* Right / Photo */}
        {item.image_url && (
          <div
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 cursor-pointer"
            onClick={() => onImageClick?.(item.image_url!, item.name)}
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
              loading="lazy"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white uppercase bg-red-600 px-1.5 py-0.5 rounded">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer: Price */}
      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className="text-lg font-black tracking-tight"
            style={{ color: themeColor }}
          >
            ₹{item.price}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              ₹{item.offer_price}
            </span>
          )}
        </div>

        {isOutOfStock ? (
          <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full">
            Unavailable
          </span>
        ) : (
          <span className="text-[11px] font-medium text-slate-400">
            Freshly Made
          </span>
        )}
      </div>
    </div>
  );
}
