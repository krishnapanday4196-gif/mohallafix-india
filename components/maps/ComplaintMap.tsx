"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Complaint } from "@/types/database";
import { Loader2 } from "lucide-react";

interface ComplaintMapProps {
  complaints?: Complaint[];
  selectedComplaintId?: string | null;
  onSelectComplaint?: (c: Complaint) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  allowLocationPick?: boolean;
  selectedLocation?: [number, number] | null;
  onLocationPick?: (lat: number, lng: number) => void;
}

const DynamicComplaintMapInner = dynamic(
  () => import("@/components/maps/ComplaintMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-500 border border-slate-200">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mb-2" />
        <span className="text-xs font-medium">Loading OpenStreetMap Canvas...</span>
      </div>
    ),
  }
);

export function ComplaintMap(props: ComplaintMapProps) {
  return <DynamicComplaintMapInner {...props} complaints={props.complaints || []} />;
}

