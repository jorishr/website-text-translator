import fs from "fs";

export default (src, fileName) => {
  try {
    const rawData = fs.readFileSync(`${src}/${fileName}`, "utf8");
    const data = JSON.parse(rawData);
    //console.log(`Using JSON data from ${fileName}.\n`);
    return data;
  } catch (e) {
    //console.log(`Unable to load JSON data from folder.\n${e}\n`);
    return null;
  }
};
