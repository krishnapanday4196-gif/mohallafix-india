"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, Shield, User, ExternalLink, LogOut, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { UserRole } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

interface PortalHeaderProps {
  title: string;
  description?: string;
  role: UserRole;
  userName?: string;
}

export function PortalHeader({
  title,
  description,
  role,
  userName = "Citizen User",
}: PortalHeaderProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(userName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserEmail(user.email || null);
          const metaName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            (user.email ? user.email.split("@")[0] : null);

          if (metaName) {
            setDisplayName(metaName);
          }

          if (user.user_metadata?.avatar_url) {
            setAvatarUrl(user.user_metadata.avatar_url);
          }

          // Try checking profiles table
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("user_id", user.id)
            .maybeSingle();

          if (profile?.full_name) {
            setDisplayName(profile.full_name);
          }
          if (profile?.avatar_url) {
            setAvatarUrl(profile.avatar_url);
          }
        }
      } catch (err) {
        console.warn("Could not load user in PortalHeader", err);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      router.push("/login");
    }
  };

  const roleBadgeMap: Record<UserRole, { label: string; variant: "success" | "warning" | "info" | "default" }> = {
    citizen: { label: "Citizen", variant: "default" },
    officer: { label: "Civic Officer", variant: "info" },
    admin: { label: "Administrator", variant: "warning" },
    super_admin: { label: "Super Admin", variant: "success" },
  };

  const badgeInfo = roleBadgeMap[role] || { label: role, variant: "default" };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 relative z-30">
      <div>
        <h1 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-xs text-slate-500 hidden sm:block">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Role badge */}
        <Badge variant={badgeInfo.variant} className="capitalize">
          {badgeInfo.label}
        </Badge>

        {/* Notifications Icon link */}
        <Link
          href="/citizen/notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </Link>

        {/* User initials / avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 focus:outline-none cursor-pointer"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col text-left hidden md:block">
              <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate block leading-tight">
                {displayName}
              </span>
              {userEmail && (
                <span className="text-[10px] text-slate-400 max-w-[120px] truncate block">
                  {userEmail}
                </span>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900 truncate">{displayName}</p>
                {userEmail && <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>}
              </div>

              <Link
                href="/citizen/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>My Profile</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
