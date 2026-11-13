"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Upload, Camera, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

export default function OfficerResolveComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionPhotoUrl, setResolutionPhotoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Resolution proof must be a photographic image (JPG, PNG, WEBP).");
      return;
    }

    setSelectedFile(file);
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    setResolutionPhotoUrl(objUrl);
    setErrorMsg("");
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!resolutionNotes || resolutionNotes.trim().length < 5) {
      setErrorMsg("Please provide formal resolution details explaining the work carried out.");
      return;
    }

    if (!previewUrl && !resolutionPhotoUrl) {
      setErrorMsg("Photographic resolution proof is mandatory to mark an issue resolved.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "RESOLVED",
          reason: `Resolution Completed: ${resolutionNotes}`,
          evidence_media_url: previewUrl || resolutionPhotoUrl,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.error || "Failed to submit resolution.");
        return;
      }

      setSuccessMsg(
        "Grievance marked RESOLVED. Notification dispatched to citizen for final ground confirmation."
      );
      setTimeout(() => {
        router.push(`/officer/complaints/${id}`);
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit resolution proof.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Link
        href={`/officer/complaints/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Complaint
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Submit Work Completion Proof</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload clear photographic proof of the rectified site. The citizen will verify and confirm resolution.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleResolve} className="space-y-5">
          {/* Photo upload */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Photographic Proof of Completed Fix *
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl}
                    alt="Resolution preview"
                    className="max-h-48 mx-auto rounded-xl object-contain border border-slate-200"
                  />
                  <p className="text-xs text-slate-500 font-medium">Click to replace photo</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    Upload after-repair photo
                  </p>
                  <p className="text-[10px] text-slate-400">Clear daylight capture recommended</p>
                </div>
              )}
            </div>
          </div>

          <Textarea
            label="Resolution Certification Notes *"
            rows={4}
            required
            placeholder="e.g. Pothole filled with dense bituminous concrete, compacted with 10-ton road roller. Traffic movement restored smoothly..."
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Link href={`/officer/complaints/${id}`}>
              <Button type="button" variant="ghost" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="gap-2"
            >
              <FileCheck className="w-4 h-4" /> Certify & Submit Resolution
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

