import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const search = async (params, orgId) => {
  const { q, type, boardId, limit } = params;
  const searchParams = new URLSearchParams();
  if (q) searchParams.set("q", q);
  if (type) searchParams.set("type", type);
  if (orgId) searchParams.set("orgId", orgId);
  if (boardId) searchParams.set("boardId", boardId);
  if (limit) searchParams.set("limit", String(limit));
  const query = searchParams.toString();
  const url = `/search${query ? `?${query}` : ""}`;
  const response = await api(getHeaders(orgId)).get(url);
  return response.data;
};

const searchService = {
  search,
};

export default searchService;
