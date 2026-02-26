"use client";

// Workaround: react-markdown (or a dependency) references TypeScript type `boolean` at runtime.
if (typeof globalThis.boolean === "undefined") {
  globalThis.boolean = "boolean";
}

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import CircularILoader from "@/common/components/circular-loader/circular-loader.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import { FileQuestion } from "lucide-react";
import PageHeader from "@/common/components/page-header/page-header.component";
import useProjectWiki from "../../use-wiki.hook";
import ProjectWikiAttachments from "../attachments/project-wiki-attachments.component";

const ReactMarkdown = dynamic(
  () => import("react-markdown").then((mod) => mod.default),
  { ssr: false },
);

export default function ProjectWikiDetail({ projectId, slug }) {
  const router = useRouter();
  const {
    currentPage,
    fetchPage,
    requestedSlug,
    isAdmin,
    handleDeletePage,
    deletePage,
  } = useProjectWiki({ projectId, slug });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const displayPage =
    currentPage?.Slug === slug
      ? currentPage
      : fetchPage?.data?.Slug === slug
        ? fetchPage.data
        : null;

  const formattedUpdatedAt = useMemo(() => {
    if (!displayPage?.UpdatedAt) return "—";
    return new Date(displayPage.UpdatedAt).toLocaleString();
  }, [displayPage?.UpdatedAt]);

  const isLoading = Boolean(
    slug && !displayPage && fetchPage?.isLoading,
  );
  const notFound =
    slug &&
    !fetchPage?.isLoading &&
    !displayPage &&
    (fetchPage?.isError || fetchPage?.isSuccess) &&
    requestedSlug === slug;

  if (isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center px-4 py-8">
        <div className="rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <CircularILoader />
            <p className="typography-caption text-neutral-500">Loading page…</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-full">
        <PageHeader
          backLink={{ href: `/projects/${projectId}/wiki`, label: "Back to wiki" }}
          title="Wiki page not found"
          subtitle="This page may have been removed or the link might be incorrect."
        />
        <div className="px-4 py-8 sm:px-5">
          <div className="rounded-xl border-2 border-neutral-200 bg-white p-8">
            <NoResultFound
              icon={FileQuestion}
              title="Wiki page not found"
              description="This page may have been removed or the link might be incorrect. Go back to the wiki to browse existing pages."
              variant="default"
            />
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CustomButton
                type="button"
                text="Back to wiki"
                variant="primary"
                size="sm"
                startIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => router.push(`/projects/${projectId}/wiki`)}
              />
              {isAdmin && (
                <CustomButton
                  type="button"
                  text="New page"
                  variant="outline"
                  size="sm"
                  startIcon={<Pencil className="h-4 w-4" />}
                  onClick={() => router.push(`/projects/${projectId}/wiki/new`)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <PageHeader
        backLink={{ href: `/projects/${projectId}/wiki`, label: "Back to wiki" }}
        title={displayPage?.Title ?? "Wiki"}
        subtitle={`Updated ${formattedUpdatedAt}`}
        actions={
          isAdmin ? (
            <>
              <CustomButton
                type="button"
                text="Edit"
                variant="outline"
                size="sm"
                startIcon={<Pencil className="h-4 w-4" />}
                onClick={() =>
                  router.push(`/projects/${projectId}/wiki/${slug}/edit`)
                }
              />
              <CustomButton
                type="button"
                text="Delete"
                variant="danger"
                size="sm"
                startIcon={<Trash2 className="h-4 w-4" />}
                onClick={() => setShowDeleteModal(true)}
              />
            </>
          ) : null
        }
      />
      <div className="px-4 pb-8 sm:px-5">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="min-w-0 rounded-xl border-2 border-neutral-200 bg-white shadow-sm overflow-hidden">
            {displayPage?.Content ? (
              <article
                className="prose prose-neutral prose-sm max-w-none px-5 py-5 sm:px-6 sm:py-6 min-h-[200px] prose-headings:font-semibold prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-neutral-100 prose-pre:border prose-pre:border-neutral-200"
                aria-label="Wiki page content"
              >
                <ReactMarkdown
                  components={{
                    img: ({ src, alt }) => {
                      const baseUrl = process.env.NEXT_PUBLIC_MAIN_URL || "";
                      const resolvedSrc =
                        src?.startsWith("/") && baseUrl
                          ? `${baseUrl.replace(/\/$/, "")}${src}`
                          : src;
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolvedSrc}
                          alt={alt || ""}
                          className="rounded-lg max-w-full h-auto shadow-sm"
                        />
                      );
                    },
                  }}
                >
                  {displayPage.Content}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16 min-h-[200px]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                  <FileQuestion className="h-6 w-6" />
                </div>
                <p className="typography-body font-medium text-neutral-600">
                  No content yet
                </p>
                <p className="mt-1 max-w-sm typography-caption text-neutral-500">
                  An org admin can add content by editing this page.
                </p>
              </div>
            )}
          </div>
          <ProjectWikiAttachments
            projectId={projectId}
            pageId={displayPage?.Id}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete wiki page?"
        size="md"
        variant="danger"
      >
        <div className="space-y-4">
          <p className="typography-body text-neutral-700">
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setShowDeleteModal(false)}
            />
            <CustomButton
              type="button"
              text="Delete"
              variant="danger"
              loading={deletePage?.isLoading}
              onClick={() =>
                displayPage?.Id &&
                handleDeletePage(displayPage.Id, () =>
                  setShowDeleteModal(false),
                )
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
