"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Plus, Search, User, ShieldCheck } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  // Don't show inside admin or officer portals if needed, or show everywhere for citizen convenience
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Map",
      href: "/map",
      icon: Map,
      isActive: pathname.startsWith("/map"),
    },
    {
      label: "Report",
      href: "/citizen/submit",
      icon: Plus,
      isSpecial: true,
      isActive: pathname === "/citizen/submit",
    },
    {
      label: "Track",
      href: "/track",
      icon: Search,
      isActive: pathname.startsWith("/track"),
    },
    {
      label: "Profile",
      href: "/citizen",
      icon: User,
      isActive: pathname.startsWith("/citizen") && pathname !== "/citizen/submit",
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-2 pt-1.5 pb-2"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center -mt-6 group focus:outline-none"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 active:scale-95 ${
                    item.isActive
                      ? "bg-emerald-700 shadow-emerald-700/40 ring-4 ring-emerald-100"
                      : "bg-emerald-600 shadow-emerald-600/30"
                  }`}
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 mt-1 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                item.isActive
                  ? "text-emerald-700 font-bold"
                  : "text-slate-500 hover:text-slate-900 active:bg-slate-100"
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? "stroke-[2.2]" : "stroke-[1.8]"}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
