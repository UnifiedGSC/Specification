---
title: "Status and open questions"
sidebar_position: 11
---

# Status and open questions

**Tested** (`state_tests.py`, mock servers over real sockets):

- CS:S: A2S with the challenge handshake, `status`, and logs merged into one player list; events for viewer and customer.
- CS:S drift after a console rename.
- Minecraft: the server list ping (chat-component MOTD), `list uuids`, and the log with its ready line and "can't keep up" warning.
- Quake 3: getstatus, with scope-aware drift.
- Valheim: A2S on the query port, with identities joined from the log.
- DST: per-shard state.
- Lifecycle: crashed, stopped and starting.

**Open questions**

- Pending changes: a shared shape for "applied, waits for restart".
- Performance metrics: a small standard set (tick rate, target, ticks behind, memory) or free-form names per game.
- Actions on players (kick, ban, message): a separate operations spec, or verbs on identity lists?
- Log rotation and multiple log files (CS:S writes one per map).
- A transport recommendation (WebSocket vs SSE vs webhooks), and snapshot plus event replay after a reconnect.
- More protocols: GameSpy (Tribes, older titles), Unreal 2 query, Factorio's matchmaking API, and EOS for newer Unreal games.
- Patterns marked `# verify` need checking against real servers, ideally captured from your LANCommander images.
