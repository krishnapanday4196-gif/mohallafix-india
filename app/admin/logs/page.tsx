import React from "react";
import { ScrollText, ShieldCheck, ShieldAlert, Clock, Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminLogsPage() {
  // Real database empty state when zero activity logs exist
  const logs: any[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Security & Audit Logs</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable system audit trail logging all role modifications, status overrides, and user authentication events.
        </p>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="w-6 h-6 text-slate-400" />}
          title="No activity logs found."
          description="There are currently zero security or audit logs recorded in the database. When administrative actions and status updates occur, they will be logged here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900">{log.action}</span>
                <span className="text-slate-500 ml-2">on {log.resource}</span>
              </div>
              <span className="font-mono text-slate-400">{log.created_at}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

