"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, Star, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Complaint } from "@/types/database";

interface CitizenActionsProps {
  complaint: Complaint;
  initialAction?: string;
}

export default function CitizenActions({ complaint, initialAction }: CitizenActionsProps) {
  const router = useRouter();
  const [showReopenModal, setShowReopenModal] = useState(initialAction === "reopen");
  const [reopenReason, setReopenReason] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CITIZEN_CONFIRMED",
          reason: "Citizen confirmed problem resolution successfully on ground.",
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.error || "Failed to confirm resolution.");
        return;
      }

      setSuccessMsg("You have confirmed the resolution! Thank you for helping keep your mohalla clean.");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to confirm resolution.");
    } finally {
      setLoading(false);
    }
  };

  const handleReopen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason || reopenReason.trim().length < 5) {
      setErrorMsg("Please provide an explanatory reason for reopening this grievance.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REOPENED",
          reason: reopenReason,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.error || "Failed to reopen grievance.");
        return;
      }

      setSuccessMsg("Complaint reopened and returned to investigation queue.");
      setShowReopenModal(false);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reopen complaint.");
    } finally {
      setLoading(false);
    }
  };

  if (complaint.status !== "RESOLVED" && !complaint.confirmed_at) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
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

      {complaint.status === "RESOLVED" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div>
            <h4 className="font-bold text-sm text-emerald-950">
              Department Resolution Submitted
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              The officer marked this issue resolved. Please review the proof above and confirm or reopen.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              isLoading={loading}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Fix
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReopenModal(true)}
              className="text-rose-700 border-rose-200 hover:bg-rose-50 gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Reopen
            </Button>
          </div>
        </div>
      )}

      {showReopenModal && (
        <form onSubmit={handleReopen} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <h4 className="font-bold text-xs text-slate-900 uppercase">
            State Reason for Reopening
          </h4>
          <textarea
            rows={3}
            required
            placeholder="Explain why the problem is still unresolved (e.g. pothole only partially filled, water still leaking)..."
            value={reopenReason}
            onChange={(e) => setReopenReason(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white"
          />
          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowReopenModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm" isLoading={loading}>
              Submit Reopen Request
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

