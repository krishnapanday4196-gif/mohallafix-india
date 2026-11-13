"use client";

import React, { useState } from "react";
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { PriorityBadge } from "@/components/ui/Badge";

export default function AIPriorityAnalysisPage() {
  const [category, setCategory] = useState("Drainage and Sewer");
  const [title, setTitle] = useState("Open manhole on main road");
  const [description, setDescription] = useState("Dangerous open manhole near primary school, children walking nearby.");
  const [hasImage, setHasImage] = useState(true);
  const [hasVideo, setHasVideo] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch("/api/ai/proxy?endpoint=priority-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title,
          description,
          has_image: hasImage,
          has_video: hasVideo,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.message || "Priority analysis failed.");
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to connect to AI priority engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Civic Hazard & Priority Scoring Engine
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Scans public safety hazard keywords, category baseline SLAs, and evidence attachments to recommend SLA urgency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Grievance Input</h3>

          <form onSubmit={handleAnalyze} className="space-y-3">
            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <Input
              label="Complaint Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Textarea
              label="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="flex items-center gap-4 text-xs text-slate-700 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasImage}
                  onChange={(e) => setHasImage(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                Photographic Evidence Verified
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVideo}
                  onChange={(e) => setHasVideo(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                Video Evidence
              </label>
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={loading} className="w-full gap-2 mt-2">
              <Sparkles className="w-4 h-4" /> Compute Priority Score
            </Button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Priority Evaluation</h3>

          {result ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                    Recommended SLA Priority
                  </span>
                  <PriorityBadge priority={result.recommended_priority} />
                </div>
                <div className="text-xl font-black text-slate-900 font-mono">
                  Score: {result.priority_score} / 1.00
                </div>
                <div className="flex items-center gap-1 text-slate-700 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  Target SLA: {result.sla_hours_recommended} Hours Response
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Public Safety Impact:</span>
                <p className="text-slate-600 font-medium p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900">
                  {result.public_safety_impact}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Model Factor Reasoning:</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {result.reasoning.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              Submit grievance details to calculate civic priority and emergency weighting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

