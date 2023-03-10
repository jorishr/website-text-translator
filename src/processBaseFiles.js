import findHtmlFiles from "./utils/findHtmlFiles.js";
import getJsonData from "./utils/getJsonData.js";
import getHtmlData from "./utils/getHtmlData.js";
import writeFile from "./utils/writeToFile.js";
import parseHtml from "./parseHtml.js";
import processUpdates from "./elemsUpdate/index.js";
import setNewElements from "./elemsAdd/setNewElems.js";
import getObsoleteKeys from "./getObsoleteKeys.js";
import logResult from "./utils/log/logResult.js";
import log from "./utils/log/log.js";

export default (config) => {
  const { src, dest } = config.folders;
  const htmlFileList = findHtmlFiles(`${src}`, config);
  //load existing language data json
  const jsonFile = config.fileNames.prefix + config.languages.base + ".json";
  const srcLangData = getJsonData(src, jsonFile) || {};
  const keysInLangData = Object.keys(srcLangData);
  logResult(keysInLangData, "jsonRead", "jsonNotFound", config, [
    keysInLangData.length,
  ]);
  //persist data over iterations
  const offset = Number(keysInLangData.at(-1)) + 1 || config.offset;
  let updatedData = {};
  let documents = [];
  let keysToTranslate = { changedKeys: [], newKeys: [] };
  for (let i = 0; i < htmlFileList.length; i++) {
    log("htmlStart", "start2", config, [htmlFileList[i]]);
    const langData = updatedData.langData || srcLangData;
    const html = getHtmlData(src, htmlFileList[i], config);
    const htmlData = parseHtml(html, config);
    let data = Object.assign({}, { htmlData }, { langData });
    //updates require a base JSON file to compare against
    if (Object.keys(langData).length) {
      const [dataUpdates, changedKeys] = processUpdates(data, config);
      data = dataUpdates;
      keysToTranslate.changedKeys.push(...changedKeys);
    }
    data = setNewElements(data, offset, config);
    keysToTranslate.newKeys.push(...data.newKeys);
    const updatedHtml = data.htmlData.root.toString();
    const hasChanged =
      keysToTranslate.changedKeys.length || keysToTranslate.newKeys.length;
    if (hasChanged && !config.mode.dryRun) {
      writeFile(dest, updatedHtml, htmlFileList[i], "html", config);
    }
    //persist data over iterations
    documents.push(data.htmlData.root);
    updatedData = data;
    log("htmlDone", "done", config, [htmlFileList[i]]);
  }
  const keysToDelete = getObsoleteKeys(updatedData, documents, config);
  keysToDelete.forEach((key) => {
    delete updatedData.langData[key];
  });
  const hasChanged =
    keysToDelete.length ||
    keysToTranslate.changedKeys.length ||
    keysToTranslate.newKeys.length;
  if (hasChanged && !config.mode.dryRun) {
    const fileName = config.fileNames.prefix + config.languages.base + ".json";
    writeFile(dest, updatedData.langData, fileName, "json", config);
  }
  log("htmlEnd", "done", config);
  return [updatedData, keysToTranslate, keysToDelete, offset];
};
