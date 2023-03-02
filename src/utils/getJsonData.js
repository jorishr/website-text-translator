import fs from "fs";

export default (src, fileName) => {
  try {
    const rawData = fs.readFileSync(`${src}/${fileName}`, "utf8");
    const data = JSON.parse(rawData);
    return data;
  } catch (e) {
    return null;
  }
};
