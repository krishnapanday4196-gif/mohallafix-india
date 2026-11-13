import React from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Building2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Star,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Timeline } from "@/components/complaints/Timeline";
import { ComplaintMap } from "@/components/maps/ComplaintMap";
import { fetchComplaintByIdOrTracking } from "@/lib/services/complaintService";
import { formatDate } from "@/lib/utils";
import CitizenActions from "./CitizenActions";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ action?: string }>;
}

export default async function CitizenComplaintDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { action } = await searchParams;
  const complaint = await fetchComplaintByIdOrTracking(id);

  if (!complaint) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Complaint Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested complaint ID does not exist in the database.
        </p>
        <Link href="/citizen/complaints">
          <Button variant="outline" size="sm">
            Back to My Complaints
          </Button>
        </Link>
      </div>
    );
  }

  const hasCoords =
    typeof complaint.latitude === "number" && typeof complaint.longitude === "number";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/citizen/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Complaints
        </Link>
        <span className="text-xs font-mono text-slate-400">
          Created on {formatDate(complaint.created_at)}
        </span>
      </div>

      {/* Main Details Card */}
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
          <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
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

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
          {complaint.description}
        </div>

        {/* Assigned Officer info if assigned */}
        {complaint.assigned_officer && (
          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                Assigned Ground Officer
              </span>
              <p className="font-bold text-slate-800">
                {complaint.assigned_officer.profile?.full_name || "Official Officer"}
                <span className="font-mono font-normal text-slate-500 ml-1">
                  (Badge: {complaint.assigned_officer.badge_number})
                </span>
              </p>
            </div>
            <span className="text-emerald-700 font-medium">Under Active Redressal</span>
          </div>
        )}
      </div>

      {/* Citizen Action Component (Confirm / Reopen / Feedback) */}
      <CitizenActions complaint={complaint} initialAction={action} />

      {/* Media Evidence */}
      {complaint.media && complaint.media.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Photographic & Video Evidence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {complaint.media.map((m) => (
              <div
                key={m.id}
                className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group"
              >
                {m.media_type === "image" ? (
                  <img
                    src={m.file_url}
                    alt="Evidence"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <video controls src={m.file_url} className="w-full h-44 object-cover" />
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

      {/* Map if coordinates present */}
      {hasCoords && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" /> Ground GPS Coordinates
          </h3>
          <ComplaintMap
            complaints={[complaint]}
            center={[complaint.latitude!, complaint.longitude!]}
            zoom={15}
            height="240px"
          />
        </div>
      )}

      {/* Audit Status History Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Audit Status History</h3>
            <p className="text-xs text-slate-500">Every transition is authorized and logged.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Reopen Count: {complaint.reopen_count || 0}
          </span>
        </div>

        <Timeline history={complaint.status_history || []} />
      </div>
    </div>
  );
}
