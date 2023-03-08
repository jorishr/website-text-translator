import fs from "fs";
import path from "path";
import log from "./log/log.js";

export default (src, config) => {
  try {
    const result = getFiles(src);
    return result;
  } catch (err) {
    log("getFilesFail", "error", config, [err]);
    return null;
  }
};

function getFiles(dirPath, filesArr = []) {
  let content = fs.readdirSync(dirPath);

  content.forEach((file) => {
    if (
      fs.statSync(`${dirPath}/${file}`).isDirectory() &&
      file !== "node_modules" &&
      file !== ".git" &&
      file !== "backup"
    ) {
      filesArr = getFiles(`${dirPath}/${file}`, filesArr);
    } else {
      filesArr.push(path.join(dirPath, "/", file));
    }
  });

  return filesArr;
}
