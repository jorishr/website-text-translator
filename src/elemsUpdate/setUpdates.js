import config from "../config.json" assert { type: "json" };

export default (keys, data, target) => {
  if (keys.length === 0) return data;
  const { txtId, altId, titleId, metaId } = config.id;
  let res = null;
  keys.forEach((key) => {
    switch (target) {
      case "txtElems":
        res = setText(data, target, key, txtId);
        break;
      case "altAttrElems":
        res = setAttr(data, target, key, altId);
        break;
      case "titleAttrElems":
        res = setAttr(data, target, key, titleId);
        break;
      case "metaElems":
        res = setAttr(data, target, key, metaId);
        break;
      default:
        return null;
    }
  });
  return res;
};

function setText(data, target, key, txtId) {
  const txtElems = data.htmlData[target];
  const direction = config.direction.direction || config.direction.default;
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
  //default direction is json over html
  const textNodes = elem.childNodes.filter(
    (node) => node.nodeType === 3 && node.textContent.trim().length > 0
  );
  if (direction === "json to html") {
    textNodes[childNodeIndex].textContent = data.langData[key];
  }
  if (direction === "html to json") {
    data.langData[key] = textNodes[childNodeIndex].textContent
      .trim()
      .replace(/\s\s+/g, "");
  }
  return data;
}

function setAttr(data, target, key, id) {
  const attrElems = data.htmlData[target];
  const direction = config.direction.direction || config.direction.default;
  let name = id.split("__")[1]; //alt, title, meta
  if (name === "meta") name = "content";

  const elem = attrElems.find((elem) => {
    return elem.getAttribute(id) === key;
  });
  if (direction === "json over html") {
    elem.setAttribute(name, data.langData[key]);
  }
  if (direction === "html over json") {
    data.langData[key] = elem.getAttribute(name);
  }
  return data;
}
