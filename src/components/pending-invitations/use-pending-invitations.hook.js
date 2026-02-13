"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingForMe,
  acceptInvitation,
  declineInvitation,
} from "@/provider/features/invitations/invitations.slice";
import { fetchOrganizations } from "@/provider/features/organizations/organizations.slice";
import { fetchProjects } from "@/provider/features/projects/projects.slice";
import { fetchBids } from "@/provider/features/bids/bids.slice";
import { fetchKpis } from "@/provider/features/kpis/kpis.slice";
import { setCurrentOrganization } from "@/provider/features/organizations/organizations.slice";

export default function usePendingInvitations() {
  // stats
  const dispatch = useDispatch();
  const { pendingForMe } = useSelector((state) => state.invitations);
  const [open, setOpen] = useState(false);
  const [acceptingToken, setAcceptingToken] = useState(null);
  const [decliningToken, setDecliningToken] = useState(null);
  const dropdownRef = useRef(null);

  const count = pendingForMe?.length || 0;

  useEffect(() => {
    dispatch(fetchPendingForMe());
  }, [dispatch]);

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
  async function handleAccept(invitation) {
    setAcceptingToken(invitation.Token);
    await dispatch(
      acceptInvitation({
        token: invitation.Token,
        successCallBack: () => {
          dispatch(fetchOrganizations());
          if (invitation.Organization?.Id) {
            dispatch(setCurrentOrganization(invitation.Organization.Id));
            dispatch(fetchProjects());
            dispatch(fetchBids());
            dispatch(fetchKpis());
          }
          setOpen(false);
        },
      })
    );
    setAcceptingToken(null);
  }

  async function handleDecline(invitation) {
    setDecliningToken(invitation.Token);
    await dispatch(
      declineInvitation({
        token: invitation.Token,
        successCallBack: () => setOpen(false),
      })
    );
    setDecliningToken(null);
  }

  function toggleOpen() {
    setOpen((prev) => !prev);
  }

  return {
    count,
    open,
    pendingForMe,
    dropdownRef,
    acceptingToken,
    decliningToken,
    toggleOpen,
    handleAccept,
    handleDecline,
  };
}
