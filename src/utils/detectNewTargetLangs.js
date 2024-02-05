import path from "path";
import { config } from "../../bin/commander/config/setConfig.js";
import getFileList from "./getFileList.js";

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
