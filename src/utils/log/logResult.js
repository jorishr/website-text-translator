import log from "./log.js";
export default (arr, msgSuccess, msgFail, vals) => {
  if (arr.length !== 0) log(msgSuccess, "info", vals);
  else log(msgFail, "info", vals);
};
