import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { fetchPublicComplaints } from "@/lib/services/complaintService";
import { formatDate } from "@/lib/utils";

export default async function OfficerDashboardPage() {
  const complaints = await fetchPublicComplaints({ limit: 10 });
  const assignedComplaints = complaints.filter(
    (c) => c.status === "ASSIGNED" || c.status === "IN_PROGRESS"
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Officer Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Departmental Officer Console
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Assigned Work Order Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Review complaints assigned to your jurisdiction, verify ground issues, upload progress notes, and submit photographic resolution proof.
          </p>
        </div>

        <Link href="/officer/assigned">
          <Button variant="primary" size="md" className="gap-2 shrink-0">
            <Briefcase className="w-4 h-4" /> View All Assigned ({assignedComplaints.length})
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col">
          <span className="text-xs font-medium text-slate-500">Active Work Orders</span>
          <span className="text-2xl font-bold text-slate-900 mt-1">
            {assignedComplaints.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Requiring action</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col">
          <span className="text-xs font-medium text-amber-700">In Progress</span>
          <span className="text-2xl font-bold text-amber-600 mt-1">
            {complaints.filter((c) => c.status === "IN_PROGRESS").length}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Under repair</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col">
          <span className="text-xs font-medium text-emerald-700">Resolved by Officer</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1">
            {complaints.filter((c) => c.status === "RESOLVED" || c.status === "CITIZEN_CONFIRMED").length}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Proof uploaded</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col">
          <span className="text-xs font-medium text-rose-700">SLA Breached / Overdue</span>
          <span className="text-2xl font-bold text-rose-600 mt-1">
            {complaints.filter((c) => c.status === "ESCALATED").length}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Escalated to DM/Admin</span>
        </div>
      </div>

      {/* Assigned Complaints Table / List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Current Assigned Work Orders</h3>
          <span className="text-xs text-slate-400 font-mono">
            {assignedComplaints.length} Pending Actions
          </span>
        </div>

        {assignedComplaints.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="w-6 h-6 text-slate-400" />}
            title="No assigned complaints found."
            description="There are currently zero complaints assigned to your officer account. When administrators assign grievances in your jurisdiction, they will be listed here."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {assignedComplaints.map((c) => (
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
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {c.address}
                      </span>
                      <span>Filed: {formatDate(c.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/officer/complaints/${c.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        Investigate
                      </Button>
                    </Link>
                    <Link href={`/officer/complaints/${c.id}/resolve`}>
                      <Button variant="primary" size="sm" className="text-xs">
                        Submit Proof & Resolve
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
