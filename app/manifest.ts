import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MohallaFix India | Report. Track. Resolve.",
    short_name: "MohallaFix",
    description:
      "Citizen grievance redressal platform enabling Indian citizens to report civic defects, track complaints transparently and connect with authorized officers.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    orientation: "portrait-primary",
    scope: "/",
    id: "/",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    categories: ["government", "utilities", "productivity"],
    shortcuts: [
      {
        name: "File Grievance",
        short_name: "Report",
        description: "Report a public problem with photo and GPS",
        url: "/citizen/submit",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Public Map",
        short_name: "Live Map",
        description: "Explore neighborhood civic complaints on live map",
        url: "/map",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Track Complaint",
        short_name: "Track",
        description: "Track status by tracking ID",
        url: "/track",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
