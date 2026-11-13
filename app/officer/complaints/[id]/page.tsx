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
  XCircle,
  FileText,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Timeline } from "@/components/complaints/Timeline";
import { ComplaintMap } from "@/components/maps/ComplaintMap";
import { fetchComplaintByIdOrTracking } from "@/lib/services/complaintService";
import { formatDate } from "@/lib/utils";
import OfficerInvestigationActions from "./OfficerInvestigationActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OfficerComplaintInvestigationPage({ params }: PageProps) {
  const { id } = await params;
  const complaint = await fetchComplaintByIdOrTracking(id);

  if (!complaint) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Complaint Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested complaint ID does not exist in the database.
        </p>
        <Link href="/officer/assigned">
          <Button variant="outline" size="sm">
            Back to Assigned Roster
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
          href="/officer/assigned"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assigned Complaints
        </Link>
        <span className="text-xs font-mono text-slate-400">
          Filed on {formatDate(complaint.created_at)}
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
      </div>

      {/* Interactive Officer Action Component (Accept, Reject with reason, or Start Work) */}
      <OfficerInvestigationActions complaint={complaint} />

      {/* Ground GPS Coordinates */}
      {hasCoords && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" /> On-Ground GPS Coordinates
          </h3>
          <ComplaintMap
            complaints={[complaint]}
            center={[complaint.latitude!, complaint.longitude!]}
            zoom={16}
            height="260px"
          />
        </div>
      )}

      {/* Citizen Evidence */}
      {complaint.media && complaint.media.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Submitted Photographic Proof</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {complaint.media.map((m) => (
              <div
                key={m.id}
                className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group"
              >
                {m.media_type === "image" ? (
                  <img
                    src={m.file_url}
                    alt="Citizen Evidence"
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <video controls src={m.file_url} className="w-full h-44 object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Audit */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900">Full Status Transition Audit</h3>
        <Timeline history={complaint.status_history || []} />
      </div>
    </div>
  );
}
