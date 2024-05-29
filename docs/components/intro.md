---
sidebar_position: 0
---

# Components

### Example Schemas

See: https://github.com/basketry/examples/tree/main/schemas

### Parsers

| Component                                                          | Version                                                                                                            | Description                                                                                      |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [`@basketry/swagger-2`](https://github.com/basketry/swagger-2)     | [![main](https://img.shields.io/npm/v/@basketry/swagger-2)](https://www.npmjs.com/package/@basketry/swagger-2)     | Parser for [Swagger/OpenAPI v2](https://swagger.io/docs/specification/2-0/) docs (JSON and YAML) |
| [`@basketry/openapi-3`](https://github.com/basketry/openapi-3)     | [![main](https://img.shields.io/npm/v/@basketry/openapi-3)](https://www.npmjs.com/package/@basketry/openapi-3)     | Parser for [OpenAPI v3](https://swagger.io/docs/specification/) docs (JSON and YAML)             |
| [`@basketry/json-schema`](https://github.com/basketry/json-schema) | [![main](https://img.shields.io/npm/v/@basketry/json-schema)](https://www.npmjs.com/package/@basketry/json-schema) | Parser for [JSON Schema](https://json-schema.org/) docs.                                         |
| [`@basketry/ir/lib/parser`](https://github.com/basketry/ir)        | [![main](https://img.shields.io/npm/v/@basketry/ir)](https://www.npmjs.com/package/@basketry/ir)                   | Parse raw IR                                                                                     |

### Rules

| Component                                                            | Version                                                                                                    | Description                                        |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`@basketry/rules`](https://github.com/basketry/rules)               | [![main](https://img.shields.io/npm/v/@basketry/rules)](https://www.npmjs.com/package/@basketry/rules)     | Common rules for building pipelines.               |
| [`@basketry/graphql/lib/rules`](https://github.com/basketry/graphql) | [![main](https://img.shields.io/npm/v/@basketry/graphql)](https://www.npmjs.com/package/@basketry/graphql) | Rules for defining relationships within a service. |

### Generators

#### Typescript

| Component                                                                                | Version                                                                                                                                  | Description                                                 |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [`@basketry/typescript`](https://github.com/basketry/typescript)                         | [![main](https://img.shields.io/npm/v/@basketry/typescript)](https://www.npmjs.com/package/@basketry/typescript)                         | Generate interfaces, types, and enums in Typescript         |
| [`@basketry/typescript-validators`](https://github.com/basketry/typescript-validators)   | [![main](https://img.shields.io/npm/v/@basketry/typescript-validators)](https://www.npmjs.com/package/@basketry/typescript-validators)   | Generate validation methods                                 |
| [`@basketry/typescript-auth`](https://github.com/basketry/typescript-auth)               | [![main](https://img.shields.io/npm/v/@basketry/typescript-auth)](https://www.npmjs.com/package/@basketry/typescript-auth)               | Generate code to enforce security definitions               |
| [`@basketry/typescript-http-client`](https://github.com/basketry/typescript-http-client) | [![main](https://img.shields.io/npm/v/@basketry/typescript-http-client)](https://www.npmjs.com/package/@basketry/typescript-http-client) | Generate an HTTP client for use in Typescript applications. |
| [`@basketry/typescript-docs`](https://github.com/basketry/typescript-docs)               | [![main](https://img.shields.io/npm/v/@basketry/typescript-docs)](https://www.npmjs.com/package/@basketry/typescript-docs)               | Generate markdown docs                                      |
| [`@basketry/express`](https://github.com/basketry/express)                               | [![main](https://img.shields.io/npm/v/@basketry/express)](https://www.npmjs.com/package/@basketry/express)                               | Generate routers for Express JS servers                     |

#### Ruby/Sorbet

| Component                                                                      | Version                                                                                                                          | Description                                                  |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`@basketry/sorbet`](https://github.com/basketry/sorbet)                       | [![main](https://img.shields.io/npm/v/@basketry/sorbet)](https://www.npmjs.com/package/@basketry/sorbet)                         | Generate interfaces, types, and enums in Sorbet              |
| [`@basketry/sorbet-validators`](https://github.com/basketry/sorbet-validators) | [![main](https://img.shields.io/npm/v/@basketry/sorbet-validators)](https://www.npmjs.com/package/@basketry/sorbet-validators)   | Generate validation methods                                  |
| [`@basketry/sorbet-http-client`](https://github.com/basketry/http-client)      | [![main](https://img.shields.io/npm/v/@basketry/sorbet-http-client)](https://www.npmjs.com/package/@basketry/sorbet-http-client) | Generate an HTTP client for use in Ruby/Sorbet applications. |
| [`@basketry/rails`](https://github.com/basketry/rails)                         | [![main](https://img.shields.io/npm/v/@basketry/rails)](https://www.npmjs.com/package/@basketry/rails)                           | Generate Rails routes and controllers                        |
| [`@basketry/sorbet-docs`](https://github.com/basketry/sorbet-docs)             | [![main](https://img.shields.io/npm/v/@basketry/sorbet-docs)](https://www.npmjs.com/package/@basketry/sorbet-docs)               | Generate markdown docs                                       |

#### Other

| Component                                                                | Version                                                                                                    | Description              |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------ |
| [`@basketry/ir/lib/generator`](https://github.com/basketry/ir)           | [![main](https://img.shields.io/npm/v/@basketry/ir)](https://www.npmjs.com/package/@basketry/ir)           | Write raw IR to a file   |
| [`@basketry/graphql/lib/generator`](https://github.com/basketry/graphql) | [![main](https://img.shields.io/npm/v/@basketry/graphql)](https://www.npmjs.com/package/@basketry/graphql) | Generate GraphQL schemas |
