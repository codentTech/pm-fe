"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { search, clearResults } from "@/provider/features/search/search.slice";
import useDebounce from "@/common/hooks/useDebounce";

export default function useGlobalSearch(show, onClose) {
  // stats
  const dispatch = useDispatch();
  const router = useRouter();
  const currentOrganizationId = useSelector(
    (s) => s.organizations?.currentOrganizationId
  );
  const { results, search: searchState } = useSelector((s) => s?.search ?? {});
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);
  const allItems = [
    ...(results?.cards || []).map((c) => ({ ...c, type: "card" })),
    ...(results?.todos || []).map((t) => ({ ...t, type: "todo" })),
    ...(results?.boards || []).map((b) => ({ ...b, type: "board" })),
    ...(results?.kpis || []).map((k) => ({ ...k, type: "kpi" })),
    ...(results?.workspaces || []).map((w) => ({ ...w, type: "workspace" })),
  ];
  const hasResults = allItems.length > 0;
  const hasQuery = debouncedQuery?.trim();
  const loading = searchState?.isLoading;
  const isEmpty = hasQuery && !loading && !hasResults;

  // useEffect
  useEffect(() => {
    if (!debouncedQuery?.trim()) {
      dispatch(clearResults());
      return;
    }
    dispatch(
      search({
        params: {
          q: debouncedQuery.trim(),
          type: typeFilter || undefined,
          orgId: currentOrganizationId,
          limit: 15,
        },
        orgId: currentOrganizationId,
      })
    );
  }, [debouncedQuery, typeFilter, currentOrganizationId, dispatch]);

  useEffect(() => {
    if (show === true) {
      setQuery("");
      setTypeFilter("");
      dispatch(clearResults());
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [show, dispatch]);

  // functions
  function handleSelect(item) {
    if (item.url) {
      setQuery("");
      dispatch(clearResults());
      router.push(item.url);
      onClose?.();
    }
  }

  return {
    query,
    setQuery,
    typeFilter,
    setTypeFilter,
    inputRef,
    loading,
    allItems,
    hasResults,
    hasQuery,
    isEmpty,
    debouncedQuery,
    handleSelect,
  };
}
