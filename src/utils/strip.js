import findHtmlFiles from "./findHtmlFiles.js";
import getHtmlData from "./getHtmlData.js";
import writeFile from "./writeToFile.js";
import { parse } from "node-html-parser";
import log from "./log/log.js";
import { config } from "../../bin/commander/config/setConfig.js";

/**
 * Processes the existing HTML files and removes the text-id's from elements
 * with text nodes and elements with translatable attribute text values.
 *
 */
export default async () => {
  const { src, dest } = config.folders;
  const htmlFileList = findHtmlFiles(`${src}`);

  const processHtmlFile = async (htmlFile) => {
    log("stripStart", "logStartTask2", [htmlFile]);
    const html = getHtmlData(htmlFile);
    const htmlRoot = parse(html);
    let modifiedHtml;
    const dataAttributeIdList = Object.values(config.id.attributeTextId);
    dataAttributeIdList.push(config.id.textNodeId);

    modifiedHtml = removeDataAttributes(htmlRoot, dataAttributeIdList);

    await writeFile(dest, modifiedHtml, htmlFile, "html");
    log("stripEnd", "done", [htmlFile]);
  };
  await Promise.all(htmlFileList.map(processHtmlFile));
};

function removeDataAttributes(htmlRoot, dataAttributeIdList) {
  dataAttributeIdList.forEach((dataAttributeId) => {
    htmlRoot.querySelectorAll(`[${dataAttributeId}]`).forEach((elem) => {
      elem.removeAttribute(dataAttributeId);
    });
  });
  return htmlRoot.toString();
}
