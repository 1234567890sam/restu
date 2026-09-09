import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { redirect } from "next/navigation";
import { QRManager } from "./_components/qr-manager";

export default async function QRPage() {
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/dashboard");
  }

  return <QRManager restaurant={restaurant} />;
}
