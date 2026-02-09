"use client";

import PropTypes from "prop-types";
import { FileQuestion } from "lucide-react";

/**
 * Reusable empty/not-found state component with Lucide icons.
 * Use for: empty lists, 404 pages, search no results, etc.
 *
 * @param {React.Component} icon - Lucide icon component (e.g. LayoutGrid, FileQuestion)
 * @param {string} title - Main heading
 * @param {string} [description] - Optional subtitle
 * @param {string} [variant] - "default" | "compact" | "page" - layout variant
 */
function NoResultFound({
  icon: Icon = FileQuestion,
  title,
  description,
  variant = "default",
}) {
  const isCompact = variant === "compact";
  const isPage = variant === "page";

  const content = (
    <div
      className={
        isPage
          ? "flex min-h-screen flex-col items-center justify-center bg-white p-4"
          : isCompact
            ? "flex flex-col items-center justify-center rounded-xl bg-neutral-50/50 py-8 px-4 text-center"
            : "flex flex-col items-center justify-center rounded-xl bg-neutral-50/60 px-4 py-12 text-center sm:px-6 sm:py-20"
      }
    >
      <div
        className={
          isCompact
            ? "mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 text-primary-600"
            : "mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 text-primary-600"
        }
      >
        <Icon className={isCompact ? "h-6 w-6" : "h-6 w-6"} />
      </div>
      <h2
        className={
          isCompact
            ? "typography-h4 text-neutral-800"
            : isPage
              ? "text-heading-1 font-bold text-neutral-800 sm:text-2xl"
              : "typography-h3 text-neutral-800"
        }
      >
        {title}
      </h2>
      {description && (
        <p
          className={
            isCompact
              ? "mt-1 max-w-xs typography-body text-neutral-500"
              : "mt-2 max-w-sm typography-body text-neutral-500"
          }
        >
          {description}
        </p>
      )}
    </div>
  );

  return content;
}

NoResultFound.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  variant: PropTypes.oneOf(["default", "compact", "page"]),
};

export default NoResultFound;
