"use client";

import { useState } from "react";
import { seedSampleMenuForRestaurant } from "@/app/actions/seed-menu";
import { Button } from "@/app/_components/ui/button";
import { toast } from "sonner";
import { Sparkles, UtensilsCrossed, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SeedMenuButtonProps {
  restaurantId: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function SeedMenuButton({
  restaurantId,
  className,
  variant = "primary",
  size = "md",
}: SeedMenuButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await seedSampleMenuForRestaurant(restaurantId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("🎉 Sample Menu Loaded! 5 categories & 10 dishes added.");
        router.refresh();
      }
    } catch {
      toast.error("Failed to load sample menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSeed}
      disabled={loading}
      variant={variant}
      size={size}
      className={`font-bold flex items-center gap-2 shadow-md cursor-pointer ${className || ""}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading Sample Menu...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 text-amber-950 dark:text-amber-400" />
          <span>Load Sample Menu (1-Click)</span>
        </>
      )}
    </Button>
  );
}
