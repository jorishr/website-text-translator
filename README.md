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

### Requirements

- Google Application Credentials: to fetch the translation strings from the Google Translate API you need to setup authentication for Google Cloud Services. Without, you will see an error message for an invalid API key. See [Getting started with Google Cloud Authentication](https://cloud.google.com/docs/authentication/getting-started)

### Configuration

### First run

### Handling updates and changes to your HTML files and/or JSON files

### How to load the translation files in your project

## Limitations

- Note that translations by the Google Translate API or any other service are not perfect. You should still review the translations and correct them manually, once the language JSON file(s) are generated.
- Adding additional text content to an existing html element that already has a translation id is tricky and not fully supported because it is very hard to predict all possible permutations. The program will detect text changes in the html file and will try to process the updates, but it is not guaranteed to work in all cases. If you need to add additional text content to an existing html element <em>with an existing translation id</em>, you have the following options:

  - Update the corresponding key-value pair in the JSON base language file. This is the recommended option. The program will detect the change and will update first the text in the base html file and then also fetch updated translation strings from the translation service and add them to the corresponding JSON translation files.
  - The second option is to wrap your addition in a new `<span>` element. The program will treat this as a new html element and will add a new translation id to it and also fetch updated translation strings from the translation service and add them to the corresponding JSON translation files.
  - The third option is to remove the existing translation id(s) from the existing element. The program will then treat this as a new html element and will add a new translation id to it, and also fetch updated translation strings from the translation service and add them to the corresponding JSON translation files. This is the cleanest options, but it can be a disadvantage if the existing string has corresponding translation strings that were manually corrected. The existing translation string will be deleted and replaced by a new translation string fetched from the translation service.
