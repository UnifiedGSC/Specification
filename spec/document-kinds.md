---
title: "Document kinds"
sidebar_position: 3
---

# Document kinds

Four documents make up a game's configuration; each arrow is a key that refers to another document.

```mermaid
flowchart LR
  V["ServerValues<br/>one server's settings"] -- "game, definitionId" --> G["GameDefinition<br/>what can be configured"]
  V -- "fragments" --> F["SchemaFragment<br/>settings a mod or plugin adds"]
  F -- "extends" --> G
  I["ContentInventory<br/>what is installed"] -- "game" --> G
  I -- "server" --> V
  G -. "rules read the latest inventory" .-> I
```

The game definition's rules also read the latest inventory, so a rotation can be checked against what is installed.
