import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PortalHeader } from "@/components/layout/PortalHeader";

export default function AILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <Sidebar portalType="ai" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PortalHeader
          title="AI Intelligence Hub"
          description="Civic Vision, Duplicate Detection, Priority Scoring and NLP Rephrasing Engine"
          role="admin"
          userName="AI Supervisor"
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

