"use client";

import React, { useState } from "react";
import { Upload, Sparkles, AlertCircle, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AIImageAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMsg("");
    setResult(null);
  };

  const handleClassify = async () => {
    if (!selectedFile) {
      setErrorMsg("Please choose an image file to analyze.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/ai/proxy?endpoint=classify-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.message || json.error || "Image classification failed.");
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to connect to AI vision service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Civic Image Classification Studio
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Process photographic evidence through the Python Computer Vision pipeline to detect infrastructure defects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Upload Image Asset</h3>

          <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-52 mx-auto rounded-xl object-contain border border-slate-200"
              />
            ) : (
              <div className="space-y-2 py-4">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Choose photograph</p>
                <p className="text-[10px] text-slate-400">PNG, JPG, WEBP (Max 10MB)</p>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleClassify}
            isLoading={loading}
            disabled={!selectedFile}
            className="w-full gap-2"
          >
            <Sparkles className="w-4 h-4" /> Run Visual Classification
          </Button>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Inference Results Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Model Inference Results</h3>

          {result ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-[10px] text-emerald-800 uppercase font-mono">
                  Predicted Civic Category
                </span>
                <div className="text-base font-bold text-emerald-950">
                  {result.predicted_category}
                </div>
                <div className="text-xs text-emerald-800 font-mono">
                  Confidence Score: {Math.round(result.confidence * 100)}%
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Extracted Visual Signatures:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {result.detected_features.map((feat: string, i: number) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Model: {result.model_name}</span>
                <span>Version: {result.model_version}</span>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              Upload an image and run classification to view computer vision features.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

