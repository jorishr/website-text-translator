import log from "../utils/log/log.js";
import { config } from "../../bin/commander/config/setConfig.js";

/**
 * Update specified text values or attribute text values in the given data based on the type of target.
 *
 * @param {Array} keys - An array of keys to identify elements in the working data.
 * @param {Object} data - The working data object to be updated.
 *  @property {object} htmlData - The object representing HTML data
 *  @property {object} langData - The object representing base language data
 * @param {string} target - The target type to determine which type of element to update.
 * @returns {Object} - The updated data object.
 */
export default (keys, data, target) => {
  const textNodeId = config.id.textNodeId;
  const { altId, titleId, placeholderId, metaId } = config.id.attributeTextId;
  let result = null;
  if (!keys.length) return data;

  keys.forEach((key) => {
    console.log(target);
    switch (target) {
      case "textNodeElems":
        result = setText(data, target, key, textNodeId);
        break;
      case "altAttributeElems":
        result = setAttr(data, target, key, altId);
        break;
      case "titleAttributeElems":
        result = setAttr(data, target, key, titleId);
        break;
      case "placeholderAttributeElems":
        result = setAttr(data, target, key, placeholderId);
        break;
      case "metaAttributeElems":
        result = setAttr(data, target, key, metaId);
        break;
      default:
        log("textUpdateException", "error");
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
 * @param {string} textNodeId - The ID used to identify elements in the target.
 * @returns {Object} - The updated data object.
 */
function setText(data, target, key, textNodeId) {
  const textUpdateDirection = config.textUpdateDirection || "default";
  const textElems = data.htmlData[target];
  let childNodeIndex = null;
  const elem = textElems.find((elem) => {
    const textIdArr = JSON.parse(elem.getAttribute(textNodeId));
    for (let i = 0; i < textIdArr.length; i++) {
      if (textIdArr[i] === key) {
        childNodeIndex = i;
        return elem;
      }
    }
  });
  const textNodes = elem.childNodes.filter(
    (node) => node.nodeType === 3 && node.textContent.trim().length
  );
  if (textUpdateDirection === "jsonToHtml") {
    textNodes[childNodeIndex].textContent = data.langData[key];
  }
  if (textUpdateDirection === "default") {
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
  const textUpdateDirection = config.textUpdateDirection || "default";
  let name = id.split("__").at(-1); //alt, title, meta
  if (name === "meta") name = "content";

  const elem = attrElems.find((elem) => {
    return elem.getAttribute(id) === key;
  });
  if (textUpdateDirection === "json2html") {
    elem.setAttribute(name, data.langData[key]);
  }
  if (textUpdateDirection === "default") {
    data.langData[key] = elem.getAttribute(name);
  }
  return data;
}
