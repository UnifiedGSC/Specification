---
title: "Settings"
sidebar_position: 2
---

# Settings

A setting is any schema property that carries `write`; every setting must also carry `apply`. Objects without `write` are UI groups.

Standard JSON Schema covers types, ranges, `default`, `enum`, `pattern`, `format` and `writeOnly`. Labeled choices use `oneOf` with `const` and `title`. Bitmasks are arrays of labeled integers with `encode: bitmask` on the write entry.

**apply values**

| Value | Takes effect | Example |
| --- | --- | --- |
| `live` | Immediately when sent over the console | CS:S `bot_quota` |
| `nextRound` | At the next round start | CS:S `mp_roundtime` |
| `nextMap` | At the next map load | CS:S map rotation, Quake 3 `g_gametype` |
| `restart` | After the server process restarts | All Valheim launch arguments |
| `worldCreate` | Only when a new world or save is created | Valheim world modifiers |

**GSC keywords on a setting**

| Keyword | Value | Meaning | First used in |
| --- | --- | --- | --- |
| `apply` | apply value | When a change takes effect | CS:S |
| `write` | list of write entries | Every target the value goes to | CS:S |
| `storedIn` | `world` | The value is persisted in game data, not only config; a UI warns that changes may not reach an existing save | Valheim |
| `kind` | `identityList` | A list of player identities (admins, bans, whitelist); UIs give it a dedicated editor | CS:S |
| `optionsFrom` | `content.<type>` | Offer items from the content inventory | Quake 3 |
| `optionsFilter` | CEL | Narrow those options; `item` is the candidate, `entry` the array item being edited | Quake 3 |
| `allowCustom` | boolean | Accept values not in the options (e.g. a new world name) | Valheim |
| `reconnectsConsole` | boolean | Sending this value changes the console credential; the adapter reconnects with the new value | CS:S |
| `rescanContent` | boolean | Content depends on this value; rescan after it changes | Quake 3 |
| `persistedBy` | `game` | The server stores this value itself; GSC changes it only through console commands | Quake 3 |
| `pendingWhileStopped` | boolean | Edits made while the server is stopped are queued until it runs | Quake 3 |
| `read` | read entry | How to read the current value back from the server (`via`, `command`, `parse`) | Quake 3 |
| `ui` | object | Hints only: `widget` (`orderedList`, `checkboxes`, `textarea`), `unit`, `zeroMeans`, `showWhen` (CEL), `language` | CS:S |
| `scopes` | list of scope kinds | Which scopes this setting (or every setting in this group) may vary by; [] = server-wide | CS:S, Quake 3 |
| `profiles` | list of profile names | Profiles this setting (or group) exists in; omitted = all. Every setting must reach some target in each of its profiles | Freelancer |
| `kind: contentRef` + `source` | a content source name | The value names content to fetch (Workshop IDs, mod names); the source says who fetches it and how | CS2, Arma 3, Factorio |
| `since` / `until` | game versions | The game versions this setting exists in (until is exclusive); also allowed on write entries | Minecraft |
| `versionDefaults` | list of since / until / value | Defaults that differ by game version; the latest matching entry wins over default | Minecraft |
| `perProcess` | boolean (on a group) | Every setting in the group has one value per process, set under that process in the values document | Don't Starve Together |
| `derivedFrom` | CEL | The value is computed from the processes, not typed; a value in the document is replaced | Don't Starve Together |
| `classes` | list: resource, security | Facts an access policy can act on that the rest of the definition does not already say. Other classes are derived, never declared | Minecraft, Satisfactory |
| `secret.generate` | length, alphabet | How to generate this secret when the game needs more than the default (24 letters and digits). Checked against the setting's maxLength and pattern | Freelancer, CS:S (tests) |
