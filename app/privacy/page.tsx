import React from "react";
import { ShieldCheck, Lock, EyeOff, Database } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Privacy & Data Security
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Effective Date: November 2026</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-emerald-600" /> 1. Protection of Citizen Identity
            </h2>
            <p>
              MohallaFix India prioritizes citizen privacy. When you file a public complaint, your private contact details (phone number, email address, and personal password) are never published on the public feed or map. Only the grievance title, category, street location, and photographic evidence are displayed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" /> 2. Location & GPS Data Usage
            </h2>
            <p>
              GPS coordinates are accessed only when you explicitly grant location permission in your browser or manually position the pin on the map. Coordinates are stored in our PostgreSQL database to enable spatial clustering, duplicate detection, and departmental dispatch. We do not track your location in the background.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" /> 3. Data Storage & Security
            </h2>
            <p>
              All user accounts are authenticated through encrypted Supabase Auth tokens. Row Level Security (RLS) policies are enforced at the PostgreSQL database layer, preventing unauthorized access or modification of records across accounts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 4. Information Sharing
            </h2>
            <p>
              Information is shared only with verified civic officers assigned to resolve your grievance. We do not sell or monetize personal data for third-party commercial advertising.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

