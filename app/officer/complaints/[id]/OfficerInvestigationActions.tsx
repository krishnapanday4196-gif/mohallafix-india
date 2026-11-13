"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Play,
  Upload,
  AlertCircle,
  FileCheck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Complaint } from "@/types/database";

interface OfficerInvestigationActionsProps {
  complaint: Complaint;
}

export default function OfficerInvestigationActions({
  complaint,
}: OfficerInvestigationActionsProps) {
  const router = useRouter();
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleStartWork = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "IN_PROGRESS",
          reason: "Officer inspected site on-ground and initiated repair/cleaning works.",
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.error || "Failed to update status.");
        return;
      }

      setSuccessMsg("Work marked IN PROGRESS successfully.");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason || rejectReason.trim().length < 5) {
      setErrorMsg("Please provide an explanatory reason for rejecting this assignment.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REJECTED",
          reason: `Officer Rejected Assignment: ${rejectReason}`,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.error || "Failed to reject assignment.");
        return;
      }

      setSuccessMsg("Assignment rejected and logged in history.");
      setRejecting(false);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reject assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Officer Investigation Actions</h3>
          <p className="text-[11px] text-slate-400">
            Current Status: <span className="font-semibold text-slate-700">{complaint.status}</span>
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Action buttons depending on state */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {complaint.status === "ASSIGNED" && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleStartWork}
            isLoading={loading}
            className="gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Accept & Start Work (In Progress)
          </Button>
        )}

        {complaint.status === "IN_PROGRESS" && (
          <>
            <Link href={`/officer/complaints/${complaint.id}/progress`}>
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                Log Progress Note
              </Button>
            </Link>
            <Link href={`/officer/complaints/${complaint.id}/resolve`}>
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <FileCheck className="w-4 h-4" />
                Submit Resolution Photographic Proof
              </Button>
            </Link>
          </>
        )}

        {(complaint.status === "ASSIGNED" || complaint.status === "REOPENED") && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRejecting(!rejecting)}
            className="text-rose-700 border-rose-200 hover:bg-rose-50 text-xs gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject Assignment
          </Button>
        )}
      </div>

      {/* Rejection reason sub-form */}
      {rejecting && (
        <form onSubmit={handleRejectAssignment} className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3 mt-3">
          <h4 className="text-xs font-bold text-rose-900">
            Specify Formal Reason for Assignment Rejection
          </h4>
          <textarea
            rows={2}
            required
            placeholder="e.g. Issue falls outside departmental jurisdiction or physical access is obstructed..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full p-2 text-xs rounded-xl border border-rose-200 bg-white focus:outline-none focus:border-rose-500"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setRejecting(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm" isLoading={loading}>
              Confirm Rejection
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

