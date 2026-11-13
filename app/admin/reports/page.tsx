import React from "react";
import { Download, FileSpreadsheet, FileJson, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminReportsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Executive Civic Reports & Data Export
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Export verified complaint records, departmental SLA audits, and escalation histories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Complaints Master Export</h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete dataset of all public infrastructure complaints, timestamps, GPS coordinates, and current status.
            </p>
          </div>
          <a href="/api/complaints" target="_blank" rel="noopener noreferrer" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
              <Download className="w-3.5 h-3.5" /> Download JSON Dataset
            </Button>
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">SLA & Analytics Summary</h3>
            <p className="text-xs text-slate-500 mt-1">
              Aggregate metrics covering turnaround times, department workloads, and escalation rates.
            </p>
          </div>
          <a href="/api/analytics" target="_blank" rel="noopener noreferrer" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
              <Download className="w-3.5 h-3.5" /> Download Analytics Data
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

