import parser from "node-html-parser";
import findNewElements from "./parseElements/getNewElems.js";
import log from "./utils/log/log.js";
import { config } from "../bin/commander/config/setConfig.js";
const parse = parser.parse;

export default (html) => {
  const htmlRoot = parse(html);
  const textNodeId = config.id.textNodeId;
  const { altId, titleId, placeholderId, metaId } = config.id.attributeTextId;

  const getAttributeElems = (attribute) =>
    htmlRoot.querySelectorAll(`[${attribute}]`);

  const textNodeElems = getAttributeElems(textNodeId);
  const altAttributeElems = getAttributeElems(altId);
  const titleAttributeElems = getAttributeElems(titleId);
  const placeholderAttributeElems = getAttributeElems(placeholderId);
  const metaAttributeElems = getAttributeElems(metaId);

  const newElems = findNewElements(htmlRoot);
  const existingElemsLists = [];

  existingElemsLists.push(
    textNodeElems,
    altAttributeElems,
    titleAttributeElems,
    placeholderAttributeElems,
    metaAttributeElems
  );
  //flatten arrays of nodeLists to get a single array of html elements
  const existingElems = [].concat.apply([], existingElemsLists);

  log("elementsFound", "info", [existingElems.length, newElems.length]);

  return {
    htmlRoot: htmlRoot,
    textNodeElems: textNodeElems,
    altAttributeElems: altAttributeElems,
    titleAttributeElems: titleAttributeElems,
    metaAttributeElems: metaAttributeElems,
    placeholderAttributeElems: placeholderAttributeElems,
    existingElems: existingElems,
    newElems: newElems,
  };
};
