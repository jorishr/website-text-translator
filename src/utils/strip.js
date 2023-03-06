import findHtmlFiles from "./findHtmlFiles.js";
import getHtmlData from "./getHtmlData.js";
import writeFile from "./writeToFile.js";
import config from "../config.json" assert { type: "json" };
import { parse } from "node-html-parser";
import log from "./log/log.js";

export default (src, dest) => {
  log("infoStart", "header");
  const htmlFileList = findHtmlFiles(`${src}`, [".html"]);
  for (let i = 0; i < htmlFileList.length; i++) {
    log("startStrip", "start2", [htmlFileList[i]]);
    const html = getHtmlData(src, htmlFileList[i]);
    const root = parse(html);
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
    writeFile(dest, updatedHtml, htmlFileList[i], "html");
  }
};
