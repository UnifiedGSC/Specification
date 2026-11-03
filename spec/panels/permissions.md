---
title: "Permissions"
sidebar_position: 1
---

# Permissions

Who may see and change a setting is decided in two places. The game definition states facts about each setting, its **classes**. A separate **AccessPolicy** document, written by a panel or hosting provider, says what each role may do with each class. The same Minecraft definition then serves a host's "Standard plan" and a self-hosted admin's own policy without change.

## Setting classes

Most classes come from what the definition already says. Only two are written by hand.

| Class | Comes from | Example |
| --- | --- | --- |
| `credential` | `writeOnly: true` | RCON password, Steam token |
| `infrastructure` | a port's or path's `setting` | game port, query port |
| `identity` | `kind: identityList` | bans, ops, whitelist |
| `content` | `kind: contentRef` | Workshop items, mods |
| `destructive` | `apply: worldCreate` | seed, hardcore |
| `derived` | `derivedFrom` | DST cluster counts |
| `resource` | declared in `classes` | max players, view distance, bot count |
| `security` | declared in `classes` | Minecraft online-mode, enabling RCON, Satisfactory's localhost bypass |

The checker rejects unknown class names, and rejects a derived class written by hand, so the two can never disagree.

## AccessPolicy documents

```yaml
spec: gsc/v0.1
kind: AccessPolicy
id: example-host-standard-plan
roles:
  customer:
    settings:
      default: edit
      byClass:
        infrastructure: view
        security: view
        credential: writeOnly
        destructive: confirm
      limits:
        minecraft-java:
          general.maxPlayers: { maximum: 16 }
      bySetting:
        counter-strike-source:
          content.downloadUrl: hidden
    actions:
      restart: allow
      restartWithPlayersOnline: confirm
      import: deny
      editProcesses: deny
  viewer:
    settings: { default: view, byClass: { credential: hidden } }
    actions: { all: deny }
  operator:
    overrideLocks: true
    settings: { default: edit }
    actions: { all: allow }
```

- **Access levels**, least to most: `hidden`, `view`, `writeOnly`, `confirm`, `edit`.
- **Resolving a setting:** its `bySetting` entry if there is one; otherwise the most restrictive `byClass` rule among its classes; otherwise the role's `default`.
- **Fixed ceilings:** a credential is never above `writeOnly`, for any role, so no one reads a secret back. A derived setting is never above `view`.
- **Limits** are JSON Schema keywords (`maximum`, `minimum`, `maxLength`, `maxItems`, `enum`) keyed by game id and setting. They may only narrow the definition. A policy whose limit widens it, or names a setting or class that does not exist, is rejected.
- **Actions** are allow, confirm, or deny: `restart`, `restartWithPlayersOnline`, `recreate`, `deferredApply`, `import`, `confirmManualTask`, `editOverrides`, `editProcesses`. `all` sets the default; an action left out is denied.
- **Locked values:** a values document may lock settings the panel allocates, with `locked: { network.port: { by: panel, reason: allocated } }`. Only a role with `overrideLocks` can change them.
- **Pterodactyl/Pelican eggs** map directly: `user_viewable: false` becomes `hidden`, `user_editable: false` becomes `view`.

## Enforcement

A policy is applied in three places, and all three must agree:

1. **UI.** The panel renders the role's **effective schema**: the definition's settings schema with hidden settings removed, `readOnly`, `writeOnly` and `x-gsc-confirm` marked, and limits merged in. Any JSON Schema form library can render it.
1. **API.** The server side checks every change against the policy before saving, because a UI can be bypassed.
1. **Apply plan.** The planner checks the actions the plan needs. A restart with players online goes to the role's `restartWithPlayersOnline` rule.

The reference checker (`gsc_access.py`) returns each change as allowed, needing confirmation, or denied with a reason, such as `general.maxPlayers: 30 is greater than the maximum of 16 (plan limit for customer)` or `network.port: view only for customer (classes: infrastructure)`.

Out of scope: how users and roles are assigned, which belongs to the panel, and multi-tenant isolation between servers.
