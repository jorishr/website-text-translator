import filterElem from "./filter.js";
import { config } from "../../bin/commander/config/setConfig.js";

export default (root) => {
  const defaultSelectors = config.elements.defaultSelectors;
  const selectorsToExclude = config.elements.exclude.defaultSelectorsToExclude;
  const selectorsToAdd = config.elements.addSelectors;
  let selectors = defaultSelectors;

  if (selectorsToExclude.length > 0) {
    selectors = defaultSelectors.filter(
      (selector) => !selectorsToExclude.includes(selector)
    );
  }
  if (selectorsToAdd.length > 0) {
    selectorsToAdd.forEach((selector) => selectors.push(selector));
  }
  console.log(selectors.toString());
  return root
    .querySelectorAll(selectors.toString())
    .filter((elem) => filterElem(elem));
};
