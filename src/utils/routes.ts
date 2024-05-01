import { getItemId } from "./data";

export const getItemPreviewUrl = (itemId: string) => {
  return `/images/previews/${itemId}.png`;
};

export const getItemUrl = (itemId: string) => {
  return `/items/${itemId}`;
};

export const getItemUrlByName = async (itemName: string) => {
  const itemId = await getItemId(itemName);
  return getItemUrl(itemId.toString());
};

export const getItemsUrl = (params: URLSearchParams) => {
  return `/items?${params}`;
};
