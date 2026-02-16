"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { Controller } from "react-hook-form";

export default function CreateBidModal({
  show,
  onClose,
  createForm,
  onSubmit,
  createBidState,
  BID_PLATFORM_OPTIONS,
  currencyOptions,
}) {
  return (
    <Modal show={show} onClose={onClose} title="Log bid" size="xl">
      <form
        onSubmit={createForm.handleSubmit(onSubmit)}
        className="max-h-[70vh] overflow-y-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Platform */}
          <Controller
            name="Platform"
            control={createForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Platform"
                options={BID_PLATFORM_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select platform…"
                errors={createForm.formState.errors}
              />
            )}
          />

          {/* Job URL */}
          <CustomInput
            label="Job URL / Reference"
            name="JobUrlOrReference"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

          {/* Client Name */}
          <CustomInput
            label="Client name"
            name="ClientDisplayName"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

          {/* Bid Title */}
          <CustomInput
            label="Bid title"
            name="BidTitle"
            placeholder="Short summary"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

          {/* Client budget */}
          <CustomInput
            label="Client budget (optional)"
            name="ClientBudget"
            placeholder="e.g. $500–1K"
            register={createForm.register}
            errors={createForm.formState.errors}
          />

          {/* Proposed price */}
          <CustomInput
            label="Proposed price"
            name="ProposedPrice"
            type="number"
            placeholder="1500"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

          {/* Currency */}
          <Controller
            name="Currency"
            control={createForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Currency"
                options={currencyOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Currency"
              />
            )}
          />

          {/* Estimated effort */}
          <CustomInput
            label="Estimated effort (hours)"
            name="EstimatedEffort"
            type="number"
            placeholder="40"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

          {/* Submission date */}
          <CustomInput
            label="Submission date"
            name="SubmissionDate"
            type="date"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />
        </div>

        <div className="pt-4">
          {/* Skills */}
          <CustomInput
            label="Skills / Tags (comma-separated)"
            name="SkillsTags"
            placeholder="React, Node.js"
            register={createForm.register}
            errors={createForm.formState.errors}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <CustomInput
            label="Win probability (0-1)"
            name="Probability"
            type="number"
            step="0.01"
            placeholder="0.7"
            register={createForm.register}
            errors={createForm.formState.errors}
          />
          <CustomInput
            label="Risk flags"
            name="RiskFlags"
            placeholder="e.g. timeline risk"
            register={createForm.register}
            errors={createForm.formState.errors}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <TextArea
            label="Competitor notes (optional)"
            name="CompetitorNotes"
            placeholder="Notes about competitors"
            register={createForm.register}
            errors={createForm.formState.errors}
          />
          <TextArea
            label="Interview outcome (optional)"
            name="InterviewOutcome"
            placeholder="Outcome notes"
            register={createForm.register}
            errors={createForm.formState.errors}
          />
        </div>
        <div className="pt-4">
          <CustomInput
            label="Interview date (optional)"
            name="InterviewDate"
            type="date"
            register={createForm.register}
            errors={createForm.formState.errors}
          />
        </div>
        {/* Internal notes → single column */}
        <div className="lg:col-span-1 py-4">
          <TextArea
            label="Internal notes (optional)"
            name="InternalComments"
            placeholder="Notes"
            register={createForm.register}
            errors={createForm.formState.errors}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5">
          <CustomButton
            type="button"
            text="Cancel"
            variant="cancel"
            onClick={onClose}
          />
          <CustomButton
            type="submit"
            text="Create"
            variant="primary"
            loading={createBidState?.isLoading}
          />
        </div>
      </form>
    </Modal>
  );
}
