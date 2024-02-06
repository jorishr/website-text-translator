import findHtmlFiles from "./utils/findHtmlFiles.js";
import getJsonData from "./utils/getJsonData.js";
import getHtmlData from "./utils/getHtmlData.js";
import writeFile from "./utils/writeToFile.js";
import parseHtml from "./parseHtml.js";
import parseWorkingData from "./parseElements/index.js";
import setNewElements from "./parseElements/setNewElems.js";
import getObsoleteKeys from "./getObsoleteKeys.js";
import logResult from "./utils/log/logResult.js";
import log from "./utils/log/log.js";
import { config } from "../bin/commander/config/setConfig.js";

/**
 * Loads the HTML source files to be processed for comparison with the
 * base language data file.
 *
 * @returns {Array} An array containing processed data:
 *   [0] - modifiedLangData: The modified language data object.
 *   [1] - keysToTranslate: An object with changedKeys and newKeys arrays.
 *   [2] - keysToDeleteInJson: An array of keys to delete from the JSON file.
 *   [3] - keyCountOffset: The key count offset.
 */
export default () => {
  const { src, dest } = config.folders;
  const htmlFileList = findHtmlFiles(`${src}`);
  const jsonFile = config.languageFile.prefix + config.languages.base + ".json";
  const baseLangData = getJsonData(dest, jsonFile) || {};
  const keysInBaseLangData = Object.keys(baseLangData);
  const keyCountOffset =
    Number(keysInBaseLangData.at(-1)) + 1 || config.keyCountOffset;

  logResult(keysInBaseLangData, "baseLangDataRead", "baseLangDataNotFound", [
    keysInBaseLangData.length,
  ]);

  let modifiedLangData = {};
  let modifiedHtmlDocs = [];
  let counter = keyCountOffset;
  let keysToTranslate = { changedKeys: [], newKeys: [] };

  for (let i = 0; i < htmlFileList.length; i++) {
    log("htmlStart", "logStartTask2", [htmlFileList[i]]);

    const langData = modifiedLangData.langData || baseLangData;
    const html = getHtmlData(htmlFileList[i]);
    const htmlData = parseHtml(html);
    let workingData = Object.assign({}, { htmlData }, { langData });
    workingData.counter = counter;
    let updatedHtml;
    let changedKeys = [];
    let workingDataUpdates;

    if (Object.keys(langData).length > 0) {
      [workingDataUpdates, changedKeys] = parseWorkingData(workingData);
      workingData = workingDataUpdates;
      keysToTranslate.changedKeys.push(...changedKeys);
    }

    workingData = setNewElements(workingData);
    updatedHtml = workingData.htmlData.htmlRoot.toString();

    keysToTranslate.newKeys.push(...workingData.newKeys);

    if (
      (changedKeys.length > 0 || workingData.newKeys.length > 0) &&
      !config.mode.dryRun
    ) {
      writeFile(dest, updatedHtml, htmlFileList[i], "html");
    }

    modifiedHtmlDocs.push(workingData.htmlData.htmlRoot);
    modifiedLangData = workingData.langData;
    counter = workingData.counter;

    log("htmlDone", "done", [htmlFileList[i]]);
  }

  const keysToDeleteInJson = getObsoleteKeys(
    modifiedLangData,
    modifiedHtmlDocs
  );
  keysToDeleteInJson.forEach((key) => {
    delete modifiedLangData[key];
  });

  const jsonHasChangedKeys =
    keysToDeleteInJson.length ||
    keysToTranslate.changedKeys.length ||
    keysToTranslate.newKeys.length;
  if (jsonHasChangedKeys && !config.mode.dryRun) {
    writeFile(dest, modifiedLangData, jsonFile, "json");
  }

  log("htmlEnd", "done");

  return [
    modifiedLangData,
    keysToTranslate,
    keysToDeleteInJson,
    keyCountOffset,
  ];
};
