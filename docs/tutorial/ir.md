---
title: Basketry IR Specification v0.2
slug: /specification/v0.2
toc_max_heading_level: 4
---

# Basketry IR Specification v0.2 [DRAFT]

## 1 Introduction

## 2 Concepts

### 2.1 Single Structure

### 2.2 Source Mapping

<!-- A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:

- Single point: `<sourceIndex>:<row>;<col>;<offset>` (eg. `\"4;12;88\"`)
- Single row: `<sourceIndex>:<row>;<col1>;<col2>;<offset1>;<offset2>` (eg. `\"4;12;21;88;97\"`)
- Multi row: `<sourceIndex>:<row1>;<col1>;<row2>;<col2>;<offset1>;<offset2>` (eg. `\"4;12;6;3;88;164\"`)

Both the `row` and `column` values are 1-based. The `offset` values are 0-based. -->

## 3 Specification


### 3.1 Structure
#### 3.1.1 Service
<p>Intermediate Representation (IR) of a service. The Basketry Intermediate Representation (IR) defines a structured, machine-oriented format that abstracts over various Interface Definition Languages (IDLs) and Service Description Languages (SDLs). This standardized, language-agnostic schema allows tooling to consistently interpret the core attributes and behaviors of a service, independent of its underlying definition format.</p>
<p>Basketry IR is optimized for automated workflows, enabling code generation, documentation, validation, and custom analysis through reusable components without requiring developers to manually interact with the raw representation. While a typical Basketry pipeline translates human-friendly specifications (such as OpenAPI) into this intermediate format, the IR serves as a foundational layer for building new generators, rules, and other automation tools.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Service"` | ***REQUIRED.*** Always `"Service"`.  |
| basketry | `"0.2"` | ***REQUIRED.*** Always `"0.2"`. This string MUST be the version number of the Basketry Specification that the Intermediate Representation uses. The `basketry` field SHOULD be used by tooling to interpret the IR document. This is not related to the Service `majorVersion` string. |
| title | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The title of the service |
| majorVersion | [IntegerLiteral](#342-integerliteral) | ***REQUIRED.*** The major version of the Service (which is distinct from the Basketry Specification version). |
| sourcePaths | [string] | ***REQUIRED.*** An array of paths to the original source documents for this service. These paths are relative to the directory of the config file that produced the IR. All locations in the Intermediate Representation refer to ranges within these source documents. |
| interfaces | [[Interface](#312-interface)] | ***REQUIRED.*** An array of Interfaces defined in this Service. |
| types | [[Type](#313-type)] | ***REQUIRED.*** An array of Types defined in this Service. |
| enums | [[Enum](#314-enum)] | ***REQUIRED.*** An array of Enums defined in this Service. |
| unions | [[SimpleUnion](#315-simpleunion) \| [DiscriminatedUnion](#316-discriminatedunion)] | ***REQUIRED.*** An array of Unions defined in this Service. |
| loc | string |  The encoded location of the service in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the service. |
#### 3.1.2 Interface
<p>An Interface defines a cohesive set of related methods that collectively represent a functional contract within a service. Interfaces act as the primary grouping mechanism for operations and are protocol-agnostic by default. They provide a stable, language-neutral abstraction of service capabilities, ensuring that tooling can target a wide range of programming languages and frameworks without losing semantic meaning.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Interface"` | ***REQUIRED.*** Always `"Interface"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of the interface. This name MUST be unique within the Service. This value MAY be represented in any casing. Generators MUST NOT assume any particular casing for this value and SHOULD represent it in a language-idiomatic way. |
| description | [[StringLiteral](#341-stringliteral)] |  An array of strings that describe the interface. Each item in the array SHOULD be considered a separate paragraph. These values MAY include Markdown formatting. |
| methods | [[Method](#318-method)] | ***REQUIRED.*** An array of methods defined by this interface. |
| protocols | [Protocols](#319-protocols) |  Any protocol-specific information about the interface. This information is not part of the core interface structure and definition, but MAY be used by tooling to generate code for specific protocols. |
| deprecated | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the interface is deprecated. |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the interface. |
#### 3.1.3 Type
<p>A Type defines the structure of a data shape used within a service. Types are reusable, named contracts that describe how data is organized and validated across interfaces and methods. They provide a stable, language-neutral representation of complex data models, allowing tooling to interact iwth strongly typed artifacts in any target language while preserving the semantics and constraints defined in the original service description</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Type"` | ***REQUIRED.*** Always `"Type"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of the type. This name MUST be unique within the Service across all other types, enums, and unions. This value MAY be represented in any casing. Generators MUST NOT assume any particular casing for this value and SHOULD represent it in a language-idiomatic way. |
| description | [[StringLiteral](#341-stringliteral)] |  An array of strings that describe the type. Each item in the array SHOULD be considered a separate paragraph. These values MAY include Markdown formatting. |
| deprecated | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the type is deprecated. |
| properties | [[Property](#3110-property)] | ***REQUIRED.*** An array of named properties that make up the structure of the type. Each property has its own name, value definition, and optional constraints. Properties SHOULD be used when the type’s structure is defined by a fixed set of known field names. |
| mapProperties | [MapProperties](#3111-mapproperties) |  An optional set of allowed key and value shapes when the type represents a dynamic map or dictionary rather than a fixed set of fields. Map properties SHOULD be used when the type’s structure is defined by arbitrary keys whose values share a common schema. |
| rules | [[ObjectMinPropertiesRule](#331-objectminpropertiesrule) \| [ObjectMaxPropertiesRule](#332-objectmaxpropertiesrule) \| [ObjectAdditionalPropertiesRule](#333-objectadditionalpropertiesrule)] | ***REQUIRED.*** A set of constraints that apply to the overall structure of the type. These rules are specific to the type itself and are distinct from rules that apply to property definitions. |
| loc | string |  The encoded location of the type in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the type. |
#### 3.1.4 Enum
<p>An Enum defines a named set of constant values that represent all valid options for a particular member value.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Enum"` | ***REQUIRED.*** Always `"Enum"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of the enum. This name MUST be unique within the Service across all other types, enums, and unions. This value MAY be represented in any casing. Generators MUST NOT assume any particular casing for this value and SHOULD represent it in a language-idiomatic way. |
| description | [[StringLiteral](#341-stringliteral)] |  An array of strings that describe the enum. Each item in the array SHOULD be considered a separate paragraph. These values MAY include Markdown formatting. |
| members | [[EnumMember](#3112-enummember)] | ***REQUIRED.*** An array of the constant values that make up the enum. Each member defines a single allowed value along with its optional description.<br/>Rules:<br/><ul><li>MUST have at least `1` item.</li></ul> |
| deprecated | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the enum is deprecated. |
| loc | string |  The encoded location of the enum in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the enum. |
#### 3.1.5 SimpleUnion
<p>A Simple Union defines a member value that may be one of several possible primitive or complex types, without any additional field to indicate which type is in use. Implementations must determine the actual type based on the value itself. Simple unions are typically used for cases where the set of possible types is small and easily distinguishable without an explicit discriminator.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"SimpleUnion"` | ***REQUIRED.*** Always `"SimpleUnion"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of the union. This name MUST be unique within the Service across all other types, enums, and unions. This value MAY be represented in any casing. Generators MUST NOT assume any particular casing for this value and SHOULD represent it in a language-idiomatic way. |
| description | [[StringLiteral](#341-stringliteral)] |  An array of strings that describe the union. Each item in the array SHOULD be considered a separate paragraph. These values MAY include Markdown formatting. |
| members | [[PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue)] | ***REQUIRED.*** An array of the possible member values that make up the union.<br/>Rules:<br/><ul><li>MUST have at least `1` item.</li></ul> |
| disjunction | [DisjunctionKindLiteral](#344-disjunctionkindliteral) |  Indicates whether the union’s members are inclusive or exclusive. In an inclusive disjunction, a value MUST fully match at least one member and MAY also match others. In an exclusive disjunction, a value MUST fully match exactly one member and MUST NOT match any others. If this value is not present, tooling SHOULD consider the union to be inclusive. |
| deprecated | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the union is deprecated. |
| loc | string |  The encoded location of the union in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the union. |
#### 3.1.6 DiscriminatedUnion
<p>A Discriminated Union defines a member value that may be one of several possible object types, with an explicit discriminator property whose value identifies which type is present. This approach allows implementations to unambiguously determine the type at runtime without inspecting the full structure of the value. Discriminated unions are commonly used when member types share overlapping shapes or when reliable deserialization across languages and tools is required.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"DiscriminatedUnion"` | ***REQUIRED.*** Always `"DiscriminatedUnion"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of the union. This name MUST be unique within the Service across all other types, enums, and unions. This value MAY be represented in any casing. Generators MUST NOT assume any particular casing for this value and SHOULD represent it in a language-idiomatic way. |
| description | [[StringLiteral](#341-stringliteral)] |  An array of strings that describe the union. Each item in the array SHOULD be considered a separate paragraph. These values MAY include Markdown formatting. |
| discriminator | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of the discriminator property. This property MUST exist in all union member types and MUST use identical casing across all of them. |
| members | [[ComplexValue](#3114-complexvalue)] | ***REQUIRED.*** An array of the possible member values that make up the union.<br/>Rules:<br/><ul><li>MUST have at least `1` item.</li></ul> |
| deprecated | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the union is deprecated. |
| loc | string |  The encoded location of the union in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the union. |
#### 3.1.7 MetaValue
<p>Metadata in the form of a key-value pair.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"MetaValue"` | ***REQUIRED.*** Always `"MetaValue"`.  |
| key | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The key of the metadata value. |
| value | [UntypedLiteral](#345-untypedliteral) | ***REQUIRED.*** An untyped literal value. Implementations MUST NOT assume any particular type for this value. |
#### 3.1.8 Method
<p>A Method defines a single operation that can be performed on a service. Methods are the primary means of interacting with a service and are associated with a specific interface. They define the input parameters, output values, and any security requirements for executing the operation.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Method"` | ***REQUIRED.*** Always `"Method"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of the method. This name MUST be unique within the Service. This value MAY be represented in any casing. Generators MUST NOT assume any particular casing for this value and SHOULD represent it in a language-idiomatic way. |
| description | [[StringLiteral](#341-stringliteral)] |  An array of strings that describe the interface. Each item in the array SHOULD be considered a separate paragraph. These values MAY include Markdown formatting. |
| parameters | [[Parameter](#3115-parameter)] | ***REQUIRED.*** An array of parameters that are required for the method. Each parameter defines its own name, value definition, and optional constraints. |
| security | [[SecurityOption](#3116-securityoption)] | ***REQUIRED.***  |
| returns | [ReturnValue](#3117-returnvalue) |  The value that is returned by the method. This value is defined by the method’s return type. |
| deprecated | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the method is deprecated. |
| loc | string |  The encoded location of the method in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the method. |
#### 3.1.9 Protocols

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"InterfaceProtocols"` | ***REQUIRED.*** Always `"InterfaceProtocols"`.  |
| http | [[HttpRoute](#3118-httproute)] |   |
#### 3.1.10 Property
<p>A Property defines a named field within a type, representing a fixed part of that type’s structure. Each property specifies the field’s name, its data shape, and optional descriptive context. Properties are used when the set of field names is known in advance and does not vary between instances of the type.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Property"` | ***REQUIRED.*** Always `"Property"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of the property. This name MUST be unique within a type. This value MAY be represented in any casing. Generators MUST NOT assume any particular casing for this value and SHOULD represent it in a language-idiomatic way. |
| description | [[StringLiteral](#341-stringliteral)] |  An array of strings that describe the property. Each item in the array SHOULD be considered a separate paragraph. These values MAY include Markdown formatting. |
| value | [PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue) | ***REQUIRED.*** The value of the property. This value defines the data shape and constraints for the property. |
| deprecated | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the property is deprecated. |
| loc | string |  The encoded location of the property in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the property. |
#### 3.1.11 MapProperties
<p>Map properties define the allowed shape for values associated with dynamically named keys in a type. They are used when the set of field names is not known in advance, allowing instances of the type to contain any number of keys that conform to a shared schema. Unlike properties, which represent explicitly named fields that are the same for all instances of a type, map properties describe rules for dynamically named fields that may vary between instances.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"MapProperties"` | ***REQUIRED.*** Always `"MapProperties"`.  |
| key | [MapKey](#3119-mapkey) | ***REQUIRED.*** The shape of the keys that are allowed in the map. This value defines the data shape and constraints for the map keys. |
| requiredKeys | [[StringLiteral](#341-stringliteral)] | ***REQUIRED.*** An array of key names that MUST be present in every instance of the map. Each entry specifies a required key that MUST conform to the map’s value definition. The array MAY be empty. |
| value | [MapValue](#3120-mapvalue) | ***REQUIRED.*** The shape of the values that are allowed in the map. This value defines the data shape and constraints for the map values. |
| loc | string |  The encoded location of the map properties in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the map properties. |
#### 3.1.12 EnumMember
<p>Represents a single constant value within an enum.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"EnumMember"` | ***REQUIRED.*** Always `"EnumMember"`.  |
| content | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The constant value that represents the enum member. This value MUST be unique within the enum. |
| description | [[StringLiteral](#341-stringliteral)] |  An array of strings that describe the enum member. Each item in the array SHOULD be considered a separate paragraph. These values MAY include Markdown formatting. |
| deprecated | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the enum member is deprecated. |
| loc | string |  The encoded location of the enum member in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the enum member. |
#### 3.1.13 PrimitiveValue
<p>Represents a value whose type is one of the built-in primitives (such as string, number, boolean, or null). Unlike a complex value, a primitive value does not reference other types, enums, or unions—it directly describes a base data type.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"PrimitiveValue"` | ***REQUIRED.*** Always `"PrimitiveValue"`.  |
| typeName | [PrimitiveLiteral](#347-primitiveliteral) | ***REQUIRED.*** The name of the primitive type. |
| isArray | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the value is an array. |
| isNullable | [TrueLiteral](#343-trueliteral) |  Indicates whether the value MAY explicitly be set to `null`. When `true`, the type definition allows `null` as a valid value in addition to what is specified by `typeName`. Implementations MAY interpret `null` according to the closest equivalent in the target language or platform. (This differs from `isOptional`, where the value is not required to appear at all in the data structure or message.) |
| isOptional | [TrueLiteral](#343-trueliteral) |  Indicates whether the value MAY be omitted entirely. When `true`, the value is not required to appear in the data structure or message. (This differs from `isNullable`, where the value is present but MAY explicitly be `null`.) If this value is not present, tooling MUST consider the value to be required. |
| constant | [StringLiteral](#341-stringliteral) \| [NumberLiteral](#348-numberliteral) \| [BooleanLiteral](#349-booleanliteral) \| [NullLiteral](#3410-nullliteral) |  A single, fixed allowed value. This value MUST be compatible with the type specified by `typeName`. When defined, this value is the only valid value for the field, and tooling or validation MUST reject any other value. |
| default | [StringLiteral](#341-stringliteral) \| [NumberLiteral](#348-numberliteral) \| [BooleanLiteral](#349-booleanliteral) \| [NullLiteral](#3410-nullliteral) |  A value to be assumed or applied when none is provided. This value MUST be compatible with the type specified by `typeName`. A default does not restrict other valid values—it simply acts as the initial value when the field is omitted |
| rules | [[StringMaxLengthRule](#321-stringmaxlengthrule) \| [StringMinLengthRule](#322-stringminlengthrule) \| [StringPatternRule](#323-stringpatternrule) \| [StringFormatRule](#324-stringformatrule) \| [NumberMultipleOfRule](#325-numbermultipleofrule) \| [NumberGtRule](#326-numbergtrule) \| [NumberGteRule](#327-numbergterule) \| [NumberLtRule](#328-numberltrule) \| [NumberLteRule](#329-numberlterule) \| [ArrayMaxItemsRule](#3210-arraymaxitemsrule) \| [ArrayMinItemsRule](#3211-arrayminitemsrule) \| [ArrayUniqueItemsRule](#3212-arrayuniqueitemsrule)] | ***REQUIRED.*** A set of constraints that apply to the value, such as limits on length, numeric range, or array size. These rules define additional validation beyond the basic type definition and are distinct from rules that apply to a containing type. |
#### 3.1.14 ComplexValue
<p>Represents a value whose type is defined elsewhere in the Service as a named type, enum, or union.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ComplexValue"` | ***REQUIRED.*** Always `"ComplexValue"`.  |
| typeName | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of a type, enum, or union defined in this Service. The casing MUST match the casing of the referenced type, enum, or union definition exactly. |
| isArray | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the value is an array. |
| isNullable | [TrueLiteral](#343-trueliteral) |  Indicates whether the value MAY explicitly be set to `null`. When `true`, the type definition allows `null` as a valid value in addition to what is specified by `typeName`. Implementations MAY interpret `null` according to the closest equivalent in the target language or platform. (This differs from `isOptional`, where the value is not required to appear at all in the data structure or message.) |
| isOptional | [TrueLiteral](#343-trueliteral) |  Indicates whether the value MAY be omitted entirely. When `true`, the value is not required to appear in the data structure or message. (This differs from `isNullable`, where the value is present but MAY explicitly be `null`.) If this value is not present, tooling MUST consider the value to be required. |
| rules | [[StringMaxLengthRule](#321-stringmaxlengthrule) \| [StringMinLengthRule](#322-stringminlengthrule) \| [StringPatternRule](#323-stringpatternrule) \| [StringFormatRule](#324-stringformatrule) \| [NumberMultipleOfRule](#325-numbermultipleofrule) \| [NumberGtRule](#326-numbergtrule) \| [NumberGteRule](#327-numbergterule) \| [NumberLtRule](#328-numberltrule) \| [NumberLteRule](#329-numberlterule) \| [ArrayMaxItemsRule](#3210-arraymaxitemsrule) \| [ArrayMinItemsRule](#3211-arrayminitemsrule) \| [ArrayUniqueItemsRule](#3212-arrayuniqueitemsrule)] | ***REQUIRED.*** A set of constraints that apply to the value, such as limits on length, numeric range, or array size. These rules define additional validation beyond the basic type definition and are distinct from rules that apply to a containing type. |
#### 3.1.15 Parameter
<p>A Parameter defines an input value accepted by a method. Parameters define the contract for the information a method caller MUST (or MAY) provide, ensuring consistent behavior across all implementations of the service.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Parameter"` | ***REQUIRED.*** Always `"Parameter"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of the parameter. This name MUST be unique within the method. This value MAY be represented in any casing. Generators MUST NOT assume any particular casing for this value and SHOULD represent it in a language-idiomatic way. |
| description | [[StringLiteral](#341-stringliteral)] |  An array of strings that describe the parameter. Each item in the array SHOULD be considered a separate paragraph. These values MAY include Markdown formatting. |
| value | [PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue) | ***REQUIRED.*** The value of the parameter. This value defines the data shape and constraints for the parameter. |
| deprecated | [TrueLiteral](#343-trueliteral) |  A boolean value that indicates whether the parameter is deprecated. |
| loc | string |  The encoded location of the parameter in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the parameter. |
#### 3.1.16 SecurityOption

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"SecurityOption"` | ***REQUIRED.*** Always `"SecurityOption"`.  |
| schemes | [[BasicScheme](#3121-basicscheme) \| [ApiKeyScheme](#3122-apikeyscheme) \| [OAuth2Scheme](#3123-oauth2scheme)] | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.17 ReturnValue
<p>A ReturnValue defines the output produced by a method, specifying the value’s data shape and constraints.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ReturnValue"` | ***REQUIRED.*** Always `"ReturnValue"`.  |
| value | [PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue) | ***REQUIRED.*** The value that is returned by the method. This value defines the data shape and constraints for the return value. |
| loc | string |  The encoded location of the return value in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the return value. |
#### 3.1.18 HttpRoute

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpRoute"` | ***REQUIRED.*** Always `"HttpRoute"`.  |
| pattern | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| methods | [[HttpMethod](#3124-httpmethod)] | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.19 MapKey
<p>Defines the allowed shape and constraints for keys in Map Properties.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"MapKey"` | ***REQUIRED.*** Always `"MapKey"`.  |
| value | [PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue) | ***REQUIRED.*** The type definition for the map’s keys, which MAY be either a primitive or complex value. |
| loc | string |  The encoded location of the map key in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the map key. |
#### 3.1.20 MapValue
<p>Defines the allowed shape and constraints for values in Map Properties.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"MapValue"` | ***REQUIRED.*** Always `"MapValue"`.  |
| value | [PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue) | ***REQUIRED.*** The type definition for the map’s values, which MAY be either a primitive or complex value. |
| loc | string |  The encoded location of the map key in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |  An array of metadata values for the map key. |
#### 3.1.21 BasicScheme

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"BasicScheme"` | ***REQUIRED.*** Always `"BasicScheme"`.  |
| type | [BasicSchemeType](#3125-basicschemetype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [StringLiteral](#341-stringliteral) |   |
| loc | string |  The encoded location of this node in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.22 ApiKeyScheme

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ApiKeyScheme"` | ***REQUIRED.*** Always `"ApiKeyScheme"`.  |
| type | [ApiKeySchemeType](#3126-apikeyschemetype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| parameter | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| in | [ApiKeySchemeIn](#3127-apikeyschemein) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.23 OAuth2Scheme

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2Scheme"` | ***REQUIRED.*** Always `"OAuth2Scheme"`.  |
| type | [OAuth2SchemeType](#3128-oauth2schemetype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| flows | [[OAuth2ImplicitFlow](#3129-oauth2implicitflow) \| [OAuth2PasswordFlow](#3130-oauth2passwordflow) \| [OAuth2ClientCredentialsFlow](#3131-oauth2clientcredentialsflow) \| [OAuth2AuthorizationCodeFlow](#3132-oauth2authorizationcodeflow)] | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.24 HttpMethod

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpMethod"` | ***REQUIRED.*** Always `"HttpMethod"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| verb | [HttpVerbLiteral](#3413-httpverbliteral) | ***REQUIRED.***  |
| parameters | [[HttpParameter](#3133-httpparameter)] | ***REQUIRED.***  |
| successCode | [HttpStatusCodeLiteral](#3414-httpstatuscodeliteral) | ***REQUIRED.***  |
| requestMediaTypes | [[StringLiteral](#341-stringliteral)] | ***REQUIRED.***  |
| responseMediaTypes | [[StringLiteral](#341-stringliteral)] | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.25 BasicSchemeType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"basic"` | ***REQUIRED.*** Always `"basic"`.  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.26 ApiKeySchemeType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"apiKey"` | ***REQUIRED.*** Always `"apiKey"`.  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.27 ApiKeySchemeIn

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"cookie"` \| `"header"` \| `"query"` | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.28 OAuth2SchemeType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"oauth2"` | ***REQUIRED.*** Always `"oauth2"`.  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.29 OAuth2ImplicitFlow

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2ImplicitFlow"` | ***REQUIRED.*** Always `"OAuth2ImplicitFlow"`.  |
| type | [OAuth2ImplicitFlowType](#3134-oauth2implicitflowtype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| authorizationUrl | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| refreshUrl | [StringLiteral](#341-stringliteral) |   |
| scopes | [[OAuth2Scope](#3135-oauth2scope)] | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.30 OAuth2PasswordFlow

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2PasswordFlow"` | ***REQUIRED.*** Always `"OAuth2PasswordFlow"`.  |
| type | [OAuth2PasswordFlowType](#3136-oauth2passwordflowtype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| tokenUrl | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| refreshUrl | [StringLiteral](#341-stringliteral) |   |
| scopes | [[OAuth2Scope](#3135-oauth2scope)] | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.31 OAuth2ClientCredentialsFlow

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2ClientCredentialsFlow"` | ***REQUIRED.*** Always `"OAuth2ClientCredentialsFlow"`.  |
| type | [OAuth2ClientCredentialsFlowType](#3137-oauth2clientcredentialsflowtype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| tokenUrl | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| refreshUrl | [StringLiteral](#341-stringliteral) |   |
| scopes | [[OAuth2Scope](#3135-oauth2scope)] | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.32 OAuth2AuthorizationCodeFlow

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2AuthorizationCodeFlow"` | ***REQUIRED.*** Always `"OAuth2AuthorizationCodeFlow"`.  |
| type | [OAuth2AuthorizationCodeFlowType](#3138-oauth2authorizationcodeflowtype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| authorizationUrl | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| tokenUrl | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| refreshUrl | [StringLiteral](#341-stringliteral) |   |
| scopes | [[OAuth2Scope](#3135-oauth2scope)] | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.33 HttpParameter

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpParameter"` | ***REQUIRED.*** Always `"HttpParameter"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| location | [HttpLocationLiteral](#3415-httplocationliteral) | ***REQUIRED.***  |
| arrayFormat | [HttpArrayFormatLiteral](#3416-httparrayformatliteral) |   |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.34 OAuth2ImplicitFlowType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"implicit"` | ***REQUIRED.*** Always `"implicit"`.  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.35 OAuth2Scope

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2Scope"` | ***REQUIRED.*** Always `"OAuth2Scope"`.  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| loc | string |  The encoded location of this node in the source document(s). |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.36 OAuth2PasswordFlowType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"password"` | ***REQUIRED.*** Always `"password"`.  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.37 OAuth2ClientCredentialsFlowType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"clientCredentials"` | ***REQUIRED.*** Always `"clientCredentials"`.  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.1.38 OAuth2AuthorizationCodeFlowType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"authorizationCode"` | ***REQUIRED.*** Always `"authorizationCode"`.  |
| loc | string |  The encoded location of this node in the source document(s). |
### 3.2 Rules
#### 3.2.1 StringMaxLengthRule
<p>A validation rule that specifies the maximum length of a string.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"StringMaxLength"` | ***REQUIRED.*** Always `"StringMaxLength"`.  |
| length | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.2 StringMinLengthRule
<p>A validation rule that specifies the minimum length of a string.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"StringMinLength"` | ***REQUIRED.*** Always `"StringMinLength"`.  |
| length | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.3 StringPatternRule
<p>A validation rule that specifies a regular expression pattern that a string MUST match.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"StringPattern"` | ***REQUIRED.*** Always `"StringPattern"`.  |
| pattern | [NonEmptyStringLiteral](#3411-nonemptystringliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.4 StringFormatRule
<p>A validation rule that specifies a format that a string SHOULD conform to. This rule is distinct from `StringPattern` because it allows for additional named formats beyond regular expressions. Implementations SHOULD interpret the format according to the closest equivalent in the target language or platform.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"StringFormat"` | ***REQUIRED.*** Always `"StringFormat"`.  |
| format | [NonEmptyStringLiteral](#3411-nonemptystringliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.5 NumberMultipleOfRule
<p>A validation rule that specifies a multiple of a number.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"NumberMultipleOf"` | ***REQUIRED.*** Always `"NumberMultipleOf"`.  |
| value | [NonNegativeNumberLiteral](#3412-nonnegativenumberliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.6 NumberGtRule
<p>A validation rule that specifies a number that MUST be greater than a given value.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"NumberGT"` | ***REQUIRED.*** Always `"NumberGT"`.  |
| value | [NumberLiteral](#348-numberliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.7 NumberGteRule
<p>A validation rule that specifies a number that MUST be greater than or equal to a given value.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"NumberGTE"` | ***REQUIRED.*** Always `"NumberGTE"`.  |
| value | [NumberLiteral](#348-numberliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.8 NumberLtRule
<p>A validation rule that specifies a number that MUST be less than a given value.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"NumberLT"` | ***REQUIRED.*** Always `"NumberLT"`.  |
| value | [NumberLiteral](#348-numberliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.9 NumberLteRule
<p>A validation rule that specifies a number that MUST be less than or equal to a given value.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"NumberLTE"` | ***REQUIRED.*** Always `"NumberLTE"`.  |
| value | [NumberLiteral](#348-numberliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.10 ArrayMaxItemsRule
<p>A validation rule that specifies the maximum number of items in an array.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"ArrayMaxItems"` | ***REQUIRED.*** Always `"ArrayMaxItems"`.  |
| max | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.11 ArrayMinItemsRule
<p>A validation rule that specifies the minimum number of items in an array.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"ArrayMinItems"` | ***REQUIRED.*** Always `"ArrayMinItems"`.  |
| min | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.2.12 ArrayUniqueItemsRule
<p>A validation rule that specifies that all items in an array MUST be unique.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.*** Always `"ValidationRule"`.  |
| id | `"ArrayUniqueItems"` | ***REQUIRED.*** Always `"ArrayUniqueItems"`.  |
| required | boolean | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
### 3.3 Object Rules
#### 3.3.1 ObjectMinPropertiesRule
<p>A validation rule that specifies the minimum number of properties on an object. This rule MAY be ignored by tooling if the object type does not define any Map Properties.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ObjectValidationRule"` | ***REQUIRED.*** Always `"ObjectValidationRule"`.  |
| id | `"ObjectMinProperties"` | ***REQUIRED.*** Always `"ObjectMinProperties"`.  |
| min | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.3.2 ObjectMaxPropertiesRule
<p>A validation rule that specifies the maximum number of properties on an object. This rule MAY be ignored by tooling if the object type does not define any Map Properties.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ObjectValidationRule"` | ***REQUIRED.*** Always `"ObjectValidationRule"`.  |
| id | `"ObjectMaxProperties"` | ***REQUIRED.*** Always `"ObjectMaxProperties"`.  |
| max | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.3.3 ObjectAdditionalPropertiesRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ObjectValidationRule"` | ***REQUIRED.*** Always `"ObjectValidationRule"`.  |
| id | `"ObjectAdditionalProperties"` | ***REQUIRED.*** Always `"ObjectAdditionalProperties"`.  |
| forbidden | [TrueLiteral](#343-trueliteral) | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
### 3.4 Literals
#### 3.4.1 StringLiteral
<p>Represents a string value exactly as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"StringLiteral"` | ***REQUIRED.*** Always `"StringLiteral"`.  |
| value | string | ***REQUIRED.***  |
| loc | string |  The location of this in the doc. |
#### 3.4.2 IntegerLiteral
<p>Represents an integer value exactly as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"IntegerLiteral"` | ***REQUIRED.*** Always `"IntegerLiteral"`.  |
| value | integer | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.3 TrueLiteral
<p>Represents a boolean `true` value exactly as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"TrueLiteral"` | ***REQUIRED.*** Always `"TrueLiteral"`.  |
| value | `true` | ***REQUIRED.*** Always `true`.  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.4 DisjunctionKindLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"DisjunctionKindLiteral"` | ***REQUIRED.*** Always `"DisjunctionKindLiteral"`.  |
| value | `"exclusive"` \| `"inclusive"` | ***REQUIRED.*** In an inclusive disjunction, a value MUST fully match at least one union member and MAY also match others. In an exclusive disjunction, a value MUST fully match exactly one union member and MUST NOT match any others. |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.5 UntypedLiteral
<p>An untyped literal value. Implementations MUST NOT assume any particular type for this value.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"UntypedLiteral"` | ***REQUIRED.*** Always `"UntypedLiteral"`.  |
| value | untyped | ***REQUIRED.***  |
| loc | string |  The encoded location of the untyped literal value in the source document(s). |
#### 3.4.6 NonNegativeIntegerLiteral
<p>Represents a non-negative integer value exactly as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"NonNegativeIntegerLiteral"` | ***REQUIRED.*** Always `"NonNegativeIntegerLiteral"`.  |
| value | integer | ***REQUIRED.*** <br/>Rules:<br/><ul><li>MUST be greater than or equal to `0`.</li></ul> |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.7 PrimitiveLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"PrimitiveLiteral"` | ***REQUIRED.*** Always `"PrimitiveLiteral"`.  |
| value | `"binary"` \| `"boolean"` \| `"date"` \| `"date-time"` \| `"double"` \| `"float"` \| `"integer"` \| `"long"` \| `"null"` \| `"number"` \| `"string"` \| `"untyped"` | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.8 NumberLiteral
<p>Represents a numeric value exactly as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"NumberLiteral"` | ***REQUIRED.*** Always `"NumberLiteral"`.  |
| value | integer | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.9 BooleanLiteral
<p>Represents a boolean value exactly as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"BooleanLiteral"` | ***REQUIRED.*** Always `"BooleanLiteral"`.  |
| value | boolean | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.10 NullLiteral
<p>Represents a null value exactly as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"NullLiteral"` | ***REQUIRED.*** Always `"NullLiteral"`.  |
| value | untyped | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.11 NonEmptyStringLiteral
<p>Represents a non-empty string value exactly as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"NonEmptyStringLiteral"` | ***REQUIRED.*** Always `"NonEmptyStringLiteral"`.  |
| value | string | ***REQUIRED.*** <br/>Rules:<br/><ul><li>MUST have a length of at least `1`.</li></ul> |
| loc | string |  The location of this in the doc. |
#### 3.4.12 NonNegativeNumberLiteral
<p>Represents a non-negative numeric value exactly as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"NonNegativeNumberLiteral"` | ***REQUIRED.*** Always `"NonNegativeNumberLiteral"`.  |
| value | number | ***REQUIRED.*** <br/>Rules:<br/><ul><li>MUST be greater than or equal to `0`.</li></ul> |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.13 HttpVerbLiteral
<p>Represents an HTTP verb string as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpVerbLiteral"` | ***REQUIRED.*** Always `"HttpVerbLiteral"`.  |
| value | `"delete"` \| `"get"` \| `"head"` \| `"options"` \| `"patch"` \| `"post"` \| `"put"` \| `"trace"` | ***REQUIRED.*** The HTTP verb as a lowercase string. Generators MAY represent this value in a language- or platform-idiomatic casing. |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.14 HttpStatusCodeLiteral
<p>Represents an HTTP status code as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpStatusCodeLiteral"` | ***REQUIRED.*** Always `"HttpStatusCodeLiteral"`.  |
| value | integer | ***REQUIRED.*** <br/>Rules:<br/><ul><li>MUST be greater than or equal to `100`.</li><li>MUST be less than or equal to `599`.</li></ul> |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.15 HttpLocationLiteral
<p>Represents the location of an HTTP parameter as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpLocationLiteral"` | ***REQUIRED.*** Always `"HttpLocationLiteral"`.  |
| value | `"body"` \| `"formData"` \| `"header"` \| `"path"` \| `"query"` | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |
#### 3.4.16 HttpArrayFormatLiteral
<p>Represents the format of an array in an HTTP request or response as it appears in the original source document.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpArrayFormatLiteral"` | ***REQUIRED.*** Always `"HttpArrayFormatLiteral"`.  |
| value | `"csv"` \| `"multi"` \| `"pipes"` \| `"ssv"` \| `"tsv"` | ***REQUIRED.***  |
| loc | string |  The encoded location of this node in the source document(s). |