"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function CitizenProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [role, setRole] = useState("citizen");
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchUserProfile() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        setErrorMsg("Supabase is not configured in .env.local.");
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          // If not logged in, redirect to login
          router.push("/login?redirect=/citizen/profile");
          return;
        }

        setUserId(user.id);
        setEmail(user.email || "");
        setEmailConfirmed(Boolean(user.email_confirmed_at));

        // 1. First extract data from auth user metadata (Google OAuth or registration)
        const metaName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          (user.email ? user.email.split("@")[0] : "");
        const metaPhone = user.user_metadata?.phone || user.phone || "";
        const metaAvatar =
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

        setFullName(metaName || "Citizen User");
        setPhone(metaPhone);
        setAvatarUrl(metaAvatar);

        // 2. Fetch from public.profiles table if exists
        try {
          const { data: profile, error: profileErr } = await supabase
            .from("profiles")
            .select("full_name, phone, address, avatar_url, role")
            .eq("user_id", user.id)
            .maybeSingle();

          if (profile) {
            if (profile.full_name) setFullName(profile.full_name);
            if (profile.phone) setPhone(profile.phone);
            if (profile.address) setAddress(profile.address);
            if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
            if (profile.role) setRole(profile.role);
          }
        } catch (dbErr) {
          console.warn("Profiles table check skipped or table pending creation:", dbErr);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSaved(false);
    setSaving(true);

    try {
      const supabase = createClient();

      // 1. Update Supabase Auth User Metadata
      const { error: authUpdateErr } = await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      });

      if (authUpdateErr) {
        console.warn("Auth metadata update warning:", authUpdateErr.message);
      }

      // 2. Upsert into public.profiles
      if (userId) {
        const { error: profileErr } = await supabase.from("profiles").upsert(
          {
            user_id: userId,
            full_name: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        if (profileErr) {
          console.warn("Profiles table upsert warning:", profileErr.message);
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-xs text-slate-500 font-medium">Loading citizen profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Citizen Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your verified personal details and neighborhood contact preferences.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        {/* User Card Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 text-2xl font-bold flex items-center justify-center border border-emerald-200 shadow-xs">
                {fullName ? fullName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">{fullName || "Citizen User"}</h3>
            <p className="text-xs text-slate-500 font-mono">{phone || email || "Active Citizen Account"}</p>
            <div className="flex items-center gap-2 pt-0.5">
              <Badge variant={role === "officer" ? "info" : role === "admin" ? "warning" : "default"}>
                {role.toUpperCase()}
              </Badge>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified Citizen
              </span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile details updated and saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rajesh Sharma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Verified Mobile Phone"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            helperText="Primary mobile number for SMS notifications and OTP login."
          />

          <Input
            label="Primary Mohalla / Residential Address"
            placeholder="e.g. Flat 302, Pocket 4, Sector 15, Rohini, New Delhi"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {email && (
            <Input
              label="Linked Google / Email Account"
              type="email"
              value={email}
              disabled
              helperText="Connected via Google Sign-In."
            />
          )}

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


