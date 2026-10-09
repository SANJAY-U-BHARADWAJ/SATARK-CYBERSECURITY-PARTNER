import { dict } from "@/lib/translations";

describe("translations dictionary", () => {
  it("contains English and Hindi translations for primary navigation", () => {
    expect(dict["nav.overview"]).toBeDefined();
    expect(dict["nav.overview"].en).toBe("01. Overview");
    expect(dict["nav.overview"].hi).toBe("01. अवलोकन");
  });

  it("supports regional languages across primary actions", () => {
    expect(dict["nav.scamChecker"]).toBeDefined();
    expect(dict["nav.scamChecker"].kn).toBeDefined();
    expect(dict["nav.scamChecker"].ta).toBeDefined();
    expect(dict["nav.scamChecker"].te).toBeDefined();
  });
});
