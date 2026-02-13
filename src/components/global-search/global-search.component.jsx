"use client";

import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import Loader from "@/common/components/loader/loader.component";
import { Search } from "lucide-react";
import {
  SEARCH_RESULT_TYPE_ICONS,
  SEARCH_FILTER_OPTIONS,
} from "@/common/constants/search-result-type.constant";
import useGlobalSearch from "./use-global-search.hook";

const RESULTS_CONTAINER_HEIGHT = 320;

export default function GlobalSearch({ show, onClose }) {
  const {
    query,
    setQuery,
    typeFilter,
    setTypeFilter,
    inputRef,
    loading,
    allItems,
    hasResults,
    isEmpty,
    debouncedQuery,
    handleSelect,
  } = useGlobalSearch(show, onClose);

  return (
    <Modal show={show} onClose={onClose} title="" size="md" variant="neutral">
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 pb-4">
          <div className="relative">
            <CustomInput
              customRef={inputRef}
              name="search"
              placeholder="Search cards, todos, projects…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              startIcon={<Search className="h-4 w-4 text-neutral-500" />}
            />
          </div>
        </div>

        <div className="shrink-0 flex flex-wrap gap-2 pb-4">
          {SEARCH_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value || "all"}
              type="button"
              onClick={() => setTypeFilter(opt.value)}
              className={`rounded-full px-3 py-1.5 typography-body-sm font-medium transition-colors ${
                typeFilter === opt.value
                  ? "bg-primary-100 text-primary-700"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div
          className="shrink-0 overflow-y-auto"
          style={{ height: RESULTS_CONTAINER_HEIGHT }}
        >
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader loading />
            </div>
          ) : isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center py-8">
              <p className="text-center typography-body text-neutral-500">
                No results for &quot;{debouncedQuery}&quot;
              </p>
            </div>
          ) : hasResults ? (
            <ul className="divide-y divide-neutral-100">
              {allItems.map((item) => {
                const Icon = SEARCH_RESULT_TYPE_ICONS[item.type];
                return (
                  <li key={`${item.type}-${item.id}`}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center gap-3 px-2 py-3 text-left transition-colors hover:bg-neutral-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        {Icon && <Icon className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-neutral-800">
                          {item.title}
                        </p>
                        {(item.subtitle || item.projectName) && (
                          <p className="truncate typography-caption text-neutral-500">
                            {item.projectName
                              ? `${item.projectName}${item.subtitle ? ` • ${item.subtitle}` : ""}`
                              : item.subtitle}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-8">
              <p className="text-center typography-body text-neutral-500">
                Type to search across cards, todos, and projects
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
