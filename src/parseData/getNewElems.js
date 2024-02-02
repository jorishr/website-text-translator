import filterElem from "./filter.js";
import { config } from "../../bin/commander/setConfig.js";

export default (root) => {
  return root
    .querySelectorAll(config.elements.selectors)
    .filter((elem) => filterElem(elem));
};
