"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Save } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import TextArea from "@/common/components/text-area/text-area.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import useProjectWiki from "./use-project-wiki.hook";

export default function ProjectWikiForm({ projectId, slug }) {
  const router = useRouter();
  const isEdit = Boolean(slug);
  const {
    currentPage,
    canEdit,
    handleCreatePage,
    handleUpdatePage,
    createPage,
    updatePage,
    fetchPage,
  } = useProjectWiki({ projectId, slug });
  const form = useForm({
    defaultValues: {
      Title: "",
      Slug: "",
      Content: "",
    },
  });

  useEffect(() => {
    if (!isEdit || !currentPage) return;
    form.reset({
      Title: currentPage.Title || "",
      Slug: currentPage.Slug || "",
      Content: currentPage.Content || "",
    });
  }, [isEdit, currentPage, form]);

  if (fetchPage?.isLoading && isEdit) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-6">
        <Loader loading />
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="p-4 sm:p-6">
        <NoResultFound
          icon={BookOpen}
          title="Editing locked"
          description="Only project admins can edit the wiki."
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 sm:px-5">
        <Link
          href={isEdit ? `/projects/${projectId}/wiki/${slug}` : `/projects/${projectId}/wiki`}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 typography-body font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          Back to wiki
        </Link>
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">
            {isEdit ? "Edit wiki page" : "New wiki page"}
          </h1>
          <p className="page-header-subtitle">
            {isEdit ? "Update the knowledge base entry." : "Create a new project page."}
          </p>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit((values) => {
          const payload = {
            Title: values.Title,
            Slug: values.Slug || undefined,
            Content: values.Content || "",
          };
          if (isEdit) {
            handleUpdatePage(currentPage?.Id, payload);
          } else {
            handleCreatePage(payload);
          }
        })}
        className="px-4 pb-6 pt-4 sm:px-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CustomInput
            label="Title"
            name="Title"
            register={form.register}
            errors={form.formState.errors}
            isRequired
          />
          <CustomInput
            label="Slug (optional)"
            name="Slug"
            register={form.register}
            errors={form.formState.errors}
            placeholder="project-overview"
          />
        </div>
        <div className="pt-4">
          <TextArea
            label="Content (Markdown)"
            name="Content"
            register={form.register}
            errors={form.formState.errors}
            minRows={10}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-5">
          <CustomButton
            type="button"
            text="Cancel"
            variant="cancel"
            onClick={() =>
              router.push(
                isEdit
                  ? `/projects/${projectId}/wiki/${slug}`
                  : `/projects/${projectId}/wiki`,
              )
            }
          />
          <CustomButton
            type="submit"
            text={isEdit ? "Save changes" : "Create"}
            variant="primary"
            startIcon={<Save className="h-4 w-4" />}
            loading={isEdit ? updatePage?.isLoading : createPage?.isLoading}
          />
        </div>
      </form>
    </div>
  );
}
