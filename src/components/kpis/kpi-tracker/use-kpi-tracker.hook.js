"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchKpis,
  createKpi,
  updateKpi,
  deleteKpi,
} from "@/provider/features/kpis/kpis.slice";

export const PERIOD_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const defaultKpiValues = {
  Name: "",
  Value: 0,
  Period: "monthly",
  DueDate: "",
  Notes: "",
};

export default function useKpiTracker() {
  // stats
  const dispatch = useDispatch();
  const {
    kpis,
    fetchKpis: fetchState,
    createKpi: createKpiState,
    deleteKpi: deleteKpiState,
  } = useSelector((state) => state?.kpis ?? {});
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKpi, setEditingKpi] = useState(null);
  const [kpiToDeleteId, setKpiToDeleteId] = useState(null);

  const createForm = useForm({ defaultValues: defaultKpiValues });
  const editForm = useForm({ defaultValues: defaultKpiValues });

  const loading = fetchState?.isLoading;

  useEffect(() => {
    if (currentOrganizationId !== undefined) {
      dispatch(fetchKpis());
    }
  }, [dispatch, currentOrganizationId]);

  // functions
  function handleCreate(values) {
    dispatch(
      createKpi({
        payload: {
          Name: values.Name,
          Value: Number(values.Value) ?? 0,
          Period: values.Period,
          DueDate: values.DueDate || undefined,
          Notes: values.Notes || undefined,
        },
        successCallBack: () => {
          setShowCreateModal(false);
          createForm.reset();
        },
      })
    );
  }

  function handleUpdate(values) {
    if (!editingKpi) return;
    dispatch(
      updateKpi({
        id: editingKpi.Id,
        payload: {
          Name: values.Name,
          Value: Number(values.Value) ?? 0,
          Period: values.Period,
          DueDate: values.DueDate || undefined,
          Notes: values.Notes || undefined,
        },
        successCallBack: () => setEditingKpi(null),
      })
    );
  }

  function requestDeleteKpi(id) {
    setKpiToDeleteId(id);
  }

  function confirmDeleteKpi() {
    if (!kpiToDeleteId) return;
    dispatch(
      deleteKpi({
        id: kpiToDeleteId,
        successCallBack: () => setKpiToDeleteId(null),
      })
    );
  }

  function openEdit(kpi) {
    setEditingKpi(kpi);
    editForm.reset({
      Name: kpi.Name,
      Value: Number(kpi.CurrentValue) ?? 0,
      Period: kpi.Period || "monthly",
      DueDate: kpi.DueDate ? kpi.DueDate.slice(0, 10) : "",
      Notes: kpi.Notes || "",
    });
  }

  return {
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
  };
}
