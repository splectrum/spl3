# 04_changelog — Evaluation

## What Was Built

A CLI tool that applies changes to files while recording
each change as an immutable entry in a changelog. Three
commands: apply, append, log. Changelog stored as
`.changelog/<filename>/` — an append-only folder of
timestamped JSON entries. Zero runtime dependencies.

## What We Learned

### 1. Content is opaque bytes in practice

Carried forward from 01 but now implemented. Content
is Buffer internally. Storage uses an encoding field —
utf-8 for text (human-readable), base64 for binary.
The store doesn't interpret content; encoding is a
transport concern, not a meaning concern.

### 2. A timestamped changelog replaces a daily log

With fine-grained change entries and timestamps, there's
no separate need for a daily log. Any temporal view
(daily, weekly, per-session) can be derived from the
changelog. One immutable list serves many views.

### 3. Mutable resources gain immutable history

The file is mutable derived state. The changelog is
immutable history. This is Mycelium's core pattern
applied to any file — not just files we create, but
any mutable resource we want to track.

### 4. The changelog is not yet a true Mycelium artefact

Currently the changelog is tied to the file it tracks
(`.changelog/<filename>/` lives next to the file). The
intent is for changelogs to be independent artefacts
that reference resources, not companions bound to them.
This is a step toward that, not the destination.

### 5. Requirements should be written before building

This project's requirements were written retroactively.
The TDC cycle (intent → gates → build → verify) works
better when requirements come first — they're the gates
that guide the build. Going forward: write requirements
before code.

### 6. A changelog file is a list incarnation

A single file where each line is a record (key, value)
is the same Mycelium primitive as a folder where each
file is a record. Same logical model, different physical
substrate. The changelog doesn't need its own folder of
JSON files — it's just an append-only flat file.

### 7. Two physical substrates now exist — time to split

We now have folder-based lists (02) and file-based lists
(04). The 01 evaluation said: "Refactor into explicit
logical/physical separation only when a second substrate
demands it." That moment has arrived. The logical API
(ls, read, create, delete) is the same; the physical
incarnation differs.

## Changes Outside This Project

- None. All changes contained within this project.

## Carry Forward

Change tracking of mutable resources via immutable logs.
Content as opaque bytes with encoding field. Requirements
before code going forward. Next step (05): split the
Mycelium API into logical and physical layers, with
folder-based and file-based as the first two physical
implementations.
