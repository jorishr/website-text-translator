import log from "../utils/log/log.js";
import translateApi from "@google-cloud/translate";
import chunkArray from "../utils/chunkArray.js";
import { normalizeSpaces } from "../utils/normalizeSpaces.js";

const Translate = translateApi.v2.Translate;
const translate = new Translate();

/**
 * Translates an array of strings using the Google Translate API.
 *
 * @param {string[]} data - Array of strings to be translated.
 * @param {string} target - Target language code for translation.
 * @param {string} type - Origin type of strings to translate: "updated" for existing values, "new" for new text values). For log purposes only.
 * @returns {Promise<string[]>} - A promise that resolves to an array of translated strings.
 */
export default async (data, target, type) => {
  try {
    log("fetchTranslation", "info", [type, target]);
    //Google Translate API has a limit of 128 strings per request
    if (data.length <= 128) {
      let [translations] = await translate.translate(data, target);
      translations = Array.isArray(translations)
        ? translations
        : [translations];
      return normalizeSpaces(data, translations);
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
      return normalizeSpaces(translatedData);
    }
  } catch (e) {
    log("translateError1", "error", [type, target]);
    log("translateError2", "error", [e.message]);
  }
};
