import { fetchData, removeEmptyParams, removeEmptyValues } from "./utils";
import { formatItemData, formatItemsData } from "./format";
import {
  CheckAuthDataDTO,
  ItemData,
  ItemDataDTO,
  ItemFiltersDataDTO,
  ItemsData,
  ItemsDataDTO,
  ListingsData,
  ListingsDataDTO,
  LoginDataDTO,
  SignUpDataDTO,
  TransactionDaysData,
  TransactionDaysDataDTO,
  TransactionPageData,
} from "@/types/apis";
import { SubscriptionDTO, UserDTO } from "@/types/dtos";
import { ItemFiltersData } from "@/types/transformed";

export const ApiRoutes = {
  items: "items",
  auth: "auth",
  users: "users",
  transactions: "transactions",
  listings: "listings",
  subscriptions: "subscriptions",
};

export const getItem = async (itemId: string) => {
  const endpoint = `${ApiRoutes.items}/${itemId}`;
  const data = await fetchData<ItemDataDTO>(endpoint);
  return formatItemData(data);
};

export const getItems = async (params: Record<string, any>) => {
  // Remove empty values from params
  removeEmptyValues(params);
  const searchParams = new URLSearchParams(params);
  const endpoint = `${ApiRoutes.items}?${searchParams}`;
  const data = await fetchData<ItemsDataDTO>(endpoint);
  return formatItemsData(data);
};

export const getBuffIds = async () => {
  // HTTP GET on a json file
  const endpoint = "/data/buff/buffids.json";
  // use normal fetch
  const response = await fetch(endpoint);
  // parse json
  return await response.json();
};

export const getUserByToken = async () => {
  const endpoint = `${ApiRoutes.auth}`;
  return fetchData<CheckAuthDataDTO>(endpoint);
};

export const getItemFilters = async (): Promise<ItemFiltersData> => {
  const endpoint = `${ApiRoutes.items}/filters`;
  return fetchData<ItemFiltersDataDTO>(endpoint);
};

type LoginForm = {
  email: string;
  password: string;
};

export const login = async (body: LoginForm) => {
  const endpoint = `${ApiRoutes.auth}`;
  return fetchData<LoginDataDTO>(
    endpoint,
    { body, method: "POST" },
    "no-cache"
  );
};

type SignUpForm = {
  username: string;
} & LoginForm;

export const signup = async (body: SignUpForm) => {
  const endpoint = `${ApiRoutes.users}`;
  return fetchData<SignUpDataDTO>(
    endpoint,
    { body, method: "POST" },
    "no-cache"
  );
};

// Owner ID will be set by the server from the token
type SubscribeItemForm = Omit<SubscriptionDTO, "_id" | "ownerId">;

export const subscribeItem = async (body: SubscribeItemForm) => {
  const endpoint = `${ApiRoutes.subscriptions}`;
  return fetchData<SubscriptionDTO>(endpoint, { body, method: "POST" });
};

export const getItemTransactionsByDays = async (
  item: string,
  numDays: number
): Promise<TransactionDaysData> => {
  const endpoint = `${ApiRoutes.transactions}?days=${numDays}&name=${item}`;
  return fetchData<TransactionDaysDataDTO>(endpoint);
};

export const getItemTransactionsByPage = async (
  item: string,
  page: number
): Promise<TransactionPageData> => {
  const endpoint = `${ApiRoutes.transactions}?page=${page}&name=${item}`;
  return fetchData<TransactionDaysDataDTO>(endpoint);
};

export const getItemListingsByPage = async (
  item: string,
  page: number
): Promise<ListingsData> => {
  const endpoint = `${ApiRoutes.listings}?page=${page}&name=${item}`;
  return fetchData<ListingsDataDTO>(endpoint);
};
