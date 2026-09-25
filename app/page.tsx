import Link from "next/link";
import {
  QrCode,
  Utensils,
  Sparkles,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Printer,
  ChevronRight,
  Store,
  Star,
} from "lucide-react";
import { Button } from "./_components/ui/button";
import { Badge } from "./_components/ui/badge";
import { LandingHeader } from "./_components/landing-header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Glow ambient spots */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Empowering 200+ Restaurants in Solapur & Maharashtra
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Ditch paper menus. Launch your{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 via-orange-500 to-amber-600">
              Contactless QR Menu
            </span>{" "}
            in 5 minutes.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Customers simply scan the table QR code on their phone. No mobile app download needed. Update prices on the fly, toggle out-of-stock items, and highlight Indian Veg / Non-Veg dishes instantly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-base px-8 py-3.5 shadow-xl shadow-amber-500/25">
                <Store className="w-5 h-5 mr-2" />
                Register Restaurant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-6">
                Open Dashboard Demo
              </Button>
            </Link>
          </div>

          {/* Key Trust Signals */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero Customer App Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>FSSAI Green / Red Indicators</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Table Stand Ready QR Codes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Why Restaurant Owners Love MenuQR
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Built specifically for modern dining & Indian restaurants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Instant Table QR Codes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate high-resolution PNG & SVG vector QR codes. Download ready-to-print table tent cards customized with table numbers.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Never Say &quot;Dish Khatam&quot;
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Toggle dish availability in one tap from your phone. Sold-out dishes immediately reflect as &quot;Unavailable&quot; on customer screens.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Zero Printing Costs
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No more reprinting paper menus every time vegetable or gas prices increase. Update your menu prices in real time with 0 rupee reprint expenses.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Mobile Web Instant Load
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Customers don&apos;t want to download 40MB apps or register accounts. Menus open instantly in any smartphone browser (Chrome, Safari).
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                FSSAI Indian Dietary Filter
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Indian diners prioritize Pure Veg and Non-Veg separation. Our instant filter lets vegetarian families isolate pure veg items with 1 touch.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Custom Branding & Themes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose between Classic Heritage, Modern Bistro, and Compact Diner templates. Apply your restaurant colors and mouthwatering dish photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Simple 3-Step Setup
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              From paper menu to QR tables in under 5 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Create & Add Dishes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Register your restaurant, upload mouthwatering photos, set prices, and categorize with 1-click sample menus.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Print Table Stands
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Download ready-to-print table tent cards customized with table numbers, brand colors, and high-res vector QR codes.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Diners Scan & Order
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Guests scan the table code with their phone camera. No app download needed. Prices and stock update in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Simple, Affordable Pricing
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Transparent Plans For Every Restaurant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Pro */}
            <div className="p-8 rounded-3xl bg-linear-to-b from-amber-500/10 to-amber-500/5 dark:from-amber-950/40 dark:to-slate-900 border-2 border-amber-500 flex flex-col justify-between shadow-xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
                Most Popular for Restaurants
              </div>
              <div className="space-y-4">
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Restaurant Pro
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">₹799</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  For busy dine-in restaurants, cafes, and family hotels.
                </p>
                <div className="space-y-2.5 pt-4 border-t border-amber-200/60 dark:border-amber-900/60 text-xs">
                  {[
                    "Unlimited Menu Items & Categories",
                    "All Templates (Classic, Modern, Compact)",
                    "Custom Brand Colors & Banner Covers",
                    "Table-Specific QR Code Generators",
                    "Printable Table Tent Stand Layouts",
                    "High-Res Vector SVG Downloads",
                    "Priority WhatsApp Support",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/signup" className="pt-8">
                <Button variant="primary" className="w-full shadow-md shadow-amber-500/20">
                  Get Started with Pro
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Multi-Branch Enterprise
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">₹2,499</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  For hotel chains, franchise outlets, and restaurant groups.
                </p>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {["Multiple Branch Locations", "Centralized Menu Sync", "Custom Domain Support", "Sales & Dish View Analytics", "Dedicated Account Manager"].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/signup" className="pt-8">
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (SEO & Schema FAQ) */}
      <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Got Questions?
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Everything you need to know about setting up a contactless QR menu for your restaurant.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is a Contactless Digital QR Menu?",
                a: "A contactless digital QR menu allows restaurant customers to scan a table QR code with their phone camera and immediately view the full food menu, complete with pictures, descriptions, veg/non-veg tags, and live prices without touching a physical paper menu or downloading an app.",
              },
              {
                q: "Do customers need to download any mobile app to view the menu?",
                a: "No! Customers do not need to download any application. Any smartphone camera (iPhone or Android) scans the QR code and opens the ultra-fast web menu instantly in their mobile browser.",
              },
              {
                q: "Can I update food prices and mark items out of stock in real-time?",
                a: "Yes, absolutely. Changes made from your restaurant owner dashboard reflect immediately on customers' screens without having to re-print QR codes or physical menu cards.",
              },
              {
                q: "Does MenuQR support Indian FSSAI Veg and Non-Veg dietary markers?",
                a: "Yes! MenuQR natively supports green (Pure Veg), red (Non-Veg), and vegan markers, along with spicy levels and beverage categories specifically tuned for Indian restaurant dining.",
              },
              {
                q: "Can I print table stand QR codes for each table?",
                a: "Yes. MenuQR comes with an instant printable Table Stand QR Code generator. You can print table tents, acrylic stand inserts, and sticker layouts in one click with your restaurant logo and table numbers.",
              },
              {
                q: "How fast can I set up my restaurant menu?",
                a: "You can register, upload your dishes or seed our pre-filled popular Indian cuisine menu, and generate your printable table QR codes in under 5 minutes.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl bg-white dark:bg-slate-850 p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs open:shadow-md transition-all duration-200"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none text-base font-bold text-slate-900 dark:text-white group-open:text-amber-600 dark:group-open:text-amber-400">
                  <span>{faq.q}</span>
                  <span className="ml-4 transition-transform duration-200 group-open:rotate-180 text-slate-400">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Solapur Pilot Section */}
      <section id="solapur" className="py-16 bg-amber-500 text-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Proudly Built for Solapur Hospitality
            </h2>
            <p className="text-amber-950/80 text-sm max-w-xl">
              From Saat Rasta to Navi Peth, join Solapur&apos;s leading thali joints, biryani houses, and cafés modernizing their guest experience.
            </p>
          </div>
          <Link href="/signup">
            <Button
              variant="secondary"
              size="lg"
              className="bg-slate-950 text-white hover:bg-slate-900 font-bold px-8 shadow-xl"
            >
              Register Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              MenuQR SaaS
            </span>
            <span>• Solapur, Maharashtra</span>
          </div>
          <p>© {new Date().getFullYear()} MenuQR SaaS Platform. All rights reserved.</p>
        </div>
      </footer>

      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://menurestu.vercel.app/#website",
                "url": "https://menurestu.vercel.app",
                "name": "MenuQR SaaS",
                "description": "Contactless Digital QR Menu for Restaurants in India & Worldwide",
                "inLanguage": "en-IN"
              },
              {
                "@type": "Organization",
                "@id": "https://menurestu.vercel.app/#organization",
                "name": "MenuQR SaaS",
                "url": "https://menurestu.vercel.app",
                "logo": "https://menurestu.vercel.app/favicon.svg"
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://menurestu.vercel.app/#software",
                "name": "MenuQR",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All (Web, iOS, Android)",
                "url": "https://menurestu.vercel.app",
                "description": "Contactless QR digital menu platform for restaurants, cafes, and hotels. Features live price updates, Indian veg/non-veg tags, and instant table stands.",
                "offers": {
                  "@type": "AggregateOffer",
                  "lowPrice": "0",
                  "highPrice": "2499",
                  "priceCurrency": "INR",
                  "offerCount": "3"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "248",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "FAQPage",
                "@id": "https://menurestu.vercel.app/#faq",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is a Contactless Digital QR Menu?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "A contactless digital QR menu allows restaurant customers to scan a table QR code with their phone camera and immediately view the full food menu, complete with pictures, descriptions, veg/non-veg tags, and live prices without touching a physical paper menu or downloading an app."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do customers need to download any mobile app to view the menu?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No! Customers do not need to download any application. Any smartphone camera (iPhone or Android) scans the QR code and opens the ultra-fast web menu instantly in their mobile browser."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I update food prices and mark items out of stock in real-time?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, absolutely. Changes made from your restaurant owner dashboard reflect immediately on customers' screens without having to re-print QR codes or physical menu cards."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does MenuQR support Indian FSSAI Veg and Non-Veg dietary markers?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! MenuQR natively supports green (Pure Veg), red (Non-Veg), and vegan markers, along with spicy levels and beverage categories specifically tuned for Indian restaurant dining."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I print table stand QR codes for each table?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. MenuQR comes with an instant printable Table Stand QR Code generator. You can print table tents, acrylic stand inserts, and sticker layouts in one click with your restaurant logo and table numbers."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How fast can I set up my restaurant menu?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "You can register, upload your dishes or seed our pre-filled popular Indian cuisine menu, and generate your printable table QR codes in under 5 minutes."
                    }
                  }
                ]
              }
            ]
          }),
        }}
      />
    </div>
  );
}
