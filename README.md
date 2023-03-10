# Website-Text-Translator

![GitHub package.json version](https://img.shields.io/github/package-json/v/jorishr/website-text-translator?style=flat-square)
![GitHub](https://img.shields.io/github/license/jorishr/website-text-translator?style=flat-square)
![node-current](https://img.shields.io/node/v/website-text-translator?style=flat-square)

Automatically translate the text in html files to multiple languages, store translations in JSON files and detect changes.

- [Website-Text-Translator](#website-text-translator)
  - [What to expect](#what-to-expect)
  - [Getting started](#getting-started)
    - [Languages](#languages)
    - [Backup](#backup)
    - [Requirements](#requirements)
    - [First run](#first-run)
    - [Handling future updates and changes to your HTML files and/or JSON files](#handling-future-updates-and-changes-to-your-html-files-andor-json-files)
    - [How to load the translation files in your project](#how-to-load-the-translation-files-in-your-project)
  - [Limitations and known issues](#limitations-and-known-issues)
  - [Additional configuration options](#additional-configuration-options)
    - [Config file](#config-file)
    - [Languages](#languages-1)
    - [Modes](#modes)
    - [Selectors and exclusions](#selectors-and-exclusions)
    - [Text-id's](#text-ids)
    - [Offset](#offset)
    - [Folders](#folders)
    - [Change direction](#change-direction)
  - [Strip all txt-id's from existing HTML file(s)](#strip-all-txt-ids-from-existing-html-files)

## What to expect

The program will read and parse the html file(s) in the source folder. It will first add text-id's to HTML elements that contain text content:

- text elements e.g. `<p>`, `<h1>`, `<span>`, etc.
- element attributes: `alt`, `title`, `placeholder`
- meta tag content: `description`, `keywords`

A base JSON file will be generated with key-value pairs for each text element.

The program will then fetch translation strings from the Google Translate API and store them in a separate JSON file for each language.

Import the JSON files in your project and use a custom JavaScript module to target the text-id's in your updated HTML and load the translation strings.

## Getting started

### Languages

You need to define the base language and the languages you want to translate to. The base language is the language you used to write the text in your HTML files. The program will use this base language to generate the base JSON file.

The base language and target languages are two letter language codes. For example: `en` for English, `nl` for Dutch, `fr` for French, etc.

To configure your languages run the config command `npx wtt config` or add a config file manually in your project folder. See [First run](#first-run) and [Additional configuration options](#additional-configuration-options) for more information.

### Backup

The program will create a numbered backup of your HTML and JSON files in the backup folder. Note that by default your existing HTML files will be overwritten, unless you set a different output folder. You can disable the backup feature by using the flag `npx wtt --backup-no` or by adding a config file in your app root folder. See [Additional configuration options](#additional-configuration-options) for more information. If you do disable the backup feature, make sure you have a backup of your files before running the program or change the output folder to a different location.
Add the backup folder to your `.gitignore` file if you are using Git.

### Requirements

- At least one HTML file in the source folder or any of it's sub-folders.

- Google Application Credentials: to fetch the translation strings from the Google Translate API you need to setup authentication for Google Cloud Services. Without, you will see an error message for an invalid API key. See [Getting started with Google Cloud Authentication](https://cloud.google.com/docs/authentication/getting-started).
- The program can run without the Google Translate API. Run the command `npx wtt --translate-no` or set the `translate` option in the config file to `false`. In this case the program will only run the first part of the program: add txt-id's to the HTML files and generate the base JSON file. No translation files will be generated.

### First run

First run the configuration wizard in the command line: `npx wtt config`.

To run the program in normal mode, use the command: `npx wtt start`.

It is recommended to run the program in 'dry mode' first to see a list of all the HTML elements that are detected by the program. This will give you an idea of how many elements will be processed and how many text-id's will be added to the HTML files. If your HTML files are very large, you may want to see only the basic log output. Run `npx wtt start --dry-run` or `npx wtt --dry-run --info-no`.

After your first run you should see the following files in your destination folder: a base JSON file and a translation JSON file for each target language. All files are named with a prefix: `txt_data_`. For example, `txt_data_en.json`, `txt_data_nl.json`, `txt_data_fr.json`, etc.

Your HTML files will have been updated with txt-id's and each txt-id will have a corresponding translation string in the translation JSON files.

Also, a numbered backup folder with copies of your original HTML files will have been created.

Next steps:

- [How to load the translation files in your project](#how-to-load-the-translation-files-in-your-project)
- [Handling future updates and changes to your HTML files and/or JSON files](#handling-future-updates-and-changes-to-your-html-files-andor-json-files)

### Handling future updates and changes to your HTML files and/or JSON files

Once you have HTML files with txt-id's and JSON file(s) with corresponding text data you need to be careful with updates to the HTML markup. The program has a backup functionality for a reason. Take into account the following recommendations:

- Simple text changes: make them directly in <em>the base JSON file</em>. The base JSON file is the file with the language code for the base language you set during the configuration. If your base language is English, this file is `txt_data_en.json`. For example:

  ```html
  <p data-txt_id="100">This a simple sentence.</p>
  ```

  Write the new text at the corresponding txt_id in the base language JSON file `txt_data_en.json`:

  ```json
  {
    "100": "The new text."
  }
  ```

  Run the program `npx wtt start` and the HTML file will be updated as expected:

  ```html
  <p data-txt_id="100">The new text.</p>
  ```

  All translation files will be updated as well with a new translation string for the new text. All other translation strings will be left unchanged.

  <em>Note</em>: there is an experimental option that applies the updates in the other direction. This means that if you update the text of an HTML element <em>in the HTML file</em>, the program will detect the change and will update the base JSON file. This is not recommended but it is there if you need it. See [Additional configuration options](#additional-configuration-options) for more information.

- <strong>Important!</strong> Structural changes to an existing HTML element <em>that already has one or more txt-id's</em>: It's impossible to predict all possible changes one can make to an existing element. Text may be added, removed entirely or partially, and one or more nested elements like `<em>` or `<a>` may be added or removed. To avoid errors and unexpected results, it is recommended to <em>remove all existing txt-id's that are already present on the affected element.</em> The program will then treat all your changes as new elements. New txt-id's will be added to the HTML element and your JSON files will be updated automatically with the new text and the corresponding translations, while the old obsolete key-pair values are purged.

### How to load the translation files in your project

Your project will need a script that loads the data from the respective JSON translation files. There are many ways to do this and explaining how to detect the user's language or changes to the language settings is beyond the scope of this document.

Here are the things you need to know and do, with some (pseudo code) examples.

```js
// import language data as data object from one of the JSON files
// example: if language === nl then import nl data
const data = require("./txt_data_nl.json");

function setElementTxt(data) {
  /* 
   Get the elements with the txt_id attribute
   The data-txt_id value is an array of numbers inside a string
   e.g. data-txt_id="[100, 101, 102]" when there are 3 text nodes inside the element
   e.g. data-txt_id="[100]" when there is only one text node inside the element
  */
  const txtElems = document.querySelectorAll("[data-txt_id]");
  txtElems.forEach((elem) => {
    const idArr = eval(elem.dataset.txt_id);
    if (elem.childNodes.length === 0) {
      elem.textContent = data[idArr[0]];
    } else {
      const textNodes = Array.from(elem.childNodes).filter(
        (node) => node.nodeType === 3 && node.textContent.trim().length
      );
      for (let i = 0; i < idArr.length; i++) {
        textNodes[i].textContent = data[idArr[i]];
      }
    }
  });
}

// attribute target can be "title", "alt", "placeholder", "meta"
// attribute id values: e.g. data-txt_id__title="100", data-txt_id__alt="101"
function setAttributeTxt(data, target) {
  const elems = document.querySelectorAll(`[data-txt_id__${target}]`);
  let name = target;
  if (target === "meta") name = "content";
  elems.forEach((elem) => {
    elem.setAttribute(name, data[elem.dataset[`txt_id__${target}`]]);
  });
}
setElementTxt(data);
setAttributeTxt(data, "title");
setAttributeTxt(data, "alt");
setAttributeTxt(data, "placeholder");
setAttributeTxt(data, "meta");
```

There are other things to consider, like changing the language attribute of the HTML document itself, but the code above should do the job for the elements that are targeted with the default configuration.

## Limitations and known issues

- Note that translations by the Google Translate API or any other service are not perfect. You should still review the translations and correct them manually, once the language JSON file(s) are generated. Make your corrections in the respective JSON language file(s). These manual changes in your translation files will <em>not</em> be overwritten by the program, unless you make changes to the base language JSON and/or HTML file.
- Do <em>not</em> manually remove key-value pairs in the JSON files. The program will do this automatically when it detects that a key is no longer present in the HTML file. As explained in the section about [Handling future updates and changes to your HTML files and/or JSON files](#handling-future-updates-and-changes-to-your-html-files-andor-json-files), you can update the text values inside a JSON file, but do not remove keys manually. If you do so, the program will no longer be able to accurately assess which keys are obsolete and you may end up with orphaned text-id's in your HTML files.
- Whitespace issues: you yourself, linters and formatters may add or remove whitespace and new lines inside HTML element text. The program will try to normalize the text content by removing unnecessary double spaces, tabs and new lines. Also, elements with only whitespace will be ignored. This works well for most common case, but there may be exceptions. If you do encounter issues with whitespace, first try updating the text value in the base JSON file or try wrapping the problematic text in a `<span>` element. If this does not work, please open an issue on GitHub.

## Additional configuration options

### Config file

By running the `npx wtt config` command a config file named `wtt.config.json` is created in the root folder of your NPM project. The program will automatically detect and use this file. You can edit this file to manually configure various options. But to avoid unexpected behavior, it is recommended to use the command line configuration wizard.

### Languages

Use the `languages` object to specify the base language and the target languages. The base language is the language of the text in your HTML files. The target languages are the languages you want to translate to. The program will generate a JSON file for each target language.

```json
{
  "languages": {
    "base": "en",
    "targets": ["nl", "fr", "de"]
  }
}
```

### Modes

The program can be run with optional flags that change the behavior of the program. You can disable backups `npx wtt start --backup-no`, disable the translation service `npx wtt start --translate-no` and run the program in dry-run mode `npx wtt --dry-run`. In dry mode no files are written. If you want to see less log messages in the terminal, use the flag `npx wtt start --info-no` or set the `logLevel` key to an empty string `""` in the config file.

```json
  "mode": {
    "dryRun": false,
    "backup": true,
    "translate": true,
    "logLevel": "verbose"
  },
```

### Selectors and exclusions

The program will ignore HTML elements unless they are included in the `selectors` array in the config file. For example, `<div>` elements are ignored by default. It is recommended to not have translatable text lingering around, wrap it in a `<p>` or `<span>`.

Other exclusions by default:

- elements with the HTML attribute `translate="no"`
- elements and textNodes that are empty or contain only whitespace
- elements and textNodes that only contain a single special character like `&,.?!` etc.

Custom exclusions: You can tell the program to ignore HTML elements by class or id. Add the class or id to the respective `exclude` arrays in the config file.

```json
{
  "elements": {
    "selectors": "head meta[name=description], head meta[name=keywords], head title, h1, h2, h3, h4, h5, h6, p, span, a, img, strong, em, input",
    "exclude": {
      "classesToExclude": [],
      "idsToExclude": []
    }
  }
}
```

### Text-id's

The default text-id is `data-txt_id`. Modifiers are used for attribute text: `data-txt_id__alt`, `data-txt__title`, `data-txt__placeholder`, etc. You can change these in the config file. However, be careful: the `data` prefix is required for the id to be part of HTML dataset attribute, and the `__` modifiers are used in the program to identify the type of text. If you change these, the program may no longer work as expected or throw an error that you will have to debug.

### Offset

The key-value pairs in the JSON language files are numbered in sequence. The default offset is `100`. If you want to start numbering at a different number, set the `offset` number in the config file.

```json
{
  "offset": 100
}
```

### Folders

By default the source folder is the root NPM folder of your application. The program will try to find HTML files and relevant JSON files in this folder, including all sub-folders. All HTML files will processed but only JSON files with the prefix defined in the config file will be considered.

Note that the program will overwrite your existing HTML files by default. If you want to keep your existing HTML files, set the `dest` string in the config file to a different folder. The program will then write the updated HTML and JSON files to this folder.

The backup mode is enabled by default with copies of your original HTML and JSON files. You can change the backup folder in the config file as well.

```json
  "folders": {
    "src": "./",
    "dest": "./",
    "backup": "./backup"
  }
```

### Change direction

This is an experimental feature. First read [Handling future updates and changes to your HTML files and/or JSON files](#handling-future-updates-and-changes-to-your-html-files-andor-json-files).

To change this setting you need a configuration file. Set the `direction` string in the config file to `html2json` to enable this feature.

Note: this feature is not tested and may result in unexpected behavior or errors. Use `--dry-mode` or make sure you have backups enabled.

```json
  "direction": {
    "direction": "",
    "default": "json2html"
  }
```

## Strip all txt-id's from existing HTML file(s)

The strip command will remove all txt-id's from your HTML file(s). This is useful if you want to start over with a clean slate. The strip program will not touch your JSON files, but the key-value pairs in your JSON file(s) will no longer be linked to your HTML file(s). You will have to manually remove the JSON files that are no longer needed.
To run the strip program, use the command `npx wtt strip`.
