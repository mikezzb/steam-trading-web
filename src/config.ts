import { createTheme } from "@mui/material/styles";

export const ApiConfig = {
  url: "http://localhost:8080/api",
  itemPageSize: 20,
  staleTime: 1000 * 60 * 1,
};

export const AppConfig = {
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
  itemHeight: 400,
};

export const UiConfig = {
  sideBarWidth: 292,
  headerHeight: 64,
  itemGap: 10,
};
