import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { redirect } from "next/navigation";
import { ProfileForm } from "./_components/profile-form";

export default async function ProfilePage() {
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/dashboard");
  }

  return <ProfileForm restaurant={restaurant} />;
}
