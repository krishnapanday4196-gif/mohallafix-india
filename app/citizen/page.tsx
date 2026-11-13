import React from "react";
import Link from "next/link";
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { fetchPublicComplaints, getAnalyticsMetrics } from "@/lib/services/complaintService";

export default async function CitizenDashboardPage() {
  const [complaints, metrics] = await Promise.all([
    fetchPublicComplaints({ limit: 4 }),
    getAnalyticsMetrics(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" /> Mohalla Redressal Hub
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome to Citizen Redressal Portal
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 max-w-lg leading-relaxed">
            Report civic defects in your neighborhood. All complaints are tracked with timestamps, GPS coordinates, and departmental SLAs.
          </p>
        </div>

        <Link href="/citizen/submit" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold w-full sm:w-auto justify-center">
            <PlusCircle className="w-4 h-4 mr-1 text-emerald-600" />
            File New Grievance
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col">
          <span className="text-xs font-medium text-slate-500">Total Registered</span>
          <span className="text-2xl font-bold text-slate-900 mt-1">{metrics.total}</span>
          <span className="text-[11px] text-slate-400 mt-1">Recorded in database</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col">
          <span className="text-xs font-medium text-amber-700">In Progress / Assigned</span>
          <span className="text-2xl font-bold text-amber-600 mt-1">
            {metrics.in_progress + metrics.assigned}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Under investigation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col">
          <span className="text-xs font-medium text-emerald-700">Resolved</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.resolved + metrics.citizen_confirmed}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Proof uploaded</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col">
          <span className="text-xs font-medium text-rose-700">Reopened / Escalated</span>
          <span className="text-2xl font-bold text-rose-600 mt-1">
            {metrics.reopened + metrics.escalated}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Requires review</span>
        </div>
      </div>

      {/* My Complaints Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Complaints</h3>
            <p className="text-xs text-slate-500">Live records from your area and account</p>
          </div>
          <Link href="/citizen/complaints">
            <Button variant="ghost" size="sm" className="text-xs text-emerald-700">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {complaints.length === 0 ? (
          <EmptyState
            title="No complaints filed yet."
            description="You have not submitted any complaints yet. When you submit a problem with photo and GPS, it will appear here."
            action={
              <Link href="/citizen/submit">
                <Button variant="primary" size="sm">
                  Report First Issue
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}
