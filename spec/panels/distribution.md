---
title: "Distribution"
sidebar_position: 2
---

# Distribution

Definitions travel like packages. A panel can trust and update them without a central server, because a registry is a static directory any web host or git repository can serve.

## Identity

```yaml
definition:
  id: gsc-examples/counter-strike-source   # publisher/name; never changes
  version: 0.1.0                           # semantic version of this file
  license: CC0-1.0                         # required to publish
  authors: [GSC draft examples]
  status: partial                          # optional: covers one feature, not the whole game
game:
  id: counter-strike-source                # the game; several definitions may cover it
  steam: { appId: 240, dedicatedAppId: 232330 }
  match:
    files: [cstrike/gameinfo.txt, [srcds_run, srcds.exe]]   # each must exist; a nested list means any one
```

`game.id` names the game and `definition.id` names one publisher's take on it. Vanilla Minecraft and a Paper definition share a `game.id` and differ in `definition.id` and `implementation`. Values documents record `definitionId` and `definitionVersion`. The checker refuses a values document checked against a different definition.

A permissive license such as CC0 is recommended: definitions are data, and panels need to ship them.

## Versions

`gsc_dist.py diff` reads two versions and works out the bump the change needs:

| Change | Needs |
| --- | --- |
| Setting or target removed; type changed; option removed; range, length or pattern narrowed; setting renamed (and it must ship a migration) | Major |
| Setting, target, option or port added; range widened; default changed; `writeOnly` or `classes` changed | Minor |
| Writes, apply timing, wording or UI hints changed | Patch |
| `game.id` or `definition.id` changed | Not allowed: publish a new definition |

Before 1.0.0, each level moves down one, as in Cargo and npm: breaking changes bump the minor, everything else the patch. The diff also says what existing servers will notice. A changed default changes servers that leave the setting unset on their next apply. A changed write rewrites files. A changed class changes access under existing policies.

## Capabilities

A definition is data, but it decides which files get written, which commands get sent and which hosts get contacted. Before installing or updating one, a panel reviews its capabilities: files and directories, outside hosts, tools such as steamcmd, console commands, registry keys, environment variables, and where credentials are sent. Some definitions are refused outright:

- **A path that escapes:** `..`, or an absolute path not rooted at `{installDir}`, a declared `paths` entry, `{cacheDir}` or `{dataDir}`. Default directories in `paths` (Valheim's `~/.config/...`) are listed for review.
- **An HTTP target that calls anything but the game server** (`{host}`). Outside services belong in content sources, where the host is listed for review.

Credentials sent to outside services are listed for the admin. Examples are Factorio's token going to mods.factorio.com and Arma 3's Steam login going to steamcmd.

## Registries

```
<registry>/<publisher>/<name>/<version>/<name>.game.yaml   immutable once published
<registry>/<publisher>/<name>/<version>/YANKED             optional: why it was pulled
<registry>/index.yaml                                      kind: DefinitionIndex
<registry>/index.yaml.sig                                  ed25519 signature, with a key id
```

Publishing checks the definition with the checker, refuses unsafe capabilities, diffs it against the previous version to enforce the bump, refuses to overwrite a published version, and rebuilds the index.

Each index entry carries its file's SHA-256, its license, its match keys (Steam app IDs, files, implementation), the game versions it supports, and its capabilities. A panel can then review a definition before downloading it.

Panels list registries with trusted publisher keys. They verify the index signature (Ed25519, the algorithm minisign and SSH signatures use) and every file's digest before use.

Fragments for mods and plugins (SourceMod, CPMA) are published the same way, and their `extends` names the game.

## Finding and updating

- **Matching an install.** A Steam app ID from `steamapps/appmanifest_*.acf` scores highest. Install marker files confirm a match, or identify the game where there is no Steam ID (Minecraft's `server.jar`). If markers are missing, a definition without a Steam match is ruled out. Partial definitions rank lower.
- **Updates.** Versions within the compatible range (`^current`, so 0.1.x for 0.1.0) apply automatically, and each is re-planned like any other change. A newer major needs the admin, and the checker runs the migrations as part of it: Minecraft's 1.x documents rename `whiteList` on the way to 2.0.0. Yanked versions are skipped and flagged for servers already on them. An update that gains capabilities always needs the admin, even a patch: a 0.1.2 that adds a map mirror host and the `say` command is offered automatically but flagged.
