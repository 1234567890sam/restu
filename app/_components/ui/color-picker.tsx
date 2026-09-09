"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label?: string;
  value?: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  description?: string;
}

const DEFAULT_PRESETS = [
  "#f59e0b", // Amber (warm food)
  "#ea580c", // Orange (spicy/bistro)
  "#dc2626", // Red (restaurant classic)
  "#16a34a", // Emerald (fresh/veg/organic)
  "#0891b2", // Cyan (coastal/beverage)
  "#4f46e5", // Indigo (modern/lounge)
  "#9333ea", // Purple (fine dining/dessert)
  "#0f172a", // Slate (luxury dark)
  "#78350f", // Warm wood / coffee
  "#b45309", // Terracotta
];

export function ColorPicker({
  label,
  value = "#f59e0b",
  onChange,
  presetColors = DEFAULT_PRESETS,
  description,
}: ColorPickerProps) {
  const [color, setColor] = useState(value);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      )}

      <div className="flex items-center gap-3">
        {/* Native color input disguised as custom preview */}
        <div className="relative group">
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent overflow-hidden shadow-xs hover:scale-105 transition-transform"
          />
        </div>

        <input
          type="text"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          placeholder="#000000"
          className="w-28 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-slate-100 shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          maxLength={7}
        />

        {/* Swatches */}
        <div className="flex flex-wrap items-center gap-1.5 ml-2">
          {presetColors.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleColorChange(preset)}
              className={cn(
                "w-6 h-6 rounded-full border border-black/10 dark:border-white/10 transition-all hover:scale-115 cursor-pointer",
                color.toLowerCase() === preset.toLowerCase() &&
                  "ring-2 ring-offset-2 ring-amber-500 dark:ring-offset-slate-900 scale-110"
              )}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
