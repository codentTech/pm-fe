"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import useCreateWorkspace from "./use-create-workspace.hook";

export default function SuperAdminCreateWorkspace() {
  const { form, onSubmit, createState } = useCreateWorkspace();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-xl rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="typography-h4 mb-4 text-neutral-900">
          Create workspace with org admin
        </h2>
        <p className="typography-body-small mb-6 text-neutral-600">
          Create a new workspace and assign an existing user (by email) as org
          admin. The org admin will manage the organization and members.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <CustomInput
            label="Workspace name"
            name="Name"
            placeholder="Acme Inc"
            register={register}
            errors={errors}
            isRequired
          />
          <CustomInput
            label="Org admin email"
            name="OwnerEmail"
            type="email"
            placeholder="orgadmin@example.com"
            register={register}
            errors={errors}
            isRequired
          />
          <CustomInput
            label="Slug (optional)"
            name="Slug"
            placeholder="acme-inc"
            register={register}
            errors={errors}
            helperText="Lowercase, numbers and hyphens only. Auto-generated if empty."
          />
          <div className="mt-2">
            <CustomButton
              type="submit"
              text="Create workspace"
              variant="primary"
              loading={createState?.isLoading ?? isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
