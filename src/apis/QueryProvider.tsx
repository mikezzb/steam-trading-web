"use client";

import { ApiConfig, ErrorCode } from "@/config";
import { uiStore } from "@/stores";
import { FCC } from "@/types/ui";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

const handleQueryError = (error: Error) => {
  uiStore.enqueueSnackbar({
    message: error.message || "unknown error",
  });
};

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
          },
        },
        queryCache: new QueryCache({
          onError: handleQueryError,
        }),
        mutationCache: new MutationCache({
          onError: handleQueryError,
        }),
      })
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
