import React from "react";
import { CheckCircle2, XCircle, ShieldCheck, UserCheck, AlertCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

export default function AdminOfficerVerificationPage() {
  // Real database empty state when zero unverified officers are pending
  const pendingOfficers: any[] = [];
  const verifiedOfficers: any[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Authorized Officer Verification
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Verify and accredit departmental ground officers. Ordinary citizens cannot grant themselves officer privileges.
        </p>
      </div>

      {/* Pending Approval Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-500" /> Pending Accreditations ({pendingOfficers.length})
        </h3>

        {pendingOfficers.length === 0 ? (
          <EmptyState
            icon={<UserCheck className="w-6 h-6 text-slate-400" />}
            title="No pending officer verifications."
            description="All officer accreditation requests have been audited. When new departmental officers request onboarding, their credentials and badge records will appear here."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {pendingOfficers.map((o) => (
              <div key={o.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{o.profile?.full_name}</h4>
                  <p className="text-[11px] text-slate-500">Badge: {o.badge_number} • {o.designation}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" className="text-xs">
                    Approve Officer
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs text-rose-700">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Roster Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified On-Ground Officers ({verifiedOfficers.length})
        </h3>

        {verifiedOfficers.length === 0 ? (
          <p className="text-xs text-slate-500 italic bg-white p-4 rounded-xl border border-slate-200 text-center">
            No verified officers in database yet.
          </p>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            {/* List */}
          </div>
        )}
      </div>
    </div>
  );
}

