---
title: "Ports, paths and console"
sidebar_position: 5
---

# Ports, paths and console

**Port fields** (each port is keyed by a name, e.g. `game`, `rcon`)

| Field | Values | Example |
| --- | --- | --- |
| `purpose` | `game`, `query`, `rcon`, `api`, `voice`, `spectator`, `companion`, `content`, `outbound` | CS:S SourceTV = `spectator` |
| `protocol` | `tcp`, `udp`, `both` |  |
| `default` | port number | 27015 |
| `setting` | setting ID that controls it | `network.port` |
| `offset` | `{from: <port>, by: <n>}`; fixed, not configurable | Valheim query = game + 1 |
| `sameAs` | another port's name; same number, different protocol | CS:S RCON (TCP) on the game port |
| `when` | CEL; the port exists only when true | RCON only with a password |
| `exposure` | `public`, `private`, `none` | RCON = `private` |
| `inboundOptionalWhen` | CEL; inbound rules not required when true | Valheim with crossplay |
| `speaks` | protocol IDs | `steam-a2s`, `source-rcon`, `quake3-query` |

**Paths.** Each named path has `setting` (the override) and `default`, keyed by `linux`, `windows`, `macos` or `all`. Referenced as `{paths.<name>}`.

**Console.** Either `none` (no remote commands, so nothing applies live) or `{protocol, port, password}`, where `port` is a port name and `password` a setting ID. Protocols so far: `source-rcon`, `quake3-rcon`.

## Port model

Ports are descriptive metadata: the spec says what each port is for and its default, and the panel decides allocation and firewall rules.

| Field | Meaning | Example |
| --- | --- | --- |
| `purpose` | game, query, rcon, api, voice, spectator, companion, content | Rust 28082 = companion (Rust+) |
| `protocol` | tcp, udp or both | Source 27015 = udp game + tcp RCON |
| `default` | Default number, or none | Factorio RCON has no default |
| `offset` | Fixed offset from another port; not separately configurable | Valheim query = game + 1 |
| `setting` | Schema setting that controls this port, if any | Minecraft `rcon.port` |
| `when` | Condition under which the port exists | RCON port only when RCON is enabled |
| `exposure` | public or private hint | RCON and admin APIs = private |
| `protocolId` | Query or admin protocol spoken on the port | Steam A2S, Source RCON, Minecraft Server List Ping |

## Default ports by game

**Default ports by game** (approximate, from memory; verify before publishing)

| Game | Game traffic | Query | Admin | Other |
| --- | --- | --- | --- | --- |
| CS2 / Source | 27015 UDP | same port | 27015 TCP (RCON) | 27020 UDP (SourceTV) |
| Minecraft Java | 25565 TCP | 25565 UDP (when enabled) | 25575 TCP (RCON) |  |
| Minecraft Bedrock | 19132 UDP | same port |  | 19133 UDP (IPv6) |
| Valheim | 2456 UDP | 2457 UDP (game+1, fixed) |  |  |
| ARK: Survival Evolved | 7777 UDP | 27015 UDP | 27020 TCP (RCON) | 7778 UDP (game+1) |
| Rust | 28015 UDP |  | 28016 TCP (WebRCON) | 28082 TCP (Rust+ app) |
| Palworld | 8211 UDP | 27015 UDP | 25575 TCP (RCON) | 8212 TCP (REST API) |
| Arma 3 | 2302 UDP | 2303 UDP (game+1) |  | 2304–2306 UDP (Steam, BattlEye) |
| Factorio | 34197 UDP |  | RCON via flag, no default |  |
