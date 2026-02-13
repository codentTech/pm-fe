"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import useProjectWiki from "./use-project-wiki.hook";
import { createWikiPage, updateWikiPage } from "@/provider/features/wiki/wiki.slice";

export default function ProjectWikiEditor({ projectId, slug }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentPage, isAdmin } = useProjectWiki({ projectId, slug });

  useEffect(() => {
    if (!isAdmin) {
      router.push(`/projects/${projectId}/wiki`);
    }
  }, [isAdmin, projectId, router]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const payload = {
      Title: form.Title.value,
      Slug: form.Slug.value || undefined,
      Content: form.Content.value,
    };
    if (slug && currentPage?.Id) {
      dispatch(
        updateWikiPage({
          projectId,
          pageId: currentPage.Id,
          payload,
          successCallBack: (page) =>
            router.push(`/projects/${projectId}/wiki/${page.Slug}`),
        }),
      );
      return;
    }
    dispatch(
      createWikiPage({
        projectId,
        payload,
        successCallBack: (page) =>
          router.push(`/projects/${projectId}/wiki/${page.Slug}`),
      }),
    );
  };

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 sm:px-5">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">
            {slug ? "Edit wiki page" : "New wiki page"}
          </h1>
          <p className="page-header-subtitle">
            Write and keep project knowledge up to date.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <CustomInput
            label="Title"
            name="Title"
            defaultValue={currentPage?.Title || ""}
            isRequired
          />
          <CustomInput
            label="Slug (optional)"
            name="Slug"
            defaultValue={currentPage?.Slug || ""}
            placeholder="auto-generated if empty"
          />
        </div>
        <TextArea
          label="Content (Markdown)"
          name="Content"
          defaultValue={currentPage?.Content || ""}
          minRows={10}
          isRequired
        />
        <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5">
          <CustomButton
            type="button"
            text="Cancel"
            variant="cancel"
            onClick={() => router.push(`/projects/${projectId}/wiki`)}
          />
          <CustomButton type="submit" text="Save" variant="primary" />
        </div>
      </form>
    </div>
  );
}
