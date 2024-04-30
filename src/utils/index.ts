export const getTotalPages = (total: number, pageSize: number) => {
  return Math.ceil(total / pageSize);
};

export const isServer = typeof window === "undefined";

// For json stringified data, null is considered as an object placeholder
export const isNaivePrimitive = (value: any) => {
  return typeof value !== "object";
};
