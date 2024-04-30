interface MarketPrice {
  price: string;
  updatedAt: Date;
}

interface Item {
  _id: string;
  name: string;
  iconUrl: string;
  buffPrice: MarketPrice;
  uuPrice: MarketPrice;
  igxePrice: MarketPrice;
  steamPrice: MarketPrice;
}

interface Listing {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
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

interface Subscription {
  _id: string;
  name: string;
  rarity?: string;
  maxPremium?: string;
  notiType: string;
  notiId: string;
  ownerId: string;
}

interface User {
  _id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  subscriptionIds: string[];
  favItemIds: string[];
  favListingIds: string[];
}

interface TransactionMetadata {
  market: string;
  assetId: string;
}

interface Transaction {
  _id: string;
  metadata: TransactionMetadata;
  name: string;
  createdAt: Date;
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
