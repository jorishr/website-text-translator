import log from "./utils/log/log.js";

export default (langData, docList, config) => {
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  const keysInLangData = Object.keys(langData);
  const obsoleteKeys = [];
  keysInLangData.forEach((key) => {
    let res = true;
    for (let i = 0; i < docList.length; i++) {
      const txtElems = checkTxtElems(docList[i], txtId, key);
      const otherElems = docList[i].querySelectorAll(
        `[${altId}=${key}], [${titleId}=${key}], [${plchldrId}=${key}], [${metaId}=${key}]`
      );
      if (txtElems.length || otherElems.length) {
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
    log("obsoleteKeys", "info", config, [obsoleteKeys]);
  }
  return obsoleteKeys;
};

function checkTxtElems(docList, txtId, key) {
  //should only return elements that don't have the key in their txtId attribute array
  const txtElems = docList.querySelectorAll(`[${txtId}]`);
  const res = txtElems.filter((elem) => {
    const idArr = eval(elem.getAttribute(txtId));
    for (let i = 0; i < idArr.length; i++) {
      if (idArr[i].toString() === key) {
        return true;
      }
    }
    return false;
  });
  return res;
}
