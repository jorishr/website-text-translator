import log from "../utils/log.js";
import translateApi from "@google-cloud/translate";
import chunkArray from "../utils/chunkArray.js";
//console.log(Translate);
const Translate = translateApi.v2.Translate;
const translate = new Translate();

export default async (data, target, type) => {
  log("fetchTranslation", "info", [type, target]);
  //Google Translate API has a limit of 128 strings per request
  //write an array with 135 strings of lorem ipsum text to test this
  if (data.length <= 128) {
    let [translations] = await translate.translate(data, target);
    translations = Array.isArray(translations) ? translations : [translations];
    return translations;
  } else {
    const translatedData = [];
    const chunks = chunkArray(data, 128);
    chunks.forEach(async (chunk) => {
      let [translations] = await translate.translate(chunk, target);
      translations = Array.isArray(translations)
        ? translations
        : [translations];
      translatedData.push(...translations);
    });
    return translatedData;
  }
};
