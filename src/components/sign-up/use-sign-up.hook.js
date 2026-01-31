"use client";

import { signUp } from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
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
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { FullName: "", Email: "", Password: "" },
  });

  const onSubmit = (values) => {
    dispatch(
      signUp({
        payload: {
          FullName: values.FullName,
          Email: values.Email,
          Password: values.Password,
          Role: "USER",
        },
        successCallBack: () => router.push("/boards"),
      })
    );
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}
