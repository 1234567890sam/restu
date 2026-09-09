"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login, type AuthState } from "@/app/actions/auth";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/_components/ui/card";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(
    login,
    null
  );

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-xl backdrop-blur-xs">
      <CardHeader className="space-y-1 text-center sm:text-left pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>
          Enter your credentials to manage your restaurant menu
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Error Alert */}
        {(state?.error || errorParam) && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-sm text-red-700 dark:text-red-300 animate-in fade-in-50">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-semibold">Sign in failed</p>
              <p className="text-xs mt-0.5 text-red-600 dark:text-red-400">
                {state?.error || errorParam}
              </p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {state?.success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3 text-sm text-emerald-700 dark:text-emerald-300 animate-in fade-in-50">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
            <p className="text-xs">{state.success}</p>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirectUrl} />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="owner@restaurant.com"
            required
            autoComplete="email"
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isPending}
          >
            Sign in to Dashboard
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-400">
          New to MenuQR?{" "}
          <Link
            href="/signup"
            className="font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400 hover:underline"
          >
            Register your Restaurant
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-sm">
          Loading sign in...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
