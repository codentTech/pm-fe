"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getDisplayUser } from "@/common/utils/users.util";
import {
  changePassword,
  fetchMe,
  updateProfile,
} from "@/provider/features/users/users.slice";

export default function useUserSettings() {
  // stats
  const dispatch = useDispatch();
  const { profile, fetchMe: fetchState, updateProfile: updateState, changePassword: changeState } =
    useSelector((state) => state?.users ?? {});
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const profileForm = useForm({
    defaultValues: { FullName: "" },
  });
  const passwordForm = useForm({
    defaultValues: {
      CurrentPassword: "",
      NewPassword: "",
      ConfirmPassword: "",
    },
  });

  const displayUser = profile || getDisplayUser();
  const loading = fetchState?.isLoading;

  // useEffect
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      profileForm.reset({ FullName: profile.FullName || "" });
    }
  }, [profile]);

  // functions
  function handleProfileSubmit(data) {
    setProfileError("");
    dispatch(
      updateProfile({
        payload: data,
        successCallBack: (resData) => {
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          const actualUser = stored.user ?? stored;
          if (actualUser) {
            actualUser.FullName = resData.FullName;
            localStorage.setItem(
              "user",
              JSON.stringify(stored.user ? { ...stored, user: actualUser } : actualUser)
            );
          }
        },
        errorCallBack: (msg) => setProfileError(msg),
      })
    );
  }

  function handlePasswordSubmit(data) {
    if (data.NewPassword?.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (data.NewPassword !== data.ConfirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setPasswordError("");
    dispatch(
      changePassword({
        payload: {
          CurrentPassword: data.CurrentPassword,
          NewPassword: data.NewPassword,
        },
        successCallBack: () => {
          passwordForm.reset({
            CurrentPassword: "",
            NewPassword: "",
            ConfirmPassword: "",
          });
        },
        errorCallBack: (msg) => setPasswordError(msg),
      })
    );
  }

  const onProfileSubmit = profileForm.handleSubmit(handleProfileSubmit);
  const onPasswordSubmit = passwordForm.handleSubmit(handlePasswordSubmit);

  return {
    loading,
    displayUser,
    profileForm,
    passwordForm,
    profileError,
    passwordError,
    profileSaving: updateState?.isLoading,
    passwordSaving: changeState?.isLoading,
    onProfileSubmit,
    onPasswordSubmit,
  };
}
