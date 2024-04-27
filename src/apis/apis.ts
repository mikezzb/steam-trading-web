import { ApiConfig } from "@/config";
import { getAuthHeader, makeAuthHeader } from "./utils";

export const ApiRoutes = {
  items: "items",
};

// Fetch wrapper to do request
export const fetchData = async <T = any>(
  endpoint: string,
  params: FetchParams = {}
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
  };
  if (body) {
    reqInit.body = JSON.stringify(body);
  }

  console.log("fetchData", reqInit.method, fullUrl);
  const res = await fetch(fullUrl, reqInit);
  const payload: ResPayload<T> = await res.json();
  return payload.data;
};

export const getItem = (itemId: string) => {
  const endpoint = `${ApiRoutes.items}/${itemId}`;
  return fetchData<{ item: Item }>(endpoint);
};
