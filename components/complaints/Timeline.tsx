import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ComplaintStatusHistory } from "@/types/database";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

interface TimelineProps {
  history: ComplaintStatusHistory[];
}

export function Timeline({ history }: TimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-500 italic">
        No status transitions recorded yet.
      </div>
    );
  }

  // Sort chronologically (oldest to newest or newest to oldest)
  const sorted = [...history].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {sorted.map((item, idx) => {
        const isLatest = idx === sorted.length - 1;
        const isResolved =
          item.new_status === "RESOLVED" || item.new_status === "CITIZEN_CONFIRMED";
        const isNegative =
          item.new_status === "REJECTED" ||
          item.new_status === "REOPENED" ||
          item.new_status === "ESCALATED";

        return (
          <div key={item.id} className="relative group">
            {/* Timeline node */}
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                isResolved
                  ? "bg-emerald-600 border-white text-white"
                  : isNegative
                  ? "bg-rose-500 border-white text-white"
                  : isLatest
                  ? "bg-emerald-100 border-emerald-600 text-emerald-800"
                  : "bg-white border-slate-300 text-slate-400"
              }`}
            >
              {isResolved ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : isNegative ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-2.5 h-2.5" />
              )}
            </div>

            {/* Event details */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {item.previous_status && (
                    <>
                      <StatusBadge status={item.previous_status} />
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </>
                  )}
                  <StatusBadge status={item.new_status} />
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {formatDateTime(item.created_at)}
                </span>
              </div>

              {item.reason && (
                <p className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-900">Notes:</span> {item.reason}
                </p>
              )}

              {item.evidence_media_url && (
                <div className="pt-1">
                  <a
                    href={item.evidence_media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline font-medium"
                  >
                    <ExternalLink className="w-3 h-3" /> View Transition Evidence
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

