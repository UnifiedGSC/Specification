---
title: "Design coverage"
sidebar_position: 1
---

# Design coverage

The format was grown one game at a time, each chosen because it breaks a naive design. These areas and their test games are the spec's test suite.

## Coverage areas

Each area lists the games that would break a naive design; together they form the spec's test suite. Game details are from memory and should be verified before they become official examples.

| Area | What the spec must support | Test cases |
| --- | --- | --- |
| 1. Structured values | Ordered lists of objects, repeated keys, formats nested inside formats | Arma 3 `class Missions` rotation; Squad map/layer rotation files; ARK `Game.ini` repeated keys; Palworld `OptionSettings=(...)` tuple in one INI key |
| 2. Write targets | Pluggable targets (file, CLI args, env, console/RCON, HTTP API, binary files, Windows registry); one setting may write to several | Valheim launch flags only; CS2 `+game_type`/`+game_mode` plus `.cfg` convars; Factorio's three JSON files; Satisfactory HTTPS API; Arma class syntax; Freelancer's 369-byte binary FLServer.cfg and registry EULA flag |
| 3. Apply lifecycle | Live, next map/round, restart, world creation only | CS2 `bot_quota` (live), `mp_maxrounds` (next round); Unreal max players (restart); Minecraft `level-seed`, Factorio map-gen, Valheim world modifiers (creation only) |
| 4. Scopes and overrides | Base config plus layers keyed by map or mode | CS2 `gamemode_competitive.cfg` + `_server.cfg`; SourceMod per-map configs; Squad layers |
| 5. Dynamic and composable schemas | Options sourced from installed content; schema fragments contributed by mods | CS2 `host_workshop_collection`; ARK and Arma mod IDs; Minecraft plugin YAML; Rust Oxide/uMod; SourceMod plugins |
| 6. Identity lists | First-class type for player IDs with roles: admins, whitelists, bans | Minecraft `ops.json`, `whitelist.json`; Arma admin UIDs; Squad `Admins.cfg` |
| 7. Secrets | Write-only fields, masked in UIs, never echoed back | RCON and server passwords; Steam GSLT; Brickadia server token |
| 8. Cross-field constraints | Rules spanning several settings | `bot_quota` not above max players; minimum team sizes per mode |
| 9. Round-tripping and ownership | Preserve comments and unmodeled keys; import existing configs; "write only while stopped" | ARK rewriting `GameUserSettings.ini` on shutdown |
| 10. Versioning and platforms | Game-version ranges per schema; renamed keys; per-OS file paths | Settings added or renamed across patches; Windows vs Linux config locations; Windows-only servers run under Wine (Freelancer), where files and the registry live inside a Wine prefix |
| 11. Ports | Defaults, purpose, protocol, derived offsets, conditional ports, exposure hints | See Ports below |

## Gaps to close

