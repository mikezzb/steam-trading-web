import { fetchData } from "./utils";
import { formatItemData, formatItemsData } from "./format";
import { ItemData, ItemDataDTO, ItemsData, ItemsDataDTO } from "@/types/apis";
import { UserDTO } from "@/types/dtos";

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
  const searchParams = new URLSearchParams(params);
  const endpoint = `${ApiRoutes.items}?${searchParams}`;
  const data = await fetchData<ItemsDataDTO>(endpoint);
  return formatItemsData(data);
};

export const getItemPreviewUrl = (itemId: string) => {
  return `/images/previews/${itemId}.png`;
};

export const getBuffIds = async () => {
  // HTTP GET on a json file
  const endpoint = "public/data/buff/buffids.json";
  return fetchData<Record<string, number>>(endpoint, {}, "force-cache");
};

export const getUserByToken = async () => {
  const endpoint = `${ApiRoutes.auth}`;
  return fetchData<UserDTO>(endpoint);
};

type LoginForm = {
  email: string;
  password: string;
};

export const login = async (body: LoginForm) => {
  const endpoint = `${ApiRoutes.auth}`;
  return fetchData<UserDTO>(endpoint, { body, method: "POST" }, "no-cache");
};

type SignUpForm = {
  username: string;
} & LoginForm;

export const signup = async (body: SignUpForm) => {
  const endpoint = `${ApiRoutes.users}`;
  return fetchData<UserDTO>(endpoint, { body, method: "POST" }, "no-cache");
};
