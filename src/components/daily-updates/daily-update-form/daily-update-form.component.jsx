"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Loader from "@/common/components/loader/loader.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import TextArea from "@/common/components/text-area/text-area.component";
import { ArrowLeft, ClipboardCheck, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Controller } from "react-hook-form";
import WorkItemReferenceSelect from "./components/work-item-reference-select/work-item-reference-select.component";
import useDailyUpdateForm from "./use-daily-update-form.hook";

export default function DailyUpdateForm({ updateId }) {
  const {
    form,
    workItems,
    isEditMode,
    canEdit,
    fetchState,
    createState,
    updateState,
    workItemTypeOptions,
    dailyUpdateStatusOptions,
    workItemStatusOptions,
    blockerTypeOptions,
    handleAddWorkItem,
    handleRemoveWorkItem,
    handleSubmit,
    roleLabel,
  } = useDailyUpdateForm(updateId);

  if (fetchState?.isLoading && isEditMode) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <Loader loading />
      </div>
    );
  }

  if (isEditMode && !canEdit) {
    return (
      <div className="p-4 sm:p-5">
        <NoResultFound
          icon={ClipboardCheck}
          title="Update is locked"
          description="This daily update can no longer be edited."
          variant="compact"
        />
        <Link
          href="/daily-updates/updates"
          className="mt-4 inline-flex items-center gap-2 typography-body font-medium text-primary-600 hover:text-primary-700"
        >
          Back to daily updates
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="page-header-bar flex items-center justify-between px-4 sm:px-5">
        <div className="flex items-center justify-between">
          <Link
            href="/daily-updates/updates"
            className="group flex h-7 w-7 items-center justify-center rounded-full 
             bg-black shadow-md transition-all duration-200 ease-in-out
             hover:scale-105 hover:bg-neutral-900 active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft
              className="h-4 w-4 text-white transition-transform duration-200 
               group-hover:-translate-x-0.5"
            />
          </Link>
          <div className="page-header-divider mx-2" />
          <div className="min-w-0 flex-1">
            <h1 className="page-header-title">
              {isEditMode ? "Edit daily update" : "Submit daily update"}
            </h1>
            <p className="page-header-subtitle">
              Log your work items, blockers, and next day plan.
            </p>
          </div>
        </div>
        <CustomButton
          type="submit"
          form="daily-update-form"
          text={isEditMode ? "Save update" : "Submit update"}
          loading={createState?.isLoading || updateState?.isLoading}
        />
      </div>

      <form
        id="daily-update-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="p-4 sm:p-5 space-y-4"
      >
        <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CustomInput
              label="Date"
              name="Date"
              type="date"
              register={form.register}
              errors={form.formState.errors}
              isRequired
            />

            <Controller
              control={form.control}
              name="OverallStatus"
              render={({ field }) => (
                <SimpleSelect
                  label="Overall status"
                  name="OverallStatus"
                  options={dailyUpdateStatusOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select status"
                  errors={form.formState.errors}
                  isRequired
                />
              )}
            />
            <CustomInput
              label="Total time (hours)"
              name="TotalTimeSpent"
              type="number"
              step="0.5"
              placeholder="Enter total time"
              register={form.register}
              errors={form.formState.errors}
              isRequired
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextArea
              label="Notes"
              name="Notes"
              placeholder="General notes for the day"
              register={form.register}
              errors={form.formState.errors}
            />
            <TextArea
              label="Next day plan"
              name="NextDayPlan"
              placeholder="Planned work for the next day"
              register={form.register}
              errors={form.formState.errors}
            />
          </div>
        </div>

        {roleLabel && (
          <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-800">
                Work items
              </h2>
              <CustomButton
                type="button"
                text="Add item"
                variant="primary"
                size="sm"
                onClick={handleAddWorkItem}
              />
            </div>

            {workItems.map((item, index) => {
              const baseName = `WorkItems.${index}`;
              const itemErrors =
                form.formState.errors?.WorkItems?.[index] || {};
              const isBlocked = form.watch(`${baseName}.Status`) === "blocked";
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-500">
                      Work item {index + 1}
                    </p>
                    {workItems.length > 1 && (
                      <CustomButton
                        type="button"
                        text="Remove"
                        variant="cancel"
                        size="xs"
                        startIcon={<Trash2 className="h-3.5 w-3.5" />}
                        onClick={() => handleRemoveWorkItem(index)}
                      />
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Controller
                      control={form.control}
                      name={`${baseName}.Type`}
                      render={({ field }) => (
                        <SimpleSelect
                          label="Type"
                          name="Type"
                          options={workItemTypeOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select type"
                          errors={itemErrors}
                          isRequired
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`${baseName}.Status`}
                      render={({ field }) => (
                        <SimpleSelect
                          label="Status"
                          name="Status"
                          options={workItemStatusOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select status…"
                          errors={itemErrors}
                          isRequired
                        />
                      )}
                    />

                    <Controller
                      control={form.control}
                      name={`${baseName}.TimeSpent`}
                      render={({ field }) => (
                        <CustomInput
                          label="Time spent (hours)"
                          name="TimeSpent"
                          type="number"
                          step="0.5"
                          value={field.value}
                          onChange={field.onChange}
                          errors={itemErrors}
                          placeholder="Enter time spent"
                        />
                      )}
                    />
                    {isBlocked && (
                      <Controller
                        control={form.control}
                        name={`${baseName}.BlockerType`}
                        render={({ field }) => (
                          <SimpleSelect
                            label="Blocker type"
                            name="BlockerType"
                            options={blockerTypeOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select blocker…"
                          />
                        )}
                      />
                    )}
                    {isBlocked && (
                      <Controller
                        control={form.control}
                        name={`${baseName}.ExpectedResolutionDate`}
                        render={({ field }) => (
                          <CustomInput
                            label="Expected resolution"
                            name="ExpectedResolutionDate"
                            type="date"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter expected resolution date"
                          />
                        )}
                      />
                    )}
                    <WorkItemReferenceSelect
                      form={form}
                      baseName={baseName}
                      itemErrors={itemErrors}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Controller
                      control={form.control}
                      name={`${baseName}.Description`}
                      render={({ field }) => (
                        <TextArea
                          label="Description"
                          name="Description"
                          value={field.value}
                          onChange={field.onChange}
                          errors={itemErrors}
                          placeholder="Enter description"
                          isRequired
                        />
                      )}
                    />
                    {isBlocked && (
                      <Controller
                        control={form.control}
                        name={`${baseName}.BlockerReason`}
                        render={({ field }) => (
                          <TextArea
                            label="Blocker reason"
                            name="BlockerReason"
                            value={field.value}
                            onChange={field.onChange}
                            errors={itemErrors}
                            placeholder="Enter blocker reason"
                            isRequired
                          />
                        )}
                      />
                    )}
                    <Controller
                      control={form.control}
                      name={`${baseName}.Comments`}
                      render={({ field }) => (
                        <TextArea
                          label="Comments"
                          name="Comments"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter comments"
                        />
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </form>
    </div>
  );
}
