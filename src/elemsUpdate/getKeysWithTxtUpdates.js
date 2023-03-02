import config from "../config.json" assert { type: "json" };

export default (data, target) => {
  const { txtId, altId, titleId, metaId } = config.id;
  const elems = data.htmlData[target];
  const keysToUpdate = [];
  console.log(`\nSearching for text changes in ${target}...\n`);
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

      case "metaElems":
        key = hasAttrKeyChanged(elem, metaId, data);
        if (key) keysToUpdate.push(key);
        break;
    }
  });
  if (keysToUpdate.length === 0) {
    console.log(`No changes found in ${target}.\n`);
  }
  return keysToUpdate;
};

function hasTxtKeyChanged(elem, txtId, data) {
  const idArr = eval(elem.getAttribute(txtId));
  const textNodes = elem.childNodes.filter(
    (node) => node.nodeType === 3 && node.textContent.trim().length > 0
  );
  const result = [];
  for (let i = 0; i < idArr.length; i++) {
    if (
      textNodes[i].textContent.trim().replace(/\s\s/g, "") !==
      data.langData[idArr[i]]
    ) {
      console.log(`txt value for txt-id ${idArr[i]} has changed\n`);
      result.push(idArr[i]);
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
    console.log(`txt value for ${name} attribute txt-id ${id} has changed\n`);
    return id;
  }
  return null;
}
