#!/usr/bin/env node
import { Command } from "commander";
import log from "../src/utils/log/log.js";

// show header
log("infoStart", "header");

// commander program
const program = new Command();
program
  .name("wtt")
  .description(
    "Website-Text-Translator: Automatically translate the text in HTML files to multiple languages, store translations in JSON files and detect changes."
  )
  .version("0.1.1")
  .command("start", "Start the website-text-translator program.", {
    isDefault: true,
  })
  .command("config", "Create a config file.")
  .command("strip", "Strip all txt-id's from your existing HTML file(s).")
  .executableDir("commander");

program.parse();
