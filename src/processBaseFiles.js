import findHtmlFiles from "./utils/findHtmlFiles.js";
import getJsonData from "./utils/getJsonData.js";
import getHtmlData from "./utils/getHtmlData.js";
import writeFile from "./utils/writeToFile.js";
import parseHtml from "./parseHtml.js";
import updateHtml from "./elemsUpdate/index.js";
import setNewHtmlElements from "./elemsAdd/setNewElems.js";
import getObsoleteKeys from "./getObsoleteKeys.js";
import logResult from "./utils/log/logResult.js";
import log from "./utils/log/log.js";

/**
 * Loads the HTML source files to be processed for comparison with the
 * base language data file.
 *
 * @param {Object} config - The configuration object.
 *
 * @returns {Array} An array containing processed data:
 *   [0] - modifiedLangData: The modified language data object.
 *   [1] - keysToTranslate: An object with changedKeys and newKeys arrays.
 *   [2] - keysToDeleteInJson: An array of keys to delete from the JSON file.
 *   [3] - keyCountOffset: The key count offset.
 */
export default (config) => {
  const { src, dest } = config.folders;
  const htmlFileList = findHtmlFiles(`${src}`, config);
  const jsonFile = config.fileNames.prefix + config.languages.base + ".json";
  const baseLangData = getJsonData(dest, jsonFile) || {};
  const keysInBaseLangData = Object.keys(baseLangData);

  logResult(keysInBaseLangData, "jsonRead", "jsonNotFound", config, [
    keysInBaseLangData.length,
  ]);

  const keyCountOffset = Number(keysInBaseLangData.at(-1)) + 1 || config.offset;
  let modifiedLangData = {};
  let modifiedHtmlDocs = [];
  let keysToTranslate = { changedKeys: [], newKeys: [] };

  for (let i = 0; i < htmlFileList.length; i++) {
    log("htmlStart", "start2", config, [htmlFileList[i]]);

    const langData = modifiedLangData.langData || baseLangData;
    const html = getHtmlData(htmlFileList[i], config);
    const htmlData = parseHtml(html, config);
    let workingData = Object.assign({}, { htmlData }, { langData });
    let updatedHtml;

    if (Object.keys(langData).length) {
      const [dataUpdates, changedKeys] = updateHtml(workingData, config);
      workingData = dataUpdates;
      keysToTranslate.changedKeys.push(...changedKeys);
    }

    workingData = setNewHtmlElements(workingData, keyCountOffset, config);
    updatedHtml = workingData.htmlData.root.toString();

    keysToTranslate.newKeys.push(...workingData.newKeys);

    if (
      (keysToTranslate.changedKeys.length || keysToTranslate.newKeys.length) &&
      !config.mode.dryRun
    ) {
      writeFile(dest, updatedHtml, htmlFileList[i], "html", config);
    }

    modifiedHtmlDocs.push(workingData.htmlData.root);
    modifiedLangData = workingData.langData;

    log("htmlDone", "done", config, [htmlFileList[i]]);
  }

  const keysToDeleteInJson = getObsoleteKeys(
    modifiedLangData,
    modifiedHtmlDocs,
    config
  );
  keysToDeleteInJson.forEach((key) => {
    delete modifiedLangData[key];
  });

  const jsonHasChangedKeys =
    keysToDeleteInJson.length ||
    keysToTranslate.changedKeys.length ||
    keysToTranslate.newKeys.length;
  if (jsonHasChangedKeys && !config.mode.dryRun) {
    writeFile(dest, modifiedLangData, jsonFile, "json", config);
  }

  log("htmlEnd", "done", config);

  return [
    modifiedLangData,
    keysToTranslate,
    keysToDeleteInJson,
    keyCountOffset,
  ];
};
