// handles the steam-items-data

import { getBuffIds } from "@/apis";

export const getItemId = async (itemName: string) => {
  // load buff ids from the server
  const buffIds = await getBuffIds();

  return buffIds[itemName];
};
