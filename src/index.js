import processTranslations from "./translate/index.js";
import processBaseFiles from "./processBaseFiles.js";
import backup from "./utils/backup.js";
import log from "./utils/log/log.js";
import { config } from "../bin/commander/config/setConfig.js";
import detectNewTargetLangs from "./utils/detectNewTargetLangs.js";
import addTargetLangs from "./translate/addTargetLangs.js";

/**
 * Process and translate files based on the provided configuration.
 *
 */
export default async () => {
  const { base, targets } = config.languages;
  if (!base || !targets.length) {
    log("missingLang", "error");
    return;
  }
  if (config.mode.dryRun) log("dryRunStart", "logStartTask2");

  if (!config.mode.dryRun && config.mode.backup) backup();

  // parse html files and detect text data changes
  const [modifiedLangData, keysToTranslate, keysToDelete, keyCountOffset] =
    processBaseFiles();

  // send text data to translation API
  const keysToProcess = [
    ...Object.keys(keysToTranslate.changedKeys),
    ...Object.keys(keysToTranslate.newKeys),
    ...keysToDelete,
  ];

  if (config.mode.dryRun || !config.mode.translate) {
    if (config.mode.dryRun) log("dryRun", "info");
    if (!config.mode.translate) log("translateDisabled", "info");
    log("programEnd", "success");
  } else if (!keysToProcess.length) {
    const newTargetLangs = detectNewTargetLangs();
    if (newTargetLangs.length > 0) {
      await addTargetLangs(newTargetLangs);
      log("programEnd", "success");
    } else {
      log("translateNoKeys", "info");
      log("programEnd", "success");
    }
  } else {
    await processTranslations(
      modifiedLangData,
      keysToTranslate,
      targets,
      keysToDelete,
      keyCountOffset
    );
    log("programEnd", "success");
  }
};
