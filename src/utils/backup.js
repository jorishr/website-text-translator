import fs from "fs";
import path from "path";
import config from "../config.json" assert { type: "json" };
import getFileList from "./getFileList.js";
import log from "./log.js";
//const config = JSON.parse(fs.readFileSync("./src/config.json"));

export default (src) => {
  const dest = config.folders.backup;
  log("backupStart", "start2");
  let fileList = getFiles(src);
  if (fileList.length === 0) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    createBackup(src, dest, fileList);
  } else {
    //if folder exists, check if it has subfolders with the name backup_XXX
    const dirList = fs
      .readdirSync(dest, { withFileTypes: true })
      .filter((elem) => elem.isDirectory())
      .map((elem) => elem.name);
    if (dirList.length === 0) {
      createBackup(src, dest, fileList);
    } else {
      //get mostRecent backup folder version number
      const backups = dirList.filter((elem) => elem.startsWith("backup_"));
      if (backups.length === 0) {
        createBackup(src, dest, fileList);
      } else {
        let mostRecent = backups.sort().reverse()[0].slice(7);
        //case somebody manually creates a folder with the name backup_ABC
        if (isNaN(Number(mostRecent))) mostRecent = "100";
        createBackup(src, dest, fileList, mostRecent);
      }
    }
  }
};

function getFiles(src) {
  const allFiles = getFileList(src);
  const htmlFiles = allFiles.filter((elem) => path.extname(elem) === ".html");
  const jsonFiles = allFiles.filter((elem) => path.extname(elem) === ".json");
  const filteredJsonFiles = jsonFiles.filter((elem) =>
    //for subfolders, path is included in the filename string and needs to be filtered out 'folder/filename' or 'folder/subfolder/filename'
    elem.split("/").at(-1).startsWith(config.fileNames.prefix)
  );
  const result = htmlFiles.concat(filteredJsonFiles);
  if (result.length === 0) {
    log("backupFail", "fail");
    return [];
  }
  return result;
}

function createBackup(src, dest, fileList, mostRecent = "0") {
  mostRecent = Number(mostRecent) + 1;
  if (mostRecent.length !== 3) {
    mostRecent = mostRecent.toString().padStart(3, "0");
  }
  const folderName = `${dest}/backup_${mostRecent}`;
  try {
    fs.mkdirSync(`${folderName}`, { recursive: true });
    fileList.forEach((file) => {
      //process subfolders present in filestring
      const fileName = file.split("/").at(-1);
      const subfolders = file.slice(0, file.length - fileName.length);
      if (path)
        fs.mkdirSync(`${folderName}/${subfolders}`, { recursive: true });
      fs.copyFileSync(
        `${src}${file}`,
        `${folderName}/${subfolders}${fileName}`
      );
    });
  } catch (err) {
    log("backupWriteFail", "error", [err]);
  }
}
