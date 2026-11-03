---
title: "Freshness, cost and polling"
sidebar_position: 7
---

# Freshness, cost and polling

- **Intervals** come from the definition (`every`). Suggested defaults: queries 15 s, console polls 60 s; the log is followed continuously.
- **Back off when unreachable.** A failing source is recorded in `observed` with its error, and its fields are not invented. A process that is up but not answering is `starting`, not `running`.
- **Staleness:** a consumer compares `observed.<path>.at` with now; nothing is silently carried forward.
- **Console courtesy:** polls must declare `visibleToPlayers`. Commands that print to players, disable achievements (Factorio's `/c`), or flood the log are not used for polling.
- **Polling while players are absent** may stop with `autoPause`-style games; a paused session is reported, not treated as a failure.
