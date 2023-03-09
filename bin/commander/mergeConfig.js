import fs from "fs";
import path from "path";
import { createRequire } from "module";
import getJsonData from "../../src/utils/getJsonData.js";
import log from "../../src/utils/log/log.js";
const require = createRequire(import.meta.url);
const configDefault = require("../../src/config.default.json");

export default () => {
  const configUserPath = path.resolve("./", "htt.config.json");
  let config = configDefault;
  let configUser = {};
  try {
    if (fs.existsSync(configUserPath)) {
      configUser = getJsonData("./", "htt.config.json");
      config = merge(configDefault, configUser);
    }
  } catch (err) {
    log("configReadError", "error", configDefault, [err]);
  }
  return config;
};

function merge(configDefault, configCustom) {
  const config = { ...configDefault };
  for (const key in config) {
    if (configCustom.hasOwnProperty(key)) {
      config[key] = configCustom[key];
    }
  }
  return config;
}
