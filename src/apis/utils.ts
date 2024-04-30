import { ApiConfig, ErrorCode } from "@/config";

const defaultHeaders = {
  "Content-Type": "application/json",
};

// Fetch wrapper to do request
export const fetchData = async <T = any>(
  endpoint: string,
  params: FetchParams = {},
  cache: RequestCache = "default"
) => {
  const { method = "GET", body, headers = {}, token } = params;
  const fullUrl = `${ApiConfig.url}/${endpoint}`;
  const reqHeaders = {
    ...defaultHeaders,
    ...getAuthHeader(token),
    ...headers,
  };
  const reqInit: RequestInit = {
    headers: reqHeaders,
    method,
    cache,
  };
  if (body) {
    reqInit.body = JSON.stringify(body);
  }

  console.log("fetchData", fullUrl, reqInit);

  const res = await fetch(fullUrl, reqInit);
  const payload: ResPayload<T> = await res.json();

  // check payload code
  if (!payload?.code || payload.code !== ErrorCode.SUCCESS) {
    console.log(payload);
    throw new Error(payload?.msg);
  }

  return payload.data;
};

export const makeAuthHeader = (token?: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getAuthHeader = (token?: string) => {
  if (!token) {
    token = localStorage.getItem("token") ?? undefined;
  }
  return makeAuthHeader(token);
};

// Get next page param for useInfiniteQuery
export const getNextPageParam = (
  lastPage: DataWithPaging,
  allPages: DataWithPaging[],
  lastPageParam: unknown,
  allPagesParam: unknown[]
) => {
  const { total, page, pageSize } = lastPage;
  const totalPages = Math.ceil(total / pageSize);
  const nextPage = page < totalPages ? page + 1 : undefined;
  return nextPage;
};
