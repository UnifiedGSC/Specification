---
title: "Privacy and permissions"
sidebar_position: 9
---

# Privacy and permissions

Player identities (`ids`), addresses and chat are personal data. The AccessPolicy gains a `state` entry per role:

```yaml
customer: { state: { personal: view } }     # their own players
viewer:   { state: { personal: hidden } }   # names and counts only
```

With `hidden`, player entries lose `ids` and `address`, chat events are dropped, and other events lose their `ids`. A test caught a `player.left` event that still carried a Steam ID outside `ids` for a viewer; events now always put identities under `ids`. Counts, names, scores and pings stay visible: they are what a public server browser shows anyway.
