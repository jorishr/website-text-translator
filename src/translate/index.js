import config from "../config.json" assert { type: "json" };
import getJsonData from "../utils/getJsonData.js";
import writeFile from "../utils/writeToFile.js";
import getTranslations from "./googleTranslate.js";
import log from "../utils/log/log.js";

export default async (
  data,
  keysToTranslate,
  targets,
  keysToDelete,
  offset,
  src,
  dest
) => {
  const prefix = config.fileNames.prefix;
  const [changedValues, newValues] = getValues(keysToTranslate, data);
  log("translateStart", "start2");
  targets.forEach(async (lang) => {
    //Google Translate API returns an array of translations, in the same order as the input array
    let resChangedVals = [];
    if (changedValues.length > 0) {
      resChangedVals = await getTranslations(changedValues, lang, "updated");
    }
    let resNewVals = [];
    if (newValues.length > 0) {
      resNewVals = await getTranslations(newValues, lang, "new");
    }
    //read the existing translation file for the language
    let jsonData = getJsonData(src, `${prefix}${lang}.json`) || {};
    if (Object.keys(jsonData).length !== 0) {
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

function getValues(keys, data) {
  const changedValues = [];
  const newValues = [];
  keys.changedKeys.forEach((key) => {
    if (data.langData[key]) {
      changedValues.push(data.langData[key]);
    }
  });
  keys.newKeys.forEach((key) => {
    if (data.langData[key]) {
      newValues.push(data.langData[key]);
    }
  });
  return [changedValues, newValues];
}
