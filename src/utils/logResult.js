export default (arr) => {
  if (arr.length !== 0)
    console.log(`The base JSON file contains ${arr.length} strings.\n`);
  else console.log("No base file JSON data found. Continue without...\n");
};
