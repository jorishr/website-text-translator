import { isLetter } from "../src/parseData/filter.js";

describe("isLetter function", () => {
  const letterStrings = ["a", "A", "z", "Z", "ab"];
  const nonLetterStrings = ["123", "@", ".", "?", " ", "", "A123"];

  test.each(letterStrings)(
    "should return true for letter string: %s",
    (input) => {
      expect(isLetter(input)).toBe(true);
    }
  );

  test.each(nonLetterStrings)(
    "should return false for non-letter string: %s",
    (input) => {
      expect(isLetter(input)).toBe(false);
    }
  );
});
