import processTranslations from "./translate/index.js";
import processBaseFiles from "./processBaseFiles.js";
import backup from "./utils/backup.js";
import log from "./utils/log/log.js";

export default (config) => {
  log("infoStart", "header", config);
  //config
  const { base, targets } = config.languages;
  if (!base || targets.length === 0) {
    log("missingLang", "error", config);
    return;
  }
  if (config.mode.dryRun) log("dryRunStart", "start2", config);
  if (!config.mode.dryRun && config.mode.backup) backup(config);
  //parse files
  const [data, keysToTranslate, keysToDelete, offset] =
    processBaseFiles(config);
  //translate
  const keysToProcess = [
    ...Object.keys(keysToTranslate.changedKeys),
    ...Object.keys(keysToTranslate.newKeys),
    ...keysToDelete,
  ];
  if (config.mode.dryRun || !config.mode.translate) {
    if (config.mode.dryRun) log("dryRun", "info", config);
    if (!config.mode.translate) log("translateDisabled", "info", config);
    log("infoEnd", "success", config);
  } else if (keysToProcess.length === 0) {
    log("translateNoKeys", "info", config);
    log("infoEnd", "success", config);
  } else {
    processTranslations(
      data,
      keysToTranslate,
      targets,
      keysToDelete,
      offset,
      config
    );
  }
};
