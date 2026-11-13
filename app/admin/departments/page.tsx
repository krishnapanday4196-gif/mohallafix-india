import React from "react";
import { Building2, Plus, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { fetchDepartments } from "@/lib/services/complaintService";

export default async function AdminDepartmentsPage() {
  const departments = await fetchDepartments();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Municipal Department Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure nodal departments, grievance routing rules, and official escalation contacts.
          </p>
        </div>

        <Button variant="primary" size="sm" className="gap-1.5 text-xs">
          <Plus className="w-4 h-4" /> Add New Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {dept.code}
                </span>
                <Badge variant={dept.is_active ? "success" : "default"}>
                  {dept.is_active ? "Active" : "Disabled"}
                </Badge>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-1">{dept.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {dept.description || "Nodal civic authority responsible for infrastructure maintenance."}
              </p>

              {dept.contact_email && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{dept.contact_email}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
              <Button variant="ghost" size="sm" className="text-xs text-slate-600">
                Edit Configuration
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
