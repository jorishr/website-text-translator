import log from "../utils/log/log.js";
import translateApi from "@google-cloud/translate";
import chunkArray from "../utils/chunkArray.js";
const Translate = translateApi.v2.Translate;
const translate = new Translate();

export default async (data, target, type, config) => {
  log("fetchTranslation", "info", config, [type, target]);
  //Google Translate API has a limit of 128 strings per request
  if (data.length <= 128) {
    let [translations] = await translate.translate(data, target);
    translations = Array.isArray(translations) ? translations : [translations];
    return translations;
  } else {
    const translatedData = [];
    const chunks = chunkArray([...data], 128);
    for (let i = 0; i < chunks.length; i++) {
      let [translations] = await translate.translate(chunks[i], target);
      translations = Array.isArray(translations)
        ? translations
        : [translations];
      translatedData.push(...translations);
    }
    return translatedData;
  }
};
