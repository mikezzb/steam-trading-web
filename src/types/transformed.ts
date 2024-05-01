// transformed types from DTOs

import Currency from "@/utils/currency";
import {
  ItemDTO,
  ListingDTO,
  SubscriptionDTO,
  TransactionDTO,
  TransactionMetadataDTO,
  UserDTO,
} from "./dtos";
import { ItemFiltersDataDTO } from "./apis";

export type PriceInfo = {
  market: string;
  price: Currency;
  updatedAt: Date;
};

export interface Item extends ItemDTO {
  prices: Record<string, PriceInfo>;
  lowestPrice?: PriceInfo;
}

export interface Listing extends ListingDTO {}

export interface Subscription extends SubscriptionDTO {}

export interface User extends UserDTO {}

export interface TransactionMetadata extends TransactionMetadataDTO {}

export interface Transaction extends TransactionDTO {
  metadata: TransactionMetadata;
}

export interface ItemFiltersData extends ItemFiltersDataDTO {}
