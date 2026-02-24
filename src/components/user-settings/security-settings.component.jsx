"use client";

import { Lock } from "lucide-react";
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

export default function SecuritySettings() {
  const {
    loading,
    passwordForm,
    passwordError,
    passwordSaving,
    onPasswordSubmit,
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
      <div className="page-header-bar">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Security</h1>
          <p className="truncate typography-caption font-medium text-neutral-700">
            Change your password and security preferences
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
      <div className="max-w-xl px-4 sm:px-5">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-indigo-600">
            <Lock className="h-5 w-5" />
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
