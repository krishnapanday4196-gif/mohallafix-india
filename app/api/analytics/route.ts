import { NextResponse } from "next/server";
import { getAnalyticsMetrics } from "@/lib/services/complaintService";

export async function GET() {
  try {
    const metrics = await getAnalyticsMetrics();
    return NextResponse.json({ data: metrics });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

