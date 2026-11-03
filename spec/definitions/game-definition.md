---
title: "GameDefinition"
sidebar_position: 1
---

# GameDefinition

One file per game describes everything a UI and an adapter need; only `game`, `targets` and `settings` are required.

| Key | Required | Holds | First used in |
| --- | --- | --- | --- |
| `game` | Yes | `id`, `name`, `engine`, optional `implementation`, `steam.appId` / `steam.dedicatedAppId`, match.files (install markers), `platforms` | All |
| `runtime` | No | Per host OS: `native`, or `wine` with `prefix`, `user` and `components` | Freelancer |
| `paths` | No | Named directories with per-platform defaults and an overriding setting | Valheim |
| `ports` | No | Descriptive port metadata (see Ports) | CS:S |
| `console` | No | How to send commands to a running server, or `none` | CS:S, Valheim |
| `layouts` | No | Byte-level structs for binary files and registry binary values | Freelancer |
| `targets` | Yes | Where values are written: args, files, registry, console, generated blocks | CS:S |
| `content` | No | Content types, discovery rules, refresh and limits | Quake 3 |
| `settings` | Yes | A JSON Schema with GSC keywords; top-level properties are UI groups | CS:S |
| `rules` | No | Cross-field CEL rules with messages and severity | CS:S |
| `functions` | No | Named lookups usable in rules and filters | Quake 3 |
| `scopes` | No | Scope kinds, precedence, persistence and how overrides are realized (see Scopes and overrides) | CS:S, Quake 3 |
| `profiles` | No | Ways to deploy the game (native, a container image), each with a title; default names the one used when a values document picks none | Freelancer |
| `definition` | No | This file's own version and migrations for older values documents (see Versioning). Also its registry identity: id (publisher/name), license, authors, and status: partial (see Distribution). Game versions live in game.versions | Minecraft |
| `import` | No | precedence: targets in the order the game applies them, so the last one wins when they disagree (see Importing) | Quake 3, CS:S, Valheim |
| `processes` / `processDefaults` | No | Process roles, counts and start order, and role-dependent defaults (see Multi-process servers) | Don't Starve Together |
| `raw` | No | aliases (other names for modeled settings) and deny (names no raw entry may set); a target may say raw: false (see Raw passthrough) | CS:S, Quake 3 |
