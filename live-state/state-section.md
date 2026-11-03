---
title: "The state section of a game definition"
sidebar_position: 4
---

# The state section of a game definition

```yaml
state:
  ready:                                   # when players can join
    any:
      - { query: steam-a2s }
      - { log: 'Connection to Steam servers successful' }
  queries:
    - { protocol: steam-a2s, port: game, every: 15s, requests: [info, players] }
  console:
    status:
      command: status
      every: 60s
      visibleToPlayers: false              # required: the review shows it
      parse:
        - line: '^map\s*:\s*(?<map>\S+)'
          into: { session.map: map }
        - line: '^#\s+(?<userid>\d+)\s+"(?<name>.*)"\s+(?<uniqueid>STEAM_\S+|BOT)\s+…'
          each: players.list
          fields: { name: name, ids.steam: uniqueid, ping: ping, address: address, bot: "uniqueid == 'BOT'" }
  logs:
    source: { file: "cstrike/logs/L*.log", newest: true }
    events:
      player.joined: '"(?<name>.+?)<\d+><(?<steam>[^>]*)><[^>]*>" entered the game'
      map.changed:   'Started map "(?<map>[^"]+)"'
  reports:                                 # settings the server reveals, for drift
    general.hostname:   { from: steam-a2s, field: info.name }
    general.maxPlayers: { from: steam-a2s, field: info.maxPlayers }
```

- `ready` lists conditions, and any one is enough: a log line, or a protocol answering.
- `queries` names a protocol from the library and a port that `speaks` it.
- `console` polls parse output line by line with named groups (ECMA-262, like everywhere in GSC). `into` sets single values, `each` builds a list, and `split` handles comma lists such as Minecraft's.
- `logs.events` maps standard event types to patterns. Captured `steam` or `uuid` groups become the player's `ids`.
- `reports` ties a setting to the field that reveals it.
- `perProcess: true` gives each process its own state (DST shards).

The checker refuses a reported setting that does not exist, a port that does not speak the protocol, console polls on a game with no console, a poll that does not say whether players see it, an unknown event type, and a regex that does not compile. It found four wrong setting names in the first drafts of these sections.

Written so far for CS:S, Minecraft, Quake 3, Valheim, Factorio, Don't Starve Together and Satisfactory, and published to the example registry as their next versions.
