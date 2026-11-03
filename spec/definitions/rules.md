---
title: "Rules and functions"
sidebar_position: 3
---

# Rules and functions

Rules catch what one setting's schema cannot: limits across settings, and settings that must match installed content.

| Field | Meaning |
| --- | --- |
| `rule` | CEL expression that must be true; may use `self` and `inventory` |
| `message` | Shown to the user when the rule fails |
| `severity` | `error` (default) blocks saving; `warning` only informs |

Examples: bots plus the SourceTV slot within max players (CS:S); a public password of at least 5 characters (Valheim); every rotation map present in the inventory (Quake 3).

**Functions** give rules a name for a lookup defined in the schema. Quake 3's `arenaType` reads the `arenaType` field from the labeled `oneOf` options of `match.gametype`, turning `g_gametype` numbers into the words `.arena` files use.
