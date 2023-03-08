export default (elem, config) => {
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  //custom exclusion filters
  const { classesToExclude, idsToExclude } = config.elements.exclude;
  const doExcludeClass = exclude(elem, "class", classesToExclude);
  const doExcludeId = exclude(elem, "id", idsToExclude);
  if (doExcludeClass) return false;
  if (doExcludeId) return false;

  //standard html element translation attribute
  const noTranslate = elem.getAttribute("translate");
  if (noTranslate === "no") return false;

  //exclude elements that already have a data-txt_id attribute
  if (elem.hasAttribute(txtId)) {
    return false;
  }
  if (elem.hasAttribute(altId)) {
    if (elem.hasAttribute("title") && !elem.hasAttribute(titleId)) {
      //case: new title attribute was added to an existing element
      return true;
    }
    return false;
  }
  if (elem.hasAttribute(titleId)) {
    if (elem.hasAttribute("alt") && !elem.hasAttribute(altId)) {
      //case: new alt attribute was added to an existing element
      return true;
    }
    return false;
  }
  if (elem.hasAttribute(plchldrId)) {
    return false;
  }
  if (elem.hasAttribute(metaId)) {
    return false;
  }

  //exclude elements with no text, unless
  const hasTextNodes = checkTextNodes(elem);
  if (
    !hasTextNodes &&
    !elem.hasAttribute("alt") &&
    !elem.hasAttribute("title") &&
    !elem.hasAttribute("placeholder") &&
    elem.tagName !== "META"
  )
    return false;
  return true;
};

function exclude(elem, type, arr) {
  switch (type) {
    case "class":
      let res = false;
      arr.forEach((str) => {
        if (elem.classList.contains(str)) {
          res = true;
        }
      });
      return res;
    case "id":
      return arr.includes(elem.id);
    default:
      return false;
  }
}

function checkTextNodes(elem) {
  const textNodes = elem.childNodes.filter((elem) => elem.nodeType === 3);
  for (let i = 0; i < textNodes.length; i++) {
    const text = textNodes[i].textContent.trim();
    let isValid = true;
    if (text.length === 1) isValid = isLetter(textNodes[i]);
    if (text.length !== 0 && isValid) {
      return true;
    }
  }
  return false;
}

function isLetter(str) {
  //regex to exclude characters that are not translatable
  const regex = new RegExp(/^[a-zA-Z]+$/);
  return regex.test(str);
}
