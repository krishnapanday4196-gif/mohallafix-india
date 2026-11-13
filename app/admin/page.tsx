import React from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Tag,
  BarChart3,
  ScrollText,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAnalyticsMetrics, fetchPublicComplaints } from "@/lib/services/complaintService";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";

export default async function AdminDashboardPage() {
  const [metrics, recentComplaints] = await Promise.all([
    getAnalyticsMetrics(),
    fetchPublicComplaints({ limit: 4 }),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Central Administration & Oversight
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            MohallaFix India Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
            Real-time oversight over all civic complaints, department assignments, SLA escalations, and certified officer credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/escalations">
            <Button variant="danger" size="sm" className="gap-1.5 text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              Escalations ({metrics.escalated})
            </Button>
          </Link>
          <Link href="/admin/officers">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verify Officers
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics 4-card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Registered</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.total}</div>
          <span className="text-[11px] text-slate-400 mt-1">Stored in database</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-amber-700">Active Work Orders</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {metrics.in_progress + metrics.assigned}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Ground crews deployed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-emerald-700">Resolved & Confirmed</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.resolved + metrics.citizen_confirmed}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Evidence confirmed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-rose-700">SLA Escalations</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">{metrics.escalated}</div>
          <span className="text-[11px] text-slate-400 mt-1">Requiring intervention</span>
        </div>
      </div>

      {/* Admin Modules Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/admin/complaints"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all group"
        >
          <FileText className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-105 transition-transform" />
          <h4 className="font-bold text-xs text-slate-900">All Complaints</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Filter, audit, and reassign grievances</p>
        </Link>

        <Link
          href="/admin/departments"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all group"
        >
          <Building2 className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-105 transition-transform" />
          <h4 className="font-bold text-xs text-slate-900">Departments</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Manage municipal departments and PWD</p>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all group"
        >
          <Tag className="w-5 h-5 text-emerald-700 mb-2 group-hover:scale-105 transition-transform" />
          <h4 className="font-bold text-xs text-slate-900">Categories & SLAs</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Configure categories & turnaround SLAs</p>
        </Link>

        <Link
          href="/admin/logs"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all group"
        >
          <ScrollText className="w-5 h-5 text-slate-700 mb-2 group-hover:scale-105 transition-transform" />
          <h4 className="font-bold text-xs text-slate-900">Audit & Security Logs</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Inspect system actions and access logs</p>
        </Link>
      </div>

      {/* Recent Activity Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Complaints Queue</h3>
          <Link href="/admin/complaints">
            <Button variant="ghost" size="sm" className="text-xs text-emerald-700">
              Manage All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {recentComplaints.length === 0 ? (
          <EmptyState
            title="No complaints registered yet."
            description="The central database currently has zero recorded complaints. When citizens file issues, they will stream in real time."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentComplaints.map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                href={`/admin/complaints/${c.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
