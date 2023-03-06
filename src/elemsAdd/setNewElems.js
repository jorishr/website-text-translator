import config from "../config.json" assert { type: "json" };
import log from "../utils/log/log.js";

export default (data, offset) => {
  const newElements = data.htmlData.newElements;
  data.newKeys = [];
  if (newElements.length === 0) return data;
  log("newElemsStart", "start1");
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  const newKeys = [];
  let counter = Number(Object.keys(data.langData).at(-1)) + 1 || offset;
  if (newElements.length === 0) return data;
  for (let i = 0; i < newElements.length; i++) {
    if (newElements[i].hasAttribute("alt")) {
      const result = setAttr(newElements[i], data, counter, altId);
      data = result.data;
      counter = result.counter;
      newKeys.push(result.newKey);
    }
    if (newElements[i].hasAttribute("title")) {
      const result = setAttr(newElements[i], data, counter, titleId);
      data = result.data;
      counter = result.counter;
      newKeys.push(result.newKey);
    }
    if (newElements[i].hasAttribute("placeholder")) {
      const result = setAttr(newElements[i], data, counter, plchldrId);
      data = result.data;
      counter = result.counter;
      newKeys.push(result.newKey);
    }
    if (newElements[i].tagName === "META") {
      const result = setAttr(newElements[i], data, counter, metaId);
      data = result.data;
      counter = result.counter;
      newKeys.push(result.newKey);
    }
    //run when there is just one child node and that node is a text node
    //todo: review this first part: which elements would be targeted here? Why not just the loop as in the second part?
    if (
      newElements[i].childNodes.length === 1 &&
      newElements[i].childNodes[0].nodeType === 3
    ) {
      data.langData[counter] = newElements[i].textContent
        .trim()
        .replace(/\s\s/g, "");
      const txtIdTxt = `[${counter}]`;
      newElements[i].setAttribute(txtId, txtIdTxt);
      newKeys.push(counter.toString());
      log("txtAdded", "info", [counter, newElements[i].tagName]);
      counter++;
    }
    if (newElements[i].childNodes.length > 1) {
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
      const txtIdTxt = `[${txt_id_arr}]`;
      newElements[i].setAttribute(txtId, txtIdTxt);
      log("txtAdded", "info", [[...txt_id_arr], newElements[i].tagName]);
    }
  }
  data.newKeys.push(...newKeys);
  log("newElemsDone", "done");
  return data;
};

function setAttr(elem, data, counter, attrId) {
  const newKey = counter.toString();
  const name = attrId.split("__").at(-1); // alt, title, meta, placeholder
  let target = name;
  if (name === "meta") target = "content";

  data.langData[counter] = elem.getAttribute(target);
  elem.setAttribute(attrId, newKey);
  log("attrAdded", "info", [attrId, newKey, elem.tagName]);
  counter++;
  return { data, counter, newKey };
}
