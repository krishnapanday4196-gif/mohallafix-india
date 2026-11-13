"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { GoogleButton } from "@/components/ui/GoogleButton";

export default function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">
            Mohalla<span className="text-emerald-600">Fix</span> India
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Citizen Account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Join thousands of citizens making their neighborhoods clean and accountable
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Citizen benefits */}
          <div className="space-y-3 pb-2 border-b border-slate-100">
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5" />
              </div>
              <div>
                <strong className="text-slate-800">1-Click Instant Registration:</strong> No forms to fill, no passwords to memorize.
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5" />
              </div>
              <div>
                <strong className="text-slate-800">Real Problem Reporting:</strong> Upload photos, capture GPS, and connect with civic officers.
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5" />
              </div>
              <div>
                <strong className="text-slate-800">100% Privacy Protected:</strong> Personal details are never published on the public grievance feed.
              </div>
            </div>
          </div>

          {/* 1-Click Google Sign Up */}
          <div className="space-y-3">
            <GoogleButton
              label="Sign up with Google"
              onError={(msg) => setErrorMsg(msg)}
            />
            <p className="text-[11px] text-center text-slate-400">
              Secure authentication powered by Google &amp; Supabase
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
              Sign In with Google
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 text-center text-[11px] text-slate-400">
          Official Government-Grade Public Grievance Portal • Zero Demo Data
        </div>
      </div>
    </div>
  );
}
