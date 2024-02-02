import getChangedKeys from "./getChanges.js";
import setUpdates from "./setUpdates.js";

/**
 * Update and update specified elements in the data object.
 *
 * @param {object} data - The working data object to be updated.
 *  @property {object} htmlData - The object representing HTML data
 *  @property {object} langData - The object representing base language data
 * @returns {[object, string[]]} An array containing the updated data and the changed keys.
 */
export default (data) => {
  // Get keys that have changed for different element types
  const txtKeysToUpdate = getChangedKeys(data, "txtElems");
  const altKeysToUpdate = getChangedKeys(data, "altAttrElems");
  const titleKeysToUpdate = getChangedKeys(data, "titleAttrElems");
  const plchldrKeysToUpdate = getChangedKeys(data, "plchldrAttrElems");
  const metaKeysToUpdate = getChangedKeys(data, "metaElems");
  const changedKeys = [];

  changedKeys.push(
    ...txtKeysToUpdate,
    ...altKeysToUpdate,
    ...titleKeysToUpdate,
    ...plchldrKeysToUpdate,
    ...metaKeysToUpdate
  );

  // Update data based on changed keys for different element types
  data = setUpdates(txtKeysToUpdate, data, "txtElems");
  data = setUpdates(altKeysToUpdate, data, "altAttrElems");
  data = setUpdates(titleKeysToUpdate, data, "titleAttrElems");
  data = setUpdates(plchldrKeysToUpdate, data, "plchldrAttrElems");
  data = setUpdates(metaKeysToUpdate, data, "metaElems");

  return [data, changedKeys];
};
