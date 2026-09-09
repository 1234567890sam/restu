import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { getCategories } from "@/app/actions/categories";
import { redirect } from "next/navigation";
import { ItemForm } from "../_components/item-form";

export default async function NewItemPage() {
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/dashboard");
  }

  const categories = await getCategories(restaurant.id);

  return (
    <ItemForm
      categories={categories}
      restaurantId={restaurant.id}
    />
  );
}
