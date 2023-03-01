import config from "../config.json" assert { type: "json" };

export default (data, offset) => {
  const { txtId, altId, titleId, metaId } = config.id;
  const newElements = data.htmlData.newElements;
  let counter = Number(Object.keys(data.langData).at(-1)) + 1 || offset;
  data["newKeys"] = [];
  if (newElements.length === 0) return data;
  const newKeys = [];
  console.log(`Start processing new HTML elements...\n`);
  for (let i = 0; i < newElements.length; i++) {
    if (newElements[i].hasAttribute("alt")) {
      data.langData[counter] = newElements[i].getAttribute("alt");
      newElements[i].setAttribute(altId, counter);
      newKeys.push(counter.toString());
      console.log(
        `Added txt-id__alt ${counter} to ${newElements[i].tagName} element`
      );
      counter++;
    }
    if (newElements[i].hasAttribute("title")) {
      data.langData[counter] = newElements[i].getAttribute("title");
      newElements[i].setAttribute(titleId, counter);
      newKeys.push(counter.toString());
      console.log(
        `Added txt-id__title ${counter} to ${newElements[i].tagName} element`
      );
      counter++;
    }
    if (newElements[i].tagName === "META") {
      data.langData[counter] = newElements[i].getAttribute("content");
      newElements[i].setAttribute(metaId, counter);
      newKeys.push(counter.toString());
      console.log(
        `Added txt-id__meta ${counter} to ${newElements[i].tagName} element`
      );
      counter++;
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
