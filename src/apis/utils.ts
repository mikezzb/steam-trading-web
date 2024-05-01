import { ApiConfig } from "@/config";
import { ErrorCode } from "@/constants";
import { DataWithPaging, FetchParams, ResPayload } from "@/types/apis";

const defaultHeaders = {
  "Content-Type": "application/json",
};

type FetchDataParams = FetchParams & {};

// Fetch wrapper to do request
export const fetchData = async <T = any>(
  endpoint: string,
  params: FetchDataParams = {},
  cache: RequestCache = "default"
) => {
  const { method = "GET", body, headers = {}, token } = params;
  // Add API url to endpoint
  endpoint = `${ApiConfig.url}/${endpoint}`;
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

  try {
    const res = await fetch(endpoint, reqInit);
    const payload: ResPayload<T> = await res.json();
    if (!payload?.code || payload.code !== ErrorCode.SUCCESS) {
      throw new Error(payload?.msg);
    }

    return payload.data;
  } catch (error) {
    throw error;
  }
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