The twelve reference games (CS:S, Valheim, Quake 3, Freelancer, Starsiege: Tribes, Palworld, Satisfactory, Minecraft: Java Edition, Factorio, 7 Days to Die, Don't Starve Together, Terraria) and the ARK, CS2 and Arma 3 excerpts leave these untested or undefined. Each item names a game that would test it; tick it when a reference definition covers it.

**Coverage areas not yet tested**

- [x] **Config written as code.** Settings set as variables in the game's own scripting language. Test with Tribes 2 (TorqueScript `$Host::` variables) and Don't Starve Together (Lua mod overrides). Covered by Starsiege: Tribes (script variables in an overlay file) and Don't Starve Together (data-only Lua tables). Tribes 2 still needs a real ServerPrefs.cs.
- [x] **Scopes and overrides (area 4).** Settings layered per map or per mode. Covered by CS:S (per map and map prefix, applied over RCON) and Quake 3 (per game type and map, built into the rotation). CS2-style per-mode config files are designed but not yet in a reference definition.
- [x] **Formats nested inside formats (area 1).** Test with Palworld's `OptionSettings=(...)` tuple (now a reference game) and ARK's repeated keys with nested structs (a partial reference). Arma 3 class syntax is a whole-file format rather than a nested one and remains untested.
- [x] **HTTP API and environment variable targets (area 2).** Covered by Satisfactory (HTTPS API, tested against a mock built from its documentation) and Freelancer's LANCommander container profile (FL_* environment variables).
- [x] **JSON, XML and `.properties` writers (area 2).** Covered by Factorio (JSON), 7 Days to Die (XML) and Minecraft's `server.properties`.
- [x] **Content fetched at startup (area 5).** Workshop IDs and mod lists the server downloads, not just installed files. Covered by CS2 (the server fetches Workshop content itself) and Arma 3 (the agent fetches with SteamCMD), plus Factorio's mod portal (pinned versions, dependencies, checksums).
- [x] **Versioning (area 10).** Game-version ranges per definition, renamed settings, detecting the installed version. Covered by Minecraft (settings moved, renamed and removed, and a default changed, across 1.21.x and 26.3), version detection for Minecraft, CS:S and Factorio, and migrations for values documents written against older definitions.
- [x] **Importing existing configs (area 9).** A read path for every write path, including encodings that are hard to reverse (bitmasks, `each`, generated rotation blocks). Covered by a generic importer tested on Quake 3, Valheim and CS:S, including a round trip of a hand-written Quake 3 rotation.
- [x] **Multi-process servers.** Several processes sharing settings. Covered by Don't Starve Together (a master and a caves shard sharing cluster settings). Not yet covered: ARK-style clusters of independent servers that share a cluster ID and transfer data.
- [x] **GUI-only settings.** Settings with no file or command behind them. Decided: the spec models where a GUI stores its settings, answers startup prompts (Terraria), and turns in-game-only changes into manual tasks with instructions (Valheim modifiers on an existing world). Driving a GUI by clicking is deliberately out of scope.

**Parts of the spec not yet defined**

- [x] **Adapter behavior.** Plan-then-apply, write order across targets, and what happens when a console write fails. Defined: eight apply phases with a known end state for every failure, least-disruptive restarts, a deferred option when players are online, and an applied-state record. Planned for eight scenarios across seven games and tested with injected failures.
- [x] **Permissions.** Which settings a panel's end users may see or change, like eggs' `user_viewable` and `user_editable`. Defined: definitions mark settings with classes (most derived, only resource and security declared); a separate AccessPolicy gives roles hidden/view/writeOnly/confirm/edit per class or setting, limits that can only narrow, allowed actions, and panel-locked values. Tested with three roles across Minecraft, CS:S and Satisfactory.
- [x] **Raw passthrough.** An escape hatch for settings no definition models. Import reports already list these unmodeled keys and arguments. Defined: raw entries are write entries with a literal value, addressed like the target's modeled writes. Refused when they name a modeled setting, an alias or a denied command, or when a value could break out of its statement. The importer keeps unmodeled keys as raw, and promotion moves them into settings once a definition models them. Tested on seven games, including a lossless import round trip.
- [x] **Secret storage.** References to a secret store instead of secrets inside values documents. Imports currently bring secrets in as clear text and flag them. Defined: writeOnly settings take $secret references (the server's own store, env:, file:, or plugin schemes), resolved in memory at apply time, with schema-safe generation, keyed digests to detect rotation, and redaction rules for adapters. The importer moves secrets into a store, an exposure report shows where each secret ends up, and pointing a reference outside the store is a separate permission. All example values documents now use references.
- [x] **Distribution.** How definitions are published, identified, versioned and found by panels. Defined: definitions have a publisher/name id, a semantic version and a license. A diff tool works out the bump each change needs, and a capability review refuses unsafe paths and outside HTTP calls. Static registries carry a signed index with digests, matching an install uses Steam app IDs and marker files, and updates apply within the compatible range but always ask when capabilities grow. An example registry of all 15 definitions verifies.
- [ ] **Converters.** Import from Pterodactyl/Pelican eggs and AMP templates.
- [ ] **Live-state spec.** Draft v0.1 started in its own tab: the ServerState vocabulary with provenance, a shared protocol library (A2S, Minecraft SLP and query, Quake 3, Satisfactory), state sections for seven games, CloudEvents, scope-aware drift and player-data privacy, tested against mock servers. Open: pending changes, standard performance metrics, player actions, log rotation, transport, and more protocols.
- [ ] **v0.2 cleanup.** The 10 inconsistencies listed in the format reference tab.
