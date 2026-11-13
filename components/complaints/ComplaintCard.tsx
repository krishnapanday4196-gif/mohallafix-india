import React from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Building,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Complaint } from "@/types/database";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface ComplaintCardProps {
  complaint: Complaint;
  href?: string;
}

export function ComplaintCard({ complaint, href }: ComplaintCardProps) {
  const detailUrl = href || `/complaints/${complaint.id}`;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-[0_4px_20px_rgba(5,150,105,0.06)] transition-all flex flex-col justify-between group">
      <div>
        {/* Top meta row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {complaint.tracking_id}
            </span>
            <PriorityBadge priority={complaint.priority} />
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        {/* Title & Description */}
        <Link href={detailUrl} className="block group-hover:text-emerald-700 transition-colors">
          <h4 className="font-semibold text-slate-900 text-base leading-snug line-clamp-1 mb-1">
            {complaint.title}
          </h4>
        </Link>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {complaint.description}
        </p>

        {/* Location & Department */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{complaint.address || "Location not specified"}</span>
            {complaint.pincode && (
              <span className="text-slate-400 font-mono text-[11px]">({complaint.pincode})</span>
            )}
          </div>
          {complaint.category && (
            <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-500">
              <span className="font-medium text-slate-700">Category:</span>
              <span className="truncate">{complaint.category.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer row */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(complaint.created_at)}</span>
        </div>
        <Link
          href={detailUrl}
          className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-transform"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

