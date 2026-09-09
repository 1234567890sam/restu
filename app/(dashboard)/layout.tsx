import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "./_components/dashboard-nav";
import { AdminRestaurantSwitcher } from "./_components/admin-restaurant-switcher";
import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { isSuperAdmin, getAllRestaurantsAdmin } from "@/app/actions/admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [restaurant, isSuper] = await Promise.all([
    getCurrentRestaurant(),
    isSuperAdmin(),
  ]);

  let allRestaurants: any[] = [];
  if (isSuper) {
    allRestaurants = await getAllRestaurantsAdmin();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav restaurant={restaurant} userEmail={user.email || ""} />

      {/* Main content area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isSuper && restaurant && allRestaurants.length > 0 && (
            <AdminRestaurantSwitcher
              currentRestaurantId={restaurant.id}
              allRestaurants={allRestaurants}
            />
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
