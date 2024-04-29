"use client";

import { ApiConfig } from "@/config";
import { FCC } from "@/types/ui";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

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
          onError: (error) => {
            console.error(error);
          },
        }),
      })
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
