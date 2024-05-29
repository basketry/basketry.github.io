# Rule Helpers

Basketry Rules enforce certain API design guidelines. A Rule is a function that takes a `Service` object and returns an array of `Violation` objects. If no rule violations are found, the array will be empty).

```ts
type Rule = (
  service: Service,
  sourcePath: string,
  options?: any
) => Violation[];
```

A rule can examine any part of a Service; however, it's best practice for rules to be focused in scope. Rules that do one thing and do it well are much easier to reuse and compose with other rules. For this reason, Basketry provides helper functions for creating rules tailored to specific parts of the wholistic service representation.

## Utility Functions

### `combineRules`

Combines multiple rules together into a single rule. Rule codes from the original rules a preserved.

```ts
function combineRules(...rules: Rule[]): Rule;
```

Example usage:

```ts
import { combineRules } from "basketry";

import parameterPluralizationRule from "@basketry/rules/lib/parameter-pluralization";
import propertyPluralizationRule from "@basketry/rules/lib/property-pluralization";

const descriptionRule = combineRules(
  parameterPlurlaizationRule,
  propertyPlurlaizationRule
);

export default descriptionRule;
```

### `parseSeverity`

This function provides a safe and concise way for rules to offer an overrideable default severity. If the severity provided is valid, then that severity will be returned; otherwise, the fallback value will be returned. The default fallback value is `error`.

```ts
type Severity = "info" | "warning" | "error";
function parseSeverity(input: any, fallback: Severity = "error"): Severity;
```

Example behavior:

```ts
parseSeverity("warning"); // -> "warning"
parseSeverity(undefined); // -> "error"
parseSeverity("WARNING"); // -> "error"
parseSeverity("info", "warning"); // -> "info"
parseSeverity("not a severity"); // -> "error"
parseSeverity(42); // -> "error"
parseSeverity("not a severity", "warning"); // -> "warning"
```

In the following example, if `options.severity` is not passed or is not a valid severity, then the fallback value of `warning` will be used instead.

```ts
import { parseSeverity } from "basketry";

const stringIdRule = propertyRule(({ property, sourcePath, options }) => {
  if (property.name.value === "id" && property.typeName.value !== "string") {
    return {
      code: "basketry/string-id",
      severity: parseSeverity(options?.severity, "warning"),
      message: "Type IDs must be of type `string`",
      range: decodeRange(property.loc),
      sourcePath,
    };
  }
});
```

## Rule Builders

### `interfaceRule`

This function creates a rule that runs once for each Interface in the Service. The rule context also contains a reference to the containing Service just in case your rule needs to access it.

If your rule does not find a violation, then return `undefined` and the result will be ignored.

```ts
interface InterfaceRuleContext {
  service: Service;
  interface: Interface;
  sourcePath: string;
  options: any;
}

function interfaceRule(
  rule: (context: InterfaceRuleContext) => Violation | undefined
): Rule;
```

Example usage:

```ts
import { methodRule } from "basketry";

const interfaceNameLength = interfaceRule(({ interface: int, sourcePath }) => {
  if (int.name.length < 5) {
    return {
      code: "custom/interface-name-length",
      severity: "error",
      message: "Interface name must be at least 5 characters in length.",
      range: decodeRange(null),
      sourcePath,
    };
  }
});
```

### `methodRule`

This function creates a rule that runs once for each Method in the Service. The rule context also contains a reference to the containing Service and Interface just in case your rule needs to access them. If the Method has HTTP protocol information (such as a path and HTTP verb) then it will be included in the context as well.

If your rule does not find a violation, then return `undefined` and the result will be ignored.

```ts
interface MethodRuleContext {
  service: Service;
  interface: Interface;
  method: Method;
  httpMethod?: HttpMethod;
  sourcePath: string;
  options: any;
}

function methodRule(
  rule: (context: MethodRuleContext) => Violation | undefined
): Rule;
```

Example usage:

```ts
import { methodRule } from "basketry";

const methodNameRule = methodRule(({ method, httpMethod, sourcePath }) => {
  if (
    httpMethod?.verb?.value === "get" &&
    !method.name.value.startsWith("get")
  ) {
    return {
      code: "custom/method-name-http-get",
      severity: "error",
      message: 'HTTP GET method names must start with "get"',
      range: decodeRange(method.name.loc),
      sourcePath,
    };
  }
});
```

### `httpPathRule`

This function creates a rule that runs once for each HTTP Path defined in the Service. The rule context also contains a reference to the containing Service and Interface just in case your rules need to access them.

If your rule does not find a violation, then return `undefined` and the result will be ignored.

```ts
interface HttpPathRuleContext {
  service: Service;
  interface: Interface;
  httpPath: HttpPath;
  sourcePath: string;
  options: any;
}

export function httpPathRule(
  rule: (context: HttpPathRuleContext) => Violation | undefined
): Rule;
```

Example usage:

