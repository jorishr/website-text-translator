import { exclude } from "../src/parseData/filter.js";
import parser from "node-html-parser";

const parse = parser.parse;
const html = `<!DOCTYPE html
<html lang="en">
  <head>
    <meta charset="UTF-8" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0" >
  </head>
  <body>
    <p class="exclude1">Hello</p>
    <p id="exclude">Hello</p>
    <p id="exclude" class="exclude2">Hello</p>
    <p class="exclude2">Hello</p>
    <p class="include">Hello</p>
    <a class="include">Link</a>
  </body>
</html>`;

const root = parse(html);

describe("function to exclude element based on class or id", () => {
  const classToExclude = ["exclude1", "exclude2"];
  const idToExclude = ["exclude"];
  const elemsToExcludeByClass = root.querySelectorAll(".exclude1, .exclude2");
  const elemsToExcludeById = root.querySelectorAll("#exclude");
  const elemsToInclude = root.querySelectorAll(".include");

  test.each(elemsToExcludeByClass)(
    "Should return true if element contains a class from the exclusion array",
    (input) => {
      expect(exclude(input, "class", classToExclude)).toBe(true);
    }
  );
  test.each(elemsToExcludeById)(
    "Should return true if element contains an id from the id exclusion array",
    (input) => {
      expect(exclude(input, "id", idToExclude)).toBe(true);
    }
  );
  test.each(elemsToInclude)(
    "Should return false if element does not contain an id or class from the id or class exclusion array",
    (input) => {
      expect(exclude(input, "id", idToExclude)).toBe(false);
      expect(exclude(input, "class", classToExclude)).toBe(false);
    }
  );
});
