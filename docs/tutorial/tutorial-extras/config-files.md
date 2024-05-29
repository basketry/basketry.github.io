# Config files

## Single-project Configuration

Config files allow you to run the CLI without any arguments. Certain features such as passing options to rules and generators are only available via a config file.

Example config file:

```json title="basketry.config.json"
{
  "source": "swagger.json",
  "parser": "@basketry/swagger-2",
  "rules": [
    "@basketry/rules/lib/string-id",
    {
      "rule": "@basketry/rules/lib/description",
      "options": { "severity": "warning" }
    }
  ],
  "generators": ["@basketry/typescript"],
  "output": "src/petstore",
  "options": {
    "typescript": {
      "includeVersion": false
    }
  }
}
```

### File name

Config files must be named `basketry.config.json`.

### Source

The `source` property is a string that indicates the location of the source SDL. This path may be a relative or absolute but must refer to a file on the local file system (eg. HTTP URIs are not allowed). Relative paths are relative to the config file.

### Parser

The `parser` property is a string that indicates the CommonJS module from which to load the Parser. Simply put, CommonJS modules are anything that can be "require" in Node.

### Rules

The `rules` property is an array of either:

- Strings that indicate the CommonJS modules from which to load Rules, or
- Rule objects that specify the rule module and an options object

The `rules` array may contain a mix of both strings and Rule objects.

Example:

```json
{
  "rules": [
    "@basketry/rules/lib/string-id",
    {
      "rule": "@basketry/rules/lib/description",
      "options": { "severity": "warning" }
    }
  ]
}
```

In this example, the `string-id` rule is not provided any options; therefore, it is simplest to only include the module name. The `description` rule accepts a `severity` option. In order to supply that option via the config, we must add the rule using the object syntax.

### Generators

The `generators` property is an array of either:

- Strings that indicate the CommonJS modules from which to load Generators, or
- Rule objects that specify the Generator module and an options object

The `generators` array may contain a mix of both strings and Generator objects.

Example:

```json
{
  "generators": [
    "@basketry/typescript",
    {
      "rule": "@basketry/typescript-validators",
      "options": { "skipEmpty": true }
    }
  ]
}
```

In this example, the `typescript` generator is not provided with any options; therefore, it is simplest to only include the module name. The `typescript-validators` generator accepts a `skipEmpty` option. In order to supply that option via the config, we must add the rule using the object syntax.

If multiple generators need the same option, they can be supplied via a common `options` property in the config file. In the event that the same option is applied in a Generator object _and_ in the common options, then the generator-specific option will override the common object.

### Output

The `output` property is a string that indicates the root folder where all generated files will be written. Note that some generators may write files in sub-folders, but all files and sub-folders will exist within the `output` folder.

This path may be a relative or absolute but must refer to a file on the local file system (eg. HTTP URIs are not allowed). Relative paths are relative to the config file.

### Options

The `options` property defines a set of common generator options that are passed to every generator.

In the event that the same option is applied in a Generator object _and_ in the common options, then the generator-specific option will override the common object.

## Multi-project Configuration

If your project defines multiple Service Definitions, then each will need its own `basketry.config.json` in separate directories. In this case, Basketry needs to know the location of each config. This is done by creating a "global config". A global config contains _only_ an array of the Basketry config files within your project.

Consider the following project structure:

```
my-project/
├─ node_modules/
├─ src/
│  ├─ service-a/
│  │  ├─ basketry.config.json
│  │  ├─ service-a.json
│  ├─ service-b/
│  │  ├─ basketry.config.json
│  │  ├─ service-b.json
basketry.config.json
package.json
```

The root `basketry.config.json` would look like:

```json title="basketry.config.json"
{
  "configs": [
    "src/service-a/basketry.config.json",
    "src/service-b/basketry.config.json"
  ]
}
```

Running basketry against the main config (`my-project/basketry.config.json`) will run the Parsers, Rules, and Generators in all referenced child configs. Note that you can also run Basketry against only one child config by passing a `--config` argument to the CLI:

```
basketry --config src/service-a/basketry.config.json
```

Global configs can _only_ contain a list of child config file paths—they _do not_ contain common Parsers, Rules, Generators, or options.

## Helpers

### Config validator

Basketry exports a `validateConfig` method that can be used to programmatically validate a config file.

```ts
function validateConfig(config: any): {
  config: Config;
  errors: BasketryErrors;
};
```

Example usage:

```ts
import { readFileSync } from "fs";
import { validateConfig } from "basketry/lib/config-validator";

const config = JSON.parse(readFileSync("basketry.config.json").toString());
const result = validateConfig(config);
```

The `validateConfig` method works with both global and local config files.

### JSON Schema

The JSON schema for the config files is provided:

```
const schema = require('basketry/lib/config-schema.json');
```

For users of VSCode, the [Basketry VSCode extension](https://marketplace.visualstudio.com/items?itemName=stevekonves.basketry-vscode) will automatically apply this schema to config files in your project and gives immediate feedback if you have a syntax error in your config.
