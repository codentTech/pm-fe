"use client";

import { Mail, User } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import PageHeader from "@/common/components/page-header/page-header.component";
import useUserSettings from "./use-user-settings.hook";

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
      <PageHeader
        title="Profile"
        subtitle="Update your name and personal information"
        actions={
          <CustomButton
            text="Save changes"
            variant="primary"
            loading={profileSaving}
          />
        }
      />
      <div className="max-w-xl px-4 sm:px-5 space-y-4 pb-10">
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
              <CustomInput
                name="Email"
                label="Email"
                placeholder="Your email"
                value={displayUser?.Email || displayUser?.email || "—"}
                startIcon={<Mail className="h-4 w-4 text-neutral-500" />}
                readOnly
                helperText="Email cannot be changed"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
