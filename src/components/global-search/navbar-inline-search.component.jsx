"use client";

import { useState, useRef, useEffect } from "react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import { Search } from "lucide-react";
import { SEARCH_RESULT_TYPE_ICONS } from "@/common/constants/search-result-type.constant";
import useGlobalSearch from "./use-global-search.hook";

export default function NavbarInlineSearch() {
  const containerRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const {
    query,
    setQuery,
    inputRef,
    loading,
    allItems,
    hasResults,
    hasQuery,
    isEmpty,
    debouncedQuery,
    handleSelect,
  } = useGlobalSearch(undefined, () => setDropdownOpen(false));

  const showDropdown = dropdownOpen && (hasQuery || loading);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div
        onFocus={() => setDropdownOpen(true)}
        className="relative"
      >
        <CustomInput
          customRef={inputRef}
          name="navbar-search"
          placeholder="Search projects, cards, todos, KPIs, workspaces…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          startIcon={<Search className="h-4 w-4 text-neutral-500" />}
          className="[&_.form-group]:!mb-0"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader loading />
            </div>
          ) : isEmpty ? (
            <div className="px-4 py-6 text-center typography-body text-neutral-500">
              No results for &quot;{debouncedQuery}&quot;
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
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-neutral-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        {Icon && <Icon className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-neutral-800">
                          {item.title}
                        </p>
                        {(item.subtitle || item.boardName) && (
                          <p className="truncate typography-caption text-neutral-500">
                            {item.boardName
                              ? `${item.boardName}${item.subtitle ? ` • ${item.subtitle}` : ""}`
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
            <div className="px-4 py-6 text-center typography-body text-neutral-500">
              Type to search across projects, cards, todos, KPIs, and workspaces
            </div>
          )}
        </div>
      )}
    </div>
  );
}
