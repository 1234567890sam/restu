import { getCurrentRestaurant } from "@/app/actions/restaurant";
import { getCategories } from "@/app/actions/categories";
import { getMenuItem } from "@/app/actions/items";
import { redirect, notFound } from "next/navigation";
import { ItemForm } from "../_components/item-form";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/dashboard");
  }

  const [categories, item] = await Promise.all([
    getCategories(restaurant.id),
    getMenuItem(id),
  ]);

  if (!item || item.restaurant_id !== restaurant.id) {
    notFound();
  }

  return (
    <ItemForm
      categories={categories}
      restaurantId={restaurant.id}
      initialData={item}
    />
  );
}
