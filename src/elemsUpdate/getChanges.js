import log from "../utils/log/log.js";

/**
 * Get the keys of elements that need updates based on changes in the provided target.
 *
 * @param {object} data - The working data object
 *  @property {object} htmlData - The object representing HTML data
 *  @property {object} langData - The object representing base language data
 * @param {string} target - The target html element type ("txtElems", "altAttrElems", etc.).
 * @param {object} config - The configuration object.
 * @returns {string[]} An array containing the keys of elements that need updates.
 */
export default (data, target, config) => {
  // text id's to process, example id {"txtId": "data-txt_id"}
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  const elems = data.htmlData[target];
  const keysToUpdate = [];

  log("getTxtChanges", "info", config, [target]);

  elems.forEach((elem) => {
    let targetKey = null;

    switch (target) {
      case "txtElems":
        const keyArr = hasTxtKeyChanged(elem, data, txtId, config);

        if (keyArr.length) {
          keyArr.forEach((key) => keysToUpdate.push(key));
        }
        break;

      case "altAttrElems":
        targetKey = hasAttrKeyChanged(elem, data, altId, config);

        if (targetKey) keysToUpdate.push(targetKey);
        break;

      case "titleAttrElems":
        targetKey = hasAttrKeyChanged(elem, data, titleId, config);
        if (targetKey) keysToUpdate.push(targetKey);
        break;

      case "plchldrAttrElems":
        targetKey = hasAttrKeyChanged(elem, data, plchldrId, config);
        if (targetKey) keysToUpdate.push(targetKey);
        break;

      case "metaElems":
        targetKey = hasAttrKeyChanged(elem, data, metaId, config);
        if (targetKey) keysToUpdate.push(targetKey);
        break;

      default:
        log("getTxtChangesException", "error", config);
    }
  });

  if (!keysToUpdate.length) {
    log("noChangesFound", "info", config, [target]);
  } else return keysToUpdate;
};

/**
 * Check if text keys have changed for a given HTML element.
 *
 * @param {Element} elem - The HTML element to check for text key changes.
 * @returns {string[]} An array containing the keys of text elements that have changed.
 */
function hasTxtKeyChanged(elem, data, txtId, config) {
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
        log("txtChange", "info", config, [txtIdArr[i]]);
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
 * @returns {string} A string containing the key of the attribute that has changed.
 */
function hasAttrKeyChanged(elem, data, attrId, config) {
  const id = elem.getAttribute(attrId); // string, e.g "100"
  const name = attrId.split("__").at(-1); // e.g "data-txt_id__title" -> "title"

  let target = name;
  if (name === "meta") target = "content";

  if (
    elem.getAttribute(target).trim().replace(/\s\s/g, "") !== data.langData[id]
  ) {
    log("attrChange", "info", config, [name, id]);
    return id;
  }
  return null;
}
