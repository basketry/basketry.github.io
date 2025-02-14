---
sidebar_position: 1
---

# Getting Started

Basketry is the pluggable, service-oriented code-generation pipeline for any language.

This guide will take you step-by-step through generating a new service, starting with the Swagger pet store example.

## Prerequisites

If you haven't yet, go ahead and read [Introducing Basketry](../../blog/introducing-basketry). It gives a full explanation of what Basketry is and what types of problems it solves. It also covers all of the Basketry-related terms that will show up in the guide, such as Service Definitions, Parsers, Rules, Generators, and Intermediate Representation.

We'll talk about installing packages and creating and running scripts. This guide assumes that you already have a working knowledge of NPM or Yarn and know how to use your preferred package manager to perform those actions.

Lastly, we will be building our service in Typescript. This guide assumes that you are either familiar with setting up a new project or have access to an existing project.

## Initial Setup

### Get a Service Definition

Let's start by downloading an existing Service Definition. Swagger.io offers an example Swagger doc defining an example pet store service: https://petstore3.swagger.io/api/v3/openapi.json. Download that file as swagger.jsonand put it in the root folder of your project.

### Install packages

Start by installing the following packages:

- `basketry`
- `@basketry/swagger-2`
- `@basketry/typescript`

The first package contains the Basketry CLI via the `basketry` command. There are two ways to use the CLI. First, you can pass all of your project options directly to the CLI as arguments. See the README in the repository for details on these arguments. Secondly, you can add a `basketry.config.json` file in the root of your project, and then just run `basketry` without any arguments. We will be using a configuration file in this guide.

The second package is the Parser for Swagger 2.0 documents. This package exports a default module that takes the raw Swagger doc and outputs an Intermediate Representation (IR) of the service.

The last package is the Generator that takes the IR and outputs a `types.ts` file that contains all of the interfaces, types, and enums necessary to implement the pet store service.

### Create scripts

Create scripts in `package.json` to run the Basketry CLI:

```json
{
  "scripts": {
    "basketry": "basketry",
    "watch:basketry": "basketry --watch"
  }
}
```

When we run the `basketry` script, the Basketry CLI will look for a `basketry.config.json` file to know what parser and generator to use and where to find the Swagger doc. Let's create that next.

### Create a config file

Add the following `basketry.config.json` file to the root of your project:

```json
{
  "source": "swagger.json",
  "parser": "@basketry/swagger-2",
  "generators": ["@basketry/typescript"],
  "output": "src/petstore"
}
```

Let's walk through what each of those settings does.

First, `source` lets Basketry know where we want to load our Service Definition from. If you want to rename `swagger.json` to something else, make sure to also reflect that name change in the config.

Next, `parser` lets Basketry know what module to use to parse the Swagger doc into IR. The rest of the pipeline doesn't know that the original Service Definition Language (SDL) was Swagger-the Generators (and Rules when we add them) can work with any source language. For this to work, we need to pick a Parser that understands the SDL, which is why we installed `@basketry/swagger-2`.

Moving on, `generators` lets Basketry know how to convert the IR into code files. We can add as many Generators as we want. To start with, we'll only use `@basketry/typescript`. We'll add more later in the guide.

Lastly, `output` specifies where we want Basketry to put the generated files. Some Generators may write files within subfolders; however, the `output` folder will be the root directory for all generated content.

### Generate some code!

Now run the `basketry` command:

![1_YTPIUiw6fQOPJljFKo-k5A](https://user-images.githubusercontent.com/4925067/170800798-0109cd60-4370-41a6-a4a3-17281b662051.png)

You can see that it generates `types.ts`. Your project will now contain (at least) the following files:

```
basketry-example/
 ├─ node_modules/
 ├─ src/
 │  ├─ petstore/
 │  │  ├─ v1/
 │  │  │  ├─ types.ts
 ├─ basketry.config.json
 ├─ package.json
 ├─ swagger.json
```

Note that `types.ts` is inside of a `v1` folder. This is because the Swagger doc has a version of `1.0.6` (see the `info` object) and Basketry keeps track of the major version of source services. As we see here, `@basketry/typescript` used that version number to write files into version-specific folders.

And it's that easy! At this point, we have a Swagger doc that describes our pet store, and then we setup Basketry to generate Typescript types for our service.

## Enforce API design guidelines

Design guidelines help provide consistency within a single service but also across multiple services owned and maintained by multiple teams. This consistency improves developer experience and facilitates incremental change as APIs grow and mature.

Basketry Rules provide an easy way to add this facet of API governance into your project.

### Add a standard rule

Basketry offers a set of standard rules to get you started.

First, install the package `@basketry/rules`.

Next, let's add the "string ID" rule to our config file:

```json
{
  "source": "swagger.json",
  "parser": "@basketry/swagger-2",
  "rules": ["@basketry/rules/lib/string-id"],
  "generators": ["@basketry/typescript"],
  "output": "src/petstore"
}
```

Now, when we run the `basketry` script, we see the following output:

![1_y85YkltnlWZqD2OgEfD8mQ](https://user-images.githubusercontent.com/4925067/170801009-211542e3-c04f-4bc4-b846-d0176bc040eb.png)

This output lets us know that we have five places where our Swagger doc violates the `basketry/string-id` rule. The error output shows what rule has been violated, the file path, and location of the violation to help us make the fix.

For context, the "string ID" rule requires that any property named id must be a string. (This rule would typically be used to require non-sequential IDs for security reasons.)

Now that we found some violations, let's go back to the Swagger doc, find the first violation, and change

```json
{ "type": "integer", "format": "int64" }
```

to

```json
{ "type": "string", "minLength": 12 }
```

and re-run the `basketry` script:

![1_NOshqZr4o1KrlflnIF31nA](https://user-images.githubusercontent.com/4925067/170801112-53aadfca-66f4-4e72-8ef2-116a9fb00c9d.png)

As you can see, we fixed the first violation and our `types.ts` file has been updated to reflect the change. If we make the same change to the remaining ID properties, we should see all of our violations cleared! 🎉

![1_V6mffRDHQIoB2t9j5YJsog](https://user-images.githubusercontent.com/4925067/170801137-35c0c2ee-cca3-4522-82f8-b8457a9e4535.png)

### Set rule options

Let's add the "description" rule from the standard set to ensure that we add descriptions to everything:

```json
{
  "source": "swagger.json",
  "parser": "@basketry/swagger-2",
  "rules": [
    "@basketry/rules/lib/string-id",
    "@basketry/rules/lib/type-description"
  ],
  "generators": ["@basketry/typescript"],
  "output": "src/petstore"
}
```

That's a lot of errors! 😬

![1_AxFneepv5stkd_5tBZYPbA](https://user-images.githubusercontent.com/4925067/170801187-ade16a83-82c9-41ea-a571-9d1d95632caf.png)

We can pass options to rules to modify their behavior in certain ways:

```json
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
  "output": "src/petstore"
}
```

Now, all of the “description” violations are reported as warnings instead of errors. Various rules allow different options, so check out the [Basketry Rules](https://github.com/basketry/rules#readme) for the full set of available rules and their respective options.
