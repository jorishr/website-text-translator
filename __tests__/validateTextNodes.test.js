import { validateTextNodes } from "../src/parseElements/filter.js";
import parser from "node-html-parser";

const parse = parser.parse;
const html = `<!DOCTYPE html
<html lang="en">
  <head>
    <meta charset="UTF-8" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0" >
  </head>
  <body>
    <p class="valid">H</p>
    <p class="valid">Hello</p>
    <p class="valid">Hello!</p>
    <p class="valid">Hello <span>World</span>.</p>
    <p class="invalid">?</p>
    <p class="invalid">.</p>
    <p class="invalid"></p>
  </body>
</html>`;

const root = parse(html);

describe("validateTextNodes function", () => {
  const validElems = root.querySelectorAll(".valid");
  const invalidElems = root.querySelectorAll(".invalid");
  test.each(validElems)(
    "should return true if at least one text node contains valid text",
    (input) => {
      expect(validateTextNodes(input)).toBe(true);
    }
  );
  test.each(invalidElems)(
    "should return false if no text node contains valid text",
    (input) => {
      expect(validateTextNodes(input)).toBe(false);
    }
  );
});
