"use client";

import React, { useState } from "react";
import { Layers, Search, AlertCircle, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export default function AIDuplicateDetectionPage() {
  const [title, setTitle] = useState("Deep pothole near metro pillar 45");
  const [description, setDescription] = useState("Broken asphalt road caved in, damaging two-wheelers.");
  const [category, setCategory] = useState("Road Damage and Potholes");
  const [latitude, setLatitude] = useState<number>(28.6315);
  const [longitude, setLongitude] = useState<number>(77.2167);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");

      // Fetch existing complaints from database
      const compRes = await fetch("/api/complaints?limit=20");
      const compJson = await compRes.json();
      const existing = compJson.data || [];

      const res = await fetch("/api/ai/proxy?endpoint=duplicate-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          latitude,
          longitude,
          existing_complaints: existing,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.message || "Duplicate check failed.");
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to execute duplicate scan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Spatial & Verbal Duplicate Detection Engine
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Calculates Haversine geographic proximity, word n-gram Jaccard overlap, and category congruence to detect duplicate complaints without automatic deletion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Query Complaint Parameters</h3>

          <form onSubmit={handleCheck} className="space-y-3">
            <Input
              label="Title"
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

            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Latitude"
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
              />
              <Input
                label="Longitude"
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
              />
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={loading} className="w-full gap-2 mt-2">
              <Layers className="w-4 h-4" /> Run Duplicate Analysis
            </Button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Duplicate Matching Score</h3>

          {result ? (
            <div className="space-y-4 text-xs">
              <div
                className={`p-4 rounded-xl border space-y-1 ${
                  result.is_potential_duplicate
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}
              >
                <span className="text-[10px] uppercase font-mono font-bold">
                  {result.is_potential_duplicate ? "Potential Duplicate Alert" : "Unique Grievance Verified"}
                </span>
                <div className="text-base font-bold">
                  Highest Similarity: {Math.round(result.highest_score * 100)}%
                </div>
                <p className="text-xs">
                  {result.is_potential_duplicate
                    ? "Exceeds duplicate threshold (65%). Flagged for manual review."
                    : "No significant duplicate found within spatial and textual threshold."}
                </p>
              </div>

              {result.matches && result.matches.length > 0 ? (
                <div className="space-y-3">
                  <span className="font-semibold text-slate-700 block">Matched Database Complaints:</span>
                  {result.matches.map((m: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between font-mono font-bold text-slate-900">
                        <span>{m.tracking_id}</span>
                        <span>{Math.round(m.similarity_score * 100)}% match</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {m.distance_meters !== null && `Distance: ${m.distance_meters}m • `}
                        {m.match_reasons.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">No existing records exceeded the minimum match threshold.</p>
              )}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              Enter grievance text and coordinates, then run duplicate analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

