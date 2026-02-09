"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { signUp } from "@/provider/features/auth/auth.slice";

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
          Role: "USER",
        },
        successCallBack: () => router.push(checkEmailRedirect),
      })
    );
  }

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}
