import React from "react";
import { Users, Shield, UserCheck, AlertCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function AdminUsersPage() {
  // Real database empty state when no other user accounts exist
  const users: any[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">User Account Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage citizen accounts, officer credentials, and administrative permissions.
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6 text-slate-400" />}
          title="No users found yet."
          description="There are currently zero secondary accounts registered in the database. When citizens and officers register, their verified profiles will appear here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{u.full_name}</td>
                  <td className="px-4 py-3 font-mono">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="default">{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.created_at}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

