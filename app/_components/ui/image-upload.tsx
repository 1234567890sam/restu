"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { validateImageFile } from "@/lib/utils";
import { Button } from "./button";

interface ImageUploadProps {
  value?: string | null;
  onChange: (file: File) => void | Promise<void>;
  onRemove?: () => void;
  label?: string;
  hint?: string;
  className?: string;
  aspectRatio?: "square" | "wide" | "banner" | "video";
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label,
  hint,
  className,
  aspectRatio = "square",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const aspects = {
    square: "aspect-square",
    wide: "aspect-video",
    video: "aspect-video",
    banner: "aspect-[3/1]",
  };

  const handleFile = useCallback(
    async (file: File) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      try {
        setIsUploading(true);
        await onChange(file);
      } catch (err: any) {
        setError(err?.message || "Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onRemove?.();
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all overflow-hidden bg-slate-50 dark:bg-slate-800/50",
          aspects[aspectRatio],
          dragActive
            ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
            : "border-slate-300 dark:border-slate-700 hover:border-slate-400",
          error && "border-red-500"
        )}
      >
        {isUploading && (
          <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-amber-400" />
            <span className="text-xs font-semibold">Uploading photo...</span>
          </div>
        )}

        {preview ? (
          <>
            <img
              src={preview}
              alt="Upload preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 sm:bg-black/40 flex items-center justify-center gap-2 transition-opacity sm:opacity-0 sm:hover:opacity-100">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-slate-900 rounded-xl text-xs font-semibold hover:bg-white transition-colors shadow-md cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  Change
                </div>
              </label>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRemove}
                className="shadow-md"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
          </>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4 text-center">
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center mb-2 text-amber-600 dark:text-amber-400">
              <ImageIcon className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Click to upload or drag & drop
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              JPG, PNG, WebP up to 5MB
            </p>
          </label>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium animate-fade-in">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  );
}
