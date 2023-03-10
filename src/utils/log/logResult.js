import log from "./log.js";
export default (arr, msgSuccess, msgFail, config, vals) => {
  if (arr.length) log(msgSuccess, "info", config, vals);
  else log(msgFail, "info", config, vals);
};
