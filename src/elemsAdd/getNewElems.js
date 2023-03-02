import config from "../config.json" assert { type: "json" };
import filterElem from "./filter.js";

export default (root) => {
  return root
    .querySelectorAll(config.selectors)
    .filter((elem) => filterElem(elem));
};
