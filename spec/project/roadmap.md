---
title: "Roadmap and open questions"
sidebar_position: 2
---

# Roadmap and open questions

## To resolve before v0.2

The three example files grew the format one game at a time, so they disagree in places.

- [ ] **Content sources.** CS:S and Valheim use a top-level `sources` block (`optionsFrom: installedMaps`); Quake 3 uses `content.types` (`optionsFrom: content.maps`). Migrate both to `content`, and fold Valheim's `legacy` world rule into its `discover` list.
- [ ] **`cvar` vs `arg`.** Quake 3's `cvar` could be `arg` plus the target's `style: q3`. Keep one.
- [ ] **Template syntax.** Quake 3's rotation `entry` uses an ad hoc conditional (`{gametype? ...}`). Pick a defined syntax, or allow only plain substitution.
- [ ] **Vocabulary registration.** GSC keywords (`apply`, `write`, `arenaType` inside `oneOf`) are unprefixed. Publish a JSON Schema vocabulary and meta-schema so strict validators accept them, or prefix them.
- [ ] **`apply` vs `storedIn`.** Valheim modifiers carry both `worldCreate` and `storedIn: world`. Decide whether one implies the other.
- [ ] **Leaf objects.** Valheim `modifiers` is an object that carries `write` itself, so its sub-properties have no `apply`. Define how sub-properties inherit.
- [ ] **Player IDs.** Define one shared identity item type with per-game ID formats (`steamid2`, platform-prefixed IDs, IP/CIDR).
- [ ] **Console shape.** `console: none` is a string while other games use an object. Consider `console: { protocol: none }`.
- [ ] **Read-back.** Only Quake 3 bans define `read`. Generalize it so the live-state spec can report drift for any setting.
- [ ] **Generated vs embedded targets.** Quake 3's rotation is a `generated` target inside server.cfg; Palworld's settings are an `embedded` target inside an INI key. Merge them into one embedded type.
- [ ] **Argument joining.** Freelancer uses `joined: true` on a write (/p2302); Palworld and Satisfactory use `style: equals` on the target (-Port=7777). Pick one mechanism.
- [ ] **Preservation flags.** preserveUnknownFields (embedded), preserveUnknownKeys (json), preserveUnknownElements and preserveComments (xml) say the same thing. Replace them with one field, or make preservation the default.
- [ ] **Console write fields.** Console writes use key (cvar), var (script global), statement (Tribes) and command (Minecraft). Decide which of these are distinct.
- [ ] **Fixed arguments.** Quake 3 uses fixed plus fixedPosition; 7 Days to Die uses fixed plus fixedEnd. Keep one.
- [ ] **Unset values.** When the admin has not set a value, decide whether GSC writes the definition's default or leaves the key alone so the game's own default applies. Writing pins today's default across game updates; leaving it alone conflicts with scopes, which need every overridden setting written in the base config.
- [ ] **Dotted INI keys.** Done: Valheim's BepInEx example now uses `section` instead of General.AllowMetals.
- [ ] **Migrate the example files** and rerun `gsc_check.py` once these are settled.

## Open questions

- [ ] Which coverage areas are required for v1, and which can wait?
- [ ] Cross-field constraints: is JSON Schema enough, or do we need a small rule syntax?
- [ ] Custom formats (Arma class syntax, Palworld tuples): built-in parsers, or a plugin interface for adapters?
- [ ] Identity lists: one generic type, or per-purpose types (admins, bans, whitelist)?
- [ ] Which game should be the first fully worked reference schema?
