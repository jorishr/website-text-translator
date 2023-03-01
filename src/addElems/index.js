import filterElem from "./filter.js";

export default (root) => {
  return root
    .querySelectorAll(
      "head meta[name=description], head meta[name=keywords], head title, h1, h2, h3, h4, h5, h6, p, span, a, img, strong, em"
    )
    .filter((elem) => filterElem(elem));
};
