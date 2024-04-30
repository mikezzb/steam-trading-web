// transformed types from DTOs

import Currency from "@/utils/currency";

export type PriceInfo = {
  market: string;
  price: Currency;
  updatedAt: Date;
};

export interface Item {
  _id: string;
  fullName: string;
  name: string;
  exterior: string;
  skin: string;
  iconUrl: string;
  prices: Record<string, PriceInfo>;

  lowestPrice?: PriceInfo;
}

export interface Listing {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  market: string;
  price: string;
  previewUrl: string;
  goodsId: number;
  classId: string;
  assetId: string;
  tradableCooldown: string;
  paintWear: string;
  paintIndex: number;
  paintSeed: number;
  rarity: string;
  instanceId: string;
}

export interface Subscription {
  _id: string;
  name: string;
  rarity?: string;
  maxPremium?: string;
  notiType: string;
  notiId: string;
  ownerId: string;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  subscriptionIds: string[];
  favItemIds: string[];
  favListingIds: string[];
}

export interface TransactionMetadata {
  market: string;
  assetId: string;
}

export interface Transaction {
  _id: string;
  metadata: TransactionMetadata;
  name: string;
  createdAt: string;
  price: string;
  previewUrl: string;
  goodsId: number;
  classId: string;
  tradableCooldown: string;
  paintWear: string;
  paintIndex: number;
  paintSeed: number;
  rarity: string;
  instanceId: string;
}
