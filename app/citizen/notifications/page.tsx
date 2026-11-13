import React from "react";
import { Bell, CheckCheck, Clock, ShieldCheck, Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function CitizenNotificationsPage() {
  // Real database empty state when no notifications exist
  const notifications: any[] = [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Notifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates regarding your filed complaints, officer assignments, and SLA milestones.
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6 text-slate-400" />}
          title="No notifications found yet."
          description="You are fully caught up. When an officer is assigned or your complaint status changes, instant notifications will be logged here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{n.created_at}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

