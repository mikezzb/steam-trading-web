import { ItemGridConfig, UiConfig } from "@/config";
import Currency from "./currency";
import { Item } from "@/types/transformed";
import { PRICE_MAX } from "@/constants";

// return react-window compatible grid configs
export const getItemGridConfigs = (
  total: number,
  width: number,
  height: number,
  gap = UiConfig.itemGap
) => {
  const rowWidth = width - UiConfig.sideBarWidth - UiConfig.pagePadding * 2;
  // count how many items can fit in a row
  const itemsPerRow = Math.floor(rowWidth / (ItemGridConfig.itemWidth + gap));
  // compute the item width (need margin on both sides of the row)
  const itemWidth = (rowWidth - gap * (itemsPerRow + 1)) / itemsPerRow;
  const itemHeight = ItemGridConfig.itemHeight + gap;

  return {
    cols: itemsPerRow,
    rows: Math.ceil(total / itemsPerRow),
    itemWidth,
    itemHeight,
  };
};

export const getValidParams = (params: URLSearchParams, keys: string[]) => {
  const validParams = new URLSearchParams();
  keys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      validParams.set(key, value);
    }
  });
  return validParams;
};

export const applyQueryParams = (
  params: URLSearchParams | Record<string, string>
) => {
  if (!(params instanceof URLSearchParams)) {
    params = new URLSearchParams(params);
  }
  window.history.pushState(null, "", `?${params}`);
};
