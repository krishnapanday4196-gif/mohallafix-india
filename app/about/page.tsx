import React from "react";
import Link from "next/link";
import { ShieldCheck, Target, Heart, Award, Users, AlertCircle, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            About MohallaFix India
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Building Civic Accountability for Indian Neighborhoods
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Report. Track. Resolve. A public infrastructure problem management platform empowering citizens and civic administrators with genuine transparency.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Civic Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To bridge the gap between Indian residents and responsible civic departments by digitizing the grievance lifecycle from photographic submission to citizen-confirmed resolution.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Absolute Integrity Policy</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We operate under a strict zero-fabrication standard: no fake demo counts, no fabricated complaints, and no auto-closing of grievances without verifiable photographic proof and citizen confirmation.
            </p>
          </div>
        </div>

        {/* Section 16 Government Integration Disclosure */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <AlertCircle className="w-4 h-4 text-emerald-600" />
            Transparent Government Connectivity Policy
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            MohallaFix India maintains complete honesty about government system connectivity. Complaints filed on this platform are recorded in the MohallaFix database. Direct submission into municipal portals (e.g. Municipal Corporation, PWD, Jal Board) requires authorized API credentials and official partnership agreements. We never claim a complaint is delivered to an external agency unless authorized API access has been completed.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Our Core Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="text-emerald-600 font-bold text-sm">Real GPS Evidence</div>
              <p className="text-xs text-slate-500">
                Verifiable coordinates and media attachments prevent frivolous submissions.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="text-emerald-600 font-bold text-sm">Citizen Confirmation</div>
              <p className="text-xs text-slate-500">
                No complaint is permanently resolved until the complainant verifies the ground repair.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="text-emerald-600 font-bold text-sm">Automated Escalation</div>
              <p className="text-xs text-slate-500">
                SLA breaches automatically trigger notifications to higher administrative authorities.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-6 border-t border-slate-200">
          <Link href="/citizen/submit">
            <Button size="lg" variant="primary">
              Report an Issue in Your Mohalla
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

