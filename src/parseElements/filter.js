import { config } from "../../bin/commander/config/setConfig.js";

/**
 * Processes an HTML element to determine whether it should be included for further processing, based on specified criteria and configuration.
 *
 * @param {Element} elem - The HTML element to be processed.
 * @returns {boolean} - Returns true if the element should be included, otherwise false.
 *
 */
export default (elem) => {
  const textNodeId = config.id.textNodeId;
  const { altId, titleId, placeholderId, metaId } = config.id.attributeTextId;
  //custom exclusion filters
  const { classToExclude, idToExclude } = config.elements.exclude;
  const doExcludeClass = exclude(elem, "class", classToExclude);
  const doExcludeId = exclude(elem, "id", idToExclude);
  if (doExcludeClass) return false;
  if (doExcludeId) return false;

  //standard html element translation attribute
  const noTranslate = elem.getAttribute("translate");
  if (noTranslate === "no") return false;

  //exclude elements that already have a data-text_id attribute
  if (elem.hasAttribute(textNodeId)) {
    return false;
  }
  if (elem.hasAttribute(altId)) {
    if (elem.hasAttribute("title") && !elem.hasAttribute(titleId)) {
      //case: new title attribute was added to an existing element
      return true;
    }
    return false;
  }
  if (elem.hasAttribute(titleId)) {
    if (elem.hasAttribute("alt") && !elem.hasAttribute(altId)) {
      //case: new alt attribute was added to an existing element
      return true;
    }
    return false;
  }
  if (elem.hasAttribute(placeholderId)) {
    return false;
  }
  if (elem.hasAttribute(metaId)) {
    return false;
  }

  //exclude elements with no text, unless
  const hasValidTextNodes = validateTextNodes(elem);
  if (
    !hasValidTextNodes &&
    !elem.hasAttribute("alt") &&
    !elem.hasAttribute("title") &&
    !elem.hasAttribute("placeholder") &&
    elem.tagName !== "META"
  )
    return false;
  return true;
};

/**
 * Checks whether an element should be excluded based on exclusion type and an array of exclusion values.
 *
 * @param {Element} elem - The HTML element to be checked.
 * @param {string} type - The type of exclusion to perform. Possible values: 'class' or 'id'.
 * @param {string[]} arr - An array of values to check against for exclusion.
 * @returns {boolean} - Returns true if the element should be excluded, otherwise false.
 */
export function exclude(elem, type, arr) {
  switch (type) {
    case "class":
      let res = false;
      arr.forEach((str) => {
        if (elem.classList.contains(str)) {
          res = true;
        }
      });
      return res;
    case "id":
      return arr.includes(elem.id);
    default:
      return false;
  }
}

/**
 * Validates text nodes within an HTML element, checking at least one has valid text text.
 *
 * @param {Element} elem - The HTML element
 * @returns {boolean} - Returns true if at least one valid text node is found, otherwise false.
 *
 */
export function validateTextNodes(elem) {
  const textNodes = elem.childNodes.filter((elem) => elem.nodeType === 3);
  for (let i = 0; i < textNodes.length; i++) {
    const text = textNodes[i].textContent.trim();
    let isValid = true;
    if (text.length === 1) isValid = isLetter(textNodes[i]);
    if (text.length !== 0 && isValid) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a given string consists of only letters. Main purpose is to exclude non-translatable text like symbols or numbers.
 *
 * @param {string} str - The string to be checked for containing only letters.
 * @returns {boolean} - Returns true if the string contains only letters, otherwise false.
 */
export function isLetter(str) {
  // regex to exclude characters that are not translatable
  const regex = new RegExp(/^[a-zA-Z]+$/);
  return regex.test(str);
}
