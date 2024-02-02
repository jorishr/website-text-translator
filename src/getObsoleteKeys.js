import log from "./utils/log/log.js";
import { config } from "../bin/commander/setConfig.js";

export default (langData, docList) => {
  const textNodeId = config.id.textNodeId;
  const { altId, titleId, placeholderId, metaId } = config.id.attributeTextId;
  const keysInLangData = Object.keys(langData);
  const obsoleteKeys = [];
  keysInLangData.forEach((key) => {
    let res = true;
    for (let i = 0; i < docList.length; i++) {
      const textElems = checkTextElems(docList[i], textNodeId, key);
      const otherElems = docList[i].querySelectorAll(
        `[${altId}=${key}], [${titleId}=${key}], [${placeholderId}=${key}], [${metaId}=${key}]`
      );
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
  if (obsoleteKeys.length) {
    log("obsoleteKeys", "info", [obsoleteKeys]);
  }
  return obsoleteKeys;
};

function checkTextElems(docList, textNodeId, key) {
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
