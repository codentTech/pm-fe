"use client";

import { ChevronDown, Building2, Plus } from "lucide-react";
import Modal from "@/common/components/modal/modal.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useOrganizationSwitcher from "./use-organization-switcher.hook";

export default function OrganizationSwitcher() {
  const {
    open,
    organizations,
    currentOrg,
    dropdownRef,
    showCreateModal,
    showInviteModal,
    createState,
    createForm,
    inviteForm,
    toggleOpen,
    handleSwitch,
    openCreateModal,
    openInviteModal,
    setShowCreateModal,
    setShowInviteModal,
    onSubmitCreate,
    onSubmitInvite,
  } = useOrganizationSwitcher();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className="flex w-full items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left typography-body hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <Building2 className="h-4 w-4 shrink-0 text-neutral-500" />
        <span className="min-w-0 flex-1 truncate font-medium text-neutral-800">
          {currentOrg?.Name || "Select workspace"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
          {organizations?.map((org) => (
            <button
              key={org.Id}
              type="button"
              onClick={() => handleSwitch(org.Id)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left typography-body hover:bg-neutral-100 ${
                org.Id === currentOrg?.Id
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700"
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{org.Name}</span>
            </button>
          ))}
          <div className="border-t border-neutral-200 pt-1">
            <button
              type="button"
              onClick={openCreateModal}
              className="flex w-full items-center gap-2 px-3 py-2 typography-body text-neutral-600 hover:bg-neutral-100"
            >
              <Plus className="h-4 w-4" />
              Create workspace
            </button>
            {currentOrg?.Id && (
              <button
                type="button"
                onClick={openInviteModal}
                className="flex w-full items-center gap-2 px-3 py-2 typography-body text-neutral-600 hover:bg-neutral-100"
              >
                <Plus className="h-4 w-4" />
                Invite members
              </button>
            )}
          </div>
        </div>
      )}

      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create workspace"
        size="md"
      >
        <form
          onSubmit={createForm.handleSubmit(onSubmitCreate)}
          className="space-y-5"
        >
          <CustomInput
            label="Workspace name"
            name="Name"
            placeholder="e.g. Acme Inc"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />
          <div className="flex justify-end gap-3 pt-1 border-t border-neutral-200">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setShowCreateModal(false)}
            />
            <CustomButton
              type="submit"
              text="Create"
              variant="primary"
              loading={createState?.isLoading}
            />
          </div>
        </form>
      </Modal>

      <Modal
        show={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite member"
        size="md"
        variant="neutral"
      >
        <form
          onSubmit={inviteForm.handleSubmit(onSubmitInvite)}
          className="space-y-5"
        >
          <CustomInput
            label="Email address"
            name="Email"
            type="email"
            placeholder="colleague@example.com"
            register={inviteForm.register}
            errors={inviteForm.formState.errors}
            isRequired
          />
          <div>
            <label className="mb-1.5 block typography-label text-neutral-700">
              Role
            </label>
            <select
              {...inviteForm.register("Role")}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 typography-body text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="developer">Developer</option>
              <option value="project_manager">Project Manager</option>
              <option value="quality_assurance_engineer">QA Engineer</option>
              <option value="seo_specialist">SEO Specialist</option>
              <option value="business_developer">Business Developer</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setShowInviteModal(false)}
            />
            <CustomButton type="submit" text="Send invite" variant="primary" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
