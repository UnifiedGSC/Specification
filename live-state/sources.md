---
title: "Where state comes from"
sidebar_position: 3
---

# Where state comes from

| Source | Gives | Cost and limits | Example |
| --- | --- | --- | --- |
| Query protocol | Name, map, counts, version, often a player list | Cheap, unauthenticated, works from outside; no identities in A2S | A2S, Minecraft SLP, Quake 3 getstatus |
| Console poll | Identities, pings, addresses, anything the game prints | Needs the console; some commands are seen by players or flood logs | CS:S `status`, Minecraft `list uuids`, Factorio `/players online` |
| Log | Events as they happen; the player list between polls; ready and crash signals | Needs file or stdout access; formats change between versions | CS:S logs, Valheim stdout, DST server_log.txt |
| HTTP API | Rich, structured state | Game-specific; authenticated | Satisfactory QueryServerState |
| Process | Running, pid, exit code, CPU and memory | Always available to the panel | Every game |

Sources are merged in a fixed order: queries, then console polls, then the log. A later source fills in fields and identities the earlier ones lack, and never overwrites them. The player list merges by name: for CS:S, A2S gives scores and connected time, `status` adds Steam IDs, pings and addresses, and the log keeps the list current between polls.
