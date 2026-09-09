import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { Check, CreditCard, Sparkles, Zap } from "lucide-react";

const PLANS = [
  {
    name: "Restaurant Pro",
    price: "₹799",
    period: "/month",
    description: "For busy restaurants, cafes, and hotels wanting full branding control",
    features: [
      "Unlimited Menu items & Categories",
      "All Premium Templates (Classic, Modern, Compact)",
      "Custom Brand Colors & Banner Covers",
      "Vector SVG QR code & Printable Table Stands",
      "Table number specific QR codes",
      "Priority WhatsApp & phone support",
    ],
    highlight: true,
  },
  {
    name: "Multi-Outlet Enterprise",
    price: "₹2,499",
    period: "/month",
    description: "For restaurant chains and multi-branch hospitality groups",
    features: [
      "Multiple Restaurant branch management",
      "Centralized menu item syncing",
      "Custom domain support (menu.yourhotel.com)",
      "Analytics & most-viewed dish reports",
      "Dedicated account manager",
    ],
    highlight: false,
  },
];

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Subscription Tiers & Pricing Plans
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review and configure monetization tiers for MenuQR SaaS in the Solapur & Maharashtra market.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`p-6 rounded-3xl border flex flex-col justify-between ${
              plan.highlight
                ? "bg-slate-800/90 border-amber-500/80 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40"
                : "bg-slate-800/40 border-slate-700/80"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">{plan.name}</span>
                {plan.highlight && (
                  <Badge variant="brand" className="text-xs uppercase font-bold">
                    Popular
                  </Badge>
                )}
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{plan.price}</span>
                <span className="text-xs text-slate-400">{plan.period}</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {plan.description}
              </p>

              <div className="pt-4 border-t border-slate-700/60 space-y-2.5">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
