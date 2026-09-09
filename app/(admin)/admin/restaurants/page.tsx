import { getAllRestaurantsWithStatsAdmin } from "@/app/actions/admin";
import { AdminRestaurantsTable } from "./_components/admin-restaurants-table";

export default async function AdminRestaurantsPage() {
  const restaurants = await getAllRestaurantsWithStatsAdmin();

  return <AdminRestaurantsTable initialRestaurants={restaurants} />;
}
