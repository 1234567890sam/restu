import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { getCategories } from "@/app/actions/categories";
import { redirect } from "next/navigation";
import { CategoryManager } from "./_components/category-manager";

export default async function CategoriesPage() {
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/dashboard");
  }

  const categories = await getCategories(restaurant.id);

  return (
    <CategoryManager
      initialCategories={categories}
      restaurantId={restaurant.id}
    />
  );
}
