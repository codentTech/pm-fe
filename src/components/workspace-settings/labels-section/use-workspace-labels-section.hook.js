"use client";

import { useMemo } from "react";
import InlineEditInput from "@/common/components/inline-edit-input/inline-edit-input.component";
import { formatDateTime } from "@/common/utils/date.util";
import { Pencil, Tag, Trash2 } from "lucide-react";
import useWorkspaceDetail from "@/common/hooks/use-workspace-detail.hook";

const LABEL_ACTIONS = [
  { key: "edit", label: "Edit name", icon: <Pencil className="h-4 w-4" /> },
  {
    key: "delete",
    label: "Delete",
    icon: <Trash2 className="h-4 w-4 text-danger-600" />,
  },
];

const SEPARATOR_COLORS = [
  "from-indigo-500 to-indigo-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-sky-500 to-sky-700",
  "from-violet-500 to-violet-700",
];

export default function useWorkspaceLabelsSection(orgId) {
  const detail = useWorkspaceDetail(orgId);
  const {
    labels,
    fetchLabelsState,
    createLabelState,
    updateLabelState,
    deleteLabelState,
    showLabelForm,
    editingLabelId,
    editingLabelNameValue,
    setEditingLabelNameValue,
    editingLabelColorId,
    showLabelDeleteModal,
    labelToDelete,
    labelForm,
    LABEL_COLORS,
    handleStartLabelNameEdit,
    handleSaveLabelNameEdit,
    handleCancelLabelNameEdit,
    handleStartLabelColorEdit,
    handleSaveLabelColorEdit,
    handleCancelLabelColorEdit,
    handleDeleteLabel,
    toggleShowLabelForm,
    onSubmitLabelCreate,
    setShowLabelDeleteModal,
    setLabelToDelete,
  } = detail;

  const labelColumns = useMemo(
    () => [
      {
        key: "Color",
        title: "Color",
        sortable: false,
        customRender: (row) =>
          editingLabelColorId === row.Id ? (
            <div className="inline-flex flex-wrap gap-1 rounded border border-neutral-200 bg-neutral-50/50 p-1">
              {LABEL_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleSaveLabelColorEdit(row.Id, color)}
                  className={`h-6 w-6 rounded border-2 shadow-sm transition-all focus:outline-none hover:scale-105 ${
                    (row.Color || "#6b7280") === color
                      ? "border-neutral-800 ring-2 ring-neutral-400"
                      : "border-transparent hover:border-neutral-300"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                !updateLabelState?.isLoading &&
                !deleteLabelState?.isLoading &&
                handleStartLabelColorEdit(row)
              }
              className="h-6 w-6 shrink-0 rounded border-[0.5px] border-transparent transition-all hover:scale-105 focus:outline-none"
              style={{ backgroundColor: row.Color || "#6b7280" }}
              aria-label="Change label color"
            />
          ),
      },
      {
        key: "Name",
        title: "Name",
        sortable: true,
        customRender: (row) =>
          editingLabelId === row.Id ? (
            <InlineEditInput
              name="labelName"
              value={editingLabelNameValue}
              onChange={setEditingLabelNameValue}
              onSave={handleSaveLabelNameEdit}
              onCancel={handleCancelLabelNameEdit}
              loading={
                updateLabelState?.isLoading || deleteLabelState?.isLoading
              }
              placeholder="Label name"
              className="font-medium text-neutral-800"
              wrapperClassName="form-group !mb-0 min-w-0 flex-1"
            />
          ) : (
            <span
              role="button"
              tabIndex={0}
              className="flex min-w-0 items-center gap-2.5 truncate font-medium text-neutral-800 cursor-pointer hover:text-neutral-600"
              onClick={() =>
                !updateLabelState?.isLoading &&
                !deleteLabelState?.isLoading &&
                handleStartLabelNameEdit(row)
              }
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                handleStartLabelNameEdit(row)
              }
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Tag className="h-4 w-4" />
              </span>
              {row.Name}
            </span>
          ),
      },
      {
        key: "CreatedAt",
        title: "Created",
        sortable: true,
        customRender: (row) => (
          <span className="typography-caption text-neutral-500">
            {formatDateTime(row.CreatedAt)}
          </span>
        ),
      },
      {
        key: "UpdatedAt",
        title: "Updated",
        sortable: true,
        customRender: (row) => (
          <span className="typography-caption text-neutral-500">
            {formatDateTime(row.UpdatedAt)}
          </span>
        ),
      },
    ],
    [
      editingLabelColorId,
      editingLabelId,
      editingLabelNameValue,
      LABEL_COLORS,
      updateLabelState?.isLoading,
      deleteLabelState?.isLoading,
      detail,
    ]
  );

  const tableData = useMemo(
    () => (labels ?? []).map((l) => ({ ...l, id: l.Id })),
    [labels]
  );

  const handleActionClick = (actionKey, row) => {
    if (actionKey === "edit") handleStartLabelNameEdit(row);
    if (actionKey === "delete") {
      setLabelToDelete(row);
      setShowLabelDeleteModal(true);
    }
  };

  const handleCloseLabelModal = () => {
    toggleShowLabelForm();
    labelForm.reset({ Name: "", Color: "#6b7280" });
  };

  const handleCloseDeleteModal = () => {
    setShowLabelDeleteModal(false);
    setLabelToDelete(null);
  };

  return {
    labelColumns,
    tableData,
    LABEL_ACTIONS,
    LABEL_COLORS,
    SEPARATOR_COLORS,
    labels,
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
  };
}
