import fs from "fs";
import path from "path";
import {
  File,
  Generator,
  getEnumByName,
  getTypeByName,
  getUnionByName,
  isRequired,
  MemberValue,
  PrimitiveValueConstant,
  Property,
  Service,
  StringLiteral,
  Type,
} from "basketry";
import { kebab, pascal, snake } from "case";

// const outline = 4;

const content = fs.readFileSync(path.join(__dirname, "content.md"), "utf8");

// Function to get the version of @basketry/ir package
function getBasketryIrVersion(): string {
  try {
    const packageJsonPath = require.resolve("@basketry/ir/package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    return packageJson.version;
  } catch (error) {
    console.warn(
      "Could not read @basketry/ir version, falling back to 'unknown'"
    );
    return "unknown";
  }
}

export const specBuilder: (marked: (text: string) => string) => Generator =
  (marked) => async (service) => {
    const specBuilder = new SpecBuilder(service, marked);
    return await specBuilder.build();
  };

abstract class DocumentationBuilder {
  constructor(
    protected readonly service: Service,
    protected readonly marked: (text: string) => string
  ) {}

  protected buildConstantDocs(memberValue: MemberValue): string {
    if (memberValue.kind === "PrimitiveValue" && memberValue.constant) {
      return ` Always ${this.buildPrimitiveConstant(memberValue.constant)}.`;
    }

    return "";
  }

  protected *buildPropertiesTable(type: Type): Iterable<string> {
    yield "| Field Name | Type | Description |";
    yield "| -------- | ---- | ----------- |";
    for (const property of type.properties) {
      yield `| ${property.name.value} | ${this.buildPropertyType(property)} | ${
        isRequired(property.value) ? "***REQUIRED.***" : ""
      }${this.buildConstantDocs(
        property.value
      )} ${this.buildPropertyDescription(
        property.description
      )}${this.buildRulesBlock(property.value)} |`;
    }
  }

  protected abstract buildTypeNameHeading(type: Type): string;

  protected buildTypeNameSlug(type: Type): string {
    const heading = this.buildTypeNameHeading(type).replace(/\./g, "");

    return kebab(heading);
  }

  protected buildPropertyType(property: Property): string {
    const baseType = () => {
      if (property.value.kind === "PrimitiveValue") {
        if (property.value.constant) {
          return this.buildPrimitiveConstant(property.value.constant);
        } else {
          return property.value.typeName.value;
        }
      }

      return this.buildTypeNameLink(property.value.typeName.value);
    };

    if (property.value.isArray) {
      return `[${baseType()}]`;
    }

    return baseType();
  }

  protected buildPrimitiveConstant(constant: PrimitiveValueConstant): string {
    if (constant.kind === "StringLiteral") {
      return `\`"${constant.value}"\``;
    } else {
      return `\`${constant.value}\``;
    }
  }

  protected buildTypeNameLink(typeName: string): string {
    const type = getTypeByName(this.service, typeName);

    if (type) {
      const slug = type ? this.buildTypeNameSlug(type) : "";
      return `[${pascal(typeName)}](#${slug})`;
    }

    const unionType = getUnionByName(this.service, typeName);
    if (unionType) {
      return unionType.members
        .map((m: MemberValue) => {
          if (m.kind === "PrimitiveValue") {
            return m.typeName.value;
          } else {
            const t = getTypeByName(this.service, m.typeName.value)!;
            const slug = t ? this.buildTypeNameSlug(t) : "";
            return `[${pascal(t.name.value)}](#${slug})`;
          }
        })
        .join(" \\| ");
    }

    const enumType = getEnumByName(this.service, typeName);
    if (enumType) {
      return [...enumType.members]
        .sort((a, b) => a.content.value.localeCompare(b.content.value))
        .map((m) => this.buildPrimitiveConstant(m.content))
        .join(" \\| ");
    }

    return typeName;
  }

  protected buildTypeDescription(
    description: StringLiteral[] | undefined
  ): string {
    if (!description) return "";

    return description
      .map((d) => `<p>${this.marked(d.value).replace(/\n/g, "").trim()}</p>`)
      .join("\n");
  }

  protected buildPropertyDescription(
    description: StringLiteral[] | undefined
  ): string {
    if (!description) return "";

    return description
      .map((d) => `${this.marked(d.value).replace(/\n/g, "").trim()}`)
      .join("");
  }

  protected buildRulesBlock(memberValue: MemberValue): string {
    if (memberValue.rules.length === 0) return "";

    let block = "<br/>Rules:<br/><ul>";

    for (const rule of memberValue.rules) {
      switch (rule.id) {
        case "ArrayMaxItems":
          block += `<li>MUST have at most \`${rule.max.value}\` item${
            rule.max.value === 1 ? "" : "s"
          }.</li>`;
          break;
        case "ArrayMinItems":
          block += `<li>MUST have at least \`${rule.min.value}\` item${
            rule.min.value === 1 ? "" : "s"
          }.</li>`;
          break;
        case "ArrayUniqueItems":
          block += `<li>MUST have unique items.</li>`;
          break;
        case "NumberGT":
          block += `<li>MUST be greater than \`${rule.value.value}\`.</li>`;
          break;
        case "NumberGTE":
          block += `<li>MUST be greater than or equal to \`${rule.value.value}\`.</li>`;
          break;
        case "NumberLT":
          block += `<li>MUST be less than \`${rule.value.value}\`.</li>`;
          break;
        case "NumberLTE":
          block += `<li>MUST be less than or equal to \`${rule.value.value}\`.</li>`;
          break;
        case "StringMaxLength":
          block += `<li>MUST have a length of at most \`${rule.length.value}\`.</li>`;
          break;
        case "StringMinLength":
          block += `<li>MUST have a length of at least \`${rule.length.value}\`.</li>`;
          break;
        case "StringPattern":
          block += `<li>MUST match the pattern \`${rule.pattern.value}\`.</li>`;
          break;
        case "StringFormat":
          block += `<li>MUST be a valid \`${rule.format.value}\`.</li>`;
          break;
      }
    }

    return block + "</ul>";
  }

  protected traverse(type: Type, stop?: string): Type[] {
    const _types: Type[] = [];
    const _todo: Type[] = [type];

    const shouldContinue = (t: Type | undefined) =>
      !!t && !_types.includes(t) && snake(t.name.value) !== snake(stop);

    while (_todo.length > 0) {
      const t = _todo.shift();
      if (!t) continue;
      if (shouldContinue(t)) _types.push(t);

      for (const property of t.properties) {
        if (property.value.kind === "ComplexValue") {
          const t = getTypeByName(this.service, property.value.typeName.value);

          if (t) {
            if (shouldContinue(t)) _todo.push(t);
          } else {
            const u = getUnionByName(
              this.service,
              property.value.typeName.value
            );
            if (u) {
              for (const member of u.members) {
                const t = getTypeByName(this.service, member.typeName.value);
                if (shouldContinue(t)) _todo.push(t);
              }
            }
          }
        }
      }
    }

    return _types;
  }
}

class SpecBuilder extends DocumentationBuilder {
  constructor(service: Service, marked: (text: string) => string) {
    super(service, marked);

    this.serviceType = this.service.types.find(
      (t) => t.name.value === "Service"
    )!; // TODO
    const allServiceTypes = this.traverse(this.serviceType);

    const rpcEntry = new Set([
      "parseRequest",
      "parseResponse",
      "validateRequest",
      "validateResponse",
      "generateRequest",
      "generateResponse",
      "errorResponse",
    ]);
    const rpcEntryTypes = this.service.types.filter((t) =>
      rpcEntry.has(t.name.value)
    );
    this.parserTypes = [];
    this.ruleTypes = [];
    this.generatorTypes = [];
    this.rpcTypes = [];
    const seenRpcEntryTypesNames = new Set<string>();
    for (const t of rpcEntryTypes) {
      for (const tt of this.traverse(t, "Service")) {
        const name = tt.name.value;
        if (!seenRpcEntryTypesNames.has(name)) {
          seenRpcEntryTypesNames.add(name);

          if (name.startsWith("parse")) {
            this.parserTypes.push(tt);
          } else if (name.startsWith("validate") || name.startsWith("rule")) {
            this.ruleTypes.push(tt);
          } else if (name.startsWith("generat")) {
            this.generatorTypes.push(tt);
          } else {
            this.rpcTypes.push(tt);
          }
        }
      }
    }

    this.types = allServiceTypes.filter(
      (t) => !t.name.value.endsWith("Rule") && !t.name.value.endsWith("Literal")
    );
    this.rules = allServiceTypes.filter(
      (t) => t.name.value.endsWith("Rule") && !t.name.value.startsWith("Object")
    );
    this.objectRules = allServiceTypes.filter(
      (t) => t.name.value.endsWith("Rule") && t.name.value.startsWith("Object")
    );
    this.literals = allServiceTypes.filter((t) =>
      t.name.value.endsWith("Literal")
    );
  }
  private outline: number = 0;

  private readonly serviceType: Type;
  private readonly types: Type[];
  private readonly rules: Type[];
  private readonly objectRules: Type[];
  private readonly literals: Type[];

  private readonly parserTypes: Type[];
  private readonly ruleTypes: Type[];
  private readonly generatorTypes: Type[];
  private readonly rpcTypes: Type[];

  async build(): Promise<File[]> {
    return [
      {
        path: ["ir.mdx"],
        contents: Array.from(this.buildFileContents(this.serviceType)).join(
          "\n"
        ),
      },
    ];
  }

  private *buildFileContents(type: Type): IterableIterator<string> {
    this.outline = 4;
    const version = getBasketryIrVersion();
    const processedContent = content.replace(/\{\{version\}\}/g, version);

    yield processedContent;
    yield "";
    yield `### ${this.outline}.1 Structure`;

    for (let i = 0; i < this.types.length; i++) {
      const t = this.types[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }

    yield `### ${this.outline}.2 Rules`;

    for (let i = 0; i < this.rules.length; i++) {
      const t = this.rules[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }

    yield `### ${this.outline}.3 Object Rules`;

    for (let i = 0; i < this.objectRules.length; i++) {
      const t = this.objectRules[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }

    yield `### ${this.outline}.4 Literals`;

    for (let i = 0; i < this.literals.length; i++) {
      const t = this.literals[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }

    this.outline++;

    yield `## ${this.outline} Plugins`;

    yield ":::info";
    yield "Plugins based on JSON-RPC 2.0 are supported in Basketry v0.2.1 and higher with the `--engine rpc` flag. Without this flag, Basketry will use the Node modules plugins only without any change in behavior. The RPC engine also supports Node module plugins, but with a deprecation warning. Basketry v0.3.0 will use the RPC engine by default and remove support for Node module plugins entirely.";
    yield ":::";

    yield "Basketry is built on a modular plugin architecture. Plugins are independent processes that communicate with the Basketry orchestrator over [JSON-RPC 2.0](https://www.jsonrpc.org). Because of this design, plugins MAY be written in any programming language, and plugins written in different languages can be composed together in the same pipeline without issue.";
    yield "";
    yield "There are three types of plugins in Basketry:";
    yield "1. **Parsers:** convert raw API definitions (eg. OpenAPI) into Basketry’s intermediate representation (IR).";
    yield "1. **Rules:** validate the IR against governance requirements.";
    yield "1. **Generators:** produce artifacts (such as code or documentation) from the IR.";
    yield "";
    yield "Together, these three plugin types form a pipeline: parsers establish a consistent model, rules enforce quality, and generators create outputs. Each plugin type is invoked via a specific JSON-RPC method (`basketry.parse`, `basketry.validate`, `basketry.generate`).";

    yield `### ${this.outline}.1 Parsers`;

    yield `A Parser is a Basketry plugin responsible for converting raw source content into a structured intermediate representation (IR) represented by the \`Service\` type. Parsers are invoked via the \`basketry.parse\` JSON-RPC method, which provides the source file content and contextual metadata. A parser MUST return a \`ParseResponse\` containing either a \`Service\` object, a list of \`Violations\`, or both. If the input cannot be safely parsed, the service field in the response MUST be \`undefined\`. Violations MAY include errors, warnings, or informational messages; they SHOULD provide insight into structural or semantic issues in the input document. This separation of result and diagnostics allows downstream tools (e.g., validators and generators) to operate on partially valid input while preserving robust error reporting.`;

    for (let i = 0; i < this.parserTypes.length; i++) {
      const t = this.parserTypes[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }

    yield `### ${this.outline}.2 Rules`;

    yield "A Rule is a Basketry plugin used to enforce API governance by validating a parsed `Service` definition. Rules are invoked via the `basketry.validate` JSON-RPC method, which supplies the intermediate representation (IR) of the service along with any rule-specific configuration. Each rule MUST evaluate the provided `Service` and return a list of `Violation` objects describing any issues discovered. If no issues are found, the rule MUST return an empty array.";
    yield "";
    yield "Rules operate exclusively on the IR and MUST NOT require access to the original source files. Rules MUST NOT mutate the `Service` object they receive. Rule execution is stateless and isolated; rule plugins SHOULD NOT rely on execution order or shared memory. This allows rules to be composed and executed in arbitrary order within a validation pipeline.";
    yield "";
    yield 'Validation results MAY include violations of varying severity (`"error"`, `"warning"`, or `"info"`), depending on the nature and impact of each issue. Rules MAY be configured via an options object passed in the request, allowing rule authors to expose tunable behavior.';

    for (let i = 0; i < this.ruleTypes.length; i++) {
      const t = this.ruleTypes[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }

    yield `### ${this.outline}.3 Generators`;

    yield "A generator is a Basketry plugin responsible for producing artifacts (such as source code, documentation, or configuration files) from a parsed `Service` definition. Generators are invoked via the `basketry.generate` JSON-RPC method and return a collection of `File` objects. Each `File` object includes a relative path and full contents, representing what SHOULD be written to disk by the Basketry orchestrator.";
    yield "";
    yield "Generators MUST NOT write files directly to the file system, and MUST NOT perform any file system I/O during the generation process. Instead, generators MUST return all generated output through their response. This ensures that Basketry pipelines remain deterministic and portable. Generators MAY support configuration via the `options` property in the `GeneratorContext`, allowing for flexible and customizable outputs. However, generators MUST apply consistent defaults when no options are provided.";
    yield "";
    yield "A generator MUST be a pure function—given the same input `Service` and configuration options, it MUST always return the same set of files. This property guarantees that Basketry pipelines are idempotent, enabling reproducible builds and consistent results across environments.";

    for (let i = 0; i < this.generatorTypes.length; i++) {
      const t = this.generatorTypes[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }

    yield `### ${this.outline}.4 Utility`;

    for (let i = 0; i < this.rpcTypes.length; i++) {
      const t = this.rpcTypes[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }
  }

  protected buildTypeNameHeading(type: Type): string {
    const typeIndex = this.types.findIndex(
      (t) => t.name.value === type.name.value
    );

    const ruleIndex = this.rules.findIndex(
      (t) => t.name.value === type.name.value
    );

    const objectRuleIndex = this.objectRules.findIndex(
      (t) => t.name.value === type.name.value
    );

    const literalIndex = this.literals.findIndex(
      (t) => t.name.value === type.name.value
    );

    const parserIndex = this.parserTypes.findIndex(
      (t) => t.name.value === type.name.value
    );

    const validateIndex = this.ruleTypes.findIndex(
      (t) => t.name.value === type.name.value
    );

    const generateIndex = this.generatorTypes.findIndex(
      (t) => t.name.value === type.name.value
    );

    const rpcIndex = this.rpcTypes.findIndex(
      (t) => t.name.value === type.name.value
    );

    const outline =
      typeIndex > -1 ||
      ruleIndex > -1 ||
      objectRuleIndex > -1 ||
      literalIndex > -1
        ? 4
        : 5;

    switch (true) {
      case typeIndex > -1:
        return `${outline}.1.${typeIndex + 1} ${pascal(type.name.value)}`;
      case ruleIndex > -1:
        return `${outline}.2.${ruleIndex + 1} ${pascal(type.name.value)}`;
      case objectRuleIndex > -1:
        return `${outline}.3.${objectRuleIndex + 1} ${pascal(type.name.value)}`;
      case literalIndex > -1:
        return `${outline}.4.${literalIndex + 1} ${pascal(type.name.value)}`;

      case parserIndex > -1:
        return `${outline}.1.${parserIndex + 1} ${pascal(type.name.value)}`;

      case validateIndex > -1:
        return `${outline}.2.${validateIndex + 1} ${pascal(type.name.value)}`;

      case generateIndex > -1:
        return `${outline}.3.${generateIndex + 1} ${pascal(type.name.value)}`;

      case rpcIndex > -1:
        return `${outline}.4.${rpcIndex + 1} ${pascal(type.name.value)}`;
    }
  }
}
