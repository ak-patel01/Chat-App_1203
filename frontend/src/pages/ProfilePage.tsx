import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState, useEffect } from "react";

import {
  EditIcon,
  CheckIcon,
  XIcon,
  ShieldIcon,
  CalendarIcon,
  HashIcon,
  LockCircleIcon,
} from "@/components/icons";

// ── Skeleton ───────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="h-4 w-64 bg-muted rounded" />
      </div>
      <div className="flex items-center gap-5 p-6 rounded-xl border bg-card">
        <div className="h-20 w-20 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-muted rounded" />
          <div className="h-4 w-56 bg-muted rounded" />
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="h-5 w-44 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
      </div>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative group">
      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-transform duration-300 group-hover:scale-105">
        {initials}
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-emerald-500 border-2 border-card" />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────

export default function ProfilePage() {
  const { profile, loading, error, updating, updateSuccess, updateProfile } =
    useProfile();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhoneNumber(profile.phoneNumber);
    }
  }, [profile]);

  const handleSave = async () => {
    const success = await updateProfile({ name, phoneNumber });
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.name);
      setPhoneNumber(profile.phoneNumber);
    }
    setIsEditing(false);
  };

  if (loading) return <ProfileSkeleton />;

  if (error && !profile) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <XIcon className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="space-y-1">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          My Profile
        </h2>
        <p className="text-muted-foreground text-base">
          View and manage your account details
        </p>
      </div>

      {/* ── Feedback Messages ───────────────────────────────────── */}
      {updateSuccess && (
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm animate-in slide-in-from-top-2 duration-300">
          <CheckIcon className="h-5 w-5 shrink-0" />
          Profile updated successfully!
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          <XIcon className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Profile Banner Card ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-6">
        {/* Background gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar name={profile?.name || "U"} />

          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-bold text-foreground">
              {profile?.name}
            </h3>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            <div className="flex items-center gap-2 pt-1">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  profile?.userType === "SuperAdmin"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                }`}
              >
                <ShieldIcon />
                {profile?.userType}
              </span>
            </div>
          </div>

          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="shrink-0"
            >
              <EditIcon />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* ── Account Information Card ────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your personal details below"
              : "Your personal details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            {isEditing ? (
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="max-w-md"
              />
            ) : (
              <p className="text-sm text-foreground bg-muted/50 px-3.5 py-2.5 rounded-lg border max-w-md">
                {profile?.name}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <p className="text-sm text-foreground bg-muted/50 px-3.5 py-2.5 rounded-lg border max-w-md">
              {profile?.email}
            </p>
            {isEditing && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <LockCircleIcon className="h-3 w-3" />
                Email address cannot be changed
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="max-w-md"
              />
            ) : (
              <p className="text-sm text-foreground bg-muted/50 px-3.5 py-2.5 rounded-lg border max-w-md">
                {profile?.phoneNumber || "—"}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-3 border-t">
              <Button onClick={handleSave} disabled={updating} size="sm">
                <CheckIcon />
                {updating ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updating}
                size="sm"
              >
                <XIcon />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Account Details Card ────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Details</CardTitle>
          <CardDescription>
            System information about your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0 divide-y">
            {/* Role */}
            <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <ShieldIcon />
                <span>Role</span>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  profile?.userType === "SuperAdmin"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                }`}
              >
                {profile?.userType}
              </span>
            </div>

            {/* User ID */}
            <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <HashIcon />
                <span>User ID</span>
              </div>
              <span className="text-sm text-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">
                {profile?.id.substring(0, 8)}...
              </span>
            </div>

            {/* Member Since */}
            <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <CalendarIcon />
                <span>Member Since</span>
              </div>
              <span className="text-sm text-foreground">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
