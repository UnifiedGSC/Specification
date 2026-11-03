---
title: "Events"
sidebar_position: 6
---

# Events

Events use the CloudEvents 1.0 envelope, an existing standard that brokers, webhooks and serverless platforms already understand:

```json
{"specversion": "1.0", "id": "9d608fc2-…", "type": "org.gsc.player.joined",
 "source": "gsc://lan-dust2", "subject": "Alice", "time": "2026-11-02T20:10:04Z",
 "datacontenttype": "application/json", "gscprivacy": "personal",
 "data": {"name": "Alice", "ids": {"steam": "STEAM_0:1:11111"}}}
```

- **Types:** `server.ready`, `server.crashed`, `server.warning`, `player.connecting`, `player.joined`, `player.left`, `players.count`, `chat`, `map.changed`, `world.saved`. Drift and lifecycle changes are emitted by the collector, not matched in logs.
- **Source:** `gsc://<server>`, plus `/<process>` for per-process state.
- **`gscprivacy: personal`** (a CloudEvents extension attribute) marks events carrying identities, addresses or chat, so a broker can route or drop them without parsing `data`.
- **Joining sources:** when a game logs the connection and the character separately (Valheim logs a Steam ID, then a character name), the collector joins them. A later leave by Steam ID still names the player.
