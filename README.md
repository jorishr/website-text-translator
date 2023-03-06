# HTML-Text-Translator

![GitHub package.json version](https://img.shields.io/github/package-json/v/jorishr/html-text-translator?style=flat-square)
![GitHub](https://img.shields.io/github/license/jorishr/html-text-translator?style=flat-square)
![node-current](https://img.shields.io/node/v/html-text-translator?style=flat-square)

Automatically translate the text in html files to multiple languages, store translations in JSON files and detect changes.

- [HTML-Text-Translator](#html-text-translator)
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
    - [selectors and exclusions](#selectors-and-exclusions)
    - [text-id's](#text-ids)
    - [offset](#offset)
    - [folders](#folders)
    - [change direction](#change-direction)
    - [log level](#log-level)

## What to expect

The program will read and parse the html file(s) in the source folder. It will first add text-id's to HTML elements that contain text content:

- text elements e.g. `<p>`, `<h1>`, `<span>`, etc.
- element attributes: `alt`, `title`, `placeholder`
- meta tag content: `description`, `keywords`

A base JSON file will be generated with key-value pairs for each text element.

The program will then fetch translation strings from the Google Translate API and store them in a separate JSON file for each language.

## Getting started

### Languages

Define the base language and the languages you want to translate to in the config file. The base language is the language you used to write the text in your HTML files. The program will use this base language to generate the base JSON file.

The target languages are two letter language codes. For example: `en` for English, `nl` for Dutch, `fr` for French, etc. Set your target languages in the `targets` array in the config file.

### Backup

The program will create a numbered backup of your HTML and JSON files in the `backup` folder. Note that by default your existing HTML files will be overwritten, unless you set a different output folder. You can disable the backup feature by setting the `backup` boolean to `false` in the config file. If you do this, you should make sure you have a backup of your files before running the program or change the output folder to a different location.
Add the backup folder to your `.gitignore` file if you are using Git.

### Requirements

- At least one HTML file in the source folder or any of it's sub-folders.

- Google Application Credentials: to fetch the translation strings from the Google Translate API you need to setup authentication for Google Cloud Services. Without, you will see an error message for an invalid API key. See [Getting started with Google Cloud Authentication](https://cloud.google.com/docs/authentication/getting-started).
- The program can run without the Google Translate API. Set the `noTranslate` option in the config file to `true`. In this case the program will only run the first part of the program: add txt-id's to the HTML files and generate the base JSON file. No translation files will be generated.

### First run

### Handling future updates and changes to your HTML files and/or JSON files

Once you have HTML files with txt-id's and JSON file(s) with corresponding text data you need to be careful with updates to the HTML markup. The program has a backup functionality for a reason. Take into account the following recommendations:

- Simple text changes: make them directly in the base JSON file. For example:

  ```html
  <p data-txt_id="100">This a simple sentence.</p>
  ```

  ```json
  //write the new text at the corresponding txt_id in the base language JSON file
  {
    "100": "The new text."
  }
  ```

  Run the program and the HTML file will be updated as expected:

  ```html
  <p data-txt_id="100">The new text.</p>
  ```

  All translation files will be updated as well with a new translation string for the new text. All other translation strings will be left unchanged.

  <em>Note</em>: there is an experimental option that applies the updates in the other direction. This means that if you update the text of an HTML element <em>in the HTML file</em>, the program will detect the change and will update the base JSON file. This is not recommended but it is there if you need it. Set the `direction` string in the config file to `html2json` to enable this feature.

- <em>Important!</em> Structural changes to an existing HTML element <em>that already has one or more txt-id's</em>: It's impossible to predict all possible changes one can make to an existing element. Text may be added, removed entirely or partially, and one or more nested elements like `<em>` or `<a>` may be added or removed. To avoid errors and unexpected results, it is recommended to <em>remove all existing txt-id's that are already present on the element.</em> The program will then treat all your changes as new elements. New txt-id's will be added to the HTML element and your JSON files will be updated automatically with the new text and the corresponding translations, while the old obsolete key-pair values are purged.

### How to load the translation files in your project

## Limitations and known issues

- Note that translations by the Google Translate API or any other service are not perfect. You should still review the translations and correct them manually, once the language JSON file(s) are generated. Make your corrections in the respective JSON language file(s). These manual changes in your translation files will <em>not</em> be overwritten by the program, unless you make changes to the base language JSON and/or HTML file.
- Do <em>not</em> manually remove key-value pairs in the JSON files. The program will do this automatically when it detects that a key is no longer present in the HTML file. As explained in the section about [Handling future updates and changes to your HTML files and/or JSON files](#handling-future-updates-and-changes-to-your-html-files-andor-json-files), you can update the text values inside a JSON file, but do not remove keys manually. If you do so, the program will no longer be able to accurately assess which keys are obsolete and you may end up with orphaned text-id's in your HTML files.
- Whitespace issues: you yourself, linters and formatters may add or remove whitespace and new lines inside HTML element text. The program will try to normalize the text content by removing unnecessary double spaces, tabs and new lines. Also, elements with only whitespace will be ignored. This works well for most common case, but there may be exceptions. If you do encounter issues with whitespace, first try updating the text value in the base JSOn file or try wrapping the problematic text in a `<span>` element. If this does not work, please open an issue on GitHub.

## Additional configuration options

### selectors and exclusions

The program will ignore HTML elements unless they are included in the `selectors` array in the config file. For example, `<div>` elements are ignored by default. It is recommended to not have translatable text lingering around, wrap it in a `<p>` or `<span>`.

other exclusions by default:

- elements with the HTML attribute `translate="no"`
- elements and textNodes that are empty or contain only whitespace
- elements and textNodes that only contain a single special character like `&,.?!` etc.

Custom exclusions: You can tell the program to ignore HTML elements by class or id. Add the class or id to the respective `exclude` arrays in the config file.

### text-id's

The default text-id is `data-txt_id`. Modifiers are used for attribute text: `data-txt_id__alt`, `data-txt__title`, `data-txt__placeholder`, etc. You can change these in the config file. However, be careful: the `data` prefix is required for the id to be part of HTML dataset attribute, and the `__` modifiers are used in the program to identify the type of text. If you change these, the program may no longer work as expected or throw an error that you will have to debug.

### offset

The key-value pairs in the JSON language files are numbered in sequence. The default offset is `100`. If you want to start numbering at a different number, set the `offset` number in the config file.

### folders

By default the source folder is the root folder of your application. The program will try to find HTML files and relevant JSON files in this folder, including all sub-folders. All HTML files will processed but only JSON files with the prefix defined in the config file will be considered.

Note that the program will overwrite your existing HTML files by default. If you want to keep your existing HTML files, set the `dest` string in the config file to a different folder. The program will then write the updated HTML and JSON files to this folder.

The backup mode is enabled by default with copies of your original HTML and JSON files. You can change the backup folder in the config file.

### change direction

This experimental. See the section on [Handling future updates and changes to your HTML files and/or JSON files](#handling-future-updates-and-changes-to-your-html-files-andor-json-files).

### log level

The default log level is `verbose`. If you want less log messages in the terminal, set the `logLevel` string to an empty string `""` in the config file.
