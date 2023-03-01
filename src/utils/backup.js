import fs from "fs";
import path from "path";
import config from "../config.json" assert { type: "json" };
//const config = JSON.parse(fs.readFileSync("./src/config.json"));

export default (src) => {
  const dest = config.folders.backup;
  console.log(
    `SAFE MODE ON:\nBacking up HTML and JSON files from ${src} to ${dest}...\n`
  );
  const exts = [".html", ".json"];
  const result = fs.readdirSync(src, { recursive: true });
  if (result.length === 0) {
    console.log(
      "No files found in source folder. Please check the path and try again."
    );
  } else {
    let list = [];
    exts.forEach((ext) => {
      list.push(result.filter((elem) => path.extname(elem) === ext));
    });
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    list = [].concat.apply([], list);
    list.forEach((file) => {
      fs.copyFileSync(`${src}/${file}`, `${dest}/${file}`);
    });
  }
};
