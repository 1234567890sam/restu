"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { MenuItem, Category } from "@/lib/database.types";
import { createMenuItem, updateMenuItem } from "@/app/actions/items";
import { uploadImage } from "@/app/actions/upload";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Select } from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";
import { Switch } from "@/app/_components/ui/switch";
import { ImageUpload } from "@/app/_components/ui/image-upload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/_components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Save, Sparkles, Utensils } from "lucide-react";

interface ItemFormProps {
  categories: Category[];
  restaurantId: string;
  initialData?: MenuItem | null;
}

export function ItemForm({
  categories,
  restaurantId,
  initialData,
}: ItemFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id || (categories[0]?.id ?? "")
  );
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [offerPrice, setOfferPrice] = useState(
    initialData?.offer_price ? String(initialData.offer_price) : ""
  );
  const [foodType, setFoodType] = useState<"veg" | "non-veg" | "vegan" | "egg">(
    (initialData?.food_type as any) || "veg"
  );
  const [spiceLevel, setSpiceLevel] = useState<"mild" | "medium" | "spicy" | "extra_spicy">(
    (initialData?.spice_level as any) || "medium"
  );
  const [badge, setBadge] = useState<"bestseller" | "chef_special" | "new" | "must_try" | "none">(
    (initialData?.badge as any) || "none"
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [preparationTime, setPreparationTime] = useState(initialData?.preparation_time || "");
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [isAvailable, setIsAvailable] = useState(
    initialData?.is_available !== undefined ? initialData.is_available : true
  );

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadImage(formData, "items");
    if (res.error) {
      toast.error(res.error);
      throw new Error(res.error);
    }
    setImageUrl(res.url || null);
    toast.success("Image uploaded!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a dish name");
      return;
    }

    if (!categoryId) {
      toast.error("Please select or create a category first");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const parsedOfferPrice = offerPrice ? parseFloat(offerPrice) : null;

    setLoading(true);

    if (isEditing && initialData) {
      const res = await updateMenuItem(initialData.id, {
        name: name.trim(),
        categoryId,
        price: parsedPrice,
        offerPrice: parsedOfferPrice,
        foodType,
        spiceLevel,
        badge: badge === "none" ? null : badge,
        description: description.trim(),
        preparationTime: preparationTime.trim() || null,
        imageUrl,
        isAvailable,
      });

      setLoading(false);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Dish updated successfully!");
        router.push("/dashboard/items");
        router.refresh();
      }
    } else {
      const res = await createMenuItem(restaurantId, {
        name: name.trim(),
        categoryId,
        price: parsedPrice,
        offerPrice: parsedOfferPrice,
        foodType,
        spiceLevel,
        badge: badge === "none" ? null : badge,
        description: description.trim(),
        preparationTime: preparationTime.trim() || null,
        imageUrl,
        isAvailable,
      });

      setLoading(false);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Dish added to menu!");
        router.push("/dashboard/items");
        router.refresh();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/items"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEditing ? "Edit Dish" : "Add New Dish"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing
                ? "Update pricing, description, dietary tags, or dish photo"
                : "Fill in the details to publish this dish on your digital menu"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/items">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" isLoading={loading}>
            <Save className="w-4 h-4 mr-1.5" />
            {isEditing ? "Save Changes" : "Publish Dish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <CardDescription>
                Dish title, category, and appetizing description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Dish Name"
                placeholder="e.g. Paneer Butter Masala, Solapuri Shenga Chutney"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.length === 0 ? (
                    <option value="">No categories found - create one first</option>
                  ) : (
                    categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </Select>

                <Input
                  label="Prep Time (Optional)"
                  placeholder="e.g. 15-20 mins"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                />
              </div>

              <Textarea
                label="Description & Ingredients"
                placeholder="Describe flavors, ingredients, serving size (e.g. Cottage cheese cubes in rich creamy tomato gravy, served with butter naan)."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pricing (INR ₹)</CardTitle>
              <CardDescription>
                Regular selling price and optional discount price
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  label="Selling Price (₹)"
                  placeholder="240"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />

                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  label="Original / Strike Price (₹, Optional)"
                  placeholder="280"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  hint="Shows as strikethrough to highlight discounts"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dietary & Classification</CardTitle>
              <CardDescription>
                FSSAI food labels and spice indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Food Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "veg", label: "Pure Veg", icon: "🟢", border: "border-emerald-500/50" },
                    { id: "non-veg", label: "Non-Veg", icon: "🔴", border: "border-red-500/50" },
                    { id: "egg", label: "Contains Egg", icon: "🟡", border: "border-amber-500/50" },
                    { id: "vegan", label: "Vegan", icon: "🌱", border: "border-green-600/50" },
                  ].map((type) => (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setFoodType(type.id as any)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                        foodType === type.id
                          ? `${type.border} bg-amber-50 dark:bg-amber-950/30 text-slate-900 dark:text-white ring-2 ring-amber-500/20 font-semibold`
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-base">{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Select
                  label="Spice Level"
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(e.target.value as any)}
                >
                  <option value="mild">🌶️ Mild (Less Spicy)</option>
                  <option value="medium">🌶️🌶️ Medium (Balanced)</option>
                  <option value="spicy">🌶️🌶️🌶️ Spicy (Authentic Indian)</option>
                  <option value="extra_spicy">🌶️🌶️🌶️🌶️ Extra Spicy (Solapuri Teekha)</option>
                </Select>

                <Select
                  label="Special Highlight Badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value as any)}
                >
                  <option value="none">None (Standard item)</option>
                  <option value="bestseller">⭐ Bestseller</option>
                  <option value="chef_special">👨‍🍳 Chef's Special</option>
                  <option value="must_try">🔥 Must Try</option>
                  <option value="new">✨ New Arrival</option>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Photo & Availability */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dish Photo</CardTitle>
              <CardDescription>
                High-quality food images increase orders by 35%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={imageUrl}
                onChange={handleUploadImage}
                onRemove={() => setImageUrl(null)}
                aspectRatio="video"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inventory & Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Switch
                label="Available in Kitchen"
                description="Turn off if the dish runs out of stock. It will immediately show as 'Sold Out' on customer menus."
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
