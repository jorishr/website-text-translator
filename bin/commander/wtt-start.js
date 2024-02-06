#!/usr/bin/env node
import { Command } from "commander";
import main from "../../src/index.js";
import getConfig from "./config/getConfig.js";
import { setConfig } from "./config/setConfig.js";

const program = new Command();

program
  .option("--dry-run", "Dry run mode: no files will be written.")
  .option(
    "--translate-no",
    "No translations will be fetched from the translation service."
  )
  .option("--backup-no", "No backup will be created.")
  .option("--info-no", "Only basic info will be shown in the console.");

program.parse();

const config = getConfig();

const options = program.opts();
if (options.dryRun) config.mode.dryRun = true;
if (options.translateNo) config.mode.translate = false;
if (options.backupNo) config.mode.backup = false;
if (options.infoNo) config.mode.logLevel = "";

setConfig(config);
main();
