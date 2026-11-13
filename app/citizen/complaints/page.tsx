import React from "react";
import Link from "next/link";
import { Plus, Search, Filter, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { fetchPublicComplaints } from "@/lib/services/complaintService";

export default async function CitizenComplaintsPage() {
  const complaints = await fetchPublicComplaints({ limit: 50 });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Registered Grievances</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time investigation stages, officer evidence, and resolution confirmation.
          </p>
        </div>

        <Link href="/citizen/submit">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> File New Grievance
          </Button>
        </Link>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints found yet."
          description="You haven't filed any infrastructure grievances yet. Every grievance you submit will be recorded with genuine timestamps, officer assignments, and resolution tracking."
          action={
            <Link href="/citizen/submit">
              <Button variant="primary" size="sm">
                File a Complaint
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {complaints.map((c) => (
            <ComplaintCard
              key={c.id}
              complaint={c}
              href={`/citizen/complaints/${c.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
