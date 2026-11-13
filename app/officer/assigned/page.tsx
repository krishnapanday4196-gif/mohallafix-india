import React from "react";
import Link from "next/link";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { fetchPublicComplaints } from "@/lib/services/complaintService";
import { formatDate } from "@/lib/utils";

export default async function OfficerAssignedComplaintsPage() {
  const complaints = await fetchPublicComplaints({ limit: 50 });
  const assigned = complaints.filter(
    (c) => c.status === "ASSIGNED" || c.status === "IN_PROGRESS" || c.status === "REOPENED"
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Assigned Grievance Roster</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complaints actively assigned to your departmental squad requiring on-site action.
          </p>
        </div>
      </div>

      {assigned.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6 text-slate-400" />}
          title="No assigned complaints found."
          description="There are currently zero assigned grievances pending in your queue. When complaints are routed to your department, they will appear here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs divide-y divide-slate-100">
          {assigned.map((c) => (
            <div
              key={c.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {c.tracking_id}
                  </span>
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>

                <h4 className="font-semibold text-slate-900 text-sm">{c.title}</h4>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {c.address}
                  </span>
                  <span>Registered: {formatDate(c.created_at)}</span>
                  {c.category && <span>Category: {c.category.name}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/officer/complaints/${c.id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Investigation View
                  </Button>
                </Link>
                <Link href={`/officer/complaints/${c.id}/progress`}>
                  <Button variant="secondary" size="sm" className="text-xs">
                    Update Progress
                  </Button>
                </Link>
                <Link href={`/officer/complaints/${c.id}/resolve`}>
                  <Button variant="primary" size="sm" className="text-xs">
                    Submit Fix Proof
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
