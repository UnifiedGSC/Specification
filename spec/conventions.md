---
title: "Conventions"
sidebar_position: 2
---

# Conventions

Every document is YAML 1.2 and starts with `spec` and `kind`; all keys are camelCase.

| Topic | Rule |
| --- | --- |
| Header | `spec: gsc/v0.1` and `kind:` one of `GameDefinition`, `SchemaFragment`, `ServerValues`, `ContentInventory` |
| YAML | Version 1.2, no custom tags. Quote strings that look like booleans or numbers (`"off"`, `"1.10"`) |
| Anchors | Allowed in game definitions and fragments; discouraged in values documents |
| Setting IDs | Dotted path from the settings root, e.g. `bots.quota`. Stable across versions; the live-state spec uses them |
| Templates | `{paths.<name>}`, `{settings.<id>}`, `{installDir}` anywhere a path is written. Discovery adds `{root}`, `{stem}`, `{name}`, `{item}`. Write entries add `{key}`, `{value}`, `{id}` and an item's own fields |
| Expressions | CEL. `self` is the values document's `settings`; `inventory` is the latest ContentInventory; `item` and `entry` are bound in option filters |
| Secrets | JSON Schema `writeOnly: true`. Clients mask them and APIs never return them |
| Regular expressions | ECMA-262, the flavor JSON Schema's pattern already uses; named groups are written (?<name>...). Tools in other languages translate |
