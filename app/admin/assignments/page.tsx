import React from "react";
import Link from "next/link";
import { Briefcase, Building2, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchPublicComplaints } from "@/lib/services/complaintService";

export default async function AdminAssignmentsPage() {
  const complaints = await fetchPublicComplaints({ limit: 100 });
  const pendingAssignment = complaints.filter(
    (c) => c.status === "SUBMITTED" || c.status === "UNDER_REVIEW" || c.status === "VERIFIED"
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Work Order Assignment Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Route incoming citizen grievances to appropriate municipal departments and nodal engineers.
          </p>
        </div>
      </div>

      {pendingAssignment.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6 text-slate-400" />}
          title="No grievances pending assignment."
          description="All submitted complaints have been routed and assigned to responsible departmental officers."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {pendingAssignment.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {c.tracking_id}
                  </span>
                  <span className="text-xs text-slate-400">Status: {c.status}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                <p className="text-xs text-slate-500">{c.address}</p>
              </div>

              <Link href={`/admin/complaints/${c.id}`}>
                <Button variant="primary" size="sm" className="text-xs">
                  Dispatch & Assign
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
