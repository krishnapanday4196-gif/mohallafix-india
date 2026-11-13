import React from "react";
import { ScrollText, Cpu, CheckCircle2, AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AIHistoryPage() {
  // Real database empty state when zero AI analysis records exist
  const history: any[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Model Processing History</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Auditable logs of computer vision inference, spatial duplicate assessments, and confidence scores.
        </p>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<Cpu className="w-6 h-6 text-slate-400" />}
          title="No AI processing records found."
          description="When citizens file complaints with photographic attachments or request writing assistance, the resulting model inference logs and confidence scores will be indexed here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {history.map((h) => (
            <div key={h.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{h.model_name} ({h.model_version})</span>
                <p className="text-slate-500">Confidence: {h.classification_confidence}</p>
              </div>
              <span className="font-mono text-slate-400">{h.analyzed_at}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

