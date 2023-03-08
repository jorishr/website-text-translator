import fs from "fs";
import path from "path";
import getFileList from "./getFileList.js";
import log from "./log/log.js";

export default (config) => {
  log("backupStart", "start2", config);
  let fileList = filterFiles(config);
  if (fileList.length === 0) return;
  if (!fs.existsSync(config.folders.backup)) {
    fs.mkdirSync(config.folders.backup, { recursive: true });
    createBackup(config, fileList);
  } else {
    //if folder exists, check if it has subfolders with the name backup_XXX
    const dirList = fs
      .readdirSync(config.folders.backup, { withFileTypes: true })
      .filter((elem) => elem.isDirectory())
      .map((elem) => elem.name);
    if (dirList.length === 0) {
      createBackup(config, fileList);
    } else {
      //get mostRecent backup folder version number
      const backups = dirList.filter((elem) => elem.startsWith("backup_"));
      if (backups.length === 0) {
        createBackup(config, fileList);
      } else {
        let mostRecent = backups.sort().reverse()[0].slice(7);
        //case somebody manually creates a folder with the name backup_ABC
        if (isNaN(Number(mostRecent))) mostRecent = "100";
        createBackup(config, fileList, mostRecent);
      }
    }
  }
};

function filterFiles(config) {
  const allFiles = getFileList(config.folders.src, config);
  const htmlFiles = allFiles.filter((elem) => path.extname(elem) === ".html");
  const jsonFiles = allFiles.filter((elem) => path.extname(elem) === ".json");
  const filteredJsonFiles = jsonFiles.filter((elem) =>
    //for subfolders, path is included in the filename string and needs to be filtered out 'folder/filename' or 'folder/subfolder/filename'
    elem.split("/").at(-1).startsWith(config.fileNames.prefix)
  );
  const result = htmlFiles.concat(filteredJsonFiles);
  if (result.length === 0) {
    log("backupFail", "fail", config);
    return [];
  }
  return result;
}

function createBackup(config, fileList, mostRecent = "0") {
  const { src, backup } = config.folders;
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
      fs.copyFileSync(
        `${src}${file}`,
        `${folderName}/${subfolders}${fileName}`
      );
    });
  } catch (err) {
    log("backupWriteFail", "error", config, [err]);
  }
}
