#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Command } from "commander";
import { createRequire } from "module";
import main from "../src/index.js";
import getJsonData from "../src/utils/getJsonData.js";
import log from "../src/utils/log/log.js";
const require = createRequire(import.meta.url);
const configDefault = require("../src/config.default.json");

//Commander program
const program = new Command();
program
  .name("HTML-Text-Translator")
  .description(
    "Automatically translate the text in html files to multiple languages, store translations in JSON files and detect changes."
  )
  .version("0.1.0");

program
  .option("--dry-run", "Dry run mode: no files will be written.")
  .option(
    "--translate-no",
    "No translations will be fetched from the translation service."
  )
  .option("--backup-no", "No backup will be created.")
  .option("--info-no", "Only basic info will be shown in the console.");

program.parse();

program
  .command("strip")
  .description(
    "Remove all txt-id's from the HTML file(s). No JSON files will be touched but the link with existing JSON translations will broken. Proceed with caution."
  )
  .action(() => {
    console.log("Strip HTML files");
  });

//merge config files
const configUserPath = path.resolve("./", "htt.config.json");
let config = configDefault;
let configUser = {};
try {
  if (fs.existsSync(configUserPath)) {
    configUser = getJsonData("./", "htt.config.json");
    config = createConfig(configDefault, configUser);
  }
} catch (err) {
  log("configReadError", "error", config, [err]);
}

function createConfig(configDefault, configCustom) {
  const config = { ...configDefault };
  for (const key in config) {
    if (configCustom.hasOwnProperty(key)) {
      config[key] = configCustom[key];
    }
  }
  return config;
}

const options = program.opts();
if (options.dryRun) config.mode.dryRun = true;
if (options.translateNo) config.mode.translate = false;
if (options.backupNo) config.mode.backup = false;
if (options.infoNo) config.mode.logLevel = "";

main(config);
