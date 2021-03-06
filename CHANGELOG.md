# Changelog

## [0.0.13] - 2022-05-22

### Fixed

- `options.multiple` is applied correctly [#7](https://github.com/Informatiqal/automatiqal/issues/7)
- dependencies updates

## [0.0.12] - 2022-03-23

### Fixed

- rollback TypeScript version to `4.5.5`. Some issue with `4.6.2` was preventing normal execution

## [0.0.11] - 2022-03-14

### Fixed

- `runBook` content is exposed in `Automatiqal` instance
- all internal/private methods are now really private and are not visible anymore in the instance (`#methodName`)

## [0.0.10] - 2022-03-04

- `onError` implementation - tasks accept `onError` workflow that is executed if the task returns an error
- initial checks are performed for `onError` tasks as well
- initial checks are NOT performed for tasks with `skip: true`

### Fixed

## [0.0.9] - 2022-03-02

### Added

- option to specify which initial checks to be performed (default is all) [#8](https://github.com/Informatiqal/automatiqal/issues/8)
- initial checks for source type - check if the `operation` of the current task is the same type as the `source` task [#2](https://github.com/Informatiqal/automatiqal/issues/2)

## [0.0.8] - 2022-02-21

### Changed

- `operation` parameter for tasks is mandatory
- documentation preparations

## [0.0.7] - 2022-02-21

### Added

- `skip` parameter can be added to each task. If `skip` is set to `true` then the task will be ignored
- updated list with allowed operations
- `environment` parameter is optional. It defaults to `windows` is missing [#5](https://github.com/Informatiqal/automatiqal/issues/5)

## [0.0.6] - 2022-02-15

### Added

- check for invalid custom property name (when created)
- multiple task related changes
  - handle `export` and `exportMany` operations (including saving the files)
- more error messages
- a lot more operations are supported

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
