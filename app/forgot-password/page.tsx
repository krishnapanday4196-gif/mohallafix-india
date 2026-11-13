"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { GoogleButton } from "@/components/ui/GoogleButton";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">MohallaFix India</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Passwordless 1-Click Access</h2>
        <p className="text-xs text-slate-500 mt-1">
          MohallaFix India uses secure 1-Click Google authentication.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No Passwords to Remember!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Aapko koi bhi password yaad rakhne ki zaroorat nahi hai. Aap seedhe Google account se 1-click mein access kar sakte hain.
            </p>
          </div>

          <div className="pt-2">
            <GoogleButton label="Continue with Google" />
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
