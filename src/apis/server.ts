import { FetchDataParams, fetchData } from "./utils";

export const fetchServerData = async <T = any>(
  endpoint: string,
  params: FetchDataParams = {}
) => {
  return fetchData<T>(endpoint, {
    ...params,
    token: process.env.API_TOKEN,
  });
};
