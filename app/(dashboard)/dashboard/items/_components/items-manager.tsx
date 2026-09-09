"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MenuItem, Category } from "@/lib/database.types";
import { toggleItemAvailability, deleteMenuItem } from "@/app/actions/items";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Badge } from "@/app/_components/ui/badge";
import { Switch } from "@/app/_components/ui/switch";
import { ConfirmDialog } from "@/app/_components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UtensilsCrossed,
  Sparkles,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { SeedMenuButton } from "@/app/(dashboard)/dashboard/_components/seed-menu-button";

interface ItemsManagerProps {
  items: MenuItem[];
  categories: Category[];
  restaurantId: string;
}

export function ItemsManager({
  items: initialItems,
  categories,
  restaurantId,
}: ItemsManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [foodTypeFilter, setFoodTypeFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search
      const matchSearch =
        search === "" ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());

      // Category
      const matchCategory =
        selectedCategory === "all" || item.category_id === selectedCategory;

      // Food type
      const matchType =
        foodTypeFilter === "all" || item.food_type === foodTypeFilter;

      return matchSearch && matchCategory && matchType;
    });
  }, [items, search, selectedCategory, foodTypeFilter]);

  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const res = await toggleItemAvailability(itemId, nextStatus);

    if (res.error) {
      toast.error(res.error);
    } else {
      setItems(
        items.map((i) =>
          i.id === itemId ? { ...i, is_available: nextStatus } : i
        )
      );
      toast.success(
        nextStatus ? "Dish marked Available" : "Dish marked Out of Stock"
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    const res = await deleteMenuItem(deleteId);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Dish deleted successfully!");
      setItems(items.filter((i) => i.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Menu Dishes & Items
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your dishes, live pricing, stock availability, and Indian veg/non-veg tags.
          </p>
        </div>

        <Link href="/dashboard/items/new">
          <Button variant="primary" className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Add New Dish
          </Button>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search dishes by name or ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Categories ({items.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Food Type (Veg / Non-Veg) Filter */}
          <select
            value={foodTypeFilter}
            onChange={(e) => setFoodTypeFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Dietary Types</option>
            <option value="veg">🟢 Pure Veg</option>
            <option value="non-veg">🔴 Non-Veg</option>
            <option value="egg">🟡 Eggitarian</option>
            <option value="vegan">🌱 Vegan</option>
          </select>
        </div>
      </div>

      {/* Dishes List / Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <UtensilsCrossed className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No dishes found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {search || selectedCategory !== "all" || foodTypeFilter !== "all"
              ? "Try adjusting your filters or search keywords."
              : "Start by adding dishes to your menu."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <SeedMenuButton restaurantId={restaurantId} size="sm" />
            <Link href="/dashboard/items/new">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Add First Dish
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const categoryName =
              categories.find((c) => c.id === item.category_id)?.name ||
              "Uncategorized";

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-500/40 hover:shadow-md transition-all"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3.5">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <UtensilsCrossed className="w-8 h-8 mb-1 text-slate-300 dark:text-slate-600" />
                        <span className="text-xs">No image</span>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <Badge
                        variant={
                          item.food_type === "veg"
                            ? "veg"
                            : item.food_type === "non-veg"
                            ? "non-veg"
                            : "default"
                        }
                        className="text-xs shadow-xs"
                      >
                        {item.food_type === "veg" ? "Veg" : "Non-Veg"}
                      </Badge>
                      {item.badge && (
                        <Badge
                          variant="brand"
                          className="text-[10px] uppercase font-bold shadow-xs"
                        >
                          {item.badge.replace("_", " ")}
                        </Badge>
                      )}
                    </div>

                    {/* Out of Stock Overlay */}
                    {!item.is_available && (
                      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {categoryName}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px]">
                      {item.description || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* Footer: Price, Availability switch, Actions */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                      ₹{item.price}
                    </span>
                    {item.offer_price && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{item.offer_price}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id, item.is_available)}
                      className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                        item.is_available
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300"
                      }`}
                      title="Click to toggle availability"
                    >
                      {item.is_available ? "In Stock" : "Unavailable"}
                    </button>

                    <Link
                      href={`/dashboard/items/${item.id}`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                      title="Edit dish"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete dish from menu?"
        description="This will permanently delete this food item and remove it from your customer digital menu."
        confirmText="Delete Dish"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
}
