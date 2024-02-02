#!/usr/bin/env node
import { Command } from "commander";
import { setConfig } from "./setConfig.js";
import strip from "../../src/utils/strip.js";
import backup from "../../src/utils/backup.js";

const program = new Command();

program
  .description(
    "This command will remove all existing txt-id's from all the HTML files. A backup of the original files will be created in the default backup directory."
  )
  .action(() => {
    setConfig();
    backup();
    strip();
  });

program.parse();
