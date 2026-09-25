import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { redirect } from "next/navigation";
import { getMenuUrl } from "@/lib/qr";
import { SettingsClient } from "./_components/settings-client";

export default async function SettingsPage() {
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/dashboard");
  }

  const publicUrl = getMenuUrl(restaurant.slug);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account & Menu Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your subscription, custom slug, and toggle your live customer menu availability.
        </p>
      </div>

      <SettingsClient restaurant={restaurant} publicUrl={publicUrl} />
    </div>
  );
}
