---
title: IR Specification v{{version}}
slug: /specification/v0.2
toc_max_heading_level: 4
---

# Basketry IR Specification v{{version}}

:::tip
The authoritative JSON Schema version of this document can be found at [github.com/basketry/ir/blob/v{{version}}/src/schema.json](https://github.com/basketry/ir/blob/v{{version}}/src/schema.json)
:::

## 1 IR Specification

## 1.1 Version {{version}}

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://www.rfc-editor.org/info/bcp14) [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119) [RFC8174](https://datatracker.ietf.org/doc/html/rfc8174) when, and only when, they appear in all capitals, as shown here.

This document is licensed under The MIT License.

## 2 Introduction

The Basketry Intermediate Representation (IR) defines a standard, language-agnostic data model for describing services, operations, types, and metadata in a way that can be consumed by any Basketry-compatible tool. It allows parsers, generators, and rules to exchange information without requiring access to the original service definition, source code, or runtime environment. When properly produced, the IR enables generators to create accurate, high-quality outputs and rules to validate conformance with minimal implementation effort.

An IR document can then be used by code generators to produce servers, clients, SDKs, and documentation, by rule sets to enforce standards and best practices, and by other tools to inspect and manipulate service definitions — all without being tied to a specific format, language, or technology stack.

## 3 Concepts

### 3.1 Denormalized Structure

The Basketry IR is fully **denormalized**, meaning all information needed to describe a service is expanded to its concrete form within a single document. In source SDLs like OpenAPI, definitions may be spread across multiple files and may use references ($ref) or shared sections (e.g., common parameters, reusable schema fragments). While this makes authoring convenient, it forces tooling authors to traverse and merge data from multiple locations and documents to produce a complete view.

In the IR, all references are resolved and multi-document specifications are merged into a single `Service` representation. Each interface, method, parameter, property, and constraint appears with its complete definition in place, eliminating the need for consumers to chase references or coordinate multiple files. This results in a more verbose representation, but one that is **optimized for consumption by tooling**, enabling straightforward traversal and transformation.

Types, enums, and unions are still **referenced by name** rather than inlined. This allows for patterns such as circular dependencies between types without creating infinite expansion in the IR. Generators and rules can follow these named references as needed, but the rest of the structure is self-contained and directly usable without further dereferencing.

### 3.2 Flat Complex Types

In the Basketry IR, all layers of a type are represented as independent, named types referenced by their parent. Rather than embedding nested structures directly (e.g., an inline object type with its properties), each layer is promoted to its own top-level type definition within the `types` collection. The parent type then references these child types by name.

This design produces a flat structure where every type exists at the same hierarchical level in the IR. Tooling can resolve any type using the same mechanism, regardless of where it appears in the source SDL. This uniformity simplifies type resolution logic and avoids special-case handling for inline or anonymous types.

Flat typing also makes recursive and self-referential types straightforward to represent. Because each type is named and referenced rather than embedded, a type can safely reference itself (directly or indirectly) without creating infinite expansion or ambiguous structures.

### 3.3 Source Maps & Provenance

Most nodes in the Basketry IR can carry a `loc` (location) value that ties it back to the original source document. This provenance information allows tools to trace atomic elements of a service definition directly to the exact place in the authoring format (e.g., OpenAPI, JSON Schema) where the element originated.

The loc field is a compact, semicolon-separated string encoding of a range within a source document. It supports three forms:

#### 3.3.1 Encoding Forms

##### 3.3.1.1 Single point

```
<sourceIndex>:<row>;<col>;<offset>
```

Example: `"0:4;12;88"` → A point in source document index `0`, at row `4`, column `12`, character offset `88`.

##### 3.3.1.2 Single row range

```
<sourceIndex>:<row>;<col1>;<col2>;<offset1>;<offset2>
```

Example: `"0:4;12;21;88;97"` → A range in source document index `0` on row `4` from column `12` to column `21`, spanning offsets `88`–`97`.

##### 3.3.1.3 Multi-row range

```
<sourceIndex>:<row1>;<col1>;<row2>;<col2>;<offset1>;<offset2>
```

Example: `"0:4;12;6;3;88;164"` → A range in source document index `0` from row `4`, column `12` to row `6`, column `3`, spanning offsets `88`–`164`.

#### 3.3.3 Indexing rules

- `row` and `col` values are 1-based.
- `sourceIndex` and `offset` values are 0-based.
- `sourceIndex` refers to the position of the source document in the source paths array.
- `offset` values are absolute character positions from the start of the file, measured in UTF-8 code units.

### 3.4 Meta Data

Many (but not all) nodes in the Basketry IR support an optional `meta` property for including information not defined in the source document's SDL, such as parser-specific insights, vendor extensions, or contextual details. Its structure and meaning are parser-defined, so while most standard generators and rulesets may ignore it, specialized tooling can use it for tasks like domain-specific validation or generation enhancements. Metadata is never required when consuming the IR and serves as an escape hatch for carrying extra context without reducing the IR’s portability or general usability.

## 4 Specification
