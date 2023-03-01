# HTML-Text-Translator

Automatically translate html files to multiple languages, detect changes and store translations in a json files.

## What to expect

The program will read and parse the html file(s) in the source folder. It will first add text-id's to HTML elements that contain text content:

- text elements (e.g. `<p>`, `<h1>`, `<span>`, etc.)
- attributes (e.g. `alt`, `title` )
- meta tags (e.g. `description`, `keywords`)

A base JSON file will be generated with key-value pairs for each text element.

The program will then fetch translation strings from the Google Translate API and store them in a separate JSON file for each language.

## Getting started

### Backup

By default the program will create a versioned backup of your HTML and JSON files in the `backup` folder, because by default your existing HTML files will be overwritten. You can disable this feature by setting the `backup` boolean to `false` in the config file. If you do this, you should make sure you have a backup of your files before running the program or change the output folder to a different location.

### Requirements

- Google Application Credentials: to fetch the translation strings from the Google Translate API you need to setup authentication for Google Cloud Services. Without, you will see an error message for an invalid API key. See [Getting started with Google Cloud Authentication](https://cloud.google.com/docs/authentication/getting-started).

The program can run without the Google Translate API. Set the `noGoogle` option in the config file to `true`. In this case the program will only run the first part of the program: add txt-id's to the HTML files and generate the base JSON file. No translation files will be generated.

### Configuration

### First run

### How to load the translation files in your project

### Handling future updates and changes to your HTML files and/or JSON files

Once you have HTML files with txt-id's and JSON file(s) with corresponding text data you need to be careful with updates to the HTML markup. The program has a backup functionality for a reason. Take into account the following recommendations:

- Simple text changes: make them directly in the base JSON file. For example:

  ```html
  <p data-txt_id="100">This a simple sentence.</p>
  ```

  ```json
  //write the new text at the corresponding txt_id
  {
    "100": "The new text."
  }
  ```

  Run the program and the HTML file will be updated as expected:

  ```html
  <p data-txt_id="100">The new text.</p>
  ```

  All translation files will be updated as well with a new translation string for the new text. All other translation strings will be left unchanged.

  NOTE: there is an experimental option that applies the updates in the other direction. This means that if you update the text of an HTML element in the HTML file, the program will detect the change and will update the base JSON file. This is not recommended but it is there if you need it. Set the `direction` string in the config file to `html2json` to enable this feature.

- IMPORTANT! Structural changes to an existing HTML element <em>that already has one or more txt-id's</em>: It's impossible to predict all possible changes one can make to an existing element. Text may be added, removed entirely or partially, and one or more nested elements like `<em>` or `<a>` may be added or removed. To avoid errors and unexpected results, it is recommended to <em>remove all existing txt-id's that are already present on the element.</em> The program will then treat all your changes as new elements. New txt-id's will be added to the HTML and your JSON files will be updated automatically with the new text and the corresponding translations, while the old obsolete key-pair values are purged.

## Limitations and known issues

- Note that translations by the Google Translate API or any other service are not perfect. You should still review the translations and correct them manually, once the language JSON file(s) are generated. Make your updates in the respective JSON language file(s). These manual changes in your translation files will <em>not</em> be overwritten by the program, unless you make changes to the base language JSON and/or HTML file.
- Paragraphs with nested elements like `<em>` or `<strong>` may lose some of the spaces before or after the nested element. For example:

  ```html
  <p>This paragraph has a <em>nested</em> element.</p>
  ```

  may end up as:

  ```html
  <p>This paragraph has a<em>nested</em>element.</p>
  ```

  The solution is to add a non-breaking space (`&nbsp;`) before or after the nested element:

  ```html
  <p>This paragraph has a&nbsp;<em>nested</em>&nbsp;element.</p>
  ```

  The reason for this behavior is that the program trims the text content string for comparisons to exclude empty textNodes that are present in many HTML elements. If you see a more elegant solution, please open an issue on github.
