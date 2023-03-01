import config from "../config.json" assert { type: "json" };
import getJsonData from "../utils/getJsonData.js";
import writeFile from "../utils/writeToFile.js";
import getTranslations from "./googleTranslate.js";

export default async (
  data,
  keysToTranslate,
  targets,
  keysToDelete,
  offset,
  src,
  dest
) => {
  const [changedValues, newValues] = getValues(keysToTranslate, data);
  console.log("Starting translation(s)...\n");
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
    const prefix = config.fileNames.prefix;
    let data = getJsonData(src, `${prefix}${lang}.json`) || {};
    if (Object.keys(data).length !== 0) {
      console.log(
        `Found existing translation file for language: ${lang}. Applying updates...`
      );
      keysToDelete.forEach((key) => {
        delete data[key];
      });
      //new values are appended to the end of the file
      for (let i = 0; i < resNewVals.length; i++) {
        data[offset + i] = resNewVals[i];
      }
      //changed values are updated in the file at their respective keys
      for (let i = 0; i < resChangedVals.length; i++) {
        data[keysToTranslate.changedKeys[i]] = resChangedVals[i];
      }
    } else {
      console.log(
        `\nNo existing translation data found for language: ${lang}. Creating new file...`
      );
      //in this case, there should be no changed keys, only new keys to append to the end of the file
      for (let i = 0; i < resNewVals.length; i++) {
        data[offset + i] = resNewVals[i];
      }
    }
    writeFile(dest, data, `txt_data_${lang}.json`, "json");
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
