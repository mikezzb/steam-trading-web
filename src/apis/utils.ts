import { ApiConfig } from "@/config";

// Fetch wrapper to do request
export const fetchData = async <T = any>(
  endpoint: string,
  params: FetchParams = {},
  cache: RequestCache = "default"
) => {
  const { method = "GET", body, headers = {}, token } = params;
  const fullUrl = `${ApiConfig.url}/${endpoint}`;
  const reqHeaders = {
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

  console.log("fetchData", reqInit.method, fullUrl);
  const res = await fetch(fullUrl, reqInit);
  const payload: ResPayload<T> = await res.json();
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
