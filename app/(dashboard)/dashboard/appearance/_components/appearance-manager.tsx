"use client";

import { useState } from "react";
import type { Restaurant } from "@/lib/database.types";
import { updateRestaurantAppearance } from "@/app/actions/restaurant";
import { uploadImage } from "@/app/actions/upload";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/_components/ui/card";
import { ColorPicker } from "@/app/_components/ui/color-picker";
import { ImageUpload } from "@/app/_components/ui/image-upload";
import { toast } from "sonner";
import {
  Palette,
  LayoutTemplate,
  Save,
  Smartphone,
  Image as ImageIcon,
  Type,
  ExternalLink,
  Star,
  ChefHat,
  Zap,
  Flame,
  Clock,
  LayoutGrid,
  LayoutList,
  CheckCircle2,
} from "lucide-react";

interface AppearanceManagerProps {
  restaurant: Restaurant;
}

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic Heritage",
    tag: "Fine Dining · Family",
    description:
      "Warm tones, image-right cards, elegant typography, and a cozy premium feel.",
    emoji: "🍽️",
    previewStyle: "classic",
  },
  {
    id: "modern",
    name: "Modern Bistro",
    tag: "Café · Lounge · Resto-bar",
    description:
      "Dark glassmorphism cards, neon accents, full-bleed food photography.",
    emoji: "🌃",
    previewStyle: "modern",
  },
  {
    id: "compact",
    name: "Quick Diner",
    tag: "Fast Food · Street Food · Bakery",
    description:
      "Ultra-slim rows for fast-scan menus. Price-first design, maximum items visible.",
    emoji: "⚡",
    previewStyle: "compact",
  },
];

const FONT_OPTIONS = [
  { id: "Inter", label: "Inter", preview: "Modern & Clean", style: "sans-serif" },
  { id: "Poppins", label: "Poppins", preview: "Friendly & Round", style: "'Poppins', sans-serif" },
  {
    id: "Playfair Display",
    label: "Playfair Display",
    preview: "Elegant Serif",
    style: "'Playfair Display', serif",
  },
  {
    id: "Roboto Slab",
    label: "Roboto Slab",
    preview: "Bold & Classic",
    style: "'Roboto Slab', serif",
  },
];

const PRESET_PALETTES = [
  { primary: "#f59e0b", secondary: "#1e293b", label: "Amber Gold" },
  { primary: "#ef4444", secondary: "#1c1917", label: "Chili Red" },
  { primary: "#22c55e", secondary: "#14532d", label: "Fresh Green" },
  { primary: "#8b5cf6", secondary: "#0f0a1e", label: "Royal Violet" },
  { primary: "#0ea5e9", secondary: "#0c1a2e", label: "Ocean Blue" },
  { primary: "#f97316", secondary: "#431407", label: "Burnt Orange" },
];

