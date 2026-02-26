"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import Loader from "@/common/components/loader/loader.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import { BookOpen } from "lucide-react";
import PageHeader from "@/common/components/page-header/page-header.component";
import useProjectWiki from "../../use-wiki.hook";
import ProjectWikiAttachments from "../attachments/project-wiki-attachments.component";

export default function ProjectWikiForm({ projectId, slug }) {
  const router = useRouter();
  const isEdit = Boolean(slug);
  const {
    currentPage,
    fetchPage,
    requestedSlug,
    projectReady,
    isAdmin,
    createPage,
    updatePage,
    handleCreatePage,
    handleUpdatePage,
  } = useProjectWiki({ projectId, slug });

  const form = useForm({
    defaultValues: { Title: "", Slug: "", Content: "" },
  });

  useEffect(() => {
    if (!isEdit || !currentPage) return;
    form.reset({
      Title: currentPage.Title || "",
      Slug: currentPage.Slug || "",
      Content: currentPage.Content || "",
    });
  }, [isEdit, currentPage, form]);

  const isLoading = isEdit ? updatePage?.isLoading : createPage?.isLoading;
  const initialLoading =
    !projectReady ||
    (isEdit &&
      currentPage == null &&
      !fetchPage?.isError &&
      (fetchPage?.isLoading || requestedSlug !== slug));

  if (initialLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center px-4">
        <div className="rounded-xl border-2 border-neutral-200 bg-white p-8">
          <Loader loading />
        </div>
      </div>
    );
  }

  if (projectReady && !isAdmin) {
    return (
      <div className="px-4 py-8">
        <NoResultFound
          icon={BookOpen}
          title="Editing locked"
          description="Only org admins can create and edit wiki pages."
          variant="compact"
        />
      </div>
    );
  }

  if (isEdit && !currentPage && fetchPage?.isError) {
    return (
      <div className="px-4 py-8">
        <NoResultFound
          icon={BookOpen}
          title="Page not found"
          description="This wiki page may have been removed or the link might be incorrect."
          variant="compact"
        />
      </div>
    );
  }

  const backHref = isEdit
    ? `/projects/${projectId}/wiki/${slug}`
    : `/projects/${projectId}/wiki`;

  return (
    <div className="min-h-full">
      <PageHeader
        backLink={{ href: backHref, label: "Back to wiki" }}
        title={isEdit ? "Edit wiki page" : "New wiki page"}
        subtitle={
          isEdit
            ? "Update the knowledge base entry."
            : "Create a new project wiki page."
        }
        actions={
          <CustomButton
            type="submit"
            form="wiki-page-form"
            text={isEdit ? "Save changes" : "Create"}
            variant="primary"
            startIcon={<Save className="h-4 w-4" />}
            loading={isLoading}
          />
        }
      />
      <form
        id="wiki-page-form"
        onSubmit={form.handleSubmit((values) => {
          const payload = {
            Title: values.Title,
            Slug: values.Slug?.trim() || undefined,
            Content: values.Content || "",
          };
          if (isEdit && currentPage?.Id) {
            handleUpdatePage(currentPage.Id, payload);
          } else {
            handleCreatePage(payload);
          }
        })}
        className="px-4 pb-6 pt-4 sm:px-5"
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
            placeholder="e.g. project-overview"
          />
        </div>
        <div className="pt-4">
          <TextArea
            label="Content (Markdown)"
            name="Content"
            register={form.register}
            errors={form.formState.errors}
          />
        </div>
      </form>

      {isEdit && currentPage?.Id && (
        <div className="mt-6 px-4 sm:px-5">
          <ProjectWikiAttachments
            projectId={projectId}
            pageId={currentPage.Id}
            isAdmin={isAdmin}
          />
        </div>
      )}
    </div>
  );
}
