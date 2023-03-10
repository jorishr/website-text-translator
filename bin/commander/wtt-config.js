import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import messages from "../../src/utils/log/messages.js";
import writeTofile from "../../src/utils/writeToFile.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const configDefault = require("../../src/config.default.json");
const merge = require("deepmerge");

export default async function config() {
  const msg = messages.config;
  const rl = readline.createInterface({ input, output });
  console.log(msg.welcome + "\n");
  const [langBase, langTargets] = await getInput(msg, rl, "languages");
  const [src, dest] = await getInput(msg, rl, "folders");
  const [backup, backupDir] = await getInput(msg, rl, "backup");
  const source = src || configDefault.folders.src;
  const destination = dest || configDefault.folders.dest;
  const backupFolder = backupDir || configDefault.folders.backup;
  const targets = langTargets.replace(/ /g, "").split(",");
  let backupMode = configDefault.mode.backup;
  if (backup) backupMode = setBackupMode(backup);
  const config = merge(configDefault, {
    languages: { base: langBase, targets: targets },
    folders: { src: source, dest: destination, backup: backupFolder },
    mode: {
      backup: backupMode,
    },
  });
  writeTofile("./", config, "wtt.config.json", "json", config);
  console.log(msg.end + "\n");
  rl.close();
}

config();

async function getInput(msg, rl, target) {
  console.log("\n\x1b[34m" + msg[target].intro + "\x1b[0m\n");
  console.log(msg[target].info1 + "\n");
  const data1 = await rl.question(msg[target].prompt1);
  console.log("\n" + msg[target].info2 + "\n");
  const data2 = await rl.question(msg[target].prompt2);
  let isValid = false;
  if (target === "languages") isValid = validateLang(data1, data2);
  if (target === "folders") isValid = validatePath(data1, data2);
  //no need to validate backup data1, it'll be validated in setBackupMode
  if (target === "backup") isValid = validatePath(data2);
  if (!isValid) {
    console.log("\n\x1b[31m" + msg[target].inValid + "\x1b[0m");
    return getInput(msg, rl, target);
  } else return [data1, data2];
}

function setBackupMode(backup) {
  switch (backup) {
    case "y":
      return true;
    case "yes":
      return true;
    case "n":
      return false;
    case "no":
      return false;
    default:
      return true;
  }
}

function validateLang(base, targets) {
  if (base === targets || targets.includes(base)) {
    console.log(
      "\n\x1b[31m" + messages.config.languages.inValidEqual + "\x1b[0m"
    );
    return false;
  }
  //regex that matches 2 lowercase letter language codes
  const regex1 = /^[a-z]{2}$/;
  //write a regex that matches 2 lowercase letter language codes separated by commas, spaces after the comma are optional
  const regex2 = /^[a-z]{2}(, ?[a-z]{2})*$/;
  if (regex1.test(base) && regex2.test(targets)) return true;
  return false;
}

function validatePath(...args) {
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("./") && args[i].length) return false;
  }
  return true;
}
