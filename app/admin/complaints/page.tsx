import React from "react";
import Link from "next/link";
import { FileText, Search, Filter, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { fetchPublicComplaints } from "@/lib/services/complaintService";

export default async function AdminComplaintsPage() {
  const complaints = await fetchPublicComplaints({ limit: 100 });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Central Grievance Monitoring & Audit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit, verify, reassign, or escalate all complaints recorded in the system.
          </p>
        </div>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints registered yet."
          description="There are currently zero complaints recorded in the database. When citizens file issues, administrators can manage assignments, verify progress, and handle escalations here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {complaints.map((c) => (
            <ComplaintCard
              key={c.id}
              complaint={c}
              href={`/admin/complaints/${c.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
