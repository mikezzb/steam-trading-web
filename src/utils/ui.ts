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
  const rowWidth = width - ItemGridConfig.itemWidth;
  // count how many items can fit in a row
  const itemsPerRow = Math.floor(rowWidth / (ItemGridConfig.itemWidth + gap));
  // compute the item width (need margin on both sides of the row)
  const itemWidth = (rowWidth - gap * itemsPerRow) / itemsPerRow;
  const itemHeight = ItemGridConfig.itemHeight + gap;

  return {
    cols: itemsPerRow,
    rows: Math.ceil(total / itemsPerRow),
    itemWidth,
    itemHeight,
  };
};
