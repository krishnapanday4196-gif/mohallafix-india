import React from "react";
import { BarChart3, TrendingUp, PieChart, Activity, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAnalyticsMetrics } from "@/lib/services/complaintService";

export default async function AdminAnalyticsPage() {
  const metrics = await getAnalyticsMetrics();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Civic Analytics & SLA Metrics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time metrics computed strictly from verified database records. Zero simulated charts.
        </p>
      </div>

      {metrics.total === 0 ? (
        <EmptyState
          icon={<BarChart3 className="w-6 h-6 text-slate-400" />}
          title="No analytics data available yet."
          description="Analytics are calculated live from real complaints in the database. When citizens and officers begin logging activity, real metrics and category distributions will be rendered here."
        />
      ) : (
        <>
          {/* Main counts grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Total Registered</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.total}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs font-medium text-amber-700">In Progress</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">{metrics.in_progress}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs font-medium text-emerald-700">Resolved & Confirmed</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                {metrics.resolved + metrics.citizen_confirmed}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs font-medium text-rose-700">Escalated</span>
              <div className="text-2xl font-bold text-rose-600 mt-1">{metrics.escalated}</div>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" /> Category-Wise Distribution
              </h3>
              <div className="space-y-3">
                {metrics.categoryDistribution.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700">{item.name}</span>
                      <span className="font-mono text-slate-500">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(5, (item.count / metrics.total) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" /> Departmental Workload
              </h3>
              <div className="space-y-3">
                {metrics.departmentWorkload.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700">{item.name}</span>
                      <span className="font-mono text-slate-500">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(5, (item.count / metrics.total) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
