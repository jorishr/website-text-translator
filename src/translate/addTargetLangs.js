import writeFile from "../utils/writeToFile.js";
import getJsonData from "../utils/getJsonData.js";
import getTranslations from "./googleTranslate.js";
import log from "../utils/log/log.js";
import { config } from "../../bin/commander/config/setConfig.js";

/**
 * Adds target language JSON file by translating the base language data.
 *
 * @param {string[]} targets - Array of target language codes.
 * @returns {Promise<void>} - A promise that resolves when the translation and file writing tasks are completed.
 */
export default async (targets) => {
  const { dest } = config.folders;
  const prefix = config.languageFile.prefix;
  const baseLang = config.languages.base;
  const baseLangData = getJsonData(dest, `${prefix}${baseLang}.json`);
  const baseLangKeys = Object.keys(baseLangData);
  const baseLangValues = Object.values(baseLangData);

  const translationTaskPromises = targets.map(async (targetLang) => {
    log("addLangTargetsStart", "logStartTask2", [targetLang]);
    const result = {};
    const translatedStrArr = await getTranslations(
      baseLangValues,
      targetLang,
      "new"
    );
    baseLangKeys.forEach((key, i) => {
      result[key] = translatedStrArr[i];
    });
    await writeFile(dest, result, `${prefix}${targetLang}.json`, "json");
    log("langFileDone", "done", [targetLang]);
  });
  await Promise.all(translationTaskPromises);
  log("addLangTargetsDone", "done", targets);
};
