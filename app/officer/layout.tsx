import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PortalHeader } from "@/components/layout/PortalHeader";

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <Sidebar portalType="officer" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PortalHeader
          title="Authorized Officer Portal"
          description="Nodal municipal officer workflow, site investigations and resolution proof submissions"
          role="officer"
          userName="Nodal Officer"
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

