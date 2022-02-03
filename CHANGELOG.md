# Changelog

## [0.0.5] - 2022-02-03

### Added

- task options are supported (`appendCustomProperties` and `appendTags`)
- perform checks before run anything:
  - check for duplicate task names
  - check if all presented operations actually exists
  - check if all tasks have filter/source (for operations that require them)

### Fixed

- various small fixes

## [0.0.4] - 2021-10-XX

### Fixed

## [0.0.3] - 2021-10-17

### Fixed

- handle more operation types
- handle operations which do not require initial data
- handle the case where sourced data is returning an object (for example `app.import`)
