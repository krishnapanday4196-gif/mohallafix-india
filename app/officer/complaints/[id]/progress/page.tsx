"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

export default function OfficerUpdateProgressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [progressNotes, setProgressNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!progressNotes || progressNotes.trim().length < 5) {
      setErrorMsg("Please provide detailed progress notes regarding the ground action.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "IN_PROGRESS",
          reason: `Work Progress Update: ${progressNotes}`,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.error || "Failed to submit progress update.");
        return;
      }

      setSuccessMsg("Progress update recorded and notified to the citizen.");
      setTimeout(() => {
        router.push(`/officer/complaints/${id}`);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Link
        href={`/officer/complaints/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Complaint
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Log On-Ground Work Progress</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Document dispatched materials, manpower deployed, or expected time to completion.
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            label="Work Progress Summary *"
            rows={5}
            required
            placeholder="e.g. Municipal road team arrived at 11:30 AM with cold-mix asphalt. 2 of 4 potholes patched. Heavy roller arriving by 2 PM..."
            value={progressNotes}
            onChange={(e) => setProgressNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Link href={`/officer/complaints/${id}`}>
              <Button type="button" variant="ghost" size="md">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="md" isLoading={loading} className="gap-2">
              <Send className="w-4 h-4" /> Save & Notify Citizen
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

