import {
  ItemDTO,
  ListingDTO,
  SubscriptionDTO,
  TransactionDTO,
  UserDTO,
} from "./dtos";
import { Item, Listing, Subscription, Transaction } from "./transformed";

export type ResPayload<T = any> = {
  code: number;
  data: T;
  msg: string;
};

export type FetchParams = {
  method?: string;
  body?: any;
  headers?: any;
  token?: string;
};

export type DataWithPaging<T = {}> = {
  total: number;
  page: number;
  pageSize: number;
} & T;

export type ItemsDataDTO = DataWithPaging<{
  items: ItemDTO[];
}>;

export type ItemsData = DataWithPaging<{
  items: Item[];
}>;

export type ItemDataDTO = {
  item: ItemDTO;
};

export type ItemData = {
  item: Item;
};

export type ListingsDataDTO = DataWithPaging<{
  listings: ListingDTO[];
}>;

export type ListingsData = DataWithPaging<{
  listings: Listing[];
}>;

export type TransactionDaysDataDTO = {
  transactions: TransactionDTO[];
};

export type SubscriptionDataDTO = {
  subscriptions: SubscriptionDTO[];
};

export type SubscriptionData = {
  subscriptions: Subscription[];
};

export type TransactionDaysData = {
  transactions: Transaction[];
};

export type TransactionPageDataDTO = {
  transactions: TransactionDTO[];
};

export type TransactionPageData = {
  transactions: Transaction[];
};

export type CheckAuthDataDTO = {
  user: UserDTO;
};

export type LoginDataDTO = {
  token: string;
} & CheckAuthDataDTO;

export type SignUpDataDTO = {} & LoginDataDTO;

export type ItemFiltersDataDTO = {
  filters: {
    category: string[];
    skin: string[];
    exterior: string[];
    name: string[];
  };
};
