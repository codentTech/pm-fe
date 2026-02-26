"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import PageHeader from "@/common/components/page-header/page-header.component";
import { Controller } from "react-hook-form";
import useWorkspaceLabelsSection from "./use-workspace-labels-section.hook";

export default function WorkspaceLabelsSection({ orgId }) {
  const {
    labelColumns,
    tableData,
    LABEL_ACTIONS,
    LABEL_COLORS,
    fetchLabelsState,
    createLabelState,
    updateLabelState,
    deleteLabelState,
    showLabelForm,
    showLabelDeleteModal,
    labelToDelete,
    labelForm,
    handleActionClick,
    handleCloseLabelModal,
    handleCloseDeleteModal,
    handleDeleteLabel,
    toggleShowLabelForm,
    onSubmitLabelCreate,
    setShowLabelDeleteModal,
    setLabelToDelete,
  } = useWorkspaceLabelsSection(orgId);

  if (!orgId) return null;

  return (
    <div className="min-h-full">
      <PageHeader
        title="Labels"
        subtitle="Create and manage labels for your boards"
        actions={
          <CustomButton
            type="button"
            text="Add label"
            variant="primary"
            onClick={toggleShowLabelForm}
          />
        }
      />
      <div className="px-4 sm:px-5 space-y-4 pb-10">
        <CustomDataTable
          className="w-full"
          columns={labelColumns}
          data={tableData}
          loading={fetchLabelsState?.isLoading}
          selectable={false}
          searchable={false}
          paginated={tableData.length > 10}
          pageSize={10}
          actions={LABEL_ACTIONS}
          onActionClick={handleActionClick}
          emptyMessage="No labels yet. Create labels to organize cards across your boards."
          tableClassName="min-w-full divide-y divide-neutral-200"
          headerClassName="border-neutral-200"
        />
      </div>

      <Modal
        show={showLabelForm}
        onClose={handleCloseLabelModal}
        title="Add label"
        size="md"
      >
        <form
          onSubmit={labelForm.handleSubmit(onSubmitLabelCreate)}
          className="space-y-4"
        >
          <CustomInput
            label="Label name"
            name="Name"
            placeholder="e.g. Urgent, Bug, Feature"
            register={labelForm.register}
            errors={labelForm.formState.errors}
            isRequired
          />
          <div>
            <label className="mb-2 block typography-body font-medium text-neutral-700">
              Color
            </label>
            <div className="inline-flex flex-wrap gap-1 rounded-lg border border-neutral-200 bg-neutral-50/50 p-1.5">
              {LABEL_COLORS.map((color) => (
                <Controller
                  key={color}
                  name="Color"
                  control={labelForm.control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(color)}
                      className={`h-6 w-6 rounded border-2 shadow-sm transition-all focus:outline-none hover:scale-105 ${
                        field.value === color
                          ? "border-neutral-800 ring-2 ring-neutral-400"
                          : "border-transparent hover:border-neutral-300"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  )}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={handleCloseLabelModal}
            />
            <CustomButton
              type="submit"
              text="Create label"
              variant="primary"
              loading={createLabelState?.isLoading}
            />
          </div>
        </form>
      </Modal>

      <Modal
        show={showLabelDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Delete label"
        size="md"
        variant="danger"
      >
        <div className="space-y-4">
          <p className="typography-body text-neutral-700">
            Are you sure you want to delete the label{" "}
            <strong>{labelToDelete?.Name}</strong>? It will be removed from all
            cards.
          </p>
          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={handleCloseDeleteModal}
            />
            <CustomButton
              type="button"
              text="Delete"
              variant="danger"
              onClick={handleDeleteLabel}
              loading={deleteLabelState?.isLoading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
