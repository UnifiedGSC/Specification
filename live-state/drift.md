---
title: "Drift and pending changes"
sidebar_position: 8
---

# Drift and pending changes

Drift is a setting whose reported value differs from what was applied. The collector decodes the reported text with the same rules the importer uses (booleans, encode maps, numbers), then compares it with the applied values in the **current scope**. Overrides for the current map or mode apply first, so per-map values are not mistaken for drift.

```yaml
settings:
  reported: { match.fragLimit: 30 }
  drift:
    - { setting: match.fragLimit, applied: 15, reported: 30, scope: { map: q3dm17, mode: 0 } }
```

In tests:

- A CS:S server renamed from the console showed `general.hostname` and `general.maxPlayers` drifting.
- Quake 3 on `q3dm17` reported a frag limit of 15, which matched the map's override, so no drift.
- The same server reporting 30 was drift, with the scope it was checked in.

Secrets are never compared. Drift is a prompt, not an action: the panel can re-apply, or import the server's values as the new desired state.

Pending changes, applied but waiting for a restart (Satisfactory reports these itself), come from the applied-state record and the API. Not wired yet.
