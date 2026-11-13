"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Filter,
  Search,
  Navigation,
  Layers,
  Info,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ComplaintMap } from "@/components/maps/ComplaintMap";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Complaint, ComplaintCategory } from "@/types/database";

export default function PublicMapPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [userSurroundings, setUserSurroundings] = useState<any>(null);
  const [geoLocating, setGeoLocating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [complaintsRes, categoriesRes] = await Promise.all([
          fetch("/api/complaints?limit=100"),
          fetch("/api/categories"),
        ]);

        const complaintsJson = await complaintsRes.json();
        const categoriesJson = await categoriesRes.json();

        setComplaints(complaintsJson.data || []);
        setCategories(categoriesJson.data || []);
      } catch (err) {
        console.error("Failed to load map data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleGetLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation([lat, lng]);
        setGeoLocating(false);
        fetch(`/api/geo/surroundings?lat=${lat}&lng=${lng}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.success) setUserSurroundings(json.data);
          })
          .catch((e) => console.warn(e));
      },
      (err) => {
        setGeoLocating(false);
        let msg = "Location access unavailable: " + err.message;
        if (err.code === 1) {
          msg = "Location permission denied. Kripya browser address bar mein lock icon par click karke Location 'Allow' karein.";
        } else if (err.code === 2) {
          msg = "Device GPS position unavailable.";
        } else if (err.code === 3) {
          msg = "Location request timed out. Kripya dobara try karein.";
        }
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const filteredComplaints = complaints.filter((c) => {
    if (selectedCategory && c.category_id !== selectedCategory) return false;
    if (selectedStatus && c.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (c.title || "").toLowerCase().includes(q);
      const matchAddress = (c.address || "").toLowerCase().includes(q);
      const matchId = (c.tracking_id || "").toLowerCase().includes(q);
      if (!matchTitle && !matchAddress && !matchId) return false;
    }
    return true;
  });

  const validGeocodedCount = filteredComplaints.filter(
    (c) => typeof c.latitude === "number" && typeof c.longitude === "number"
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Title & Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h1 className="text-xl font-bold text-slate-900">Public Civic Map</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive OpenStreetMap rendering real complaint coordinates. Zero simulated locations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetLocation}
              isLoading={geoLocating}
              className="text-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              Use My Current GPS
            </Button>
            <Link href="/citizen/submit">
              <Button variant="primary" size="sm" className="text-xs">
                Report from Map
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search address, landmark, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="VERIFIED">Verified</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CITIZEN_CONFIRMED">Citizen Confirmed</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>
        </div>

        {/* Map Canvas and Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative">
            {loading ? (
              <div className="w-full h-[520px] bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="w-7 h-7 animate-spin text-emerald-600 mb-2" />
                <span className="text-xs">Loading OpenStreetMap & complaints...</span>
              </div>
            ) : (
              <div className="relative">
                <ComplaintMap
                  complaints={filteredComplaints}
                  center={userLocation || [28.6139, 77.209]}
                  selectedLocation={userLocation}
                  zoom={userLocation ? 15 : 5}
                  height="400px"
                  onSelectComplaint={(c) => setSelectedComplaint(c)}
                />

                {/* Floating summary badge */}
                <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-slate-800">
                    {validGeocodedCount} GPS Markers
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500">Live Database Coordinates</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Detail Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Selected Landmark Detail</span>
                {selectedComplaint && (
                  <StatusBadge status={selectedComplaint.status} />
                )}
              </h3>

              {selectedComplaint ? (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      Tracking ID
                    </span>
                    <p className="font-mono font-bold text-emerald-800 text-sm">
                      {selectedComplaint.tracking_id}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Title</span>
                    <h4 className="font-semibold text-slate-900 text-sm mt-0.5">
                      {selectedComplaint.title}
                    </h4>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Description</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span className="text-slate-700">{selectedComplaint.address}</span>
                    </div>
                    {typeof selectedComplaint.latitude === "number" && (
                      <div className="text-[11px] font-mono text-slate-400 pl-5">
                        {selectedComplaint.latitude.toFixed(5)},{" "}
                        {selectedComplaint.longitude?.toFixed(5)}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link href={`/complaints/${selectedComplaint.id}`}>
                      <Button variant="primary" size="sm" className="w-full">
                        Full Investigation Details
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : userSurroundings ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-emerald-50 rounded-xl space-y-2 border border-emerald-200/80">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      Aapki Current Location (Live GPS)
                    </div>
                    <p className="text-emerald-800 font-medium leading-relaxed">
                      {userSurroundings.formatted_address}
                    </p>
                    <div className="text-[11px] text-emerald-700">
                      Authority: <strong>{userSurroundings.jurisdiction}</strong>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-mono">
                      PIN: {userSurroundings.pincode}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-200">
                    <span className="font-semibold text-slate-800 block text-xs">
                      Aas-Paas Ki Shikayatein (1km Radar):
                    </span>
                    <span className="text-slate-600">
                      {userSurroundings.nearby_complaints_count > 0
                        ? `${userSurroundings.nearby_complaints_count} issues recorded around your neighborhood.`
                        : "No public complaints recorded in this 1km radius yet."}
                    </span>
                  </div>

                  <Link href="/citizen/submit">
                    <Button variant="primary" size="sm" className="w-full gap-1.5">
                      Report Problem at this Location &rarr;
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="py-12 text-center space-y-2">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">
                    Click any marker on the map to inspect grievance details.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Markers represent real citizen reports with confirmed coordinates.
                  </p>
                </div>
              )}
            </div>

            {/* Honest Disclosure notice */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Coordinates are captured strictly with citizen device permission or manual map placement. Zero fake coordinates are generated.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

