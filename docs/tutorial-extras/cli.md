# CLI Reference

## `init` command

Initialize a new Basketry project with the `basketry init` command.

Example:

```
basketry init
```

<!-- BEGIN GENERATED COMMAND ARGS: init -->

### Options

#### `--config`, `-c` (string)

Path to the config file. The default value is `basketry.config.json`.

#### `--json`, `-j` (boolean)

Outputs the result of the command as a JSON-formatted object. If ommitted, the CLI will output human-readable progress, results, and pretty-printed errors to `stdout`.

#### `--parser`, `-p` (string)

The parser thet corresponds to the source SDL file. This must be a string value that refers to a parser module. Any "requirable" value can be used such as globally or locally installed NPM package or the path to a file on your local file system.

#### `--perf` (boolean)

Report performance

#### `--source`, `-s` (string)

Path to the source SDL file. Basketry reads from `stdin` if this option is omitted and `source` is not defined in the config file. Note that if a source parameter is provided _and_ content is piped in via `stdin`, the content from `stdin` will be parsed, but any violations will include the file name supplied by `source`. This can be useful to a validate dirty version of a file prior to the file being saved and only then accessible by reading from the file system.

<!-- END GENERATED COMMAND ARGS: init -->

## `generate` command

Generate code with the `basketry generate` command or just `basketry`.

<!-- BEGIN GENERATED COMMAND ARGS: generate -->

### Options

#### `--config`, `-c` (string)

Path to the config file. The default value is `basketry.config.json`.

#### `--generators`, `-g` (string)

Generators

#### `--json`, `-j` (boolean)

Outputs the result of the command as a JSON-formatted object. If ommitted, the CLI will output human-readable progress, results, and pretty-printed errors to `stdout`.

#### `--output`, `-o` (string)

All generated files will be written to the specified output directory. Some generators may elect to write files to a subdirectory within the main output directory. Writes to the current working directory if omitted and `output` is not defined in the config file.

#### `--parser`, `-p` (string)

The parser thet corresponds to the source SDL file. This must be a string value that refers to a parser module. Any "requirable" value can be used such as globally or locally installed NPM package or the path to a file on your local file system.

#### `--perf` (boolean)

Report performance

#### `--rules`, `-r` (string)

Rules

#### `--source`, `-s` (string)

Path to the source SDL file. Basketry reads from `stdin` if this option is omitted and `source` is not defined in the config file. Note that if a source parameter is provided _and_ content is piped in via `stdin`, the content from `stdin` will be parsed, but any violations will include the file name supplied by `source`. This can be useful to a validate dirty version of a file prior to the file being saved and only then accessible by reading from the file system.

#### `--validate`, `-v` (boolean)

Only validates the source document without writing any files.

#### `--watch`, `-w` (boolean)

