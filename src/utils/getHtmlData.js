import fs from "fs";
import log from "./log/log.js";

export default (src, fileName) => {
  try {
    const rawData = fs.readFileSync(`${src}/${fileName}`, "utf8");
    log("htmlRead", "info", [fileName]);
    return rawData;
  } catch (e) {
    log("htmlReadFail", "error", [e]);
    return null;
  }
};
