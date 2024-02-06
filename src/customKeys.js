import { config } from "../bin/commander/config/setConfig.js";
import getJsonData from "./utils/getJsonData.js";
import log from "./utils/log/log.js";
import getTranslations from "./translate/googleTranslate.js";
import writeFile from "./utils/writeToFile.js";

/**
 * Processes custom keys according to configuration and adds translations to
 * target language files.
 *
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 */
export default async () => {
  const dest = config.folders.dest;
  const targetLangs = config.languages.targets;
  const baseLang = config.languages.base;
  const prefix = config.languageFile.prefix;
  const customKeys = config.customKeys;

  if (customKeys.length > 0) {
    log("customKeysStart", "logStartTask2", [...customKeys]);
    const baseLangData = getJsonData(dest, `${prefix}${baseLang}.json`) || {};
    const baseLangKeys = Object.keys(baseLangData);
    let keyAdded = false;

    for (const key of customKeys) {
      if (!baseLangKeys.includes(key)) {
        log("customKeysNotFound", "error", [key]);
        process.exit(1);
      }
    }

    const targetLangDataTasks = targetLangs.map(async (targetLang) => {
      let targetLangData =
        getJsonData(dest, `${prefix}${targetLang}.json`) || {};
      const targetLangKeys = Object.keys(targetLangData);

      for (const key of customKeys) {
        if (!targetLangKeys.includes(key)) {
          const translation = await getTranslations(
            [baseLangData[key]],
            targetLang,
            "custom key"
          );
          targetLangData[key] = translation[0];
          keyAdded = true;
        }
      }
      if (keyAdded) {
        const fileName = `${prefix}${targetLang}.json`;
        await writeFile(dest, targetLangData, fileName, "json");
        log("customKeysAdded", "info", [fileName, ...customKeys]);
      }
    });
    await Promise.all(targetLangDataTasks);
    if (!keyAdded) log("customKeysNoChanges", "info");
    log("customKeysDone", "done");
  }
};
