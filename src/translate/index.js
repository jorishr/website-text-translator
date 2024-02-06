import getJsonData from "../utils/getJsonData.js";
import writeFile from "../utils/writeToFile.js";
import getTranslations from "./googleTranslate.js";
import log from "../utils/log/log.js";
import { config } from "../../bin/commander/config/setConfig.js";

/**
 * Translates language data and updates language files based on specified keys and targets.
 *
 * @param {Object} langData - The original language data object.
 * @param {Object} keysToTranslate - Object containing changedKeys and newKeys arrays.
 * @param {Array} targets - Array of target languages.
 * @param {Array} keysToDelete - Array of keys to delete from language files.
 * @param {number} offset - Offset for new values in language files.
 */
export default async (
  langData,
  keysToTranslate,
  targets,
  keysToDelete,
  offset
) => {
  const { dest } = config.folders;
  const prefix = config.languageFile.prefix;
  const { changedKeys, newKeys } = keysToTranslate;
  const changedValues = changedKeys.map((key) => langData[key]);
  const newValues = newKeys.map((key) => langData[key]);

  log("translateStart", "logStartTask2");

  const translationTaskPromises = targets.map(async (targetLang) => {
    /*
      Google Translate API returns an array of translations, in the same order as the input array. Store the result in resChangedVals and resNewVals.
    */
    let resChangedVals = [];
    if (changedKeys.length) {
      resChangedVals = await getTranslations(
        changedValues,
        targetLang,
        "changed keys"
      );
    }
    let resNewVals = [];
    if (newKeys.length) {
      resNewVals = await getTranslations(newValues, targetLang, "new keys");
    }
    // read the existing translation file for the language
    let jsonLangData = getJsonData(dest, `${prefix}${targetLang}.json`) || {};
    if (Object.keys(jsonLangData).length) {
      log("langFileExists", "info", [targetLang]);
      keysToDelete.forEach((key) => {
        delete jsonLangData[key];
      });
      //new values are appended to the end of the file using offset
      for (let i = 0; i < resNewVals.length; i++) {
        jsonLangData[offset + i] = resNewVals[i];
      }
      // changed values are updated in the file at their respective keys
      for (let i = 0; i < resChangedVals.length; i++) {
        jsonLangData[changedKeys[i]] = resChangedVals[i];
      }
    } else {
      /*
        In this case, there should be no changed keys, only new keys to append to the end of the file
      */
      log("langFileNew", "info", [targetLang]);

      for (let i = 0; i < resNewVals.length; i++) {
        jsonLangData[offset + i] = resNewVals[i];
      }
    }
    await writeFile(dest, jsonLangData, `${prefix}${targetLang}.json`, "json");
    log("langFileDone", "done", [targetLang]);
  });
  await Promise.all(translationTaskPromises);
  log("translateEnd", "done");
};
