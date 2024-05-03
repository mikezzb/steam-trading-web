import { createTheme } from "@mui/material/styles";

const ApiProdConfig = {
  url: "http://localhost:8080/api",
  itemPageSize: 20,
  staleTime: 1000 * 60 * 1, // 1 minute
  gcTime: 1000 * 60 * 5, // 5 minutes
};

const ApiTestConfig = {
  url: "http://localhost:8080/api",
  itemPageSize: 20,
  staleTime: 1000 * 1,
  gcTime: 1000 * 1,
};

export const ApiConfig =
  process.env.NODE_ENV === "production" ? ApiProdConfig : ApiTestConfig;

export const AppConfig = {
  url: "http://localhost:3000",
  name: "CS2 Trade",
  description:
    "cs2 items trade, cs2 skins trade, cs2 cheap skins, cs2 skins store, cs2 skins float ranking, cs2 skins inspect,skins trading platform",
};

export const UIConfig = {
  snackbarHideDuration: 3000,
};

export const CurrencyConfig = {
  defaultCurrency: "USD",
  listPriceCurrency: "CNY",
  exchangeRate: {
    USD: 1,
    CNY: 7.25,
    EUR: 0.93,
    JPY: 158.3,
  },
};

export const CurrencySymbol: Record<string, string> = {
  USD: "$",
  CNY: "¥",
  EUR: "€",
  JPY: "¥",
};

export const ItemGridConfig = {
  itemWidth: 300,
  itemHeight: 330,
};

export const UiConfig = {
  sideBarWidth: 292,
  headerHeight: 64,
  itemGap: 2,
  pagePadding: 40,
};

export const protectedRoutes = ["/items"];

export const ItemsQueryParams = ["name", "category", "skin", "exterior"];

export const TransactionQueryDays = [7, 30, 60, 90];

export const TransactionQueryDaysLabel = ["1W", "1M", "2M", "3M"];
