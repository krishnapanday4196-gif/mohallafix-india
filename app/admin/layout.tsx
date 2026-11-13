import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PortalHeader } from "@/components/layout/PortalHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar portalType="admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader
          title="Super Administrator Console"
          description="System-wide governance, officer verification, departmental SLAs and audit trails"
          role="super_admin"
          userName="Administrator"
        />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

