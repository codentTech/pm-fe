"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Modal from "@/common/components/modal/modal.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { Plus, BarChart3, Pencil, Trash2 } from "lucide-react";
import { Controller } from "react-hook-form";
import useKpiTracker, { PERIOD_OPTIONS } from "./use-kpi-tracker.hook";

const UNIT_OPTIONS = [
  { value: "", label: "None" },
  { value: "USD", label: "USD" },
  { value: "%", label: "%" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "kg", label: "kg" },
  { value: "units", label: "Units" },
];

function progressPct(row) {
  const target = Number(row.TargetValue) || 0;
  const current = Number(row.CurrentValue) || 0;
  return target ? Math.min(100, Math.round((current / target) * 100)) : 0;
}

function progressColor(pct) {
  return pct >= 100
    ? "bg-success-500"
    : pct >= 50
      ? "bg-primary-500"
      : "bg-warning-500";
}

const KPI_COLUMNS = [
  { key: "Name", title: "Name", sortable: true },
  {
    key: "Target",
    title: "Target",
    sortable: false,
    customRender: (row) => {
      const target = Number(row.TargetValue) ?? 0;
      const unit = row.Unit ? ` ${row.Unit}` : "";
      return (
        <span className="text-sm text-neutral-600">
          {target}
          {unit && <span className="text-neutral-400">{unit}</span>}
        </span>
      );
    },
  },
  {
    key: "CurrentValue",
    title: "Current",
    sortable: true,
    customRender: (row) => (
      <span className="text-sm text-neutral-600">
        {Number(row.CurrentValue) ?? 0}
      </span>
    ),
  },
  {
    key: "Progress",
    title: "Progress",
    sortable: false,
    customRender: (row) => {
      const pct = progressPct(row);
      const color = progressColor(pct);
      return (
        <div className="px-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className={`h-full rounded-full transition-all ${color}`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
          <span className="mt-1 block text-left text-xs font-medium text-neutral-500">
            {pct}%
          </span>
        </div>
      );
    },
  },
  {
    key: "Period",
    title: "Period",
    sortable: true,
    customRender: (row) => {
      const p = row.Period ? String(row.Period) : "";
      const capitalized = p
        ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
        : "—";
      return <span className="capitalize text-neutral-600">{capitalized}</span>;
    },
  },
  {
    key: "DueDate",
    title: "Due",
    sortable: true,
    customRender: (row) => (
      <span className="text-neutral-500">
        {row.DueDate ? new Date(row.DueDate).toLocaleDateString() : "—"}
      </span>
    ),
  },
];

const KPI_ACTIONS = [
  { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" /> },
  {
    key: "delete",
    label: "Delete",
    icon: <Trash2 className="h-4 w-4 text-danger-600" />,
  },
];

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
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">
            KPI Tracker
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Track targets and progress
          </p>
        </div>
        <CustomButton
          text="Add KPI"
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          startIcon={<Plus className="h-4 w-4" />}
          className="rounded-xl px-5 py-2.5"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader loading />
        </div>
      ) : !kpis?.length ? (
        <div className="card flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 py-16 px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <BarChart3 className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800">No KPIs yet</h3>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">
            Add your first KPI to track targets and progress over time.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden rounded-xl border-neutral-200 shadow-sm">
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
          className="space-y-4"
        >
          <CustomInput
            label="Name"
            name="Name"
            placeholder="e.g. Revenue"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Target"
              name="TargetValue"
              type="number"
              placeholder="0"
              register={createForm.register}
              errors={createForm.formState.errors}
            />
            <CustomInput
              label="Current"
              name="CurrentValue"
              type="number"
              placeholder="0"
              register={createForm.register}
              errors={createForm.formState.errors}
            />
          </div>
          <Controller
            name="Unit"
            control={createForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Unit (optional)"
                name="Unit"
                options={UNIT_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select unit…"
                errors={createForm.formState.errors}
              />
            )}
          />
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
          <TextArea
            label="Notes (optional)"
            name="Notes"
            placeholder="Notes"
            register={createForm.register}
            errors={createForm.formState.errors}
          />
          <div className="flex justify-end gap-2 pt-2">
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
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              label="Target"
              name="TargetValue"
              type="number"
              register={editForm.register}
              errors={editForm.formState.errors}
            />
            <CustomInput
              label="Current"
              name="CurrentValue"
              type="number"
              register={editForm.register}
              errors={editForm.formState.errors}
            />
          </div>
          <Controller
            name="Unit"
            control={editForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Unit"
                name="Unit"
                options={UNIT_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select unit…"
                errors={editForm.formState.errors}
              />
            )}
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
          <div className="flex justify-end gap-2 pt-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setEditingKpi(null)}
            />
            <CustomButton type="submit" text="Save" variant="primary" />
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
