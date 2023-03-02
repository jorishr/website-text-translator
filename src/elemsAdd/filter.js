import config from "../config.json" assert { type: "json" };

export default (elem) => {
  //NOTE: Order of the filters matters!
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  const { classesToExclude, idsToExclude } = config.exclude;
  const doExcludeClass = exclude(elem, "class", classesToExclude);
  const doExcludeId = exclude(elem, "id", idsToExclude);
  if (doExcludeClass) return false;
  if (doExcludeId) return false;

  //exclude elements with a standard html translate="no" attribute
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

  //exclude elements with no textContent
  const hasTextNodes = checkTextNodes(elem);
  if (
    !hasTextNodes &&
    !elem.hasAttribute("alt") &&
    !elem.hasAttribute("title") &&
    !elem.hasAttribute("placeholder") &&
    elem.tagName !== "META"
  )
    return false;

  //exclude elements with only one character that is not translatable
  const excludeChars = checkChars(elem);
  if (excludeChars) return false;

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
  for (let i = 0; i < elem.childNodes.length; i++) {
    if (
      elem.childNodes[i].nodeType === 3 &&
      elem.childNodes[i].textContent.trim().length !== 0 &&
      elem.childNodes[i].textContent.trim() !== "." &&
      elem.childNodes[i].innerText !== "&times;"
    ) {
      //tim, remove double spaces, remove newlines, tabs
      return true;
    }
  }
  return false;
}

//to-do: list is incomplete; find a better way to do this
function checkChars(elem) {
  const chars = [".", "!", "?", " ", "-", "—", "&mdash;", "&nbsp;", ":", ";"];
  for (let i = 0; i < chars.length; i++) {
    if (elem.textContent.trim().replace(/\s\s+/g, "") === chars[i]) {
      return true;
    }
  }
  return false;
}
