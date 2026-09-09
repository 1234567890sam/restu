"use client";

import { useState } from "react";
import type { Restaurant } from "@/lib/database.types";
import {
  updateRestaurantStatusAdmin,
  updateRestaurantPlanAdmin,
  approveRestaurantAdmin,
  rejectRestaurantAdmin,
  deleteRestaurantAdmin,
  switchAdminActiveRestaurant,
  verifyUserEmailAdmin,
  type RestaurantWithStats,
} from "@/app/actions/admin";
import { seedSampleMenuForRestaurant } from "@/app/actions/seed-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Button } from "@/app/_components/ui/button";
import { toast } from "sonner";
import {
  Search,
  ExternalLink,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Phone,
  Ban,
  Plus,
  Edit,
  Trash2,
  LayoutDashboard,
  UtensilsCrossed,
  Sparkles,
  User,
  FolderTree,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreateRestaurantModal } from "./create-restaurant-modal";
import { EditRestaurantModal } from "./edit-restaurant-modal";

interface AdminRestaurantsTableProps {
  initialRestaurants: RestaurantWithStats[];
}

type TabType = "all" | "pending" | "active" | "suspended";

export function AdminRestaurantsTable({
  initialRestaurants,
}: AdminRestaurantsTableProps) {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[]>(initialRestaurants);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<RestaurantWithStats | null>(null);

  const pendingCount = restaurants.filter(
    (r) =>
      (r as any).status === "pending" ||
      (!r.is_active && (r as any).status !== "suspended" && (r as any).status !== "rejected")
  ).length;

  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase()) ||
      (r.owner_email && r.owner_email.toLowerCase().includes(search.toLowerCase())) ||
      (r.owner_name && r.owner_name.toLowerCase().includes(search.toLowerCase())) ||
      (r.city && r.city.toLowerCase().includes(search.toLowerCase())) ||
      (r.phone && r.phone.toLowerCase().includes(search.toLowerCase()));

    const status = (r as any).status || (r.is_active ? "active" : "pending");

    if (!matchesSearch) return false;

    if (activeTab === "all") return true;
    if (activeTab === "pending") return status === "pending";
    if (activeTab === "active") return status === "active" && r.is_active;
    if (activeTab === "suspended")
      return status === "suspended" || status === "rejected" || (!r.is_active && status !== "pending");
    return true;
  });

  const handleApprove = async (restaurant: RestaurantWithStats) => {
    setLoadingId(restaurant.id);
    try {
      const res = await approveRestaurantAdmin(restaurant.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        setRestaurants(
          restaurants.map((r) =>
            r.id === restaurant.id
              ? { ...r, is_active: true, status: "active" as any }
              : r
          )
        );
        toast.success(`🎉 ${restaurant.name} has been approved and activated!`);
      }
    } catch {
      toast.error("Failed to approve restaurant");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (restaurant: RestaurantWithStats) => {
    if (!confirm(`Are you sure you want to reject/suspend ${restaurant.name}?`)) return;

    setLoadingId(restaurant.id);
    try {
      const res = await rejectRestaurantAdmin(restaurant.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        setRestaurants(
          restaurants.map((r) =>
            r.id === restaurant.id
              ? { ...r, is_active: false, status: "rejected" as any }
              : r
          )
        );
        toast.error(`${restaurant.name} marked as rejected.`);
      }
    } catch {
      toast.error("Failed to reject restaurant");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleActive = async (restaurant: RestaurantWithStats) => {
    const nextStatus = !restaurant.is_active;
    setLoadingId(restaurant.id);
    try {
      const res = await updateRestaurantStatusAdmin(
        restaurant.id,
        nextStatus,
        nextStatus ? "active" : "suspended"
      );
      if (res.error) {
        toast.error(res.error);
      } else {
        setRestaurants(
          restaurants.map((r) =>
            r.id === restaurant.id
              ? {
                  ...r,
                  is_active: nextStatus,
                  status: (nextStatus ? "active" : "suspended") as any,
                }
              : r
          )
        );
        toast.success(
          `${restaurant.name} marked as ${nextStatus ? "Active" : "Suspended"}`
        );
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const handleChangePlan = async (restaurantId: string, newPlan: string) => {
    const res = await updateRestaurantPlanAdmin(restaurantId, newPlan);
    if (res.error) {
      toast.error(res.error);
    } else {
      setRestaurants(
        restaurants.map((r) =>
          r.id === restaurantId ? { ...r, subscription_plan: newPlan as any } : r
        )
      );
      toast.success("Subscription plan updated!");
    }
  };

  const handleManageInDashboard = async (restaurant: RestaurantWithStats) => {
    setLoadingId(restaurant.id);
    try {
      const res = await switchAdminActiveRestaurant(restaurant.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Opening Dashboard for "${restaurant.name}"...`);
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to switch active restaurant");
    } finally {
      setLoadingId(null);
    }
  };

  const handleSeedMenu = async (restaurant: RestaurantWithStats) => {
    if (
      !confirm(
        `Do you want to populate sample Solapuri categories & dishes for "${restaurant.name}"?`
      )
    )
      return;

    setLoadingId(restaurant.id);
    try {
      const res = await seedSampleMenuForRestaurant(restaurant.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "Sample menu populated successfully!");
        setRestaurants(
          restaurants.map((r) =>
            r.id === restaurant.id
              ? {
                  ...r,
                  categories_count: (r.categories_count || 0) + 5,
                  items_count: (r.items_count || 0) + 10,
                }
              : r
          )
        );
      }
    } catch {
      toast.error("Failed to seed sample menu");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteRestaurant = async (restaurant: RestaurantWithStats) => {
    const confirmed = prompt(
      `⚠️ PERMANENT DELETION WARNING:\nThis will permanently delete "${restaurant.name}" and all its dishes, categories, and QR codes.\n\nTo confirm, type the restaurant name below:\n${restaurant.name}`
    );

    if (confirmed !== restaurant.name) {
      if (confirmed !== null) {
        toast.error("Restaurant name did not match. Deletion cancelled.");
      }
      return;
    }

    setLoadingId(restaurant.id);
    try {
      const res = await deleteRestaurantAdmin(restaurant.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        setRestaurants(restaurants.filter((r) => r.id !== restaurant.id));
        toast.success(`🗑️ "${restaurant.name}" deleted permanently.`);
      }
    } catch {
      toast.error("Failed to delete restaurant");
    } finally {
      setLoadingId(null);
    }
  };

  const handleVerifyEmail = async (ownerId: string, email?: string) => {
    setLoadingId(ownerId);
    try {
      const res = await verifyUserEmailAdmin(ownerId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`✨ Email for ${email || "user"} verified successfully!`);
        setRestaurants(
          restaurants.map((r) =>
            r.owner_id === ownerId ? { ...r, owner_email_verified: true } : r
          )
        );
      }
    } catch {
      toast.error("Failed to verify email");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Restaurant Approvals & Management
            </h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                <Clock className="w-3 h-3" />
                {pendingCount} Pending Approval
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Complete management of all restaurants: Edit profiles, manage menus, switch to owner dashboard, approve or delete.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search name, owner, slug, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-9 px-4 flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Restaurant</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "all"
              ? "bg-slate-700 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          All ({restaurants.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === "pending"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "text-amber-400/80 hover:text-amber-300 hover:bg-slate-800/50"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending Approvals
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === "active"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active ({restaurants.filter((r) => r.is_active).length})
        </button>
        <button
          onClick={() => setActiveTab("suspended")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === "suspended"
              ? "bg-red-500/20 text-red-300 border border-red-500/30"
              : "text-slate-400 hover:text-red-400 hover:bg-slate-800/50"
          }`}
        >
          <Ban className="w-3.5 h-3.5" />
          Suspended / Rejected
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/40">
        <Table>
          <TableHeader className="bg-slate-800 text-slate-300">
            <TableRow className="border-slate-700">
              <TableHead className="min-w-[220px]">Restaurant & Owner</TableHead>
              <TableHead className="min-w-[150px]">Location & Contact</TableHead>
              <TableHead className="min-w-[130px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Plan</TableHead>
              <TableHead className="min-w-[130px]">Menu Content</TableHead>
              <TableHead className="text-right min-w-[220px]">Management Operations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="border-slate-700">
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle className="w-8 h-8 text-slate-500" />
                    <p>No restaurants found in this category.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => {
                const status = (r as any).status || (r.is_active ? "active" : "pending");
                const isPending = status === "pending";
                const isLoading = loadingId === r.id;

                return (
                  <TableRow
                    key={r.id}
                    className={`border-slate-700/60 hover:bg-slate-800/60 transition-colors ${
                      isPending ? "bg-amber-950/10 border-l-2 border-l-amber-500" : ""
                    }`}
                  >
                    {/* Restaurant Name & Owner */}
                    <TableCell>
                      <div>
                        <span className="font-bold text-white text-base block">
                          {r.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400 font-mono">
                            /r/{r.slug}
                          </span>
                          {r.is_active && (
                            <Link
                              href={`/r/${r.slug}`}
                              target="_blank"
                              className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-0.5 text-xs"
                              title="Open Customer Live Menu"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>

                        {/* Owner & Verification Status */}
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <User className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate max-w-[180px]" title={r.owner_email}>
                              {r.owner_email || "No owner"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                            {r.owner_email_verified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  <AlertCircle className="w-2.5 h-2.5" />
                                  <span>Unverified</span>
                                </span>
                                <button
                                  type="button"
                                  disabled={loadingId === r.owner_id}
                                  onClick={() => handleVerifyEmail(r.owner_id, r.owner_email)}
                                  className="text-[10px] uppercase font-bold text-amber-300 hover:text-white bg-amber-500/25 hover:bg-amber-500/40 px-2 py-0.5 rounded border border-amber-500/40 transition-colors cursor-pointer"
                                  title="Super Admin: Manually verify this user's email address"
                                >
                                  {loadingId === r.owner_id ? "..." : "Verify"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Location & Contact */}
                    <TableCell className="text-slate-300">
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-slate-200">
                          {r.city || "Solapur"}, {r.state || "MH"}
                        </div>
                        {r.phone ? (
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{r.phone}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">No phone</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      {isPending ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          Pending Approval
                        </span>
                      ) : r.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          {status === "rejected" ? "Rejected" : "Suspended"}
                        </span>
                      )}
                    </TableCell>

                    {/* Plan Selector */}
                    <TableCell>
                      <select
                        value={r.subscription_plan}
                        onChange={(e) => handleChangePlan(r.id, e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-700 border border-slate-600 text-white cursor-pointer"
                      >
                        <option value="pro">Pro (₹799/mo)</option>
                        <option value="enterprise">Enterprise (₹2,499/mo)</option>
                        <option value="basic">Basic (₹499/mo)</option>
                        <option value="free">Free</option>
                      </select>
                    </TableCell>

                    {/* Menu Content Stats */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                          <span>{r.items_count || 0} Dishes</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <FolderTree className="w-3.5 h-3.5 text-slate-500" />
                          <span>{r.categories_count || 0} Categories</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Management Operations Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* 1. Open / Manage in Dashboard */}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => handleManageInDashboard(r)}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs h-8 px-2.5 flex items-center gap-1 cursor-pointer"
                          title="Open and manage this restaurant in Dashboard"
                        >
                          {isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <LayoutDashboard className="w-3.5 h-3.5" />
                          )}
                          <span>Manage</span>
                        </Button>

                        {/* 2. Edit Profile Modal */}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => setEditingRestaurant(r)}
                          className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-xs h-8 px-2.5 flex items-center gap-1 cursor-pointer"
                          title="Edit restaurant details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Button>

                        {/* 3. Approve / Reject OR Suspend Toggle */}
                        {isPending ? (
                          <>
                            <Button
                              size="sm"
                              disabled={isLoading}
                              onClick={() => handleApprove(r)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 px-2.5 flex items-center gap-1 cursor-pointer"
                              title="Approve & Activate"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isLoading}
                              onClick={() => handleReject(r)}
                              className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs h-8 px-2 cursor-pointer"
                              title="Reject Application"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => handleToggleActive(r)}
                            className={`text-xs h-8 px-2.5 border cursor-pointer ${
                              r.is_active
                                ? "border-slate-700 text-slate-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10"
                                : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                            title={r.is_active ? "Suspend access" : "Re-activate restaurant"}
                          >
                            {r.is_active ? "Suspend" : "Activate"}
                          </Button>
                        )}

                        {/* 4. Seed Menu Action */}
                        {(r.items_count === 0 || !r.items_count) && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => handleSeedMenu(r)}
                            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs h-8 px-2 cursor-pointer"
                            title="Seed 10 sample dishes & 5 categories"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Seed</span>
                          </Button>
                        )}

                        {/* 5. Delete Restaurant */}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => handleDeleteRestaurant(r)}
                          className="border-red-500/20 text-red-400/80 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/40 text-xs h-8 px-2 cursor-pointer"
                          title="Permanently delete restaurant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Direct Restaurant Creation Modal */}
      <CreateRestaurantModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newRest) => {
          setRestaurants((prev) => [
            {
              ...newRest,
              categories_count: 0,
              items_count: 0,
              owner_email: (newRest as any).owner_email || "New Account",
              owner_name: (newRest as any).owner_name || newRest.name,
            },
            ...prev,
          ]);
        }}
      />

      {/* Edit Restaurant Modal */}
      <EditRestaurantModal
        restaurant={editingRestaurant}
        isOpen={!!editingRestaurant}
        onClose={() => setEditingRestaurant(null)}
        onSuccess={(updated) => {
          setRestaurants((prev) =>
            prev.map((r) =>
              r.id === updated.id
                ? {
                    ...r,
                    ...updated,
                  }
                : r
            )
          );
        }}
      />
    </div>
  );
}
