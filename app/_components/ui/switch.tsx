"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, checked, onChange, disabled, id, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-") : generatedId);

    return (
      <label
        htmlFor={switchId}
        className={cn(
          "flex items-start justify-between gap-4 cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {label}
              </span>
            )}
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="relative inline-flex items-center shrink-0">
          <input
            type="checkbox"
            id={switchId}
            ref={ref}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-amber-500/20 dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-600 rounded-full transition-colors"></div>
        </div>
      </label>
    );
  }
);

Switch.displayName = "Switch";
