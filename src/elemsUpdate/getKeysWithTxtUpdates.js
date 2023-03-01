import config from "../config.json" assert { type: "json" };

export default (data, target) => {
  const { txtId, altId, titleId, metaId } = config.id;
  const elems = data.htmlData[target];
  const keysToUpdate = [];
  console.log(`\nSearching for text changes in ${target}...\n`);
  elems.forEach((elem) => {
    let id = "";
    switch (target) {
      case "txtElems":
        idArr = eval(elem.getAttribute(txtId));
        const textNodes = elem.childNodes.filter(
          (node) => node.nodeType === 3 && node.textContent.trim().length > 0
        );
        for (let i = 0; i < idArr.length; i++) {
          if (
            textNodes[i].textContent.trim().replace(/\s\s/g, "") !==
            data.langData[idArr[i]]
          ) {
            console.log(`txt value for txt-id ${idArr[i]} has changed\n`);
            keysToUpdate.push(idArr[i]);
          }
        }
        break;
      case "altAttrElems":
        id = elem.getAttribute(altId);
        if (
          elem.getAttribute("alt").trim().replace(/\s\s/g, "") !==
          data.langData[id]
        ) {
          console.log(`txt value for alt attribute txt-id ${id} has changed\n`);
          keysToUpdate.push(id);
        }
        break;
      case "titleAttrElems":
        id = elem.getAttribute(titleId);
        if (
          elem.getAttribute("title").trim().replace(/\s\s/g, "") !==
          data.langData[id]
        ) {
          console.log(
            `txt value for title attribute txt-id ${id} has changed\n`
          );
          keysToUpdate.push(id);
        }
        break;
      case "metaElems":
        id = elem.getAttribute(metaId);
        if (
          elem.getAttribute("content").trim().replace(/\s\s/g, "") !==
          data.langData[id]
        ) {
          console.log(
            `Content value for meta tag with txt-id ${id} has changed\n`
          );
          keysToUpdate.push(id);
        }
    }
  });
  if (keysToUpdate.length === 0) {
    console.log(`No changes found in ${target}.\n`);
  }
  return keysToUpdate;
};
