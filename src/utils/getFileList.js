import fs from "fs";
import path from "path";

export default (src) => {
  try {
    const result = getFiles(src);
    return result;
  } catch (err) {
    console.log(`Unexpected fatal error while reading folder content.\n${err}`);
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
