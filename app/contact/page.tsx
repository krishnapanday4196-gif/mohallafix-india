import React from "react";
import { Mail, Phone, MapPin, ShieldCheck, Clock, Send } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Citizen Grievance Support
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact MohallaFix Redressal Cell
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Need assistance with an escalated complaint or administrative inquiry? Get in touch with our platform coordination team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
            <Mail className="w-6 h-6 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-slate-900">Email Redressal</h3>
            <p className="text-xs text-slate-500">Official inquiries & escalations</p>
            <p className="text-xs font-semibold text-emerald-700">support@mohallafix.in</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
            <Phone className="w-6 h-6 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-slate-900">Helpline Hours</h3>
            <p className="text-xs text-slate-500">Mon - Sat (9:00 AM - 6:00 PM IST)</p>
            <p className="text-xs font-semibold text-emerald-700">1800-XXX-MFIX (Toll Free)</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
            <MapPin className="w-6 h-6 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-slate-900">Headquarters</h3>
            <p className="text-xs text-slate-500">Civic Tech Center, New Delhi</p>
            <p className="text-xs font-semibold text-emerald-700">New Delhi - 110001, India</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-2xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-slate-900">Send an Administrative Message</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rajesh@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tracking ID (if applicable)</label>
              <input
                type="text"
                placeholder="MHF-YYYYMMDD-XXXX"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Message / Grievance Clarification</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your query or feedback in detail..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <Button type="button" variant="primary" size="md" className="w-full gap-2">
              <Send className="w-4 h-4" />
              Submit Inactive Contact Request
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

