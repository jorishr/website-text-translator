# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-02-06

Major new release that introduces breaking changes:

- Includes a thorough code review of all important modules;
- Includes revised configuration options;
- Adds JSDoc comments to all major functions;
- Improved error handling and info messages;
- Improved handling of nested text elements;
- Normalizes leading and trailing spaces in translation strings;
- Improved strip command to removed text-id's from HTML files;
- Various bug fixes and minor performance improvements;
- Improved documentation in [README](./README.md).

_Important notice_ when migrating from earlier versions: the new version will work with the existing language files and html files in your project but you must update the configuration file in your project. Delete the existing config file and run the config command to generate a new version: `npx wtt config`. Review the settings manually. See [README](./README.md) for more information about the new settings.

## [0.1.1] - 2023-03-10

### Fixed

- Fixed a bug where faulty folder paths would lead to reading/writing errors.

## [0.1.0] - 2023-03-09

### Added

First release of the project.
