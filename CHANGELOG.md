# Changelog

## [0.3.0] - 2023-09-03

- the initial work for integrating SaaS package is done. At the moment only few methods are exposed but the rest will be added in the near future
- started adding the base tests for SaaS
- dependency updates

## [0.2.20] - 2023-06-07

- allow `ReadStream` to be passed when the operation is about uploading files (apps, content libraries, extensions etc.)
- fix issue with Buffer/ReadStream when replacing special variables
- dependency updates

## [0.2.19] - 2023-06-05

- dependency updates (mainly for `qlik-repo-api`)

## [0.2.18] - 2023-06-04

- schema updated

## [0.2.17] - 2023-06-02

- schema updated
- `ajv-errors` is added as dependency

## [0.2.16] - 2023-06-01

- removed dependency on `uuid` package. It was causing some issue after building. Instead using `crypto.randomUUID` native function

## [0.2.15] - 2023-06-01

- fix issue where binary data type was changed when special variables were replaced [#183](https://github.com/Informatiqal/automatiqal/issues/183)
- dependency updates

## [0.2.14] - 2023-05-28

- dependency updates

## [0.2.13] - 2023-05-26

- mask sensitive data in the task result data [#177](https://github.com/Informatiqal/automatiqal/issues/177). The following properties will be masked:
    - certificate.export:
        - certificatePassword
    - dataConnection.create:
        - password
    - dataConnection.update:
        - password
    - extension.import:
        - password
    - virtualProxy.create:
        - jwtPublicKeyCertificate
        - oidcClientSecret
    - virtualProxy.update:
        - jwtPublicKeyCertificate
        - oidcClientSecret

## [0.2.12] - 2023-05-20

- additional initial check for tasks containing `#`

## [0.2.11] - 2023-05-12

- (internal) re-work of how inline variables are replaced
- composite and schema triggers methods are now recognized
- `automatiqal-schema` updated to v0.6.0

## [0.2.10] - 2023-05-07

- few small bug fixes
- started writing tests
- testing moved to `vitest`. `mocha` and `chai` dependencies are dropped

## [0.2.8] - 2023-03-16

- schema dependency update

## [0.2.7] - 2023-03-06

- correctly populate the values for inline variables

## [0.2.6] - 2023-03-04

- json schema dependency update. See [automatiqal-cli-schema#13](https://github.com/Informatiqal/automatiqal-cli-schema/issues/13)

## [0.2.5] - 2023-03-04

- json schema dependency update. See [automatiqal-cli-schema#12](https://github.com/Informatiqal/automatiqal-cli-schema/issues/12)

## [0.2.4] - 2023-03-03

- various small code improvements

## [0.2.0] - 2023-02-06

- schema validation before run

## [0.1.0] - 2023-02-05

- support special variables

## [0.0.17] - 2022-12-27

- dependency updates
- required NodeJS version >= 16.0.0

## [0.0.16] - 2022-12-23

- few small bug fixes
- all dependencies are up-to date

## [0.0.14] - 2022-12-16

- inline/source details variables [Informatiqal/automatiqal-cli#92](https://github.com/Informatiqal/automatiqal-cli/issues/92)

## [0.0.13] - 2022-05-22

### Fixed

- `options.multiple` is applied correctly [#7](https://github.com/Informatiqal/automatiqal/issues/7)
- dependencies updates

## [0.0.12] - 2022-03-23

- rollback TypeScript version to `4.5.5`. Some issue with `4.6.2` was preventing normal execution

## [0.0.11] - 2022-03-14

- `runBook` content is exposed in `Automatiqal` instance
- all internal/private methods are now really private and are not visible anymore in the instance (`#methodName`)

## [0.0.10] - 2022-03-04

- `onError` implementation - tasks accept `onError` workflow that is executed if the task returns an error
- initial checks are performed for `onError` tasks as well
- initial checks are NOT performed for tasks with `skip: true`

## [0.0.9] - 2022-03-02

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

- check for invalid custom property name (when created)
- multiple task related changes
    - handle `export` and `exportMany` operations (including saving the files)
- more error messages
- a lot more operations are supported

## [0.0.5] - 2022-02-03

- task options are supported (`appendCustomProperties` and `appendTags`)
- perform checks before run anything:

    - check for duplicate task names
    - check if all presented operations actually exists
    - check if all tasks have filter/source (for operations that require them)

- various small fixes

## [0.0.4] - 2021-10-XX

## [0.0.3] - 2021-10-17

- handle more operation types
- handle operations which do not require initial data
- handle the case where sourced data is returning an object (for example `app.import`)
