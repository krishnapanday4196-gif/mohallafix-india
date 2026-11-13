"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Complaint } from "@/types/database";

interface ComplaintMapInnerProps {
  complaints: Complaint[];
  selectedComplaintId?: string | null;
  onSelectComplaint?: (c: Complaint) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  allowLocationPick?: boolean;
  selectedLocation?: [number, number] | null;
  onLocationPick?: (lat: number, lng: number) => void;
}

export default function ComplaintMapInner({
  complaints = [],
  selectedComplaintId,
  onSelectComplaint,
  center = [20.5937, 78.9629], // Geographic center of India
  zoom = 5,
  height = "500px",
  allowLocationPick = false,
  selectedLocation = null,
  onLocationPick,
}: ComplaintMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const pickMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = selectedLocation || center;
      const initialZoom = selectedLocation ? 15 : zoom;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
      });

      // Standard OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markerGroup = L.layerGroup().addTo(map);
      markerGroupRef.current = markerGroup;
      mapInstanceRef.current = map;

      // Handle click to pick location
      if (allowLocationPick && onLocationPick) {
        map.on("click", (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onLocationPick(lat, lng);
        });
      }

      // Ensure proper rendering after DOM layout
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Center and Zoom when center prop changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !center) return;
    map.flyTo(center, zoom || 15, { duration: 1.2 });
  }, [center?.[0], center?.[1], zoom]);

  // Sync Selected / Picked Location Pin
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedLocation && selectedLocation[0] && selectedLocation[1]) {
      const [lat, lng] = selectedLocation;

      const pickerIcon = L.divIcon({
        className: "custom-pin",
        html: `<div style="background-color: #059669; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 12px rgba(5,150,105,0.5); display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;"><div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      if (pickMarkerRef.current) {
        pickMarkerRef.current.setLatLng([lat, lng]);
      } else {
        const marker = L.marker([lat, lng], { icon: pickerIcon }).addTo(map);
        marker.bindPopup("<div style='font-size:12px; font-weight:bold; color:#065f46;'>📍 Selected Location</div>");
        pickMarkerRef.current = marker;
      }

      map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 1 });
    } else {
      if (pickMarkerRef.current) {
        pickMarkerRef.current.remove();
        pickMarkerRef.current = null;
      }
    }
  }, [selectedLocation?.[0], selectedLocation?.[1]]);

  // Sync complaint markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();

    const validCoordinatesComplaints = complaints.filter(
      (c) =>
        typeof c.latitude === "number" &&
        typeof c.longitude === "number" &&
        !isNaN(c.latitude) &&
        !isNaN(c.longitude)
    );

    if (validCoordinatesComplaints.length > 0 && !selectedLocation) {
      const bounds: L.LatLngExpression[] = [];

      validCoordinatesComplaints.forEach((c) => {
        const lat = c.latitude!;
        const lng = c.longitude!;
        bounds.push([lat, lng]);

        const isCritical = c.priority === "CRITICAL" || c.status === "ESCALATED";
        const isResolved = c.status === "RESOLVED" || c.status === "CITIZEN_CONFIRMED";
        const pinColor = isResolved ? "#10b981" : isCritical ? "#ef4444" : "#0284c7";

        const icon = L.divIcon({
          className: "complaint-map-marker",
          html: `<div style="background-color: ${pinColor}; width: 24px; height: 24px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">!</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12],
        });

        const marker = L.marker([lat, lng], { icon }).addTo(markerGroup);

        const popupHtml = `
          <div style="font-family: sans-serif; font-size: 12px; min-width: 180px; padding: 2px;">
            <div style="font-weight: bold; color: #0f172a; margin-bottom: 4px;">${c.title}</div>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">ID: ${c.tracking_id}</div>
            <div style="display: inline-block; padding: 2px 6px; font-size: 10px; border-radius: 4px; background: #ecfdf5; color: #065f46; font-weight: 600; margin-bottom: 6px;">
              ${c.status.replace(/_/g, " ")}
            </div>
            <div style="color: #334155; font-size: 11px; margin-bottom: 8px;">${c.address || "Location recorded"}</div>
            <a href="/complaints/${c.id}" style="color: #059669; font-weight: 600; text-decoration: none; font-size: 11px;">View Complaint Details &rarr;</a>
          </div>
        `;

        marker.bindPopup(popupHtml);

        marker.on("click", () => {
          if (onSelectComplaint) onSelectComplaint(c);
        });
      });

      if (bounds.length > 0 && !center) {
        map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [complaints, onSelectComplaint, selectedLocation]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: "100%" }}
      className="rounded-2xl overflow-hidden z-10 border border-slate-200"
    />
  );
}
