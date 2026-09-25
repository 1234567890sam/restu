"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import type { Restaurant, Category, MenuItem } from "@/lib/database.types";
import { MenuHeader } from "./menu-header";
import { FoodCard, FssaiIndicator } from "./food-card";
import { Dialog } from "@/app/_components/ui/dialog";
import {
  Search,
  UtensilsCrossed,
  X,
  QrCode,
  LayoutGrid,
  LayoutList,
  Share2,
  ChevronUp,
} from "lucide-react";

interface CategoryWithItems extends Category {
  items: MenuItem[];
}

interface PublicMenuClientProps {
  restaurant: Restaurant;
  categories: CategoryWithItems[];
  tableNumber?: string | null;
}

export function PublicMenuClient({
  restaurant,
  categories,
  tableNumber,
}: PublicMenuClientProps) {
  const [search, setSearch] = useState("");
  const [dietary, setDietary] = useState<"all" | "veg" | "non-veg">("all");
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id || ""
  );
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [gridMode, setGridMode] = useState<"grid" | "list">("grid");
  const [shareToast, setShareToast] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const themeColor = restaurant.theme_color || "#f59e0b";
  const template = (restaurant.template as string) || "classic";
  const fontFamily = restaurant.font_family || "Inter";

  // Font mapping
  const fontMap: Record<string, string> = {
    Inter: "'Inter', sans-serif",
    Poppins: "'Poppins', sans-serif",
    "Playfair Display": "'Playfair Display', serif",
    "Roboto Slab": "'Roboto Slab', serif",
  };
  const appliedFont = fontMap[fontFamily] || fontMap["Inter"];

  // Filtered categories with filtered items
  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) => {
          const matchSearch =
            search === "" ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description?.toLowerCase().includes(search.toLowerCase());

          const matchDietary =
            dietary === "all" ||
            (dietary === "veg" &&
              (item.food_type === "veg" || item.food_type === "vegan")) ||
            (dietary === "non-veg" &&
              (item.food_type === "non-veg" || item.food_type === "egg"));

          return matchSearch && matchDietary;
        });
        return { ...cat, items: filteredItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, search, dietary]);

  const totalFilteredDishes = filteredCategories.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`category-${catId}`);
    if (el) {
      const yOffset = -136;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    const pill = document.getElementById(`pill-${catId}`);
    if (pill) {
      pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  // Scroll spy — update active category based on scroll position
  useEffect(() => {
    const handler = () => {
      setShowScrollTop(window.scrollY > 400);

      if (search) return;
      const threshold = 180;
      for (const cat of [...categories].reverse()) {
        const el = document.getElementById(`category-${cat.id}`);
        if (el && el.getBoundingClientRect().top <= threshold) {
          setActiveCategory((prev) => {
            if (prev !== cat.id) {
              const pill = document.getElementById(`pill-${cat.id}`);
              if (pill) {
                pill.scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "nearest",
                });
              }
              return cat.id;
            }
            return prev;
          });
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [categories, search]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: restaurant.name, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  // Effective layout: modern template forces single column card
  const effectiveGrid =
    template === "compact"
      ? "list"
      : template === "modern"
      ? gridMode
      : gridMode;

  const gridClass =
    effectiveGrid === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
      : "space-y-2.5";

  const isDark = template === "modern";

  return (
    <div
      className={`min-h-screen text-slate-900 dark:text-slate-100 flex flex-col justify-between ${
        isDark
          ? "bg-slate-950"
          : "bg-slate-50 dark:bg-slate-950"
      }`}
      style={{ fontFamily: appliedFont }}
    >
      {/* Google Fonts dynamic link */}
      {fontFamily !== "Inter" && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;600;700;800;900&display=swap`}
        />
      )}

      <div>
        {/* Restaurant Header */}
        <MenuHeader
          restaurant={restaurant}
          tableNumber={tableNumber}
          themeColor={themeColor}
          template={template}
          onShare={handleShare}
        />

        {/* Sticky Toolbar */}
        <div
          className={`sticky top-0 z-30 backdrop-blur-md border-b shadow-sm ${
            isDark
              ? "bg-slate-900/95 border-slate-800"
              : "bg-white/95 dark:bg-slate-900/95 border-slate-200/80 dark:border-slate-800"
          }`}
        >
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 space-y-2">
            {/* Row 1: Search + Layout toggle */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search dishes, drinks, desserts…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-9 pr-9 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${
                    isDark
                      ? "border-slate-700 bg-slate-800/70 text-white focus:ring-amber-500/50"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 focus:ring-amber-500"
                  }`}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Grid/List toggle (not shown on compact) */}
              {template !== "compact" && (
                <button
                  type="button"
                  onClick={() =>
                    setGridMode((m) => (m === "grid" ? "list" : "grid"))
                  }
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isDark
                      ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                  title={
                    gridMode === "grid"
                      ? "Switch to list view"
                      : "Switch to grid view"
                  }
                >
                  {gridMode === "grid" ? (
                    <LayoutList className="w-4 h-4" />
                  ) : (
                    <LayoutGrid className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Row 2: Dietary Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: "all", label: "All Menu" },
                { id: "veg", label: "Pure Veg", dot: "bg-emerald-500" },
                { id: "non-veg", label: "Non-Veg", dot: "bg-red-500" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDietary(d.id as any)}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    dietary === d.id
                      ? d.id === "veg"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : d.id === "non-veg"
                        ? "bg-red-600 text-white shadow-sm"
                        : isDark
                        ? "bg-white text-slate-900 shadow-sm"
                        : "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                      : isDark
                      ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {d.dot && (
                    <div className={`w-2 h-2 rounded-full ${d.dot}`} />
                  )}
                  {d.label}
                </button>
              ))}

              <span
                className={`ml-auto text-[11px] font-medium ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {totalFilteredDishes} item
                {totalFilteredDishes !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Row 3: Category Pill Nav */}
            {categories.length > 0 && !search && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-3 sm:-mx-4 px-3 sm:px-4 pb-0.5">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      id={`pill-${cat.id}`}
                      type="button"
                      onClick={() => scrollToCategory(cat.id)}
                      className={`whitespace-nowrap px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
                        isActive
                          ? "text-white scale-105 shadow-sm"
                          : isDark
                          ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          : "bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                      style={{
                        backgroundColor: isActive ? themeColor : undefined,
                      }}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main Menu Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
          {totalFilteredDishes === 0 ? (
            <div
              className={`text-center py-16 rounded-3xl border p-8 ${
                isDark
                  ? "border-slate-800 bg-slate-900/60"
                  : "border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              }`}
            >
              <UtensilsCrossed
                className={`w-12 h-12 mx-auto mb-3 ${
                  isDark ? "text-slate-700" : "text-slate-300 dark:text-slate-700"
                }`}
              />
              <h3
                className={`text-base font-bold ${
                  isDark ? "text-white" : "text-slate-900 dark:text-white"
                }`}
              >
                No matching dishes found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                {search
                  ? `No items match "${search}". Try something else.`
                  : "No items match your dietary filter."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDietary("all");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
                style={{ backgroundColor: themeColor }}
              >
                View Full Menu
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <section
                key={category.id}
                id={`category-${category.id}`}
                className="space-y-3.5 scroll-mt-40"
              >
                {/* Category Header */}
                <div
                  className={`flex items-baseline justify-between border-b pb-2 ${
                    isDark ? "border-slate-800" : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-1 h-5 rounded-full shrink-0"
                      style={{ backgroundColor: themeColor }}
                    />
                    <h2
                      className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                        isDark ? "text-white" : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {category.name}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isDark
                          ? "bg-slate-800 text-slate-500"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {category.items.length}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-xs text-slate-400 hidden sm:block max-w-xs truncate">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Items Grid/List */}
                <div
                  className={
                    template === "compact"
                      ? "space-y-2"
                      : effectiveGrid === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                      : "space-y-2.5"
                  }
                >
                  {category.items.map((item) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      themeColor={themeColor}
                      template={
                        template === "compact"
                          ? "compact"
                          : effectiveGrid === "list"
                          ? "compact"
                          : template
                      }
                      onImageClick={(url, title) =>
                        setLightboxImage({ url, title })
                      }
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </main>
      </div>

      {/* Image Lightbox */}
      <Dialog
        open={Boolean(lightboxImage)}
        onClose={() => setLightboxImage(null)}
        title={lightboxImage?.title || "Dish Preview"}
      >
        <div className="space-y-3">
          {lightboxImage && (
            <div className="rounded-xl overflow-hidden bg-slate-900 max-h-[70vh]">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="w-full h-full object-contain mx-auto"
              />
            </div>
          )}
        </div>
      </Dialog>

      {/* Share toast */}
      {shareToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl animate-fade-in">
          Link copied to clipboard!
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-4 z-40 w-10 h-10 rounded-full shadow-xl flex items-center justify-center text-white transition-all hover:scale-110 cursor-pointer"
          style={{ backgroundColor: themeColor }}
          title="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer
        className={`mt-16 py-8 border-t text-center text-xs space-y-2 ${
          isDark
            ? "border-slate-800 text-slate-600"
            : "border-slate-200 dark:border-slate-800 text-slate-400"
        }`}
      >
        <div
          className={`flex items-center justify-center gap-2 font-bold ${
            isDark ? "text-slate-400" : "text-slate-600 dark:text-slate-300"
          }`}
        >
          <QrCode className="w-4 h-4 text-amber-500" />
          <span>Powered by MenuQR SaaS</span>
        </div>
        <p>
          © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
        </p>
        <p className={isDark ? "text-slate-700 text-[11px]" : "text-[11px] text-slate-400"}>
          Touchless Contactless Digital Menu
        </p>
      </footer>
    </div>
  );
}
