import config from "../config.json" assert { type: "json" };
import log from "../utils/log/log.js";

export default (data, target) => {
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  const elems = data.htmlData[target];
  const keysToUpdate = [];
  log("getTxtChanges", "info", [target]);
  elems.forEach((elem) => {
    let key = null;
    switch (target) {
      case "txtElems":
        const keyArr = hasTxtKeyChanged(elem, txtId, data);
        if (keyArr.length > 0) {
          keyArr.forEach((key) => keysToUpdate.push(key));
        }
        break;

      case "altAttrElems":
        key = hasAttrKeyChanged(elem, altId, data);
        if (key) keysToUpdate.push(key);
        break;

      case "titleAttrElems":
        key = hasAttrKeyChanged(elem, titleId, data);
        if (key) keysToUpdate.push(key);
        break;

      case "plchldrAttrElems":
        key = hasAttrKeyChanged(elem, plchldrId, data);
        if (key) keysToUpdate.push(key);
        break;

      case "metaElems":
        key = hasAttrKeyChanged(elem, metaId, data);
        if (key) keysToUpdate.push(key);
        break;

      default:
        log("getTxtChangesException", "error");
    }
  });
  if (keysToUpdate.length === 0) {
    log("noChangesFound", "info", [target]);
  }
  return keysToUpdate;
};

function hasTxtKeyChanged(elem, txtId, data) {
  const idArr = eval(elem.getAttribute(txtId));
  const textNodes = elem.childNodes.filter(
    (node) => node.nodeType === 3 && node.textContent.trim() !== ""
  );
  const result = [];
  for (let i = 0; i < idArr.length; i++) {
    const text = textNodes[i].textContent
      .replace(/[\t\n\r]+/g, "")
      .replace(/\s{2,}/g, " ");
    const txtInJson = data.langData[idArr[i]];
    if (txtInJson) {
      if (text.trim() !== txtInJson.trim()) {
        log("txtChange", "info", [idArr[i]]);
        result.push(idArr[i]);
      }
    }
  }
  return result;
}

function hasAttrKeyChanged(elem, attrId, data) {
  const id = elem.getAttribute(attrId); // a "number"
  const name = attrId.split("__").at(-1); // alt, title, meta

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
