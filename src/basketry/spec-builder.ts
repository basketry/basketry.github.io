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
import { kebab, pascal } from "case";

const content = fs.readFileSync(path.join(__dirname, "content.md"), "utf8");

export const specBuilder: (marked: (text: string) => string) => Generator =
  (marked) => async (service) => {
    const specBuilder = new SpecBuilder(service, marked);
    return await specBuilder.build();
  };

class SpecBuilder {
  constructor(
    private readonly service: Service,
    private readonly marked: (text: string) => string
  ) {
    this.serviceType = this.service.types.find(
      (t) => t.name.value === "Service"
    )!; // TODO
    const allTypes = this.traverse(this.serviceType);

    this.types = allTypes.filter(
      (t) => !t.name.value.endsWith("Rule") && !t.name.value.endsWith("Literal")
    );
    this.rules = allTypes.filter(
      (t) => t.name.value.endsWith("Rule") && !t.name.value.startsWith("Object")
    );
    this.objectRules = allTypes.filter(
      (t) => t.name.value.endsWith("Rule") && t.name.value.startsWith("Object")
    );
    this.literals = allTypes.filter((t) => t.name.value.endsWith("Literal"));
  }
  private readonly serviceType: Type;
  private readonly types: Type[];
  private readonly rules: Type[];
  private readonly objectRules: Type[];
  private readonly literals: Type[];

  async build(): Promise<File[]> {
    return [
      {
        path: ["ir.md"],
        contents: Array.from(this.buildFileContents(this.serviceType)).join(
          "\n"
        ),
      },
    ];
  }

  private *buildFileContents(type: Type): IterableIterator<string> {
    yield content;
    yield "";
    yield "### 3.1 Structure";

    for (let i = 0; i < this.types.length; i++) {
      const t = this.types[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }

    yield "### 3.2 Rules";

    for (let i = 0; i < this.rules.length; i++) {
      const t = this.rules[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }

    yield "### 3.3 Object Rules";

    for (let i = 0; i < this.objectRules.length; i++) {
      const t = this.objectRules[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }

    yield "### 3.4 Literals";

    for (let i = 0; i < this.literals.length; i++) {
      const t = this.literals[i];

      yield `#### ${this.buildTypeNameHeading(t)}`;
      yield this.buildTypeDescription(t.description);

      yield "##### Fields Specification";
      yield* this.buildPropertiesTable(t);
    }
  }

  private buildConstantDocs(memberValue: MemberValue): string {
    if (memberValue.kind === "PrimitiveValue" && memberValue.constant) {
      return ` Always ${this.buildPrimitiveConstant(memberValue.constant)}.`;
    }

    return "";
  }

  private *buildPropertiesTable(type: Type): Iterable<string> {
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

  private buildTypeNameHeading(type: Type): string {
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

    switch (true) {
      case typeIndex > -1:
        return `3.1.${typeIndex + 1} ${pascal(type.name.value)}`;
      case ruleIndex > -1:
        return `3.2.${ruleIndex + 1} ${pascal(type.name.value)}`;
      case objectRuleIndex > -1:
        return `3.3.${objectRuleIndex + 1} ${pascal(type.name.value)}`;
      case literalIndex > -1:
        return `3.4.${literalIndex + 1} ${pascal(type.name.value)}`;
    }
  }

  private buildTypeNameSlug(type: Type): string {
    const heading = this.buildTypeNameHeading(type).replace(/\./g, "");

    return kebab(heading);
  }

  private buildPropertyType(property: Property): string {
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

  private buildPrimitiveConstant(constant: PrimitiveValueConstant): string {
    if (constant.kind === "StringLiteral") {
      return `\`"${constant.value}"\``;
    } else {
      return `\`${constant.value}\``;
    }
  }

  private buildTypeNameLink(typeName: string): string {
    const type = getTypeByName(this.service, typeName);

    if (type) {
      const slug = type ? this.buildTypeNameSlug(type) : "";
      return `[${pascal(typeName)}](#${slug})`;
    }

    const unionType = getUnionByName(this.service, typeName);
    if (unionType) {
      const members = unionType.members.map((m: MemberValue) =>
        getTypeByName(this.service, m.typeName.value)
      );

      return members
        .map((t) => {
          const slug = t ? this.buildTypeNameSlug(t) : "";
          return `[${pascal(t.name.value)}](#${slug})`;
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

  private buildTypeDescription(
    description: StringLiteral[] | undefined
  ): string {
    if (!description) return "";

    return description
      .map((d) => `<p>${this.marked(d.value).replace(/\n/g, "").trim()}</p>`)
      .join("\n");
  }

  private buildPropertyDescription(
    description: StringLiteral[] | undefined
  ): string {
    if (!description) return "";

    return description
      .map((d) => `${this.marked(d.value).replace(/\n/g, "").trim()}`)
      .join("");
  }

  private buildRulesBlock(memberValue: MemberValue): string {
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

  private traverse(type: Type): Type[] {
    const _types: Type[] = [];

    const _todo: Type[] = [type];

    while (_todo.length > 0) {
      const t = _todo.shift();
      if (!t) continue;
      if (!_types.includes(t)) _types.push(t);

      for (const property of t.properties) {
        if (property.value.kind === "ComplexValue") {
          const t = getTypeByName(this.service, property.value.typeName.value);

          if (t) {
            if (!_types.includes(t)) _todo.push(t);
          } else {
            const u = getUnionByName(
              this.service,
              property.value.typeName.value
            );
            if (u) {
              for (const member of u.members) {
                const t = getTypeByName(this.service, member.typeName.value);
                if (t && !_types.includes(t)) _todo.push(t);
              }
            }
          }
        }
      }
    }

    return _types;
  }
}
