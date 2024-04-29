import { fetchData } from "./utils";

export const ApiRoutes = {
  items: "items",
};

export const getItem = (itemId: string) => {
  const endpoint = `${ApiRoutes.items}/${itemId}`;
  return fetchData<{ item: Item }>(endpoint);
};

export const getItemPreviewUrl = (itemId: string) => {
  return `/images/previews/${itemId}.png`;
};

export const getBuffIds = async () => {
  // HTTP GET on a json file
  const endpoint = "public/data/buff/buffids.json";
  return fetchData<Record<string, number>>(endpoint, {}, "force-cache");
};
