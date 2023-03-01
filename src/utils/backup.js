import fs from "fs";
import path from "path";
import config from "../config.json" assert { type: "json" };
//const config = JSON.parse(fs.readFileSync("./src/config.json"));

export default (src) => {
  const dest = config.folders.backup;
  console.log(
    `SAFE MODE ON:\nStarting backup of HTML and JSON files from ${src} to ${dest}\n`
  );
  let list = getFilesToBackup(src);
  if (list.length === 0) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    createBackup(src, dest, list);
  } else {
    //if folder exists, check if it has subfolders with the name backup_XXX
    const dirList = fs
      .readdirSync(dest, { withFileTypes: true })
      .filter((elem) => elem.isDirectory())
      .map((elem) => elem.name);
    if (dirList.length === 0) {
      createBackup(src, dest, list);
    } else {
      //get mostRecent backup folder version number
      const backups = dirList.filter((elem) => elem.startsWith("backup_"));
      if (backups.length === 0) {
        createBackup(src, dest, list);
      } else {
        let mostRecent = backups.sort().reverse()[0].slice(7);
        //case somebody manually creates a folder with the name backup_ABC
        if (isNaN(Number(mostRecent))) mostRecent = "100";
        createBackup(src, dest, list, mostRecent);
      }
    }
  }
};

function getFilesToBackup(src) {
  const exts = [".html", ".json"];
  const result = fs.readdirSync(src, { recursive: true });
  if (result.length === 0) {
    console.log(
      "No files found in source folder. Please check the path and try again."
    );
    return [];
  } else {
    const list = [];
    exts.forEach((ext) => {
      list.push(result.filter((elem) => filter(elem, ext)));
    });
    if (list.flat().length === 0) {
      console.log(
        `Backup failed. No ${exts[0]} or ${exts[1]} file(s) found in source folder.\n`
      );
      return [];
    } else return list;
  }
}

function filter(elem, ext) {
  if (ext === ".json") {
    const prefix = config.fileNames.prefix;
    const isJson = path.extname(elem) === ext;
    const isPrefix = elem.startsWith(prefix);
    return isJson && isPrefix;
  } else {
    return path.extname(elem) === ext;
  }
}

function createBackup(src, dest, list, mostRecent = "0") {
  mostRecent = Number(mostRecent) + 1;
  if (mostRecent.length !== 3) {
    mostRecent = mostRecent.toString().padStart(3, "0");
  }
  const folderName = `${dest}/backup_${mostRecent}`;
  fs.mkdirSync(`${folderName}`, { recursive: true });
  list = [].concat.apply([], list);
  list.forEach((file) => {
    fs.copyFileSync(`${src}/${file}`, `${folderName}/${file}`);
  });
}
