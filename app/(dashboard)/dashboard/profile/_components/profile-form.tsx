"use client";

import { useState } from "react";
import type { Restaurant } from "@/lib/database.types";
import { updateRestaurantProfile } from "@/app/actions/restaurant";
import { uploadImage } from "@/app/actions/upload";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/_components/ui/card";
import { ImageUpload } from "@/app/_components/ui/image-upload";
import { toast } from "sonner";
import { Save, Store, MapPin, Clock, Phone, Mail, Image as ImageIcon } from "lucide-react";

interface ProfileFormProps {
  restaurant: Restaurant;
}

export function ProfileForm({ restaurant }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(restaurant.logo_url || null);
  const [coverUrl, setCoverUrl] = useState<string | null>(
    restaurant.cover_image_url || restaurant.cover_url || null
  );

  const handleUploadLogo = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadImage(formData, "logos");
    if (res.error) {
      toast.error(res.error);
      throw new Error(res.error);
    }
    setLogoUrl(res.url || null);
    toast.success("Logo uploaded!");
  };

  const handleUploadCover = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadImage(formData, "covers");
    if (res.error) {
      toast.error(res.error);
      throw new Error(res.error);
    }
    setCoverUrl(res.url || null);
    toast.success("Cover image uploaded!");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (logoUrl) formData.set("logo_url", logoUrl);
    if (coverUrl) formData.set("cover_image_url", coverUrl);

    const res = await updateRestaurantProfile(restaurant.id, formData);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Restaurant profile updated successfully!");
    }
  };

  const openingHoursValue =
    typeof restaurant.opening_hours === "string"
      ? restaurant.opening_hours
      : restaurant.opening_hours
      ? JSON.stringify(restaurant.opening_hours)
      : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Restaurant Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your restaurant identity, location, contact, and operational hours.
          </p>
        </div>

        <Button type="submit" variant="primary" isLoading={loading}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-500" />
                Restaurant Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Restaurant Name"
                name="name"
                defaultValue={restaurant.name}
                required
              />

              <Input
                label="Tagline / Short Motto"
                name="tagline"
                placeholder="e.g. Authentic Maharashtrian & North Indian Cuisines"
                defaultValue={restaurant.tagline || ""}
              />

              <Textarea
                label="About the Restaurant"
                name="description"
                placeholder="Share your story, culinary heritage, or specialties..."
                defaultValue={restaurant.description || ""}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500" />
                Contact & Timings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone"
                  name="phone"
                  placeholder="+91 98765 43210"
                  defaultValue={restaurant.phone || ""}
                />

                <Input
                  label="Contact Email"
                  name="email"
                  type="email"
                  placeholder="contact@restaurant.com"
                  defaultValue={restaurant.email || ""}
                />
              </div>

              <Input
                label="Opening Hours"
                name="opening_hours"
                placeholder="e.g. 11:00 AM - 11:00 PM (All 7 Days)"
                defaultValue={openingHoursValue}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                Location & Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Street Address / Landmark"
                name="address"
                placeholder="Near Saat Rasta, Old Pune Naka"
                defaultValue={restaurant.address || ""}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  placeholder="Solapur"
                  defaultValue={restaurant.city || "Solapur"}
                />

                <Input
                  label="State"
                  name="state"
                  placeholder="Maharashtra"
                  defaultValue={restaurant.state || "Maharashtra"}
                />

                <Input
                  label="Postal Code"
                  name="postal_code"
                  placeholder="413001"
                  defaultValue={restaurant.postal_code || ""}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Visual Assets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brand Logo</CardTitle>
              <CardDescription>Square 1:1 logo icon</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={logoUrl}
                onChange={handleUploadLogo}
                onRemove={() => setLogoUrl(null)}
                aspectRatio="square"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cover Photo</CardTitle>
              <CardDescription>Hero photo of interior or food</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={coverUrl}
                onChange={handleUploadCover}
                onRemove={() => setCoverUrl(null)}
                aspectRatio="wide"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
