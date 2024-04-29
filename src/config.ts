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

export const ErrorCode = {
  SUCCESS: 200,
  ERROR: 500,
  SERVER_ERROR: 600,
  INVALID_PARAMS: 400,

  ERROR_AUTH_CHECK_TOKEN_EXPIRED: 10001,
  ERROR_INVALID_AUTH_HEADER: 10002,
  ERROR_USER_NOT_EXIST: 10003,
  ERROR_USER_WRONG_PWD: 10004,
  ERROR_AUTH_CHECK_TOKEN_FAIL: 10005,
  ERROR_AUTH_CHECK_ROLE_FAIL: 10006,
};

export const CurrencyConfig = {
  defaultCurrency: "RMB",
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
