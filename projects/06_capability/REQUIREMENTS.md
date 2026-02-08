# 06_capability — Requirements

## Purpose

Split the Mycelium data model into an explicit logical layer
and a capability layer. Produce two capabilities that bind
the same logical interface to different physical substrates.

## Context

Projects 01, 02, and 04 each implemented storage differently.
02 is closest to the canonical model (context/record on
filesystem). None of them share a common interface. The
three-layer insight from 05 (logical, capability, physical)
is the design: logical defines what exists, capability makes
it real, physical is the substrate.

## Requirements

### R1: Logical interface

Define the logical model as a TypeScript interface. It must
capture:

- Record: key → content (opaque bytes, as Buffer)
- Context: path, list of records
- Record has: key, type (file or context), size
- Operations: read context, read record, create record,
  delete record, list (flatten)
- The interface is substrate-independent — no filesystem
  paths, no JSON structure, no storage assumptions
- Content is always opaque bytes (Buffer)

### R2: Folder-based capability

Implement the logical interface using the filesystem directly:

- A context is a directory
- A record with content is a file
- A record without content is a subdirectory (a context)
- Keys are filenames within the containing directory
- Respects .gitignore-style exclusions (node_modules, .git,
  dist, etc.)

This is a clean rewrite of 02_mycelium's fs.ts, conforming
to the logical interface.

### R3: File-based capability

Implement the logical interface using a single JSON file as
the physical substrate:

- All contexts and records stored in one .json file
- Contexts are nested objects; records are entries with
  base64-encoded content
- The same logical operations work identically
- The file is the entire "filesystem" in miniature

This proves the logical layer is truly substrate-independent.

### R4: CLI

A single CLI (`mycelium`) that works with either capability:

- `--store folder` (default) or `--store file --file <path>`
  selects the capability
- Commands: ls, read, create, delete, flat
- Same output regardless of which capability backs it

### R5: Interop proof

A command or script that demonstrates round-trip:

- Create a structure using folder-based capability
- Export/import to file-based capability
- Read back and verify identical logical view

This is not a test framework — just a demonstration that the
logical layer is real.

## Quality Gates

- The logical interface exists as a standalone type file with
  no imports from either capability
- Both capabilities implement the same interface
- The CLI works identically with either store
- Content survives round-trip (bytes in = bytes out)
- Binary content (non-UTF-8) is handled correctly
