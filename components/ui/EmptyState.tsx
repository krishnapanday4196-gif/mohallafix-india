import React from "react";
import { Inbox, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  isNotConfigured?: boolean;
  className?: string;
}

export function EmptyState({
  title = "No complaints found yet.",
  description = "There are currently no records stored in the database matching your query.",
  icon,
  action,
  isNotConfigured = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed rounded-2xl bg-white/60",
        isNotConfigured ? "border-amber-300 bg-amber-50/40" : "border-slate-200",
        className
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform",
          isNotConfigured
            ? "bg-amber-100 text-amber-700"
            : "bg-slate-100 text-slate-500"
        )}
      >
        {icon ? (
          icon
        ) : isNotConfigured ? (
          <AlertCircle className="w-6 h-6" />
        ) : (
          <Inbox className="w-6 h-6" />
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

