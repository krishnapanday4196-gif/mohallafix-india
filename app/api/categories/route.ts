import { NextResponse } from "next/server";
import { fetchCategories } from "@/lib/services/complaintService";

export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json({ data: categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

