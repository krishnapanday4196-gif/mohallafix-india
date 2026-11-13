import React from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Shield,
  Layers,
  Clock,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Citizen Submits Complaint",
      badge: "SUBMITTED",
      desc: "Capture or upload real photographs, choose the category, provide landmark address, and grant GPS location for pinpoint accuracy.",
      detail: "Unique tracking ID (e.g. MHF-20261113-XXXX) generated instantly.",
    },
    {
      num: "02",
      title: "AI Analysis & Duplicate Check",
      badge: "UNDER REVIEW",
      desc: "Our computer vision scans photographic features, checks for duplicates within geo-radius, calculates urgency score, and tags the target department.",
      detail: "Human review is always preserved before final assignment.",
    },
    {
      num: "03",
      title: "Verification & Assignment",
      badge: "ASSIGNED",
      desc: "Administrator or nodal officer verifies validity and assigns the task to a certified ground officer with strict SLA deadline countdown.",
      detail: "Officer receives assignment notification with GPS coordinates.",
    },
    {
      num: "04",
      title: "On-Ground Action & Evidence",
      badge: "IN PROGRESS & RESOLVED",
      desc: "Authorized officer visits site, conducts repair/cleaning, and submits genuine photographic proof of completed work.",
      detail: "Resolution evidence is timestamped in database.",
    },
    {
      num: "05",
      title: "Citizen Confirmation or Reopen",
      badge: "CITIZEN CONFIRMED",
      desc: "The reporting citizen inspects the resolution evidence. If satisfied, they confirm and rate the service. If unresolved, they can reopen the complaint.",
      detail: "No complaint is closed solely by officer assertion.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Civic Workflow
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How MohallaFix Resolves Problems
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A strict, multi-stage lifecycle ensuring genuine civic accountability from photographic submission to citizen confirmation.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:border-emerald-300 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-black shrink-0">
                {step.num}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {step.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                <p className="text-xs font-medium text-emerald-700 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reopen & Escalation notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <RotateCcw className="w-4 h-4 text-amber-700" /> Reopening Rights
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              If an officer marks a problem resolved but the ground issue persists (e.g. pothole not filled properly or garbage left behind), the citizen can immediately reopen the grievance with fresh photographic evidence.
            </p>
          </div>

          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-700" /> Automatic Escalation
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              When an assigned grievance exceeds its designated Service Level Agreement (SLA) hours without progress, it is flagged as ESCALATED to the District Magistrate or Chief Engineer.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link href="/citizen/submit">
            <Button size="lg" variant="primary">
              Ready to Report a Problem? Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

