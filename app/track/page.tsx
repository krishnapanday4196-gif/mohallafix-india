import React from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Building2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Timeline } from "@/components/complaints/Timeline";
import { fetchComplaintByIdOrTracking } from "@/lib/services/complaintService";
import { formatDate } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function TrackPage({ searchParams }: PageProps) {
  const { id } = await searchParams;
  const complaint = id ? await fetchComplaintByIdOrTracking(id.trim()) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Real-Time Grievance Tracker
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Track Complaint Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Enter your unique MohallaFix tracking ID to inspect live departmental progress, inspection logs, and resolution evidence.
          </p>
        </div>

        {/* Tracking Input Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm max-w-2xl mx-auto">
          <form action="/track" method="GET" className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              name="id"
              defaultValue={id || ""}
              placeholder="e.g. MHF-20261113-A8F2"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
              required
            />
            <Button type="submit" variant="primary" size="md" className="gap-2 shrink-0">
              <Search className="w-4 h-4" />
              Check Status
            </Button>
          </form>
        </div>

        {/* Result view */}
        {id && !complaint && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 max-w-2xl mx-auto">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Complaint Found</h3>
            <p className="text-xs text-slate-500">
              We couldn&apos;t find any grievance with tracking ID &quot;{id}&quot;. Please verify the ID format (MHF-YYYYMMDD-XXXX) or submit a new grievance.
            </p>
            <div className="pt-2">
              <Link href="/citizen/submit">
                <Button variant="outline" size="sm">
                  File New Complaint
                </Button>
              </Link>
            </div>
          </div>
        )}

        {complaint && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-mono">
                  Complaint Tracking ID
                </span>
                <div className="text-xl font-bold font-mono text-emerald-800">
                  {complaint.tracking_id}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{complaint.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {complaint.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{complaint.address}</span>
                </div>
                {complaint.category && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Category: {complaint.category.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Filed on: {formatDate(complaint.created_at)}</span>
                </div>
                {complaint.department && (
                  <div className="flex items-center gap-2 font-medium text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dept: {complaint.department.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Lifecycle Timeline</h3>
              <Timeline history={complaint.status_history || []} />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/complaints/${complaint.id}`}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                View Public Grievance Page &rarr;
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
