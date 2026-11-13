import React from "react";
import Link from "next/link";
import { MailCheck, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">MohallaFix India</span>
        </Link>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl border border-slate-200/90 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
            <MailCheck className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">Verify Your Email Address</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            We have dispatched a verification link to your email. Click the link in your inbox to confirm your citizen profile and start filing grievances.
          </p>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login">
              <Button variant="primary" size="md" className="w-full">
                Proceed to Login
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="w-full text-slate-500">
                Back to Public Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

