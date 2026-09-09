import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { getCategories } from "@/app/actions/categories";
import { getMenuItems } from "@/app/actions/items";
import { redirect } from "next/navigation";
import { ItemsManager } from "./_components/items-manager";

export default async function ItemsPage() {
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/dashboard");
  }

  const [categories, items] = await Promise.all([
    getCategories(restaurant.id),
    getMenuItems(restaurant.id),
  ]);

  return (
    <ItemsManager
      items={items}
      categories={categories}
      restaurantId={restaurant.id}
    />
  );
}
