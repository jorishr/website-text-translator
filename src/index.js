import processTranslations from "./translate/index.js";
import processBaseFiles from "./processBaseFiles.js";
import backup from "./utils/backup.js";
import log from "./utils/log/log.js";

/**
 * Process and translate files based on the provided configuration.
 *
 * @param {Object} config - The configuration object.
 * @param {string} config.languages.base - The base language.
 * @param {string[]} config.languages.targets - Array of target languages.
 * @param {boolean} config.mode.dryRun - Flag indicating a dry run.
 * @param {boolean} config.mode.backup - Flag indicating backup should be performed.
 */
export default (config) => {
  const { base, targets } = config.languages;
  if (!base || !targets.length) {
    log("missingLang", "error", config);
    return;
  }
  if (config.mode.dryRun) log("dryRunStart", "start2", config);

  if (!config.mode.dryRun && config.mode.backup) backup(config);

  // parse html files and detect text data changes
  const [modifiedLangData, keysToTranslate, keysToDelete, keyCountOffset] =
    processBaseFiles(config);

  // send text data to translation API
  const keysToProcess = [
    ...Object.keys(keysToTranslate.changedKeys),
    ...Object.keys(keysToTranslate.newKeys),
    ...keysToDelete,
  ];

  if (config.mode.dryRun || !config.mode.translate) {
    if (config.mode.dryRun) log("dryRun", "info", config);
    if (!config.mode.translate) log("translateDisabled", "info", config);
    log("infoEnd", "success", config);
  } else if (!keysToProcess.length) {
    log("translateNoKeys", "info", config);
    log("infoEnd", "success", config);
  } else {
    processTranslations(
      modifiedLangData,
      keysToTranslate,
      targets,
      keysToDelete,
      keyCountOffset,
      config
    );
  }
};
