# 06_capability — Evaluation

## What Was Built

The Mycelium logical/physical split. A `Capability` interface
defines five operations (readContext, readRecord, flatten,
createRecord, deleteRecord) with zero knowledge of storage.
Two capabilities implement it: folder-based (directories and
files) and file-based (single JSON file with base64 content).
A CLI works identically with either. A roundtrip command
copies folder → file and verifies byte-level fidelity,
including binary content.

## What We Learned

### 1. The logical layer is real

types.ts has no imports. It defines records, contexts, and
operations without any reference to how or where things are
stored. Both capabilities are interchangeable — same output,
same behavior, different substrates. The three-layer model
from 05 (logical, capability, physical) is now proven in code.

### 2. The interface is incomplete for mutable resources

The five operations handle immutable creation and reading, but
there is no writeRecord (overwrite). This surfaced when
asking: what would it take to track changes to files? The
answer: add write, then layer changelog on top.

### 3. The capability interface should split into immutable and mutable

Immutable (read, create, flatten) is the foundation. Mutable
extends it with write and delete. This isn't just a convenience
split — it reflects a real semantic difference. Immutable
operations can't destroy information. Mutable ones can. The
split makes this explicit at the type level.

### 4. Two modes of changelog causality

Change tracking has two directions:
- **Changelog → update**: append to the log, resource is
  derived (event sourcing). Immutability is primary.
- **Update → changelog**: edit the resource, log captures
  what happened (audit trail). Pragmatically necessary
  because external tools edit files directly.

Both produce the same artifacts (resource + changelog).
The difference is which is authoritative — a meaning
question, not a storage question.

### 5. The changelog is a record, not metadata

A changelog for `foo.txt` is `foo.txt.changelog` — a sibling
record in the same context. It's visible, readable, flattenable,
round-trippable. Not hidden in a side-channel. This means
change tracking doesn't require any new concepts — just a
naming convention and a wrapper that manages the append.

### 6. Delete behavior depends on observation point

Initial instinct: delete a mutable resource, delete its
changelog too. RDBMS counter: change tracking preserves
delete events. Resolution: both are right — it depends on
where the changelog is attached.

- **Changelog attached to the record**: they're a unit,
  die together. The history belongs to the record.
- **Changelog attached to the context ("table")**: persists
  beyond the record. The history belongs to the container.

Same mechanism, different placement in the containment
hierarchy, different behavior.

### 7. The table changelog is a cascading read

A context doesn't need its own separate changelog file. The
"table changelog" is a cascading read across all children's
changelogs — derived, not stored. This keeps the record as
the unit of change tracking. The context aggregates.

### 8. Delete is move-to-bin, not destruction

A context is a resource itself. It can contain a `bin/`
sub-context where deleted records reside (with their
changelogs intact). Delete moves, purge destroys. The bin
is not a feature or a flag — it's a context you either
create or don't. If the context has a bin, deleted records
go there. If it doesn't, delete is permanent.

The structure is the behavior. No configuration needed.

### 9. No new concepts required

Mutable resources, changelogs, bins, cascading views,
soft delete — none require new primitives. They're all
patterns built from record, context, and recursion. The
primitive is sufficient.

## Changes Outside This Project

None.

## Carry Forward

The logical/physical split works — proven with two
capabilities and byte-level round-trip. The interface needs
to split into immutable (foundation: read, create, flatten)
and mutable (extension: write, delete). Changelogs are
sibling records (`key.changelog`), with two causality modes
(log-first, resource-first). Table-level changelog is a
cascading read, not separate storage. Bin is a higher-level
data structure pattern on top of the core API, not embedded
in it. Delete behavior depends on context structure. All
patterns emerge from the existing primitive — no new concepts.
Next (07): immutable/mutable API split with changelog.
Then (08): natural language requirements/quality gates
evaluator.
