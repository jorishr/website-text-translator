import getJsonData from "../utils/getJsonData.js";
import writeFile from "../utils/writeToFile.js";
import getTranslations from "./googleTranslate.js";
import log from "../utils/log/log.js";
import { config } from "../../bin/commander/setConfig.js";

export default async (
  langData,
  keysToTranslate,
  targets,
  keysToDelete,
  offset
) => {
  const { src, dest } = config.folders;
  const prefix = config.fileNames.prefix;
  const [changedValues, newValues] = getValues(keysToTranslate, langData);
  log("translateStart", "start2");
  targets.forEach(async (lang) => {
    //Google Translate API returns an array of translations, in the same order as the input array
    let resChangedVals = [];
    if (changedValues.length) {
      resChangedVals = await getTranslations(changedValues, lang, "updated");
    }
    let resNewVals = [];
    if (newValues.length) {
      resNewVals = await getTranslations(newValues, lang, "new");
    }
    //read the existing translation file for the language
    let jsonData = getJsonData(dest, `${prefix}${lang}.json`) || {};
    if (Object.keys(jsonData).length) {
      log("langFileExists", "info", [lang]);
      keysToDelete.forEach((key) => {
        delete jsonData[key];
      });
      //new values are appended to the end of the file
      for (let i = 0; i < resNewVals.length; i++) {
        jsonData[offset + i] = resNewVals[i];
      }
      //changed values are updated in the file at their respective keys
      for (let i = 0; i < resChangedVals.length; i++) {
        jsonData[keysToTranslate.changedKeys[i]] = resChangedVals[i];
      }
    } else {
      log("langFileNew", "info", [lang]);
      //in this case, there should be no changed keys, only new keys to append to the end of the file
      for (let i = 0; i < resNewVals.length; i++) {
        jsonData[offset + i] = resNewVals[i];
      }
    }
    writeFile(dest, jsonData, `${prefix}${lang}.json`, "json");
  });
};

function getValues(keys, langData) {
  const changedValues = [];
  const newValues = [];
  keys.changedKeys.forEach((key) => {
    changedValues.push(langData[key]);
  });
  keys.newKeys.forEach((key) => {
    newValues.push(langData[key]);
  });
  return [changedValues, newValues];
}
