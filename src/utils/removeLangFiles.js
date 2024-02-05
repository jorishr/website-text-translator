import path from "path";
import fs from "fs";
import getFileList from "./getFileList.js";
import log from "./log/log.js";
import { config } from "../../bin/commander/config/setConfig.js";

export default async () => {
  const dest = config.folders.dest;
  const prefix = config.languageFile.prefix;
  const allFiles = getFileList(dest);
  const jsonFileList = allFiles.filter(
    (elem) =>
      path.extname(elem) === ".json" &&
      path.basename(elem).startsWith(`${prefix}`)
  );
  if (!jsonFileList.length) {
    log("jsonLangFilesNotFound", "error", [dest]);
    process.exit();
  }
  deleteFiles(jsonFileList);
};

const deleteFiles = (files) => {
  files.forEach((file) => {
    try {
      fs.unlinkSync(file);
      log("jsonLangFileDel", "info", [file]);
    } catch (err) {
      log("jsonLangFileDelError", "error", [file, err]);
    }
  });
};
