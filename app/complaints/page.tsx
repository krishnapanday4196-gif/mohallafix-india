import React from "react";
import Link from "next/link";
import { Search, Filter, Plus, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { fetchCategories, fetchPublicComplaints } from "@/lib/services/complaintService";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PublicComplaintsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const categoryId = resolvedParams.category_id;
  const status = resolvedParams.status;
  const search = resolvedParams.q;

  const [categories, complaints] = await Promise.all([
    fetchCategories(),
    fetchPublicComplaints({
      categoryId,
      status,
      search,
      limit: 60,
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Public Complaints Registry
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Transparent, searchable feed of civic infrastructure grievances filed by citizens across India.
            </p>
          </div>

          <Link href="/citizen/submit">
            <Button variant="primary" size="md" className="gap-2">
              <Plus className="w-4 h-4" />
              File New Complaint
            </Button>
          </Link>
        </div>

        {/* Filter / Search Bar */}
        <form
          action="/complaints"
          method="GET"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3"
        >
          <div className="relative sm:col-span-2">
            <input
              type="text"
              name="q"
              defaultValue={search || ""}
              placeholder="Search title, description, or tracking ID (MHF-...)..."
              className="w-full pl-3 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              name="category_id"
              defaultValue={categoryId || ""}
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

          <div className="flex items-center gap-2">
            <select
              name="status"
              defaultValue={status || ""}
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
              <option value="REOPENED">Reopened</option>
              <option value="ESCALATED">Escalated</option>
            </select>
            <Button type="submit" variant="secondary" size="sm" className="shrink-0 text-xs">
              Filter
            </Button>
          </div>
        </form>

        {/* Complaints Grid or Honest Empty State */}
        {complaints.length === 0 ? (
          <EmptyState
            title="No complaints found yet."
            description={
              search || categoryId || status
                ? "No stored complaints match the applied filters."
                : "No civic problems have been registered in the database yet. When citizens file grievances, they will appear here in real time."
            }
            action={
              <Link href="/citizen/submit">
                <Button variant="primary" size="sm">
                  Report First Issue
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {complaints.map((c) => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
