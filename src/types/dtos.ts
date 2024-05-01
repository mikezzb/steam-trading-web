export interface MarketPriceDTO {
  price: string;
  updatedAt: string;
}

export interface ItemDTO {
  _id: string;
  name: string;
  category: string;
  skin?: string;
  exterior?: string;

  iconUrl: string;
  buffPrice: MarketPriceDTO;
  uuPrice: MarketPriceDTO;
  igxePrice: MarketPriceDTO;
  steamPrice: MarketPriceDTO;
}

export interface ListingDTO {
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

export interface SubscriptionDTO {
  _id: string;
  name: string;
  rarity?: string;
  maxPremium?: string;
  notiType: string;
  notiId: string;
  ownerId: string;
}

export interface UserDTO {
  _id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  subscriptionIds: string[];
  favItemIds: string[];
  favListingIds: string[];
}

export interface TransactionMetadataDTO {
  market: string;
  assetId: string;
}

export interface TransactionDTO {
  _id: string;
  metadata: TransactionMetadataDTO;
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
