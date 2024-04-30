import { ItemDTO } from "./dtos";
import { Item } from "./transformed";

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
