import React from "react";
import { Tag, Plus, Clock, Building2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, PriorityBadge } from "@/components/ui/Badge";
import { fetchCategories } from "@/lib/services/complaintService";

export default async function AdminCategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Infrastructure Category & SLA Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public problem categories, designated department routing, and statutory SLA turnaround times.
          </p>
        </div>

        <Button variant="primary" size="sm" className="gap-1.5 text-xs">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Category Name</th>
              <th className="px-4 py-3">Slug / Key</th>
              <th className="px-4 py-3">SLA Hours</th>
              <th className="px-4 py-3">Baseline Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{c.slug}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    {c.sla_hours} hrs
                  </span>
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={c.priority_level} />
                </td>
                <td className="px-4 py-3">
                  <Badge variant={c.is_active ? "success" : "default"}>
                    {c.is_active ? "Active" : "Disabled"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" className="text-xs">
                    Edit SLA
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
