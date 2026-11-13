import React from "react";
import { cn } from "@/lib/utils";
import { ComplaintStatus, ComplaintPriority } from "@/types/database";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  children: React.ReactNode;
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    outline: "bg-transparent text-slate-600 border-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const map: Record<ComplaintStatus, { label: string; variant: BadgeProps["variant"] }> = {
    SUBMITTED: { label: "Submitted", variant: "default" },
    UNDER_REVIEW: { label: "Under Review", variant: "info" },
    VERIFIED: { label: "Verified", variant: "info" },
    ASSIGNED: { label: "Assigned", variant: "warning" },
    IN_PROGRESS: { label: "In Progress", variant: "warning" },
    RESOLVED: { label: "Resolved", variant: "success" },
    CITIZEN_CONFIRMED: { label: "Citizen Confirmed", variant: "success" },
    REJECTED: { label: "Rejected", variant: "danger" },
    REOPENED: { label: "Reopened", variant: "danger" },
    ESCALATED: { label: "Escalated", variant: "danger" },
  };

  const current = map[status] || { label: status, variant: "default" };
  return <Badge variant={current.variant}>{current.label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: ComplaintPriority }) {
  const map: Record<ComplaintPriority, { label: string; variant: BadgeProps["variant"] }> = {
    LOW: { label: "Low", variant: "default" },
    MEDIUM: { label: "Medium", variant: "info" },
    HIGH: { label: "High", variant: "warning" },
    CRITICAL: { label: "Critical", variant: "danger" },
  };

  const current = map[priority] || { label: priority, variant: "default" };
  return <Badge variant={current.variant}>{current.label}</Badge>;
}

