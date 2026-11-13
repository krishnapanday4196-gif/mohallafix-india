"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Info, Heart, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 text-sm">
      {/* Honest Transparency Alert Banner */}
      <div className="bg-slate-50 border-b border-slate-200/60 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-2.5 text-xs text-slate-700">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
            <Info className="w-3.5 h-3.5 text-emerald-600" /> Platform Disclosure
          </span>
          <p className="leading-relaxed">
            MohallaFix India operates as an independent civic tracking platform. Complaints are recorded and managed on this platform. Direct integration with government departments is subject to authorized API credentials and official partnership agreements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-lg">MohallaFix India</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering Indian citizens to report public infrastructure issues, track resolution timelines transparently, and connect with authorized civic authorities.
            </p>
            <div className="text-xs text-slate-600 font-medium">
              Tagline: <span className="text-slate-800">Report. Track. Resolve.</span>
            </div>
          </div>

          {/* Col 2: Citizen Resources */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/citizen/submit" className="hover:text-emerald-700 transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-emerald-700 transition-colors">
                  Track Complaint by ID
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="hover:text-emerald-700 transition-colors">
                  Public Complaints Feed
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-emerald-700 transition-colors">
                  Interactive Civic Map
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-700 transition-colors">
                  Problem Categories & SLA
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals & AI */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Portals & AI System
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/citizen" className="hover:text-emerald-700 transition-colors">
                  Citizen Portal
                </Link>
              </li>
              <li>
                <Link href="/officer" className="hover:text-emerald-700 transition-colors">
                  Authorized Officer Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-700 transition-colors">
                  Administrative Dashboard
                </Link>
              </li>
              <li>
                <Link href="/ai" className="hover:text-emerald-700 transition-colors">
                  AI Intelligence Hub
                </Link>
              </li>
              <li>
                <Link href="/ai/duplicate-detection" className="hover:text-emerald-700 transition-colors">
                  Duplicate Complaint Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policy */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Legal & Integrity
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-emerald-700 transition-colors">
                  Privacy Policy & Data Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-700 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-700 transition-colors">
                  About MohallaFix
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-700 transition-colors">
                  Contact Redressal Cell
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} MohallaFix India. Built for Indian Civic Transparency.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-800">
              Privacy
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/terms" className="hover:text-slate-800">
              Terms
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/contact" className="hover:text-slate-800">
              Grievance Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
