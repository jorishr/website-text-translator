#!/usr/bin/env node

import main from "../src/index.js";
import { Command } from "commander";
const program = new Command();

program
  .name("\nHTML-Text-Translator")
  .description(
    "Automatically translate the text in html files to multiple languages, store translations in JSON files and detect changes."
  )
  .version("0.1.0");

program
  .command("strip")
  .description(
    "Remove all txt-id's from the HTML file(s). No JSON files will be touched but the link with exisiting JSON translations will broken. Proceed with caution."
  )
  .action(() => {
    console.log("Strip HTML files");
  });

program.parse();

//main();
