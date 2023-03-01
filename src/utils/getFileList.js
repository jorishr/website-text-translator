import fs from "fs";
import path from "path";

export default (dir, ext) => {
  try {
    const result = fs.readdirSync(dir);
    const data = result.filter((elem) => path.extname(elem) === ext);
    if (data.length === 0) {
      handler(ext, dir);
    } else return data;
  } catch (err) {
    console.log(`Unexpected fatal error while reading folder content.\n${err}`);
  }
};

function handler(ext, dir) {
  console.log(`No ${ext} files found in ${dir}\nProgram terminated.\n`);
  console.log(
    `Hint:\n\tMake sure you have a ${ext} file in folder: ${dir}\n\tOr change the folder path in the config file.\n\tRun with --help for more info.`
  );
  process.exit();
}
