import fs from "fs";
import log from "./log/log.js";

export default (src, fileName, config) => {
  try {
    const rawData = fs.readFileSync(`${src}/${fileName}`, "utf8");
    log("htmlRead", "info", config, [fileName]);
    return rawData;
  } catch (e) {
    log("htmlReadFail", "error", config, [e]);
    return null;
  }
};
