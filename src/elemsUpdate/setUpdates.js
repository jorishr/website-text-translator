import log from "../utils/log/log.js";
import { config } from "../../bin/commander/setConfig.js";

/**
 * Update specified text values or attribute values in the given data based on the target.
 *
 * @param {Array} keys - An array of keys to identify elements in the working data.
 * @param {Object} data - The working data object to be updated.
 *  @property {object} htmlData - The object representing HTML data
 *  @property {object} langData - The object representing base language data
 * @param {string} target - The target type to determine which type of element to update.
 * @returns {Object} - The updated data object.
 */
export default (keys, data, target) => {
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  let result = null;
  if (!keys.length) return data;

  keys.forEach((key) => {
    switch (target) {
      case "txtElems":
        result = setText(data, target, key, txtId);
        break;
      case "altAttrElems":
        result = setAttr(data, target, key, altId);
        break;
      case "titleAttrElems":
        result = setAttr(data, target, key, titleId);
        break;
      case "plchldrAttrElems":
        result = setAttr(data, target, key, plchldrId);
        break;
      case "metaElems":
        result = setAttr(data, target, key, metaId);
        break;
      default:
        log("txtUpdateException", "error");
        result = data;
    }
  });
  return result;
};

/**
 * Set text content in the specified data based on the target element and text * update direction set in the config file.
 *
 * @param {Object} data - The working data object to be updated.
 *  @property {object} htmlData - The object representing HTML data
 *  @property {object} langData - The object representing base language data
 * @param {string} target - The target type to determine which type of element to update.
 * @param {string} key - The key to identify the element in the data.
 * @param {string} txtId - The ID used to identify elements in the target.
 * @returns {Object} - The updated data object.
 */
function setText(data, target, key, txtId) {
  const txtUpdateDirection = config.textUpdateDirection || "default";
  const txtElems = data.htmlData[target];
  let childNodeIndex = null;
  const elem = txtElems.find((elem) => {
    const txtIdArr = JSON.parse(elem.getAttribute(txtId));
    for (let i = 0; i < txtIdArr.length; i++) {
      if (txtIdArr[i] === key) {
        childNodeIndex = i;
        return elem;
      }
    }
  });
  const textNodes = elem.childNodes.filter(
    (node) => node.nodeType === 3 && node.textContent.trim().length
  );
  if (txtUpdateDirection === "jsonToHtml") {
    textNodes[childNodeIndex].textContent = data.langData[key];
  }
  if (txtUpdateDirection === "default") {
    data.langData[key] = textNodes[childNodeIndex].textContent
      .replace(/[\t\n\r]+/g, "")
      .replace(/\s{2,}/g, " ");
  }
  return data;
}

/**
 * Set attribute text value in the specified data based on the target element
 * and text update direction set in the config file.
 *
 * @param {Object} data - The working data object to be updated.
 *  @property {object} htmlData - The object representing HTML data
 *  @property {object} langData - The object representing base language data
 * @param {string} target - The target type to determine which type of element to update.
 * @param {string} key - The key to identify the element in the data.
 * @param {string} id - The ID used to identify elements in the target.
 * @returns {Object} - The updated data object.
 */
function setAttr(data, target, key, id) {
  const attrElems = data.htmlData[target];
  const txtUpdateDirection = config.txtUpdateDirection || "default";
  let name = id.split("__").at(-1); //alt, title, meta
  if (name === "meta") name = "content";

  const elem = attrElems.find((elem) => {
    return elem.getAttribute(id) === key;
  });
  if (txtUpdateDirection === "json2html") {
    elem.setAttribute(name, data.langData[key]);
  }
  if (txtUpdateDirection === "default") {
    data.langData[key] = elem.getAttribute(name);
  }
  return data;
}
