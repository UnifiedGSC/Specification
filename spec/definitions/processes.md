---
title: "Multi-process servers"
sidebar_position: 8
---

# Multi-process servers

Some servers are several processes that share settings: a Don't Starve Together cluster is an overworld shard and one or more cave shards, each started separately with its own ports and `server.ini`, sharing one `cluster.ini`. A values document then has cluster `settings` and a `processes` list, each with an `id`, a `role`, a `host` and its own `settings`.

| Key | Holds | Example |
| --- | --- | --- |
| `processes.roles` | Roles with a `count` (`min`, `max`) | DST: exactly one `master`, any number of `secondary` |
| `processes.startOrder` | Roles in the order they start | Master first; shards connect to it |
| `processes.idPattern` | What a process ID may look like; it also names the shard's folder | `^[A-Za-z0-9_]+$` |
| `perProcess` (group) | Settings with one value per process | DST `shard` ports, `world` preset |
| `perProcess` (target, port) | One copy per process, with `{process.id}` in paths | `server.ini`, `worldgenoverride.lua` |
| `processRole` (port) | Only processes with this role open the port | DST shard link on the master |
| `processDefaults.<role>` | Defaults that depend on the role | DST caves: ports 10999, 12346, 10166 and preset `DST_CAVE` |
| `derivedFrom` (setting) | A CEL expression over `processes`; filled in by the adapter, never typed | DST `master_ip`: loopback when every shard shares a host |
| `scope: install` (target) | One file shared by every server on the install | DST `dedicated_server_mods_setup.lua` |

A cluster setting written to a per-process target goes into every copy, which is how DST's mods stay identical on every shard. Target `ensure` entries can use `{process.id}`, `{process.isMaster}` and `{process.number}`. Restart scope follows from the targets a change touches: a per-process file restarts that process, a shared file restarts all of them, and an install-wide file affects other servers only at their next start. The checker enforces role counts, rejects cluster settings placed under a process (and the reverse), validates each process's effective values, and finds port clashes between processes on one host.

**Lua data files.** `lua-table` writes `return { ... }` files with an optional `header`, and the reader accepts only literals, so a file containing code is rejected rather than run.
