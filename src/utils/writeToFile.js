import fs from "fs";
import log from "./log/log.js";

export default async (dest, data, fileName, type) => {
  log("writeFileStart", "info", [fileName]);
  try {
    fs.accessSync(dest);
  } catch (e) {
    fs.mkdirSync(dest, { recursive: true });
    log("mkdir", "info", [dest]);
  }

  switch (type) {
    case "json":
      try {
        fs.promises.writeFile(
          `${dest}/${fileName}`,
          JSON.stringify(data, null, 2)
        );
      } catch (err) {
        log("jsonFileWriteFail", "error", [err]);
      }
      break;
    case "html":
      try {
        fs.promises.writeFile(`${dest}/${fileName}`, data);
      } catch (err) {
        log("htmlFileWriteFail", "error", [err]);
      }
      break;
    default:
      return null;
  }
};
