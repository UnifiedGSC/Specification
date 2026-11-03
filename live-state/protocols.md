---
title: "Protocol library"
sidebar_position: 5
---

# Protocol library

`protocols.state.yaml` (kind: ProtocolLibrary) has one entry per protocol ID used in `ports.*.speaks`. Each entry gives the transport, the requests (including handshakes such as A2S's challenge), a field map onto the vocabulary, and known limits. Adapters implement the wire format once per protocol.

| Protocol | Fields it gives | Limits |
| --- | --- | --- |
| `steam-a2s` | Name, map, description, counts, bots, password, version, keywords; players with score and time | Challenge on INFO and PLAYER since 2020; the app ID field is 16 bits (the full one is in the extra data); no player IDs |
| `minecraft-slp` | Version, protocol, counts, MOTD (flattened from chat components), a sample of players with UUIDs | The sample is capped and can be hidden or faked |
| `minecraft-query` | Name, map, counts, version, full player names, plugins | Off unless `enable-query` |
| `quake3-query` | Every server cvar in the info string, plus players with score and ping | Names carry colour codes; cvars make drift cheap |
| `satisfactory-https-api` | Session, counts, tier, tick rate, paused, running | Authenticated |

The reference collector implements the first three at the wire level and tests them against mock servers that speak the real formats, including the A2S challenge. It caught a byte-offset mistake in the mock that a pure parser test would have missed.
