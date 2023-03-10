import log from "../utils/log/log.js";

export default (data, offset, config) => {
  const newElements = data.htmlData.newElements;
  data.newKeys = [];
  if (!newElements.length) return data;
  log("newElemsStart", "start1", config);
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  const newKeys = [];
  let counter = Number(Object.keys(data.langData).at(-1)) + 1 || offset;
  if (!newElements.length) return data;
  for (let i = 0; i < newElements.length; i++) {
    if (newElements[i].hasAttribute("alt")) {
      const result = setAttr(newElements[i], data, counter, altId, config);
      data = result.data;
      counter = result.counter;
      newKeys.push(result.newKey);
    }
    if (newElements[i].hasAttribute("title")) {
      const result = setAttr(newElements[i], data, counter, titleId, config);
      data = result.data;
      counter = result.counter;
      newKeys.push(result.newKey);
    }
    if (newElements[i].hasAttribute("placeholder")) {
      const result = setAttr(newElements[i], data, counter, plchldrId, config);
      data = result.data;
      counter = result.counter;
      newKeys.push(result.newKey);
    }
    if (newElements[i].tagName === "META") {
      const result = setAttr(newElements[i], data, counter, metaId, config);
      data = result.data;
      counter = result.counter;
      newKeys.push(result.newKey);
    }
    if (newElements[i].childNodes.length) {
      let txt_id_arr = [];
      newElements[i].childNodes.forEach((node) => {
        //collapse all whitespace into a single space.
        const text = node.textContent
          .replace(/[\t\n\r]+/g, "")
          .replace(/\s{2,}/g, " ");
        if (node.nodeType === 3 && text.trim() !== "") {
          data.langData[counter] = text;
          newKeys.push(counter.toString());
          txt_id_arr.push(counter);
          counter++;
        }
      });
      if (txt_id_arr.length) {
        const txtIdTxt = `[${txt_id_arr}]`;
        newElements[i].setAttribute(txtId, txtIdTxt);
        log("txtAdded", "info", config, [
          [...txt_id_arr],
          newElements[i].tagName,
        ]);
      }
    }
  }
  data.newKeys.push(...newKeys);
  log("newElemsDone", "done", config);
  return data;
};

function setAttr(elem, data, counter, attrId, config) {
  const newKey = counter.toString();
  const name = attrId.split("__").at(-1); // alt, title, meta, placeholder
  let target = name;
  if (name === "meta") target = "content";

  data.langData[counter] = elem.getAttribute(target);
  elem.setAttribute(attrId, newKey);
  log("attrAdded", "info", config, [attrId, newKey, elem.tagName]);
  counter++;
  return { data, counter, newKey };
}
