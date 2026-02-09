"use client";

import { Mail, User } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import useUserSettings from "./use-user-settings.hook";

const SEPARATOR_COLORS = [
  "from-indigo-500 to-indigo-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-sky-500 to-sky-700",
  "from-violet-500 to-violet-700",
];

export default function ProfileSettings() {
  const {
    loading,
    displayUser,
    profileForm,
    profileError,
    profileSaving,
    onProfileSubmit,
  } = useUserSettings();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader loading />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="page-header-bar mt-4">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Profile</h1>
          <p className="truncate typography-caption font-medium text-neutral-700">
            Update your name and personal information
          </p>
        </div>
      </div>
      <div className="page-separator" aria-hidden>
        <span className="page-separator-line" />
        <span className="flex gap-1">
          {SEPARATOR_COLORS.map((color, i) => (
            <span
              key={i}
              className={`page-separator-dot bg-gradient-to-br ${color}`}
            />
          ))}
        </span>
        <span className="page-separator-line" />
      </div>
      <div className="max-w-xl px-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <form onSubmit={onProfileSubmit} className="space-y-4">
            <CustomInput
              name="FullName"
              label="Full name"
              placeholder="Your name"
              control={profileForm.control}
              register={profileForm.register}
              errors={profileForm.formState.errors}
              startIcon={<User className="h-4 w-4 text-neutral-500" />}
            />
            <div>
              <label className="mb-1.5 block typography-caption font-medium text-neutral-700">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
                <Mail className="h-4 w-4 shrink-0 text-neutral-500" />
                <span className="typography-body text-neutral-600">
                  {displayUser?.Email || displayUser?.email || "—"}
                </span>
              </div>
              <p className="mt-1 typography-caption text-neutral-500">
                Email cannot be changed
              </p>
            </div>
            {profileError && (
              <p className="typography-caption text-red-600">{profileError}</p>
            )}
            <CustomButton
              type="submit"
              text="Save changes"
              variant="primary"
              loading={profileSaving}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
