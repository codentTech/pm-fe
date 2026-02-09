"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/provider/features/auth/auth.slice";

const schema = Yup.object().shape({
  Email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function useForgotPassword() {
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector(
    (state) => state.auth?.forgotPassword ?? { isLoading: false, isSuccess: false }
  );

  const form = useForm({
    resolver: yupResolver(schema),
  });

  // functions
  function onSubmit(values) {
    dispatch(
      forgotPassword({
        email: values.Email,
        successCallBack: () => {},
      })
    );
  }

  return { form, onSubmit, isLoading, submitted: isSuccess };
}
