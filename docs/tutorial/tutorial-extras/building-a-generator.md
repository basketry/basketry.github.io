# Building a generator

Basketry follows the Unix design philosophy of “do one thing and do it well.” Each component ought to have a very small and very specific focus. This allows for Basketry components to be rearranged into countless project-specific pipelines without needing to develop any pipeline-specific code.

But when you do need to build a new Generator, here are some design principles to keep in mind:

## Export a default Generator function

At its most basic, a generator needs to be a module's default export. It is a function that conforms to the `Generator` type exported from the `basketry` package. Basketry components may also be written in Javascript as long as they inplicitly satisfy the `Generator` type.

```ts title="src/index.ts"
import { Generator } from "basketry";

const myGenerator: Generator = (service, options) => {
  // Create and return files
};

export default myGenerator;
```

It is often practical to implement the generator with a class so that state can be maintained during the generation process.

```ts title="src/index.ts"
import { File, Generator } from "basketry";

const myGenerator: Generator = (service, options) => {
  return new MyGeneratorClass().build();
};

class MyGeneratorClass {
  build(): File {
    // Create and return files
  }

  private someStatefulMethod() {
    // TODO
  }
}

export default myGenerator;
```

## Build a part of an app (don’t scaffold)

There are many fantastic scaffolding tools available, Yeoman, Create React App (CRA), and NestJS CLI being a few good examples. A scaffolding tool is designed to start a new project in a particular language with specific architectural patterns and folder structures. Basketry works differently—it is purpose-built to help developers design and maintain a service interface and then generate independent yet composable building blocks based on those APIs.

With this in mind, it is recommended to build generators that only build a small slice of an application. For example, one generator might only generate the types and interfaces from the service definition. Another might generate validation functions for those interfaces. Another might generate web service routers for one specific API framework such as Express or Sinatra.

## Design for both generated and manually written code

One of the downsides of code generation is that any manual changes to generated code are lost each time the generator is re-run. To mitigate this, consider how developers will consume the generated code and design accordingly. It is recommended to generate code that will be consumed by manually written code.

For example, the [`@basketry/typescript`](https://github.com/basketry/typescript) generator writes a [`types.ts`](https://github.com/basketry/typescript/blob/main/src/snapshot/v1/types.ts) file that contains all of the interfaces, types, and enums in the service definitions. Developers can import those types to implement their own service classes. When Basketry is re-run and `types.ts` is updated, no hand-made changes are lost. Worst case, the interface has changed in a way that produces compiler errors.

The [Inversion of Control](https://martinfowler.com/bliki/InversionOfControl.html) pattern should be used to inject user-defined behavior into generated code. For example, when generating an HTTP client, don't presume any specific HTTP library or require the developer to edit the generated code to specify their preferred choice. Instead, generate a class that accepts a "fetch" function via a constructor parameter. This inverts the control of how requests are made to the consumer of the class rather than being defined by the generated class itself.

## Balancing options vs opinions

The second parameter of a generator function allows consumers to make project-specific adjustments to the emitted code. Consider how you might offer customization in a meaningful way. For example, various projects have linting rules to enforce code formatting and style conventions. In order to allow your generated code to play nice with the containing project, consider accepting an option list of linter exceptions.

The [`@basketry/sorbet`](https://github.com/basketry/sorbet#options) generator is a good example of a generator that provides multiple points of configuration.

That being said, try to avoid building one single generator that allows "unlimited flexibility and configuration." If different settings end up generating wildly different code, consider building two more narrowly focussed generators.

Strongly consider supporting similar options to other generators within a the same language family. This will ensure consistency of naming, casing, and folder structure across generated files. For this reason, even though the `options` object is typed as `any`, strongly consider placing options relevant to the same family of generators in a namespaced sub-options object. For example, the Ruby/Sorbet family of generators accepts their options in a `sorbet` sub-object.

## Export functions useful for other generators

A generator's primary function is to generate code. However, think about what parts of the generation process might be relevant to other related generators. For example, in the [`@basketry/typescript`](https://github.com/basketry/typescript) generator, the functions that generate interface, type, and enum names are exported. This allows other generators such as [`@basketry/typescript-validators`](https://github.com/basketry/typescript-validators) to generate code that imports types generated by another generator. The symbol names in the import statement are guaranteed to be identical to the symbol names in the `types.ts` file because they are emitted by the same function.
