---
title: "Values documents and fragments"
sidebar_position: 1
---

# Values documents and fragments

**SchemaFragment** adds settings, targets and rules to a game when a mod is installed. Its settings merge under the fragment's own group key, so they cannot collide with the base game's.

| Key | Meaning | Example |
| --- | --- | --- |
| `id`, `name` | Fragment identity | `sourcemod-admins` |
| `extends` | Game ID it applies to | `counter-strike-source` |
| `detect` | `file` or `glob` whose presence enables it | `cstrike/addons/sourcemod/bin` |
| `targets`, `settings`, `rules` | Same shape as in a GameDefinition | SourceMod `admins_simple.ini` |
| `generate` | Build settings at discovery time from config files: `from.glob`, `exclude`, `parser`, `defaults`, `target` | BepInEx plugin configs (Valheim) |
| `generatedBy` | Marks a fragment a generator produced |  |

**ServerValues** is what a UI saves for one server: `game`, `id`, `fragments` (enabled fragment IDs) and `settings`. It holds only values that differ from defaults, and validates against the game schema merged with its fragments.
