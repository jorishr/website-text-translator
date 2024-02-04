import messages from "./messages.js";
import { config } from "../../../bin/commander/config/setConfig.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const configDefault = require("../../config.default.json");

export default (msg, type, vals = []) => {
  const useConfig = config || configDefault;
  if (useConfig.mode.logLevel === "verbose") {
    print(msg, type, vals);
  } else {
    if (type !== "info") {
      print(msg, type, vals);
    }
  }
};

function print(msg, type, vals = []) {
  switch (type) {
    case "error":
      if (!vals.length) {
        console.error("\x1b[31m" + getFullMsg(msg) + "\x1b[0m\n");
      } else {
        console.error("\x1b[31m" + writeMsg(msg, vals) + "\x1b[0m\n");
      }
      break;
    case "header":
      const header = buildHeader();
      console.log(header);
      break;
    case "logStartTask1":
      console.log("\x1b[3m" + getFullMsg(msg) + "\x1b[0m\n");
      break;
    case "logStartTask2":
      if (!vals.length) {
        console.log("\x1b[34m" + getFullMsg(msg) + "\x1b[0m\n");
      } else {
        console.log("\x1b[34m" + writeMsg(msg, vals) + "\x1b[0m\n");
      }
      break;
    case "done":
      if (!vals.length) {
        console.log("\x1b[96m" + getFullMsg(msg) + "\x1b[0m\n");
      } else {
        console.log("\x1b[96m" + writeMsg(msg, vals) + "\x1b[0m\n");
      }
      break;
    case "success":
      console.log("\n\x1b[4m\x1b[32m═══ " + getFullMsg(msg) + " ═══\x1b[0m\n");
      break;
    case "fail":
      console.log("\x1b[3m" + getFullMsg(msg) + "\x1b[0m\n");
      break;
    case "info":
      if (!vals.length) {
        console.log("" + getFullMsg(msg) + "");
      } else {
        console.log("" + writeMsg(msg, vals) + "");
      }
      break;
  }
}

function getFullMsg(msg) {
  return messages[msg];
}

function writeMsg(msg, vals) {
  const base = getFullMsg(msg);
  let str = base;
  for (let i = 0; i < vals.length; i++) {
    const id = "${" + i + "}";
    str = str.replace(id, vals[i]);
  }
  return str;
}

function formatStr(str, width) {
  const spacesToAdd = Math.max(0, width - str.length - 3);
  return " # " + str + " ".repeat(spacesToAdd);
}

function buildHeader() {
  const width = 69;
  const borderCharHor = "═";
  const cornerUpLeft = "╚";
  const cornerUpRight = "╝";
  const cornerDownLeft = "╔";
  const cornerDownRight = "╗";
  const cornerCharVer = "║";
  const textColor = "\x1b[34m";
  const bgColor = "\x1b[43m";
  const reset = "\x1b[0m";

  const title = formatStr(getFullMsg("title"), width);
  const author = formatStr(getFullMsg("author"), width);
  const website = formatStr(getFullMsg("website"), width);
  const github = formatStr(getFullMsg("github"), width);
  const topBorder = `${textColor}${bgColor}${cornerDownLeft}${borderCharHor.repeat(
    width
  )}${cornerDownRight}${reset}`;
  const bottomBorder = `${textColor}${bgColor}${cornerUpLeft}${borderCharHor.repeat(
    width
  )}${cornerUpRight}${reset}`;

  const headerStr = `${topBorder}
${bgColor}${textColor}${cornerCharVer}${title}${cornerCharVer}${reset}
${bgColor}${textColor}${cornerCharVer}${author}${cornerCharVer}${reset}
${bgColor}${textColor}${cornerCharVer}${website}${cornerCharVer}${reset}
${bgColor}${textColor}${cornerCharVer}${github}${cornerCharVer}${reset}
${bottomBorder}
`;
  return headerStr;
}
