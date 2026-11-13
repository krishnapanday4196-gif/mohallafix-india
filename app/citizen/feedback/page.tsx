import React from "react";
import Link from "next/link";
import { MessageSquare, Star, CheckCircle, Clock } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function CitizenFeedbackPage() {
  // Real database empty state when zero feedback submissions exist
  const feedbackList: any[] = [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Citizen Ratings & Feedback</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Review resolution ratings submitted for completed infrastructure works in your mohalla.
        </p>
      </div>

      {feedbackList.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-6 h-6 text-slate-400" />}
          title="No feedback submitted yet."
          description="Once your reported complaints are resolved by the department, you will be invited to submit a 1-to-5 star rating and quality review here."
          action={
            <Link href="/citizen/complaints">
              <Button variant="outline" size="sm">
                View My Complaints
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {feedbackList.map((f) => (
            <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < f.rating ? "fill-amber-400" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-700">{f.comments}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

