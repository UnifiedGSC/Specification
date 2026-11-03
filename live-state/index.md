---
title: "Live state spec"
sidebar_position: 1
slug: /
---

# Live state spec

:::caution Draft
This is draft 0.1, started after the config spec. Patterns marked `# verify` in the example definitions still need checking against real servers.
:::

Companion to the config spec: what a running server is doing right now, built on its setting IDs, port purposes and protocol IDs.

## Scope and principles

The config spec says what a server *should* be. This spec says what it *is* right now: up or down, ready or not, which map, who is playing, whether it is keeping up, and whether its live values still match what was applied.

- **Built on the config spec, not beside it.** State refers to setting IDs (drift), port names and their `speaks` protocol IDs (queries), the console definition (polls), `processes` (per-shard state) and the AccessPolicy (who sees player data). It lives in a `state:` section of the same game definition, versioned and reviewed with it.
- **Protocols once, games many times.** A shared protocol library maps each query protocol's fields to the vocabulary. Any game whose port `speaks: [steam-a2s]` gets players, map and version with no game-specific work. That is the long-tail win.
- **Read-only.** Collecting state never changes the server. Console polls must say whether players can see them, and they are listed in the capability review.
- **Every value says where it came from and when.** Sources disagree and go stale, so provenance is part of the data.
- **Out of scope:** acting on players (kick, ban, message), which belongs with identity lists and a later operations spec; metrics storage and dashboards; transport (WebSocket, SSE or webhooks all carry the same documents).
