// src/pages/account.tsx
import React from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  getCurrentUser,
  updateCurrentUser,
  changePassword,
  logoutUser,
  isAuthed,
} from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const AccountPage: React.FC = () => {
  const navigate = useNavigate();

  // profile state
  const [name, setName] = React.useState("");

  const [location, setLocation] = React.useState("");
  const [email, setEmail] = React.useState("");

  // password state
  const [oldPw, setOldPw] = React.useState("");
  const [newPw, setNewPw] = React.useState("");
  const [confirmPw, setConfirmPw] = React.useState("");
  const [pwError, setPwError] = React.useState<string | null>(null);
  const oldPwRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!isAuthed()) {
      navigate("/login");
      return;
    }
    const cu = getCurrentUser();
    if (cu) {
      setName(cu.name || "");
      setLocation(cu.location || "");
      setEmail(cu.email);
    }
  }, [navigate]);

  /* ---------------- Profile ---------------- */
  const saveProfile = () => {
    updateCurrentUser({ name, location });
    toast.success("Profile updated", { description: "Your changes have been saved." });
  };

  /* --------------- Password ---------------- */
  const resetPwErrors = () => setPwError(null);

  const updatePw = () => {
    // Clear previous inline error
    resetPwErrors();

    // Client-side checks
    if (!oldPw) {
      setPwError("Please enter your current password.");
      oldPwRef.current?.focus();
      return;
    }
    if (newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPw === oldPw) {
      setPwError("New password must be different from current password.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }

    // "Backend" check (localStorage demo)
    const res = changePassword(oldPw, newPw);
    if (!res.ok) {
      setPwError(res.error || "Could not update password.");
      oldPwRef.current?.focus();
      toast.error("Could not update password", { description: res.error });
      return;
    }

    setOldPw("");
    setNewPw("");
    setConfirmPw("");
    setPwError(null);
    toast.success("Password updated");
  };

  const canSubmitPw =
    oldPw.length > 0 &&
    newPw.length >= 6 &&
    confirmPw.length >= 6 &&
    newPw === confirmPw &&
    newPw !== oldPw;

  /* ---------------- Logout ----------------- */
  const logout = () => {
    logoutUser();
    toast.message("Signed out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showActions />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-emerald-900">Your Profile</h1>
        <Separator className="my-4" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Full Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label className="text-sm">Email</Label>
                  <Input value={email} disabled className="bg-muted/50" />
                  <p className="mt-1 text-xs text-gray-500">
                    Email can’t be changed in this demo.
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm">Location</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="bg-emerald-700 hover:bg-emerald-800"
                  onClick={saveProfile}
                >
                  Save changes
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm">Current Password</Label>
                <Input
                  ref={oldPwRef}
                  type="password"
                  value={oldPw}
                  onChange={(e) => {
                    setOldPw(e.target.value);
                    if (pwError) resetPwErrors();
                  }}
                  aria-invalid={!!pwError}
                  className={pwError ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {pwError && (
                  <p className="mt-1 text-xs text-red-600">{pwError}</p>
                )}
              </div>

              <div>
                <Label className="text-sm">New Password</Label>
                <Input
                  type="password"
                  value={newPw}
                  onChange={(e) => {
                    setNewPw(e.target.value);
                    if (pwError) resetPwErrors();
                  }}
                />
              </div>

              <div>
                <Label className="text-sm">Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => {
                    setConfirmPw(e.target.value);
                    if (pwError) resetPwErrors();
                  }}
                />
              </div>

              <Button
                variant="outline"
                onClick={updatePw}
                disabled={!canSubmitPw}
                className="disabled:cursor-not-allowed disabled:opacity-60"
              >
                Update Password
              </Button>

              <Separator className="my-2" />
              <Button variant="destructive" onClick={logout}>
                Log out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
