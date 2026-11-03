---
title: "Secrets"
sidebar_position: 3
---

# Secrets

A values document never holds a secret. Every `writeOnly` setting takes a **reference** instead, and the adapter resolves it in memory at apply time.

```yaml
settings:
  admin:
    rconPassword: { $secret: admin.rconPassword, generate: true }   # this server's own store
  network:
    steamToken: { $secret: "env:CSS_GSLT" }                       # resolved on the adapter host
raw:
  - { target: serverCfg, key: sm_auth_token, value: { $secret: raw.serverCfg.sm_auth_token } }
```

## References

| Form | Resolved from | Who resolves it |
| --- | --- | --- |
| `name` (no scheme) | The panel's store, in this server's own namespace | Every adapter, through the panel |
| `env:VAR` | An environment variable on the adapter host | Every adapter |
| `file:/path` | A file on the adapter host, such as a Docker or Kubernetes secret | Every adapter |
| `vault:…`, `op:…`, others | A panel plugin | Only panels that have the plugin; the checker warns |

- References may appear wherever a `writeOnly` setting's value does: settings, overrides, per-process settings, and raw entries. A reference on a readable setting is an error, because the UI would show it.
- `generate: true` creates the secret on first apply if the store has none. The value always satisfies the setting's schema: 24 letters and digits by default, which every format can hold without quoting. A definition can set `secret.generate` with `length` and `alphabet` when a game needs something else. The checker rejects a hint that breaks the setting's `maxLength` or `pattern`, such as 24 characters for Freelancer's 16-byte password field, or a quote where CS:S forbids one. Only the server's own store can generate.
- A clear-text secret in a values document is a warning, and so is a raw key whose name looks like a secret. An empty string still means "no password".

## Rules for adapters

1. **Resolve late, keep in memory.** Resolve just before writing; never write resolved values back to a values document.
1. **Redact everywhere.** Plans, logs, import reports, error messages, console transcripts and prompt echoes show `(secret)` or `***`, never the value. A failed round-trip check must not quote the line it failed on.
1. **Detect rotation by digest.** The applied-state record stores an HMAC of each secret, keyed per server, not the value and not a plain hash (a short password's plain hash can be brute-forced). When the store's value behind an unchanged reference no longer matches, the plan treats it as a change: for example, CS:S rewrites server.cfg and sends `rcon_password` over the console, with no restart.
1. **Store at rest with care.** The reference store is a mode-0600 JSON file. Real panels use their database, Vault, 1Password and so on.

## Importing

`--secret-store` moves every clear-text secret the importer finds into the store and writes a reference in its place. Raw keys that look like secrets get the same treatment. The import report lists them under `secretsStored`.

## Exposure

Once applied, a secret is only as private as the place the game reads it from. `gsc_secrets.py exposure <game>` derives this from the definition alone:

| Kind | Where | Found in |
| --- | --- | --- |
| `disk` | A config file. Panels should mask these files in their file manager; the tool lists them | 19 settings, most games |
| `processList` | Command-line arguments, visible to `ps` and container inspect | Valheim join password; CS:S and CS2 Steam tokens; CS2 and Factorio RCON passwords |
| `containerConfig` | Environment variables | Freelancer (container profile) |
| `network` | Sent over an unencrypted console (Source RCON, Quake 3 RCON, telnet), or over TLS | Minecraft, Palworld, CS:S, Quake 3, Tribes, 7 Days to Die; Satisfactory over TLS |
| `console` | Typed at a startup prompt that may echo it | Terraria |
| `adapter` | Used only by the adapter | Satisfactory API token, Arma 3 Workshop login |

## Permissions

Credentials stay `writeOnly` for every role. Setting a secret goes through the panel's store and leaves the values document unchanged. Pointing a reference somewhere else with a scheme is the separate action `editSecretRefs`. Otherwise `file:/etc/shadow` would copy a host file into a config file the customer can read. The example hosting policy denies it to customers; plain names inside the server's own namespace are allowed.
