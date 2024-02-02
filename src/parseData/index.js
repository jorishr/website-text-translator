import getChangedKeys from "./getChanges.js";
import setUpdates from "./setUpdates.js";

/**
 * Identify and update specified elements in the data object.
 *
 * @param {object} data - The working data object to be updated.
 *  @property {object} htmlData - The object representing HTML data
 *  @property {object} langData - The object representing base language data
 * @returns {[object, string[]]} An array containing the updated data and the changed keys.
 */
export default (data) => {
  // Get keys that have changed for different element types
  const textKeysToUpdate = getChangedKeys(data, "textNodeElems");
  const altKeysToUpdate = getChangedKeys(data, "altAttributeElems");
  const titleKeysToUpdate = getChangedKeys(data, "titleAttributeElems");
  const placeholderKeysToUpdate = getChangedKeys(
    data,
    "placeholderAttributeElems"
  );
  const metaKeysToUpdate = getChangedKeys(data, "metaAttributeElems");
  const changedKeys = [];

  changedKeys.push(
    ...textKeysToUpdate,
    ...altKeysToUpdate,
    ...titleKeysToUpdate,
    ...placeholderKeysToUpdate,
    ...metaKeysToUpdate
  );

  // Update data based on changed keys for different element types
  data = setUpdates(textKeysToUpdate, data, "textNodeElems");
  data = setUpdates(altKeysToUpdate, data, "altAttributeElems");
  data = setUpdates(titleKeysToUpdate, data, "titleAttributeElems");
  data = setUpdates(placeholderKeysToUpdate, data, "placeholderAttributeElems");
  data = setUpdates(metaKeysToUpdate, data, "metaAttributeElems");

  return [data, changedKeys];
};
