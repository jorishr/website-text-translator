import getKeysWithTxtUpdates from "./getKeysWithTxtUpdates.js";
import setUpdates from "./setUpdates.js";

export default (data) => {
  const txtKeysToUpdate = getKeysWithTxtUpdates(data, "txtElems");
  const altKeysToUpdate = getKeysWithTxtUpdates(data, "altAttrElems");
  const titleKeysToUpdate = getKeysWithTxtUpdates(data, "titleAttrElems");
  const metaKeysToUpdate = getKeysWithTxtUpdates(data, "metaElems");
  data = setUpdates(txtKeysToUpdate, data, "txtElems");
  data = setUpdates(altKeysToUpdate, data, "altAttrElems");
  data = setUpdates(titleKeysToUpdate, data, "titleAttrElems");
  data = setUpdates(metaKeysToUpdate, data, "metaElems");
  const changedKeys = [];
  changedKeys.push(
    ...txtKeysToUpdate,
    ...altKeysToUpdate,
    ...titleKeysToUpdate,
    ...metaKeysToUpdate
  );
  return [data, changedKeys];
};
