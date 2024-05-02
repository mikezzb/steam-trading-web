import { fetchData, removeEmptyParams, removeEmptyValues } from "./utils";
import { formatItemData, formatItemsData } from "./format";
import {
  CheckAuthDataDTO,
  ItemData,
  ItemDataDTO,
  ItemFiltersDataDTO,
  ItemsData,
  ItemsDataDTO,
  LoginDataDTO,
  SignUpDataDTO,
} from "@/types/apis";
import { UserDTO } from "@/types/dtos";
import { ItemFiltersData } from "@/types/transformed";

export const ApiRoutes = {
  items: "items",
  auth: "auth",
  users: "users",
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
