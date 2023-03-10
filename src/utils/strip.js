import findHtmlFiles from "./findHtmlFiles.js";
import getHtmlData from "./getHtmlData.js";
import writeFile from "./writeToFile.js";
import { parse } from "node-html-parser";
import log from "./log/log.js";

export default (config) => {
  const { src, dest } = config.folders;
  const htmlFileList = findHtmlFiles(`${src}`, config);
  for (let i = 0; i < htmlFileList.length; i++) {
    log("startStrip", "start2", config, [htmlFileList[i]]);
    const html = getHtmlData(src, htmlFileList[i], config);
    const root = parse(html, config);
    const { txtId, altId, titleId, plchldrId, metaId } = config.id;
    root.querySelectorAll(`[${txtId}]`).forEach((elem) => {
      elem.removeAttribute(txtId);
    });
    root.querySelectorAll(`[${altId}]`).forEach((elem) => {
      elem.removeAttribute(altId);
    });
    root.querySelectorAll(`[${titleId}]`).forEach((elem) => {
      elem.removeAttribute(titleId);
    });
    root.querySelectorAll(`[${plchldrId}]`).forEach((elem) => {
      elem.removeAttribute(plchldrId);
    });
    root.querySelectorAll(`[${metaId}]`).forEach((elem) => {
      elem.removeAttribute(metaId);
    });
    const updatedHtml = root.toString();
    writeFile(dest, updatedHtml, htmlFileList[i], "html", config);
  }
};
