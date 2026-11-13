"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Navigation,
  FileText,
  Image as ImageIcon,
  Loader2,
  Layers,
  ArrowRight,
  Building2,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ComplaintMap } from "@/components/maps/ComplaintMap";
import { ComplaintCategory } from "@/types/database";

export default function SubmitComplaintPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  const [isPublic, setIsPublic] = useState(true);
  const [landmarkInput, setLandmarkInput] = useState("");
  const [surroundings, setSurroundings] = useState<any>(null);
  const [fetchingSurroundings, setFetchingSurroundings] = useState(false);

  // File uploads
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // AI states
  const [aiAnalyzingImage, setAiAnalyzingImage] = useState(false);
  const [aiClassificationResult, setAiClassificationResult] = useState<any>(null);
  const [aiWriting, setAiWriting] = useState(false);
  const [aiDuplicates, setAiDuplicates] = useState<any[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successTrackingId, setSuccessTrackingId] = useState<string | null>(null);
  const [geoLocating, setGeoLocating] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        setCategories(json.data || []);
        if (json.data && json.data.length > 0) {
          setCategoryId(json.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setFetchingSurroundings(true);
      const res = await fetch(`/api/geo/surroundings?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSurroundings(json.data);
          if (json.data.formatted_address) {
            setAddress(json.data.formatted_address);
          }
          if (json.data.pincode) {
            setPincode(json.data.pincode);
          }
          if (json.data.nearest_landmark && !landmarkInput) {
            setLandmarkInput(json.data.nearest_landmark);
          }
        }
      }
    } catch (e) {
      console.warn("Reverse geocode error:", e);
    } finally {
      setFetchingSurroundings(false);
    }
  };

  const handleGetLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setGeoLocating(false);
        await reverseGeocode(lat, lng);
      },
      (err) => {
        setGeoLocating(false);
        let msg = "Could not get your location.";
        if (err.code === 1) {
          msg = "Location permission denied. Kripya browser address bar mein lock icon par click karke Location allow karein, ya neeche map par click karke location chunein.";
        } else if (err.code === 2) {
          msg = "GPS signal unavailable. Aap neeche map par click karke direct location select kar sakte hain.";
        } else if (err.code === 3) {
          msg = "Location request timed out. Kripya neeche map par click karke location chunein.";
        }
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleMapLocationPick = async (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    await reverseGeocode(lat, lng);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setErrorMsg("File must be an image (PNG, JPG, WEBP) or video (MP4).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File size must not exceed 15MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setErrorMsg("");

    // Auto-trigger AI Image Analysis if image
    if (file.type.startsWith("image/")) {
      await runAIImageAnalysis(file);
    }
  };

  const runAIImageAnalysis = async (file: File) => {
    try {
      setAiAnalyzingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ai/proxy?endpoint=classify-image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAiClassificationResult(data);

        // If category matched, auto-select
        const match = categories.find((c) =>
          c.name.toLowerCase().includes(data.predicted_category.toLowerCase())
        );
        if (match) {
          setCategoryId(match.id);
        }
      }
    } catch (err) {
      console.error("AI classification error", err);
    } finally {
      setAiAnalyzingImage(false);
    }
  };

  const handleAIWritingAssist = async () => {
    if (!description || description.length < 5) {
      setErrorMsg("Please enter at least a brief description before using the AI Writing Assistant.");
      return;
    }

    try {
      setAiWriting(true);
      setErrorMsg("");
      const selectedCat = categories.find((c) => c.id === categoryId)?.name || "";

      const res = await fetch("/api/ai/proxy?endpoint=writing-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_text: description,
          category: selectedCat,
          location_hint: address,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.refined_title && !title) {
          setTitle(data.refined_title);
        }
        if (data.refined_description) {
          setDescription(data.refined_description);
        }
      } else {
        setErrorMsg("AI writing assistant service is currently unavailable.");
      }
    } catch (err: any) {
      setErrorMsg("Failed to connect to AI writing assistant.");
    } finally {
      setAiWriting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessTrackingId(null);

    if (!title.trim()) {
      setErrorMsg("Kripya complaint ka title enter karein.");
      return;
    }

    if (!description.trim()) {
      setErrorMsg("Kripya complaint ka description enter karein.");
      return;
    }

    if (!categoryId) {
      setErrorMsg("Kripya problem category select karein.");
      return;
    }

    if (!address.trim()) {
      setErrorMsg("Kripya street address enter karein ya map par click karein.");
      return;
    }

    // Clean pincode or default
    const cleanPin = pincode.replace(/\D/g, "");
    const finalPin = cleanPin.length === 6 ? cleanPin : "110001";

    try {
      setSubmitting(true);
      const mediaUrls = previewUrl ? [previewUrl] : [];

      const cleanLandmark = landmarkInput.trim();
      const finalAddress =
        cleanLandmark && !address.toLowerCase().includes(cleanLandmark.toLowerCase())
          ? `${cleanLandmark}, ${address.trim()}`
          : address.trim();

      const payload = {
        title,
        description,
        category_id: categoryId,
        address: finalAddress,
        pincode: finalPin,
        latitude,
        longitude,
        priority,
        is_public: isPublic,
        media_urls: mediaUrls,
      };

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error || "Failed to submit grievance. Please try again.");
        return;
      }

      setSuccessTrackingId(json.tracking_id);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          File a Public Infrastructure Complaint
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Provide accurate evidence, specific location details, and category to alert the authorized department.
        </p>
      </div>

      {successTrackingId ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Complaint Successfully Registered!</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your grievance has been stored in the database with high-priority tracking. Keep your tracking ID safe for live updates.
          </p>

          <div className="p-4 bg-emerald-50 rounded-xl max-w-sm mx-auto border border-emerald-200">
            <span className="text-[10px] text-emerald-800 uppercase font-mono block">
              Unique Tracking ID
            </span>
            <span className="text-2xl font-black font-mono text-emerald-900">
              {successTrackingId}
            </span>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link href={`/track?id=${successTrackingId}`}>
              <Button variant="primary" size="md">
                Track Status Now
              </Button>
            </Link>
            <Link href="/citizen/complaints">
              <Button variant="outline" size="md">
                View My Complaints
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Photographic / Video Evidence */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" /> Ground Evidence (Photo / Video)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real photographs provide proof and accelerate departmental action.
                </p>
              </div>
              {aiAnalyzingImage && (
                <span className="inline-flex items-center gap-1.5 text-xs text-teal-700 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI Analyzing Image...
                </span>
              )}
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50/50">
              <input
                type="file"
                accept="image/*,video/mp4"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="max-h-48 mx-auto rounded-xl object-contain border border-slate-200"
                  />
                  <p className="text-xs text-slate-500 font-medium">Click to replace evidence</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click or drag photo/video here
                  </p>
                  <p className="text-[10px] text-slate-400">PNG, JPG, WEBP, MP4 (Max 15MB)</p>
                </div>
              )}
            </div>

            {/* AI Classification Feedback Badge */}
            {aiClassificationResult && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-teal-900">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" /> AI Classification:{" "}
                    {aiClassificationResult.predicted_category}
                  </span>
                  <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-teal-200">
                    Confidence: {Math.round(aiClassificationResult.confidence * 100)}%
                  </span>
                </div>
                <div className="text-[11px] text-teal-800">
                  {aiClassificationResult.detected_features.join(" • ")}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Details & Category */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" /> Grievance Specifics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Problem Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (SLA: {c.sla_hours}h)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perceived Urgency / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="LOW">Low (Cosmetic / Non-disruptive)</option>
                  <option value="MEDIUM">Medium (Moderate traffic or civic inconvenience)</option>
                  <option value="HIGH">High (Disrupts normal activity / water blockage)</option>
                  <option value="CRITICAL">Critical (Immediate safety / open manhole / wire hazard)</option>
                </select>
              </div>
            </div>

            <Input
              label="Complaint Title *"
              required
              placeholder="e.g. Broken water supply pipeline leaking on main road"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Detailed Description *
                </label>
                <button
                  type="button"
                  onClick={handleAIWritingAssist}
                  disabled={aiWriting}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200/80 transition-colors"
                >
                  {aiWriting ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  AI Polish & Structure
                </button>
              </div>
              <Textarea
                rows={4}
                required
                placeholder="Describe the exact issue, landmarks, how long it has persisted, and hazards..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Location & Coordinates */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Geographic Location
                </h3>
                <p className="text-[11px] text-slate-400">
                  Click on map or use your GPS for accurate officer dispatch.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                isLoading={geoLocating}
                className="text-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                Capture My Device GPS
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Street / Landmark Address *"
                  required
                  placeholder="e.g. Near Metro Pillar 142, Main Road, Block C"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="6-Digit PIN Code *"
                  required
                  maxLength={6}
                  placeholder="e.g. 110001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
            </div>

            {/* Interactive Leaflet Picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Map Coordinates Pin:</span>
                <span className="font-mono text-[11px] font-semibold text-emerald-700">
                  {latitude && longitude ? `📍 ${latitude.toFixed(5)}, ${longitude.toFixed(5)}` : "Click on map to drop pin"}
                </span>
              </div>
              <ComplaintMap
                height="280px"
                allowLocationPick={true}
                center={latitude && longitude ? [latitude, longitude] : [28.6139, 77.209]}
                selectedLocation={latitude && longitude ? [latitude, longitude] : null}
                zoom={latitude && longitude ? 16 : 12}
                onLocationPick={handleMapLocationPick}
              />
            </div>

            {/* Live Surroundings & Landmark Intelligence Card */}
            {(surroundings || fetchingSurroundings) && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    Aas-Paas Ki Jankari (Surroundings &amp; Jurisdiction)
                  </span>
                  {fetchingSurroundings ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center gap-1">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" /> Detecting Surroundings...
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Real-time GPS Verified
                    </span>
                  )}
                </div>

                {surroundings && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 block text-[11px]">Exact Mohalla / Sector:</span>
                        <span className="font-semibold text-slate-800">
                          {surroundings.mohalla}, {surroundings.road}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 block text-[11px]">Responsible Civic Authority / Ward:</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          {surroundings.jurisdiction}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Specific Landmark / Kiske Paas Hai (Building / Shop / Mandir / Gate / Pillar):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Metro Pillar 142, Opposite Mother Dairy, Near Shiv Mandir"
                        value={landmarkInput}
                        onChange={(e) => setLandmarkInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white"
                      />
                    </div>

                    {/* Nearby Complaints / Defects Radar */}
                    <div className="pt-1">
                      {surroundings.nearby_complaints_count > 0 ? (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                          <div className="font-semibold flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            {surroundings.nearby_complaints_count} other complaint(s) reported in this 1km vicinity:
                          </div>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                            {surroundings.nearby_complaints.map((c: any) => (
                              <li key={c.id}>
                                <strong>{c.title}</strong> ({c.distance_meters}m away) —{" "}
                                <span className="font-medium text-amber-900">
                                  {c.status.replace(/_/g, " ")}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            No duplicate complaints found within 1km. This will be the first recorded issue at this spot!
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="isPublic" className="text-xs text-slate-700 font-medium">
                Make complaint visible on public map & complaints feed
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={submitting}
              className="gap-2 shadow-sm"
            >
              Submit Complaint
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

