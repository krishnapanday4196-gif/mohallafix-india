import React from "react";
import Link from "next/link";
import {
  Building2,
  Clock,
  AlertCircle,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PriorityBadge } from "@/components/ui/Badge";
import { fetchCategories } from "@/lib/services/complaintService";

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Municipal Classifications
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Infrastructure Problem Categories & SLAs
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every grievance is mapped to a dedicated municipal department with defined Service Level Agreement (SLA) turnaround times.
          </p>
        </div>

        {/* Categories Table / Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <PriorityBadge priority={cat.priority_level} />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">{cat.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {cat.description || "Public infrastructure issue falling under this classification."}
                </p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Target Redressal SLA:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {cat.sla_hours} Hours
                    </span>
                  </div>
                  {cat.department && (
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Nodal Department:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                        {cat.department.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Slug: {cat.slug}</span>
                <Link href={`/citizen/submit?category_id=${cat.id}`}>
                  <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                    File Under This &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* SLA Escalation Policy */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-600" /> SLA Transparency Policy
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Service Level Agreements represent maximum targeted response times. Critical health hazards like open manholes and pipeline bursts are weighted for emergency 24-36 hour intervention. If an assigned complaint exceeds SLA hours without progress, it is marked ESCALATED in public reports.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
