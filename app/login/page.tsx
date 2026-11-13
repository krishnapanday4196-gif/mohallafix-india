"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Shield,
  Check,
} from "lucide-react";
import { GoogleButton } from "@/components/ui/GoogleButton";

export default function LoginPage() {
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
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to your account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Indian Citizens, Authorized Officers & Municipal Administrators
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

          {/* Value props */}
          <div className="space-y-2.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>No password or OTP required</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>Verified identity & instant access</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>Track grievances with GPS coordinates</span>
            </div>
          </div>

          {/* 1-Click Google Sign In */}
          <div className="space-y-3">
            <GoogleButton
              label="Continue with Google"
              onError={(msg) => setErrorMsg(msg)}
            />
            <p className="text-[11px] text-center text-slate-400">
              Fast, secure and 100% encrypted authentication
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            New citizen? Clicking &ldquo;Continue with Google&rdquo; automatically creates your verified citizen profile.
          </div>
        </div>

        {/* Portal shortcuts */}
        <div className="mt-6 text-center text-xs text-slate-400 space-x-3">
          <Link href="/officer" className="hover:text-slate-700">
            Officer Portal
          </Link>
          <span>•</span>
          <Link href="/admin" className="hover:text-slate-700">
            Admin Panel
          </Link>
          <span>•</span>
          <Link href="/ai" className="hover:text-slate-700">
            AI Engine
          </Link>
        </div>
      </div>
    </div>
  );
}