// Mini card preview for template selector
function TemplatePreviewCard({
  tmpl,
  themeColor,
  isSelected,
}: {
  tmpl: (typeof TEMPLATES)[0];
  themeColor: string;
  isSelected: boolean;
}) {
  if (tmpl.previewStyle === "modern") {
    return (
      <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 p-2 space-y-1.5">
        <div className="h-10 w-full rounded-lg bg-slate-800 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `linear-gradient(135deg, ${themeColor}, transparent)`,
            }}
          />
          <div className="absolute bottom-1 left-1.5 flex gap-1">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <div className="h-1 w-10 bg-white/30 rounded-full" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="h-1.5 w-14 bg-white/30 rounded-full" />
            <div className="h-1 w-10 bg-white/20 rounded-full" />
          </div>
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: themeColor }}
          >
            +
          </div>
        </div>
        <div
          className="text-[9px] font-bold"
          style={{ color: themeColor }}
        >
          ₹260
        </div>
      </div>
    );
  }

  if (tmpl.previewStyle === "compact") {
    return (
      <div className="w-full h-24 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 space-y-1.5">
        {[
          { name: "Paneer Tikka", price: "₹220", veg: true },
          { name: "Mutton Sukka", price: "₹340", veg: false },
          { name: "Naan", price: "₹60", veg: true },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-lg px-2 py-1"
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-sm border ${item.veg ? "border-emerald-500" : "border-red-500"}`}
              >
                <div
                  className={`w-1 h-1 rounded-full m-auto mt-0.5 ${item.veg ? "bg-emerald-500" : "bg-red-500"}`}
                />
              </div>
              <div className="h-1 w-10 bg-slate-300 dark:bg-slate-600 rounded-full" />
            </div>
            <span
              className="text-[9px] font-black"
              style={{ color: themeColor }}
            >
              {item.price}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Classic
  return (
    <div className="w-full h-24 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2">
      <div className="flex gap-2 h-full">
        <div className="flex-1 space-y-1.5 pt-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm border border-emerald-500">
              <div className="w-1 h-1 rounded-full bg-emerald-500 m-auto mt-0.5" />
            </div>
            <div
              className="text-[9px] font-bold px-1 py-0.5 rounded-full text-white"
              style={{ backgroundColor: themeColor, fontSize: "6px" }}
            >
              BEST
            </div>
          </div>
          <div className="h-1.5 w-16 bg-slate-300 dark:bg-slate-600 rounded-full" />
          <div className="h-1 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div
            className="text-[9px] font-black mt-2"
            style={{ color: themeColor }}
          >
            ₹260
          </div>
        </div>
        <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 self-center">
          <div
            className="w-full h-full opacity-40"
            style={{
              background: `linear-gradient(135deg, ${themeColor}, #1e293b)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function AppearanceManager({ restaurant }: AppearanceManagerProps) {
  const [template, setTemplate] = useState<
    "classic" | "modern" | "grid" | "minimal" | "compact"
  >((restaurant.template as any) || "classic");
  const [themeColor, setThemeColor] = useState(
    restaurant.theme_color || "#f59e0b"
  );
  const [secondaryColor, setSecondaryColor] = useState(
    restaurant.secondary_color || "#1e293b"
  );
  const [fontFamily, setFontFamily] = useState(
    restaurant.font_family || "Inter"
  );
  const [bannerUrl, setBannerUrl] = useState<string | null>(
    restaurant.banner_url || null
  );
  const [loading, setLoading] = useState(false);

  const handleUploadBanner = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await uploadImage(formData, "covers");
    if (res.error) {
      toast.error(res.error);
      throw new Error(res.error);
    }
    setBannerUrl(res.url || null);
    toast.success("Cover banner uploaded!");
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await updateRestaurantAppearance(restaurant.id, {
      template: template as any,
      themeColor,
      secondaryColor,
      fontFamily,
      bannerUrl,
    });
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Appearance saved! Your menu looks great.");
    }
  };

  const handlePresetPalette = (primary: string, secondary: string) => {
    setThemeColor(primary);
    setSecondaryColor(secondary);
  };

  const previewMenuUrl = `/r/${restaurant.slug}`;

  const isDark = template === "modern";

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Appearance & Branding
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalize your public digital menu layout, colors, fonts, and imagery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={previewMenuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview Menu
          </a>
          <Button variant="primary" onClick={handleSave} isLoading={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* ── Template Selection ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-amber-500" />
                Menu Layout Template
              </CardTitle>
              <CardDescription>
                Choose the presentation style that fits your restaurant concept
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {TEMPLATES.map((tmpl) => {
                const isSelected = template === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setTemplate(tmpl.id as any)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Radio */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? "border-amber-500 bg-amber-500"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>

                      {/* Text info */}
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {tmpl.emoji} {tmpl.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-semibold">
                            {tmpl.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {tmpl.description}
                        </p>
                      </div>
                    </div>

                    {/* Visual mini-preview */}
                    {isSelected && (
                      <div className="mt-3 ml-9">
                        <TemplatePreviewCard
                          tmpl={tmpl}
                          themeColor={themeColor}
                          isSelected={isSelected}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* ── Color Scheme ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-500" />
                Theme Colors
              </CardTitle>
              <CardDescription>
                Accent color applies to prices, buttons, tabs, and badges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick palette presets */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
                  Quick Palettes
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_PALETTES.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() =>
                        handlePresetPalette(p.primary, p.secondary)
                      }
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        themeColor === p.primary
                          ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: p.primary }}
                      />
                      <span className="text-slate-700 dark:text-slate-300 truncate">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <ColorPicker
                label="Primary Accent Color"
                value={themeColor}
                onChange={setThemeColor}
                description="Prices, active tabs, call-to-action buttons"
              />

              <ColorPicker
                label="Secondary / Dark Tone"
                value={secondaryColor}
                onChange={setSecondaryColor}
                presetColors={[
                  "#0f172a",
                  "#1e293b",
                  "#18181b",
                  "#1c1917",
                  "#292524",
                ]}
                description="Header backgrounds, dark cards, and section dividers"
              />
            </CardContent>
          </Card>

          {/* ── Font Family ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-500" />
                Menu Font Style
              </CardTitle>
              <CardDescription>
                Typography sets the mood — from modern sans-serif to elegant
                serif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FONT_OPTIONS.map((font) => {
                  const isActive = fontFamily === font.id;
                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setFontFamily(font.id)}
                      className={`flex flex-col items-start text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <span
                        className="text-xl font-bold text-slate-900 dark:text-white leading-none"
                        style={{ fontFamily: font.style }}
                      >
                        Aa
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                        {font.label}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {font.preview}
                      </span>
                      {isActive && (
                        <CheckCircle2 className="w-4 h-4 text-amber-500 mt-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* ── Cover Banner ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                Menu Top Banner / Cover Image
              </CardTitle>
              <CardDescription>
                Full-width cover shown when customers scan the QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={bannerUrl}
                onChange={handleUploadBanner}
                onRemove={() => setBannerUrl(null)}
                aspectRatio="banner"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Smartphone Preview */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6 self-start">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            Live Customer Preview
          </div>

          {/* Phone frame */}
          <div
            className={`w-[280px] rounded-[38px] border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative ${
              isDark ? "bg-slate-950" : "bg-white dark:bg-slate-950"
            }`}
            style={{ height: "560px" }}
          >
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-slate-800 rounded-full z-20" />

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pt-5">
              {/* Cover */}
              <div
                className="h-28 w-full relative flex-shrink-0"
                style={{
                  background: bannerUrl
                    ? undefined
                    : `linear-gradient(135deg, ${themeColor} 0%, ${secondaryColor} 100%)`,
                }}
              >
                {bannerUrl && (
                  <img
                    src={bannerUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                    style={{ backgroundColor: themeColor }}
                  >
                    {restaurant.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-[11px] leading-tight truncate max-w-[140px]">
                      {restaurant.name}
                    </p>
                    <p className="text-white/60 text-[9px] truncate max-w-[140px]">
                      {restaurant.tagline || "Live Digital Menu"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Toolbar mockup */}
              <div
                className={`px-2 py-2 border-b ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"}`}
              >
                <div
                  className={`h-6 w-full rounded-lg flex items-center px-2 gap-1.5 ${isDark ? "bg-slate-800" : "bg-slate-100 dark:bg-slate-800"}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${isDark ? "text-slate-600" : "text-slate-400"}`}
                  >
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                      <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                  <div className={`h-1.5 rounded-full flex-1 ${isDark ? "bg-slate-700" : "bg-slate-200 dark:bg-slate-700"}`} />
                </div>
                {/* Category pills */}
                <div className="flex gap-1.5 mt-1.5 overflow-hidden">
                  <span
                    className="text-[8px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                    style={{ backgroundColor: themeColor }}
                  >
                    Starters
                  </span>
                  <span
                    className={`text-[8px] font-medium px-2 py-0.5 rounded-full shrink-0 ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
                  >
                    Mains
                  </span>
                  <span
                    className={`text-[8px] font-medium px-2 py-0.5 rounded-full shrink-0 ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
                  >
                    Desserts
                  </span>
                </div>
              </div>

              {/* Items */}
              <div
                className={`p-2 space-y-2 ${isDark ? "bg-slate-950" : "bg-slate-50 dark:bg-slate-950"}`}
                style={{ fontFamily: FONT_OPTIONS.find(f => f.id === fontFamily)?.style }}
              >
                {template === "compact" ? (
                  // Compact rows
                  [
                    { name: "Paneer Tikka Masala", price: "₹220", veg: true },
                    { name: "Solapuri Mutton Sukka", price: "₹340", veg: false },
                    { name: "Butter Naan", price: "₹60", veg: true },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-sm border ${item.veg ? "border-emerald-500" : "border-red-500"} flex items-center justify-center`}
                        >
                          <div
                            className={`w-1 h-1 rounded-full ${item.veg ? "bg-emerald-500" : "bg-red-500"}`}
                          />
                        </div>
                        <span
                          className={`text-[9px] font-semibold ${isDark ? "text-slate-300" : "text-slate-700 dark:text-slate-300"}`}
                        >
                          {item.name}
                        </span>
                      </div>
                      <span
                        className="text-[9px] font-black"
                        style={{ color: themeColor }}
                      >
                        {item.price}
                      </span>
                    </div>
                  ))
                ) : template === "modern" ? (
                  // Modern dark cards
                  [
                    { name: "Paneer Tikka", price: "₹220", badge: "BEST" },
                    { name: "Mutton Sukka", price: "₹340" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-slate-700/60"
                      style={{ background: "rgba(15,23,42,0.9)" }}
                    >
                      <div
                        className="h-12 w-full opacity-40"
                        style={{
                          background: `linear-gradient(135deg, ${themeColor}, ${secondaryColor})`,
                        }}
                      />
                      <div className="px-2.5 py-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-white">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span
                              className="text-[7px] px-1.5 py-0.5 rounded-full text-white font-bold"
                              style={{ backgroundColor: themeColor }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span
                            className="text-[10px] font-black"
                            style={{ color: themeColor }}
                          >
                            {item.price}
                          </span>
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ backgroundColor: themeColor }}
                          >
                            +
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Classic cards
                  [
                    { name: "Paneer Tikka Masala", price: "₹220", badge: "BEST" },
                    { name: "Solapuri Mutton Sukka", price: "₹340" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-sm border border-emerald-500 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-emerald-500" />
                          </div>
                          {item.badge && (
                            <span
                              className="text-[7px] px-1 py-0.5 rounded-full font-bold text-white"
                              style={{ backgroundColor: themeColor }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 w-16 bg-slate-300 dark:bg-slate-600 rounded-full" />
                        <span
                          className="text-[9px] font-black"
                          style={{ color: themeColor }}
                        >
                          {item.price}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 self-center">
                        <div
                          className="w-full h-full opacity-50"
                          style={{
                            background: `linear-gradient(135deg, ${themeColor}, transparent)`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Phone home bar */}
            <div
              className={`h-5 flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-slate-100 dark:bg-slate-900"}`}
            >
              <div className="w-20 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
            </div>
          </div>

          {/* Preview link below phone */}
          <a
            href={previewMenuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Open full preview
          </a>
        </div>
      </div>
    </div>
  );
}
