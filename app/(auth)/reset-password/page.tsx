"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword, type AuthState } from "@/app/actions/auth";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/_components/ui/card";
import { AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(
    resetPassword,
    null
  );

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-xl backdrop-blur-xs">
      <CardHeader className="space-y-1 text-center sm:text-left pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Set new password
        </CardTitle>
        <CardDescription>
          Choose a strong password to protect your restaurant dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state?.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-sm text-red-700 dark:text-red-300 animate-in fade-in-50">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <p className="text-xs">{state.error}</p>
          </div>
        )}

        {state?.success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3 text-sm text-emerald-700 dark:text-emerald-300 animate-in fade-in-50">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
            <p className="text-xs">{state.success}</p>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <Input
            id="password"
            name="password"
            type="password"
            label="New password"
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            placeholder="Re-enter password"
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isPending}
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
