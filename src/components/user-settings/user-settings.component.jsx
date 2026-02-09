"use client";

import { Lock, Mail, User } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import useUserSettings from "./use-user-settings.hook";

export default function UserSettings() {
  const {
    loading,
    displayUser,
    profileForm,
    passwordForm,
    profileError,
    passwordError,
    profileSaving,
    passwordSaving,
    onProfileSubmit,
    onPasswordSubmit,
  } = useUserSettings();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader loading />
      </div>
    );
  }

  const SEPARATOR_COLORS = [
    "from-indigo-500 to-indigo-700",
    "from-emerald-500 to-emerald-700",
    "from-amber-500 to-amber-700",
    "from-rose-500 to-rose-700",
    "from-sky-500 to-sky-700",
    "from-violet-500 to-violet-700",
  ];

  return (
    <div className="min-h-full p-4 sm:p-5">
      <div className="page-header-bar">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">
            Account
          </h1>
          <p className="truncate typography-caption font-medium text-neutral-700">
            Profile, password, and personal preferences
          </p>
        </div>
      </div>
      <div className="page-separator" aria-hidden>
        <span className="page-separator-line" />
        <span className="flex gap-1">
          {SEPARATOR_COLORS.map((color, i) => (
            <span key={i} className={`page-separator-dot bg-gradient-to-br ${color}`} />
          ))}
        </span>
        <span className="page-separator-line" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900">
          <User className="h-5 w-5 text-neutral-600" />
          Profile
        </h2>
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

      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900">
          <Lock className="h-5 w-5 text-neutral-600" />
          Change password
        </h2>
        <form onSubmit={onPasswordSubmit} className="space-y-4">
          <CustomInput
            name="CurrentPassword"
            type="password"
            label="Current password"
            placeholder="Enter current password"
            register={passwordForm.register}
            errors={passwordForm.formState.errors}
            isRequired
            startIcon={<Lock className="h-4 w-4 text-neutral-500" />}
          />
          <CustomInput
            name="NewPassword"
            type="password"
            label="New password"
            placeholder="Enter new password (min 6 characters)"
            register={passwordForm.register}
            errors={passwordForm.formState.errors}
            isRequired
            startIcon={<Lock className="h-4 w-4 text-neutral-500" />}
          />
          <CustomInput
            name="ConfirmPassword"
            type="password"
            label="Confirm new password"
            placeholder="Confirm new password"
            register={passwordForm.register}
            errors={passwordForm.formState.errors}
            isRequired
            startIcon={<Lock className="h-4 w-4 text-neutral-500" />}
          />
          {passwordError && (
            <p className="typography-caption text-red-600">{passwordError}</p>
          )}
          <CustomButton
            type="submit"
            text="Change password"
            variant="primary"
            loading={passwordSaving}
          />
        </form>
      </div>
      </div>
    </div>
  );
}
