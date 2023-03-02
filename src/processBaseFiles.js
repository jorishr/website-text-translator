import path from "path";
import config from "./config.json" assert { type: "json" };
import getFileList from "./utils/getFileList.js";
import getJsonData from "./utils/getJsonData.js";
import getHtmlData from "./utils/getHtmlData.js";
import logResult from "./utils/logResult.js";
import writeFile from "./utils/writeToFile.js";
import parseHtml from "./parseHtml.js";
import processUpdates from "./elemsUpdate/index.js";
import setNewElements from "./elemsAdd/setNewElems.js";
import getObsoleteKeys from "./getObsoleteKeys.js";
import log from "./utils/log.js";

export default (src, dest) => {
  const htmlFileList = findHtmlFiles(`${src}`, [".html"]);
  //load existing language data json
  const srcLangData = getJsonData(src, config.fileNames.baseJson) || {};
  const keysInLangData = Object.keys(srcLangData);
  logResult(keysInLangData);
  //persist data over iterations
  const offset = Number(keysInLangData.at(-1)) + 1 || config.offset;
  let updatedData = {};
  let documents = [];
  let keysToTranslate = { changedKeys: [], newKeys: [] };
  for (let i = 0; i < htmlFileList.length; i++) {
    log("htmlStart", "start2", [htmlFileList[i]]);
    const langData = updatedData.langData || srcLangData;
    const html = getHtmlData(src, htmlFileList[i]);
    const htmlData = parseHtml(html);
    let data = Object.assign({}, { htmlData }, { langData });
    //updates require a base JSON file to compare against
    if (Object.keys(langData).length !== 0) {
      const [dataUpdates, changedKeys] = processUpdates(data);
      data = dataUpdates;
      keysToTranslate.changedKeys.push(...changedKeys);
    }
    data = setNewElements(data, offset);
    keysToTranslate.newKeys.push(...data.newKeys);
    const updatedHtml = data.htmlData.root.toString();
    writeFile(dest, updatedHtml, htmlFileList[i], "html");
    //persist data over iterations
    documents.push(data.htmlData.root);
    updatedData = data;
    log("htmlDone", "done", [htmlFileList[i]]);
  }
  const keysToDelete = getObsoleteKeys(updatedData, documents);
  keysToDelete.forEach((key) => {
    delete updatedData.langData[key];
  });
  writeFile(dest, updatedData.langData, config.fileNames.baseJson, "json");
  log("htmlEnd", "done");
  return [updatedData, keysToTranslate, keysToDelete, offset];
};

function findHtmlFiles(src) {
  const allFiles = getFileList(src);
  const htmlFileList = allFiles.filter(
    (elem) => path.extname(elem) === ".html"
  );
  if (htmlFileList.length === 0) {
    console.log(
      `Program terminated. No HTML file(s) found in folder\n\nHint:\n\tMake sure you have at least one HTML file in the source folder: ${src}\n\tOr change the folder path in the config file.\n`
    );
    process.exit();
  }
  console.log(`Found HTML file(s) to process:\n${htmlFileList}\n`);
  return htmlFileList;
}
