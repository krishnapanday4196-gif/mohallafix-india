import React from "react";
import Link from "next/link";
import {
  Cpu,
  Sparkles,
  Layers,
  AlertTriangle,
  ScrollText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AIDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Python FastAPI AI Microservice
          </div>
          <h2 className="text-2xl font-bold tracking-tight">AI Civic Intelligence Hub</h2>
          <p className="text-xs sm:text-sm text-teal-50 max-w-xl">
            Automated image classification, spatial duplicate detection, hazard priority scoring, and NLP writing assistant for Indian civic infrastructure.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-xs shrink-0 space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-teal-100">Model Version:</span>
            <span className="font-mono font-bold">v1.4.0-civic</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-teal-100">Microservice:</span>
            <span className="font-semibold text-emerald-300">FastAPI Online</span>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          href="/ai/image-analysis"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Image Classification</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Test computer vision analysis on uploaded photos to detect potholes, water leakage, refuse accumulation, and broken street lighting.
          </p>
          <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
            Test Visual Classifier <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/ai/duplicate-detection"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Duplicate Detection Engine</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Simulate duplicate queries using Haversine distance, verbal Jaccard similarity, and category alignment. Never automatically deletes records.
          </p>
          <span className="text-xs font-semibold text-teal-700 inline-flex items-center gap-1">
            Run Duplicate Scan <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/ai/priority-analysis"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Priority & Hazard Scoring</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Analyze complaint text for critical safety hazards (open manholes, live wires, contamination) to recommend SLA turnaround times.
          </p>
          <span className="text-xs font-semibold text-amber-700 inline-flex items-center gap-1">
            Evaluate Priority Weights <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/ai/history"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <ScrollText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Processing History</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Inspect model inference logs, confidence metrics, and human-in-the-loop review overrides stored in PostgreSQL.
          </p>
          <span className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1">
            View Processing Logs <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

