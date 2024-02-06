import log from "./utils/log/log.js";
import { config } from "../bin/commander/config/setConfig.js";

/**
 * Identifies obsolete keys in the language data based on a list of documents.
 *
 * @param {Object} langData - The language data object containing key-value pairs.
 * @param {Element[]} docList - An array of HTML documents to search for language keys.
 * @returns {string[]} - An array of obsolete keys found in the language data.
 *
 */
export default (langData, docList) => {
  const customKeys = config.customKeys;
  const textNodeId = config.id.textNodeId;
  const { altId, titleId, placeholderId, metaId } = config.id.attributeTextId;
  const keysInLangData = Object.keys(langData);
  const obsoleteKeys = [];

  log("obsoleteKeysStart", "logStartTask2");

  keysInLangData.forEach((key) => {
    let res = true;
    for (let i = 0; i < docList.length; i++) {
      const textElems = getTextElems(docList[i], textNodeId, key);
      const otherElems = docList[i].querySelectorAll(
        `[${altId}=${key}], [${titleId}=${key}], [${placeholderId}=${key}], [${metaId}=${key}]`
      );
      if (customKeys.length > 0 && customKeys.includes(key)) {
        res = false;
        break;
      }
      if (textElems.length || otherElems.length) {
        res = false;
        break;
      }
    }
    //if key was not found in any of the docList elements, it is obsolete
    if (res === true) {
      obsoleteKeys.push(key);
    }
  });
  if (obsoleteKeys.length > 0) {
    log("obsoleteKeysFound", "info", [...obsoleteKeys]);
  } else log("obsoleteKeysNoneFound", "done");
  return obsoleteKeys;
};

function getTextElems(docList, textNodeId, key) {
  //should only return elements that don't have the key in their textNodeId
  const textElems = docList.querySelectorAll(`[${textNodeId}]`);
  const res = textElems.filter((elem) => {
    const idArr = JSON.parse(elem.getAttribute(textNodeId));
    for (let i = 0; i < idArr.length; i++) {
      if (idArr[i].toString() === key) {
        return true;
      }
    }
    return false;
  });
  return res;
}
