# Website-Text-Translator

![GitHub package.json version](https://img.shields.io/github/package-json/v/jorishr/website-text-translator?style=flat-square)
![GitHub](https://img.shields.io/github/license/jorishr/website-text-translator?style=flat-square)
![node-current](https://img.shields.io/node/v/website-text-translator?style=flat-square)

Automatically translate the text in html files to multiple languages, store translations in JSON files and detect changes.

- [Website-Text-Translator](#website-text-translator)
  - [What this program does](#what-this-program-does)
  - [Getting started](#getting-started)
    - [Definitions](#definitions)
    - [Configuration](#configuration)
      - [Pre-requisites](#pre-requisites)
      - [Backup](#backup)
      - [Folders](#folders)
    - [First run](#first-run)
      - [Dry run first](#dry-run-first)
      - [Output after first run](#output-after-first-run)
  - [Workflow and making changes to your HTML files](#workflow-and-making-changes-to-your-html-files)
    - [Nested text elements](#nested-text-elements)
    - [Adding and removing target languages](#adding-and-removing-target-languages)
    - [Strip all text-id's from existing HTML file(s)](#strip-all-text-ids-from-existing-html-files)
  - [Limitations and issues](#limitations-and-issues)
    - [Translation accuracy by third party services](#translation-accuracy-by-third-party-services)
    - [Whitespace issues](#whitespace-issues)
  - [Using a configuration file](#using-a-configuration-file)
    - [Config file](#config-file)
    - [Languages object](#languages-object)
    - [Modes](#modes)
    - [Selectors and exclusions](#selectors-and-exclusions)
    - [Text-id's](#text-ids)
    - [keyCounterOffset](#keycounteroffset)
    - [Change text update direction --experimental](#change-text-update-direction---experimental)
  - [How to load the translation files in your project](#how-to-load-the-translation-files-in-your-project)

## What this program does

The program will read and parse the HTML file(s) in the source folder. Upon first run unique and sequentially numbered text-id's are added to HTML elements that contain text nodes or elements that have translatable attributes values:

- text elements e.g. `<p>`, `<h1>`, `<span>`, etc.
- element attribute text values: `alt`, `title`, `placeholder`
- meta tag content: `description`, `keywords`

Thus for each text node or attribute text value a key is generated and stored in the data-attribute of each element, for example:

```html
<p data-text_id="[100]">Hello World!</p>
<a
  href="#"
  title="To the homepage"
  data-text_id="[101]"
  data-text_id__title="102"
  >Home</a
>
```

Next, the program will generate a base language JSON file containing the key-value pairs for each text node.

```json
{
  "100": "Hello World!",
  "101": "Home",
  "102": "To the homepage"
}
```

As a last step, the program will fetch translation strings from the Google Translate API and store them in a separate JSON language file for each target language.

```json
{
  "100": "¡Hola Mundo!",
  "101": "Inicio",
  "102": "A la página de inicio"
}
```

```json
{
  "100": "Hola món!",
  "101": "Inici",
  "102": "A la pàgina d'inici"
}
```

Importing these JSON files in your website project requires a separate discussion, see [How to load the translation files in your project](#how-to-load-the-translation-files-in-your-project).

Once your HTML document(s) have been processed for the first time, you can continue your development work and incorporate the translation process in your workflow by running the program again after you have added, removed or changed text elements in your document(s).

The program will parse the HTML files again and compare the changes your made to the existing key-value pairs in the base language file. Text from elements that have been removed in your HTML document will be deleted from the JSON language file(s). Elements that have been added will get a new text-id. Elements that have been changed will keep their existing text-id but the text value will be updated and a new translation string will be fetched from the Google Translate API.

## Getting started

### Definitions

- Base language: the language used for the text in your HTML document.
- Target language(s): the target language(s) to obtain translation strings for.
- Language file(s): JSON file(s) containing the key-value pairs for each language.

### Configuration

Run the script `npx wtt config` to start a series of command line prompts to set the essential configuration options like base language, target language(s), source folder, destination folder and backup functionality.

More advanced configuration options are available, see [Additional configuration options](#additional-configuration-options) for more information.

#### Pre-requisites

- Google Application Credentials: to fetch translation strings from the Google Translate API you need to setup authentication for Google Cloud Services. Without, you will see an error message for an invalid API key. See [Getting started with Google Cloud Authentication](https://cloud.google.com/docs/authentication/getting-started).

- The program can run without the Google Translate API. Run the command `npx wtt --translate-no` or set the `translate` option in the config file to `false`. In this case the program will only run the first part of the program: add txt-id's to the HTML files and generate the base language JSON file. No translation files will be generated.

- The code of the program is modular and could be modified to use different third party translations services without too much trouble. However, this is not part of the current state of the program. Feel free to experiment and contribute [Github: Website-text-translator](https://github.com/jorishr/website-text-translator).

- If your HTML document does not contain too much text and you don't want to use third party services, you can always manually add your own translations by creating your own JSON target language files that follow the same key-value pair structure as the base language JSON file generated by the program.

#### Backup

By default the program will create a numbered backup of your HTML (and related JSON files) in the backup folder. You can disable the backup feature by using the configuration wizard (`npx wtt config`), a command line flag `npx wtt --backup-no` or adding a config file in your app root folder.

_Important:_ If you do disable the backup feature, make sure you have a backup of your existing files elsewhere before running the program because they will be overwritten.

#### Folders

- Source folder: this is the base folder used to find HTML files. The program will look for HTML files recursively through all sub-folders. The default value is `"./"`, the root folder of your project.
- Destination folder: this is the folder where you JSON translation files will be stored. This folder must be the same as the source folder _or_ a sub-folder of the source folder. For example, if your source folder is `./src` then the destination folder can be `./src` or `./src/translations` or similar.

Note that your HTML files will be overwritten by the program because txt-id's need to be added to the original HTML. Hence, the importance of the backup option discussed above.

### First run

#### Dry run first

It is recommended to run the program in 'dry mode' first. In dry-mode no files will be generated or overwritten. In the terminal you will get to see a list of all the HTML elements that are detected by the program. This will give you an idea of how many elements will be processed and how many text-id's will be added to the HTML files. If you have multiple HTML documents or lots of text, you may want to limit the terminal log output: run `npx wtt start --dry-run` or `npx wtt --dry-run --info-no`.

#### Output after first run

To run the program, use the command: `npx wtt start`.

Now you should see the following files in your destination folder: a base language JSON file and a translation JSON file for each target language. All files are named with a prefix: `text_data_`. For example, `text_data_en.json`, `text_data_nl.json`, `text_data_fr.json`, etc.

Your HTML files will have been updated with txt-id's and each txt-id will have a corresponding translation string in the translation JSON file(s).

Also, a numbered backup folder with copies of your original HTML files will have been created.

## Workflow and making changes to your HTML files

Once the program has done it's work and you have HTML elements with txt-id's and corresponding key-value pairs in JSON translation files you can continue your regular development work. When you're done adding, changing or removing HTML, run the program again. Changes will be detected and dealt with automatically.

However, take into account the consideration and recommendations in this section.

- Keep the backup functionality enabled or at least make sure you have your work stored in a separate Git commit or backed up somewhere else _before_ you run the program.
- Simple text changes, addition or deletions for an HTML element with an existing text-id can be dealt with automatically by the program, for example:

```html
<!-- your original document -->
<p data-text_id="[105]">This is an original sentence that will be changed.</p>
<p data-text_id="[106]">This will be removed by future development work.</p>
<p data-text_id="[107]">This is an original sentence that remains unchanged.</p>

<!-- your development work introduces the following changes: -->
<p data-text_id="[105]">This sentence has been changed.</p>
<p data-text_id="[107]">This is an original sentence that remains unchanged.</p>
<p>This is a brand new sentence.</p>

<!-- result after running the program again: -->
<p data-text_id="[105]">This sentence has been changed.</p>
<p data-text_id="[107]">This is an original sentence that remains unchanged.</p>
<p data-text_id="[108]">This is a brand new sentence.</p>
```

In this case the program will have detected the changes automatically: the text change in the first sentence means that the key-value pair "[105]" in the JSON language file(s) will have been updated to the new string value. The element with the key "[106]" has been removed, which means that the corresponding key-value pair in the JSON languages file(s) will have been deleted as well. Lastly, the introduction of a new HTML text element leads to the addition of a new data attribute on the element and inside the JSON base language file you will find a new key-value pair: `{"108": "This is a brand new sentence"}`. In the target language files your will find corresponding translation strings fetched from the Google Translate API.

### Nested text elements

All nested elements are treated as separate text nodes by the program. This is perfectly fine when you run the program for the very first time.

The simple changes discussed above, however, are not the only changes that might occur and it's impossible to predict all possible permutations for an element with an _existing text-id_. For example, you may decide to add various span elements, an anchor tag and an `<em>` tag to a paragraph element with an existing text-id.

If you introduce such structural changes during your future development work it is highly recommended to _remove the existing text-id_ for that element.

Structural changes are changes that, for example, introduce additional HTML elements inside an existing element. Another example would be when you remove a span element from an existing paragraph. Every change that substantially changes the number or order of existing text nodes inside an element are considered structural changes that require removal of the existing text-id on the affected element(s).

By removing the existing text-id the program will generate a new key for each text node in the correct order and the old key-value pairs will be purged.

In the example below the paragraph has multiple text nodes and nested elements:

```html
<!-- your original html after the first run of the program -->
<p data-text_id="[100,101]">
  Hello, this is a paragraph that will undergo
  <em data-text_id="[102]">structural</em> changes.
</p>
```

The base language JSON file will looks like this:

```json
{
  "100": "Hello, this is a paragraph that will undergo ",
  "101": " changes.",
  "102": "structural"
}
```

```html
<!-- your development work introduces structural changes, so remove the text-id's: -->
<p>
  Hello, this paragraph underwent <em>structural</em> changes and now contains a
  <a href="#" title="To next section">section-link</a>.
</p>
<!-- final result after running the program again: -->
<p data-text_id="[110,111]">
  Hello, this paragraph underwent
  <em data-text_id="[112]">structural</em> changes and now contains a
  <a
    href="#"
    title="To next section"
    data-text-id="[113]"
    data-text_id__title="114"
    >section-link</a
  >.
</p>
```

The base language JSON file will contain the following key-value pairs:

```json
{
  "110": "Hello, this paragraph underwent ",
  "111": " changes and now contains a ",
  "112": "structural",
  "113": "section-link",
  "114": "To next section"
}
```

- Note that leading and trailing _single_ spaces will be respected by the program.
- Also note that text nodes that _only_ contain punctuation characters like "." or "!" will be ignored by the program if they are the very last child text node. They are separate text nodes and don't have to be part of the translation process. When loading translation strings into your website project these punctuation text nodes will remain unaffected.

### Adding and removing target languages

On each run the program will compare the existing target languages files with the array of languages in your configuration file. If a new target language is detected, the program will fetch additional translation strings and generate an additional language JSON file.

If you removed a target language from your configuration file and still have the corresponding JSON language file in the destination folder, the program will prompt you in the CLI to remove that file.

### Strip all text-id's from existing HTML file(s)

If you want to start all over with a clean slate, you can use the strip command.

The strip command will remove all text-id's from your HTML file(s). To run the strip program, use the command `npx wtt strip`.

The strip command will not touch the JSON language files, but the key-value pairs in your JSON language file(s) will no longer be linked to your HTML file(s). You will have to manually remove the JSON language files that are now obsolete.

## Limitations and issues

### Translation accuracy by third party services

Note that translations by the Google Translate API or any other service are not perfect. You should still manually review the translation strings and correct them if necessary. Make your corrections in the respective JSON language file(s) that are generated by the program.

### Whitespace issues

Text nodes with only whitespace will be ignored. Also, the program will try to normalize the text content by removing unnecessary double spaces, tabs and new lines that may have been introduced by accident. _Leading and trailing space are normalized to a single space_. This works well for most common cases, but there may be exceptions.

If you do encounter issues with leading or trailing whitespace you have two options to try:

- try adding or removing spaces manually in the string value in the language JSON file(s).
- remove the text-id on the affected element(s), including the parent element and wrap the problematic text into an additional `<span>` element.

If none of this suits your needs, open an issue on [GitHub: Website Text Translator](https://github.com/jorishr/website-text-translator/issues).

## Using a configuration file

### Config file

By running the `npx wtt config` command a config file named `wtt.config.json` is created in the root folder of your NPM project. The program will automatically detect and use this file. You can edit this file to manually configure various additional options.

### Languages object

Use the `languages` object to specify the base language and the target languages. The base language is the language of the text in your HTML file(s). The target languages are the languages you want to translate to. The program will generate a JSON file for each target language. Example:

```json
{
  "languages": {
    "base": "en",
    "targets": ["nl", "fr", "de"]
  }
}
```

### Modes

The program can be run with optional command line flags that change the behavior of the program. You can disable backups `npx wtt start --backup-no`; disable the third party translation service `npx wtt start --translate-no`; and run the program in dry-run mode `npx wtt --dry-run`. In dry mode no files are written.

By default you will see log messages in the terminal about the progress of the program. If you want to see less log messages in the terminal, use the flag `npx wtt start --info-no` or set the `logLevel` key to an empty string `""` in the config file.

```json
  "mode": {
    "dryRun": false,
    "backup": true,
    "translate": true,
    "logLevel": "verbose"
  },
```

### Selectors and exclusions

The program will ignore HTML elements _unless_ they are included in the `selectors` array in the (default) config file. For example, `<div>` elements are ignored by default as it is considered bad practice to have text lingering inside a container element. Wrap your text in a paragraph or span element.

Other exclusions by default:

- elements with the HTML attribute `translate="no"`,
- elements and textNodes that are empty or contain only whitespace,
- elements and textNodes that only contain a single special character like `&,.?!` etc.

Custom exclusions: You can tell the program to ignore HTML elements by class or id. Add the class or id to the respective `exclude` arrays in the config file.

The most common HTML elements are included by default. _No custom config required_. However, do review the list of selectors and add or remove element selectors according to your needs.

The default list of HTML elements that will be processed:

```js
[
  "head meta[name=description]",
  "head meta[name=keywords]",
  "head title",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "a",
  "strong",
  "em",
  "small",
  "cite",
  "abbr",
  "img",
  "picture",
  "input",
  "button",
];
```

To add additional elements or exclude HTML elements that are included by default, use a string value that is a valid selector for the JavaScript `querySelectorAll()` method, see [MDN: Document: querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll):

```json
{
  "elements": {
    "addSelector": ["div", "custom-tag"],
    "exclude": {
      "defaultSelectorToExclude": ["button", "head title", "abbr"],
      "classToExclude": [],
      "idToExclude": []
    }
  }
}
```

### Text-id's

The default text-id is for text nodes is `data-txt_id`. Modifiers are used for attribute text values: `data-txt_id__alt`, `data-txt__title`, `data-txt__placeholder`, etc. You can change these values in the config file. However, be careful: the `data` prefix is required for the text-id to be part of the HTML dataset attribute and the `__` modifiers are used in the program to identify the type of text. If you change the _structure_ of these identifiers, the program may no longer work as expected or throw an error that you will have to debug yourself.

### keyCounterOffset

The text-id's are numbered in sequence. The default offset is `100`, thus the first key will start at "100". If you want to start counting at a different value, set the `keyCounterOffset` value in the config file:

```json
{
  "keyCounterOffset": 100
}
```

### Change text update direction --experimental

By default the point of reference is the text content of the HTML file. This means that when the key-value pair inside the JSON base language file is compared to the text content of the corresponding HTML element and a change has been detected, the JSON file is updated with the value of the text content of the corresponding HTML element.

If you change the textUpdateDirection value to `jsonToHtml`, the update direction is reversed. This means that you should make the text changes in the JSON language file first. When you run the program, the HTML text content will be updated with the changes you made in the corresponding key-value pair in the JSON base language file.

This feature may be useful for simple and quick text updates. _However, this is experimental.Use with caution._

```json
{
  "textUpdateDirection": "jsonToHtml"
}
```

## How to load the translation files in your project

Your project will need a script that loads the translation strings from the respective JSON translation files. There are many ways to do this and explaining how to detect the user's language preferences or changes to the language settings is beyond the scope of this document.

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

There are other things to consider, like changing the language attribute of the HTML document itself. The code above does the job for the elements that are targeted with the default configuration.
