"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/provider/features/projects/projects.slice";

export default function useBoardsList() {
  // stats
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const {
    projects,
    fetchProjects: fetchState,
    createProject: createState,
    updateProject: updateState,
    deleteProject: deleteState,
  } = useSelector((state) => state?.projects ?? {});
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDeleteId, setProjectToDeleteId] = useState(null);

  const createForm = useForm({
    defaultValues: {
      Name: "",
      Description: "",
      ClientDisplayName: "",
      StartDate: "",
      DeliveryType: "time_and_material",
      Status: "created",
      RiskLevel: "",
      ExternalReferenceId: "",
    },
  });
  const editForm = useForm({
    defaultValues: {
      Name: "",
      Description: "",
      ClientDisplayName: "",
      StartDate: "",
      DeliveryType: "time_and_material",
      Status: "created",
      RiskLevel: "",
      ExternalReferenceId: "",
    },
  });

  const loading = fetchState?.isLoading;
  const createLoading = createState?.isLoading;
  const updateLoading = updateState?.isLoading;
  const deleteLoading = deleteState?.isLoading;

  useEffect(() => {
    if (currentOrganizationId !== undefined) {
      dispatch(fetchProjects());
    }
  }, [dispatch, currentOrganizationId]);

  useEffect(() => {
    if (searchParams?.get("openCreate") === "1") setShowCreateModal(true);
  }, [searchParams]);

  useEffect(() => {
    if (editingProject) {
      editForm.reset({
        Name: editingProject.Name || "",
        Description: editingProject.Description || "",
        ClientDisplayName: editingProject.ClientDisplayName || "",
        StartDate: editingProject.StartDate
          ? editingProject.StartDate.slice(0, 10)
          : "",
        DeliveryType: editingProject.DeliveryType || "time_and_material",
        Status: editingProject.Status || "created",
        RiskLevel: editingProject.RiskLevel || "",
        ExternalReferenceId: editingProject.ExternalReferenceId || "",
      });
    }
  }, [editingProject]);

  // functions
  function onSubmitCreate(values) {
    dispatch(
      createProject({
        payload: {
          Name: values.Name,
          Description: values.Description || "",
          ClientDisplayName: values.ClientDisplayName || undefined,
          StartDate: values.StartDate || undefined,
          DeliveryType: values.DeliveryType || undefined,
          Status: values.Status || undefined,
          RiskLevel: values.RiskLevel || undefined,
          ExternalReferenceId: values.ExternalReferenceId || undefined,
        },
        successCallBack: () => {
          setShowCreateModal(false);
          createForm.reset();
        },
      })
    );
  }

  function onSubmitEdit(values) {
    if (!editingProject?.Id) return;
    dispatch(
      updateProject({
        id: editingProject.Id,
        payload: {
          Name: values.Name,
          Description: values.Description || "",
          ClientDisplayName: values.ClientDisplayName || undefined,
          StartDate: values.StartDate || undefined,
          DeliveryType: values.DeliveryType || undefined,
          Status: values.Status || undefined,
          RiskLevel: values.RiskLevel || undefined,
          ExternalReferenceId: values.ExternalReferenceId || undefined,
        },
        successCallBack: () => {
          setEditingProject(null);
          editForm.reset();
        },
      })
    );
  }

  async function handleDeleteProject() {
    if (!projectToDeleteId) return;
    await dispatch(
      deleteProject({
        id: projectToDeleteId,
        successCallBack: () => setProjectToDeleteId(null),
      })
    );
  }

  return {
    projects,
    loading,
    showCreateModal,
    setShowCreateModal,
    editingProject,
    setEditingProject,
    projectToDeleteId,
    setProjectToDeleteId,
    createForm,
    editForm,
    handleSubmit: createForm.handleSubmit,
    handleEditSubmit: editForm.handleSubmit,
    errors: createForm.formState.errors,
    editErrors: editForm.formState.errors,
    register: createForm.register,
    editRegister: editForm.register,
    onSubmitCreate,
    onSubmitEdit,
    handleDeleteProject,
    createLoading,
    updateLoading,
    deleteLoading,
  };
}
