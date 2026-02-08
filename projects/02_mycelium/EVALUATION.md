# 02_mycelium — Evaluation

## What Was Built

A CLI tool that treats the filesystem as-is as contexts and
records. No proprietary storage, no init. Five commands:
ls, read, flat, create, delete. Zero runtime dependencies.

## What We Confirmed

### 1. The primitive is sufficient

Five operations (ls, read, flat, create, delete) cover basic
repo operations. Update is delete + create. Move is delete +
create across contexts. No new primitives needed.

### 2. Key is logical, path is physical

What the CLI calls "path" is logically a key. The path is
just how that key resolves on the filesystem substrate. The
distinction matters — same logical model could resolve keys
differently on another substrate.

### 3. Logical layer is less data-rich than physical

read on a context returns keys, not full contents. You
navigate into a context to go deeper. This isn't a gap —
it's the correct relationship between logical and physical.
The logical layer provides just enough to operate.

### 4. Compound operations emerge from primitives

Update and move don't need dedicated commands. They're
patterns composed from create and delete. The interface
is minimal and complete.

### 5. The interface is buildable-on

This is a foundation. The five operations plus the
context/record model give us enough to build the next
layer on top of.

## The Interface

| Command | Operation |
|---|---|
| ls <key> | List records in a context |
| read <key> | Read a record's content |
| flat <key> | Flatten a context recursively |
| create <key> [content] | Create a record or context |
| delete <key> | Remove a record |

## Carry Forward

The logical model: contexts contain keyed records, records
can be contexts. Five operations. Hardcoded on filesystem.
Ready for the next layer.
