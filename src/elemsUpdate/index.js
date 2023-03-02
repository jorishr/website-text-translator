import getChangedKeys from "./getChanges.js";
import setUpdates from "./setUpdates.js";

export default (data) => {
  const txtKeysToUpdate = getChangedKeys(data, "txtElems");
  const altKeysToUpdate = getChangedKeys(data, "altAttrElems");
  const titleKeysToUpdate = getChangedKeys(data, "titleAttrElems");
  const plchldrKeysToUpdate = getChangedKeys(data, "plchldrAttrElems");
  const metaKeysToUpdate = getChangedKeys(data, "metaElems");
  data = setUpdates(txtKeysToUpdate, data, "txtElems");
  data = setUpdates(altKeysToUpdate, data, "altAttrElems");
  data = setUpdates(titleKeysToUpdate, data, "titleAttrElems");
  data = setUpdates(plchldrKeysToUpdate, data, "plchldrAttrElems");
  data = setUpdates(metaKeysToUpdate, data, "metaElems");
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
