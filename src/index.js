import config from "./config.json" assert { type: "json" };
import processTranslations from "./translate/index.js";
import processBaseFiles from "./processBaseFiles.js";
import backup from "./utils/backup.js";
import log from "./utils/log.js";

export default () => {
  log("infoStart", "header");
  const { src, dest } = config.folders;
  const targets = config.languages.targets;
  if (config.mode.dryRun) log("dryRunStart", "start2");
  if (!config.mode.dryRun && config.mode.backup) backup(src);
  const [data, keysToTranslate, keysToDelete, offset] = processBaseFiles(
    src,
    dest
  );
  const keysToProcess = [
    ...Object.keys(keysToTranslate.changedKeys),
    ...Object.keys(keysToTranslate.newKeys),
    ...keysToDelete,
  ];
  if (config.mode.dryRun || config.mode.noTranslate) {
    if (config.mode.dryRun) log("dryRun", "info");
    if (config.mode.noTranslate) log("translateDisabled", "info");
    log("infoEnd", "success");
  } else if (keysToProcess.length === 0) {
    log("translateNoKeys", "info");
    log("infoEnd", "success");
  } else {
    processTranslations(
      data,
      keysToTranslate,
      targets,
      keysToDelete,
      offset,
      src,
      dest
    );
  }
};
