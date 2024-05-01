export const getItemPreviewUrl = (itemId: string) => {
  return `/images/previews/${itemId}.png`;
};

export const getItemUrl = (itemId: string) => {
  return `/items/${itemId}`;
};

export const getItemsUrl = (params: URLSearchParams) => {
  return `/items?${params}`;
};
