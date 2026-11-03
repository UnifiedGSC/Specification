---
title: "Content and ContentInventory"
sidebar_position: 7
---

# Content and ContentInventory

The game definition says how to find content; a ContentInventory records what a scan found. Discovery works through files when an agent has disk access, or through console commands when it only has RCON.

**`content` keys**

| Key | Holds |
| --- | --- |
| `roots` | Search directories, highest priority first; may use `{settings.*}` (Quake 3 `fs_game`) |
| `types.<name>.fields` | JSON Schema for one inventory item of this type |
| `types.<name>.discover` | List of discovery rules (below); results are merged by `id` |
| `types.<name>.metadata` | Extra fields read from files: `from`, `parser` (`q3-arena`), `match`, `fields`, `field` |
| `types.<name>.origin` | Globs marking `base` content; everything else is `addon` |
| `types.<name>.clientDownload` | CEL deciding whether players must download an item |
| `refresh` | `on` (`start`, `schedule`, `request`), `schedule` (ISO 8601 duration), `cache` (keys and hash) |
| `limits` | Caps for untrusted archives: `maxEntriesPerArchive`, `maxMetadataFileBytes` |

**Discovery rules**

| `via` | Fields | Example |
| --- | --- | --- |
| `files` | `kind` (`files`, `directories`, `archive`), `glob`, `entries` (inside archives), `id` template, `require`, `exclude` | `.bsp` entries inside Quake 3 `.pk3` files |
| `console` | `command`, `parse.line` (regex with named groups), `reflects: loaded` when the server only knows content indexed at startup | Quake 3 `fdir *.bsp` over RCON |

**ContentInventory document.** Header fields: `game`, `server` (the values document's `id`), `scannedAt`, `context` (settings the scan depended on, e.g. `fsGame`), and `scans` (one record per route with `via`, `completedAt` and counts). Then one array per content type. Every item records `discoveredBy` (`files`, `console` or both) and may set `loaded: false` when it is on disk but the running server has not indexed it.

**Fetched content.** Some content is not on disk until something downloads it. `content.sources` says where it comes from and who fetches it, and `kind: contentRef` settings hold the IDs to fetch.

| `fetchedBy` | Who downloads | What GSC does | Example |
| --- | --- | --- | --- |
| `server` | The game server, at startup | Writes the IDs; learns what arrived from the server's own listing, and marks items `requested` until it appears | CS2 `+host_workshop_collection`, checked with `ds_workshop_listmaps` |
| `agent` | The GSC agent or panel, before startup | Runs `fetch` (a tool such as SteamCMD, or an HTTP download with a `checksum`), then the `install` steps (`link`, `lowercase`, `copy`), then writes the IDs | Arma 3 mods via SteamCMD; Factorio mods via the mod portal |

Source keys: `kind` (`steam-workshop`, `http-catalog`), `appId`, `credentials` (a settings group, never written to the server), `resolve` (for catalogs: where releases, versions, game versions and dependencies are in the response), `fetch`, `install`, `limits`, `update` (`ifNewer`, `pinnedOrLatest`), `refreshOn`, `clientsFetch`, and `dependencies` with a `policy`:

- `requireListed`: report required items that are missing, and let the admin add them, because order and client or server side matter (Arma 3).
- `addRequired`: add required dependencies automatically and stop on incompatible ones (Factorio), since the game resolves load order itself.

An agent fetch stops before downloading anything when resolution fails, and discards a file whose checksum does not match. Items that install somewhere are referred to by `{installedAs}` in write templates.
