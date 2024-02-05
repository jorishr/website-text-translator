import filterElem from "./filter.js";
import { config } from "../../bin/commander/config/setConfig.js";

/**
 * Module for selecting and processing HTML elements within a root element based on configuration options and filters.
 *
 * @param {Element} root - The root HTML element from which to start the selection.
 * @returns {Element[]} - An array of selected HTML elements that meet the specified criteria.
 *
 */
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
  return root
    .querySelectorAll(selectors.toString())
    .filter((elem) => filterElem(elem));
};
