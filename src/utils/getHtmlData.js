import fs from "fs";
import log from "./log/log.js";

export default (fileName) => {
  try {
    const rawData = fs.readFileSync(`${fileName}`, "utf8");
    log("htmlRead", "info", [fileName]);
    return rawData;
  } catch (e) {
    log("htmlReadFail", "error", [e]);
    return null;
  }
};
