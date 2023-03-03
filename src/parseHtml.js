import config from "./config.json" assert { type: "json" };
import parser from "node-html-parser";
import findNewElements from "./elemsAdd/getNewElems.js";
import log from "./utils/log/log.js";
const parse = parser.parse;

export default (html) => {
  const root = parse(html);
  const { txtId, altId, titleId, plchldrId, metaId } = config.id;
  const txtElems = root.querySelectorAll(`[${txtId}]`);
  const altAttrElems = root.querySelectorAll(`[${altId}]`);
  const titleAttrElems = root.querySelectorAll(`[${titleId}]`);
  const plchldrAttrElems = root.querySelectorAll(`[${plchldrId}]`);
  const metaElems = root.querySelectorAll(`[${metaId}]`);
  const newElems = findNewElements(root);
  const existingElemsLists = [];
  existingElemsLists.push(
    txtElems,
    altAttrElems,
    titleAttrElems,
    plchldrAttrElems,
    metaElems
  );
  //flatten arrays of nodeLists to get a single array of html elements
  const existingElems = [].concat.apply([], existingElemsLists);
  log("elementsFound", "info", [existingElems.length, newElems.length]);
  return {
    root: root,
    txtElems: txtElems,
    altAttrElems: altAttrElems,
    titleAttrElems: titleAttrElems,
    metaElems: metaElems,
    plchldrAttrElems: plchldrAttrElems,
    existingElems: existingElems,
    newElements: newElems,
  };
};
