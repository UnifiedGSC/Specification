---
title: "Scopes and overrides"
sidebar_position: 6
---

# Scopes and overrides

A values document can change settings for one map, a map prefix or a game type. The game definition declares which scope kinds exist and how the engine makes an override take effect.

**`scopes` keys**

| Key | Holds | Example |
| --- | --- | --- |
| `kinds.<name>` | `title`, `match` (`exact` or `prefix`), and either `optionsFrom` for the scope's value or `key.setting` when the scope is a setting's value; `key.entryField` when a rotation entry can set it itself | CS:S `mapPrefix`, `map`; Quake 3 `mode` = `match.gametype` |
| `precedence` | Kinds from least to most specific; later kinds win | `[mapPrefix, map]` |
| `persistence` | `reset`: the engine re-applies the base config every map. `sticky`: values carry over to the next map | Source re-runs `server.cfg` every map start (`reset`); id Tech 3 does not (`sticky`) |
| `realize` | How overrides take effect: `console` (sent when the live-state spec reports `mapStart`, `after` a target has run) or `generated` (written into each rotation entry). Planned: `files`, one config file per scope | CS:S over RCON; Quake 3 vstr rotation; CS2 `gamemode_<mode>_server.cfg` |

**Which settings can vary.** The `scopes` keyword on a setting or group lists the kinds it may vary by. When omitted, a setting may vary by every kind if its `apply` is `live`, `nextRound` or `nextMap`, and by none otherwise. `scopes: []` marks server-wide settings such as credentials, ports and the rotation itself.

**Overrides in a values document.** An `overrides` list beside `settings`; each entry has `when` (scope kinds and values, all of which must match) and a partial `settings` tree:

```yaml
overrides:
  - when: { mapPrefix: "aim_" }
    settings: { rules: { freezeTime: 0, roundTime: 1 } }
  - when: { map: aim_map }
    settings: { rules: { roundTime: 1.5 } }   # beats the prefix
```

The effective value for a map is the base value, then each matching override applied in order of its most specific kind, then the number of `when` keys, then file order.

**No leaks between maps.** With `reset`, every overridden setting must also be written to the base config, so the next map reverts it. With `sticky`, every map must set every overridden setting; Quake 3's generated rotation does this, so a `fraglimit 15` for q3dm17 is set back to 30 by the next entry. `gsc_check.py` enforces both rules, and validates every override's effective values against the schema.
