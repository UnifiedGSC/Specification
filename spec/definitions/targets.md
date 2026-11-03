---
title: "Targets and write entries"
sidebar_position: 4
---

# Targets and write entries

A target is a named place values are written; a setting's `write` list sends its value to one or more targets. Persistent targets are always written; `console` writes are sent only while the server runs.

**Target types**

| Type | Fields | Example |
| --- | --- | --- |
| `args` | `style` (default `-flag value`; `q3` = `+set name value`), `fixed`, `fixedPosition` (`start` / `end`), `order` (flags that must come first), `booleans`, `workingDir` | Valheim launch arguments |
| `file` | `path`, `format`, `booleans`, `comments`, `executes` (`onStart`, `onMapLoad`), `readAt`, `owner` (`game` = the server rewrites it; `shared` = the server's own UI also writes it). Binary files add `layout`, `whenMissing` and `preserveUnknownBytes` | CS:S `server.cfg`, Freelancer `FLServer.cfg` |
| `registry` | `hive`, `view` (`32` / `64`), `readAt`, `access` per runtime (`api`, or `offline` = edit a Wine prefix's `system.reg` / `user.reg` while stopped), `ensure` | Freelancer EULA flag |
| `console` | `booleans`; connection comes from the top-level `console` block | CS:S and Quake 3 RCON |
| `generated` | `within` (a file target), `format`, `variablePrefix`; a managed block inside another file | Quake 3 vstr rotation |
| `embedded` | `within` (host target), `section`, `key`, `format`, `preserveUnknownFields`, `preserveOrder`, `singleLine`, `verify: roundTrip`. A target living inside one key of another; settings write to it like any target | Palworld `OptionSettings` |
| `http` | `baseUrl`, `tls` (selfSigned, verify: pinOnFirstUse), `request` and `response` envelopes, `auth` (bearer token with a login fallback), `bootstrap` (probe + steps), `batch`, `read` (current and pending), `requiresRunning`, `booleans` | Satisfactory HTTPS API |
| `env` | `booleans`, `changeRequires: recreate` (a container's environment is fixed when it is created). Writes name a `var` | Freelancer LANCommander image (FL_*) |
| `prompts` | `steps` (each an id, an expect pattern, optional when, a literal answer or a menu), `timeout`, `onUnexpected`, `transcript`, `readyWhen`. Writes name a step; a menu step answers with the number of the entry whose name matches (selectBy) | Terraria's startup questions |
| `manual` | `channel` (where a person makes the change), `verify` (how to check it was done, or none). Writes carry instructions with the same templates as other writes | Valheim modifiers on an existing world |

**File formats so far:** `source-cfg`, `q3-cfg`, `lines`, `text`, `ini`, `kvp`, `binary`, `tribes-script`, `ue-struct`, `properties`, `json`, `xml`, `lua-table`. Expected next: `yaml`.

**Write entry fields**

| Field | Applies to | Meaning |
| --- | --- | --- |
| `target` | All | Target name (required) |
| `key` | file, console | Key or cvar name; INI writes also give a section (`AllowMetals`) |
| `arg` | args | Flag followed by the value (`-port 2456`) |
| `flag` | args | Presence-only flag, emitted when true (`-crossplay`) |
| `cvar` | args, `q3` style | Emitted as `+set <cvar> <value>` |
| `each` | args | Repeat the flag per object property or array item: `"{key} {value}"`, `"{item}"` |
| `line` | lines files | One line per list item, from a template (`"banid 0 {id}"`) |
| `add` / `remove` | console | Commands run when a list item is added or removed |
| `after` | console | Commands run after the other writes (`sm_reloadadmins`) |
| `entry` | generated | Template for one generated entry |
| `sendGenerated` | console | Re-send a generated block to a running server |
| `encode` | All | Map of value to written value, or `bitmask` |
| `skipIfEmpty` / `skipIfDefault` / `skipValue` | All | Omit the write in those cases |
| `field` | binary file, registry binary value | Layout field the value is encoded into |
| `value` / `key` / `type` | registry | Value name, subkey under the target's hive, and REG_SZ, REG_DWORD, REG_QWORD, REG_BINARY, REG_MULTI_SZ or REG_EXPAND_SZ |
| `joined` | args | No space between flag and value (Freelancer /p2302) |
| `var` | script files, script console | Script global to assign ($Server::HostName = "...";); the format quotes and escapes the value |
| `statement` | script files, script console | A script statement template, such as a function call (ADSetTimeLimit({value});); {value} renders as a script literal |
| `section` | INI files | Section name, given separately because Unreal section names contain dots and slashes (/Script/Pal.PalGameWorldSettings) |
| `as` | ue-struct | Encoding where JSON types are ambiguous: name (bare identifier), string (quoted), float (six decimals) |
| `repeat` | INI files | One line per array item under the same key; GSC owns and rewrites every line of that key |
| `itemFormat` / `shape` | repeated keys | Format of each repeated value, and where each flat item field goes in its nested struct (ARK stack size overrides) |
| `placement` | file targets | end keeps a block last in the file; in INI its section moves to the end too. Only one block per file may ask for it |
| `call` / `data` | http | API function and its data template; for a batched call, give key instead of data and the value joins one shared map |
| `sendWhen` | All | changed: send only when the value differs from what the adapter last sent; for writes with side effects that cannot be read back (a password change signs players out) |
| `pointer` | json | JSON Pointer (RFC 6901) to the value: /visibility/public; empty = the whole document. Used instead of dotted paths because JSON keys may contain dots |
| `xpath` | xml | Path to an element or attribute, for XML that is not keyed; keyed targets take key instead |
| `items` / `onlyItemsWith` | identity lists in files | Template for each written entry, and fields an entry must have to be written; others wait for the console (Minecraft needs a UUID in the file, the console looks it up by name) |
| `command` | console | A console command template (difficulty {value}); combine with encode to map values (true -> on) |
| `join` / `item` / `filter` | args | Build one argument from a list: each item rendered with item, joined by join, keeping only items where filter (CEL) is true (Arma -mod=@a;@b vs -serverMod) |
| `always` | lists in files | Entries written regardless of the setting's value (Factorio's base mod stays enabled) |

**Binary layouts.** A layout gives `size`, `byteOrder` and named `fields`, each with an `offset` and a `type`. Types: `int8`/`uint8`, `int16`/`uint16`, `int32`/`uint32`, `int64`, `float32`, `float64`, `bool8`, and fixed-size strings `utf16` or `ascii` with `units` (buffer length including the terminator) or raw `bytes`. A field may carry `const`, written on every save. Adapters read the whole file, change only mapped fields and keep every other byte. The same layouts describe REG_BINARY registry values, which some games use to store whole settings structs.

**Registry `ensure`.** A list of `key`, `value`, `type` and `data` entries that must always hold, such as an accepted EULA. They are not settings and never appear in a UI.

**Overlay files.** When a game owns its prefs file and may rewrite it, GSC writes its own file instead (`owner: gsc`) and has the game execute it afterwards (`layersOver: <target>`), so GSC values win without editing the game's file. The game's file gets `access: readOnly` and is used only to import existing values. The overlay's name can include `{server.id}` so several servers share one install. First used in Starsiege: Tribes.

**Nested formats.** An `embedded` target sits inside one key of a host target and has its own format, so a value can pass through two formats on its way to disk: a field of a `ue-struct`, inside an INI key. Embedded targets keep fields GSC does not model, in their original order, and re-parse what they wrote before saving, because Palworld silently ignores a malformed block. A reference codec is in `ue_struct.py`. First used in Palworld.

**File safety fields.** `writeWhen: stopped` for files the game rewrites on shutdown; `seedFrom` to start a missing or empty file from the game's template; `shadowedBy` for a file whose presence makes the target ineffective (Palworld's `WorldOption.sav`), with `resolve: deleteWithConfirmation` so a UI can offer, but never perform unasked, the fix.

**HTTP targets.** For servers configured through their own API. Before writing, the adapter runs the `bootstrap` probe (Satisfactory: an `InitialAdmin` login only succeeds on an unclaimed server), claims the server if needed, then authenticates. It plans the writes, skipping options whose current or pending value already matches, sends settings that share a map as one batched call, and reads values back to report which are live and which wait for a restart. HTTP targets have `requiresRunning: true`, the opposite of Palworld's `writeWhen: stopped`: edits made while the server is stopped are queued. First used in Satisfactory.

**Profiles.** One game can be deployed in different ways that take settings through different targets. A target lists the `profiles` it is used in, and a values document picks one with `profile`. Freelancer's native profile writes `FLServer.cfg`; its LANCommander container profile writes `FL_*` environment variables instead, because the image's startup hook writes `FLServer.cfg` from them on every start.

**Structured formats.** `properties`, `json` and `xml` writers edit the existing document and re-parse their output before saving; reference implementations are in `gsc_formats.py`.

- **properties:** keys are used verbatim (`rcon.port`, `level-seed`); values are escaped the way Java writes them (`minecraft\:normal`). `commentsSurvive: false` marks files the game rewrites without comments, as Minecraft does at every start.
- **json:** values are addressed by JSON Pointer; unknown keys, including Factorio's `_comment_` documentation, and key order are kept, and `indent: preserve` reuses the document's indentation. The writer re-serializes the document, so the layout of untouched values may change.
- **xml:** a `keyed` target (`parent`, `element`, `keyAttribute`, `valueAttribute`) treats elements like `<property name="ServerName" value="..."/>` as key-value pairs. The writer edits the text directly, so everything it does not manage stays byte for byte; a missing element is added after its last sibling at the same indent. First used in Minecraft: Java Edition, Factorio and 7 Days to Die.
