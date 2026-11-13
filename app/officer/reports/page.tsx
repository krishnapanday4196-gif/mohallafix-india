import React from "react";
import { BarChart3, Download, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAnalyticsMetrics } from "@/lib/services/complaintService";

export default async function OfficerReportsPage() {
  const metrics = await getAnalyticsMetrics();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Officer Operational Performance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            SLA compliance audit and resolution turnaround metrics from real database records.
          </p>
        </div>

        <a href="/api/analytics" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" /> Export Data (JSON)
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Work Orders</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.total}</div>
          <span className="text-[11px] text-slate-400 mt-1">Assigned & completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-emerald-700">Resolved & Confirmed</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics.resolved + metrics.citizen_confirmed}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Certified with evidence</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-amber-700">In Active Progress</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{metrics.in_progress}</div>
          <span className="text-[11px] text-slate-400 mt-1">Under repair</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-rose-700">Escalated (SLA Breaches)</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">{metrics.escalated}</div>
          <span className="text-[11px] text-slate-400 mt-1">Flagged to higher authority</span>
        </div>
      </div>

      {/* SLA Compliance breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Departmental Workload & Distribution</h3>
        {metrics.departmentWorkload.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">
            No departmental activity recorded yet.
          </p>
        ) : (
          <div className="space-y-3">
            {metrics.departmentWorkload.map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{d.name}</span>
                  <span className="font-mono text-slate-500">{d.count} tasks</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(5, (d.count / (metrics.total || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
