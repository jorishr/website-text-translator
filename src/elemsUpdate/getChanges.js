import log from "../utils/log/log.js";

export default (data, target, config) => {
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  const elems = data.htmlData[target];
  const keysToUpdate = [];
  log("getTxtChanges", "info", config, [target]);
  elems.forEach((elem) => {
    let key = null;
    switch (target) {
      case "txtElems":
        const keyArr = hasTxtKeyChanged(elem, data, config);
        if (keyArr.length > 0) {
          keyArr.forEach((key) => keysToUpdate.push(key));
        }
        break;

      case "altAttrElems":
        key = hasAttrKeyChanged(elem, data, config.id.altId, config);
        if (key) keysToUpdate.push(key);
        break;

      case "titleAttrElems":
        key = hasAttrKeyChanged(elem, data, config.id.titleId, config);
        if (key) keysToUpdate.push(key);
        break;

      case "plchldrAttrElems":
        key = hasAttrKeyChanged(elem, data, config.id.plchldrId, config);
        if (key) keysToUpdate.push(key);
        break;

      case "metaElems":
        key = hasAttrKeyChanged(elem, data, config.id.metaId, config);
        if (key) keysToUpdate.push(key);
        break;

      default:
        log("getTxtChangesException", "error", config);
    }
  });
  if (keysToUpdate.length === 0) {
    log("noChangesFound", "info", config, [target]);
  }
  return keysToUpdate;
};

function hasTxtKeyChanged(elem, data, config) {
  const txtId = config.id.txtId;
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
        log("txtChange", "info", config, [idArr[i]]);
        result.push(idArr[i]);
      }
    }
  }
  return result;
}

function hasAttrKeyChanged(elem, data, attrId, config) {
  const id = elem.getAttribute(attrId); // a "number"
  const name = attrId.split("__").at(-1); // alt, title, meta

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
