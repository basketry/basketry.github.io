---
title: Basketry IR Specification v0.2
slug: /specification
toc_max_heading_level: 4
---

# Basketry IR Specification v0.2 [DRAFT]

:::info
This specification is currently in a DRAFT state pending the full release of version 0.2. Portions of this document may be incomplete, incorrect, or change without notice.
:::

## 1 Introduction

## 2 Concepts

### 2.1 Single Structure

### 2.2 Source Mapping

## 3 Specification


### 3.1 Structure
#### 3.1.1 Service
<p>Intermediate Representation (IR) of a service. The Basketry Intermediate Representation (IR) defines a structured, machine-oriented format that abstracts over various Interface Definition Languages (IDLs) and Service Description Languages (SDLs). This standardized, language-agnostic schema allows tooling to consistently interpret the core attributes and behaviors of a service, independent of its underlying definition format.</p>
<p>Basketry IR is optimized for automated workflows, enabling code generation, documentation, validation, and custom analysis through reusable components without requiring developers to manually interact with the raw representation. While a typical Basketry pipeline translates human-friendly specifications (such as OpenAPI) into this intermediate format, the IR serves as a foundational layer for building new generators, rules, and other automation tools.</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Service"` | ***REQUIRED.***  |
| basketry | `"0.2"` | ***REQUIRED.*** This string MUST be the version number of the Basketry Specification that the Intermediate Representation uses. The `basketry` field SHOULD be used by tooling to interpret the IR document. This is not related to the Service `majorVersion` string. |
| title | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The title of the service |
| majorVersion | [IntegerLiteral](#342-integerliteral) | ***REQUIRED.*** The major version of the Service (which is distinct from the Basketry Specification version). |
| sourcePaths | [string] | ***REQUIRED.*** The path to the original source document for this service. All locations in the Intermediate Representation refer to ranges within this source document. |
| interfaces | [[Interface](#312-interface)] | ***REQUIRED.*** An array of Interfaces defined in this Service. |
| types | [[Type](#313-type)] | ***REQUIRED.*** An array of Types defined in this Service. |
| enums | [[Enum](#314-enum)] | ***REQUIRED.*** An array of Enums defined in this Service. |
| unions | [[SimpleUnion](#315-simpleunion) \| [DiscriminatedUnion](#316-discriminatedunion)] | ***REQUIRED.*** An array of Unions defined in this Service. |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.2 Interface

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Interface"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| methods | [[Method](#318-method)] | ***REQUIRED.***  |
| protocols | [Protocols](#319-protocols) |   |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.3 Type

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Type"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| properties | [[Property](#3110-property)] | ***REQUIRED.***  |
| mapProperties | [MapProperties](#3111-mapproperties) |   |
| rules | [[ObjectMinPropertiesRule](#331-objectminpropertiesrule) \| [ObjectMaxPropertiesRule](#332-objectmaxpropertiesrule) \| [ObjectAdditionalPropertiesRule](#333-objectadditionalpropertiesrule)] | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.4 Enum

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Enum"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| members | [[EnumMember](#3112-enummember)] | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.5 SimpleUnion
<p>TODO: don't allow arrays in primitive unions</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"SimpleUnion"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| members | [[PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue)] | ***REQUIRED.***  |
| disjunction | [DisjunctionKindLiteral](#344-disjunctionkindliteral) |   |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.6 DiscriminatedUnion
<p>TODO: don't allow arrays, enums, or other unions in discriminated unions</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"DiscriminatedUnion"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| discriminator | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| members | [[ComplexValue](#3114-complexvalue)] | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.7 MetaValue

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"MetaValue"` | ***REQUIRED.***  |
| key | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| value | [UntypedLiteral](#345-untypedliteral) | ***REQUIRED.***  |
#### 3.1.8 Method

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Method"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| security | [[SecurityOption](#3115-securityoption)] | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| parameters | [[Parameter](#3116-parameter)] | ***REQUIRED.***  |
| returns | [ReturnValue](#3117-returnvalue) |   |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.9 Protocols

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"InterfaceProtocols"` | ***REQUIRED.***  |
| http | [[HttpRoute](#3118-httproute)] |   |
#### 3.1.10 Property

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Property"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| value | [PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.11 MapProperties

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"MapProperties"` | ***REQUIRED.***  |
| key | [MapKey](#3119-mapkey) | ***REQUIRED.***  |
| requiredKeys | [[StringLiteral](#341-stringliteral)] | ***REQUIRED.***  |
| value | [MapValue](#3120-mapvalue) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.12 EnumMember

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"EnumMember"` | ***REQUIRED.***  |
| content | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.13 PrimitiveValue

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"PrimitiveValue"` | ***REQUIRED.***  |
| typeName | [PrimitiveLiteral](#347-primitiveliteral) | ***REQUIRED.***  |
| isArray | [TrueLiteral](#343-trueliteral) |   |
| isNullable | [TrueLiteral](#343-trueliteral) |   |
| isOptional | [TrueLiteral](#343-trueliteral) |   |
| constant | [StringLiteral](#341-stringliteral) \| [NumberLiteral](#348-numberliteral) \| [BooleanLiteral](#349-booleanliteral) \| [NullLiteral](#3410-nullliteral) |   |
| default | [StringLiteral](#341-stringliteral) \| [NumberLiteral](#348-numberliteral) \| [BooleanLiteral](#349-booleanliteral) \| [NullLiteral](#3410-nullliteral) |   |
| rules | [[StringMaxLengthRule](#321-stringmaxlengthrule) \| [StringMinLengthRule](#322-stringminlengthrule) \| [StringPatternRule](#323-stringpatternrule) \| [StringFormatRule](#324-stringformatrule) \| [NumberMultipleOfRule](#325-numbermultipleofrule) \| [NumberGtRule](#326-numbergtrule) \| [NumberGteRule](#327-numbergterule) \| [NumberLtRule](#328-numberltrule) \| [NumberLteRule](#329-numberlterule) \| [ArrayMaxItemsRule](#3210-arraymaxitemsrule) \| [ArrayMinItemsRule](#3211-arrayminitemsrule) \| [ArrayUniqueItemsRule](#3212-arrayuniqueitemsrule)] | ***REQUIRED.***  |
#### 3.1.14 ComplexValue

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ComplexValue"` | ***REQUIRED.***  |
| typeName | [StringLiteral](#341-stringliteral) | ***REQUIRED.*** The name of a type, enum, or union defined in this Service. |
| isArray | [TrueLiteral](#343-trueliteral) |   |
| isNullable | [TrueLiteral](#343-trueliteral) |   |
| isOptional | [TrueLiteral](#343-trueliteral) |   |
| rules | [[StringMaxLengthRule](#321-stringmaxlengthrule) \| [StringMinLengthRule](#322-stringminlengthrule) \| [StringPatternRule](#323-stringpatternrule) \| [StringFormatRule](#324-stringformatrule) \| [NumberMultipleOfRule](#325-numbermultipleofrule) \| [NumberGtRule](#326-numbergtrule) \| [NumberGteRule](#327-numbergterule) \| [NumberLtRule](#328-numberltrule) \| [NumberLteRule](#329-numberlterule) \| [ArrayMaxItemsRule](#3210-arraymaxitemsrule) \| [ArrayMinItemsRule](#3211-arrayminitemsrule) \| [ArrayUniqueItemsRule](#3212-arrayuniqueitemsrule)] | ***REQUIRED.***  |
#### 3.1.15 SecurityOption

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"SecurityOption"` | ***REQUIRED.***  |
| schemes | [[BasicScheme](#3121-basicscheme) \| [ApiKeyScheme](#3122-apikeyscheme) \| [OAuth2Scheme](#3123-oauth2scheme)] | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.16 Parameter

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"Parameter"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| value | [PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.17 ReturnValue

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ReturnValue"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
| value | [PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue) | ***REQUIRED.***  |
#### 3.1.18 HttpRoute

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpRoute"` | ***REQUIRED.***  |
| pattern | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| methods | [[HttpMethod](#3124-httpmethod)] | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.19 MapKey

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"MapKey"` | ***REQUIRED.***  |
| value | [PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.20 MapValue

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"MapValue"` | ***REQUIRED.***  |
| value | [PrimitiveValue](#3113-primitivevalue) \| [ComplexValue](#3114-complexvalue) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.21 BasicScheme

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"BasicScheme"` | ***REQUIRED.***  |
| type | [BasicSchemeType](#3125-basicschemetype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [StringLiteral](#341-stringliteral) |   |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.22 ApiKeyScheme

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ApiKeyScheme"` | ***REQUIRED.***  |
| type | [ApiKeySchemeType](#3126-apikeyschemetype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| parameter | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| in | [ApiKeySchemeIn](#3127-apikeyschemein) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.23 OAuth2Scheme

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2Scheme"` | ***REQUIRED.***  |
| type | [OAuth2SchemeType](#3128-oauth2schemetype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] |   |
| flows | [[OAuth2ImplicitFlow](#3129-oauth2implicitflow) \| [OAuth2PasswordFlow](#3130-oauth2passwordflow) \| [OAuth2ClientCredentialsFlow](#3131-oauth2clientcredentialsflow) \| [OAuth2AuthorizationCodeFlow](#3132-oauth2authorizationcodeflow)] | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.24 HttpMethod

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpMethod"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| verb | [HttpVerbLiteral](#3413-httpverbliteral) | ***REQUIRED.***  |
| parameters | [[HttpParameter](#3133-httpparameter)] | ***REQUIRED.***  |
| successCode | [HttpStatusCodeLiteral](#3414-httpstatuscodeliteral) | ***REQUIRED.***  |
| requestMediaTypes | [[StringLiteral](#341-stringliteral)] | ***REQUIRED.***  |
| responseMediaTypes | [[StringLiteral](#341-stringliteral)] | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.25 BasicSchemeType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"basic"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.26 ApiKeySchemeType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"apiKey"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.27 ApiKeySchemeIn

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"cookie"` \| `"header"` \| `"query"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.28 OAuth2SchemeType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"oauth2"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.29 OAuth2ImplicitFlow

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2ImplicitFlow"` | ***REQUIRED.***  |
| type | [OAuth2ImplicitFlowType](#3134-oauth2implicitflowtype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| authorizationUrl | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| refreshUrl | [StringLiteral](#341-stringliteral) |   |
| scopes | [[OAuth2Scope](#3135-oauth2scope)] | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.30 OAuth2PasswordFlow

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2PasswordFlow"` | ***REQUIRED.***  |
| type | [OAuth2PasswordFlowType](#3136-oauth2passwordflowtype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| tokenUrl | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| refreshUrl | [StringLiteral](#341-stringliteral) |   |
| scopes | [[OAuth2Scope](#3135-oauth2scope)] | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.31 OAuth2ClientCredentialsFlow

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2ClientCredentialsFlow"` | ***REQUIRED.***  |
| type | [OAuth2ClientCredentialsFlowType](#3137-oauth2clientcredentialsflowtype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| tokenUrl | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| refreshUrl | [StringLiteral](#341-stringliteral) |   |
| scopes | [[OAuth2Scope](#3135-oauth2scope)] | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.32 OAuth2AuthorizationCodeFlow

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2AuthorizationCodeFlow"` | ***REQUIRED.***  |
| type | [OAuth2AuthorizationCodeFlowType](#3138-oauth2authorizationcodeflowtype) | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| authorizationUrl | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| tokenUrl | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| refreshUrl | [StringLiteral](#341-stringliteral) |   |
| scopes | [[OAuth2Scope](#3135-oauth2scope)] | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.33 HttpParameter

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpParameter"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| location | [HttpLocationLiteral](#3415-httplocationliteral) | ***REQUIRED.***  |
| arrayFormat | [HttpArrayFormatLiteral](#3416-httparrayformatliteral) |   |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.34 OAuth2ImplicitFlowType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"implicit"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.35 OAuth2Scope

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"OAuth2Scope"` | ***REQUIRED.***  |
| name | [StringLiteral](#341-stringliteral) | ***REQUIRED.***  |
| description | [[StringLiteral](#341-stringliteral)] | ***REQUIRED.***  |
| deprecated | [TrueLiteral](#343-trueliteral) |   |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
| meta | [[MetaValue](#317-metavalue)] |   |
#### 3.1.36 OAuth2PasswordFlowType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"password"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.37 OAuth2ClientCredentialsFlowType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"clientCredentials"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.1.38 OAuth2AuthorizationCodeFlowType

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| value | `"authorizationCode"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
### 3.2 Rules
#### 3.2.1 StringMaxLengthRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"StringMaxLength"` | ***REQUIRED.***  |
| length | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.2 StringMinLengthRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"StringMinLength"` | ***REQUIRED.***  |
| length | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.3 StringPatternRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"StringPattern"` | ***REQUIRED.***  |
| pattern | [NonEmptyStringLiteral](#3411-nonemptystringliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.4 StringFormatRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"StringFormat"` | ***REQUIRED.***  |
| format | [NonEmptyStringLiteral](#3411-nonemptystringliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.5 NumberMultipleOfRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"NumberMultipleOf"` | ***REQUIRED.***  |
| value | [NonNegativeNumberLiteral](#3412-nonnegativenumberliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.6 NumberGtRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"NumberGT"` | ***REQUIRED.***  |
| value | [NumberLiteral](#348-numberliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.7 NumberGteRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"NumberGTE"` | ***REQUIRED.***  |
| value | [NumberLiteral](#348-numberliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.8 NumberLtRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"NumberLT"` | ***REQUIRED.***  |
| value | [NumberLiteral](#348-numberliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.9 NumberLteRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"NumberLTE"` | ***REQUIRED.***  |
| value | [NumberLiteral](#348-numberliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.10 ArrayMaxItemsRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"ArrayMaxItems"` | ***REQUIRED.***  |
| max | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.11 ArrayMinItemsRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"ArrayMinItems"` | ***REQUIRED.***  |
| min | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.2.12 ArrayUniqueItemsRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ValidationRule"` | ***REQUIRED.***  |
| id | `"ArrayUniqueItems"` | ***REQUIRED.***  |
| required | boolean | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
### 3.3 Object Rules
#### 3.3.1 ObjectMinPropertiesRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ObjectValidationRule"` | ***REQUIRED.***  |
| id | `"ObjectMinProperties"` | ***REQUIRED.***  |
| min | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.3.2 ObjectMaxPropertiesRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ObjectValidationRule"` | ***REQUIRED.***  |
| id | `"ObjectMaxProperties"` | ***REQUIRED.***  |
| max | [NonNegativeIntegerLiteral](#346-nonnegativeintegerliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.3.3 ObjectAdditionalPropertiesRule

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"ObjectValidationRule"` | ***REQUIRED.***  |
| id | `"ObjectAdditionalProperties"` | ***REQUIRED.***  |
| forbidden | [TrueLiteral](#343-trueliteral) | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
### 3.4 Literals
#### 3.4.1 StringLiteral
<p>A string literal</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"StringLiteral"` | ***REQUIRED.***  |
| value | string | ***REQUIRED.***  |
| loc | string |  The location of this in the doc. |
#### 3.4.2 IntegerLiteral
<p>An integer literal</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"IntegerLiteral"` | ***REQUIRED.***  |
| value | integer | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.3 TrueLiteral
<p>A boolean literal whose value is always true</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"TrueLiteral"` | ***REQUIRED.***  |
| value | `true` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.4 DisjunctionKindLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"DisjunctionKindLiteral"` | ***REQUIRED.***  |
| value | `"exclusive"` \| `"inclusive"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.5 UntypedLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"UntypedLiteral"` | ***REQUIRED.***  |
| value | untyped | ***REQUIRED.***  |
| loc | string |   |
#### 3.4.6 NonNegativeIntegerLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"NonNegativeIntegerLiteral"` | ***REQUIRED.***  |
| value | integer | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.7 PrimitiveLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"PrimitiveLiteral"` | ***REQUIRED.***  |
| value | `"binary"` \| `"boolean"` \| `"date"` \| `"date-time"` \| `"double"` \| `"float"` \| `"integer"` \| `"long"` \| `"null"` \| `"number"` \| `"string"` \| `"untyped"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.8 NumberLiteral
<p>A number literal</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"NumberLiteral"` | ***REQUIRED.***  |
| value | integer | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.9 BooleanLiteral
<p>A boolean literal</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"BooleanLiteral"` | ***REQUIRED.***  |
| value | boolean | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.10 NullLiteral
<p>A null literal</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"NullLiteral"` | ***REQUIRED.***  |
| value | untyped | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.11 NonEmptyStringLiteral
<p>A string literal</p>
##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"NonEmptyStringLiteral"` | ***REQUIRED.***  |
| value | string | ***REQUIRED.***  |
| loc | string |  The location of this in the doc. |
#### 3.4.12 NonNegativeNumberLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"NonNegativeNumberLiteral"` | ***REQUIRED.***  |
| value | number | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.13 HttpVerbLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpVerbLiteral"` | ***REQUIRED.***  |
| value | `"delete"` \| `"get"` \| `"head"` \| `"options"` \| `"patch"` \| `"post"` \| `"put"` \| `"trace"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.14 HttpStatusCodeLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpStatusCodeLiteral"` | ***REQUIRED.***  |
| value | integer | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.15 HttpLocationLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpLocationLiteral"` | ***REQUIRED.***  |
| value | `"body"` \| `"formData"` \| `"header"` \| `"path"` \| `"query"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |
#### 3.4.16 HttpArrayFormatLiteral

##### Fields Specification
| Field Name | Type | Description |
| -------- | ---- | ----------- |
| kind | `"HttpArrayFormatLiteral"` | ***REQUIRED.***  |
| value | `"csv"` \| `"multi"` \| `"pipes"` \| `"ssv"` \| `"tsv"` | ***REQUIRED.***  |
| loc | string |  A range in the source document encoded as a string. This string is a semicolon-separated list of numbers and MUST be in one of the following formats:<ul><li>Single point: <code>&lt;row&gt;;&lt;col&gt;;&lt;offset&gt;</code> (eg. <code>&quot;4;12;88&quot;</code>)</li><li>Single row: <code>&lt;row&gt;;&lt;col1&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;21;88;97&quot;</code>)</li><li>Multi row: <code>&lt;row1&gt;;&lt;col1&gt;;&lt;row2&gt;;&lt;col2&gt;;&lt;offset1&gt;;&lt;offset2&gt;</code> (eg. <code>&quot;4;12;6;3;88;164&quot;</code>)</li></ul>Both the `row` and `column` values are 1-based. The `offset` values are 0-based. |