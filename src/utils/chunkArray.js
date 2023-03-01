export default (arr, chunkSize) => {
  let result = [];

  while (arr.length) {
    result.push(arr.splice(0, chunkSize));
  }

  return result;
};
