"use client";

import { signUp } from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  FullName: Yup.string().required("Full name is required"),
  Email: Yup.string().email("Invalid email").required("Email is required"),
  Password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function useSignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { FullName: "", Email: "", Password: "" },
  });

  // functions
  function onSubmit(values) {
    setLoading(true);
    const returnUrl = searchParams?.get("returnUrl");
    const checkEmailRedirect =
      returnUrl && typeof returnUrl === "string"
        ? `/auth/check-email?returnUrl=${encodeURIComponent(returnUrl)}&email=${encodeURIComponent(values.Email)}`
        : `/auth/check-email?email=${encodeURIComponent(values.Email)}`;
    dispatch(
      signUp({
        payload: {
          FullName: values.FullName,
          Email: values.Email,
          Password: values.Password,
        },
        successCallBack: () => router.push(checkEmailRedirect),
      }),
    );
    setLoading(false);
  }

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
  };
}
