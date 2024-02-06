import path from "path";
import { config } from "../../bin/commander/config/setConfig.js";
import getFileList from "./getFileList.js";

/**
 * Retrieves a list of target languages that are have missing language JSON
 * files based on the existing files in the destination folder and the target
 * language array set in the configuration.
 *
 * @returns {string[]} - An array of target language IDs that do not have
 * corresponding language files.
 *
 */
export default () => {
  const targetLangs = config.languages.targets;
  const dest = config.folders.dest;
  const jsonLangFileList = getFileList(dest).filter(
    (elem) => path.extname(elem) === ".json"
  );
  const existingLangIds = jsonLangFileList.map((file) =>
    file.split(".")[0].split("_").at(-1)
  );
  let result = [];

  if (targetLangs.length + 1 === existingLangIds.length) {
    // existingLangIds contains base lang file, + 1
    return result;
  } else {
    targetLangs.forEach((target) => {
      if (!existingLangIds.includes(target)) result.push(target);
    });
    return result;
  }
};
