import log from "../utils/log/log.js";

export default (keys, data, target, config) => {
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  let result = null;
  if (!keys.length) return data;

  keys.forEach((key) => {
    switch (target) {
      case "txtElems":
        result = setText(data, target, key, txtId, config);
        break;
      case "altAttrElems":
        result = setAttr(data, target, key, altId, config);
        break;
      case "titleAttrElems":
        result = setAttr(data, target, key, titleId, config);
        break;
      case "plchldrAttrElems":
        result = setAttr(data, target, key, plchldrId, config);
        break;
      case "metaElems":
        result = setAttr(data, target, key, metaId, config);
        break;
      default:
        log("txtUpdateException", "error", config);
        result = data;
    }
  });
  return result;
};

function setText(data, target, key, txtId, config) {
  const txtUpdateDirection = config.textUpdateDirection || "default";
  const txtElems = data.htmlData[target];
  let childNodeIndex = null;
  const elem = txtElems.find((elem) => {
    const idArr = eval(elem.getAttribute(txtId));
    for (let i = 0; i < idArr.length; i++) {
      if (idArr[i] === key) {
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

function setAttr(data, target, key, id, config) {
  const attrElems = data.htmlData[target];
  const direction = config.direction.direction || config.direction.default;
  let name = id.split("__").at(-1); //alt, title, meta
  if (name === "meta") name = "content";

  const elem = attrElems.find((elem) => {
    return elem.getAttribute(id) === key;
  });
  if (direction === "json2html") {
    elem.setAttribute(name, data.langData[key]);
  }
  if (direction === "html2json") {
    data.langData[key] = elem.getAttribute(name);
  }
  return data;
}
