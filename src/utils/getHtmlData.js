import fs from "fs";

export default (src, fileName) => {
  try {
    const rawData = fs.readFileSync(`${src}/${fileName}`, "utf8");
    console.log(`Read HTML data from ${fileName}.\n`);
    return rawData;
  } catch (e) {
    console.log(`Unable to load HTML data from folder.\n${e}\n`);
    return null;
  }
};
