export default {
  infoStart:
    "HTML-Text-Translator, by liondigits\x1b[0m\nhttps://liondigits.com",
  infoEnd: "All done!",
  backupStart: "Safe mode: ON. Starting backup...",
  backupFail: "Backup failed. No HTML and JSON file(s) found in source folder.",
  htmlStart: "Start processing HTML file: ${0}",
  htmlRead: "Read HTML file: ${0}",
  htmlList: "Found HTML file(s) to process:\n${0}\n",
  htmlReadFail: "Unable to load HTML data from folder:\n\n\t${0}",
  htmlNotFound:
    "Program terminated. No HTML file(s) found in folder\n\nHint:\n\tMake sure you have at least one HTML file in the source folder: ${0}\n\tYou can change the default folder path by running the config command.",
  htmlDone: "Done processing HTML file: ${0}",
  htmlEnd: "Done processing all HTML and JSON base files!",
  elementsFound:
    "Found a total of ${0} HTML elements with an existing data-id in this HTML file.\n\n${1} new HTML elements were found.\n",
  newElemsStart: "Start processing new HTML elements...",
  newElemsDone: "Done processing new HTML elements!",
  obsoleteKeys:
    "The following keys are obsolete and will be removed from the base JSON file: ${0}",
  writeFileStart: "Start writing to file ${0}...",
  mkdir: "Directory ${0} does not exist. Creating...",
  getFilesFail: "Unexpected error while reading folder content:\n\n\t${0}",
  jsonFileWriteFail: "Unexpected error while writing to JSON file:\n\n\t${0}",
  htmlFileWriteFail: "Unexpected error while writing to HTML file:\n\n\t${0}",
  backupWriteFail: "Unexpected error while writing to backup file:\n\n\t${0}",
  missingLang:
    "No base or target languages set. Run the config command or add a config file. See documentation for more info.",
  translateStart: "Starting translation(s)...",
  translateDisabled: "Translations are disabled.\n",
  translateNoKeys: "No changes found in base files. No translations needed.",
  langFileExists:
    "Found existing translation file for language: ${0}. Applying updates...",
  langFileNew:
    "No existing translation data found for language: ${0}. Creating new file...",
  fetchTranslation:
    "Fetching translations for ${0} text strings from the Google Translate API for language: ${1}...`",
  txtUpdateException:
    "WARNING: Unsupported target value while setting keys with text updates. This should not happen. Please report his issue.",
  getTxtChanges: "\nSearching for text changes in ${0}...",
  getTxtChangesException:
    "WARNING: Unsupported target value while getting keys with text updates. This should not happen. Please report his issue.",
  noChangesFound: "No changes found in ${0}.",
  txtChange: "txt value for txt-id ${0} has changed",
  attrChange: "txt value for ${0} attribute txt-id ${1} has changed",
  txtAdded: "Added txt-id ${0} to ${1} element",
  attrAdded: "Added ${0}=${1} to ${2} element",
  dryRun: "Translations are disabled in dry run mode.",
  dryRunStart:
    "Dry run mode: ON.\nNo files will be written.\nNo translations will be fetched from the Google Translate API.",
  jsonRead: "The base JSON file contains ${0} strings.",
  jsonNotFound: "No base file JSON data found. Continue without...",
  startStrip: "\nStripping txt-id's from HTML file: ${0}",
  configReadError: "Error while reading config file:\n ${0}",
};
