import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Calendar,
  Building2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  ArrowLeft,
  Share2,
  ExternalLink,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Timeline } from "@/components/complaints/Timeline";
import { ComplaintMap } from "@/components/maps/ComplaintMap";
import { fetchComplaintByIdOrTracking } from "@/lib/services/complaintService";
import { formatDate, formatDateTime } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ComplaintDetailPage({ params }: PageProps) {
  const { id } = await params;
  const complaint = await fetchComplaintByIdOrTracking(id);

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Complaint Record Not Found</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No grievance was found in the database with reference &quot;{id}&quot;. Please verify the tracking ID or view the public complaints feed.
          </p>
          <div className="pt-2">
            <Link href="/complaints">
              <Button variant="outline" size="sm">
                Back to Public Complaints
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasCoords =
    typeof complaint.latitude === "number" && typeof complaint.longitude === "number";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/complaints"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Complaints Feed
          </Link>

          <span className="text-xs font-mono text-slate-400">
            Registered on {formatDate(complaint.created_at)}
          </span>
        </div>

        {/* Main Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                {complaint.tracking_id}
              </span>
              <PriorityBadge priority={complaint.priority} />
            </div>

            <StatusBadge status={complaint.status} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
              {complaint.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {complaint.address} {complaint.pincode && `(${complaint.pincode})`}
              </span>
              {complaint.category && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {complaint.category.name}
                </span>
              )}
            </div>
          </div>

          {/* Detailed description */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Citizen Description
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Department attribution */}
          {complaint.department && (
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-emerald-900">
              <span className="font-medium">Responsible Authority:</span>
              <span className="font-bold">{complaint.department.name}</span>
            </div>
          )}
        </div>

        {/* Media Attachments Section (Real uploads) */}
        {complaint.media && complaint.media.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Uploaded Evidence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {complaint.media.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group relative"
                >
                  {m.media_type === "image" ? (
                    <img
                      src={m.file_url}
                      alt="Complaint Evidence"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <video controls src={m.file_url} className="w-full h-48 object-cover" />
                  )}
                  {m.is_resolution_evidence && (
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Resolution Proof
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Geospatial Map Anchor */}
        {hasCoords && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Ground GPS Coordinates
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {complaint.latitude?.toFixed(5)}, {complaint.longitude?.toFixed(5)}
              </span>
            </div>
            <ComplaintMap
              complaints={[complaint]}
              center={[complaint.latitude!, complaint.longitude!]}
              zoom={15}
              height="280px"
            />
          </div>
        )}

        {/* Status Lifecycle Audit History */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Audit Status History</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifiable progression log stored in the database.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              Reopens: {complaint.reopen_count || 0}
            </span>
          </div>

          <Timeline history={complaint.status_history || []} />
        </div>

        {/* Citizen Resolution Feedback or Reopen Action Notice */}
        {complaint.status === "RESOLVED" && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-900 text-sm">
                Has this problem been fixed to your satisfaction?
              </h4>
              <p className="text-xs text-emerald-800">
                The responsible officer has submitted resolution evidence. You can confirm the fix or reopen this grievance.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/citizen/complaints/${complaint.id}`}>
                <Button variant="primary" size="sm">
                  Confirm Fix
                </Button>
              </Link>
              <Link href={`/citizen/complaints/${complaint.id}?action=reopen`}>
                <Button variant="outline" size="sm" className="text-rose-700 border-rose-200">
                  Reopen Issue
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
