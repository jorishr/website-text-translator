import fs from "fs";
import path from "path";
import getFileList from "./getFileList.js";
import log from "./log/log.js";
import { config } from "../../bin/commander/setConfig.js";

export default () => {
  log("backupStart", "start2");
  let fileList = filterFiles();
  if (!fileList.length) return;
  if (!fs.existsSync(config.folders.backup)) {
    fs.mkdirSync(config.folders.backup, { recursive: true });
    createBackup(fileList);
  } else {
    //if folder exists, check if it has subfolders with the name backup_XXX
    const dirList = fs
      .readdirSync(config.folders.backup, { withFileTypes: true })
      .filter((elem) => elem.isDirectory())
      .map((elem) => elem.name);
    if (!dirList.length) {
      createBackup(fileList);
    } else {
      //get mostRecent backup folder version number
      const backups = dirList.filter((elem) => elem.startsWith("backup_"));
      if (!backups.length) {
        createBackup(fileList);
      } else {
        let mostRecent = backups.sort().reverse()[0].slice(7);
        //case somebody manually creates a folder with the name backup_ABC
        if (isNaN(Number(mostRecent))) mostRecent = "100";
        createBackup(fileList, mostRecent);
      }
    }
  }
};

function filterFiles() {
  const allFiles = getFileList(config.folders.src);
  const htmlFiles = allFiles.filter((elem) => path.extname(elem) === ".html");
  const jsonFiles = allFiles.filter((elem) => path.extname(elem) === ".json");
  const filteredJsonFiles = jsonFiles.filter((elem) =>
    //for subfolders, path is included in the filename string and needs to be filtered out 'folder/filename' or 'folder/subfolder/filename'
    elem.split("/").at(-1).startsWith(config.languageFile.prefix)
  );
  const result = htmlFiles.concat(filteredJsonFiles);
  if (!result.length) {
    log("backupFail", "fail");
    return [];
  }
  return result;
}

function createBackup(fileList, mostRecent = "0") {
  const { backup } = config.folders;
  mostRecent = Number(mostRecent) + 1;
  if (mostRecent.length !== 3) {
    mostRecent = mostRecent.toString().padStart(3, "0");
  }
  const folderName = `${backup}/backup_${mostRecent}`;
  try {
    fs.mkdirSync(`${folderName}`, { recursive: true });
    fileList.forEach((file) => {
      //process subfolders present in filestring
      const fileName = file.split("/").at(-1);
      const subfolders = file.slice(0, file.length - fileName.length);
      if (path)
        fs.mkdirSync(`${folderName}/${subfolders}`, { recursive: true });
      fs.copyFileSync(`${file}`, `${folderName}/${subfolders}${fileName}`);
    });
  } catch (err) {
    log("backupWriteFail", "error", [err]);
  }
  log("backupDone", "done");
}
