"use client";

import { ApiConfig } from "@/config";
import { ErrorCode } from "@/constants";
import { uiStore } from "@/stores";
import { FCC } from "@/types/ui";
import { handleError } from "@/utils/handlers";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

// const handleQuerySuccess = (data: any, query: any) => {
//   console.log("query success", data, query);
//   const payload = data as ResPayload;
//   if (!payload?.code || payload.code !== ErrorCode.SUCCESS) {
//     handleQueryError(new Error(payload?.msg));
//   }
// };

export const QueryProvider: FCC = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: ApiConfig.staleTime,
            gcTime: ApiConfig.gcTime,
          },
        },
        queryCache: new QueryCache({
          onError: handleError,
        }),
        mutationCache: new MutationCache({
          onError: handleError,
        }),
      })
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
