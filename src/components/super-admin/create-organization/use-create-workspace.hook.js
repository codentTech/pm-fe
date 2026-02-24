"use client";

import { createOrganizationWithOwner } from "@/provider/features/organizations/organizations.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const schema = Yup.object().shape({
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
});

export default function useCreateWorkspace() {
  const dispatch = useDispatch();
  const { createOrganizationWithOwner: createState } = useSelector(
    (state) => state?.organizations || {},
  );

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: { Name: "", OwnerEmail: "", Slug: "" },
  });

  const onSubmit = useCallback(
    (data) => {
      const payload = {
        Name: data.Name.trim(),
        OwnerEmail: data.OwnerEmail.trim(),
        ...(data.Slug?.trim() && { Slug: data.Slug.trim() }),
      };
      dispatch(
        createOrganizationWithOwner({
          payload,
          successCallBack: () => {
            form.reset({ Name: "", OwnerEmail: "", Slug: "" });
          },
        }),
      );
    },
    [dispatch, form],
  );

  return {
    form,
    onSubmit,
    createState,
  };
}
