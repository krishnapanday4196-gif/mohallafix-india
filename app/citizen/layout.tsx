import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PortalHeader } from "@/components/layout/PortalHeader";

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <Sidebar portalType="citizen" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PortalHeader
          title="Citizen Portal"
          description="Report grievances, monitor SLA progress and confirm municipal resolutions"
          role="citizen"
          userName="Citizen User"
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

