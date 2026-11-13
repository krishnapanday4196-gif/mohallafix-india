"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  User,
  MessageSquare,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertTriangle,
  Users,
  Building2,
  Tag,
  BarChart3,
  ScrollText,
  Settings,
  Sparkles,
  Layers,
  Search,
  Cpu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FolderSync,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  portalType: "citizen" | "officer" | "admin" | "ai";
}

export function Sidebar({ portalType }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const citizenNav = [
    { href: "/citizen", label: "Dashboard", icon: LayoutDashboard },
    { href: "/citizen/submit", label: "Submit Complaint", icon: PlusCircle },
    { href: "/citizen/complaints", label: "My Complaints", icon: FileText },
    { href: "/citizen/notifications", label: "Notifications", icon: Bell },
    { href: "/citizen/profile", label: "Profile", icon: User },
    { href: "/citizen/feedback", label: "Feedback", icon: MessageSquare },
  ];

  const officerNav = [
    { href: "/officer", label: "Overview", icon: LayoutDashboard },
    { href: "/officer/assigned", label: "Assigned Complaints", icon: Briefcase },
    { href: "/officer/reports", label: "Performance Reports", icon: BarChart3 },
  ];

  const adminNav = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/complaints", label: "All Complaints", icon: FileText },
    { href: "/admin/assignments", label: "Assignment Redressal", icon: Briefcase },
    { href: "/admin/escalations", label: "Escalations", icon: AlertTriangle },
    { href: "/admin/officers", label: "Officer Verification", icon: CheckCircle2 },
    { href: "/admin/departments", label: "Departments", icon: Building2 },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/analytics", label: "Civic Analytics", icon: BarChart3 },
    { href: "/admin/reports", label: "Reports & Export", icon: FolderSync },
    { href: "/admin/logs", label: "Security & Audit Logs", icon: ScrollText },
    { href: "/admin/settings", label: "System Configuration", icon: Settings },
  ];

  const aiNav = [
    { href: "/ai", label: "AI Dashboard", icon: Cpu },
    { href: "/ai/image-analysis", label: "Image Classification", icon: Sparkles },
    { href: "/ai/duplicate-detection", label: "Duplicate Detection", icon: Layers },
    { href: "/ai/priority-analysis", label: "Priority Scoring", icon: AlertTriangle },
    { href: "/ai/history", label: "Processing History", icon: ScrollText },
  ];

  const currentNav =
    portalType === "citizen"
      ? citizenNav
      : portalType === "officer"
      ? officerNav
      : portalType === "admin"
      ? adminNav
      : aiNav;

  const portalTitle =
    portalType === "citizen"
      ? "Citizen Portal"
      : portalType === "officer"
      ? "Officer Portal"
      : portalType === "admin"
      ? "Admin Panel"
      : "AI Intelligence Hub";

  return (
    <aside
      className={cn(
        "relative bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 z-30 shrink-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100 justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900 leading-tight">
                MohallaFix
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                {portalTitle}
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-emerald-50 text-emerald-800 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Portal Switcher Footer */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          {!collapsed && <span>Exit to Public Site</span>}
        </Link>
      </div>
    </aside>
  );
}

