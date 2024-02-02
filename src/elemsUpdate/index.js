import getChangedKeys from "./getChanges.js";
import setUpdates from "./setUpdates.js";

/**
 * Update specified elements in the data object based on configuration.
 *
 * @param {object} data - The working data object to be updated.
 *  @property {object} htmlData - The object representing HTML data
 *  @property {object} langData - The object representing base language data
 * @param {object} config - The configuration object.
 * @returns {[object, string[]]} An array containing the updated data and the changed keys.
 */
export default (data, config) => {
  // Get keys that have changed for different element types
  const txtKeysToUpdate = getChangedKeys(data, "txtElems", config);
  const altKeysToUpdate = getChangedKeys(data, "altAttrElems", config);
  const titleKeysToUpdate = getChangedKeys(data, "titleAttrElems", config);
  const plchldrKeysToUpdate = getChangedKeys(data, "plchldrAttrElems", config);
  const metaKeysToUpdate = getChangedKeys(data, "metaElems", config);
  const changedKeys = [];

  changedKeys.push(
    ...txtKeysToUpdate,
    ...altKeysToUpdate,
    ...titleKeysToUpdate,
    ...plchldrKeysToUpdate,
    ...metaKeysToUpdate
  );

  // Update data based on changed keys for different element types
  data = setUpdates(txtKeysToUpdate, data, "txtElems", config);
  data = setUpdates(altKeysToUpdate, data, "altAttrElems", config);
  data = setUpdates(titleKeysToUpdate, data, "titleAttrElems", config);
  data = setUpdates(plchldrKeysToUpdate, data, "plchldrAttrElems", config);
  data = setUpdates(metaKeysToUpdate, data, "metaElems", config);

  return [data, changedKeys];
};
