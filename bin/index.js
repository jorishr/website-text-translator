#!/usr/bin/env node
import { Command } from "commander";
import log from "../src/utils/log/log.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const configDefault = require("../src/config.default.json");

// show header
log("infoStart", "header", configDefault);

// commander program
const program = new Command();
program
  .name("htt")
  .description(
    "HTML-Text-Translator: Automatically translate the text in html files to multiple languages, store translations in JSON files and detect changes."
  )
  .version("0.1.0")
  .command("start", "Start the html-text-translator program.", {
    isDefault: true,
  })
  .command("config", "Create a config file.")
  .command("strip", "Strip all txt-id's from your existing html file(s).")
  .executableDir("commander");

program.parse();
