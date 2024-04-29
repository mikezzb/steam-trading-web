export const getTotalPages = (total: number, pageSize: number) => {
  return Math.ceil(total / pageSize);
};

export const isServer = typeof window === "undefined";
