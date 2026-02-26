"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import TextArea from "@/common/components/text-area/text-area.component";
import { currencyOptions } from "@/common/constants/options.constant";
import PageHeader from "@/common/components/page-header/page-header.component";
import useBidTracker from "../bid-tracker/use-bid-tracker.hook";

export default function BidForm() {
  const router = useRouter();
  const { createForm, handleCreate, createBidState, BID_PLATFORM_OPTIONS } =
    useBidTracker();

  const handleSubmit = useCallback(
    (values) =>
      handleCreate(values, {
        onSuccess: () => router.push("/bids/all"),
      }),
    [handleCreate, router],
  );

  return (
    <div className="min-h-full">
      <PageHeader
        backLink={{ href: "/bids/all", label: "Back to bids" }}
        title="Log bid"
        subtitle="Capture a new opportunity with key details."
        className="px-4 sm:px-5"
      />
      <form
        onSubmit={createForm.handleSubmit(handleSubmit)}
        className="p-4 sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

          <CustomInput
            label="Job URL / Reference"
            name="JobUrlOrReference"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

          <CustomInput
            label="Client name"
            name="ClientDisplayName"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

          <CustomInput
            label="Bid title"
            name="BidTitle"
            placeholder="Short summary"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

          <CustomInput
            label="Client budget (optional)"
            name="ClientBudget"
            placeholder="e.g. $500–1K"
            register={createForm.register}
            errors={createForm.formState.errors}
          />

          <CustomInput
            label="Proposed price"
            name="ProposedPrice"
            type="number"
            placeholder="1500"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

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

          <CustomInput
            label="Estimated effort (hours)"
            name="EstimatedEffort"
            type="number"
            placeholder="40"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

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
          <CustomInput
            label="Skills / Tags (comma-separated)"
            name="SkillsTags"
            placeholder="React, Node.js"
            register={createForm.register}
            errors={createForm.formState.errors}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
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

        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
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

        <div className="py-4">
          <TextArea
            label="Internal notes (optional)"
            name="InternalComments"
            placeholder="Notes"
            register={createForm.register}
            errors={createForm.formState.errors}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5">
          <CustomButton
            type="button"
            text="Cancel"
            variant="cancel"
            onClick={() => router.push("/bids/all")}
          />
          <CustomButton
            type="submit"
            text="Create"
            variant="primary"
            loading={createBidState?.isLoading}
          />
        </div>
      </form>
    </div>
  );
}
