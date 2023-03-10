import fs from "fs";
import log from "./log/log.js";

export default async (dest, data, fileName, type, config) => {
  log("writeFileStart", "info", config, [fileName]);
  try {
    fs.accessSync(dest);
  } catch (e) {
    fs.mkdirSync(dest, { recursive: true });
    log("mkdir", "info", config, [dest]);
  }

  switch (type) {
    case "json":
      try {
        fs.promises.writeFile(
          `${dest}/${fileName}`,
          JSON.stringify(data, null, 2)
        );
      } catch (err) {
        log("jsonFileWriteFail", "error", config, [err]);
      }
      break;
    case "html":
      try {
        fs.promises.writeFile(`${fileName}`, data);
      } catch (err) {
        log("htmlFileWriteFail", "error", config, [err]);
      }
      break;
    default:
      return null;
  }
};
