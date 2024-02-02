import log from "./log.js";

export default (arr, msgSuccess, msgFail, vals) => {
  if (arr.length) log(msgSuccess, "info", vals);
  else log(msgFail, "info", vals);
};
