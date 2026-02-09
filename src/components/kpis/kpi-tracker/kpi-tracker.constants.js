"use client";

import { Pencil, Trash2 } from "lucide-react";

export const KPI_COLUMNS = [
  { key: "Name", title: "Name", sortable: true },
  {
    key: "Value",
    title: "Value",
    sortable: true,
    customRender: (row) => (
      <span className="typography-body font-medium text-neutral-700">
        {Number(row.CurrentValue) ?? 0}
      </span>
    ),
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

export const KPI_ACTIONS = [
  { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" /> },
  {
    key: "delete",
    label: "Delete",
    icon: <Trash2 className="h-4 w-4 text-danger-600" />,
  },
];
