import path from "path";
import getFileList from "./getFileList.js";
import log from "./log/log.js";

export default (src) => {
  const allFiles = getFileList(src);
  const htmlFileList = allFiles.filter(
    (elem) => path.extname(elem) === ".html"
  );
  if (htmlFileList.length === 0) {
    log("htmlNotFound", "error", [src]);
    process.exit();
  }
  log("htmlList", "info", [htmlFileList]);
  return htmlFileList;
};
