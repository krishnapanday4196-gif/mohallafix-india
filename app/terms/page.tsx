import React from "react";
import { ShieldCheck, Scale, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Citizen Charter & Terms
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Terms and Conditions</h1>
          <p className="text-xs text-slate-500">Effective Date: November 2026</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" /> 1. Responsible Grievance Submission
            </h2>
            <p>
              Citizens agree to submit genuine photographs and accurate factual information regarding public civic defects. The submission of false, fabricated, abusive, defamatory, or non-civic material is strictly prohibited and subject to account suspension and IP logging.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-600" /> 2. Government Platform Disclaimer
            </h2>
            <p>
              MohallaFix India is a civic technology platform. While we coordinate with authorized officers and municipal departments, submission of a grievance on MohallaFix does not replace formal statutory Right to Information (RTI) filings or court petitions unless official integration has been executed and explicitly verified.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 3. Verification & Officer Accountability
            </h2>
            <p>
              Officer accounts must be verified by super administrators with authentic badge numbers and departmental credentials. Status transitions must include verifiable photographic proof of resolution.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

