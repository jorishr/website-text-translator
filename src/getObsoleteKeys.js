import config from "./config.json" assert { type: "json" };

export default (data, docList) => {
  const { txtId, altId, titleId, metaId } = config.id;
  const keysInLangData = Object.keys(data.langData);
  const obsoleteKeys = [];
  keysInLangData.forEach((key) => {
    let res = true;
    for (let i = 0; i < docList.length; i++) {
      const txtElems = checkTxtElems(docList[i], txtId, key);
      const otherElems = docList[i].querySelectorAll(
        `[${altId}=${key}], [${titleId}=${key}], [${metaId}=${key}]`
      );
      if (txtElems.length > 0 || otherElems.length > 0) {
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
    console.log(
      `The following keys are obsolete and will be removed from the base JSON file: ${obsoleteKeys}\n`
    );
  }
  return obsoleteKeys;
};

function checkTxtElems(docList, txtId, key) {
  //should only return elements that don't have the key in their txtId attribute array
  const txtElems = docList.querySelectorAll(`[${txtId}]`);
  const res = txtElems.filter((elem) => {
    idArr = eval(elem.getAttribute(txtId));
    for (let i = 0; i < idArr.length; i++) {
      if (idArr[i].toString() === key) {
        return true;
      }
    }
    return false;
  });
  return res;
}
