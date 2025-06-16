# Changelog

## [0.11.2] - 2025-06-16

- dependency updates

## [0.11.1] - 2024-10-24

- for tasks with no data first check if there is `onError` block before throw an error
- if no `https.Agent` is presented for an environment then auto assign the minimum one
- dependency updates

## [0.11.0] - 2024-10-21

- implement `pause` operation [#286](https://github.com/Informatiqal/automatiqal/issues/286)
- dependency updates

## [0.10.2] - 2024-10-03

- skipped tasks are no longer removed from the workflow. Instead they are emitted but with `skipReason` property populated [#278](https://github.com/Informatiqal/automatiqal/issues/278)

## [0.10.1] - 2024-10-03

- **FIX** if task have a `source` but the sourced task is skipped due to `when` condition then the current task should be skipped as well (since its source is not ran) [#279](https://github.com/Informatiqal/automatiqal/issues/279)

## [0.10.0] - 2024-10-02

- ability to perform dry run [#6](https://github.com/Informatiqal/automatiqal/issues/6)
- dependency updates

## [0.9.2] - 2024-09-29

- initial check - presence of multiple or missing default environment when multiple environments are provided

## [0.9.1] - 2024-09-28

- updated to the latest schema

## [0.9.0] - 2024-09-27

- ability to specify multiple environments and https agents. The environments then can be specified on task level. Then the task will be ran against the specified environment. Think about migrating/moving entities between the environments, creating the same entities into multiple environments etc. [#239](https://github.com/Informatiqal/automatiqal/issues/239)
- dependency updates

## [0.8.2] - 2024-09-16

- change in loop logic to work with the new structure
- dependency updates

## [0.8.1] - 2024-09-12

- updated to the latest schema

## [0.8.0] - 2024-09-12

- Option to set batch processing for task entities [#263](https://github.com/Informatiqal/automatiqal/issues/263)

## [0.7.0] - 2024-09-11

- Option to set concurrency - process task entities N at the time (rolling N) [#262](https://github.com/Informatiqal/automatiqal/issues/262)

## [0.6.0] - 2024-09-11

- Option to set parallel or sequence execution for task entities [#261](https://github.com/Informatiqal/automatiqal/issues/261)
- dependency updates

## [0.5.2] - 2024-09-06

- and actually enabling the operations from 0.5.1

## [0.5.1] - 2024-09-06

- schema and composite triggers - `create`, `get` and `getAll` operations included
- dependency updates

## [0.5.0] - 2024-08-26

- task conditions - specify conditions when the task to be ran [#230](https://github.com/Informatiqal/automatiqal/issues/230)
- dependency updates

## [0.4.3] - 2024-07-15

- dependency updates

## [0.4.2] - 2024-07-15

- fix bug for non-loop and non-parallel tasks
- dependency updates

## [0.4.1] - 2024-07-12

- `httpsAgent`, `initialChecksList` and `disableSchemaValidation` are now provided as `options` (instead of named parameters)
- runbook schema update

## [0.4.0] - 2024-07-11

- Loops - allow task to be ran multiple times with different values [#241](https://github.com/Informatiqal/automatiqal/issues/241)

## [0.3.11] - 2024-06-06

- dependency updates

## [0.3.10] - 2024-06-06

- `app.uploadMany` included in the QSEoW operations list

## [0.3.9] - 2024-06-06

- schema version updated
- dependency updates

## [0.3.8] - 2024-06-04

- `app.uploadMany` enabled
- dependency updates

## [0.3.7] - 2024-05-28

- dependency updates

## [0.3.6] - 2024-04-23

- dependency updates

## [0.3.5] - 2024-02-25

- dependency updates

## [0.3.4] - 2024-02-18

- more SaaS operations are enabled
- dependency updates

## [0.3.3] - 2023-09-06

- mask sensitive data by default
- `unmaskSecrets` property in `options` to force unmask any sensitive data in the data response (not in the task)

## [0.3.2] - 2023-09-05

- `extension.download` is enabled
- added sensitive data prop for a few methods

## [0.3.1] - 2023-09-04

- updated with the latest `qlik-saas-api` package version

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
