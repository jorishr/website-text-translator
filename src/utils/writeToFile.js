import fs from "fs";

export default async (dest, data, fileName, type) => {
  console.log(`Start writing to file ${fileName}...`);
  try {
    fs.accessSync(dest);
  } catch (e) {
    fs.mkdirSync(dest, { recursive: true });
    console.log(`Directory ${dest} does not exist. Creating...`);
  }

  switch (type) {
    case "json":
      try {
        fs.promises.writeFile(
          `${dest}/${fileName}`,
          JSON.stringify(data, null, 2)
        );
      } catch (err) {
        console.log(`Unexpected error while writing to JSON file.\n`, err);
      }
      break;
    case "html":
      try {
        fs.promises.writeFile(`${dest}/${fileName}`, data);
      } catch (err) {
        console.log(`Unexpected error while writing to HTML file.\n`, err);
      }
      break;
    default:
      return null;
  }
};
