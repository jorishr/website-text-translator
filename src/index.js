import config from "./config.json" assert { type: "json" };
import processTranslations from "./translate/index.js";
import processBaseFiles from "./processBaseFiles.js";
import backup from "./utils/backup.js";
import log from "./utils/log.js";

export default () => {
  log("infoStart", "header");
  const { src, dest } = config.folders;
  const targets = config.languages.targets;
  const safeMode = config.safeMode;
  if (safeMode) backup(src);
  const [data, keysToTranslate, keysToDelete, offset] = processBaseFiles(
    src,
    dest
  );
  const keysToProcess = [
    ...Object.keys(keysToTranslate.changedKeys),
    ...Object.keys(keysToTranslate.newKeys),
    ...keysToDelete,
  ];
  if (config.noGoogle === true) {
    log("translateDisabled", "info");
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
