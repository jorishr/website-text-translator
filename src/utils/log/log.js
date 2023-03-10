import messages from "./messages.js";

export default (msg, type, config, vals = []) => {
  if (config.mode.logLevel === "verbose") {
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
      console.log(
        "\n\x1b[4m\x1b[43m\x1b[34m\x1b[1m" + getFullMsg(msg) + "\x1b[0m\n"
      );
      break;
    case "start1":
      console.log("\x1b[3m" + getFullMsg(msg) + "\x1b[0m\n");
      break;
    case "start2":
      if (!vals.length) {
        console.log("\x1b[3m\x1b[34m" + getFullMsg(msg) + "\x1b[0m\n");
      } else {
        console.log("\x1b[3m\x1b[34m" + writeMsg(msg, vals) + "\x1b[0m\n");
      }
      break;
    case "done":
      if (!vals.length) {
        console.log("\n\x1b[3m" + getFullMsg(msg) + "\x1b[0m\n");
      } else {
        console.log("\n\x1b[3m" + writeMsg(msg, vals) + "\x1b[0m\n");
      }
      break;
    case "success":
      console.log("\x1b[4m\x1b[32m" + getFullMsg(msg) + "\x1b[0m\n");
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
