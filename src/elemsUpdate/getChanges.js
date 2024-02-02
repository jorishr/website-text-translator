import log from "../utils/log/log.js";
import { config } from "../../bin/commander/setConfig.js";

/**
 * Get the keys of elements that need updates based on changes in the provided target.
 *
 * @param {object} data - The working data object
 *  @property {object} htmlData - The object representing HTML data
 *  @property {object} langData - The object representing base language data
 * @param {string} target - The target html element type ("txtElems", "altAttrElems", etc.).
 * @returns {string[]} An array containing the keys of elements that need updates.
 */
export default (data, target) => {
  // text id's to process, example id {"txtId": "data-txt_id"}
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  const elems = data.htmlData[target];
  const keysToUpdate = [];

  log("getTxtChanges", "info", [target]);

  elems.forEach((elem) => {
    let targetKey = null;

    switch (target) {
      case "txtElems":
        const keyArr = hasTxtKeyChanged(elem, data, txtId);

        if (keyArr.length) {
          keyArr.forEach((key) => keysToUpdate.push(key));
        }
        break;

      case "altAttrElems":
        targetKey = hasAttrKeyChanged(elem, data, altId);

        if (targetKey) keysToUpdate.push(targetKey);
        break;

      case "titleAttrElems":
        targetKey = hasAttrKeyChanged(elem, data, titleId);
        if (targetKey) keysToUpdate.push(targetKey);
        break;

      case "plchldrAttrElems":
        targetKey = hasAttrKeyChanged(elem, data, plchldrId);
        if (targetKey) keysToUpdate.push(targetKey);
        break;

      case "metaElems":
        targetKey = hasAttrKeyChanged(elem, data, metaId);
        if (targetKey) keysToUpdate.push(targetKey);
        break;

      default:
        log("getTxtChangesException", "error");
    }
  });

  if (!keysToUpdate.length) {
    log("noChangesFound", "info", [target]);
    return [];
  } else return keysToUpdate;
};

/**
 * Check if text keys have changed for a given HTML element.
 *
 * @param {Element} elem - The HTML element to check for text key changes.
 * @param {string} txtId - Id to identify the target text.
 * @returns {string[]} An array containing the keys of text elements that have changed.
 */
function hasTxtKeyChanged(elem, data, txtId) {
  const result = [];
  const txtIdArr = JSON.parse(elem.getAttribute(txtId));
  const textNodes = elem.childNodes.filter(
    (node) => node.nodeType === 3 && node.textContent.trim() !== ""
  );

  for (let i = 0; i < txtIdArr.length; i++) {
    /*
      - normalize trailing spaces before comparison
      - changes in trailing spaces are ignored
    */
    const text = textNodes[i].textContent
      .replace(/[\t\n\r]+/g, "")
      .replace(/\s{2,}/g, " ");
    const compareValue = data.langData[txtIdArr[i]];
    if (compareValue) {
      if (text.trim() !== compareValue.trim()) {
        log("txtChange", "info", [txtIdArr[i]]);
        result.push(txtIdArr[i]);
      }
    }
  }
  return result;
}

/**
 * Check if an attribute key has changed for a given HTML element.
 *
 * @param {Element} elem - The HTML element to check for attribute key changes.
 * @param {string} attrId - Id to identify the target text.
 * @returns {string} A string containing the key of the attribute that has changed.
 */
function hasAttrKeyChanged(elem, data, attrId) {
  const id = elem.getAttribute(attrId); // string, e.g "100"
  const name = attrId.split("__").at(-1); // e.g "data-txt_id__title" -> "title"

  let target = name;
  if (name === "meta") target = "content";

  if (
    elem.getAttribute(target).trim().replace(/\s\s/g, "") !== data.langData[id]
  ) {
    log("attrChange", "info", [name, id]);
    return id;
  }
  return null;
}
