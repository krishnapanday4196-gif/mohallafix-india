import { NextRequest, NextResponse } from "next/server";

const AI_BACKEND_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get("endpoint") || "duplicate-check";

    const contentType = req.headers.get("content-type") || "";

    let response: Response;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      response = await fetch(`${AI_BACKEND_URL}/api/ai/${endpoint}`, {
        method: "POST",
        body: formData,
      });
    } else {
      const body = await req.json();
      response = await fetch(`${AI_BACKEND_URL}/api/ai/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        {
          error: "AI backend error",
          details: errText,
          status: response.status,
          backend_url: AI_BACKEND_URL,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "AI Backend Connection Failed",
        message: "The Python FastAPI AI service is currently offline or unreachable at " + AI_BACKEND_URL,
        hint: "Start the AI service with: python -m uvicorn backend.main:app --port 8000",
        is_ai_connected: false,
      },
      { status: 503 }
    );
  }
}

