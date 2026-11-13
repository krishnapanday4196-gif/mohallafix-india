"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Building2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Complaint, Department } from "@/types/database";

interface AdminComplaintActionsProps {
  complaint: Complaint;
  departments: Department[];
}

export default function AdminComplaintActions({
  complaint,
  departments,
}: AdminComplaintActionsProps) {
  const router = useRouter();
  const [selectedDeptId, setSelectedDeptId] = useState(complaint.department_id || "");
  const [actionReason, setActionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdate = async (newStatus: string) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          reason: actionReason || `Administrative status change to ${newStatus}`,
          department_id: selectedDeptId || undefined,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.error || "Action failed.");
        return;
      }

      setSuccessMsg(`Status updated to ${newStatus} successfully.`);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to execute administrative update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-slate-900">Administrative Dispatch & Actions</h3>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Department Assignment
          </label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
          >
            <option value="">Select Nodal Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Administrative Audit Note
          </label>
          <input
            type="text"
            placeholder="e.g. Ground inspection order issued to Ward 14 team"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleUpdate("VERIFIED")}
          isLoading={loading}
          className="text-xs gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Verify Complaint
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleUpdate("ASSIGNED")}
          isLoading={loading}
          className="text-xs gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5" /> Assign to Department
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={() => handleUpdate("ESCALATED")}
          isLoading={loading}
          className="text-xs gap-1.5"
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Escalate Grievance
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUpdate("REJECTED")}
          isLoading={loading}
          className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50 gap-1.5"
        >
          <XCircle className="w-3.5 h-3.5" /> Reject Frivolous
        </Button>
      </div>
    </div>
  );
}

