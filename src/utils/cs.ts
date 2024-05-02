/**
 * Decode item name.
 * @param {string} itemFullName - The item name to decode.
 * @returns {CS2Item} Decoded item information or null if format is incorrect.
 * @example
 * decodeItemName("AK-47 | Redline (Field-Tested)");
 * // Returns { name: "AK-47", skin: "Redline", exterior: "Field-Tested" }
 */
export const decodeItemName = (itemFullName: string): CS2Item => {
  const match = itemFullName.match(/(.*?) \| (.*?) \((.*?)\)/);
  if (!match) {
    return { name: itemFullName, skin: "", exterior: "" };
  }

  const [_, name, skin, exterior] = match;
  return { name, skin, exterior };
};

export const getBuffUrl = (itemId: string) => {
  return `https://buff.163.com/goods/${itemId}?appid=730`;
};

export const getSteamMarketUrl = (itemName: string, gameId = "730") => {
  return `https://steamcommunity.com/market/listings/${gameId}/${itemName}`;
};
