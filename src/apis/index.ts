import { fetchData } from "./utils";

export const ApiRoutes = {
  items: "items",
  auth: "auth",
  users: "users",
};

export const getItem = (itemId: string) => {
  const endpoint = `${ApiRoutes.items}/${itemId}`;
  return fetchData<{ item: Item }>(endpoint);
};

export const getItems = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams(params);
  const endpoint = `${ApiRoutes.items}?${searchParams}`;
  return fetchData<ItemsData>(endpoint);
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
  return fetchData<User>(endpoint);
};

type LoginForm = {
  email: string;
  password: string;
};

export const login = async (body: LoginForm) => {
  const endpoint = `${ApiRoutes.auth}`;
  return fetchData<User>(endpoint, { body, method: "POST" }, "no-cache");
};

type SignUpForm = {
  username: string;
} & LoginForm;

export const signup = async (body: SignUpForm) => {
  const endpoint = `${ApiRoutes.users}`;
  return fetchData<User>(endpoint, { body, method: "POST" }, "no-cache");
};
