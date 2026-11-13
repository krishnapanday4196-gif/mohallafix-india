import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Haversine formula to compute distance in meters
function getHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { error: "Query parameters 'lat' and 'lng' are required." },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "Invalid latitude or longitude values." },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch Real OpenStreetMap Nominatim reverse geocode data
    let nominatimData: any = null;
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const res = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "MohallaFix-India/1.0 (civic-grievance-portal@mohallafix.in)",
          "Accept-Language": "en-US,en;q=0.9",
        },
        next: { revalidate: 60 },
      });

      if (res.ok) {
        nominatimData = await res.json();
      }
    } catch (geoErr) {
      console.warn("Nominatim fetch failed, fallback to coordinates:", geoErr);
    }

    const addr = nominatimData?.address || {};

    const road = addr.road || addr.pedestrian || addr.footway || "Local Road";
    const mohalla =
      addr.suburb ||
      addr.neighbourhood ||
      addr.residential ||
      addr.village ||
      addr.hamlet ||
      "Local Ward";
    const city =
      addr.city || addr.town || addr.municipality || addr.city_district || "District";
    const district = addr.state_district || addr.county || addr.city_district || city;
    const state = addr.state || "India";
    const pincode = (addr.postcode || "").replace(/\D/g, "").slice(0, 6);

    // Extract nearby landmark from amenity/shop/leisure/building/name
    let landmark = "";
    if (addr.amenity) landmark = `Near ${addr.amenity.replace(/_/g, " ")}`;
    else if (addr.shop) landmark = `Near ${addr.shop.replace(/_/g, " ")} Shop`;
    else if (addr.building) landmark = `Near ${addr.building} Building`;
    else if (addr.leisure) landmark = `Near ${addr.leisure.replace(/_/g, " ")}`;
    else if (addr.place_of_worship) landmark = `Near ${addr.place_of_worship}`;
    else if (nominatimData?.name) landmark = `Near ${nominatimData.name}`;
    else landmark = `Near ${road}, ${mohalla}`;

    // Estimated civic authority based on city / district
    let jurisdiction = "Local Municipal Corporation / Nagar Nigam";
    if (state.toLowerCase().includes("delhi")) {
      jurisdiction = `Municipal Corporation of Delhi (MCD) • ${district} Zone`;
    } else if (city) {
      jurisdiction = `${city} Municipal Corporation / Nagar Palika`;
    }

    // 2. Query nearby real complaints in database within 1000m (1 km)
    const nearbyComplaints: any[] = [];
    try {
      const supabase = await createServerSupabaseClient();
      const { data: dbComplaints } = await supabase
        .from("complaints")
        .select("id, tracking_id, title, status, latitude, longitude, address, category_id")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .limit(50);

      if (dbComplaints) {
        for (const c of dbComplaints) {
          if (c.latitude && c.longitude) {
            const dist = getHaversineDistanceMeters(lat, lng, c.latitude, c.longitude);
            if (dist <= 1000) {
              nearbyComplaints.push({
                id: c.id,
                tracking_id: c.tracking_id,
                title: c.title,
                status: c.status,
                distance_meters: dist,
                address: c.address,
              });
            }
          }
        }
      }
      // Sort by distance (closest first)
      nearbyComplaints.sort((a, b) => a.distance_meters - b.distance_meters);
    } catch (dbErr) {
      console.warn("Could not query nearby complaints:", dbErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        formatted_address: nominatimData?.display_name || `${road}, ${mohalla}, ${city}`,
        road,
        mohalla,
        city,
        district,
        state,
        pincode,
        nearest_landmark: landmark,
        jurisdiction,
        nearby_complaints_count: nearbyComplaints.length,
        nearby_complaints: nearbyComplaints.slice(0, 5),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to analyze location surroundings." },
      { status: 500 }
    );
  }
}
