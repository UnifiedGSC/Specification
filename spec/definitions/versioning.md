---
title: "Versioning"
sidebar_position: 10
---

# Versioning

Two things have versions: the game, which GSC detects and never asks the admin to type, and the definition file itself, whose changes values documents migrate through.

**Game versions (`game.versions`)**

| Key | Holds | Example |
| --- | --- | --- |
| `scheme` | How versions compare: `dotted` (numeric per segment, so 1.21.9 < 1.21.11 < 26.3) or `steamBuild` (integer build IDs) | Minecraft `dotted`; CS:S `steamBuild` |
| `supported` | The range the definition was written for (`>=1.20.5`); outside it GSC warns but still works | Minecraft, Factorio |
| `unknown` | What to do with a version the scheme cannot order: `warnAndUseNewest` or `refuse` | Minecraft snapshots such as 25w10a |
| `detect` | Detectors tried in order: `archiveFile` (a JSON entry inside an archive), `file` (a JSON file), `steamAppManifest` (the `buildid` SteamCMD records), `query` (asks the running server, through the live-state spec) | Minecraft `server.jar`; CS:S `appmanifest_232330.acf`; Factorio `data/base/info.json` |

**Version gates.** `since` (inclusive) and `until` (exclusive) can sit on a setting, so it only exists in that range, or on a write entry, so a setting can move between targets. Minecraft's `pvp` writes `server.properties` until 1.21.9 and a `gamerule` console command from then on; its command-block rule changes name again at 1.21.11. `versionDefaults` lists default changes, such as Minecraft's whitelist turning on by default in 26.3. A write entry may carry `pendingWhileStopped`, because a game rule stored in the world can only be set while the server runs.

The checker verifies that every version window in which a setting exists has an active write, and with `--game-version` it resolves the schema for that version, rejecting values for settings that do not exist there.

**Definition versions.** `definition.version` versions the file itself. Values documents record `definitionVersion`; `definition.migrations` list renames (old setting ID to new) applied to older documents when they are loaded. A values document newer than its definition is refused. Mod releases also depend on the game version: Factorio's portal resolution matches releases to the detected version's first two segments.
