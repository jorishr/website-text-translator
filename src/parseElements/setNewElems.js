import log from "../utils/log/log.js";
import { config } from "../../bin/commander/config/setConfig.js";

/**
 * Updates and modifies the provided data objects based on the attributes and text content of new HTML elements that were identified. It assigns unique keys based a counter that starts at keyCountOffset. For elements with text nodes, the id is an array-like string: "[100,101]" as an element may contain multiple unique text nodes. For elements with only attributes text values, e.g. "title" and or "alt", the id is number-like string: "103".
 *
 * @param {Object} data - The data object to be modified.
 *  @property {object} htmlData - The object representing HTML data
 *  @property {object} langData - The object representing base language data
 * @param {number} keyCountOffset - The starting value for the counter used to assign keys.
 * @returns {Object} The modified data object.
 */
export default (data) => {
  const newElements = data.htmlData.newElems;
  const textNodeId = config.id.textNodeId;
  const supportedAttributeList = config.elements.defaultAttributes;
  let counter = data.counter;
  const newKeys = [];
  data.newKeys = [];

  if (!newElements.length) return data;

  log("newElemsStart", "logStartTask1");

  for (let i = 0; i < newElements.length; i++) {
    const attributeList = Array.from(newElements[i].attributes).map(
      (attr) => attr.name
    );
    supportedAttributeList.forEach((attrName) => {
      if (attributeList.includes(attrName)) {
        const attributeTextId = config.id.attributeTextId[attrName + "Id"];
        const result = setAttr(newElements[i], data, counter, attributeTextId);
        data = result.data;
        counter = result.counter;
        newKeys.push(result.newKey);
      }
    });
    // evaluate element text nodes
    if (newElements[i].childNodes.length) {
      let textNodeIdArr = [];
      newElements[i].childNodes.forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim() !== "") {
          const normalizedText = node.textContent
            .replace(/[\t\n\r]+/g, "")
            .replace(/\s{2,}/g, " ");
          data.langData[counter] = normalizedText;
          newKeys.push(counter.toString());
          textNodeIdArr.push(counter);
          counter++;
        }
      });
      if (textNodeIdArr.length) {
        const textNodeIdStr = `[${textNodeIdArr}]`;
        newElements[i].setAttribute(textNodeId, textNodeIdStr);
        log("textAdded", "info", [[...textNodeIdArr], newElements[i].tagName]);
      }
    }
  }

  data.newKeys.push(...newKeys);
  data.counter = counter;

  log("newElemsDone", "done");

  return data;
};

/**
 * Sets a new attribute value for the specified element and updates the data object.
 *
 * @param {HTMLElement} elem - The HTML element to modify.
 * @param {object} data - The data object containing language data.
 * @param {number} counter - The counter value.
 * @param {string} attrId - AttributeTextId, e.g. "data-text_id__alt"
 * @returns {object} An object containing the updated data, counter, and the new attribute key.
 */
function setAttr(elem, data, counter, attrId) {
  const newKey = counter.toString();
  const name = attrId.split("__").at(-1); // alt, title, meta, placeholder
  let target = name;
  if (name === "meta") target = "content";

  data.langData[counter] = elem.getAttribute(target);
  elem.setAttribute(attrId, newKey);
  log("attrAdded", "info", [attrId, newKey, elem.tagName]);
  counter++;
  return { data, counter, newKey };
}
