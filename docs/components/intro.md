---
sidebar_position: 0
---

# Components

### Example Schemas

See: https://github.com/basketry/examples/tree/main/schemas

### Parsers

| Component                                                         | Version                                                                                                            | Description                                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [`@basketry/openapi-3`](/docs/components/@basketry/openapi-3)     | [![main](https://img.shields.io/npm/v/@basketry/openapi-3)](https://www.npmjs.com/package/@basketry/openapi-3)     | Parser for [OpenAPI v3](https://swagger.io/docs/specification/) docs (JSON and YAML)             |
| [`@basketry/json-schema`](/docs/components/@basketry/json-schema) | [![main](https://img.shields.io/npm/v/@basketry/json-schema)](https://www.npmjs.com/package/@basketry/json-schema) | Parser for [JSON Schema](https://json-schema.org/) docs.                                         |
| [`@basketry/swagger-2`](/docs/components/@basketry/swagger-2)     | [![main](https://img.shields.io/npm/v/@basketry/swagger-2)](https://www.npmjs.com/package/@basketry/swagger-2)     | Parser for [Swagger/OpenAPI v2](https://swagger.io/docs/specification/2-0/) docs (JSON and YAML) |
| [`@basketry/typespec`](/docs/components/@basketry/typespec)       | [![main](https://img.shields.io/npm/v/@basketry/typespec)](https://www.npmjs.com/package/@basketry/typespec)       | Parser for [TypeSpec](https://typespec.io) docs                                                  |

### Rules

| Component                                             | Version                                                                                                | Description                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| [`@basketry/rules`](/docs/components/@basketry/rules) | [![main](https://img.shields.io/npm/v/@basketry/rules)](https://www.npmjs.com/package/@basketry/rules) | Common rules for building pipelines. |

### Generators

#### Typescript

| Component                                                                               | Version                                                                                                                                  | Description                                                   |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [`@basketry/typescript`](/docs/components/@basketry/typescript)                         | [![main](https://img.shields.io/npm/v/@basketry/typescript)](https://www.npmjs.com/package/@basketry/typescript)                         | Generate interfaces, types, and enums in Typescript           |
| [`@basketry/typescript-http-client`](/docs/components/@basketry/typescript-http-client) | [![main](https://img.shields.io/npm/v/@basketry/typescript-http-client)](https://www.npmjs.com/package/@basketry/typescript-http-client) | Generate an HTTP client for use in Typescript applications.   |
| [`@basketry/express`](/docs/components/@basketry/express)                               | [![main](https://img.shields.io/npm/v/@basketry/express)](https://www.npmjs.com/package/@basketry/express)                               | Generate routers for Express JS servers                       |
| [`@basketry/typescript-dtos`](/docs/components/@basketry/typescript-dtos)               | [![main](https://img.shields.io/npm/v/@basketry/typescript-dtos)](https://www.npmjs.com/package/@basketry/typescript-dtos)               | Generate Data Transfer Objects (DTOs) for clients and servers |
| [`@basketry/typescript-docs`](/docs/components/@basketry/typescript-docs)               | [![main](https://img.shields.io/npm/v/@basketry/typescript-docs)](https://www.npmjs.com/package/@basketry/typescript-docs)               | Generate markdown docs                                        |
| [`@basketry/react-query`](/docs/components/@basketry/react-query)                       | [![main](https://img.shields.io/npm/v/@basketry/react-query)](https://www.npmjs.com/package/@basketry/react-query)                       | Generate React Query hooks and options                        |
| [`@basketry/zod`](/docs/components/@basketry/zod)                                       | [![main](https://img.shields.io/npm/v/@basketry/zod)](https://www.npmjs.com/package/@basketry/zod)                                       | Generate Zod schemas                                          |
| [`@basketry/typescript-validators`](/docs/components/@basketry/typescript-validators)   | [![main](https://img.shields.io/npm/v/@basketry/typescript-validators)](https://www.npmjs.com/package/@basketry/typescript-validators)   | Generate validation methods (deprecated)                      |
| [`@basketry/typescript-auth`](/docs/components/@basketry/typescript-auth)               | [![main](https://img.shields.io/npm/v/@basketry/typescript-auth)](https://www.npmjs.com/package/@basketry/typescript-auth)               | Generate code to enforce security definitions (deprecated)    |

#### Ruby/Sorbet

:::info
Note that Ruby/Sorbet components have not been updated to the 0.1 release and are looking for maintainers. If you are interesting in supporting this part of the project, please reach out on Github or on the Basketry discord.
:::

| Component                                                                      | Version                                                                                                                          | Description                                                  |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`@basketry/sorbet`](https://github.com/basketry/sorbet)                       | [![main](https://img.shields.io/npm/v/@basketry/sorbet)](https://www.npmjs.com/package/@basketry/sorbet)                         | Generate interfaces, types, and enums in Sorbet              |
| [`@basketry/sorbet-validators`](https://github.com/basketry/sorbet-validators) | [![main](https://img.shields.io/npm/v/@basketry/sorbet-validators)](https://www.npmjs.com/package/@basketry/sorbet-validators)   | Generate validation methods                                  |
| [`@basketry/sorbet-http-client`](https://github.com/basketry/http-client)      | [![main](https://img.shields.io/npm/v/@basketry/sorbet-http-client)](https://www.npmjs.com/package/@basketry/sorbet-http-client) | Generate an HTTP client for use in Ruby/Sorbet applications. |
| [`@basketry/rails`](https://github.com/basketry/rails)                         | [![main](https://img.shields.io/npm/v/@basketry/rails)](https://www.npmjs.com/package/@basketry/rails)                           | Generate Rails routes and controllers                        |
| [`@basketry/sorbet-docs`](https://github.com/basketry/sorbet-docs)             | [![main](https://img.shields.io/npm/v/@basketry/sorbet-docs)](https://www.npmjs.com/package/@basketry/sorbet-docs)               | Generate markdown docs                                       |
