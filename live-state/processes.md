---
title: "Multi-process servers"
sidebar_position: 10
---

# Multi-process servers

With `state.perProcess: true`, each process gets its own ServerState (`process: Master`, `process: Caves`), its own log, its own ready signal and its own event source (`gsc://dst-lan/Caves`). The server's state is the union: it is running when its start-order roots are ready, and its players are the union of every shard's. In DST, moving between shards shows as a leave on one and a join on the other, so a player list built per shard and then merged stays correct.
