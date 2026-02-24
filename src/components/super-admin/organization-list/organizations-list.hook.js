"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Building2, Pencil, Trash2, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  clearFetchOrganization,
  createOrganizationWithOwner,
  deleteOrganization,
  fetchListAllOrganizations,
  fetchOrganization,
  updateOrganization,
} from "@/provider/features/organizations/organizations.slice";
import { formatDate } from "@/common/utils/date.util";

export default function useSuperAdminOrganizationsList() {
  const dispatch = useDispatch();
  const createSchema = useMemo(
    () =>
      Yup.object().shape({
        Name: Yup.string().required("Workspace name is required").max(255),
        OwnerEmail: Yup.string()
          .email("Invalid email")
          .required("Org admin email is required"),
        Slug: Yup.string()
          .max(100)
          .matches(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug: lowercase, numbers and hyphens only",
          )
          .nullable()
          .transform((v) => (v === "" ? undefined : v)),
      }),
    [],
  );

  const createForm = useForm({
    resolver: yupResolver(createSchema),
    defaultValues: { Name: "", OwnerEmail: "", Slug: "" },
  });

  const {
    listAllOrganizations,
    fetchOrganization: fetchOrgState,
    updateOrganization: updateState,
    deleteOrganization: deleteState,
    createOrganizationWithOwner: createState,
  } = useSelector((state) => state?.organizations || {});

  const list = listAllOrganizations?.data || [];
  const loading = listAllOrganizations?.isLoading;
  const error = listAllOrganizations?.isError;
  const message = listAllOrganizations?.message;

  const [editOrgId, setEditOrgId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [deleteOrgId, setDeleteOrgId] = useState(null);
  const [deleteOrgName, setDeleteOrgName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSuccessMessage, setCreateSuccessMessage] = useState(null);

  const refetch = useCallback(() => {
    dispatch(fetchListAllOrganizations());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchListAllOrganizations());
  }, [dispatch]);

  useEffect(() => {
    if (!editOrgId) return;
    dispatch(clearFetchOrganization());
    dispatch(fetchOrganization(editOrgId));
  }, [editOrgId, dispatch]);

  useEffect(() => {
    const data = fetchOrgState?.data;
    if (data?.Id === editOrgId) {
      setEditName(data.Name || "");
      setEditSlug(data.Slug || "");
    }
  }, [editOrgId, fetchOrgState?.data]);

  const openEdit = useCallback((org) => {
    setEditOrgId(org.Id);
    setEditName(org.Name || "");
    setEditSlug(org.Slug || "");
  }, []);

  const closeEdit = useCallback(() => {
    setEditOrgId(null);
    setEditName("");
    setEditSlug("");
    dispatch(clearFetchOrganization());
  }, [dispatch]);

  const handleSaveEdit = useCallback(() => {
    if (!editOrgId || !editName?.trim()) return;
    dispatch(
      updateOrganization({
        orgId: editOrgId,
        payload: { Name: editName.trim(), Slug: editSlug?.trim() || undefined },
        successCallBack: () => {
          closeEdit();
          refetch();
        },
      }),
    );
  }, [editOrgId, editName, editSlug, dispatch, closeEdit, refetch]);

  const openDelete = useCallback((org) => {
    setDeleteOrgId(org.Id);
    setDeleteOrgName(org.Name || "this workspace");
  }, []);

  const closeDelete = useCallback(() => {
    setDeleteOrgId(null);
    setDeleteOrgName("");
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteOrgId) return;
    dispatch(
      deleteOrganization({
        orgId: deleteOrgId,
        successCallBack: () => {
          closeDelete();
          refetch();
        },
      }),
    );
  }, [deleteOrgId, dispatch, closeDelete, refetch]);

  const openCreateModal = useCallback(() => {
    createForm.reset({ Name: "", OwnerEmail: "", Slug: "" });
    setShowCreateModal(true);
  }, [createForm]);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
    createForm.reset({ Name: "", OwnerEmail: "", Slug: "" });
  }, [createForm]);

  const handleCreateSubmit = useCallback(
    (data) => {
      const payload = {
        Name: data.Name.trim(),
        OwnerEmail: data.OwnerEmail.trim(),
        ...(data.Slug?.trim() && { Slug: data.Slug.trim() }),
      };
      const invitedEmail = payload.OwnerEmail;
      dispatch(
        createOrganizationWithOwner({
          payload,
          successCallBack: (result) => {
            closeCreateModal();
            refetch();
            if (result?.invitationSent && invitedEmail) {
              setCreateSuccessMessage(invitedEmail);
            }
          },
        }),
      );
    },
    [dispatch, closeCreateModal, refetch],
  );

  useEffect(() => {
    if (!createSuccessMessage) return;
    const t = setTimeout(() => setCreateSuccessMessage(null), 8000);
    return () => clearTimeout(t);
  }, [createSuccessMessage]);

  const ORG_TABLE_ACTIONS = useMemo(
    () => [
      { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" /> },
      {
        key: "delete",
        label: "Delete",
        icon: <Trash2 className="h-4 w-4 text-danger-600" />,
      },
    ],
    [],
  );

  const ORG_TABLE_COLUMNS = useMemo(
    () => [
      {
        key: "Name",
        title: "Name",
        sortable: true,
        customRender: (row) => (
          <span className="font-medium text-neutral-900">{row.Name}</span>
        ),
      },
      {
        key: "Slug",
        title: "Slug",
        sortable: true,
        customRender: (row) => (
          <span className="text-neutral-600">{row.Slug}</span>
        ),
      },
      {
        key: "OrgAdmin",
        title: "Org admin",
        sortable: false,
        customRender: (row) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <User className="h-4 w-4" />
            </div>
            <span className="text-neutral-600">
              <p className="font-bold text-neutral-600">
                {row.OrgAdminName || row.OrgAdminEmail || "—"}
              </p>
              {row.OrgAdminEmail && (
                <span className="block truncate text-xs text-neutral-500">
                  {row.OrgAdminEmail}
                </span>
              )}
            </span>
          </div>
        ),
      },
      {
        key: "MemberCount",
        title: "Members",
        sortable: true,
        customRender: (row) => (
          <span className="text-neutral-600">{row.MemberCount ?? 0}</span>
        ),
      },
      {
        key: "CreatedAt",
        title: "Created",
        sortable: true,
        customRender: (row) => (
          <span className="text-neutral-600">{formatDate(row.CreatedAt)}</span>
        ),
      },
    ],
    [],
  );

  const tableData = useMemo(
    () => (list || []).map((org) => ({ ...org, id: org.Id })),
    [list],
  );

  const handleActionClick = useCallback(
    (actionKey, row) => {
      if (actionKey === "edit") openEdit(row);
      if (actionKey === "delete") openDelete(row);
    },
    [openEdit, openDelete],
  );

  const editLoading = fetchOrgState?.isLoading;

  return {
    SEPARATOR_COLORS: [
      "from-indigo-500 to-indigo-700",
      "from-emerald-500 to-emerald-700",
      "from-amber-500 to-amber-700",
      "from-rose-500 to-rose-700",
      "from-sky-500 to-sky-700",
      "from-violet-500 to-violet-700",
    ],
    loading,
    error,
    message,
    list,
    tableData,
    ORG_TABLE_COLUMNS,
    ORG_TABLE_ACTIONS,
    handleActionClick,
    editOrgId,
    editName,
    setEditName,
    editSlug,
    setEditSlug,
    editLoading,
    closeEdit,
    handleSaveEdit,
    updateState,
    deleteOrgId,
    deleteOrgName,
    closeDelete,
    handleDelete,
    deleteState,
    refetch,
    showCreateModal,
    openCreateModal,
    closeCreateModal,
    createForm,
    handleCreateSubmit,
    createState,
    createSuccessMessage,
    setCreateSuccessMessage,
  };
}
