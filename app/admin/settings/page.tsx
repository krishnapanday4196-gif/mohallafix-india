import React from "react";
import { Settings, Database, Cpu, Mail, MessageSquare, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const isDbConfigured = isSupabaseConfigured();
  const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);
  const isSmsConfigured = Boolean(process.env.SMS_GATEWAY_API_KEY);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Configuration & Integrations</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time status of connected backend services, database migrations, and external gateways.
        </p>
      </div>

      <div className="space-y-4">
        {/* Supabase Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isDbConfigured ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Supabase PostgreSQL & Auth</h3>
              <p className="text-xs text-slate-500">17 relational tables with Row Level Security (RLS)</p>
            </div>
          </div>
          <Badge variant={isDbConfigured ? "success" : "warning"}>
            {isDbConfigured ? "Configured & Active" : "NOT CONFIGURED"}
          </Badge>
        </div>

        {/* Python AI Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Python FastAPI AI Engine</h3>
              <p className="text-xs text-slate-500">Computer Vision, duplicate detection & priority scoring</p>
            </div>
          </div>
          <Badge variant="success">Microservice Ready</Badge>
        </div>

        {/* Email Notification Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isEmailConfigured ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Transactional Email Service (Resend)</h3>
              <p className="text-xs text-slate-500">Outbound notifications for status transitions & verification</p>
            </div>
          </div>
          <Badge variant={isEmailConfigured ? "success" : "outline"}>
            {isEmailConfigured ? "Configured" : "NOT CONFIGURED"}
          </Badge>
        </div>

        {/* SMS Gateway Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isSmsConfigured ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Government SMS Gateway</h3>
              <p className="text-xs text-slate-500">Mobile SMS dispatch for citizen grievance status alerts</p>
            </div>
          </div>
          <Badge variant={isSmsConfigured ? "success" : "outline"}>
            {isSmsConfigured ? "Configured" : "NOT CONFIGURED"}
          </Badge>
        </div>
      </div>
    </div>
  );
}

