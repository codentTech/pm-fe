"use client";

import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Modal from "@/common/components/modal/modal.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import KpiTableSkeleton from "@/common/components/skeleton/kpi-table-skeleton.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { BarChart3, Plus } from "lucide-react";
import { Controller } from "react-hook-form";
import { KPI_ACTIONS, KPI_COLUMNS } from "./kpi-tracker.constants";
import { KPI_SEPARATOR_COLORS } from "@/common/constants/colors.constant";
import useKpiTracker, { PERIOD_OPTIONS } from "./use-kpi-tracker.hook";

export default function KpiTracker() {
  const {
    kpis,
    loading,
    showCreateModal,
    setShowCreateModal,
    editingKpi,
    setEditingKpi,
    createForm,
    editForm,
    handleCreate,
    handleUpdate,
    requestDeleteKpi,
    confirmDeleteKpi,
    kpiToDeleteId,
    setKpiToDeleteId,
    deleteKpiState,
    createKpiState,
    openEdit,
  } = useKpiTracker();

  const tableData = (kpis ?? []).map((kpi) => ({ ...kpi, id: kpi.Id }));
  const kpiToDelete = kpis?.find((k) => k.Id === kpiToDeleteId);

  const handleActionClick = (actionKey, row) => {
    if (actionKey === "edit") openEdit(row);
    if (actionKey === "delete") requestDeleteKpi(row.Id);
  };

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 sm:px-5">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">KPI Tracker</h1>
          <p className="page-header-subtitle">
            Track key metrics and performance indicators
          </p>
        </div>
        <CustomButton
          text="Add KPI"
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          startIcon={<Plus className="h-3.5 w-3.5 shrink-0" />}
          size="sm"
          className="shrink-0 rounded-lg px-3 py-1.5 typography-caption font-medium sm:px-4 sm:py-2 sm:typography-button"
        />
      </div>

      <div
        className="mb-4 flex items-center gap-1 px-4 sm:mb-6 sm:px-5"
        aria-hidden
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
        <span className="flex gap-1">
          {KPI_SEPARATOR_COLORS.map((color, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${color}`}
            />
          ))}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
      </div>

      {loading ? (
        <KpiTableSkeleton />
      ) : !kpis?.length ? (
        <NoResultFound
          icon={BarChart3}
          title="No KPIs yet"
          description="Add your first KPI to track key metrics over time."
        />
      ) : (
        <div className="w-full overflow-x-auto px-4 sm:px-5">
          <CustomDataTable
            columns={KPI_COLUMNS}
            data={tableData}
            loading={false}
            selectable={false}
            searchable={false}
            paginated={true}
            pageSize={10}
            actions={KPI_ACTIONS}
            onActionClick={handleActionClick}
            emptyMessage="No KPIs found"
            tableClassName="min-w-full divide-y divide-neutral-200"
            headerClassName="border-neutral-200"
            rowClassName="transition-colors"
            className=""
          />
        </div>
      )}

      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add KPI"
        size="md"
      >
        <form
          onSubmit={createForm.handleSubmit(handleCreate)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Row 1 */}
          <CustomInput
            label="Name"
            name="Name"
            placeholder="e.g. Revenue"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />

          <CustomInput
            label="Value"
            name="Value"
            type="number"
            placeholder="0"
            register={createForm.register}
            errors={createForm.formState.errors}
          />

          {/* Row 2 */}
          <Controller
            name="Period"
            control={createForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Period"
                name="Period"
                options={PERIOD_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select period…"
                errors={createForm.formState.errors}
              />
            )}
          />

          <CustomInput
            label="Due date (optional)"
            name="DueDate"
            type="date"
            register={createForm.register}
            errors={createForm.formState.errors}
          />

          {/* Full width row */}
          <div className="sm:col-span-2">
            <TextArea
              label="Notes (optional)"
              name="Notes"
              placeholder="Notes"
              register={createForm.register}
              errors={createForm.formState.errors}
            />
          </div>

          {/* Actions - right aligned */}
          <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
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
              loading={createKpiState?.isLoading}
            />
          </div>
        </form>
      </Modal>

      <Modal
        show={!!editingKpi}
        onClose={() => setEditingKpi(null)}
        title="Edit KPI"
        size="md"
      >
        <form
          onSubmit={editForm.handleSubmit(handleUpdate)}
          className="space-y-4 p-2"
        >
          <CustomInput
            label="Name"
            name="Name"
            register={editForm.register}
            errors={editForm.formState.errors}
            isRequired
          />
          <CustomInput
            label="Value"
            name="Value"
            type="number"
            register={editForm.register}
            errors={editForm.formState.errors}
          />
          <Controller
            name="Period"
            control={editForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Period"
                name="Period"
                options={PERIOD_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select period…"
                errors={editForm.formState.errors}
              />
            )}
          />
          <CustomInput
            label="Due date"
            name="DueDate"
            type="date"
            register={editForm.register}
            errors={editForm.formState.errors}
          />
          <TextArea
            label="Notes"
            name="Notes"
            placeholder="Notes"
            register={editForm.register}
            errors={editForm.formState.errors}
          />
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setEditingKpi(null)}
              className="w-full sm:w-auto"
            />
            <CustomButton
              type="submit"
              text="Save"
              variant="primary"
              className="w-full sm:w-auto"
            />
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        show={!!kpiToDeleteId}
        onClose={() => setKpiToDeleteId(null)}
        onConfirm={confirmDeleteKpi}
        title="Delete this KPI?"
        description={
          kpiToDelete
            ? `"${kpiToDelete.Name}" will be permanently removed. This cannot be undone.`
            : "This KPI will be permanently removed. This cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteKpiState?.isLoading}
      />
    </div>
  );
}
