// post formatter of DTOs

import { BIG_DECIMAL_NULL, MarketKeys, PRICE_MAX } from "@/constants";
import { ItemData, ItemDataDTO, ItemsData, ItemsDataDTO } from "@/types/apis";
import { ItemDTO, MarketPriceDTO } from "@/types/dtos";
import { Item, PriceInfo } from "@/types/transformed";
import { decodeItemName } from "@/utils/cs";
import Currency from "@/utils/currency";

const formatItemDTO = (itemDTO: ItemDTO): Item => {
  const prices: Record<string, PriceInfo> = {};
  let lowestPrice: PriceInfo | undefined = undefined;
  MarketKeys.forEach((market) => {
    const marketPrice: MarketPriceDTO = itemDTO[
      `${market}Price` as unknown as keyof ItemDTO
    ] as MarketPriceDTO;

    // validation
    if (
      !marketPrice?.price ||
      marketPrice.price === BIG_DECIMAL_NULL ||
      marketPrice.price > PRICE_MAX
    ) {
      return;
    }

    prices[market] = {
      price: new Currency(marketPrice.price),
      updatedAt: new Date(marketPrice.updatedAt),
      market,
    };
    if (!lowestPrice || prices[market].price < lowestPrice.price) {
      lowestPrice = prices[market];
    }
  });

  const item: Item = {
    ...itemDTO,
    prices,
    lowestPrice,
  };
  console.log("item", item);

  return item;
};

export const formatItemData = (data: ItemDataDTO): ItemData => ({
  item: formatItemDTO(data.item),
});

export const formatItemsData = (data: ItemsDataDTO): ItemsData => {
  return {
    ...data,
    items: data.items.map(formatItemDTO),
  };
};
