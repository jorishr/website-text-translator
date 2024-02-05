export default {
  title: "Website-Text-Translator",
  author: "Author: Joris Raymaekers",
  website: "Visit: https://liondigits.com",
  github: "Github repo: https://github.com/jorishr/website-text-translator",
  programEnd: "All done!",
  backupStart: "Safe mode: ON. Starting backup...",
  backupFail: "Backup failed. No HTML and JSON file(s) found in source folder.",
  backupDone: "Backup completed.",
  htmlStart: "Start processing HTML file: ${0}",
  htmlRead: "Parsed HTML file: ${0}",
  htmlList: "Found HTML file(s) to process:\n${0}\n",
  htmlReadFail: "Unable to load HTML data from folder:\n\n\t${0}",
  htmlNotFound:
    "Program terminated. No HTML file(s) found in folder\n\nHint:\n\tMake sure you have at least one HTML file in the source folder: ${0}\n\tYou can change the default folder path by running the config command.",
  htmlDone: "Done processing HTML file: ${0}",
  htmlEnd: "Done processing all HTML and JSON base language file(s)!",
  elementsFound:
    "Found a total of ${0} HTML elements with an existing data-id.\n\n${1} new HTML elements were found.\n",
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
  translateStart: "Start processing translation file(s)...",
  translateEnd: "Done processing translations.",
  translateDisabled: "Processing translation files is disabled.\n",
  translateNoKeys:
    "No changes found in base files. Skipping translation tasks.\n",
  translateError1: "Translation error while processing ${0} for language ${1}.",
  translateError2: "Google Translate API error.\n\n\t${0}",
  langFileExists:
    "Found existing translation file for language: ${0}. Applying updates...",
  langFileNew:
    "No existing translation data found for language: ${0}. Creating new file...",
  langFileDone: "Done processing translation file for language: ${0}",
  addLangTargetsStart: "Start adding translation JSON file for language: ${0}.",
  addLangTargetsDone: "Done adding new target language(s): ${0}.",
  fetchTranslation:
    "Fetching translations for ${0} text strings from the Google Translate API for language: ${1}...`",
  textUpdateException:
    "WARNING: Unsupported target value while setting keys with text updates. This should not happen. Please report his issue.",
  getTextChanges: "Searching for text changes in ${0}...",
  getTextChangesException:
    "WARNING: Unsupported target value while getting keys with text updates. This should not happen. Please report his issue.",
  noChangesFound: "No changes found in ${0}.\n",
  textChange: "text value for text-id ${0} has changed",
  attrChange: "text value for ${0} attribute text-id ${1} has changed",
  textAdded: "Added text-id ${0} to ${1} element",
  attrAdded: "Added ${0}=${1} to ${2} element",
  dryRun: "Translations are disabled in dry run mode.",
  dryRunStart:
    "Dry run mode: ON.\nNo files will be written.\nNo translations will be fetched from the Google Translate API.",
  jsonRead:
    "The base language JSON file contains ${0} keys with a text value.\n",
  jsonNotFound:
    "No base language JSON file found. A new one will be generated...\n",
  stripStart: "\nStripping text-id's from HTML file: ${0}",
  stripEnd: "Done stripping text-id's from HTML file: ${0}",
  configReadError: "Error while reading config file:\n ${0}",
  config: {
    welcome: "Welcome to the Website-Text-Translator configuration wizard.",
    languages: {
      intro: "Let's get started with the language configuration.",
      info1:
        "1. Please enter the base language of your project.\n\nThis is the language that you used to write the text in your HTML files. Use two-letter language codes, e.g. 'en' for English, 'de' for German, 'fr' for French, etc.",
      prompt1: "\x1b[3mBase language:\x1b[0m ",
      info2:
        "2. Please enter the target languages to translate to.\n\nYou can specify multiple languages by separating them with a comma. Use two-letter language codes, e.g. 'en, de, fr' for English, German and French.",
      prompt2: "\x1b[3mTarget language(s):\x1b[0m ",
      inValid:
        "Invalid input. Please try again. Use two-letter language codes: e.g. 'en' for English, 'de' for German, 'fr' for French, etc. Target languages can be separated by a comma, e.g. 'en, de, fr' for English, German and French.",
      inValidEqual: "Base and target languages can't be the same.",
    },
    folders: {
      intro: "\x1b[34mLet's configure the input and output folder.\x1b[0m\n",
      info1:
        "1. Please enter the path to your source folder.\n\nThis is the folder where your HTML files are located. Use relative paths, e.g. './src'.\nThe program will look for HTML files in subfolders as well.\n\nLeave blank and hit ENTER to use the default folder. The default folder is the root folder of your current NPM project('./').",
      prompt1: "\x1b[3mSource folder:\x1b[0m ",
      info2:
        "2. Please enter the path to your destination folder.\n\nThis is the folder where the JSON translation files will be written to. Use relative paths, e.g. './src/translations'. If you specified a source folder in the previous step, make sure the destination folder is the same or a subfolder of the source folder. \n\nLeave blank and hit ENTER to use the default folder. This is the root folder of your current NPM project('./').",
      prompt2: "\x1b[3mDestination folder:\x1b[0m ",
      inValid:
        "Invalid input. Please try again.\nYour folder paths must be a string that starts with './', for example './src'.",
    },
    backup: {
      intro: "\x1b[34mLet's configure the backup functionality.\x1b[0m",
      info1:
        "1. By default the program will create a backup of your existing HTML files and the JSON translation files, before making any changes. This is the recommended option because your original files will be overwritten when processed by the program. Only disable backups if you want to handle backups manually.\n",
      prompt1: "\x1b[3mCreate backups? Type ('y' or 'n'):\x1b[0m ",
      info2:
        "2. Regardless of your choice to enable of disable backups, please specify a backup folder path. Use relative paths, e.g. './backup'. Leave blank and hit ENTER to use the default path: './backup'\n",
      prompt2: "\x1b[3mBackup folder:\x1b[0m ",
      inValid:
        "Invalid input. Please try again.\nType 'y' to enable backups or 'n' to disable backups.\nYour folder paths must be a string that starts with './', for example './backup'.",
    },
    end: "\n\x1b[34mConfiguration complete.\x1b[0m\n\nNow you can run the program:\n\n'wtt start'\n'wtt start --dry-run'\t\tRun the program without writing any files.\n'wtt help start'\t\tShow all options for the start command.\n'wtt help'\t\t\tShow all available commands.\n\nA configuration file 'wtt.config.json' was created in the root folder of your current NPM project. You can edit this file to change the configuration at any time or simply run the config command again. See documentation for more info.\n\n\x1b[3mNote:\x1b[0m to fetch translation strings from the Google Translate API, you need to configure Google Cloud Credentials on your system. See documentation for more info. To run the program without Google Translate API, use the command 'wtt start --translate-no' or set the 'translate' option to 'false' in the configuration file.",
  },
};
