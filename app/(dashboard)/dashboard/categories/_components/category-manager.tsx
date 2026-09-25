"use client";

import { useState } from "react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "@/app/actions/categories";
import type { Category } from "@/lib/database.types";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Dialog, ConfirmDialog } from "@/app/_components/ui/dialog";
import { Switch } from "@/app/_components/ui/switch";
import { Badge } from "@/app/_components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  FolderTree,
  Utensils,
  Coffee,
  Pizza,
  Salad,
  Cake,
  Flame,
  Soup,
  Beer,
} from "lucide-react";

interface CategoryManagerProps {
  initialCategories: Category[];
  restaurantId: string;
}

const ICONS = [
  { name: "Utensils", icon: Utensils },
  { name: "Coffee", icon: Coffee },
  { name: "Pizza", icon: Pizza },
  { name: "Salad", icon: Salad },
  { name: "Cake", icon: Cake },
  { name: "Flame", icon: Flame },
  { name: "Soup", icon: Soup },
  { name: "Beer", icon: Beer },
];

export function CategoryManager({
  initialCategories,
  restaurantId,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Utensils");

  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedIcon("Utensils");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please provide a category name");
      return;
    }

    setLoading(true);
    const res = await createCategory(restaurantId, {
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
    });
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Category created successfully!");
      if (res.category) {
        setCategories([...categories, res.category]);
      }
      setIsCreateOpen(false);
      resetForm();
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditCategoryData(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setSelectedIcon(cat.icon || "Utensils");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategoryData || !name.trim()) return;

    setLoading(true);
    const res = await updateCategory(editCategoryData.id, {
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
    });
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Category updated successfully!");
      setCategories(
        categories.map((c) =>
          c.id === editCategoryData.id
            ? { ...c, name, description, icon: selectedIcon }
            : c
        )
      );
      setEditCategoryData(null);
      resetForm();
    }
  };

  const handleToggleActive = async (cat: Category) => {
    const nextStatus = !cat.is_active;
    const res = await updateCategory(cat.id, { isActive: nextStatus });
    if (res.error) {
      toast.error(res.error);
    } else {
      setCategories(
        categories.map((c) =>
          c.id === cat.id ? { ...c, is_active: nextStatus } : c
        )
      );
      toast.success(
        `Category marked as ${nextStatus ? "Active" : "Inactive"}`
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    const res = await deleteCategory(deleteId);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Category deleted!");
      setCategories(categories.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newOrder = [...categories];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    setCategories(newOrder);

    const res = await reorderCategories(
      restaurantId,
      newOrder.map((c) => c.id)
    );
    if (res.error) {
      toast.error("Failed to save reorder");
      setCategories(categories);
    } else {
      toast.success("Order updated!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Menu Categories
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize dishes into sections like Starters, Main Course, Biryani, Desserts.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <FolderTree className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No categories yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Create your first menu category (e.g. &quot;Starters&quot;, &quot;Tandoor & Kebab&quot;, &quot;Beverages&quot;)
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              resetForm();
              setIsCreateOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Category
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat, index) => {
            const IconComponent =
              ICONS.find((i) => i.name === cat.icon)?.icon || Utensils;

            return (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400/50 transition-all"
              >
                {/* Reordering arrows & Category info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === categories.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {cat.name}
                      </h3>
                      <Badge
                        variant={cat.is_active ? "success" : "default"}
                        className="text-[10px] py-0 px-1.5"
                      >
                        {cat.is_active ? "Active" : "Hidden"}
                      </Badge>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {cat.item_count ?? 0} {cat.item_count === 1 ? "dish" : "dishes"}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <Switch
                    checked={cat.is_active}
                    onChange={() => handleToggleActive(cat)}
                  />

                  <button
                    type="button"
                    onClick={() => handleStartEdit(cat)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteId(cat.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Menu Category"
        description="Create a section to group related food items together"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Starters & Appetizers, Solapur Thali"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <Textarea
            label="Description (Optional)"
            placeholder="e.g. Freshly prepared tandoor delights"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Category Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ICONS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIcon === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setSelectedIcon(item.name)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600 ring-2 ring-amber-500/20"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] mt-1 truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Create Category
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={Boolean(editCategoryData)}
        onClose={() => setEditCategoryData(null)}
        title="Edit Category"
        description="Update category name, description, and icon"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <Textarea
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Category Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ICONS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIcon === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setSelectedIcon(item.name)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600 ring-2 ring-amber-500/20"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] mt-1 truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditCategoryData(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {(() => {
        const catToDelete = categories.find((c) => c.id === deleteId);
        const count = catToDelete?.item_count ?? 0;
        return (
          <ConfirmDialog
            open={Boolean(deleteId)}
            onClose={() => setDeleteId(null)}
            onConfirm={handleDelete}
            title={`Delete "${catToDelete?.name || "Category"}"?`}
            description={
              count > 0
                ? `Warning: This category currently contains ${count} ${
                    count === 1 ? "dish" : "dishes"
                  }. Deleting this category will permanently delete all these dishes from your live menu! This action cannot be undone.`
                : "Are you sure you want to delete this category? This action cannot be undone."
            }
            confirmText="Delete Category"
            variant="danger"
            isLoading={loading}
          />
        );
      })()}
    </div>
  );
}
