"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "@/app/actions/auth";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/_components/ui/card";
import { AlertCircle, CheckCircle2, ArrowRight, Store, Globe } from "lucide-react";
import { slugify } from "@/lib/utils";

export default function SignupPage() {
  const [restaurantName, setRestaurantName] = useState("");
  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(
    signup,
    null
  );

  const previewSlug = slugify(restaurantName) || "your-restaurant";

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-xl backdrop-blur-xs">
      <CardHeader className="space-y-1 text-center sm:text-left pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create Restaurant Account
        </CardTitle>
        <CardDescription>
          Launch your contactless QR digital menu in under 2 minutes
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Error Alert */}
        {state?.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-sm text-red-700 dark:text-red-300 animate-in fade-in-50">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-semibold">Registration error</p>
              <p className="text-xs mt-0.5 text-red-600 dark:text-red-400">
                {state.error}
              </p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {state?.success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3 text-sm text-emerald-700 dark:text-emerald-300 animate-in fade-in-50">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
            <div>
              <p className="font-semibold">Account created successfully!</p>
              <p className="text-xs mt-0.5 text-emerald-600 dark:text-emerald-400">
                {state.success}
              </p>
            </div>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <Input
              id="restaurantName"
              name="restaurantName"
              type="text"
              label="Restaurant Name"
              placeholder="e.g. Hotel Panchratna, Solapur"
              required
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
            {/* Live slug URL preview */}
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Menu Link: </span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold truncate">
                /r/{previewSlug}
              </span>
            </div>
          </div>

          <Input
            id="fullName"
            name="fullName"
            type="text"
            label="Owner / Manager Full Name"
            placeholder="e.g. Rajesh Patil"
            required
            autoComplete="name"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="phone"
              name="phone"
              type="tel"
              label="Contact Phone"
              placeholder="+91 98765 43210"
              autoComplete="tel"
            />

            <Input
              id="city"
              name="city"
              type="text"
              label="City / Location"
              placeholder="Solapur"
              defaultValue="Solapur"
            />
          </div>

          <Input
            id="email"
            name="email"
            type="email"
            label="Business Email"
            placeholder="contact@panchratna.com"
            required
            autoComplete="email"
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isPending}
            >
              <Store className="w-4 h-4 mr-1.5" />
              Create My Digital Menu
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>

        <p className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
          By registering, you agree to our Terms of Service & Privacy Policy.
        </p>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-400">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400 hover:underline"
          >
            Sign in to your account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
