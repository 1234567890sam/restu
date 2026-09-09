import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { redirect } from "next/navigation";
import { AppearanceManager } from "./_components/appearance-manager";

export default async function AppearancePage() {
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/dashboard");
  }

  return <AppearanceManager restaurant={restaurant} />;
}
