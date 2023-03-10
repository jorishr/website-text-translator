import filterElem from "./filter.js";

export default (root, config) => {
  return root
    .querySelectorAll(config.elements.selectors)
    .filter((elem) => filterElem(elem, config));
};
