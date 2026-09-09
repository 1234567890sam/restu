"use client";

import { useState } from "react";
import { createRestaurantDirectAdmin } from "@/app/actions/admin";
import type { Restaurant } from "@/lib/database.types";
import { Button } from "@/app/_components/ui/button";
import { toast } from "sonner";
import {
  X,
  Store,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  CreditCard,
  User,
  ExternalLink,
} from "lucide-react";

interface CreateRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newRestaurant: Restaurant) => void;
}

export function CreateRestaurantModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRestaurantModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("MenuQR@2025");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Solapur");
  const [plan, setPlan] = useState("pro");

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManual) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManual(true);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a restaurant name.");
      return;
    }
    if (!ownerEmail.trim()) {
      toast.error("Please enter the owner's email address.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("slug", slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"));
      formData.set("ownerEmail", ownerEmail.trim().toLowerCase());
      formData.set("ownerName", ownerName.trim() || `${name.trim()} Owner`);
      formData.set("ownerPassword", ownerPassword || "MenuQR@2025");
      formData.set("phone", phone.trim());
      formData.set("city", city.trim() || "Solapur");
      formData.set("plan", plan);

      const res = await createRestaurantDirectAdmin(formData);

      if (res.error) {
        toast.error(res.error);
      } else if (res.restaurant) {
        toast.success(
          `🎉 Restaurant "${res.restaurant.name}" created and activated! Owner account ready.`
        );
        onSuccess(res.restaurant);
        onClose();
        // Reset form
        setName("");
        setSlug("");
        setOwnerEmail("");
        setOwnerName("");
        setPhone("");
        setIsSlugManual(false);
      }
    } catch {
      toast.error("An unexpected error occurred while creating restaurant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Add New Restaurant
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Directly onboard & activate a restaurant with full dashboard access.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Section: Restaurant Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              Restaurant Details
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Restaurant Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hotel Panchratna, Solapur"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Menu Slug (URL)
                </label>
                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-400 focus-within:ring-2 focus-within:ring-amber-500">
                  <span className="text-xs text-slate-500 font-mono">/r/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="hotel-panchratna"
                    className="w-full bg-transparent text-white font-mono text-xs focus:outline-hidden pl-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  City / Location
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Solapur"
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Restaurant Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subscription Plan
                </label>
                <div className="relative">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="pro">Restaurant Pro (₹799/mo)</option>
                    <option value="enterprise">Multi-Outlet Enterprise (₹2,499/mo)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Owner Login Account */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Owner Login Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Owner Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="owner@hotel.com"
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Manager / Owner Name"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Initial Password (for owner to login)
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-8 pr-3 py-2 text-sm font-mono rounded-xl border border-slate-700 bg-slate-800/80 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Owner can use this email and password to log in at <code>/login</code> immediately.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs px-4 h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 h-9 flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? "Creating & Activating..." : "Create & Activate Restaurant"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
