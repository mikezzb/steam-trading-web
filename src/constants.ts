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

export const CS_APPID = "730";
export const MarketKeys = ["igxe", "buff", "uu", "steam"];

export const BIG_DECIMAL_NULL = "0E-6176";
export const PRICE_MAX = "99999998";

export const CsExteriors = ["FN", "MW", "FT", "WW", "BS"];

export const ExteriorMap = {
  FN: "Factory New",
  MW: "Minimal Wear",
  FT: "Field-Tested",
  WW: "Well-Worn",
  BS: "Battle-Scarred",
};

export const CsExteriorsFull: string[] = CsExteriors.map(
  (exterior) => (ExteriorMap as any)[exterior]
);

export const MarketNames = {
  CS: "Counter-Strike 2",
};

export const BUFF_ITEM_PREVIEW_BASE_URL = "https://buff.163.com/goods";

export const PatternSeeds = {
  min: 1,
  max: 999,
};

export const SubNotiTypes: Record<
  string,
  {
    name: string;
    label: string;
    idHint: string;
  }
> = {
  telegram: {
    name: "telegram",
    label: "Telegram",
    idHint: "Telegram Chat ID",
  },
  email: {
    name: "email",
    label: "Email",
    idHint: "Email Address",
  },
};
