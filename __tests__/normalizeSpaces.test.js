import { normalizeSpaces } from "../src/utils/normalizeSpaces";

describe("normalizeSpaces function", () => {
  it.each([
    [[" hello"], ["hola"], [" hola"]],
    [["hello "], ["hola"], ["hola "]],
    [[" hello "], ["hola"], [" hola "]],
    [["hello"], ["hola"], ["hola"]],
  ])(
    "should adjust leading and trailing spaces",
    (original, translated, expected) => {
      const result = normalizeSpaces(original, translated);
      expect(result).toEqual(expected);
    }
  );
});
