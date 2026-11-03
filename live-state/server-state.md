---
title: "The ServerState document"
sidebar_position: 2
---

# The ServerState document

```yaml
spec: gsc-state/v0.1
kind: ServerState
server: lan-dust2
definition: gsc-examples/counter-strike-source@0.1.1
observedAt: 2026-11-02T20:17:30Z
lifecycle: { status: running, ready: true, pid: 4242, since: 2026-11-02T20:09:50Z }
game:      { version: 7929086, folder: cstrike }
session:   { name: "Friday Night Dust2 | 24/7", map: de_dust2, passwordProtected: false, tags: "friendlyfire,increased_maxplayers" }
players:
  online: 2
  max: 20
  bots: 1
  list:
    - { name: Alice, ids: { steam: "STEAM_0:1:11111" }, score: 14, ping: 45, connectedSeconds: 312, address: 192.168.1.10 }
settings:
  reported: { general.hostname: "Friday Night Dust2 | 24/7", general.maxPlayers: 20 }
  drift: []
observed:
  players.list: { source: steam-a2s+console.status+log, at: 2026-11-02T20:17:30Z }
  session.map:  { source: steam-a2s, at: 2026-11-02T20:17:30Z }
```

| Section | Holds | Comes from |
| --- | --- | --- |
| `lifecycle` | `status` (stopped, starting, running, stopping, crashed), `ready`, pid, since, exit code | The process supervisor, plus the definition's ready signal |
| `game` | Installed version, protocol, description | Queries; the config spec's version detection |
| `session` | Advertised name, map or world, mode, password flag, tags, paused, progress | Queries, console, log |
| `players` | online, max, bots, and a list with name, `ids` (steam, uuid…), score, ping, connected time, address, team, bot | Merged across sources by name; identities from the console or log |
| `performance` | Named metrics such as tickRate or ticks behind | Console, log, API |
| `settings` | `reported` values for settings the server reveals, and `drift` against what was applied | See Drift |
| `content` | Loaded maps and mods as the server reports them | The config spec's content inventory |
| `observed` | Source and time for every path, and errors per source | The collector |

A status of `starting` means the process is up but the ready signal has not been seen. `crashed` means it exited with a non-zero code that nobody requested.
