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
  TargetValue: 0,
  CurrentValue: 0,
  Unit: "",
  Period: "monthly",
  DueDate: "",
  Notes: "",
};

export default function useKpiTracker() {
  const dispatch = useDispatch();
  const {
    kpis,
    fetchKpis: fetchState,
    createKpi: createKpiState,
    deleteKpi: deleteKpiState,
  } = useSelector((state) => state.kpis);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKpi, setEditingKpi] = useState(null);
  const [kpiToDeleteId, setKpiToDeleteId] = useState(null);

  const createForm = useForm({ defaultValues: defaultKpiValues });
  const editForm = useForm({ defaultValues: defaultKpiValues });

  useEffect(() => {
    dispatch(fetchKpis());
  }, [dispatch]);

  const handleCreate = (values) => {
    dispatch(
      createKpi({
        payload: {
          Name: values.Name,
          TargetValue: Number(values.TargetValue),
          CurrentValue: Number(values.CurrentValue) || 0,
          Unit: values.Unit || undefined,
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
  };

  const handleUpdate = (values) => {
    if (!editingKpi) return;
    dispatch(
      updateKpi({
        id: editingKpi.Id,
        payload: {
          Name: values.Name,
          TargetValue: Number(values.TargetValue),
          CurrentValue: Number(values.CurrentValue),
          Unit: values.Unit || undefined,
          Period: values.Period,
          DueDate: values.DueDate || undefined,
          Notes: values.Notes || undefined,
        },
        successCallBack: () => setEditingKpi(null),
      })
    );
  };

  const requestDeleteKpi = (id) => setKpiToDeleteId(id);

  const confirmDeleteKpi = () => {
    if (!kpiToDeleteId) return;
    dispatch(
      deleteKpi({
        id: kpiToDeleteId,
        successCallBack: () => setKpiToDeleteId(null),
      })
    );
  };

  const openEdit = (kpi) => {
    setEditingKpi(kpi);
    editForm.reset({
      Name: kpi.Name,
      TargetValue: kpi.TargetValue,
      CurrentValue: kpi.CurrentValue,
      Unit: kpi.Unit || "",
      Period: kpi.Period || "monthly",
      DueDate: kpi.DueDate ? kpi.DueDate.slice(0, 10) : "",
      Notes: kpi.Notes || "",
    });
  };

  const loading = fetchState?.isLoading;

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
