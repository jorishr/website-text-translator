import findHtmlFiles from "./findHtmlFiles.js";
import getHtmlData from "./getHtmlData.js";
import writeFile from "./writeToFile.js";
import { parse } from "node-html-parser";
import log from "./log/log.js";
import { config } from "../../bin/commander/config/setConfig.js";

export default () => {
  const { src, dest } = config.folders;
  const htmlFileList = findHtmlFiles(`${src}`);
  for (let i = 0; i < htmlFileList.length; i++) {
    log("startStrip", "start2", [htmlFileList[i]]);
    const html = getHtmlData(htmlFileList[i]);
    const htmlRoot = parse(html);
    let modifiedHtml;
    const dataAttributeIdList = Object.values(config.id.attributeTextId);
    dataAttributeIdList.push(config.id.textNodeId);

    modifiedHtml = removeDataAttributes(htmlRoot, dataAttributeIdList);

    writeFile(dest, modifiedHtml, htmlFileList[i], "html");
  }
};

function removeDataAttributes(htmlRoot, dataAttributeIdList) {
  dataAttributeIdList.forEach((dataAttributeId) => {
    htmlRoot.querySelectorAll(`[${dataAttributeId}]`).forEach((elem) => {
      elem.removeAttribute(dataAttributeId);
    });
  });
  return htmlRoot.toString();
}