```ts
import { httpPathRule } from "basketry";

const httpPathLength = httpPathRule(({ httpPath, sourcePath }) => {
  if (httpPath.path.value.length > 100) {
    return {
      code: "custom/http-path-length",
      severity: "error",
      message: "HTTP path name must not be longer than 100 characters.",
      range: decodeRange(httpPath.path.loc),
      sourcePath,
    };
  }
});
```

### `parameterRule`

This function creates a rule that runs once for each Parameter defined in the Service. The rule context also contains a reference to the containing Service, Interface, and Method just in case your rules need to access them.

If your rule does not find a violation, then return `undefined` and the result will be ignored.

```ts
interface ParameterRuleContext {
  service: Service;
  interface: Interface;
  method: Method;
  httpMethod?: HttpMethod;
  parameter: Parameter;
  httpParameter?: HttpParameter;
  sourcePath: string;
  options: any;
}

export function parameterRule(
  rule: (context: ParameterRuleContext) => Violation | undefined
): Rule;
```

Example usage:

```ts
import { parameterRule } from "basketry";

const pagingParamLocationRule = parameterRule(
  ({ parameter, httpParameter, sourcePath }) => {
    if (
      httpParameter &&
      httpParameter.in.value !== "query" &&
      (parameter.name.value === "offset" || parameter.name.value === "length")
    ) {
      return {
        code: "custom/paging-param-location",
        severity: "error",
        message:
          "Paging parameters named `offset` and `length` must be passed in the query.",
        range: decodeRange(httpParameter.in.value),
        sourcePath,
      };
    }
  }
);
```

### `typeRule`

This function creates a rule that runs once for each Type defined in the Service. The rule context also contains a reference to the containing Service just in case your rule needs to access it.

If your rule does not find a violation, then return `undefined` and the result will be ignored.

```ts
interface TypeRuleContext {
  service: Service;
  type: Type;
  sourcePath: string;
  options: any;
}

export function typeRule(
  rule: (context: TypeRuleContext) => Violation | undefined
): Rule;
```

Example usage:

```ts
import { typeRule } from "basketry";

const typeIdRule = typeRule(({ type, sourcePath }) => {
  if (!type.properties.find((prop) => prop.name.value === "id")) {
    return {
      code: "custom/type-id",
      severity: "error",
      message: "Types must have an `id` property.",
      range: decodeRange(type.loc),
      sourcePath,
    };
  }
});
```

### `propertyRule`

This function creates a rule that runs once for each Property defined in the Service. The rule context also contains a reference to the containing Service and Type just in case your rule needs to access them.

If your rule does not find a violation, then return `undefined` and the result will be ignored.

```ts
interface PropertyRuleContext {
  service: Service;
  type: Type;
  property: Property;
  sourcePath: string;
  options: any;
}

export function propertyRule(
  rule: (context: PropertyRuleContext) => Violation | undefined
): Rule;
```

Example usage:

```ts
import { propertyRule } from "basketry";

const stringIdRule = propertyRule(({ property, sourcePath, options }) => {
  if (property.name.value === "id" && property.typeName.value !== "string") {
    return {
      code: "custom/string-id",
      severity: "error",
      message: "Type IDs must be of type `string`",
      range: decodeRange(property.loc),
      sourcePath,
    };
  }
});
```

### `enumRule`

This function creates a rule that runs once for each Enum defined in the Service. The rule context also contains a reference to the containing Service just in case your rule needs to access it.

If your rule does not find a violation, then return `undefined` and the result will be ignored.

```ts
interface EnumRuleContext {
  service: Service;
  enum: Enum;
  sourcePath: string;
  options: any;
}

export function enumRule(
  rule: (context: EnumRuleContext) => Violation | undefined
): Rule;
```

Example usage:

```ts
import { enumRule } from "basketry";

const enumCountRule = enumRule(({ enum: e, sourcePath }) => {
  if (e.values.length > 15) {
    return {
      code: "custom/enum-count",
      severity: "error",
      message: "Enums should not define more than 15 values",
      range: decodeRange(e.loc),
      sourcePath,
    };
  }
});
```

### `enumValueRule`

This function creates a rule that runs once for each Enum value defined in the Service. The rule context also contains a reference to the containing Service and Enum just in case your rule needs to access them.

If your rule does not find a violation, then return `undefined` and the result will be ignored.

```ts
interface EnumValueRuleContext {
  service: Service;
  enum: Enum;
  value: Enum["values"][number];
  sourcePath: string;
  options: any;
}

export function enumValueRule(
  rule: (context: EnumValueRuleContext) => Violation | undefined
): Rule;
```

Example usage:

```ts
import { enumValueRule } from "basketry";

const enumValueLengthRule = enumValueRule(({ value, sourcePath }) => {
  if (value.value.length > 50) {
    return {
      code: "custom/enum-value-length",
      severity: "error",
      message: "Enums values should be longer than 50 characters.",
      range: decodeRange(value.loc),
      sourcePath,
    };
  }
});
```
