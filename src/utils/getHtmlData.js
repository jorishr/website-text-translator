import fs from "fs";
import log from "./log/log.js";

export default (fileName, config) => {
  try {
    const rawData = fs.readFileSync(`${fileName}`, "utf8");
    log("htmlRead", "info", config, [fileName]);
    return rawData;
  } catch (e) {
    log("htmlReadFail", "error", config, [e]);
    return null;
  }
};
