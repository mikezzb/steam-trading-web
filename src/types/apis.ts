type ResPayload<T = any> = {
  code: number;
  data: T;
  msg: string;
};

type FetchParams = {
  method?: string;
  body?: any;
  headers?: any;
  token?: string;
};

type DataWithPaging<T> = {
  total: number;
} & T;

type ItemsData = DataWithPaging<{
  items: Item[];
}>;
