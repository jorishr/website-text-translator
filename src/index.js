import config from "./config.json" assert { type: "json" };
import processTranslations from "./translate/index.js";
import processBaseFiles from "./processBaseFiles.js";
import backup from "./utils/backup.js";

export default () => {
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
    console.log("Translations disabled in config file.\nAll done!\n");
  } else if (keysToProcess.length === 0) {
    console.log(
      "No changes found in base files. No translations needed.\nAll done!\n"
    );
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
