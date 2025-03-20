import { formatCityName } from "../src/client/js/app";

describe("Testing formatCityName function", () => {
  it("encodes spaces as %20", () => {
    expect(formatCityName("New York")).toBe("New%20York");
    expect(formatCityName("Saudi Arabia")).toBe("Saudi%20Arabia");
  });

  it("encodes special characters correctly", () => {
    expect(formatCityName("Château")).toBe("Ch%C3%A2teau");
    expect(formatCityName("São Paulo")).toBe("S%C3%A3o%20Paulo");
    expect(formatCityName("München")).toBe("M%C3%BCnchen");
  });

  it("returns the same string if no encoding is needed", () => {
    expect(formatCityName("Tokyo")).toBe("Tokyo");
    expect(formatCityName("Berlin")).toBe("Berlin");
  });
});
