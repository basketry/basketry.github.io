---
slug: basketry-turns-0.1.0
title: Basketry turns 0.1.0! 🧺 🎉
description: Evolving an ecosystem with new features, fixes, and improvements
authors: skonves
tags: [updates]
image: /img/pexels-cottonbro-3171837.jpg
---

# Basketry turns 0.1.0! 🧺 🎉

Evolving an ecosystem with new features, fixes, and improvements.

Basketry is the pluggable, service-oriented code-generation pipeline for any language. It starts with a Service Definition (think Swagger/OpenAPI, API Blueprint, etc.) and generates code for your APIs and the applications that consume them.

![Group of people raising their glasses in a toast at a festive celebration, surrounded by golden confetti and warm lighting.](pexels-cottonbro-3171837.jpg)

## Evolving a pluggable toolchain

The Basketry project is the 3rd or 4th iteration of a toolchain I’ve maintained for the better part of a decade for designing, building, and testing APIs. It started back in the Swagger 2.0 days as a simple tool for defining ExpressJS routes using a “Swagger doc.” The code and architecture are now almost unrecognizable from its long-lost ancestor and it now supports multiple versions of OpenAPI as well as multiple target languages. But nevertheless, it did indeed begin its life as a narrowly focused Swagger v2 tool. For this reason, until recently, it has lacked some features and data structures more closely associated with OpenAPI v3.

<!--truncate-->

Basketry's key architectural feature is its pluggability—all of its parsers, rules, and generators can be composed with any pipeline, so long as they conform to Basketry’s “Intermediate Representation” (aka IR). The upside of this is that Basketry can now serve as an evergreen “long-term evolution” ecosystem. The downside is that extending that core Intermediate Representation can introduce breaking changes to the whole pipeline.

Deploying a breaking change to an ecosystem of over a dozen dependent packages without disrupting development teams is challenging. I recently wrote an article on Demystifying Semver Prereleases that describes this challenge and how prereleases can provide a safe and transparent path forward.

## CHANGELOG

This release was primarily focused on adding some key features that were left out of the initial v0.0.x release. The early days of Basketry were focused on getting a rock-solid core pipeline and CLI. Now the focus has shifted to expanding the feature set to include more of the good stuff that OpenAPI and other SDLs have to offer.

### New features

- Default property values
- Constant property values
- Deprecated elements
- Descriptions for Interfaces, Enums, and Enum values
- Binary primitive types
- Media types for HTTP protocol definitions

### CLI fixes

- Fixed a bug where generators that format content with Prettier v3 return Promises.
- Fixed a bug where an incorrectly built absolute path was emitted in a generated file header.
- Fixed a bug where version-only changes to generated files could be incorrectly detected.

### IR (Intermediate Representation) Improvements

- Support positional data for Interface names
- Each node type now has an explicit kind
- sourcePath moved from rule inputs to IR

## The Future

### Prereleases

In order to make the latest changes available as soon as possible, I’ll be releasing an -alpha.## prerelease in the next few weeks. Similar to what happened with the most recent prerelease cycle, expect the next cycle to contain frequent (albeit small) breaking changes. Note that the latest stable version (basketry@latest) will be free from breaking changes and the next major set of features will arrive in v0.2.0.

Again, if you want to better understand how prerelease cycles work, check out my article on Demystifying Semver Prereleases.

### Discriminated Unions

Discriminated unions, also known as tagged unions or variant records, are a powerful feature in OpenAPI v3, TypeScript, and elsewhere that facilitate the handling of multiple types that share common fields in a type-safe way. Each member of a discriminated union has a common, literal-typed property — commonly referred to as a discriminator, or tag, which compilers can use to perform type narrowing. This approach allows developers to define types that can have different shapes, yet be treated under a common umbrella in a controlled manner.

The concept probably deserves an entire dedicated article, but here’s a simple example in Typescript:

```ts
// Base animal interface
interface BaseAnimal {
  kind: "cat" | "dog"; // Discriminator
}

interface Cat extends BaseAnimal {
  kind: "cat"; // Discriminator property
  livesLeft: number; // Specific property for Cat
}

interface Dog extends BaseAnimal {
  kind: "dog"; // Discriminator property
  breed: string; // Specific property for Dog
}

// Define the Animal type as a union of Cat and Dog. This creates
// a discriminated union where TypeScript can use the kind property
// to differentiate between Cat and Dog.
type Animal = Cat | Dog;

// Example of using the discriminated union
const myAnimal: Animal = { kind: "cat", livesLeft: 9 };

// Function to handle animals based on their kind
function handleAnimal(animal: Animal) {
  if (animal.kind === "cat") {
    console.log(`This cat has ${animal.livesLeft} lives left.`);
  } else if (animal.kind === "dog") {
    console.log(`This dog's breed is ${animal.breed}.`);
  }
}
```

Currently, the Basketry IR supports unions but not discriminated unions. Once it does, then generators will be able to emit more concise and performant code to distinguish between members within a union. This will likely be a breaking change, so I want to run it through a prerelease cycle, but it’s a large enough chunk of work with equally large design considerations that I didn’t want to hold back the current release candidate any longer.

### Basketry on Basketry

One more key milestone is the ability to generate Basketry code using a Basketry pipeline. Currently, the Basketry IR is defined independently in both Typescript types and JSON Schema. The types are used for building all of the components that can be plugged into a pipeline. The JSON Schema is used for validating the IR passed between those components at runtime. Because these two types systems are independent, their similarity is manually coincident—contributors must correctly update both simultaneously to ensure the system works predictably.

An amazing opportunity for “dogfooding” would be to generate Basketry’s Typescript representation of the IR from the JSON Schema document. Discriminated unions and generics are some of the few features left preventing this from being possible (although the `Scalar<T>` type could easily be dropped for a few non-generic types instead).

The ability to generate Basketry IR types from a single, authoritative, declarative source would open the door down the road to implementations of parsers, rules, and generators in languages and runtimes other than Node/Typescript.

---

Thanks for reading (or skimming 😉) all the way to the end! Basketry has been an amazing project to work on so far, and I’m excited about the changes coming in the near future, so stay tuned!
