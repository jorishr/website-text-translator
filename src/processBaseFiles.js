import config from "./config.json" assert { type: "json" };
import getFileList from "./utils/getFileList.js";
import getJsonData from "./utils/getJsonData.js";
import getHtmlData from "./utils/getHtmlData.js";
import logResult from "./utils/logResult.js";
import writeFile from "./utils/writeToFile.js";
import parseHtml from "./parseHtml.js";
import processUpdates from "./elems_update/index.js";
import setNewElements from "./elems_add/_setNewElements.js";
import getObsoleteKeys from "./getObsoleteKeys.js";

export default (src, dest) => {
  const htmlFileList = getFileList(`${src}`, ".html");
  console.log(`List of file(s) to process: ${htmlFileList}\n`);
  //load existing language data json
  const srcLangData = getJsonData(src, config.fileNames.baseJson) || {};
  const keysInLangData = Object.keys(srcLangData);
  logResult(keysInLangData);
  //persist data over iterations
  const offset = Number(keysInLangData.at(-1)) + 1 || config.offset;
  let updatedData = {};
  let documents = [];
  let keysToTranslate = { changedKeys: [], newKeys: [] };
  for (let i = 0; i < htmlFileList.length; i++) {
    console.log(`\nStart processing HTML file: ${htmlFileList[i]}\n`);
    const langData = updatedData.langData || srcLangData;
    const html = getHtmlData(src, htmlFileList[i]);
    const htmlData = parseHtml(html);
    let data = Object.assign({}, { htmlData }, { langData });
    //updates require a base JSON file to compare against
    if (Object.keys(langData).length !== 0) {
      const [dataUpdates, changedKeys] = processUpdates(data);
      data = dataUpdates;
      keysToTranslate.changedKeys.push(...changedKeys);
    }
    data = setNewElements(data, offset);
    keysToTranslate.newKeys.push(...data.newKeys);

    const updatedHtml = data.htmlData.root.toString();
    writeFile(dest, updatedHtml, htmlFileList[i], "html");
    //persist data over iterations
    documents.push(data.htmlData.root);
    updatedData = data;
    console.log(`Done processing file: ${htmlFileList[i]}\n\n`);
  }
  const keysToDelete = getObsoleteKeys(updatedData, documents);
  keysToDelete.forEach((key) => {
    delete updatedData.langData[key];
  });
  writeFile(dest, updatedData.langData, config.fileNames.baseJson, "json");
  console.log(`\nDone processing HTML and JSON base files!\n\n`);
  return [updatedData, keysToTranslate, keysToDelete, offset];
};
