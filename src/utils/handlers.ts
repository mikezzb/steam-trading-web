import { uiStore } from "@/stores";

export const handleError = (error: Error) => {
  uiStore.enqueueError(error.message || "unknown error");
};
