"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentOrganization,
  fetchOrganizations,
  fetchOrEnsureDefault,
  createOrganization,
} from "@/provider/features/organizations/organizations.slice";
import { fetchProjects } from "@/provider/features/projects/projects.slice";
import { fetchKpis } from "@/provider/features/kpis/kpis.slice";
import { fetchBids } from "@/provider/features/bids/bids.slice";
import { createInvitation } from "@/provider/features/invitations/invitations.slice";
import { useForm } from "react-hook-form";

export default function useOrganizationSwitcher() {
  const dispatch = useDispatch();
  const {
    organizations,
    currentOrganizationId,
    createOrganization: createState,
  } = useSelector((state) => state?.organizations ?? {});
  const [open, setOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const dropdownRef = useRef(null);

  const createForm = useForm({
    defaultValues: { Name: "" },
  });
  const inviteForm = useForm({
    defaultValues: { Email: "", Role: "developer" },
  });

  const currentOrg = organizations?.find((o) => o.Id === currentOrganizationId);

  // useEffect
  useEffect(() => {
    if (!organizations?.length) {
      if (!currentOrganizationId) {
        // dispatch(fetchOrEnsureDefault());
      } else {
        dispatch(fetchOrganizations());
      }
    }
  }, [currentOrganizationId, organizations?.length, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // functions
  function toggleOpen() {
    setOpen((prev) => !prev);
  }

  function handleSwitch(orgId) {
    dispatch(setCurrentOrganization(orgId));
    dispatch(fetchProjects());
    dispatch(fetchBids());
    dispatch(fetchKpis());
    setOpen(false);
  }

  function openCreateModal() {
    setOpen(false);
    setShowCreateModal(true);
  }

  function openInviteModal() {
    setOpen(false);
    setShowInviteModal(true);
  }

  function onSubmitCreate(values) {
    dispatch(
      createOrganization({
        payload: { Name: values.Name },
        successCallBack: () => {
          setShowCreateModal(false);
          createForm.reset();
        },
      }),
    );
  }

  function onSubmitInvite(values) {
    if (!currentOrganizationId) return;
    dispatch(
      createInvitation({
        orgId: currentOrganizationId,
        payload: { Email: values.Email, Role: values.Role || "developer" },
        successCallBack: () => {
          setShowInviteModal(false);
          inviteForm.reset();
        },
      }),
    );
  }

  return {
    open,
    organizations,
    currentOrg,
    currentOrganizationId,
    dropdownRef,
    showCreateModal,
    showInviteModal,
    createState,
    createForm,
    inviteForm,
    toggleOpen,
    handleSwitch,
    openCreateModal,
    openInviteModal,
    setShowCreateModal,
    setShowInviteModal,
    onSubmitCreate,
    onSubmitInvite,
  };
}
