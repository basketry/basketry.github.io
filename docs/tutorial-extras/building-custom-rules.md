# Building custom rules

Basketry follows the Unix design philosophy of “do one thing and do it well.” Each component ought to have a very small and very specific focus. This allows for Basketry components to be rearranged into countless project-specific pipelines without needing to develop any pipeline-specific code.

But when you do need to build a new rule, here are some design principles to keep in mind:

## Export a default rule function

A Basketry rule is any function that conforms to the `Rule` type. This function is exposed as the default export of the module.

```ts
type Rule = (
  service: Service,
  sourcePath: string,
  options?: any
) => Violation[];
```

- `service` - the Intermediate Representation of the service
- `sourcePath` - the path to the original source file
- `options` - an optional object containing optional settings for this rule

Note: the `sourcePath` parameter is deprecated and will be removed in an upcoming version; prefer `service.sourcePath` instead.

Example rule:

```ts
import { Rule, Violation } from "basketry";

const customRule: Rule = (service, sourcePath, options) => {
  const violations: Violation[] = [];

  // TODO: implement rule logic here

  return violations;
};

export default customRule;
```

## API design guidelines, not software design patterns

API design guidelines answer questions like:

- What casing standards should we use within our API?
- What is our approach to pagination?
- What should the response envelope look like?
- How should URIs be formatted?

Such guidelines ensure consistency across all parts of an API as well as consistency between different APIs. Basketry Rules provide an explicitly, automated mechanism for enforcing these guidelines.

Keep in mind that API design guidelines should focus on the API itself, not the server or client implementation. One pipeline might emit code in multiple languages. For example, you might build an API client in a few common languages to provide to consumers. In this case, the software design guidelines might be wildly different. This would include things like formatting, folder structure, or usage of if/else vs switch/case.

Use rules to focus on API design guidelines. Use generators and generator options to enforce software design guidelines.

## Validate the IR, not the SDL

Each component, including rules, only interacts with the other components within a Basketry pipeline using the service’s Intermediate Representation. Your Rule will be provided the Intermediate Representation of the service, not your original Service Definition.

This means that you will not be able to create rules to enforce guidelines for the Service Definition in its original format. For example, if you define your service using OpenAPI, you can’t use a rule to enforce paging parameters are defined in a common place and then referenced within each operation. By design, the Intermediate Representation describes only the denormalized set of parameters for each method, not their original representation.
Parsers may also emit validation errors. If you are absolutely certain that you must enforce design guidelines for a specific SDL, consider implementing a custom parser to do so. However, only do so after completely ruling out the viability of using Rule to validate the IR.

## Include meaningful violation ranges

Most nodes within the Intermediate Representation contain opaque location data about the original location within the Service Definition. The parser will supply this information in a compressed string format. Use the `decodeRange` helper function to convert the compressed string into the Range type surfaced by the rule violation.

The purpose of providing the location is to provide a more specific call-to-action to the developer to help them quickly and confidently resolve the violation. Therefore, as much as is practical, return a range that most specifically represents the problem. For example, if a method name uses the incorrect casing, provide the range for the method name, not the whole method.

If there is no meaningful location, call `decodeRange` without any parameters. This will return a “null” range that points to the beginning of the document.

## Namespace your rule codes

The recommended format for rule codes is `namespace/rule-name`.

While rule codes are theoretically just strings, similar rules from different developers could collide. A good rule of thumb is to use a namespace that describes a team or organization who would bear the reasonable responsibility to prevent collisions within their own rule names.

Don’t use the namespace to communicate the functionality of your rule. That should be conveyed in the rule name.

## Leverage options

Each rule may take an optional options object. It’s recommended to take a `severity` setting so that consumers can set a severity level.

Use options when you want to offer rule variability that wouldn’t be practical to offer as discrete rules. For example, if you wanted to enforce a maximum number of method parameters, that would be a prime use case to take an option. In other cases where the level of variability is smallish, use your best judgment.

See the [standard Basketry rules](https://github.com/basketry/rules#readme) for examples of defining options.

## Use rule helpers

Basketry offers a number of helpers for building rules. Normally a rule will focus on one specific part of the Service Definition such as only method names or HTTP paths. The provided rule helpers simplify creating these sorts of rules.

See the docs for [Rule Helpers](https://github.com/basketry/basketry/wiki/Rule-Helpers) for more info.

At the end of the day, a Basketry rule is just a function that takes the Intermediate Representation of a service and returns an array of zero or more violations. If you keep your rules very specific, the rule helpers should work in most cases. If you do indeed need to create a more complex rule, default export a rule function.
