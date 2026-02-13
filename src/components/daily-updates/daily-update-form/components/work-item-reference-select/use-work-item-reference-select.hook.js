import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "@/common/hooks/useDebounce";
import {
  WORK_ITEM_TYPES_BID,
  WORK_ITEM_TYPES_REQUIRE_REFERENCE,
  WORK_ITEM_TYPES_TICKET,
} from "@/common/constants/daily-update.constant";
import { fetchBids } from "@/provider/features/bids/bids.slice";
import { search } from "@/provider/features/search/search.slice";

export default function useWorkItemReferenceSelect({ form, baseName }) {
  const dispatch = useDispatch();
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId,
  );
  const bids = useSelector((state) => state.bids?.bids || []);
  const bidsState = useSelector((state) => state.bids?.fetchBids);
  const searchResults = useSelector((state) => state.search?.results);
  const searchState = useSelector((state) => state.search?.search);

  const workItemType = form.watch(`${baseName}.Type`);
  const referenceId = form.watch(`${baseName}.ReferenceId`);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const isTicketType = WORK_ITEM_TYPES_TICKET.has(workItemType);
  const isBidType = WORK_ITEM_TYPES_BID.has(workItemType);
  const requiresReference = WORK_ITEM_TYPES_REQUIRE_REFERENCE.has(workItemType);

  useEffect(() => {
    if (!requiresReference) {
      if (referenceId) {
        form.setValue(`${baseName}.ReferenceId`, "");
      }
      setQuery("");
    }
  }, [requiresReference, referenceId, form, baseName]);

  useEffect(() => {
    if (!isBidType || !currentOrganizationId) return;
    dispatch(fetchBids({ params: { page: 1, limit: 50 } }));
  }, [dispatch, isBidType, currentOrganizationId]);

  useEffect(() => {
    if (!isTicketType || !currentOrganizationId) return;
    const term = debouncedQuery?.trim();
    if (!term) return;
    dispatch(
      search({
        params: {
          q: term,
          type: "card",
          orgId: currentOrganizationId,
          limit: 20,
        },
        orgId: currentOrganizationId,
      }),
    );
  }, [dispatch, isTicketType, debouncedQuery, currentOrganizationId]);

  const bidOptions = useMemo(() => {
    return (bids || []).map((bid) => ({
      value: bid.Id,
      label: bid.BidTitle || bid.ClientDisplayName || "Bid",
    }));
  }, [bids]);

  const ticketOptions = useMemo(() => {
    if (!debouncedQuery?.trim()) return [];
    const cards = searchResults?.cards ?? [];
    return cards.map((card) => ({
      value: card.id,
      label: `${card.title}${card.projectName ? ` — ${card.projectName}` : ""}`,
    }));
  }, [searchResults, debouncedQuery]);

  const referenceOptions = useMemo(() => {
    const source = isBidType ? bidOptions : ticketOptions;
    if (!referenceId) return source;
    if (source.some((option) => option.value === referenceId)) {
      return source;
    }
    return [
      {
        value: referenceId,
        label: isBidType ? "Bid" : "Ticket",
      },
      ...source,
    ];
  }, [referenceId, isBidType, bidOptions, ticketOptions]);

  const loading = Boolean(
    (isBidType && bidsState?.isLoading) || (isTicketType && searchState?.isLoading),
  );

  return {
    isTicketType,
    isBidType,
    requiresReference,
    referenceOptions,
    loading,
    referenceId,
    setQuery,
  };
}
