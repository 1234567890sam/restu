"use client";

import { useState } from "react";
import Link from "next/link";
import { QrCode, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
              Menu<span className="text-amber-500">QR</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-amber-500 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-amber-500 transition-colors">
            How it Works
          </a>
          <a href="#pricing" className="hover:text-amber-500 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-amber-500 transition-colors">
            FAQ
          </a>
          <a href="#solapur" className="hover:text-amber-500 transition-colors">
            Solapur Pilot
          </a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm" className="shadow-md shadow-amber-500/20">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-4 space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Pricing Plans
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              FAQ
            </a>
            <a
              href="#solapur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Solapur Hospitality Pilot
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <Link href="/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="sm" className="w-full">
                Register Restaurant
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
