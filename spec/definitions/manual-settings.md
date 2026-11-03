---
title: "GUI-only and manual settings"
sidebar_position: 9
---

# GUI-only and manual settings

The spec never drives a GUI. A setting that seems to live only in a window is handled one of three ways, and target types are a closed list, so a definition cannot add a click-automation target.

| The setting... | Model it as | Example |
| --- | --- | --- |
| is saved somewhere by the GUI | The storage: a file, binary layout, registry value or API | Freelancer's settings dialog writes a 369-byte file; Satisfactory's Server Manager has an HTTPS API |
| is asked for on the console at startup | A `prompts` target | Terraria started without a config file |
| can only be changed by a person in the game | A `manual` target: GSC writes exact instructions and tracks the change as pending until confirmed | Valheim world modifiers on a world that already exists |

**Prompts.** Each step expects a prompt and sends an answer: a setting's value, a literal (an empty seed means random), or, for a `menu`, the number of the entry whose name matches the setting. Steps can depend on earlier answers (`when: newWorld`). A prompt the definition does not know stops the start (`onUnexpected: stop`) rather than being answered blindly, and the transcript masks secret answers. A process the agent launched also offers `console: { protocol: stdin }` for commands once it is running.

**Manual tasks.** A write to a `manual` target can carry `when` (Valheim: only when the world already exists) and `instructions` filled in like any template, so an admin sees `setworldmodifier raids less` rather than a description. Where the game has no in-game path at all (Valheim's `setkey` does not work on dedicated servers), the definition says so in a comment and offers no manual task.

Why not automate the GUI: it needs a desktop session on the server, breaks when a window's layout changes, cannot be verified, and cannot run headless or in containers.