Recreates the output each time the input file changes. In watch mode, `source` must be specified (you can't pipe to `stdio`). Running in watch mode will immediately generate all output files and then update them on each subsequent change to the source SDL file.

<!-- END GENERATED COMMAND ARGS: generate -->

## `validate` command

Validate the source per the supplied rules with the `basketry validate` command (previously `basketry --validate`). This command will run the parser and rules, but will not generate any files.

<!-- BEGIN GENERATED COMMAND ARGS: validate -->

### Options

#### `--config`, `-c` (string)

Path to the config file. The default value is `basketry.config.json`.

#### `--json`, `-j` (boolean)

Outputs the result of the command as a JSON-formatted object. If ommitted, the CLI will output human-readable progress, results, and pretty-printed errors to `stdout`.

#### `--parser`, `-p` (string)

The parser thet corresponds to the source SDL file. This must be a string value that refers to a parser module. Any "requirable" value can be used such as globally or locally installed NPM package or the path to a file on your local file system.

#### `--perf` (boolean)

Report performance

#### `--rules`, `-r` (string)

Rules

#### `--source`, `-s` (string)

Path to the source SDL file. Basketry reads from `stdin` if this option is omitted and `source` is not defined in the config file. Note that if a source parameter is provided _and_ content is piped in via `stdin`, the content from `stdin` will be parsed, but any violations will include the file name supplied by `source`. This can be useful to a validate dirty version of a file prior to the file being saved and only then accessible by reading from the file system.

<!-- END GENERATED COMMAND ARGS: validate -->

## `clean` command

Remove previously generated files with the `basketry clean` command.

<!-- BEGIN GENERATED COMMAND ARGS: clean -->

### Options

#### `--config`, `-c` (string)

Path to the config file. The default value is `basketry.config.json`.

#### `--json`, `-j` (boolean)

Outputs the result of the command as a JSON-formatted object. If ommitted, the CLI will output human-readable progress, results, and pretty-printed errors to `stdout`.

#### `--output`, `-o` (string)

All generated files will be written to the specified output directory. Some generators may elect to write files to a subdirectory within the main output directory. Writes to the current working directory if omitted and `output` is not defined in the config file.

#### `--perf` (boolean)

Report performance

<!-- END GENERATED COMMAND ARGS: clean -->

## `ci` command

Verifies that:

1. Re-running the generator does not produce any changes to generated files
1. There are no rule violations
1. There are no errors encountered when running any of the pipeline components

This command is designed to run in a Continuous Integration pipeline to ensure that the generator has been run and that there haven't been any manual changes made to any generated files. If any of those three checks find something, the process will exit with a non-zero code.

(Note that the changes that _only_ affect the version number in the generated file header will be ignored.)

<!-- BEGIN GENERATED COMMAND ARGS: ci -->

### Options

#### `--config`, `-c` (string)

Path to the config file. The default value is `basketry.config.json`.

#### `--generators`, `-g` (string)

Generators

#### `--json`, `-j` (boolean)

Outputs the result of the command as a JSON-formatted object. If ommitted, the CLI will output human-readable progress, results, and pretty-printed errors to `stdout`.

#### `--output`, `-o` (string)

All generated files will be written to the specified output directory. Some generators may elect to write files to a subdirectory within the main output directory. Writes to the current working directory if omitted and `output` is not defined in the config file.

#### `--parser`, `-p` (string)

The parser thet corresponds to the source SDL file. This must be a string value that refers to a parser module. Any "requirable" value can be used such as globally or locally installed NPM package or the path to a file on your local file system.

#### `--rules`, `-r` (string)

Rules

#### `--severity` (string)

The minimum violation severity level that will fail the command. The default value is `warning`.

Possible values:

- `error`
- `warning`
- `info`

#### `--source`, `-s` (string)

Path to the source SDL file. Basketry reads from `stdin` if this option is omitted and `source` is not defined in the config file. Note that if a source parameter is provided _and_ content is piped in via `stdin`, the content from `stdin` will be parsed, but any violations will include the file name supplied by `source`. This can be useful to a validate dirty version of a file prior to the file being saved and only then accessible by reading from the file system.

<!-- END GENERATED COMMAND ARGS: ci -->

## `diff` command

⚠️ This feature is experimental! You can help by [reporting bugs](https://github.com/basketry/basketry/issues). ⚠️

Compare against another version of a service definition with the `basketry diff` command. Either `--previous` or `--ref` must be supplied.

Used the `--previous` option to compare against another file on the file system:

```
basketry diff --previous petstore-prod.json
```

Used the `--ref` option to compare against a git ref (eg. branch name, tag name, commit sha, etc):

```
basketry diff --ref origin/main
```

The command compares the source file specified in the config with a previous source file path. The command assumes that the previous source file describes the service as it currently exists in a production environment and that the source file specified in the config describes the proposed new definition. Breaking changes are determined based on the difference between the proposed changes compared and the current production state.

Change disposition is determined based on a similar mental model to [Semver](https://semver.org/):

- **Breaking changes (major):** you made incompatible API changes.
- **Non-breaking changes (minor):** you added (or removed) functionality in a backwards compatible manner.
- **Other changes (patch):** you changed the API, but not in a manner that _functionally_ affects consumers (eg. descriptions, etc).

Use the `--filter` option to filter to a minimum semver change level. See the docs below for more detail.

If your service has a semver-complient version, then it is recommended that you increment the value corresponding to the _highest_ semver change level.

For example, if the original service version was `v2.6.3`, and `basketry diff` detected both `minor` and `patch` changes, then the _highest_ semver change level is `minor` making the recommended new version `v2.7.0`. Alternatively, if only `major` changes are detected, then the _highest_ semver change level is `major` making the recommended new version `v3.0.0`.

Exact versioning strategies may vary between projects, but `basketry diff` and these guidelines provide a way to effectively communicate change disposition and thereby minimize breaking existing consumers.

<!-- BEGIN GENERATED COMMAND ARGS: diff -->

### Options

#### `--config`, `-c` (string)

Path to the config file. The default value is `basketry.config.json`.

#### `--filter` (string)

Specifies the _lowest_ semver change level to return. For example, if `major` is supplied, then only "breaking" changes will be returned. If `minor` is supplied, then both `major` and `minor` semver changes will be returned. A value of `all` ensures that all changes are returned, including the most trivial changes such as textual descriptions. The default value is `all`.

Possible values:

- `major`
- `minor`
- `patch`
- `all`

#### `--json`, `-j` (boolean)

Outputs the result of the command as a JSON-formatted object. If ommitted, the CLI will output human-readable progress, results, and pretty-printed errors to `stdout`.

#### `--parser`, `-p` (string)

The parser thet corresponds to the source SDL file. This must be a string value that refers to a parser module. Any "requirable" value can be used such as globally or locally installed NPM package or the path to a file on your local file system.

#### `--previous` (string)

File path of the previous version to compare against.

Note: cannot be used with `--ref`.

#### `--ref` (string)

The git ref (eg. branch name, tag name, commit sha, etc) of the previous version to compare against.

Note: cannot be used with `--previous`.

#### `--silent` (boolean)

Don't output any changes. (Still exits with non-zero code on breaking changes.)

#### `--source`, `-s` (string)

Path to the source SDL file. Basketry reads from `stdin` if this option is omitted and `source` is not defined in the config file. Note that if a source parameter is provided _and_ content is piped in via `stdin`, the content from `stdin` will be parsed, but any violations will include the file name supplied by `source`. This can be useful to a validate dirty version of a file prior to the file being saved and only then accessible by reading from the file system.

<!-- END GENERATED COMMAND ARGS: diff -->

## `ir` command

Writes the Intermediate Representation (IR) of the parsed service as JSON to `stdout`.

<!-- BEGIN GENERATED COMMAND ARGS: ir -->

### Options

#### `--config`, `-c` (string)

Path to the config file. The default value is `basketry.config.json`.

#### `--parser`, `-p` (string)

The parser thet corresponds to the source SDL file. This must be a string value that refers to a parser module. Any "requirable" value can be used such as globally or locally installed NPM package or the path to a file on your local file system.

#### `--perf` (boolean)

Report performance

#### `--source`, `-s` (string)

Path to the source SDL file. Basketry reads from `stdin` if this option is omitted and `source` is not defined in the config file. Note that if a source parameter is provided _and_ content is piped in via `stdin`, the content from `stdin` will be parsed, but any violations will include the file name supplied by `source`. This can be useful to a validate dirty version of a file prior to the file being saved and only then accessible by reading from the file system.

<!-- END GENERATED COMMAND ARGS: ir -->
