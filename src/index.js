import config from "./config.json" assert { type: "json" };
import processTranslations from "./translate/index.js";
import processBaseFiles from "./processBaseFiles";

export default () => {
  const { src, dest } = config.folders;
  const targets = config.languages.targets;
  const [data, keysToTranslate, keysToDelete, offset] = processBaseFiles(
    src,
    dest
  );
  const keysToProcess = [
    ...Object.keys(keysToTranslate.changedKeys),
    ...Object.keys(keysToTranslate.newKeys),
    ...keysToDelete,
  ];
  if (keysToProcess.length === 0) {
    console.log(
      "No changes found in base files. No translations needed. All done!\n"
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
