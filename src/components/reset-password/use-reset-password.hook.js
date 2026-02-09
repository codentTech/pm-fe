"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/provider/features/auth/auth.slice";

const schema = Yup.object().shape({
  NewPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      "Password must contain uppercase, lowercase, and number or special character"
    )
    .required("Password is required"),
});

export default function useResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const token = searchParams.get("token");
  const { isLoading, isError, message } = useSelector(
    (state) => state.auth?.resetPassword ?? { isLoading: false, isError: false, message: "" }
  );

  const form = useForm({
    resolver: yupResolver(schema),
  });

  // functions
  function onSubmit(values) {
    if (!token) return;
    dispatch(
      resetPassword({
        token,
        newPassword: values.NewPassword,
        successCallBack: () => router.push("/login?reset=success"),
      })
    );
  }

  return { form, onSubmit, isLoading, token, error: isError ? message : null };
}
