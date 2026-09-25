import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { redirect } from "next/navigation";
import { getMenuUrl } from "@/lib/qr";
import { QRManager } from "./_components/qr-manager";

export default async function QRPage() {
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/dashboard");
  }

  const initialMenuUrl = getMenuUrl(restaurant.slug);

  return <QRManager restaurant={restaurant} initialMenuUrl={initialMenuUrl} />;
}
