#!/usr/bin/env node
import { Command } from "commander";
import { setConfig } from "./config/setConfig.js";
import strip from "../../src/utils/strip.js";
import backup from "../../src/utils/backup.js";
import readline from "readline";
import log from "../../src/utils/log/log.js";
import removeLangFiles from "../../src/utils/removeLangFiles.js";

const program = new Command();

program
  .description(
    "This command will remove all existing text-id's from all the HTML files."
  )
  .action(() => {
    setConfig();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      "This command will remove all existing text-id attributes from all the text elements in your HTML file(s). This action cannot be undone and your JSON translation file(s) will become obsolete.\n\nDo you want to continue? (y/n): ",
      (answer) => {
        if (answer.toLowerCase() === "y") {
          rl.question(
            "Do you want to create a backup before stripping? (y/n): ",
            async (answer) => {
              if (answer.toLowerCase() === "y") {
                backup();
              }

              await strip();
              rl.question(
                "You're HTML file(s) are now cleaned up.\nThis also means that your JSON base language file and JSON target language file(s) are now obsolete.\n\nDo you want to remove them? (y/n): ",
                async (answer) => {
                  rl.close();
                  if (answer.toLowerCase() === "y") {
                    await removeLangFiles();
                    log("programEnd", "success");
                  } else {
                    log("programEnd", "success");
                    process.exit(0);
                  }
                }
              );
            }
          );
        } else {
          log("programEnd", "success");
          process.exit(0);
        }
      }
    );
  });

program.parse();
