"use client";

import { useState, useEffect } from "react";
import type { Restaurant } from "@/lib/database.types";
import { updateRestaurantDetailsAdmin } from "@/app/actions/admin";
import { Button } from "@/app/_components/ui/button";
import {
  X,
  Store,
  Phone,
  MapPin,
  Sparkles,
  FileText,
  ShieldCheck,
  CreditCard,
  Globe,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface EditRestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: Restaurant) => void;
}

export function EditRestaurantModal({
  restaurant,
  isOpen,
  onClose,
  onSuccess,
}: EditRestaurantModalProps) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Solapur");
  const [state, setState] = useState("Maharashtra");
  const [address, setAddress] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "active" | "suspended" | "rejected">("active");
  const [plan, setPlan] = useState("pro");

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name || "");
      setSlug(restaurant.slug || "");
      setPhone(restaurant.phone || "");
      setCity(restaurant.city || "Solapur");
      setState(restaurant.state || "Maharashtra");
      setAddress(restaurant.address || "");
      setTagline(restaurant.tagline || "");
      setDescription(restaurant.description || "");
      setStatus(((restaurant as any).status as any) || (restaurant.is_active ? "active" : "suspended"));
      setPlan(restaurant.subscription_plan || "pro");
    }
  }, [restaurant]);

  if (!isOpen || !restaurant) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Restaurant Name is required.");
      return;
    }
    if (!slug.trim()) {
      toast.error("Restaurant Slug is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await updateRestaurantDetailsAdmin(restaurant.id, {
        name,
        slug,
        phone,
        city,
        state,
        address,
        tagline,
        description,
        status,
        subscriptionPlan: plan,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`✨ "${name}" updated successfully!`);
        onSuccess({
          ...restaurant,
          name,
          slug,
          phone,
          city,
          state,
          address,
          tagline,
          description,
          status: status as any,
          is_active: status === "active",
          subscription_plan: plan as any,
        });
        onClose();
      }
    } catch {
      toast.error("An unexpected error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Edit Restaurant Profile
              </h2>
              <p className="text-xs text-slate-400">
                Update restaurant details, status, and subscription tier
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hotel Panchratna"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>URL Slug *</span>
                <span className="text-[10px] text-slate-500">/r/{slug || "slug"}</span>
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 text-xs text-slate-400 bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl select-none">
                  /r/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="hotel-panchratna"
                  className="flex-1 px-3.5 py-2 text-sm rounded-r-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>Phone</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>City</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Solapur"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Maharashtra"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Near Old Pune Naka, Solapur"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Tagline & Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Tagline</span>
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Authentic Solapuri Spices & Delicacies"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              <span>Description</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description about the dining experience..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Status & Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Operating Status</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="active">Active & Approved (Live Menu Enabled)</option>
                <option value="pending">Pending Approval (Under Review)</option>
                <option value="suspended">Suspended (Temporarily Disabled)</option>
                <option value="rejected">Rejected (Application Declined)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-amber-400" />
                <span>Subscription Plan</span>
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="pro">Pro Plan (₹799/month)</option>
                <option value="enterprise">Enterprise Plan (₹2,499/month)</option>
                <option value="basic">Basic Tier (₹499/month)</option>
                <option value="free">Free Trial (Read-Only)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-9 px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-9 px-5 flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Saving Changes..." : "Save Restaurant"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
