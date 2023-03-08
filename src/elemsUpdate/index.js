import getChangedKeys from "./getChanges.js";
import setUpdates from "./setUpdates.js";

export default (data, config) => {
  const txtKeysToUpdate = getChangedKeys(data, "txtElems", config);
  const altKeysToUpdate = getChangedKeys(data, "altAttrElems", config);
  const titleKeysToUpdate = getChangedKeys(data, "titleAttrElems", config);
  const plchldrKeysToUpdate = getChangedKeys(data, "plchldrAttrElems", config);
  const metaKeysToUpdate = getChangedKeys(data, "metaElems", config);
  data = setUpdates(txtKeysToUpdate, data, "txtElems", config);
  data = setUpdates(altKeysToUpdate, data, "altAttrElems", config);
  data = setUpdates(titleKeysToUpdate, data, "titleAttrElems", config);
  data = setUpdates(plchldrKeysToUpdate, data, "plchldrAttrElems", config);
  data = setUpdates(metaKeysToUpdate, data, "metaElems", config);
  const changedKeys = [];
  changedKeys.push(
    ...txtKeysToUpdate,
    ...altKeysToUpdate,
    ...titleKeysToUpdate,
    ...plchldrKeysToUpdate,
    ...metaKeysToUpdate
  );
  return [data, changedKeys];
};
