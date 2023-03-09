#!/usr/bin/env node
import { Command } from "commander";
import mergeConfig from "./mergeConfig.js";
import strip from "../../src/utils/strip.js";
import backup from "../../src/utils/backup.js";
const program = new Command();

program
  .description(
    "This command will remove all existing txt-id's from all the html files. A backup of the original files will be created in the default backup directory."
  )
  .action(() => {
    const config = mergeConfig();
    backup(config);
    strip(config);
  });

program.parse();
