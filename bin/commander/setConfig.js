import mergeConfig from "./mergeConfig.js";

let config;
/**
 * Sets the final configuration object that will be used throughout the
 * application.
 *
 * @param {Object} config - Configuration object which includes modifications from CLI options, e.g. see wtt-start.js
 */
export function setConfig(useConfig) {
  config = useConfig || mergeConfig();
}

export { config };
