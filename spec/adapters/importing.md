---
title: "Importing existing configs"
sidebar_position: 2
---

# Importing existing configs

An existing server becomes a values document by reading every write in reverse; the importer (`gsc_import.py`) is driven by the definition and knows no game by name. It produces a `ServerValues` document and an `ImportReport`.

**How each write is read back**

| Write | Read back as |
| --- | --- |
| `key` in a cvar file | The cvar's value; `set`, `seta` and bare `name value` forms all count |
| `arg`, `cvar` | The flag's value; `style` and `joined` say how it is attached. With `setsCvars`, any `+name value` on the command line is matched to the setting that writes that cvar |
| `flag` | Present = true, absent = false |
| `each: "{key} {value}"` / `"{item}"` | Every occurrence of the flag, rebuilt into an object or a list (Valheim `-modifier`, `-setkey`) |
| `line` template | Each matching line becomes an item (`banid 0 {id}`); a `lines` target with no template is a plain list |
| `encode` map | The inverse map; the checker rejects maps that are not one-to-one |
| `encode: bitmask` | The set bits, matched to the labeled options; leftover bits are reported |
| Generated rotation | The chain is followed from its top-level `vstr`, and the game is simulated so values carried between maps are seen |
| `field` (binary), embedded `key` | The layout or the embedded format's own parser |
| console, http | Not from files: these need the running server, through `read` entries |

**Precedence.** `import.precedence` lists targets in the order the game applies them, so later wins (Quake 3 and Source run the command line before `server.cfg`). When two sources disagree, the report records the conflict and which value was used.

**The report.** `imported`, `defaultsOmitted` (values equal to the default are left out), `conflicts`, `rejected` (values that fail the schema, such as `mp_friendlyfire 3`), `secrets` (imported in clear text), `needsRunningServer`, `unmodeled` (keys and arguments no setting covers, the input for raw passthrough), `overrides` and `notes`.

**Rotations.** Quake 3 cvars persist across maps, so the importer runs the rotation cycle and records what is in effect on each map. Values that differ become per-map `overrides`, and the notes call out values carried over from a previous map and config-file values the rotation replaces before any map loads. Exporting the imported document reproduces the original's effective values on every map.
