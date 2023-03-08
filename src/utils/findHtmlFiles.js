import path from "path";
import getFileList from "./getFileList.js";
import log from "./log/log.js";

export default (src, config) => {
  const allFiles = getFileList(src, config);
  const htmlFileList = allFiles.filter(
    (elem) => path.extname(elem) === ".html"
  );
  if (htmlFileList.length === 0) {
    log("htmlNotFound", "error", config, [src]);
    process.exit();
  }
  log("htmlList", "info", config, [htmlFileList]);
  return htmlFileList;
};
