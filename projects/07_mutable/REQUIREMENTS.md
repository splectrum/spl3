# 07_mutable — Requirements

## Purpose

Split the capability interface into immutable and mutable,
add changelog tracking to mutable records. The core API
stays minimal — higher-level structures (bin, soft delete)
are built on top later, not embedded here.

## Context

06 proved the logical/physical split with two capabilities.
The interface has five operations but no distinction between
immutable and mutable use. Discussion revealed: changelogs
are sibling records, the table-level changelog is a cascading
read — not separate storage. Bin-based soft delete is a
data structure pattern composed from these primitives, not
a core API concern.

## Requirements

### R1: Immutable capability interface

The foundation. Operations that cannot destroy information:

- `readContext(path)` — list immediate records
- `readRecord(path)` — read content as opaque bytes
- `flatten(path)` — list all file records recursively
- `createRecord(path, content?)` — create file or context

This is the base interface. No delete, no overwrite.

### R2: Mutable capability interface

Extends immutable with operations that can change or
remove information:

- `writeRecord(path, content)` — overwrite a record's content
- `deleteRecord(path)` — remove a record (or context)

Delete is permanent. Delete of a tracked record removes
both the record and its changelog. Higher-level structures
(bin, soft delete) can be composed from these primitives
by a layer above.

### R3: Changelog as sibling record

A mutable record's changelog is `{key}.changelog` — a
sibling record in the same context. It is:

- Append-only (each entry is a timestamped line)
- Created on first creation or write of the record
- Visible in readContext, flatten, roundtrip
- Deleted together with its record

Changelog entry format: timestamp, operation, and a
content fingerprint (first 8 chars of SHA-256). Not the
full content — that's the record's job.

### R4: Two causality modes

The tracked wrapper supports two modes, configured at
construction:

- **Log-first**: append to changelog, then write the
  resource. The changelog is the source of truth. The
  resource file is a materialized view.
- **Resource-first**: write the resource, then append to
  changelog. The resource is the source of truth. The
  changelog is an audit trail.

Both modes produce the same artifacts. Default is
resource-first. Mode persistence (storing which mode a
context uses) is deferred to when API access runs through
contexts, where it becomes a record in the context.

### R5: Cascading changelog read

Reading the changelog at the context level is a cascading
read across all children's changelogs. No separate
context-level changelog file. The context aggregates.

Provide an operation and CLI command that reads the
aggregated changelog for a context — all entries from all
child records, sorted by timestamp.

### R6: Both capabilities

Implement for both folder-based and file-based capabilities
from 06. The immutable/mutable split and changelog must
work identically on both substrates.

### R7: CLI

Extend the CLI from 06:

- All existing commands continue to work
- `write <path> <content>` — overwrite record, tracked
- `log <path>` — show changelog for a record
- `log <context-path>` — show aggregated changelog
- `--mode log-first|resource-first` — select causality mode

## Quality Gates

- Immutable interface has no delete or write operations
- Mutable interface extends immutable, adds write and delete
- Changelog is created automatically on first tracked write
- Changelog survives roundtrip between capabilities
- Delete removes both record and its changelog
- Cascading changelog read aggregates across children
- Binary content with changelog works correctly
- Both capabilities pass identical behavior
