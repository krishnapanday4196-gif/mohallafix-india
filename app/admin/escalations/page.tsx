import React from "react";
import Link from "next/link";
import { AlertTriangle, Clock, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchPublicComplaints } from "@/lib/services/complaintService";

export default async function AdminEscalationsPage() {
  const complaints = await fetchPublicComplaints({ limit: 100 });
  const escalated = complaints.filter(
    (c) => c.status === "ESCALATED" || (c.reopen_count && c.reopen_count > 1)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            High-Priority Escalations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complaints that breached standard turnaround SLA or were repeatedly reopened by citizens.
          </p>
        </div>
      </div>

      {escalated.length === 0 ? (
        <EmptyState
          icon={<ShieldAlert className="w-6 h-6 text-slate-400" />}
          title="No unresolved escalations."
          description="There are currently zero escalated grievances in the database. When an issue exceeds its designated SLA or is flagged by a nodal supervisor, it will be prioritized here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-rose-200 overflow-hidden divide-y divide-rose-50">
          {escalated.map((c) => (
            <div key={c.id} className="p-5 flex items-center justify-between bg-rose-50/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                    {c.tracking_id}
                  </span>
                  <span className="text-xs font-semibold text-rose-700">
                    Escalation Level: {c.escalation_level || 1}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                <p className="text-xs text-slate-500">{c.address}</p>
              </div>

              <Link href={`/admin/complaints/${c.id}`}>
                <Button variant="danger" size="sm" className="text-xs">
                  Intervene Now
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
