import { NextResponse } from "next/server";
import { fetchDepartments } from "@/lib/services/complaintService";

export async function GET() {
  try {
    const departments = await fetchDepartments();
    return NextResponse.json({ data: departments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

