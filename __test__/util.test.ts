import { decodeItemName } from "../src/utils/cs";

describe("decodeItemName", () => {
  it("should correctly decode a properly formatted item name", () => {
    const result = decodeItemName("AK-47 | Redline (Field-Tested)");
    expect(result).toEqual({
      name: "AK-47",
      skin: "Redline",
      exterior: "Field-Tested",
    });
  });

  it("should return null for item names that do not follow the expected format", () => {
    expect(decodeItemName("Incorrect Format Name")).toBeNull();
  });

  it("should return null for empty strings", () => {
    expect(decodeItemName("")).toBeNull();
  });

  it("should handle item names with minimal characters", () => {
    const result = decodeItemName("A | B (C)");
    expect(result).toEqual({
      name: "A",
      skin: "B",
      exterior: "C",
    });
  });

  it("should handle item names with extra spaces correctly", () => {
    const result = decodeItemName("  AK-47  |  Redline  (Field-Tested)  ");
    expect(result).toEqual({
      name: "  AK-47  ",
      skin: "  Redline  ",
      exterior: "Field-Tested",
    });
  });
});
