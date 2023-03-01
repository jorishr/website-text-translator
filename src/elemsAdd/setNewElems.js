import config from "../config.json" assert { type: "json" };

export default (data, offset) => {
  console.log(`Start processing new HTML elements...\n`);
  const { txtId, altId, titleId, metaId } = config.id;
  const newElements = data.htmlData.newElements;
  const newKeys = [];
  let counter = Number(Object.keys(data.langData).at(-1)) + 1 || offset;
  data["newKeys"] = [];
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
    if (newElements[i].tagName === "META") {
      const result = setAttr(newElements[i], data, counter, metaId);
      data = result.data;
      counter = result.counter;
      newKeys.push(result.newKey);
    }
    //run when there is just one child node and that node is a text node
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
      console.log(
        `Added txt-id ${counter} to ${newElements[i].tagName} element`
      );
      counter++;
    }
    if (newElements[i].childNodes.length > 1) {
      let txt_id_arr = [];
      newElements[i].childNodes.forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim().length !== 0) {
          data.langData[counter] = node.textContent.trim().replace(/\s\s/g, "");
          newKeys.push(counter.toString());
          txt_id_arr.push(counter);
          counter++;
        }
      });
      const txtIdTxt = `[${txt_id_arr}]`;
      newElements[i].setAttribute(txtId, txtIdTxt);
      console.log(
        `Added txt-id's ${[...txt_id_arr]} to ${
          newElements[i].tagName
        } element.`
      );
    }
  }
  console.log(`\nNew HTML element text strings processing completed.\n`);
  data.newKeys.push(...newKeys);
  return data;
};

function setAttr(elem, data, counter, attrId) {
  const type = attrId.split("__").at(-1); // alt, title, meta
  const target = type;
  const newKey = counter.toString();
  if (type === "meta") target = "content";

  data.langData[counter] = elem.getAttribute(target);
  elem.setAttribute(target, newKey);
  console.log(`Added txt-id__${type} ${newKey} to ${elem.tagName} element`);
  counter++;
  return { data, counter, newKey };
}
