import Link from "next/link";
import { Utensils, QrCode, Sparkles, CheckCircle2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      {/* Left panel / Hero branding (Hidden on small screens) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-amber-600 via-amber-700 to-stone-900 text-white relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Menu<span className="text-amber-300">QR</span>
              </span>
              <span className="text-xs uppercase tracking-widest text-amber-200/80 block font-medium">
                Solapur Digital Menu SaaS
              </span>
            </div>
          </Link>
        </div>

        {/* Middle: Value propositions */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs font-semibold uppercase tracking-wider mb-6 border border-white/15">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Empowering 200+ Restaurants
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
            Turn diners into instant fans with touch-free QR menus.
          </h1>

          <p className="text-amber-100/80 text-base leading-relaxed mb-8">
            Create your restaurant&apos;s digital menu in under 5 minutes. Change prices on the fly, showcase mouthwatering photos, and delight customers without paper menus.
          </p>

          <div className="space-y-3.5">
            {[
              "Instant QR Code generation & table tent prints",
              "100% Mobile friendly — zero customer app downloads",
              "Pure Veg / Non-Veg tagging for Indian cuisine",
              "Real-time item availability toggles (Never say 'item khatam')",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm text-amber-50">
                <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Testimonial & Footer */}
        <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-amber-200/70">
          <p>© {new Date().getFullYear()} MenuQR SaaS. Built for Indian Hospitality.</p>
          <div className="flex items-center gap-1 text-amber-200">
            <Utensils className="w-4 h-4 text-amber-400" />
            <span>Solapur Special</span>
          </div>
        </div>
      </div>

      {/* Right panel / Form area */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo View */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              Menu<span className="text-amber-500">QR</span>
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
