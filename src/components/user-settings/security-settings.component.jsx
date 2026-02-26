"use client";

import { Lock } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import PageHeader from "@/common/components/page-header/page-header.component";
import useUserSettings from "./use-user-settings.hook";

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
      <PageHeader
        title="Security"
        subtitle="Change your password and security preferences"
        actions={
          <CustomButton
            text="Change password"
            variant="primary"
            loading={passwordSaving}
          />
        }
      />
      <div className="max-w-xl px-4 sm:px-5 space-y-4 pb-10">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
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
          </form>
        </div>
      </div>
    </div>
  );
}
