"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { Controller } from "react-hook-form";

export default function EditBidModal({
  show,
  onClose,
  editForm,
  onSubmit,
  updateBidState,
  BID_PLATFORM_OPTIONS,
  currencyOptions,
}) {
  return (
    <Modal show={show} onClose={onClose} title="Edit bid" size="xl">
      <form
        onSubmit={editForm.handleSubmit(onSubmit)}
        className="max-h-[70vh] overflow-y-auto p-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Platform */}
          <Controller
            name="Platform"
            control={editForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Platform"
                options={BID_PLATFORM_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select platform…"
                errors={editForm.formState.errors}
              />
            )}
          />

          {/* Job URL */}
          <CustomInput
            label="Job URL / Reference"
            name="JobUrlOrReference"
            register={editForm.register}
            errors={editForm.formState.errors}
            isRequired
          />

          {/* Client Name */}
          <CustomInput
            label="Client name"
            name="ClientDisplayName"
            register={editForm.register}
            errors={editForm.formState.errors}
            isRequired
          />

          {/* Bid Title */}
          <CustomInput
            label="Bid title"
            name="BidTitle"
            register={editForm.register}
            errors={editForm.formState.errors}
            isRequired
          />

          {/* Client Budget */}
          <CustomInput
            label="Client budget"
            name="ClientBudget"
            register={editForm.register}
            errors={editForm.formState.errors}
          />

          {/* Proposed Price */}
          <CustomInput
            label="Proposed price"
            name="ProposedPrice"
            type="number"
            register={editForm.register}
            errors={editForm.formState.errors}
            isRequired
          />

          {/* Currency */}
          <Controller
            name="Currency"
            control={editForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Currency"
                options={currencyOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {/* Estimated Effort */}
          <CustomInput
            label="Estimated effort (hours)"
            name="EstimatedEffort"
            type="number"
            register={editForm.register}
            errors={editForm.formState.errors}
            isRequired
          />

          {/* Submission Date */}
          <CustomInput
            label="Submission date"
            name="SubmissionDate"
            type="date"
            register={editForm.register}
            errors={editForm.formState.errors}
            isRequired
          />
        </div>

        <div className="pt-4">
          {/* Skills */}
          <CustomInput
            label="Skills / Tags"
            name="SkillsTags"
            register={editForm.register}
            errors={editForm.formState.errors}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <CustomInput
            label="Win probability (0-1)"
            name="Probability"
            type="number"
            step="0.01"
            register={editForm.register}
            errors={editForm.formState.errors}
          />
          <CustomInput
            label="Risk flags"
            name="RiskFlags"
            register={editForm.register}
            errors={editForm.formState.errors}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <TextArea
            label="Competitor notes"
            name="CompetitorNotes"
            register={editForm.register}
            errors={editForm.formState.errors}
          />
          <TextArea
            label="Interview outcome"
            name="InterviewOutcome"
            register={editForm.register}
            errors={editForm.formState.errors}
          />
        </div>
        <div className="pt-4">
          <CustomInput
            label="Interview date"
            name="InterviewDate"
            type="date"
            register={editForm.register}
            errors={editForm.formState.errors}
          />
        </div>

        {/* Internal Notes → single column */}
        <div className="lg:col-span-1 py-4">
          <TextArea
            label="Internal notes"
            name="InternalComments"
            register={editForm.register}
            errors={editForm.formState.errors}
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
            text="Save"
            variant="primary"
            loading={updateBidState?.isLoading}
          />
        </div>
      </form>
    </Modal>
  );
}
