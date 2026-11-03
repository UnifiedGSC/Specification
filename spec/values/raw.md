---
title: "Raw passthrough"
sidebar_position: 2
---

# Raw passthrough

No definition models every key. Games add options between definition releases (Palworld often does), and many servers carry cvars someone set years ago. A values document can set these with **raw entries**. A raw entry is a write entry with a literal value and no setting behind it. It uses the same address words as the target's modeled writes, so the same writer handles it, and any overlap with a modeled setting is easy to detect.

```yaml
raw:
  - { target: serverCfg, key: sv_maxrate, value: "0" }
  - { target: commandLine, args: ["-tickrate", "66"] }
  - { target: console, command: "mp_flashlight 1" }
  - { target: mapcycle, line: de_cbble }
  - { target: clusterIni, section: NETWORK, key: tick_rate, value: 30 }
  - { target: serverIni, section: ACCOUNT, key: encode_user_path, value: true, process: Caves }
  - { target: serverSettings, pointer: /some_new_option, value: 10 }
  - { target: optionSettings, key: bIsUseBackupSaveData, value: true }
  - { target: containerEnv, var: TZ, value: America/Chicago }
```

## Addresses by target

| Target | Address | Notes |
| --- | --- | --- |
| `source-cfg`, `q3-cfg` | `key`, or `line` for a command | Names are case-insensitive; values cannot contain `"`, `;` or line breaks |
| `properties`, `kvp`, `xml` (keyed), `ue-struct` | `key` | `ue-struct` takes lists and an `as` hint |
| `ini` | `section` + `key` |  |
| `json` | `pointer` | Values may be objects or lists |
| `tribes-script`, `env` | `var` |  |
| `lines` | `line` | Added if missing |
| `args` | `args` (a list of separate arguments), or `arg`, `flag`, `cvar` | Never a shell string; appended after the modeled arguments |
| console | `command` | Sent when added, and again after every start |

Binary, registry, HTTP, generated, prompt, manual and whole-text targets refuse raw entries, because each needs a definition to be written safely. So does any target the game itself rewrites (`owner: game`) and any target marked `raw: false`.

## What the checker refuses

- **A modeled name.** `hostname` in CS:S is `general.hostname`; set that instead. Cvars share one namespace across the config file, the console and the command line, so `+hostname` as an argument is refused too. A raw console command matches on the fixed words of a modeled command, so `gamerule pvp false` is refused in Minecraft, but `gamerule keepInventory true` is not.
- **An alias.** The definition's `raw.aliases` names other spellings of modeled settings, such as CS:S's `hostport` for `network.port`.
- **A denied name.** `raw.deny` lists commands no values document may send, such as `quit`, `killserver` or `plugin_load`.
- **A value that would break out of its statement.** Line breaks, or a quote or `;` in a cfg value, are refused rather than escaped, because these formats have no escape for them.
- **A duplicate**, or an address the target does not take.

It **warns** when a raw key matches a modeled write that is not active in the installed game version. For example, `pvp` in Minecraft 1.21.10's server.properties is ignored by the game, and `gameplay.pvp` reaches it through the console instead.

## Applying

Raw entries have no `apply` hint, so each one follows its target's timing: `nextMap` for an executed config file, `restart` for most files and arguments, `recreate` for environment variables, and live for console commands. The plan says it is assuming this. An entry can set `apply` when the admin knows better. When an entry is removed, GSC deletes the key from the file, but only if GSC wrote it last time (from the applied-state record); it never touches keys it did not write. The plan notes that a running server keeps a removed value until it restarts.

## Importing and promotion

- **Importing.** With `--keep-unmodeled`, the importer turns keys it cannot map into raw entries instead of only listing them, so importing loses nothing. A key that is an alias is imported into its setting, so CS:S's `hostport 27020` becomes `network.port: 27020`. A key the raw checks refuse stays in the report.
- **Promotion.** When a newer definition models a key that a values document holds as raw, the checker reports it, and promotion moves the value into the setting after decoding and validating it. A value that fails the setting's schema stays raw, with the reason.

## Permissions

Raw entries bypass the schema, setting classes and plan limits. Changing them is therefore its own action, `editRaw`, and the example hosting policy denies it to customers.
