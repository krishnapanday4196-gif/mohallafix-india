import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  FileText,
  AlertTriangle,
  Info,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { fetchCategories, fetchPublicComplaints, getAnalyticsMetrics } from "@/lib/services/complaintService";


export default async function HomePage() {
  const [categories, complaints, metrics] = await Promise.all([
    fetchCategories(),
    fetchPublicComplaints({ limit: 6 }),
    getAnalyticsMetrics(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-emerald-50/20 to-[#f8fafc] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Civic Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            India's Civic Redressal & Public Infrastructure Engine
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight mb-6">
            Every Mohalla Deserves <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Accountable & Transparent
            </span>{" "}
            Fixes.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Report broken roads, garbage dumps, contaminated water, and dark streetlights.
            Track resolution milestones transparently with real timestamps and verifiable proof.
          </p>

          {/* Quick Tracking Input Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <form action="/track" method="GET" className="relative flex items-center shadow-sm">
              <input
                type="text"
                name="id"
                placeholder="Enter Complaint Tracking ID (e.g. MHF-20261113-ABCD)..."
                className="w-full h-13 pl-4 pr-32 rounded-2xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
              >
                Track Now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link href="/citizen/submit">
              <Button size="lg" variant="primary" className="shadow-md">
                File a Civic Grievance
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/map">
              <Button size="lg" variant="outline">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Explore Public Map
              </Button>
            </Link>
            <Link href="/ai">
              <Button size="lg" variant="secondary" className="gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                AI Intelligence Hub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Honest Real-time Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <span className="text-xs font-medium text-slate-500">Total Registered</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {metrics.total}
            </span>
            <span className="text-[11px] text-slate-600 mt-1 font-medium">Real verified records</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <span className="text-xs font-medium text-amber-700">In Progress</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {metrics.in_progress + metrics.assigned}
            </span>
            <span className="text-[11px] text-slate-600 mt-1 font-medium">Assigned to officers</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <span className="text-xs font-medium text-emerald-700">Resolved & Confirmed</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {metrics.resolved + metrics.citizen_confirmed}
            </span>
            <span className="text-[11px] text-slate-600 mt-1 font-medium">With resolution proof</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col">
            <span className="text-xs font-medium text-rose-700">Escalated</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">
              {metrics.escalated}
            </span>
            <span className="text-[11px] text-slate-600 mt-1 font-medium">SLA breaches tracked</span>
          </div>
        </div>
      </section>

      {/* Problem Categories Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Categorized Grievances
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Official Infrastructure Categories
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View All SLAs and Mappings
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/citizen/submit?category_id=${cat.id}`}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description || "Report municipal infrastructure problems in this category."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" /> SLA: {cat.sla_hours} hrs
                </span>
                <span className="font-medium text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                  Report &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4-Step Lifecycle Overview */}
      <section className="py-16 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Transparency Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              How MohallaFix Resolves Problems
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Every status change is verified and recorded with an immutable database audit log.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col">
              <span className="text-2xl font-black text-slate-300 mb-2">01</span>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Report with Evidence</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Citizen submits genuine photo/video, captures GPS coordinates, and provides specific address.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col">
              <span className="text-2xl font-black text-slate-300 mb-2">02</span>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">AI & Verification</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Computer vision classifies problem severity, detects potential duplicates, and tags responsible department.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col">
              <span className="text-2xl font-black text-slate-300 mb-2">03</span>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Officer Assigned</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Authorized departmental engineer accepts assignment, inspects on-ground, and posts work progress.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col">
              <span className="text-2xl font-black text-slate-300 mb-2">04</span>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Resolution & Confirmation</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Officer uploads resolution photograph. The citizen confirms the fix or reopens if unfinished.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Public Complaints Preview Section (Zero fake data) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Public Grievances</h2>
            <p className="text-xs text-slate-500 mt-1">
              Real citizen complaints registered in our database.
            </p>
          </div>
          <Link href="/complaints">
            <Button variant="outline" size="sm">
              View All Complaints
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {complaints.length === 0 ? (
          <EmptyState
            title="No complaints found yet."
            description="There are currently zero public complaints in the database. When citizens file issues, they will appear here live."
            action={
              <Link href="/citizen/submit">
                <Button variant="primary" size="sm">
                  Be the first to report an issue
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {complaints.map((c) => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
