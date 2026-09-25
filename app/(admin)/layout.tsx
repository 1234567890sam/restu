import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  Store,
  CreditCard,
  LayoutDashboard,
  LogOut,
  QrCode,
  ArrowLeft,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { AdminNav } from "./_components/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  // Check role using admin client to prevent any RLS blockage
  const adminClient = createAdminClient();
  const { data: profile } = await (adminClient as any)
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // If not super_admin, redirect to restaurant dashboard
  if ((profile as any)?.role !== "super_admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white block">
                MenuQR Admin
              </span>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono">
                Super Admin Console
              </span>
            </div>
          </div>

          <AdminNav />
        </div>

        <div className="pt-6 border-t border-slate-800">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Admin</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
